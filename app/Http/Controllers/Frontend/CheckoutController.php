<?php

namespace App\Http\Controllers\Frontend;

use App\Actions\Fortify\CreateNewUser;
use App\Http\Controllers\Controller;
use App\Models\City;
use App\Models\Country;
use App\Models\PaymentGateway;
use App\Services\CartService;
use App\Services\CheckoutService;
use App\Services\OrderService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    public function __construct(
        protected CartService $cartService,
        protected CheckoutService $checkoutService,
        protected OrderService $orderService
    ) {}

    /**
     * Display checkout page
     */
    public function show()
    {
        $cart = $this->cartService->getOrCreateCart();
        $cartData = $this->cartService->calculateTotals($cart);

        // Check if cart is empty
        if (empty($cartData['items'])) {
            return redirect()->route('cart')->with('error', 'Your cart is empty');
        }

        // Get available payment gateways
        $paymentGateways = PaymentGateway::active()
            ->ordered()
            ->get(['id', 'name', 'slug', 'display_name', 'description', 'logo']);

        // Get countries for address form
        $countries = Country::where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'code', 'code_2']);

        // Get Malawi (the only country we deliver to)
        $malawi = Country::where('code', 'MWI')->first(['id', 'name', 'code']);

        // Get delivery cities in Malawi with region info (only cities with delivery available)
        $deliveryCities = [];
        if ($malawi) {
            $deliveryCities = City::query()
                ->whereHas('region', function ($query) use ($malawi) {
                    $query->where('country_id', $malawi->id);
                })
                ->with('region:id,name,code')
                ->active()
                ->deliveryAvailable()
                ->orderBy('name')
                ->get(['id', 'region_id', 'name'])
                ->map(fn ($city) => [
                    'id' => $city->id,
                    'name' => $city->name,
                    'region_id' => $city->region_id,
                    'region_name' => $city->region->name,
                    'region_code' => $city->region->code,
                ]);
        }

        // Get user's addresses if logged in
        $user = Auth::user();
        $savedAddresses = [];
        if ($user) {
            $savedAddresses = $user->addresses()
                ->with('country')
                ->get()
                ->map(fn ($addr) => [
                    'id' => $addr->id,
                    'label' => $addr->label,
                    'name' => $addr->full_name,
                    'address' => $addr->full_address,
                    'is_default' => $addr->is_default,
                    'is_billing' => $addr->is_billing,
                ]);
        }

        return Inertia::render('Frontend/Checkout', [
            'cart' => $cartData,
            'paymentGateways' => $paymentGateways,
            'countries' => $countries,
            'malawi' => $malawi,
            'deliveryCities' => $deliveryCities,
            'savedAddresses' => $savedAddresses,
            'user' => $user ? [
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
            ] : null,
        ]);
    }

    /**
     * Process checkout
     */
    public function process(Request $request)
    {
        Log::info('Checkout process started', ['request_data' => $request->all()]);

        // Check if billing country is Malawi
        $malawi = Country::where('code', 'MWI')->first();
        $billingIsMalawi = $malawi && $request->input('billing.country_id') == $malawi->id;

        try {
            $rules = [
                // Billing info
                'billing.first_name' => 'required|string|max:100',
                'billing.last_name' => 'required|string|max:100',
                'billing.email' => 'required|email|max:255',
                'billing.phone' => 'required|string|max:20',
                'billing.address_line_2' => 'nullable|string|max:255',
                'billing.city' => 'nullable|string|max:100',
                'billing.city_id' => 'nullable|exists:cities,id',
                'billing.state' => 'nullable|string|max:100',
                'billing.postal_code' => 'nullable|string|max:20',
                'billing.country_id' => 'required|exists:countries,id',

                // Shipping info (always to Malawi)
                'shipping.same_as_billing' => 'boolean',
                'shipping.first_name' => 'required_if:shipping.same_as_billing,false|nullable|string|max:100',
                'shipping.last_name' => 'required_if:shipping.same_as_billing,false|nullable|string|max:100',
                'shipping.phone' => 'required_if:shipping.same_as_billing,false|nullable|string|max:20',
                'shipping.address_line_1' => 'nullable|string|max:255',
                'shipping.address_line_2' => 'nullable|string|max:255',
                'shipping.city' => 'nullable|string|max:100',
                'shipping.city_id' => 'required|exists:cities,id',
                'shipping.state' => 'nullable|string|max:100',
                'shipping.postal_code' => 'nullable|string|max:20',
                'shipping.country_id' => 'nullable|exists:countries,id',

                // Payment
                'payment_gateway_id' => 'required|exists:payment_gateways,id',

                // Optional
                'notes' => 'nullable|string|max:1000',
                'create_account' => 'boolean',
            ];

            // Billing address is only required for non-Malawi countries
            if ($billingIsMalawi) {
                $rules['billing.address_line_1'] = 'nullable|string|max:255';
            } else {
                $rules['billing.address_line_1'] = 'required|string|max:255';
            }

            $validated = $request->validate($rules);

            Log::info('Checkout validation passed', ['validated' => $validated]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Checkout validation failed', [
                'errors' => $e->errors(),
                'request_data' => $request->all(),
            ]);
            throw $e;
        }

        $cart = $this->cartService->getOrCreateCart();

        // Validate checkout
        $errors = $this->checkoutService->validateCheckout(
            $cart,
            $validated['billing'],
            $validated['shipping'] ?? []
        );

        if (! empty($errors)) {
            Log::error('Checkout service validation failed', ['errors' => $errors]);

            return back()->withErrors($errors)->withInput();
        }

        // If user is already logged in, process checkout directly
        if (Auth::check()) {
            try {
                $order = $this->checkoutService->processCheckout(
                    $cart,
                    $validated['billing'],
                    $validated['shipping'] ?? ['same_as_billing' => true],
                    null,
                    $validated['notes'] ?? null
                );

                Log::info('Order created successfully', ['order_id' => $order->id, 'order_number' => $order->order_number]);

                session(['checkout_payment_gateway' => $validated['payment_gateway_id']]);

                return redirect()->route('payment.initiate', $order);

            } catch (\Exception $e) {
                Log::error('Checkout process failed', [
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString(),
                ]);

                return back()->withErrors(['error' => $e->getMessage()])->withInput();
            }
        }

        // Guest checkout - store data in session and redirect to account prompt
        session([
            'checkout_data' => [
                'billing' => $validated['billing'],
                'shipping' => $validated['shipping'] ?? ['same_as_billing' => true],
                'notes' => $validated['notes'] ?? null,
                'payment_gateway_id' => $validated['payment_gateway_id'],
            ],
        ]);

        return redirect()->route('checkout.account-prompt');
    }

    /**
     * Checkout success page
     */
    public function success(Request $request)
    {
        $orderNumber = $request->get('order');

        if (! $orderNumber) {
            return redirect()->route('home');
        }

        $order = \App\Models\Order::where('order_number', $orderNumber)->first();

        if (! $order) {
            return redirect()->route('home');
        }

        // Get order data for customer view
        $orderData = $this->orderService->getOrderForCustomer($order);

        return Inertia::render('Frontend/CheckoutSuccess', [
            'order' => $orderData,
        ]);
    }

    /**
     * Checkout cancelled page
     */
    public function cancel(Request $request)
    {
        $orderNumber = $request->get('order');

        return Inertia::render('Frontend/CheckoutCancel', [
            'order_number' => $orderNumber,
            'message' => 'Your payment was cancelled. You can try again or contact support.',
        ]);
    }

    /**
     * Show account prompt page for guest checkout
     */
    public function showAccountPrompt()
    {
        $checkoutData = session('checkout_data');

        if (! $checkoutData) {
            return redirect()->route('checkout')->with('error', 'Please complete checkout form first.');
        }

        // If user is already logged in, skip this step
        if (Auth::check()) {
            return $this->processGuestCheckout();
        }

        return Inertia::render('Frontend/CheckoutAccountPrompt', [
            'billing' => $checkoutData['billing'],
        ]);
    }

    /**
     * Create account during checkout and proceed to payment
     */
    public function createAccountAndCheckout(Request $request)
    {
        $checkoutData = session('checkout_data');

        if (! $checkoutData) {
            return redirect()->route('checkout')->with('error', 'Session expired. Please try again.');
        }

        $validated = $request->validate([
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        try {
            // Use Fortify's CreateNewUser action
            $createUser = app(CreateNewUser::class);
            $user = $createUser->create([
                'name' => trim($checkoutData['billing']['first_name'].' '.$checkoutData['billing']['last_name']),
                'email' => $checkoutData['billing']['email'],
                'password' => $validated['password'],
                'password_confirmation' => $validated['password'],
            ]);

            // Update user phone if provided
            if (! empty($checkoutData['billing']['phone'])) {
                $user->update(['phone' => $checkoutData['billing']['phone']]);
            }

            // Log the user in
            Auth::login($user);

            // Transfer cart to user
            $cart = $this->cartService->getOrCreateCart();
            $cart->update(['user_id' => $user->id, 'session_id' => null]);

            // Process checkout
            return $this->processGuestCheckout();

        } catch (\Illuminate\Validation\ValidationException $e) {
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            Log::error('Account creation during checkout failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return back()->withErrors(['error' => 'Failed to create account. '.$e->getMessage()])->withInput();
        }
    }

    /**
     * Continue as guest and proceed to payment
     */
    public function continueAsGuest()
    {
        $checkoutData = session('checkout_data');

        if (! $checkoutData) {
            return redirect()->route('checkout')->with('error', 'Session expired. Please try again.');
        }

        return $this->processGuestCheckout();
    }

    /**
     * Process checkout for guest (with or without account creation)
     */
    protected function processGuestCheckout()
    {
        $checkoutData = session('checkout_data');

        if (! $checkoutData) {
            return redirect()->route('checkout')->with('error', 'Session expired. Please try again.');
        }

        $cart = $this->cartService->getOrCreateCart();

        try {
            $order = $this->checkoutService->processCheckout(
                $cart,
                $checkoutData['billing'],
                $checkoutData['shipping'],
                null,
                $checkoutData['notes'] ?? null
            );

            Log::info('Order created successfully', ['order_id' => $order->id, 'order_number' => $order->order_number]);

            // Store payment gateway selection and clear checkout data
            session(['checkout_payment_gateway' => $checkoutData['payment_gateway_id']]);
            session()->forget('checkout_data');

            return redirect()->route('payment.initiate', $order);

        } catch (\Exception $e) {
            Log::error('Guest checkout process failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return redirect()->route('checkout')->withErrors(['error' => $e->getMessage()])->withInput();
        }
    }
}
