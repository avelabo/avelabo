<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Currency;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CartService
{
    public function __construct(
        protected PriceService $priceService,
        protected DiscountService $discountService
    ) {}

    /**
     * Get the cart token from the request
     */
    protected function getCartToken(): string
    {
        return request()->attributes->get('cart_token') ?? request()->cookie('cart_token') ?? session()->getId();
    }

    /**
     * Get or create a cart for the current user/session
     */
    public function getOrCreateCart(?int $userId = null, ?string $cartToken = null): Cart
    {
        $userId = $userId ?? Auth::id();
        $cartToken = $cartToken ?? $this->getCartToken();

        // Try to find existing cart
        $cart = Cart::active()
            ->when($userId, fn ($q) => $q->forUser($userId))
            ->when(! $userId, fn ($q) => $q->forGuest($cartToken))
            ->first();

        if (! $cart) {
            // Get default currency (MWK) or first active currency
            $defaultCurrency = Currency::getDefault() ?? Currency::active()->first();

            if (! $defaultCurrency) {
                // Create default MWK currency if none exists
                $defaultCurrency = Currency::create([
                    'name' => 'Malawian Kwacha',
                    'code' => 'MWK',
                    'symbol' => 'MK',
                    'decimal_places' => 0,
                    'symbol_before' => true,
                    'is_default' => true,
                    'is_active' => true,
                ]);
            }

            $cart = Cart::create([
                'user_id' => $userId,
                'guest_token' => $cartToken,
                'currency_id' => $defaultCurrency->id,
                'expires_at' => $userId ? null : now()->addDays(30),
            ]);
        }

        return $cart->load(['items.product.images', 'items.product.seller', 'items.variant']);
    }

    /**
     * Add a product to cart
     */
    public function addProduct(
        Cart $cart,
        int $productId,
        int $quantity = 1,
        ?int $variantId = null
    ): CartItem {
        $product = Product::with('seller')->findOrFail($productId);
        $variant = $variantId ? ProductVariant::findOrFail($variantId) : null;

        // Validate stock
        $this->validateStock($product, $variant, $quantity);

        // Get display price (with markup applied)
        $unitPrice = $variant
            ? $this->priceService->getVariantPrice($variant)['amount']
            : $this->priceService->getDisplayPrice($product);

        // Check if item already exists in cart
        $existingItem = $cart->items()
            ->where('product_id', $productId)
            ->where('variant_id', $variantId)
            ->first();

        if ($existingItem) {
            $newQuantity = $existingItem->quantity + $quantity;
            $this->validateStock($product, $variant, $newQuantity);

            $existingItem->update([
                'quantity' => $newQuantity,
                'unit_price' => $unitPrice,
            ]);

            return $existingItem->fresh();
        }

        return $cart->items()->create([
            'product_id' => $productId,
            'variant_id' => $variantId,
            'quantity' => $quantity,
            'unit_price' => $unitPrice,
        ]);
    }

    /**
     * Update cart item quantity
     */
    public function updateQuantity(CartItem $cartItem, int $quantity): CartItem
    {
        if ($quantity <= 0) {
            $cartItem->delete();
            throw new \Exception('Item removed from cart');
        }

        $product = $cartItem->product;
        $variant = $cartItem->variant;

        // Handle unavailable products
        if (! $product) {
            $cartItem->delete();
            throw new \Exception('Product is no longer available');
        }

        $this->validateStock($product, $variant, $quantity);

        // Update price in case it changed
        $unitPrice = $variant
            ? $this->priceService->getVariantPrice($variant)['amount']
            : $this->priceService->getDisplayPrice($product);

        $cartItem->update([
            'quantity' => $quantity,
            'unit_price' => $unitPrice,
        ]);

        return $cartItem->fresh();
    }

    /**
     * Remove item from cart
     */
    public function removeItem(CartItem $cartItem): bool
    {
        return $cartItem->delete();
    }

    /**
     * Clear entire cart
     */
    public function clearCart(Cart $cart): bool
    {
        return $cart->items()->delete() >= 0;
    }

    /**
     * Merge guest cart with user cart on login
     */
    public function mergeCarts(?string $cartToken = null, ?int $userId = null): Cart
    {
        $cartToken = $cartToken ?? $this->getCartToken();
        $userId = $userId ?? Auth::id();
        $guestCart = Cart::active()->forGuest($cartToken)->first();
        $userCart = $this->getOrCreateCart($userId);

        if (! $guestCart || $guestCart->id === $userCart->id) {
            return $userCart;
        }

        DB::transaction(function () use ($guestCart, $userCart) {
            foreach ($guestCart->items as $guestItem) {
                $existingItem = $userCart->items()
                    ->where('product_id', $guestItem->product_id)
                    ->where('variant_id', $guestItem->variant_id)
                    ->first();

                if ($existingItem) {
                    // Add quantities together
                    $existingItem->update([
                        'quantity' => $existingItem->quantity + $guestItem->quantity,
                    ]);
                } else {
                    // Move item to user cart
                    $guestItem->update(['cart_id' => $userCart->id]);
                }
            }

            // Delete guest cart
            $guestCart->delete();
        });

        return $userCart->fresh(['items.product.images', 'items.product.seller', 'items.variant']);
    }

    /**
     * Calculate cart totals with display prices and discounts
     */
    public function calculateTotals(Cart $cart): array
    {
        $cart->load(['items.product.seller', 'items.product.images', 'items.variant', 'coupon']);

        $subtotal = 0;
        $promotionDiscount = 0;
        $itemsData = [];

        foreach ($cart->items as $item) {
            $product = $item->product;
            $variant = $item->variant;

            // Handle unavailable products (deleted or missing)
            if (! $product) {
                $itemsData[] = [
                    'id' => $item->id,
                    'product_id' => $item->product_id,
                    'variant_id' => $item->variant_id,
                    'name' => null,
                    'variant_name' => null,
                    'image' => null,
                    'unit_price' => 0,
                    'quantity' => $item->quantity,
                    'line_total' => 0,
                    'promotion_discount' => 0,
                    'coupon_discount' => 0,
                    'seller_id' => null,
                    'seller_name' => null,
                    'in_stock' => false,
                    'unavailable' => true,
                    'product' => null,
                ];

                continue;
            }

            // Get current display price (with currency conversion)
            $unitPrice = $variant
                ? $this->priceService->getVariantPrice($variant)['amount']
                : $this->priceService->getPrice($product)['amount'];

            // Get promotion discount for this product
            $discountInfo = $this->discountService->getProductDiscount($product, $unitPrice);
            $itemPromoDiscount = 0;

            if ($discountInfo['has_discount']) {
                // Apply promotion discount per item
                $itemPromoDiscount = $discountInfo['discount_amount'] * $item->quantity;
                $promotionDiscount += $itemPromoDiscount;
            }

            $lineTotal = ($unitPrice * $item->quantity) - $itemPromoDiscount;
            $subtotal += $unitPrice * $item->quantity;

            $itemsData[] = [
                'id' => $item->id,
                'product_id' => $product->id,
                'variant_id' => $variant?->id,
                'name' => $product->name,
                'variant_name' => $variant?->name,
                'image' => $product->primary_image_url,
                'unit_price' => $unitPrice,
                'quantity' => $item->quantity,
                'line_total' => $lineTotal,
                'promotion_discount' => $itemPromoDiscount,
                'coupon_discount' => 0, // Will be calculated after coupon check
                'seller_id' => $product->seller_id,
                'seller_name' => $product->seller?->business_name,
                'in_stock' => $this->isInStock($product, $variant, $item->quantity),
                'unavailable' => false,
                'product' => $product,
            ];
        }

        // Calculate coupon discount if coupon is applied
        $couponDiscount = 0;
        if ($cart->coupon) {
            $couponResult = $this->discountService->calculateCouponDiscount($cart->coupon, $itemsData);
            $couponDiscount = $couponResult['discount_amount'];

            // Apply coupon discount per item
            foreach ($itemsData as &$itemData) {
                $itemCouponDiscount = $couponResult['item_discounts'][$itemData['id']] ?? 0;
                $itemData['coupon_discount'] = $itemCouponDiscount;
                $itemData['line_total'] -= $itemCouponDiscount;
            }
            unset($itemData);
        }

        // Remove product reference from items (not needed in frontend)
        foreach ($itemsData as &$itemData) {
            unset($itemData['product']);
        }
        unset($itemData);

        // For now, no shipping calculation or tax
        $shipping = 0;
        $tax = 0;
        $discountTotal = $promotionDiscount + $couponDiscount;
        $total = $subtotal - $discountTotal + $shipping + $tax;

        // Get customer's preferred currency
        $customerCurrency = $this->getCustomerCurrencyCode();

        return [
            'items' => $itemsData,
            'item_count' => $cart->items->sum('quantity'),
            'subtotal' => $subtotal,
            'promotion_discount' => $promotionDiscount,
            'coupon_discount' => $couponDiscount,
            'discount_total' => $discountTotal,
            'discount_amount' => $discountTotal, // Alias for frontend compatibility
            'shipping' => $shipping,
            'tax' => $tax,
            'total' => $total,
            'currency' => $customerCurrency,
            'coupon' => $cart->coupon ? [
                'code' => $cart->coupon->code,
                'name' => $cart->coupon->name,
            ] : null,
        ];
    }

    /**
     * Validate all items in cart are in stock
     */
    public function validateCartStock(Cart $cart): array
    {
        $errors = [];

        foreach ($cart->items as $item) {
            // Handle unavailable products
            if (! $item->product) {
                $errors[] = [
                    'item_id' => $item->id,
                    'product_name' => 'Unavailable Product',
                    'requested' => $item->quantity,
                    'available' => 0,
                    'unavailable' => true,
                ];

                continue;
            }

            if (! $this->isInStock($item->product, $item->variant, $item->quantity)) {
                $errors[] = [
                    'item_id' => $item->id,
                    'product_name' => $item->product->name,
                    'requested' => $item->quantity,
                    'available' => $this->getAvailableStock($item->product, $item->variant),
                ];
            }
        }

        return $errors;
    }

    /**
     * Validate stock for a product/variant
     */
    protected function validateStock(Product $product, ?ProductVariant $variant, int $quantity): void
    {
        if (! $this->isInStock($product, $variant, $quantity)) {
            $available = $this->getAvailableStock($product, $variant);
            throw new \Exception("Insufficient stock. Only {$available} available.");
        }
    }

    /**
     * Check if product is in stock for requested quantity
     */
    protected function isInStock(Product $product, ?ProductVariant $variant, int $quantity): bool
    {
        if ($variant) {
            if (! $variant->track_inventory) {
                return true;
            }

            return $variant->stock_quantity >= $quantity || $variant->allow_backorders;
        }

        if (! $product->track_inventory) {
            return true;
        }

        return $product->stock_quantity >= $quantity || $product->allow_backorders;
    }

    /**
     * Get available stock quantity
     */
    protected function getAvailableStock(Product $product, ?ProductVariant $variant): int
    {
        if ($variant) {
            return $variant->track_inventory ? $variant->stock_quantity : 999;
        }

        return $product->track_inventory ? $product->stock_quantity : 999;
    }

    /**
     * Get cart for API response
     */
    public function getCartData(?Cart $cart = null): array
    {
        $cart = $cart ?? $this->getOrCreateCart();

        return $this->calculateTotals($cart);
    }

    /**
     * Refresh prices for all cart items (in case prices changed)
     */
    public function refreshPrices(Cart $cart): void
    {
        foreach ($cart->items as $item) {
            $product = $item->product;
            $variant = $item->variant;

            // Skip unavailable products
            if (! $product) {
                continue;
            }

            $unitPrice = $variant
                ? $this->priceService->getVariantPrice($variant)['amount']
                : $this->priceService->getPrice($product)['amount'];

            if ($item->unit_price != $unitPrice) {
                $item->update(['unit_price' => $unitPrice]);
            }
        }
    }

    /**
     * Get customer's preferred currency code
     */
    protected function getCustomerCurrencyCode(): string
    {
        $user = Auth::user();

        if ($user && $user->preferredCurrency) {
            return $user->preferredCurrency->code;
        }

        // Get from session
        $sessionCurrency = session('currency');

        if (is_array($sessionCurrency) && isset($sessionCurrency['code'])) {
            return $sessionCurrency['code'];
        }

        if (is_string($sessionCurrency) && ! empty($sessionCurrency)) {
            return $sessionCurrency;
        }

        // Default to MWK
        return 'MWK';
    }
}
