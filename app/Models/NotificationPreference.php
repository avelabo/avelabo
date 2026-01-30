<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NotificationPreference extends Model
{
    protected $fillable = [
        'user_id',
        'email_type',
        'email_enabled',
        'sms_enabled',
    ];

    protected function casts(): array
    {
        return [
            'email_enabled' => 'boolean',
            'sms_enabled' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function emailSetting(): BelongsTo
    {
        return $this->belongsTo(EmailSetting::class, 'email_type', 'email_type');
    }

    public static function getUserPreference(int $userId, string $emailType): ?self
    {
        return self::where('user_id', $userId)
            ->where('email_type', $emailType)
            ->first();
    }

    public static function isEmailEnabledForUser(int $userId, string $emailType): bool
    {
        $preference = self::getUserPreference($userId, $emailType);

        return $preference?->email_enabled ?? true;
    }

    public static function isSmsEnabledForUser(int $userId, string $emailType): bool
    {
        $preference = self::getUserPreference($userId, $emailType);

        return $preference?->sms_enabled ?? true;
    }
}
