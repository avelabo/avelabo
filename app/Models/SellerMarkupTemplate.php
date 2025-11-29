<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SellerMarkupTemplate extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'currency_id',
        'is_default',
        'is_active',
    ];

    protected $casts = [
        'is_default' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function currency(): BelongsTo
    {
        return $this->belongsTo(Currency::class);
    }

    public function ranges(): HasMany
    {
        return $this->hasMany(SellerMarkupTemplateRange::class);
    }

    public function sellers(): HasMany
    {
        return $this->hasMany(Seller::class, 'markup_template_id');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public static function getDefault(): ?self
    {
        return static::where('is_default', true)->first();
    }

    public function getMarkupForPrice(float $price): float
    {
        $range = $this->ranges()
            ->where('min_price', '<=', $price)
            ->where('max_price', '>=', $price)
            ->first();

        return $range?->markup_amount ?? 0;
    }
}
