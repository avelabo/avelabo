<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\Currency;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use App\Models\UserAddress;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class CheckoutService
{
    public function __construct(
        protected CartService $cartService,
        protected PriceService $priceService,
        protected MarkupService $markupService,
        protected OrderService $orderService,
        protected DiscountService $discountService
    ) {}

    /**
     * Validate checkout data
     */
    public function validateCheckout(Cart $cart, array $billingData, array $shippingData): array
    {
        $errors = [];

        // Check cart is not empty
        if ($cart->items->isEmpty()) {
            $errors['cart'] = 'Your cart is empty';
        }

        // Validate stock
        $stockErrors = $this->cartService->validateCartStock($cart);
        if (! empty($stockErrors)) {
            $errors['stock'] = $stockErrors;
        }

        // Validate required billing fields
        // Note: For Malawian customers, address_line_1 and city are not required
        // since many don't have formal addresses
        $malawi = \App\Models\Country::where('code', 'MWI')->first();
        $billingIsMalawi = $malawi && ($billingData['country_id'] ?? null) == $malawi->id;

        $requiredBillingFields = ['first_name', 'last_name', 'email', 'phone', 'country_id'];
        if (! $billingIsMalawi) {
            // Non-Malawi billing requires address details
            $requiredBillingFields[] = 'address_line_1';
            $requiredBillingFields[] = 'city';
        }

        foreach ($requiredBillingFields as $field) {
            if (empty($billingData[$field])) {
                $errors["billing.{$field}"] = 'This field is required';
            }
        }

        // Validate email format
        if (! empty($billingData['email']) && ! filter_var($billingData['email'], FILTER_VALIDATE_EMAIL)) {
            $errors['billing.email'] = 'Invalid email address';
        }

        return $errors;
    }

    /**
     * Create a user account via Quick Checkout
     */
    public function createQuickCheckoutUser(string $email, ?string $phone, string $firstName, string $lastName): User
    {
        // Check if user already exists
        $existingUser = User::where('email', $email)->first();
        if ($existingUser) {
            return $existingUser;
        }

        // Generate random password
        $password = Str::random(12);

        $user = User::create([
            'name' => trim("{$firstName} {$lastName}"),
            'email' => $email,
            'phone' => $phone,
            'password' => Hash::make($password),
            'status' => 'active',
        ]);

        // TODO: Send welcome email with password reset link
        // Mail::to($user)->send(new QuickCheckoutWelcome($user, $password));

        return $user;
    }

    /**
     * Get or create user address
     * If address_id is provided, use existing address
     * Otherwise create a new address
     */
    public function getOrCreateAddress(User $user, array $addressData, string $type = 'billing'): UserAddress
    {
        $isBilling = $type === 'billing';

        // If an existing address ID is provided, use that address
        if (! empty($addressData['address_id'])) {
            $existingAddress = UserAddress::where('id', $addressData['address_id'])
                ->where('user_id', $user->id)
                ->first();

            if ($existingAddress) {
                // Update coordinates if new ones are provided
                if (isset($addressData['coordinates']) && is_array($addressData['coordinates'])) {
                    $existingAddress->update([
                        'latitude' => $addressData['coordinates']['lat'] ?? $existingAddress->latitude,
                        'longitude' => $addressData['coordinates']['lng'] ?? $existingAddress->longitude,
                    ]);
                }

                return $existingAddress;
            }
        }

        // Extract coordinates if provided
        $latitude = null;
        $longitude = null;
        if (isset($addressData['coordinates']) && is_array($addressData['coordinates'])) {
            $latitude = $addressData['coordinates']['lat'] ?? null;
            $longitude = $addressData['coordinates']['lng'] ?? null;
        }

        // Build address attributes for comparison and creation
        $addressAttributes = [
            'first_name' => $addressData['first_name'] ?? '',
            'last_name' => $addressData['last_name'] ?? '',
            'phone' => $addressData['phone'] ?? null,
            'address_line_1' => $addressData['address_line_1'] ?? '',
            'address_line_2' => $addressData['address_line_2'] ?? null,
            'city_name' => $addressData['city'] ?? '',
            'city_id' => $addressData['city_id'] ?? null,
            'region_name' => $addressData['state'] ?? null,
            'postal_code' => $addressData['postal_code'] ?? null,
            'country_id' => $addressData['country_id'] ?? null,
        ];

        // Check if a similar address already exists for this user
        $existingAddress = UserAddress::where('user_id', $user->id)
            ->where('city_id', $addressAttributes['city_id'])
            ->where('address_line_1', $addressAttributes['address_line_1'])
            ->where('first_name', $addressAttributes['first_name'])
            ->where('last_name', $addressAttributes['last_name'])
            ->first();

        if ($existingAddress) {
            // Update with any new data (including city, coordinates, phone, etc.)
            $existingAddress->update([
                'phone' => $addressAttributes['phone'] ?? $existingAddress->phone,
                'address_line_1' => $addressAttributes['address_line_1'] ?: $existingAddress->address_line_1,
                'address_line_2' => $addressAttributes['address_line_2'] ?? $existingAddress->address_line_2,
                'city_id' => $addressAttributes['city_id'] ?? $existingAddress->city_id,
                'city_name' => $addressAttributes['city_name'] ?: $existingAddress->city_name,
                'region_name' => $addressAttributes['region_name'] ?? $existingAddress->region_name,
                'country_id' => $addressAttributes['country_id'] ?? $existingAddress->country_id,
                'latitude' => $latitude ?? $existingAddress->latitude,
                'longitude' => $longitude ?? $existingAddress->longitude,
            ]);

            return $existingAddress;
        }

        // Reset is_default for other addresses of this type
        UserAddress::where('user_id', $user->id)
            ->where('is_billing', $isBilling)
            ->update(['is_default' => false]);

        // Create new address
        return UserAddress::create([
            'user_id' => $user->id,
            'is_billing' => $isBilling,
            'is_default' => true,
            'label' => $this->generateAddressLabel($user, $addressAttributes['city_name'], $isBilling),
            ...$addressAttributes,
            'latitude' => $latitude,
            'longitude' => $longitude,
        ]);
    }

    /**
     * Generate a unique label for the address
     */
    protected function generateAddressLabel(User $user, string $cityName, bool $isBilling): string
    {
        $baseLabel = $isBilling ? 'Billing' : 'Delivery';
        $cityPart = $cityName ? " - {$cityName}" : '';

        // Check if a similar label already exists
        $existingCount = UserAddress::where('user_id', $user->id)
            ->where('label', 'like', "{$baseLabel}%")
            ->count();

        if ($existingCount === 0) {
            return "{$baseLabel}{$cityPart}";
        }

        return "{$baseLabel}{$cityPart} ".($existingCount + 1);
    }

    /**
     * Process the checkout and create order
     */
    public function processCheckout(
        Cart $cart,
        array $billingData,
        array $shippingData,
        ?int $paymentGatewayId = null,
        ?string $notes = null
    ): Order {
        return DB::transaction(function () use ($cart, $billingData, $shippingData, $paymentGatewayId, $notes) {
            // Get or create user
            $user = Auth::user();
            if (! $user) {
                // Quick Checkout - create user
                $user = $this->createQuickCheckoutUser(
                    $billingData['email'],
                    $billingData['phone'] ?? null,
                    $billingData['first_name'],
                    $billingData['last_name']
                );

                // Log them in
                Auth::login($user);

                // Transfer cart to user
                $cart->update(['user_id' => $user->id, 'session_id' => null]);
            }

            // Get or create addresses
            $billingAddress = $this->getOrCreateAddress($user, $billingData, 'billing');

            // For shipping: if same_as_billing, merge billing contact info with shipping location data
            // This is because billing can be anywhere, but shipping is always to Malawi with specific city
            if ($shippingData['same_as_billing'] ?? true) {
                // Use billing contact info but shipping location (city, address, coordinates)
                $mergedShippingData = array_merge($shippingData, [
                    'first_name' => $billingData['first_name'] ?? '',
                    'last_name' => $billingData['last_name'] ?? '',
                    'phone' => $billingData['phone'] ?? null,
                ]);
                $shippingAddress = $this->getOrCreateAddress($user, $mergedShippingData, 'shipping');
            } else {
                $shippingAddress = $this->getOrCreateAddress($user, $shippingData, 'shipping');
            }

            // Create order
            $order = $this->createOrder($user, $cart, $billingAddress, $shippingAddress, $paymentGatewayId, $notes);

            // Create order items
            $this->createOrderItems($order, $cart);

            // Store cart ID in session for clearing after successful payment
            session(['pending_order_cart_id' => $cart->id]);

            // NOTE: Cart is NOT cleared here - it will be cleared after successful payment
            // This allows customers to retry payment or go back to cart if payment fails

            return $order->fresh(['items', 'user', 'shippingAddress', 'billingAddress']);
        });
    }

    /**
     * Create the order record
     */
    protected function createOrder(
        User $user,
        Cart $cart,
        UserAddress $billingAddress,
        UserAddress $shippingAddress,
        ?int $paymentGatewayId = null,
        ?string $notes = null
    ): Order {
        // Get default currency (MWK) - all orders are processed in MWK
        $currency = Currency::where('code', 'MWK')->first();

        // Calculate cart totals in MWK to ensure correct amount is sent to payment gateway
        $cartTotals = $this->cartService->calculateTotals($cart, 'MWK');

        // Get payment gateway name if provided
        $paymentGateway = null;
        if ($paymentGatewayId) {
            $gateway = \App\Models\PaymentGateway::find($paymentGatewayId);
            $paymentGateway = $gateway?->slug ?? $gateway?->name;
        }

        return Order::create([
            'user_id' => $user->id,
            'order_number' => $this->orderService->generateOrderNumber(),
            'status' => 'pending',
            'payment_status' => 'pending',
            'currency_id' => $currency?->id,
            'subtotal' => $cartTotals['subtotal'],
            'discount_amount' => $cartTotals['discount_total'] ?? 0,
            'promotion_discount_amount' => $cartTotals['promotion_discount'] ?? 0,
            'coupon_id' => $cart->coupon_id,
            'coupon_code' => $cart->coupon?->code,
            'shipping_amount' => $cartTotals['shipping'],
            'tax_amount' => $cartTotals['tax'],
            'total' => $cartTotals['total'],
            'billing_address_id' => $billingAddress->id,
            'shipping_address_id' => $shippingAddress->id,
            'billing_address_snapshot' => $billingAddress->toSnapshot(),
            'shipping_address_snapshot' => $shippingAddress->toSnapshot(),
            'payment_gateway' => $paymentGateway,
            'notes' => $notes,
        ]);
    }

    /**
     * Create order items from cart items
     */
    protected function createOrderItems(Order $order, Cart $cart): void
    {
        $cart->load(['items.product.seller', 'items.product.images', 'items.product.tags', 'items.variant', 'coupon']);

        // Get default currency
        $currency = Currency::where('code', 'MWK')->first();

        // Calculate cart totals in MWK to get per-item discounts
        $cartTotals = $this->cartService->calculateTotals($cart, 'MWK');
        $itemDiscounts = collect($cartTotals['items'])->keyBy('id');

        foreach ($cart->items as $cartItem) {
            $product = $cartItem->product;
            $variant = $cartItem->variant;

            // Get pricing breakdown in MWK (all orders are processed in MWK)
            $basePrice = $product->base_price;
            $priceData = $this->priceService->getPrice($product, 'MWK');
            $displayPrice = $priceData['amount'];
            $markupAmount = $displayPrice - $basePrice;

            // Handle variant pricing if applicable
            if ($variant) {
                $basePrice = $variant->price ?? $product->base_price;
                $variantPriceData = $this->priceService->getVariantPrice($variant, 'MWK');
                $displayPrice = $variantPriceData['amount'];
                $markupAmount = $displayPrice - $basePrice;
            }

            $itemData = $itemDiscounts->get($cartItem->id);
            $promoDiscount = $itemData['promotion_discount'] ?? 0;
            $couponDiscount = $itemData['coupon_discount'] ?? 0;

            $lineTotal = ($displayPrice * $cartItem->quantity) - $promoDiscount - $couponDiscount;

            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $product->id,
                'variant_id' => $variant?->id,
                'seller_id' => $product->seller_id,
                'product_name' => $product->name,
                'product_sku' => $product->sku,
                'variant_name' => $variant?->name,
                'product_image' => $product->primary_image_url,
                'quantity' => $cartItem->quantity,
                'base_price' => $basePrice,
                'markup_amount' => $markupAmount,
                'display_price' => $displayPrice,
                'line_total' => $lineTotal,
                'promotion_discount' => $promoDiscount,
                'coupon_discount' => $couponDiscount,
                'currency_id' => $currency?->id ?? 1,
                'seller_currency_id' => $product->currency_id ?? $currency?->id ?? 1,
                'exchange_rate_used' => 1,
                'status' => 'pending',
            ]);
        }

        // Record coupon usage
        if ($cart->coupon && $order->user_id) {
            $this->discountService->recordCouponUsage(
                $cart->coupon,
                $order->user,
                $order,
                $cartTotals['coupon_discount']
            );
        }

        // Update order totals from items
        $subtotal = $order->items()->sum(DB::raw('display_price * quantity'));
        $totalPromotionDiscount = $order->items()->sum('promotion_discount');
        $totalCouponDiscount = $order->items()->sum('coupon_discount');
        $totalLineAmount = $order->items()->sum('line_total');

        $order->update([
            'subtotal' => $subtotal,
            'promotion_discount_amount' => $totalPromotionDiscount,
            'discount_amount' => $totalCouponDiscount,
            'total' => $totalLineAmount + $order->shipping_amount + $order->tax_amount,
        ]);
    }

    /**
     * Get grouped items by seller for fulfillment display
     */
    public function getItemsGroupedBySeller(Order $order): array
    {
        $order->load(['items.seller', 'items.product']);

        $grouped = [];
        foreach ($order->items as $item) {
            $sellerId = $item->seller_id;
            if (! isset($grouped[$sellerId])) {
                $grouped[$sellerId] = [
                    'seller' => $item->seller,
                    'items' => [],
                    'subtotal' => 0,
                ];
            }
            $grouped[$sellerId]['items'][] = $item;
            $grouped[$sellerId]['subtotal'] += $item->line_total;
        }

        return array_values($grouped);
    }
}
