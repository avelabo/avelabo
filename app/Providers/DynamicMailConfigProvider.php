<?php

namespace App\Providers;

use App\Models\Setting;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;

class DynamicMailConfigProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // Only apply if the settings table exists (prevents errors during migrations)
        if (! Schema::hasTable('settings')) {
            return;
        }

        try {
            $settings = Setting::where('group', 'email_config')->get()->keyBy('key');

            if ($settings->isEmpty()) {
                return;
            }

            $provider = $settings->get('mail_provider')?->value;

            if (! $provider) {
                return;
            }

            Config::set('mail.default', $provider);

            if ($fromAddress = $settings->get('mail_from_address')?->value) {
                Config::set('mail.from.address', $fromAddress);
            }

            if ($fromName = $settings->get('mail_from_name')?->value) {
                Config::set('mail.from.name', $fromName);
            }

            if ($replyTo = $settings->get('mail_reply_to_address')?->value) {
                Config::set('mail.reply_to.address', $replyTo);
                Config::set('mail.reply_to.name', $fromName ?? config('mail.from.name'));
            }

            match ($provider) {
                'smtp' => $this->configureSmtp($settings),
                'mailgun' => $this->configureMailgun($settings),
                'postmark' => $this->configurePostmark($settings),
                'resend' => $this->configureResend($settings),
                'ses' => $this->configureSes($settings),
                default => null,
            };
        } catch (\Exception $e) {
            // Silently fail if database is not available (e.g., during migrations)
            report($e);
        }
    }

    private function configureSmtp($settings): void
    {
        if ($host = $settings->get('smtp_host')?->value) {
            Config::set('mail.mailers.smtp.host', $host);
        }

        if ($port = $settings->get('smtp_port')?->value) {
            Config::set('mail.mailers.smtp.port', $port);
        }

        if ($username = $settings->get('smtp_username')?->value) {
            Config::set('mail.mailers.smtp.username', $username);
        }

        $password = $settings->get('smtp_password')?->getRawOriginal('value');
        if ($password) {
            try {
                Config::set('mail.mailers.smtp.password', Crypt::decryptString($password));
            } catch (\Exception $e) {
                // Password might not be encrypted (legacy data)
                Config::set('mail.mailers.smtp.password', $password);
            }
        }

        $encryption = $settings->get('smtp_encryption')?->value;
        if ($encryption) {
            Config::set('mail.mailers.smtp.encryption', $encryption === 'none' ? null : $encryption);
        }
    }

    private function configureMailgun($settings): void
    {
        if ($domain = $settings->get('mailgun_domain')?->value) {
            Config::set('services.mailgun.domain', $domain);
        }

        if ($endpoint = $settings->get('mailgun_endpoint')?->value) {
            Config::set('services.mailgun.endpoint', $endpoint);
        }

        $secret = $settings->get('mailgun_secret')?->getRawOriginal('value');
        if ($secret) {
            try {
                Config::set('services.mailgun.secret', Crypt::decryptString($secret));
            } catch (\Exception $e) {
                Config::set('services.mailgun.secret', $secret);
            }
        }
    }

    private function configurePostmark($settings): void
    {
        $token = $settings->get('postmark_token')?->getRawOriginal('value');
        if ($token) {
            try {
                Config::set('services.postmark.token', Crypt::decryptString($token));
            } catch (\Exception $e) {
                Config::set('services.postmark.token', $token);
            }
        }
    }

    private function configureResend($settings): void
    {
        $apiKey = $settings->get('resend_api_key')?->getRawOriginal('value');
        if ($apiKey) {
            try {
                Config::set('services.resend.key', Crypt::decryptString($apiKey));
            } catch (\Exception $e) {
                Config::set('services.resend.key', $apiKey);
            }
        }
    }

    private function configureSes($settings): void
    {
        if ($region = $settings->get('ses_region')?->value) {
            Config::set('services.ses.region', $region);
        }

        $key = $settings->get('ses_key')?->getRawOriginal('value');
        if ($key) {
            try {
                Config::set('services.ses.key', Crypt::decryptString($key));
            } catch (\Exception $e) {
                Config::set('services.ses.key', $key);
            }
        }

        $secret = $settings->get('ses_secret')?->getRawOriginal('value');
        if ($secret) {
            try {
                Config::set('services.ses.secret', Crypt::decryptString($secret));
            } catch (\Exception $e) {
                Config::set('services.ses.secret', $secret);
            }
        }
    }
}
