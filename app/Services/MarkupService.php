<?php

namespace App\Services;

use App\Models\Product;
use App\Models\Seller;
use App\Models\SellerMarkupTemplateRange;
use App\Models\SellerPriceMarkup;
use Illuminate\Support\Facades\Cache;

/**
 * CRITICAL SERVICE: Seller Price Markup System
 *
 * This service handles the invisible markup that sellers apply to products.
 * IMPORTANT: Customers NEVER see the markup - they only see the final price.
 *
 * Markup Flow:
 * 1. Product has base_price (source cost)
 * 2. Seller configures markup ranges (e.g., $0-100 = $10 markup, $100-500 = $50 markup)
 * 3. Final price = base_price + markup_amount (from matching range)
 * 4. Customer only sees the final price
 */
class MarkupService
{
    /**
     * Calculate the markup amount for a product based on seller's price range configuration
     * Returns the markup value to add to base price
     *
     * @deprecated Use calculateMarkupForPrice() instead - markup should be applied after currency conversion
     */
    public function calculateMarkup(Product $product, ?Seller $seller = null): float
    {
        $seller = $seller ?? $product->seller;

        if (! $seller) {
            return 0;
        }

        $basePrice = $product->base_price ?? 0;

        if ($basePrice <= 0) {
            return 0;
        }

        // Find the markup range that contains this price
        $markupRange = $this->findMarkupRange($seller, $basePrice);

        if (! $markupRange) {
            return 0;
        }

        return (float) $markupRange->markup_amount;
    }

    /**
     * Calculate markup for a given price (already converted to selling currency)
     * This is the preferred method - markup ranges are defined in selling currency (MWK)
     */
    public function calculateMarkupForPrice(float $price, ?Seller $seller): float
    {
        if (! $seller || $price <= 0) {
            return 0;
        }

        $markupRange = $this->findMarkupRange($seller, $price);

        if (! $markupRange) {
            return 0;
        }

        return (float) $markupRange->markup_amount;
    }

    /**
     * Get the final customer-facing price (base + markup)
     * This is what customers see - they never know about the markup
     */
    public function getFinalPrice(Product $product, ?Seller $seller = null): float
    {
        $basePrice = $product->base_price ?? 0;
        $markup = $this->calculateMarkup($product, $seller);

        return round($basePrice + $markup, 2);
    }

    /**
     * Find the markup range that contains the given price.
     * First checks seller's direct price markups, then falls back to their assigned template.
     */
    protected function findMarkupRange(Seller $seller, float $basePrice): ?object
    {
        $cacheKey = "seller_markup_ranges.{$seller->id}";

        // Cache all markup ranges for this seller (direct + template fallback)
        $ranges = Cache::remember($cacheKey, 3600, function () use ($seller) {
            // First, try seller's direct price markups
            $directRanges = SellerPriceMarkup::where('seller_id', $seller->id)
                ->where('is_active', true)
                ->orderBy('min_price', 'asc')
                ->get();

            if ($directRanges->isNotEmpty()) {
                return $directRanges;
            }

            // Fall back to seller's assigned markup template
            if ($seller->markup_template_id) {
                return SellerMarkupTemplateRange::where('template_id', $seller->markup_template_id)
                    ->orderBy('min_price', 'asc')
                    ->get();
            }

            return collect();
        });

        // Find the range that contains this price
        foreach ($ranges as $range) {
            $maxPrice = $range->max_price ?? PHP_FLOAT_MAX;
            if ($basePrice >= $range->min_price && $basePrice <= $maxPrice) {
                return $range;
            }
        }

        return null;
    }

    /**
     * Bulk calculate final prices for multiple products
     * Optimized for listing pages
     */
    public function bulkGetFinalPrices(array $products, ?Seller $seller = null): array
    {
        $prices = [];

        foreach ($products as $product) {
            $prices[$product->id] = $this->getFinalPrice($product, $seller ?? $product->seller);
        }

        return $prices;
    }

    /**
     * Clear markup cache for a seller
     */
    public function clearSellerCache(Seller $seller): void
    {
        Cache::forget("seller_markup_ranges.{$seller->id}");
    }

    /**
     * Get all markup ranges for a seller (for admin/seller panel)
     */
    public function getSellerMarkupRanges(Seller $seller): \Illuminate\Database\Eloquent\Collection
    {
        return SellerPriceMarkup::where('seller_id', $seller->id)
            ->orderBy('min_price', 'asc')
            ->get();
    }

    /**
     * Create or update a markup range for a seller
     */
    public function setMarkupRange(
        Seller $seller,
        float $minPrice,
        float $maxPrice,
        float $markupAmount,
        int $currencyId
    ): SellerPriceMarkup {
        $markup = SellerPriceMarkup::updateOrCreate(
            [
                'seller_id' => $seller->id,
                'min_price' => $minPrice,
                'max_price' => $maxPrice,
            ],
            [
                'markup_amount' => $markupAmount,
                'currency_id' => $currencyId,
                'is_active' => true,
            ]
        );

        $this->clearSellerCache($seller);

        return $markup;
    }

    /**
     * Delete a markup range
     */
    public function deleteMarkupRange(SellerPriceMarkup $markup): void
    {
        $sellerId = $markup->seller_id;
        $markup->delete();

        if ($sellerId) {
            Cache::forget("seller_markup_ranges.{$sellerId}");
        }
    }

    /**
     * Check if seller has any markup configuration
     */
    public function sellerHasMarkupConfig(Seller $seller): bool
    {
        return SellerPriceMarkup::where('seller_id', $seller->id)
            ->where('is_active', true)
            ->exists();
    }
}
