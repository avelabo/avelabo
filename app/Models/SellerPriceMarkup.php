<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * CRITICAL: This model stores per-seller markup configuration.
 * Markups are INVISIBLE to customers - they only see the final price.
 */
class SellerPriceMarkup extends Model
{
    use HasFactory;

    protected $fillable = [
        'seller_id',
        'min_price',
        'max_price',
        'markup_amount',
        'currency_id',
        'is_active',
    ];

    protected $casts = [
        'min_price' => 'decimal:2',
        'max_price' => 'decimal:2',
        'markup_amount' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    public function seller(): BelongsTo
    {
        return $this->belongsTo(Seller::class);
    }

    public function currency(): BelongsTo
    {
        return $this->belongsTo(Currency::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function containsPrice(float $price): bool
    {
        return $price >= $this->min_price && $price <= $this->max_price;
    }
}
