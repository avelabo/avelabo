<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Scout\Searchable;

class Product extends Model
{
    use HasFactory, Searchable, SoftDeletes;

    protected $fillable = [
        'seller_id',
        'category_id',
        'brand_id',
        'name',
        'slug',
        'description',
        'short_description',
        'specifications',
        'base_price',
        'currency_id',
        'sku',
        'barcode',
        'stock_quantity',
        'low_stock_threshold',
        'track_inventory',
        'allow_backorders',
        'status',
        'is_featured',
        'is_new',
        'meta_title',
        'meta_description',
        'source',
        'source_id',
        'source_url',
        'views_count',
        'sales_count',
        'rating',
        'reviews_count',
        'weight',
        'length',
        'width',
        'height',
    ];

    protected $casts = [
        'base_price' => 'decimal:2',
        'stock_quantity' => 'integer',
        'low_stock_threshold' => 'integer',
        'track_inventory' => 'boolean',
        'allow_backorders' => 'boolean',
        'is_featured' => 'boolean',
        'is_new' => 'boolean',
        'views_count' => 'integer',
        'sales_count' => 'integer',
        'rating' => 'decimal:2',
        'reviews_count' => 'integer',
        'weight' => 'decimal:3',
        'length' => 'decimal:2',
        'width' => 'decimal:2',
        'height' => 'decimal:2',
    ];

    public function seller(): BelongsTo
    {
        return $this->belongsTo(Seller::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class);
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class)->withTimestamps();
    }

    public function currency(): BelongsTo
    {
        return $this->belongsTo(Currency::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class)->orderBy('sort_order');
    }

    public function variants(): HasMany
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function cartItems(): HasMany
    {
        return $this->hasMany(CartItem::class);
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function wishlists(): HasMany
    {
        return $this->hasMany(Wishlist::class);
    }

    public function getPrimaryImageAttribute(): ?ProductImage
    {
        return $this->images->where('is_primary', true)->first()
            ?? $this->images->first();
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeInStock($query)
    {
        return $query->where(function ($q) {
            $q->where('track_inventory', false)
                ->orWhere('stock_quantity', '>', 0)
                ->orWhere('allow_backorders', true);
        });
    }

    public function isInStock(): bool
    {
        if (! $this->track_inventory) {
            return true;
        }

        return $this->stock_quantity > 0 || $this->allow_backorders;
    }

    public function isLowStock(): bool
    {
        return $this->track_inventory
            && $this->stock_quantity > 0
            && $this->stock_quantity <= $this->low_stock_threshold;
    }

    /**
     * Get the customer-facing price (base price + markup)
     * Markup is INVISIBLE to customers
     */
    public function getDisplayPriceAttribute(): float
    {
        return app(\App\Services\PriceService::class)->getDisplayPrice($this);
    }

    /**
     * Get primary image URL (returns the path for storage, not full URL)
     */
    public function getPrimaryImagePathAttribute(): ?string
    {
        $primaryImage = $this->images->where('is_primary', true)->first()
            ?? $this->images->first();

        return $primaryImage?->path;
    }

    /**
     * Get the indexable data array for the model.
     *
     * @return array<string, mixed>
     */
    public function toSearchableArray(): array
    {
        return [
            'name' => $this->name,
            'short_description' => $this->short_description,
            'description' => $this->description,
        ];
    }

    /**
     * Determine if the model should be searchable.
     */
    public function shouldBeSearchable(): bool
    {
        return $this->status === 'active';
    }
}
