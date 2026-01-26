<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class Seller extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'shop_name',
        'slug',
        'description',
        'logo',
        'banner',
        'business_type',
        'business_name',
        'business_registration_number',
        'default_currency_id',
        'country_id',
        'markup_template_id',
        'status',
        'rating',
        'total_reviews',
        'total_products',
        'total_sales',
        'is_verified',
        'is_featured',
        'source',
        'source_id',
        'commission_rate',
        'approved_at',
        'show_seller_name',
        'has_storefront',
    ];

    protected $casts = [
        'rating' => 'decimal:2',
        'total_reviews' => 'integer',
        'total_products' => 'integer',
        'total_sales' => 'integer',
        'is_verified' => 'boolean',
        'is_featured' => 'boolean',
        'commission_rate' => 'decimal:2',
        'approved_at' => 'datetime',
        'show_seller_name' => 'boolean',
        'has_storefront' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function defaultCurrency(): BelongsTo
    {
        return $this->belongsTo(Currency::class, 'default_currency_id');
    }

    public function country(): BelongsTo
    {
        return $this->belongsTo(Country::class);
    }

    public function kyc(): HasOne
    {
        return $this->hasOne(SellerKyc::class);
    }

    public function bankAccounts(): HasMany
    {
        return $this->hasMany(SellerBankAccount::class);
    }

    public function priceMarkups(): HasMany
    {
        return $this->hasMany(SellerPriceMarkup::class);
    }

    public function markupTemplate(): BelongsTo
    {
        return $this->belongsTo(SellerMarkupTemplate::class, 'markup_template_id');
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeVerified($query)
    {
        return $query->where('is_verified', true);
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeWithStorefront($query)
    {
        return $query->where('has_storefront', true);
    }

    public function scopeVisible($query)
    {
        return $query->where('show_seller_name', true);
    }

    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    public function isApproved(): bool
    {
        return $this->status === 'active';
    }

    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    public function getDefaultBankAccount(): ?SellerBankAccount
    {
        return $this->bankAccounts()->where('is_default', true)->first();
    }

    /**
     * Get the display name for frontend (seller name or Avelabo)
     */
    public function getDisplayNameAttribute(): string
    {
        return $this->show_seller_name ? $this->shop_name : 'Avelabo';
    }

    /**
     * Get the logo URL
     */
    public function getLogoUrlAttribute(): ?string
    {
        if (!$this->logo) {
            return null;
        }

        // If it's already a full URL, return as-is
        if (str_starts_with($this->logo, 'http://') || str_starts_with($this->logo, 'https://')) {
            return $this->logo;
        }

        return Storage::url($this->logo);
    }

    /**
     * Get the banner URL
     */
    public function getBannerUrlAttribute(): ?string
    {
        if (!$this->banner) {
            return null;
        }

        // If it's already a full URL, return as-is
        if (str_starts_with($this->banner, 'http://') || str_starts_with($this->banner, 'https://')) {
            return $this->banner;
        }

        return Storage::url($this->banner);
    }

    /**
     * Check if seller should be shown on frontend
     */
    public function shouldShowOnFrontend(): bool
    {
        return $this->show_seller_name && $this->has_storefront;
    }
}
