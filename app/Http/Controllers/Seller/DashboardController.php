<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
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

        if (! $seller) {
            return redirect()->route('seller.register');
        }

        // Check seller status
        if ($seller->status !== 'active') {
            return redirect()->route('seller.kyc.status');
        }

        $now = Carbon::now();
        $startOfMonth = $now->copy()->startOfMonth();
        $startOfLastMonth = $now->copy()->subMonth()->startOfMonth();
        $endOfLastMonth = $now->copy()->subMonth()->endOfMonth();

        // Revenue calculations
        $totalRevenue = Order::where('seller_id', $seller->id)
            ->whereNotNull('paid_at')
            ->sum('total');

        $thisMonthRevenue = Order::where('seller_id', $seller->id)
            ->whereNotNull('paid_at')
            ->where('created_at', '>=', $startOfMonth)
            ->sum('total');

        $lastMonthRevenue = Order::where('seller_id', $seller->id)
            ->whereNotNull('paid_at')
            ->whereBetween('created_at', [$startOfLastMonth, $endOfLastMonth])
            ->sum('total');

        $revenueChange = $lastMonthRevenue > 0
            ? round((($thisMonthRevenue - $lastMonthRevenue) / $lastMonthRevenue) * 100, 1)
            : 0;

        // Get dashboard stats
        $stats = [
            'total_products' => Product::where('seller_id', $seller->id)->count(),
            'active_products' => Product::where('seller_id', $seller->id)->where('status', 'active')->count(),
            'draft_products' => Product::where('seller_id', $seller->id)->where('status', 'draft')->count(),
            'total_orders' => Order::where('seller_id', $seller->id)->count(),
            'pending_orders' => Order::where('seller_id', $seller->id)->where('status', 'pending')->count(),
            'processing_orders' => Order::where('seller_id', $seller->id)->where('status', 'processing')->count(),
            'completed_orders' => Order::where('seller_id', $seller->id)->where('status', 'delivered')->count(),
            'total_revenue' => $totalRevenue,
            'this_month_revenue' => $thisMonthRevenue,
            'last_month_revenue' => $lastMonthRevenue,
            'revenue_change' => $revenueChange,
        ];

        // Sales chart data (last 6 months)
        $salesChart = collect(range(5, 0))->map(function ($monthsAgo) use ($seller) {
            $date = Carbon::now()->subMonths($monthsAgo);

            return [
                'month' => $date->format('M'),
                'revenue' => Order::where('seller_id', $seller->id)
                    ->whereNotNull('paid_at')
                    ->whereYear('created_at', $date->year)
                    ->whereMonth('created_at', $date->month)
                    ->sum('total'),
                'orders' => Order::where('seller_id', $seller->id)
                    ->whereYear('created_at', $date->year)
                    ->whereMonth('created_at', $date->month)
                    ->count(),
            ];
        });

        // Revenue by region
        $revenueByRegion = Order::where('orders.seller_id', $seller->id)
            ->select('user_addresses.region_name', DB::raw('SUM(orders.total) as revenue'))
            ->join('user_addresses', 'orders.shipping_address_id', '=', 'user_addresses.id')
            ->whereNotNull('orders.paid_at')
            ->whereNotNull('user_addresses.region_name')
            ->groupBy('user_addresses.region_name')
            ->orderByDesc('revenue')
            ->limit(5)
            ->get()
            ->map(function ($item) use ($totalRevenue) {
                return [
                    'region' => $item->region_name,
                    'revenue' => (float) $item->revenue,
                    'percentage' => $totalRevenue > 0 ? round(($item->revenue / $totalRevenue) * 100, 1) : 0,
                ];
            });

        // Get recent orders
        $recentOrders = Order::where('seller_id', $seller->id)
            ->with(['user:id,name,email', 'shippingAddress:id,city_name,region_name'])
            ->latest()
            ->take(5)
            ->get()
            ->map(fn ($order) => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'customer_name' => $order->user?->name ?? 'Guest',
                'total' => (float) $order->total,
                'status' => $order->status,
                'location' => $order->shippingAddress?->city_name ?? $order->shippingAddress?->region_name ?? '-',
                'created_at' => $order->created_at->format('M d, Y'),
            ]);

        // Get low stock products
        $lowStockProducts = Product::where('seller_id', $seller->id)
            ->where('track_inventory', true)
            ->whereColumn('stock_quantity', '<=', 'low_stock_threshold')
            ->where('stock_quantity', '>', 0)
            ->take(5)
            ->get(['id', 'name', 'stock_quantity', 'low_stock_threshold']);

        // Top selling products
        $topProducts = Product::select('products.id', 'products.name', 'products.base_price', DB::raw('SUM(order_items.quantity) as total_sold'))
            ->where('products.seller_id', $seller->id)
            ->join('order_items', 'products.id', '=', 'order_items.product_id')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->whereNotNull('orders.paid_at')
            ->groupBy('products.id', 'products.name', 'products.base_price')
            ->orderByDesc('total_sold')
            ->limit(5)
            ->get();

        return Inertia::render('Seller/Dashboard', [
            'seller' => $seller->only(['id', 'shop_name', 'logo', 'rating', 'status']),
            'stats' => $stats,
            'salesChart' => $salesChart,
            'revenueByRegion' => $revenueByRegion,
            'recentOrders' => $recentOrders,
            'lowStockProducts' => $lowStockProducts,
            'topProducts' => $topProducts,
        ]);
    }
}
