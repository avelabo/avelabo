<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ExchangeRate extends Model
{
    use HasFactory;

    protected $fillable = [
        'from_currency_id',
        'to_currency_id',
        'rate',
        'markup_percentage',
        'fetched_at',
    ];

    protected $casts = [
        'rate' => 'decimal:8',
        'markup_percentage' => 'decimal:2',
        'fetched_at' => 'datetime',
    ];

    public function fromCurrency(): BelongsTo
    {
        return $this->belongsTo(Currency::class, 'from_currency_id');
    }

    public function toCurrency(): BelongsTo
    {
        return $this->belongsTo(Currency::class, 'to_currency_id');
    }

    public function getEffectiveRate(): float
    {
        $markupMultiplier = 1 + ($this->markup_percentage / 100);
        return $this->rate * $markupMultiplier;
    }

    public function convert(float $amount): float
    {
        return $amount * $this->getEffectiveRate();
    }
}
