<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingsController extends Controller
{
    public function index()
    {
        $settings = Setting::all()->keyBy('key')->map(function ($setting) {
            return [
                'value' => $setting->value,
                'type' => $setting->type,
                'group' => $setting->group,
            ];
        });

        return Inertia::render('Admin/Settings/Index', [
            'settings' => $settings,
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'settings' => 'required|array',
            'settings.*.key' => 'required|string',
            'settings.*.value' => 'nullable',
        ]);

        foreach ($validated['settings'] as $setting) {
            $type = $this->getTypeForKey($setting['key']);
            $value = $setting['value'] ?? '';

            // Handle boolean values
            if ($type === 'boolean') {
                $value = filter_var($value, FILTER_VALIDATE_BOOLEAN) ? '1' : '0';
            }

            Setting::updateOrCreate(
                ['key' => $setting['key']],
                [
                    'value' => $value,
                    'type' => $type,
                    'group' => $this->getGroupForKey($setting['key']),
                    'is_public' => $this->isPublicKey($setting['key']),
                ]
            );
        }

        return back()->with('success', 'Settings updated successfully.');
    }

    private function getTypeForKey(string $key): string
    {
        $booleanKeys = [
            'coming_soon_enabled',
            'maintenance_mode_enabled',
        ];

        if (in_array($key, $booleanKeys)) {
            return 'boolean';
        }

        return 'string';
    }

    private function getGroupForKey(string $key): string
    {
        $groups = [
            'site_' => 'general',
            'social_' => 'social',
            'newsletter_' => 'newsletter',
            'footer_' => 'footer',
            'copyright_' => 'footer',
            'app_' => 'apps',
            'coming_soon_' => 'maintenance',
            'maintenance_' => 'maintenance',
        ];

        foreach ($groups as $prefix => $group) {
            if (str_starts_with($key, $prefix)) {
                return $group;
            }
        }

        return 'general';
    }

    private function isPublicKey(string $key): bool
    {
        $privateKeys = ['admin_', 'api_', 'secret_'];

        foreach ($privateKeys as $prefix) {
            if (str_starts_with($key, $prefix)) {
                return false;
            }
        }

        return true;
    }
}
