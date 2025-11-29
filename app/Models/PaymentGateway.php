<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PaymentGateway extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'display_name',
        'description',
        'logo',
        'is_active',
        'supported_currencies',
        'supported_countries',
        'config',
        'transaction_fee_percentage',
        'transaction_fee_fixed',
        'is_test_mode',
        'sort_order',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'supported_currencies' => 'array',
        'supported_countries' => 'array',
        'config' => 'encrypted:array',
        'is_test_mode' => 'boolean',
        'transaction_fee_percentage' => 'decimal:2',
        'transaction_fee_fixed' => 'decimal:2',
        'sort_order' => 'integer',
    ];

    protected $hidden = [
        'config',
    ];

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order');
    }

    public function supportsCurrency(string $currencyCode): bool
    {
        return empty($this->supported_currencies)
            || in_array($currencyCode, $this->supported_currencies);
    }
}
