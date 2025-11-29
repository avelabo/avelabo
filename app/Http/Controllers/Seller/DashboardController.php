<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Show seller dashboard
     */
    public function index()
    {
        $user = Auth::user();
        $seller = $user->seller;

        if (!$seller) {
            return redirect()->route('seller.register');
        }

        // Check seller status
        if ($seller->status !== 'approved') {
            return redirect()->route('seller.kyc.status');
        }

        // Get dashboard stats
        $stats = [
            'total_products' => Product::where('seller_id', $seller->id)->count(),
            'active_products' => Product::where('seller_id', $seller->id)->where('status', 'active')->count(),
            'total_orders' => Order::where('seller_id', $seller->id)->count(),
            'pending_orders' => Order::where('seller_id', $seller->id)->where('status', 'pending')->count(),
            'total_revenue' => Order::where('seller_id', $seller->id)
                ->whereNotNull('paid_at')
                ->sum('total'),
            'this_month_revenue' => Order::where('seller_id', $seller->id)
                ->whereNotNull('paid_at')
                ->whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->sum('total'),
        ];

        // Get recent orders
        $recentOrders = Order::where('seller_id', $seller->id)
            ->with(['user:id,name,email', 'items.product:id,name'])
            ->latest()
            ->take(5)
            ->get();

        // Get low stock products
        $lowStockProducts = Product::where('seller_id', $seller->id)
            ->where('track_inventory', true)
            ->whereColumn('stock_quantity', '<=', 'low_stock_threshold')
            ->where('stock_quantity', '>', 0)
            ->take(5)
            ->get(['id', 'name', 'stock_quantity', 'low_stock_threshold']);

        return Inertia::render('Seller/Dashboard', [
            'seller' => $seller->only(['id', 'shop_name', 'logo', 'rating', 'status']),
            'stats' => $stats,
            'recentOrders' => $recentOrders,
            'lowStockProducts' => $lowStockProducts,
        ]);
    }
}
