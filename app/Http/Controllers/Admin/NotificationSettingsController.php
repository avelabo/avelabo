<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\EmailSetting;
use App\Models\Setting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NotificationSettingsController extends Controller
{
    public function index(): Response
    {
        $emailSettings = EmailSetting::orderBy('category')
            ->orderBy('name')
            ->get()
            ->groupBy('category');

        $globalSettings = [
            'email_queue_enabled' => Setting::get('email_queue_enabled', false),
            'sms_provider' => Setting::get('sms_provider', 'null'),
            'mail_provider' => Setting::get('mail_provider', 'log'),
        ];

        return Inertia::render('Admin/NotificationSettings/Index', [
            'emailSettings' => $emailSettings,
            'globalSettings' => $globalSettings,
            'categories' => [
                'customer' => 'Customer Emails',
                'seller' => 'Seller Emails',
                'admin' => 'Admin Alerts',
            ],
            'mailProviders' => [
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
            'settings' => ['required', 'array'],
            'settings.*.id' => ['required', 'exists:email_settings,id'],
            'settings.*.customer_enabled' => ['boolean'],
            'settings.*.seller_enabled' => ['boolean'],
            'settings.*.admin_enabled' => ['boolean'],
            'settings.*.sms_enabled' => ['boolean'],
        ]);

        foreach ($validated['settings'] as $settingData) {
            EmailSetting::where('id', $settingData['id'])->update([
                'customer_enabled' => $settingData['customer_enabled'] ?? false,
                'seller_enabled' => $settingData['seller_enabled'] ?? false,
                'admin_enabled' => $settingData['admin_enabled'] ?? false,
                'sms_enabled' => $settingData['sms_enabled'] ?? false,
            ]);
        }

        return redirect()->back()->with('success', 'Notification settings updated successfully.');
    }

    public function updateGlobal(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'email_queue_enabled' => ['boolean'],
            'sms_provider' => ['string', 'in:null,tnm,airtel'],
            'mail_provider' => ['string', 'in:log,smtp,mailgun,postmark,resend,ses'],
        ]);

        if (isset($validated['email_queue_enabled'])) {
            Setting::set('email_queue_enabled', $validated['email_queue_enabled'], 'boolean', 'email');
        }

        if (isset($validated['sms_provider'])) {
            Setting::set('sms_provider', $validated['sms_provider'], 'string', 'email');
        }

        if (isset($validated['mail_provider'])) {
            Setting::set('mail_provider', $validated['mail_provider'], 'string', 'email_config');
        }

        return redirect()->back()->with('success', 'Global notification settings updated successfully.');
    }

    public function toggle(EmailSetting $emailSetting, Request $request): RedirectResponse
    {
        $field = $request->input('field');

        if (! in_array($field, ['customer_enabled', 'seller_enabled', 'admin_enabled', 'sms_enabled'])) {
            return redirect()->back()->with('error', 'Invalid field.');
        }

        $emailSetting->update([
            $field => ! $emailSetting->{$field},
        ]);

        return redirect()->back()->with('success', 'Setting updated successfully.');
    }
}
