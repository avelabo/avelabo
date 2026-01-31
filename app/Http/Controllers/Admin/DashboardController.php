<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Payment;
use App\Models\Product;
use App\Models\Seller;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $now = Carbon::now();
        $startOfMonth = $now->copy()->startOfMonth();
        $startOfLastMonth = $now->copy()->subMonth()->startOfMonth();
        $endOfLastMonth = $now->copy()->subMonth()->endOfMonth();

        // Core Stats
        $totalRevenue = Payment::where('status', 'paid')->sum('amount');
        $lastMonthRevenue = Payment::where('status', 'paid')
            ->whereBetween('created_at', [$startOfLastMonth, $endOfLastMonth])
            ->sum('amount');
        $thisMonthRevenue = Payment::where('status', 'paid')
            ->where('created_at', '>=', $startOfMonth)
            ->sum('amount');
        $revenueChange = $lastMonthRevenue > 0
            ? round((($thisMonthRevenue - $lastMonthRevenue) / $lastMonthRevenue) * 100, 1)
            : 0;

        $totalOrders = Order::count();
        $lastMonthOrders = Order::whereBetween('created_at', [$startOfLastMonth, $endOfLastMonth])->count();
        $thisMonthOrders = Order::where('created_at', '>=', $startOfMonth)->count();
        $ordersChange = $lastMonthOrders > 0
            ? round((($thisMonthOrders - $lastMonthOrders) / $lastMonthOrders) * 100, 1)
            : 0;

        $totalProducts = Product::count();
        $activeProducts = Product::where('status', 'active')->count();

        $totalCustomers = User::whereDoesntHave('roles', fn ($q) => $q->where('slug', 'admin'))->count();
        $newCustomersThisMonth = User::whereDoesntHave('roles', fn ($q) => $q->where('slug', 'admin'))
            ->where('created_at', '>=', $startOfMonth)
            ->count();
        $newCustomersLastMonth = User::whereDoesntHave('roles', fn ($q) => $q->where('slug', 'admin'))
            ->whereBetween('created_at', [$startOfLastMonth, $endOfLastMonth])
            ->count();
        $customersChange = $newCustomersLastMonth > 0
            ? round((($newCustomersThisMonth - $newCustomersLastMonth) / $newCustomersLastMonth) * 100, 1)
            : 0;

        $stats = [
            'total_revenue' => $totalRevenue,
            'this_month_revenue' => $thisMonthRevenue,
            'revenue_change' => $revenueChange,
            'total_orders' => $totalOrders,
            'this_month_orders' => $thisMonthOrders,
            'orders_change' => $ordersChange,
            'pending_orders' => Order::where('status', 'pending')->count(),
            'processing_orders' => Order::where('status', 'processing')->count(),
            'total_products' => $totalProducts,
            'active_products' => $activeProducts,
            'total_customers' => $totalCustomers,
            'new_customers' => $newCustomersThisMonth,
            'customers_change' => $customersChange,
            'total_sellers' => Seller::count(),
            'active_sellers' => Seller::where('status', 'active')->count(),
        ];

        // Revenue by Region (from shipping addresses)
        $revenueByRegion = Order::select('user_addresses.region_name', DB::raw('SUM(orders.total) as revenue'))
            ->join('user_addresses', 'orders.shipping_address_id', '=', 'user_addresses.id')
            ->whereNotNull('orders.paid_at')
            ->whereNotNull('user_addresses.region_name')
            ->groupBy('user_addresses.region_name')
            ->orderByDesc('revenue')
            ->limit(6)
            ->get()
            ->map(function ($item) use ($totalRevenue) {
                return [
                    'region' => $item->region_name,
                    'revenue' => (float) $item->revenue,
                    'percentage' => $totalRevenue > 0 ? round(($item->revenue / $totalRevenue) * 100, 1) : 0,
                ];
            });

        // Sales data for chart (last 12 months)
        $salesChart = collect(range(11, 0))->map(function ($monthsAgo) {
            $date = Carbon::now()->subMonths($monthsAgo);

            return [
                'month' => $date->format('M'),
                'revenue' => Payment::where('status', 'paid')
                    ->whereYear('created_at', $date->year)
                    ->whereMonth('created_at', $date->month)
                    ->sum('amount'),
                'orders' => Order::whereYear('created_at', $date->year)
                    ->whereMonth('created_at', $date->month)
                    ->count(),
            ];
        });

        // Latest Orders
        $latestOrders = Order::with(['user:id,first_name,last_name,email', 'shippingAddress:id,city_name,region_name'])
            ->latest()
            ->take(5)
            ->get()
            ->map(fn ($order) => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'customer_name' => $order->user?->name ?? 'Guest',
                'customer_email' => $order->user?->email ?? '',
                'total' => (float) $order->total,
                'status' => $order->status,
                'location' => $order->shippingAddress?->city_name ?? $order->shippingAddress?->region_name ?? '-',
                'created_at' => $order->created_at->format('M d, Y'),
            ]);

        // New Members
        $newMembers = User::whereDoesntHave('roles', fn ($q) => $q->where('slug', 'admin'))
            ->latest()
            ->take(5)
            ->get(['id', 'first_name', 'last_name', 'email', 'created_at'])
            ->map(fn ($user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'joined' => $user->created_at->diffForHumans(),
                'initials' => strtoupper(substr($user->first_name, 0, 1)).strtoupper(substr($user->last_name, 0, 1)),
            ]);

        // Top Selling Products
        $topProducts = Product::select('products.id', 'products.name', 'products.base_price', DB::raw('SUM(order_items.quantity) as total_sold'))
            ->join('order_items', 'products.id', '=', 'order_items.product_id')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->whereNotNull('orders.paid_at')
            ->groupBy('products.id', 'products.name', 'products.base_price')
            ->orderByDesc('total_sold')
            ->limit(5)
            ->get();

        // Order Status Distribution
        $orderStatusDistribution = Order::select('status', DB::raw('COUNT(*) as count'))
            ->groupBy('status')
            ->get()
            ->pluck('count', 'status');

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'revenueByRegion' => $revenueByRegion,
            'salesChart' => $salesChart,
            'latestOrders' => $latestOrders,
            'newMembers' => $newMembers,
            'topProducts' => $topProducts,
            'orderStatusDistribution' => $orderStatusDistribution,
        ]);
    }
}
