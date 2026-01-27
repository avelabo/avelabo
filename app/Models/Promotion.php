<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Promotion extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'type',
        'seller_id',
        'discount_type',
        'discount_value',
        'scope_type',
        'scope_id',
        'start_date',
        'end_date',
        'priority',
        'is_active',
    ];

    protected $casts = [
        'discount_value' => 'decimal:2',
        'priority' => 'integer',
        'is_active' => 'boolean',
        'start_date' => 'datetime',
        'end_date' => 'datetime',
    ];

    public function seller(): BelongsTo
    {
        return $this->belongsTo(Seller::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true)
            ->where('start_date', '<=', now())
            ->where('end_date', '>=', now());
    }

    public function scopeSeller($query)
    {
        return $query->where('type', 'seller');
    }

    public function scopeSystem($query)
    {
        return $query->where('type', 'system');
    }

    public function appliesToProduct(Product $product): bool
    {
        if ($this->type === 'seller' && $this->seller_id !== $product->seller_id) {
            return false;
        }

        return match ($this->scope_type) {
            'all' => true,
            'category' => $product->category_id === (int) $this->scope_id,
            'brand' => $product->brand_id === (int) $this->scope_id,
            'tag' => $product->tags->contains('id', (int) $this->scope_id),
            default => false,
        };
    }

    public function calculateDiscount(float $price): float
    {
        if ($this->discount_type === 'percentage') {
            return round($price * ($this->discount_value / 100), 2);
        }

        return min((float) $this->discount_value, $price);
    }
}
