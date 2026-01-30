<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserAddress extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'label',
        'first_name',
        'last_name',
        'phone',
        'address_line_1',
        'address_line_2',
        'city_id',
        'city_name',
        'region_id',
        'region_name',
        'country_id',
        'postal_code',
        'latitude',
        'longitude',
        'is_default',
        'is_billing',
    ];

    protected $casts = [
        'is_default' => 'boolean',
        'is_billing' => 'boolean',
        'latitude' => 'decimal:7',
        'longitude' => 'decimal:7',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class);
    }

    public function region(): BelongsTo
    {
        return $this->belongsTo(Region::class);
    }

    public function country(): BelongsTo
    {
        return $this->belongsTo(Country::class);
    }

    public function getFullNameAttribute(): string
    {
        return $this->first_name.' '.$this->last_name;
    }

    public function getFullAddressAttribute(): string
    {
        $parts = array_filter([
            $this->address_line_1,
            $this->address_line_2,
            $this->city_name ?? $this->city?->name,
            $this->region_name ?? $this->region?->name,
            $this->postal_code,
            $this->country?->name,
        ]);

        return implode(', ', $parts);
    }

    public function toSnapshot(): array
    {
        return [
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'phone' => $this->phone,
            'address_line_1' => $this->address_line_1,
            'address_line_2' => $this->address_line_2,
            'city' => $this->city_name ?? $this->city?->name,
            'region' => $this->region_name ?? $this->region?->name,
            'country' => $this->country?->name,
            'postal_code' => $this->postal_code,
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
        ];
    }

    /**
     * Check if this address has GPS coordinates
     */
    public function hasCoordinates(): bool
    {
        return $this->latitude !== null && $this->longitude !== null;
    }

    /**
     * Get coordinates as an array
     */
    public function getCoordinatesAttribute(): ?array
    {
        if (! $this->hasCoordinates()) {
            return null;
        }

        return [
            'lat' => (float) $this->latitude,
            'lng' => (float) $this->longitude,
        ];
    }
}
