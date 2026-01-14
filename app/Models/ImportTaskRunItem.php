<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ImportTaskRunItem extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'import_task_run_id',
        'source_id',
        'source_data',
        'item_type',
        'local_id',
        'status',
        'error_message',
        'created_at',
    ];

    protected function casts(): array
    {
        return [
            'source_data' => 'array',
            'local_id' => 'integer',
            'created_at' => 'datetime',
        ];
    }

    protected static function boot(): void
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->created_at)) {
                $model->created_at = now();
            }
        });
    }

    public function run(): BelongsTo
    {
        return $this->belongsTo(ImportTaskRun::class, 'import_task_run_id');
    }

    public function scopeCreated($query)
    {
        return $query->where('status', 'created');
    }

    public function scopeUpdated($query)
    {
        return $query->where('status', 'updated');
    }

    public function scopeSkipped($query)
    {
        return $query->where('status', 'skipped');
    }

    public function scopeFailed($query)
    {
        return $query->where('status', 'failed');
    }

    public function scopeOfType($query, string $type)
    {
        return $query->where('item_type', $type);
    }

    public function isCreated(): bool
    {
        return $this->status === 'created';
    }

    public function isUpdated(): bool
    {
        return $this->status === 'updated';
    }

    public function isSkipped(): bool
    {
        return $this->status === 'skipped';
    }

    public function isFailed(): bool
    {
        return $this->status === 'failed';
    }
}
