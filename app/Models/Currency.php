<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Currency extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'symbol',
        'decimal_places',
        'symbol_before',
        'is_default',
        'is_active',
    ];

    protected $casts = [
        'decimal_places' => 'integer',
        'symbol_before' => 'boolean',
        'is_default' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function exchangeRatesFrom(): HasMany
    {
        return $this->hasMany(ExchangeRate::class, 'from_currency_id');
    }

    public function exchangeRatesTo(): HasMany
    {
        return $this->hasMany(ExchangeRate::class, 'to_currency_id');
    }

    public function format(float $amount): string
    {
        $formatted = number_format($amount, $this->decimal_places);
        return $this->symbol_before
            ? $this->symbol . $formatted
            : $formatted . $this->symbol;
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeDefault($query)
    {
        return $query->where('is_default', true);
    }

    public static function getDefault(): ?self
    {
        return static::where('is_default', true)->first();
    }
}
