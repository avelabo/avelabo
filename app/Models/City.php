<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class City extends Model
{
    use HasFactory;

    protected $fillable = [
        'region_id',
        'name',
        'is_active',
        'is_delivery_available',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'is_delivery_available' => 'boolean',
    ];

    public function region(): BelongsTo
    {
        return $this->belongsTo(Region::class);
    }

    public function country()
    {
        return $this->region->country;
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeDeliveryAvailable($query)
    {
        return $query->where('is_delivery_available', true);
    }
}
