<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\Coupon;
use App\Models\Order;
use App\Models\Product;
use App\Models\Promotion;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;

class DiscountService
{
    protected array $productDiscountCache = [];

    /**
     * Get the best active promotion discount for a product.
     * Discount is applied to the display_price (after markup).
     */
    public function getProductDiscount(Product $product, ?float $displayPrice = null): array
    {
        if (isset($this->productDiscountCache[$product->id])) {
            return $this->productDiscountCache[$product->id];
        }

        $displayPrice = $displayPrice ?? $product->display_price;

        $result = [
            'has_discount' => false,
            'original_price' => $displayPrice,
            'discounted_price' => $displayPrice,
            'discount_amount' => 0.0,
            'discount_percentage' => 0,
            'promotion_name' => null,
        ];

        $best = $this->findBestPromotion($product, $displayPrice);

        if ($best) {
            $result = [
                'has_discount' => true,
                'original_price' => $displayPrice,
                'discounted_price' => round($displayPrice - $best['discount_amount'], 2),
                'discount_amount' => $best['discount_amount'],
                'discount_percentage' => $displayPrice > 0
                    ? (int) round(($best['discount_amount'] / $displayPrice) * 100)
                    : 0,
                'promotion_name' => $best['promotion']->name,
            ];
        }

        $this->productDiscountCache[$product->id] = $result;

        return $result;
    }

    /**
     * Find the best promotion (seller or system) for a product.
     */
    protected function findBestPromotion(Product $product, float $displayPrice): ?array
    {
        $promotions = $this->getActivePromotions();

        $bestDiscount = 0;
        $bestPromotion = null;

        foreach ($promotions as $promotion) {
            if (! $promotion->appliesToProduct($product)) {
                continue;
            }

            $discount = $promotion->calculateDiscount($displayPrice);

            if ($discount > $bestDiscount) {
                $bestDiscount = $discount;
                $bestPromotion = $promotion;
            }
        }

        if (! $bestPromotion) {
            return null;
        }

        return [
            'promotion' => $bestPromotion,
            'discount_amount' => round($bestDiscount, 2),
        ];
    }

    /**
     * Get all active promotions (cached per request).
     */
    protected function getActivePromotions(): Collection
    {
        return Cache::remember('active_promotions', 300, function () {
            return Promotion::active()->get();
        });
    }

    /**
     * Clear the promotions cache.
     */
    public function clearPromotionsCache(): void
    {
        Cache::forget('active_promotions');
        $this->productDiscountCache = [];
    }

    /**
     * Validate a coupon code for use with a cart.
     *
     * @throws \Exception
     */
    public function validateCoupon(string $code, Cart $cart, ?User $user = null): Coupon
    {
        $coupon = Coupon::valid()->where('code', $code)->first();

        if (! $coupon) {
            throw new \Exception('Invalid or expired coupon code.');
        }

        if (! $coupon->isUsableByUser($user)) {
            if ($coupon->requires_auth && ! $user) {
                throw new \Exception('You must be logged in to use this coupon.');
            }
            throw new \Exception('You have already used this coupon.');
        }

        // Check minimum order amount
        if ($coupon->min_order_amount !== null) {
            $cartTotal = $cart->items->sum(fn ($item) => $item->quantity * $item->unit_price);
            if ($cartTotal < (float) $coupon->min_order_amount) {
                throw new \Exception("Minimum order amount of {$coupon->min_order_amount} required.");
            }
        }

        return $coupon;
    }

    /**
     * Calculate coupon discount for cart items.
     * Only applies to items matching the coupon's scope.
     *
     * @param  array  $cartItems  Array of cart item data with product loaded
     * @return array{discount_amount: float, item_discounts: array}
     */
    public function calculateCouponDiscount(Coupon $coupon, array $cartItems): array
    {
        $eligibleTotal = 0;
        $eligibleItems = [];

        foreach ($cartItems as $item) {
            $product = $item['product'] ?? null;
            if (! $product) {
                continue;
            }

            if ($coupon->appliesToProduct($product)) {
                $lineTotal = ($item['unit_price'] ?? 0) * ($item['quantity'] ?? 1);
                $eligibleTotal += $lineTotal;
                $eligibleItems[] = $item;
            }
        }

        if ($eligibleTotal <= 0) {
            return ['discount_amount' => 0, 'item_discounts' => []];
        }

        $totalDiscount = $coupon->calculateDiscount($eligibleTotal);

        // Distribute discount proportionally across eligible items
        $itemDiscounts = [];
        foreach ($eligibleItems as $item) {
            $lineTotal = ($item['unit_price'] ?? 0) * ($item['quantity'] ?? 1);
            $proportion = $lineTotal / $eligibleTotal;
            $itemDiscounts[$item['id']] = round($totalDiscount * $proportion, 2);
        }

        return [
            'discount_amount' => round($totalDiscount, 2),
            'item_discounts' => $itemDiscounts,
        ];
    }

    /**
     * Record coupon usage after order placement.
     */
    public function recordCouponUsage(Coupon $coupon, User $user, Order $order, float $discountAmount): void
    {
        $coupon->users()->attach($user->id, [
            'order_id' => $order->id,
            'discount_amount' => $discountAmount,
            'used_at' => now(),
        ]);

        $coupon->increment('used_count');
    }

    /**
     * Check if any active promotions exist for filtering on the shop.
     */
    public function hasActivePromotions(): bool
    {
        return $this->getActivePromotions()->isNotEmpty();
    }

    /**
     * Get product IDs that have active promotions (for shop filtering).
     */
    public function getProductIdsWithActivePromotions(Collection $products): array
    {
        $promotions = $this->getActivePromotions();
        $ids = [];

        foreach ($products as $product) {
            foreach ($promotions as $promotion) {
                if ($promotion->appliesToProduct($product)) {
                    $ids[] = $product->id;
                    break;
                }
            }
        }

        return $ids;
    }
}
