<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Cache;

class EmailSetting extends Model
{
    protected $fillable = [
        'email_type',
        'name',
        'description',
        'category',
        'customer_enabled',
        'seller_enabled',
        'admin_enabled',
        'sms_enabled',
        'is_critical',
    ];

    protected function casts(): array
    {
        return [
            'customer_enabled' => 'boolean',
            'seller_enabled' => 'boolean',
            'admin_enabled' => 'boolean',
            'sms_enabled' => 'boolean',
            'is_critical' => 'boolean',
        ];
    }

    protected static function booted(): void
    {
        static::saved(function () {
            Cache::forget('email_settings');
        });
    }

    public function notificationPreferences(): HasMany
    {
        return $this->hasMany(NotificationPreference::class, 'email_type', 'email_type');
    }

    public static function getAllCached(): array
    {
        return Cache::rememberForever('email_settings', function () {
            return self::all()->keyBy('email_type')->toArray();
        });
    }

    public static function getSetting(string $emailType): ?self
    {
        $settings = self::getAllCached();

        return isset($settings[$emailType]) ? new self($settings[$emailType]) : null;
    }

    public static function isEnabled(string $emailType, string $recipientType = 'customer'): bool
    {
        $setting = self::getSetting($emailType);

        if (! $setting) {
            return true;
        }

        return match ($recipientType) {
            'customer' => $setting->customer_enabled,
            'seller' => $setting->seller_enabled,
            'admin' => $setting->admin_enabled,
            default => true,
        };
    }

    public static function isSmsEnabled(string $emailType): bool
    {
        $setting = self::getSetting($emailType);

        return $setting?->sms_enabled ?? false;
    }

    public static function isCritical(string $emailType): bool
    {
        $setting = self::getSetting($emailType);

        return $setting?->is_critical ?? false;
    }

    public function scopeCategory($query, string $category)
    {
        return $query->where('category', $category);
    }

    public function scopeCritical($query)
    {
        return $query->where('is_critical', true);
    }
}
