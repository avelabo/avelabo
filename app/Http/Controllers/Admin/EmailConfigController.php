<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class EmailConfigController extends Controller
{
    private array $sensitiveFields = [
        'smtp_password',
        'mailgun_secret',
        'postmark_token',
        'resend_api_key',
        'ses_key',
        'ses_secret',
    ];

    public function index(): Response
    {
        $settings = Setting::where('group', 'email_config')->get()->keyBy('key');

        $config = [
            'mail_provider' => $settings->get('mail_provider')?->value ?? 'log',
            'mail_from_address' => $settings->get('mail_from_address')?->value ?? config('mail.from.address'),
            'mail_from_name' => $settings->get('mail_from_name')?->value ?? config('mail.from.name'),
            'mail_reply_to_address' => $settings->get('mail_reply_to_address')?->value ?? '',
            // SMTP
            'smtp_host' => $settings->get('smtp_host')?->value ?? '',
            'smtp_port' => $settings->get('smtp_port')?->value ?? 587,
            'smtp_username' => $settings->get('smtp_username')?->value ?? '',
            'smtp_password' => $settings->get('smtp_password') ? '********' : '',
            'smtp_encryption' => $settings->get('smtp_encryption')?->value ?? 'tls',
            // Mailgun
            'mailgun_domain' => $settings->get('mailgun_domain')?->value ?? '',
            'mailgun_secret' => $settings->get('mailgun_secret') ? '********' : '',
            'mailgun_endpoint' => $settings->get('mailgun_endpoint')?->value ?? 'api.mailgun.net',
            // Postmark
            'postmark_token' => $settings->get('postmark_token') ? '********' : '',
            // Resend
            'resend_api_key' => $settings->get('resend_api_key') ? '********' : '',
            // SES
            'ses_key' => $settings->get('ses_key') ? '********' : '',
            'ses_secret' => $settings->get('ses_secret') ? '********' : '',
            'ses_region' => $settings->get('ses_region')?->value ?? 'us-east-1',
        ];

        return Inertia::render('Admin/EmailConfig/Index', [
            'config' => $config,
            'providers' => [
                'log' => 'Log (Development)',
                'smtp' => 'SMTP',
                'mailgun' => 'Mailgun',
                'postmark' => 'Postmark',
                'resend' => 'Resend',
                'ses' => 'Amazon SES',
            ],
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'mail_provider' => ['required', 'string', 'in:log,smtp,mailgun,postmark,resend,ses'],
            'mail_from_address' => ['required', 'email'],
            'mail_from_name' => ['required', 'string', 'max:255'],
            'mail_reply_to_address' => ['nullable', 'email'],
            // SMTP
            'smtp_host' => ['nullable', 'string', 'max:255'],
            'smtp_port' => ['nullable', 'integer', 'min:1', 'max:65535'],
            'smtp_username' => ['nullable', 'string', 'max:255'],
            'smtp_password' => ['nullable', 'string'],
            'smtp_encryption' => ['nullable', 'string', 'in:tls,ssl,none'],
            // Mailgun
            'mailgun_domain' => ['nullable', 'string', 'max:255'],
            'mailgun_secret' => ['nullable', 'string'],
            'mailgun_endpoint' => ['nullable', 'string', 'in:api.mailgun.net,api.eu.mailgun.net'],
            // Postmark
            'postmark_token' => ['nullable', 'string'],
            // Resend
            'resend_api_key' => ['nullable', 'string'],
            // SES
            'ses_key' => ['nullable', 'string'],
            'ses_secret' => ['nullable', 'string'],
            'ses_region' => ['nullable', 'string', 'max:50'],
        ]);

        foreach ($validated as $key => $value) {
            // Skip if sensitive field has placeholder value
            if (in_array($key, $this->sensitiveFields) && $value === '********') {
                continue;
            }

            // Skip null or empty values for optional fields
            if ($value === null || $value === '') {
                continue;
            }

            $type = 'string';
            if (str_contains($key, '_port')) {
                $type = 'integer';
            }

            // Encrypt sensitive fields
            if (in_array($key, $this->sensitiveFields) && $value) {
                $value = Crypt::encryptString($value);
            }

            Setting::set($key, $value, $type, 'email_config');
        }

        // Clear config cache to apply new settings
        Artisan::call('config:clear');

        return redirect()->back()->with('success', 'Email configuration updated successfully.');
    }

    public function testConnection(Request $request): RedirectResponse
    {
        $request->validate([
            'test_email' => ['required', 'email'],
        ]);

        try {
            // Apply current config from database
            $this->applyMailConfig();

            Mail::raw('This is a test email from Avelabo to verify your email configuration is working correctly.', function ($message) use ($request) {
                $message->to($request->test_email)
                    ->subject('Avelabo Email Configuration Test');
            });

            return redirect()->back()->with('success', 'Test email sent successfully! Please check your inbox.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to send test email: '.$e->getMessage());
        }
    }

    private function applyMailConfig(): void
    {
        $settings = Setting::where('group', 'email_config')->get()->keyBy('key');

        $provider = $settings->get('mail_provider')?->value ?? 'log';

        Config::set('mail.default', $provider);
        Config::set('mail.from.address', $settings->get('mail_from_address')?->value ?? config('mail.from.address'));
        Config::set('mail.from.name', $settings->get('mail_from_name')?->value ?? config('mail.from.name'));

        if ($replyTo = $settings->get('mail_reply_to_address')?->value) {
            Config::set('mail.reply_to.address', $replyTo);
        }

        match ($provider) {
            'smtp' => $this->configureSmtp($settings),
            'mailgun' => $this->configureMailgun($settings),
            'postmark' => $this->configurePostmark($settings),
            'resend' => $this->configureResend($settings),
            'ses' => $this->configureSes($settings),
            default => null,
        };
    }

    private function configureSmtp($settings): void
    {
        Config::set('mail.mailers.smtp.host', $settings->get('smtp_host')?->value);
        Config::set('mail.mailers.smtp.port', $settings->get('smtp_port')?->value ?? 587);
        Config::set('mail.mailers.smtp.username', $settings->get('smtp_username')?->value);

        $password = $settings->get('smtp_password')?->getRawOriginal('value');
        if ($password) {
            Config::set('mail.mailers.smtp.password', Crypt::decryptString($password));
        }

        $encryption = $settings->get('smtp_encryption')?->value;
        Config::set('mail.mailers.smtp.encryption', $encryption === 'none' ? null : $encryption);
    }

    private function configureMailgun($settings): void
    {
        Config::set('services.mailgun.domain', $settings->get('mailgun_domain')?->value);
        Config::set('services.mailgun.endpoint', $settings->get('mailgun_endpoint')?->value ?? 'api.mailgun.net');

        $secret = $settings->get('mailgun_secret')?->getRawOriginal('value');
        if ($secret) {
            Config::set('services.mailgun.secret', Crypt::decryptString($secret));
        }
    }

    private function configurePostmark($settings): void
    {
        $token = $settings->get('postmark_token')?->getRawOriginal('value');
        if ($token) {
            Config::set('services.postmark.key', Crypt::decryptString($token));
        }
    }

    private function configureResend($settings): void
    {
        $apiKey = $settings->get('resend_api_key')?->getRawOriginal('value');
        if ($apiKey) {
            Config::set('services.resend.key', Crypt::decryptString($apiKey));
        }
    }

    private function configureSes($settings): void
    {
        Config::set('services.ses.region', $settings->get('ses_region')?->value ?? 'us-east-1');

        $key = $settings->get('ses_key')?->getRawOriginal('value');
        if ($key) {
            Config::set('services.ses.key', Crypt::decryptString($key));
        }

        $secret = $settings->get('ses_secret')?->getRawOriginal('value');
        if ($secret) {
            Config::set('services.ses.secret', Crypt::decryptString($secret));
        }
    }
}
