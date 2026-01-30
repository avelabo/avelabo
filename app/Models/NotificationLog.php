<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NotificationLog extends Model
{
    protected $fillable = [
        'email_type',
        'channel',
        'recipient_type',
        'user_id',
        'recipient_email',
        'recipient_phone',
        'notification_class',
        'notification_data',
        'status',
        'error_message',
        'error_trace',
        'attempts',
        'max_attempts',
        'sent_at',
        'failed_at',
        'last_attempt_at',
    ];

    protected function casts(): array
    {
        return [
            'notification_data' => 'array',
            'sent_at' => 'datetime',
            'failed_at' => 'datetime',
            'last_attempt_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeSent($query)
    {
        return $query->where('status', 'sent');
    }

    public function scopeFailed($query)
    {
        return $query->where('status', 'failed');
    }

    public function scopeRetryable($query)
    {
        return $query->where('status', 'failed')
            ->whereColumn('attempts', '<', 'max_attempts');
    }

    public function scopeChannel($query, string $channel)
    {
        return $query->where('channel', $channel);
    }

    public function scopeEmailType($query, string $emailType)
    {
        return $query->where('email_type', $emailType);
    }

    public function canRetry(): bool
    {
        return $this->status === 'failed' && $this->attempts < $this->max_attempts;
    }

    public function markAsSent(): void
    {
        $this->update([
            'status' => 'sent',
            'sent_at' => now(),
            'last_attempt_at' => now(),
            'attempts' => $this->attempts + 1,
        ]);
    }

    public function markAsFailed(string $errorMessage, ?string $errorTrace = null): void
    {
        $this->update([
            'status' => 'failed',
            'error_message' => $errorMessage,
            'error_trace' => $errorTrace,
            'failed_at' => now(),
            'last_attempt_at' => now(),
            'attempts' => $this->attempts + 1,
        ]);
    }

    public function resetForRetry(): void
    {
        $this->update([
            'status' => 'pending',
            'error_message' => null,
            'error_trace' => null,
        ]);
    }
}
