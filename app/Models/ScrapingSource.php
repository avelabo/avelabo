<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ScrapingSource extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'base_url',
        'logo',
        'is_active',
        'config',
        'rate_limit_per_minute',
        'last_scraped_at',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'config' => 'encrypted:array',
        'rate_limit_per_minute' => 'integer',
        'last_scraped_at' => 'datetime',
    ];

    protected $hidden = [
        'config',
    ];

    public function jobs(): HasMany
    {
        return $this->hasMany(ScrapingJob::class);
    }

    public function logs(): HasMany
    {
        return $this->hasMany(ScrapingLog::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
