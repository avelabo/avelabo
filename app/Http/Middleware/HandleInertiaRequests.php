<?php

namespace App\Http\Middleware;

use App\Models\Cart;
use App\Models\Category;
use App\Models\ContactMessage;
use App\Models\Currency;
use App\Models\Setting;
use App\Models\Wishlist;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'seller' => fn () => $request->user()?->seller,
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
            'ziggy' => fn () => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'currencies' => fn () => [
                'default' => Currency::where('is_default', true)->first()?->only(['code', 'symbol', 'symbol_before', 'decimal_places']) ?? [
                    'code' => 'MWK',
                    'symbol' => 'MK',
                    'symbol_before' => true,
                    'decimal_places' => 2,
                ],
                'active' => Currency::where('is_active', true)->get(['code', 'symbol', 'name', 'symbol_before', 'decimal_places']),
                'selected' => $request->session()->get('currency'),
            ],
            'counts' => fn () => [
                'cart' => $this->getCartCount($request),
                'wishlist' => $this->getWishlistCount($request),
                'compare' => count($request->session()->get('compare', [])),
            ],
            'headerCategories' => fn () => Category::active()
                ->root()
                ->ordered()
                ->with(['children' => function ($query) {
                    $query->active()->ordered()->limit(10);
                }])
                ->limit(12)
                ->get(['id', 'name', 'slug', 'icon']),
            'siteSettings' => fn () => Setting::public()->pluck('value', 'key'),
            'adminCounts' => fn () => $this->getAdminCounts($request),
        ];
    }

    private function getCartCount(Request $request): int
    {
        $userId = $request->user()?->id;
        $cartToken = $request->attributes->get('cart_token') ?? $request->cookie('cart_token');

        $cart = Cart::active()
            ->when($userId, fn ($q) => $q->forUser($userId))
            ->when(! $userId && $cartToken, fn ($q) => $q->forGuest($cartToken))
            ->with('items')
            ->first();

        return $cart ? $cart->items->sum('quantity') : 0;
    }

    private function getWishlistCount(Request $request): int
    {
        if ($request->user()) {
            return Wishlist::where('user_id', $request->user()->id)->count();
        }

        $wishlistToken = $request->attributes->get('wishlist_token') ?? $request->cookie('wishlist_token');

        if ($wishlistToken) {
            return Wishlist::where('guest_token', $wishlistToken)->count();
        }

        return 0;
    }

    private function getAdminCounts(Request $request): ?array
    {
        $user = $request->user();

        if (! $user || $user->role !== 'admin') {
            return null;
        }

        return [
            'unread_messages' => ContactMessage::where('status', 'new')->count(),
        ];
    }
}
