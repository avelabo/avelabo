<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class ImportDataSource extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'base_url',
        'category_listing_url',
        'category_search_url',
        'product_listing_url',
        'product_by_category_url',
        'auth_type',
        'auth_credentials',
        'default_currency_id',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'auth_credentials' => 'encrypted:array',
            'is_active' => 'boolean',
        ];
    }

    protected static function boot(): void
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->slug)) {
                $model->slug = Str::slug($model->name);
            }
        });
    }

    public function defaultCurrency(): BelongsTo
    {
        return $this->belongsTo(Currency::class, 'default_currency_id');
    }

    public function importTasks(): HasMany
    {
        return $this->hasMany(ImportTask::class, 'data_source_id');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Get the full URL for category listing
     */
    public function getCategoryListingFullUrl(): string
    {
        return rtrim($this->base_url, '/').'/'.ltrim($this->category_listing_url, '/');
    }

    /**
     * Get the full URL for products by category
     */
    public function getProductsByCategoryUrl(int $categoryId): string
    {
        $url = rtrim($this->base_url, '/').'/'.ltrim($this->product_by_category_url, '/');

        return str_replace('{category_id}', (string) $categoryId, $url);
    }

    /**
     * Get the full URL for product listing
     */
    public function getProductListingFullUrl(): ?string
    {
        if (! $this->product_listing_url) {
            return null;
        }

        return rtrim($this->base_url, '/').'/'.ltrim($this->product_listing_url, '/');
    }
}
