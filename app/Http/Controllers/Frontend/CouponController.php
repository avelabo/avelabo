<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Services\CartService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CouponController extends Controller
{
    public function __construct(
        protected CartService $cartService
    ) {}

    /**
     * Apply a coupon to the cart.
     */
    public function apply(Request $request): \Illuminate\Http\RedirectResponse
    {
        $request->validate([
            'code' => 'required|string|max:50',
        ]);

        $cart = $this->cartService->getOrCreateCart();

        try {
            $this->cartService->applyCoupon($cart, $request->code, Auth::user());
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }

        return back();
    }

    /**
     * Remove coupon from the cart.
     */
    public function remove(): \Illuminate\Http\RedirectResponse
    {
        $cart = $this->cartService->getOrCreateCart();
        $this->cartService->removeCoupon($cart);

        return back();
    }
}
