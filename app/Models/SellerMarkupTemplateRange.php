<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SellerMarkupTemplateRange extends Model
{
    use HasFactory;

    protected $fillable = [
        'template_id',
        'min_price',
        'max_price',
        'markup_amount',
    ];

    protected $casts = [
        'min_price' => 'decimal:2',
        'max_price' => 'decimal:2',
        'markup_amount' => 'decimal:2',
    ];

    public function template(): BelongsTo
    {
        return $this->belongsTo(SellerMarkupTemplate::class, 'template_id');
    }

    public function containsPrice(float $price): bool
    {
        return $price >= $this->min_price && $price <= $this->max_price;
    }
}
