<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use App\Models\Order;
use App\Models\Product;
use App\Models\Promotion;
use App\Models\Seller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class TrashController extends Controller
{
    /**
     * Display the trash bin with all soft-deleted items.
     */
    public function index(Request $request): \Inertia\Response
    {
        $filter = $request->get('filter', 'all');

        $stats = [
            'products' => Product::onlyTrashed()->count(),
            'sellers' => Seller::onlyTrashed()->count(),
            'orders' => Order::onlyTrashed()->count(),
            'promotions' => Promotion::onlyTrashed()->count(),
            'coupons' => Coupon::onlyTrashed()->count(),
            'users' => User::onlyTrashed()->count(),
        ];

        $stats['total'] = array_sum($stats);

        $items = collect();

        if ($filter === 'all' || $filter === 'products') {
            $products = Product::onlyTrashed()
                ->with(['seller:id,shop_name', 'category:id,name'])
                ->withCount(['images', 'variants', 'reviews', 'cartItems', 'orderItems', 'wishlists'])
                ->get()
                ->map(fn ($p) => [
                    'id' => $p->id,
                    'type' => 'product',
                    'name' => $p->name,
                    'description' => $p->sku,
                    'deleted_at' => $p->deleted_at,
                    'meta' => [
                        'seller' => $p->seller?->shop_name,
                        'category' => $p->category?->name,
                    ],
                    'cascade' => array_filter([
                        $p->images_count > 0 ? "{$p->images_count} images" : null,
                        $p->variants_count > 0 ? "{$p->variants_count} variants" : null,
                        $p->reviews_count > 0 ? "{$p->reviews_count} reviews" : null,
                        $p->cart_items_count > 0 ? "{$p->cart_items_count} cart items" : null,
                        $p->order_items_count > 0 ? "{$p->order_items_count} order items" : null,
                        $p->wishlists_count > 0 ? "{$p->wishlists_count} wishlists" : null,
                    ]),
                ]);
            $items = $items->merge($products);
        }

        if ($filter === 'all' || $filter === 'sellers') {
            $sellers = Seller::onlyTrashed()
                ->with(['user:id,name,email'])
                ->withCount(['products', 'orders', 'bankAccounts', 'priceMarkups'])
                ->get()
                ->map(fn ($s) => [
                    'id' => $s->id,
                    'type' => 'seller',
                    'name' => $s->shop_name,
                    'description' => $s->user?->email,
                    'deleted_at' => $s->deleted_at,
                    'meta' => [
                        'owner' => $s->user?->name,
                    ],
                    'cascade' => array_filter([
                        $s->products_count > 0 ? "{$s->products_count} products" : null,
                        $s->orders_count > 0 ? "{$s->orders_count} orders" : null,
                        $s->bank_accounts_count > 0 ? "{$s->bank_accounts_count} bank accounts" : null,
                        $s->price_markups_count > 0 ? "{$s->price_markups_count} price markups" : null,
                    ]),
                ]);
            $items = $items->merge($sellers);
        }

        if ($filter === 'all' || $filter === 'orders') {
            $orders = Order::onlyTrashed()
                ->with(['user:id,name,email', 'seller:id,shop_name'])
                ->withCount(['items', 'statusHistory', 'payments', 'refunds'])
                ->get()
                ->map(fn ($o) => [
                    'id' => $o->id,
                    'type' => 'order',
                    'name' => "Order #{$o->order_number}",
                    'description' => $o->user?->name ?? 'Guest',
                    'deleted_at' => $o->deleted_at,
                    'meta' => [
                        'total' => number_format($o->total_amount, 2),
                        'status' => $o->status,
                    ],
                    'cascade' => array_filter([
                        $o->items_count > 0 ? "{$o->items_count} line items" : null,
                        $o->status_history_count > 0 ? "{$o->status_history_count} status entries" : null,
                        $o->payments_count > 0 ? "{$o->payments_count} payments" : null,
                        $o->refunds_count > 0 ? "{$o->refunds_count} refunds" : null,
                    ]),
                ]);
            $items = $items->merge($orders);
        }

        if ($filter === 'all' || $filter === 'promotions') {
            $promotions = Promotion::onlyTrashed()
                ->with(['seller:id,shop_name'])
                ->get()
                ->map(fn ($p) => [
                    'id' => $p->id,
                    'type' => 'promotion',
                    'name' => $p->name,
                    'description' => $p->discount_type.': '.$p->discount_value,
                    'deleted_at' => $p->deleted_at,
                    'meta' => [
                        'seller' => $p->seller?->shop_name,
                    ],
                    'cascade' => [],
                ]);
            $items = $items->merge($promotions);
        }

        if ($filter === 'all' || $filter === 'coupons') {
            $coupons = Coupon::onlyTrashed()
                ->withCount('users')
                ->get()
                ->map(fn ($c) => [
                    'id' => $c->id,
                    'type' => 'coupon',
                    'name' => $c->code,
                    'description' => $c->discount_type.': '.$c->discount_value,
                    'deleted_at' => $c->deleted_at,
                    'meta' => [
                        'usage' => "{$c->used_count}/{$c->usage_limit}",
                    ],
                    'cascade' => array_filter([
                        $c->users_count > 0 ? "{$c->users_count} user redemptions" : null,
                    ]),
                ]);
            $items = $items->merge($coupons);
        }

        if ($filter === 'all' || $filter === 'users') {
            $users = User::onlyTrashed()
                ->withCount(['addresses', 'orders', 'reviews', 'wishlists'])
                ->get()
                ->map(fn ($u) => [
                    'id' => $u->id,
                    'type' => 'user',
                    'name' => $u->name,
                    'description' => $u->email,
                    'deleted_at' => $u->deleted_at,
                    'meta' => [],
                    'cascade' => array_filter([
                        $u->addresses_count > 0 ? "{$u->addresses_count} addresses" : null,
                        $u->orders_count > 0 ? "{$u->orders_count} orders" : null,
                        $u->reviews_count > 0 ? "{$u->reviews_count} reviews" : null,
                        $u->wishlists_count > 0 ? "{$u->wishlists_count} wishlists" : null,
                    ]),
                ]);
            $items = $items->merge($users);
        }

        // Sort by deleted_at descending
        $items = $items->sortByDesc('deleted_at')->values();

        return Inertia::render('Admin/Trash/Index', [
            'items' => $items,
            'stats' => $stats,
            'filter' => $filter,
        ]);
    }

    /**
     * Restore a soft-deleted item.
     */
    public function restore(Request $request, string $type, int $id): \Illuminate\Http\RedirectResponse
    {
        $model = $this->getModel($type);

        if (! $model) {
            return back()->with('error', 'Invalid item type.');
        }

        $item = $model::onlyTrashed()->findOrFail($id);
        $item->restore();

        return back()->with('success', ucfirst($type).' restored successfully.');
    }

    /**
     * Permanently delete an item.
     */
    public function forceDelete(Request $request, string $type, int $id): \Illuminate\Http\RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'string'],
        ]);

        if (! Hash::check($request->password, $request->user()->password)) {
            return back()->withErrors(['password' => 'The password is incorrect.']);
        }

        $model = $this->getModel($type);

        if (! $model) {
            return back()->with('error', 'Invalid item type.');
        }

        $item = $model::onlyTrashed()->findOrFail($id);

        DB::transaction(function () use ($item, $type) {
            // Handle cascade deletes based on type
            $this->handleCascadeDeletes($item, $type);
            $item->forceDelete();
        });

        return back()->with('success', ucfirst($type).' permanently deleted.');
    }

    /**
     * Empty the entire trash bin or by type.
     */
    public function empty(Request $request): \Illuminate\Http\RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'string'],
            'type' => ['nullable', 'string', 'in:all,products,sellers,orders,promotions,coupons,users'],
        ]);

        if (! Hash::check($request->password, $request->user()->password)) {
            return back()->withErrors(['password' => 'The password is incorrect.']);
        }

        $type = $request->get('type', 'all');

        DB::transaction(function () use ($type) {
            if ($type === 'all' || $type === 'products') {
                Product::onlyTrashed()->each(function ($item) {
                    $this->handleCascadeDeletes($item, 'product');
                    $item->forceDelete();
                });
            }

            if ($type === 'all' || $type === 'promotions') {
                Promotion::onlyTrashed()->forceDelete();
            }

            if ($type === 'all' || $type === 'coupons') {
                Coupon::onlyTrashed()->each(function ($item) {
                    $this->handleCascadeDeletes($item, 'coupon');
                    $item->forceDelete();
                });
            }

            if ($type === 'all' || $type === 'orders') {
                Order::onlyTrashed()->each(function ($item) {
                    $this->handleCascadeDeletes($item, 'order');
                    $item->forceDelete();
                });
            }

            if ($type === 'all' || $type === 'sellers') {
                Seller::onlyTrashed()->each(function ($item) {
                    $this->handleCascadeDeletes($item, 'seller');
                    $item->forceDelete();
                });
            }

            if ($type === 'all' || $type === 'users') {
                User::onlyTrashed()->each(function ($item) {
                    $this->handleCascadeDeletes($item, 'user');
                    $item->forceDelete();
                });
            }
        });

        $message = $type === 'all' ? 'Trash emptied successfully.' : ucfirst($type).' trash emptied successfully.';

        return back()->with('success', $message);
    }

    /**
     * Restore all items or by type.
     */
    public function restoreAll(Request $request): \Illuminate\Http\RedirectResponse
    {
        $type = $request->get('type', 'all');

        DB::transaction(function () use ($type) {
            if ($type === 'all' || $type === 'products') {
                Product::onlyTrashed()->restore();
            }
            if ($type === 'all' || $type === 'sellers') {
                Seller::onlyTrashed()->restore();
            }
            if ($type === 'all' || $type === 'orders') {
                Order::onlyTrashed()->restore();
            }
            if ($type === 'all' || $type === 'promotions') {
                Promotion::onlyTrashed()->restore();
            }
            if ($type === 'all' || $type === 'coupons') {
                Coupon::onlyTrashed()->restore();
            }
            if ($type === 'all' || $type === 'users') {
                User::onlyTrashed()->restore();
            }
        });

        $message = $type === 'all' ? 'All items restored successfully.' : ucfirst($type).' restored successfully.';

        return back()->with('success', $message);
    }

    /**
     * Get cascade delete information for a specific item.
     */
    public function getCascadeInfo(Request $request, string $type, int $id): \Illuminate\Http\JsonResponse
    {
        $model = $this->getModel($type);

        if (! $model) {
            return response()->json(['error' => 'Invalid item type.'], 400);
        }

        $item = $model::onlyTrashed()->findOrFail($id);
        $cascadeInfo = $this->getCascadeDetails($item, $type);

        return response()->json($cascadeInfo);
    }

    /**
     * Get the model class for a given type.
     */
    private function getModel(string $type): ?string
    {
        return match ($type) {
            'product' => Product::class,
            'seller' => Seller::class,
            'order' => Order::class,
            'promotion' => Promotion::class,
            'coupon' => Coupon::class,
            'user' => User::class,
            default => null,
        };
    }

    /**
     * Handle cascade deletes for an item.
     */
    private function handleCascadeDeletes($item, string $type): void
    {
        match ($type) {
            'product' => $this->cascadeDeleteProduct($item),
            'seller' => $this->cascadeDeleteSeller($item),
            'order' => $this->cascadeDeleteOrder($item),
            'coupon' => $this->cascadeDeleteCoupon($item),
            'user' => $this->cascadeDeleteUser($item),
            default => null,
        };
    }

    private function cascadeDeleteProduct($product): void
    {
        $product->images()->delete();
        $product->variants()->delete();
        $product->reviews()->delete();
        $product->cartItems()->delete();
        $product->wishlists()->delete();
        // OrderItems are preserved for historical records
    }

    private function cascadeDeleteSeller($seller): void
    {
        // Delete all products first (which cascades to their relations)
        $seller->products()->withTrashed()->each(function ($product) {
            $this->cascadeDeleteProduct($product);
            $product->forceDelete();
        });

        $seller->bankAccounts()->delete();
        $seller->priceMarkups()->delete();
        $seller->kyc()?->delete();
    }

    private function cascadeDeleteOrder($order): void
    {
        $order->items()->delete();
        $order->statusHistory()->delete();
        $order->payments()->delete();
        $order->refunds()->delete();
    }

    private function cascadeDeleteCoupon($coupon): void
    {
        $coupon->users()->detach();
    }

    private function cascadeDeleteUser($user): void
    {
        $user->addresses()->delete();
        $user->reviews()->delete();
        $user->wishlists()->delete();

        // Delete seller if exists
        if ($user->seller) {
            $this->cascadeDeleteSeller($user->seller);
            $user->seller->forceDelete();
        }
    }

    /**
     * Get detailed cascade information for preview.
     */
    private function getCascadeDetails($item, string $type): array
    {
        return match ($type) {
            'product' => [
                'images' => $item->images()->count(),
                'variants' => $item->variants()->count(),
                'reviews' => $item->reviews()->count(),
                'cart_items' => $item->cartItems()->count(),
                'wishlists' => $item->wishlists()->count(),
                'order_items' => $item->orderItems()->count(),
            ],
            'seller' => [
                'products' => $item->products()->withTrashed()->count(),
                'orders' => $item->orders()->count(),
                'bank_accounts' => $item->bankAccounts()->count(),
                'price_markups' => $item->priceMarkups()->count(),
                'kyc' => $item->kyc ? 1 : 0,
            ],
            'order' => [
                'items' => $item->items()->count(),
                'status_history' => $item->statusHistory()->count(),
                'payments' => $item->payments()->count(),
                'refunds' => $item->refunds()->count(),
            ],
            'coupon' => [
                'user_redemptions' => $item->users()->count(),
            ],
            'user' => [
                'addresses' => $item->addresses()->count(),
                'orders' => $item->orders()->count(),
                'reviews' => $item->reviews()->count(),
                'wishlists' => $item->wishlists()->count(),
                'seller' => $item->seller ? 1 : 0,
            ],
            default => [],
        };
    }
}
