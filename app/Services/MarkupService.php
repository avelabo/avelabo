<?php

namespace App\Services;

use App\Models\Product;
use App\Models\Seller;
use App\Models\SellerPriceMarkup;
use App\Models\SellerMarkupTemplate;
use App\Models\SellerMarkupTemplateRange;
use Illuminate\Support\Facades\Cache;

/**
 * CRITICAL SERVICE: Seller Price Markup System
 *
 * This service handles the invisible markup that sellers apply to products.
 * IMPORTANT: Customers NEVER see the markup - they only see the final price.
 *
 * Markup Flow:
 * 1. Product has base_price (source cost)
 * 2. Seller configures markup (percentage or fixed) per product or uses template
 * 3. Final price = base_price + markup
 * 4. Customer only sees the final price
 */
class MarkupService
{
    /**
     * Calculate the markup amount for a product
     * Returns the markup value to add to base price
     */
    public function calculateMarkup(Product $product, ?Seller $seller = null): float
    {
        $seller = $seller ?? $product->seller;

        if (!$seller) {
            return 0;
        }

        // Check for product-specific markup first
        $productMarkup = $this->getProductMarkup($product, $seller);

        if ($productMarkup) {
            return $this->applyMarkup($product->base_price, $productMarkup);
        }

        // Fall back to template-based markup
        $templateMarkup = $this->getTemplateMarkup($product, $seller);

        if ($templateMarkup) {
            return $templateMarkup;
        }

        return 0;
    }

    /**
     * Get the final customer-facing price (base + markup)
     * This is what customers see - they never know about the markup
     */
    public function getFinalPrice(Product $product, ?Seller $seller = null): float
    {
        $markup = $this->calculateMarkup($product, $seller);
        return round($product->base_price + $markup, 2);
    }

    /**
     * Get product-specific markup configuration
     */
    protected function getProductMarkup(Product $product, Seller $seller): ?SellerPriceMarkup
    {
        $cacheKey = "product_markup.{$seller->id}.{$product->id}";

        return Cache::remember($cacheKey, 3600, function () use ($product, $seller) {
            return SellerPriceMarkup::where('seller_id', $seller->id)
                ->where('product_id', $product->id)
                ->where('is_active', true)
                ->first();
        });
    }

    /**
     * Calculate markup based on seller's template (price-range based)
     */
    protected function getTemplateMarkup(Product $product, Seller $seller): float
    {
        $template = $this->getSellerTemplate($seller);

        if (!$template) {
            return 0;
        }

        $range = $this->findPriceRange($template, $product->base_price);

        if (!$range) {
            return 0;
        }

        return $this->applyMarkupFromRange($product->base_price, $range);
    }

    /**
     * Get seller's active markup template
     */
    protected function getSellerTemplate(Seller $seller): ?SellerMarkupTemplate
    {
        $cacheKey = "seller_template.{$seller->id}";

        return Cache::remember($cacheKey, 3600, function () use ($seller) {
            return SellerMarkupTemplate::where('seller_id', $seller->id)
                ->where('is_active', true)
                ->first();
        });
    }

    /**
     * Find the appropriate price range for the given base price
     */
    protected function findPriceRange(SellerMarkupTemplate $template, float $basePrice): ?SellerMarkupTemplateRange
    {
        return SellerMarkupTemplateRange::where('seller_markup_template_id', $template->id)
            ->where('min_price', '<=', $basePrice)
            ->where(function ($query) use ($basePrice) {
                $query->whereNull('max_price')
                    ->orWhere('max_price', '>=', $basePrice);
            })
            ->orderBy('min_price', 'desc')
            ->first();
    }

    /**
     * Apply markup from SellerPriceMarkup configuration
     */
    protected function applyMarkup(float $basePrice, SellerPriceMarkup $markup): float
    {
        if ($markup->markup_type === 'percentage') {
            return round($basePrice * ($markup->markup_value / 100), 2);
        }

        // Fixed markup
        return (float) $markup->markup_value;
    }

    /**
     * Apply markup from template range configuration
     */
    protected function applyMarkupFromRange(float $basePrice, SellerMarkupTemplateRange $range): float
    {
        if ($range->markup_type === 'percentage') {
            return round($basePrice * ($range->markup_value / 100), 2);
        }

        // Fixed markup
        return (float) $range->markup_value;
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
        Cache::forget("seller_template.{$seller->id}");

        // Clear all product markups for this seller
        $products = Product::where('seller_id', $seller->id)->pluck('id');
        foreach ($products as $productId) {
            Cache::forget("product_markup.{$seller->id}.{$productId}");
        }
    }

    /**
     * Clear markup cache for a specific product
     */
    public function clearProductCache(Product $product): void
    {
        if ($product->seller_id) {
            Cache::forget("product_markup.{$product->seller_id}.{$product->id}");
        }
    }
}
