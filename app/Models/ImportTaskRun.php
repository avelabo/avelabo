<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ImportTaskRun extends Model
{
    protected $fillable = [
        'import_task_id',
        'status',
        'started_at',
        'completed_at',
        'total_items',
        'processed_items',
        'created_items',
        'updated_items',
        'skipped_items',
        'failed_items',
        'error_message',
    ];

    protected function casts(): array
    {
        return [
            'started_at' => 'datetime',
            'completed_at' => 'datetime',
            'total_items' => 'integer',
            'processed_items' => 'integer',
            'created_items' => 'integer',
            'updated_items' => 'integer',
            'skipped_items' => 'integer',
            'failed_items' => 'integer',
        ];
    }

    public function task(): BelongsTo
    {
        return $this->belongsTo(ImportTask::class, 'import_task_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(ImportTaskRunItem::class, 'import_task_run_id');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeRunning($query)
    {
        return $query->where('status', 'running');
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    public function scopeFailed($query)
    {
        return $query->where('status', 'failed');
    }

    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    public function isRunning(): bool
    {
        return $this->status === 'running';
    }

    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }

    public function isFailed(): bool
    {
        return $this->status === 'failed';
    }

    public function isCancelled(): bool
    {
        return $this->status === 'cancelled';
    }

    /**
     * Mark the run as started
     */
    public function markAsRunning(): void
    {
        $this->update([
            'status' => 'running',
            'started_at' => now(),
        ]);
    }

    /**
     * Mark the run as completed
     */
    public function markAsCompleted(): void
    {
        $this->update([
            'status' => 'completed',
            'completed_at' => now(),
        ]);
    }

    /**
     * Mark the run as failed
     */
    public function markAsFailed(string $errorMessage): void
    {
        $this->update([
            'status' => 'failed',
            'completed_at' => now(),
            'error_message' => $errorMessage,
        ]);
    }

    /**
     * Get progress percentage
     */
    public function getProgressPercentageAttribute(): int
    {
        if ($this->total_items === 0) {
            return 0;
        }

        return (int) round(($this->processed_items / $this->total_items) * 100);
    }

    /**
     * Get duration in seconds
     */
    public function getDurationAttribute(): ?int
    {
        if (! $this->started_at) {
            return null;
        }
        $end = $this->completed_at ?? now();

        return $this->started_at->diffInSeconds($end);
    }
}
