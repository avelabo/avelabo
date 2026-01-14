<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class ImportTask extends Model
{
    protected $fillable = [
        'name',
        'data_source_id',
        'seller_id',
        'import_type',
        'source_category_id',
        'source_category_name',
        'target_category_id',
        'run_in_background',
        'settings',
        'is_active',
        'last_run_at',
    ];

    protected function casts(): array
    {
        return [
            'source_category_id' => 'integer',
            'run_in_background' => 'boolean',
            'settings' => 'array',
            'is_active' => 'boolean',
            'last_run_at' => 'datetime',
        ];
    }

    public function dataSource(): BelongsTo
    {
        return $this->belongsTo(ImportDataSource::class, 'data_source_id');
    }

    public function seller(): BelongsTo
    {
        return $this->belongsTo(Seller::class);
    }

    public function targetCategory(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'target_category_id');
    }

    public function runs(): HasMany
    {
        return $this->hasMany(ImportTaskRun::class, 'import_task_id');
    }

    public function latestRun(): HasOne
    {
        return $this->hasOne(ImportTaskRun::class, 'import_task_id')->latestOfMany();
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeCategories($query)
    {
        return $query->where('import_type', 'categories');
    }

    public function scopeProducts($query)
    {
        return $query->where('import_type', 'products');
    }

    public function isForCategories(): bool
    {
        return $this->import_type === 'categories';
    }

    public function isForProducts(): bool
    {
        return $this->import_type === 'products';
    }

    /**
     * Get the total runs count
     */
    public function getTotalRunsAttribute(): int
    {
        return $this->runs()->count();
    }

    /**
     * Get the successful runs count
     */
    public function getSuccessfulRunsAttribute(): int
    {
        return $this->runs()->where('status', 'completed')->count();
    }
}
