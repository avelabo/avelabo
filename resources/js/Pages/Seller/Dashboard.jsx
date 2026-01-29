import { Head, Link } from '@inertiajs/react';
import SellerLayout from '@/Layouts/SellerLayout';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function SellerDashboard({ seller, stats, salesChart, revenueByRegion, recentOrders, lowStockProducts, topProducts }) {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-MW', {
            style: 'currency',
            currency: 'MWK',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount || 0);
    };

    const formatNumber = (num) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num?.toString() || '0';
    };

    // Chart colors - clean, minimal palette
    const chartColors = {
        primary: '#1a1a1a',
        primaryLight: 'rgba(26, 26, 26, 0.08)',
        accent: '#d4a853',
        secondary: '#3b82f6',
    };

    // Sales Chart
    const salesChartData = {
        labels: salesChart?.map(item => item.month) || [],
        datasets: [
            {
                label: 'Revenue',
                data: salesChart?.map(item => item.revenue) || [],
                borderColor: chartColors.primary,
                backgroundColor: chartColors.primaryLight,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: chartColors.primary,
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 4,
            },
        ],
    };

    const salesChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#1a1a1a',
                padding: 12,
                cornerRadius: 8,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: 'rgba(0, 0, 0, 0.04)' },
                ticks: { callback: (value) => formatNumber(value) },
            },
            x: { grid: { display: false } },
        },
    };

    // Orders Chart
    const ordersChartData = {
        labels: salesChart?.map(item => item.month) || [],
        datasets: [{
            label: 'Orders',
            data: salesChart?.map(item => item.orders) || [],
            backgroundColor: chartColors.secondary,
            borderRadius: 6,
            maxBarThickness: 32,
        }],
    };

    const ordersChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            y: { beginAtZero: true, grid: { color: 'rgba(0, 0, 0, 0.04)' } },
            x: { grid: { display: false } },
        },
    };

    const regionColors = ['#1a1a1a', '#d4a853', '#666666', '#3b82f6', '#22c55e'];

    const getStatusBadge = (status) => {
        const styles = {
            pending: 'bg-warning-light text-warning',
            processing: 'bg-info-light text-info',
            shipped: 'bg-purple-100 text-purple-700',
            delivered: 'bg-success-light text-success',
            cancelled: 'bg-surface-sunken text-muted',
        };
        return styles[status] || 'bg-surface-sunken text-muted';
    };

    return (
        <SellerLayout title="Dashboard">
            <Head title="Seller Dashboard" />

            <div className="space-y-6">
                {/* Welcome Banner */}
                <div className="bg-surface rounded-xl p-6 md:p-8 border border-border">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-heading mb-2">
                                Welcome back, {seller?.shop_name}!
                            </h1>
                            <p className="text-muted">
                                Here's what's happening with your store. Keep up the great work!
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Link
                                href={route('seller.products.create')}
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand text-white rounded-lg text-sm font-semibold hover:bg-brand-dark transition-colors"
                            >
                                <span className="material-icons text-lg">add</span>
                                Add Product
                            </Link>
                            <Link
                                href={route('seller.orders.index')}
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-surface-raised border border-border text-body rounded-lg text-sm font-semibold hover:bg-surface-sunken transition-colors"
                            >
                                <span className="material-icons text-lg">visibility</span>
                                View Orders
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Revenue Card */}
                    <div className="bg-surface rounded-xl p-5 border border-border">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-muted text-sm font-medium">Total Revenue</p>
                                <h3 className="text-xl font-bold text-heading mt-1">{formatCurrency(stats?.total_revenue)}</h3>
                                <p className="text-xs mt-2 flex items-center gap-1">
                                    <span className={`material-icons text-sm ${stats?.revenue_change >= 0 ? 'text-success' : 'text-muted'}`}>
                                        {stats?.revenue_change >= 0 ? 'trending_up' : 'trending_down'}
                                    </span>
                                    <span className={stats?.revenue_change >= 0 ? 'text-success' : 'text-muted'}>
                                        {Math.abs(stats?.revenue_change || 0)}%
                                    </span>
                                    <span className="text-subtle">vs last month</span>
                                </p>
                            </div>
                            <div className="w-11 h-11 bg-brand-2-light rounded-xl flex items-center justify-center">
                                <span className="material-icons text-xl text-brand-2">account_balance_wallet</span>
                            </div>
                        </div>
                    </div>

                    {/* This Month Revenue */}
                    <div className="bg-surface rounded-xl p-5 border border-border">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-muted text-sm font-medium">This Month</p>
                                <h3 className="text-xl font-bold text-heading mt-1">{formatCurrency(stats?.this_month_revenue)}</h3>
                                <p className="text-xs mt-2 text-subtle">
                                    vs {formatCurrency(stats?.last_month_revenue)} last month
                                </p>
                            </div>
                            <div className="w-11 h-11 bg-success-light rounded-xl flex items-center justify-center">
                                <span className="material-icons text-xl text-success">trending_up</span>
                            </div>
                        </div>
                    </div>

                    {/* Products */}
                    <div className="bg-surface rounded-xl p-5 border border-border">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-muted text-sm font-medium">Products</p>
                                <h3 className="text-xl font-bold text-heading mt-1">{stats?.total_products || 0}</h3>
                                <p className="text-xs mt-2">
                                    <span className="text-success font-medium">{stats?.active_products || 0} active</span>
                                    <span className="text-subtle"> · {stats?.draft_products || 0} drafts</span>
                                </p>
                            </div>
                            <div className="w-11 h-11 bg-purple-100 rounded-xl flex items-center justify-center">
                                <span className="material-icons text-xl text-purple-600">inventory_2</span>
                            </div>
                        </div>
                    </div>

                    {/* Orders */}
                    <div className="bg-surface rounded-xl p-5 border border-border">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-muted text-sm font-medium">Orders</p>
                                <h3 className="text-xl font-bold text-heading mt-1">{stats?.total_orders || 0}</h3>
                                <p className="text-xs mt-2">
                                    <span className="text-warning font-medium">{stats?.pending_orders || 0} pending</span>
                                    <span className="text-subtle"> · {stats?.processing_orders || 0} processing</span>
                                </p>
                            </div>
                            <div className="w-11 h-11 bg-info-light rounded-xl flex items-center justify-center">
                                <span className="material-icons text-xl text-info">shopping_bag</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Revenue Chart */}
                    <div className="lg:col-span-2 bg-surface rounded-xl p-6 border border-border">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-semibold text-heading">Revenue Trend</h3>
                                <p className="text-sm text-muted">Last 6 months</p>
                            </div>
                        </div>
                        <div className="h-64">
                            <Line data={salesChartData} options={salesChartOptions} />
                        </div>
                    </div>

                    {/* Revenue by Region */}
                    <div className="bg-surface rounded-xl p-6 border border-border">
                        <h3 className="text-lg font-semibold text-heading mb-1">Sales by Region</h3>
                        <p className="text-sm text-muted mb-6">Where your customers are</p>

                        {revenueByRegion?.length > 0 ? (
                            <div className="space-y-4">
                                {revenueByRegion.map((item, index) => (
                                    <div key={index}>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm font-medium text-body">{item.region}</span>
                                            <span className="text-sm text-muted">{item.percentage}%</span>
                                        </div>
                                        <div className="h-2 bg-surface-sunken rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full transition-all duration-500"
                                                style={{
                                                    width: `${item.percentage}%`,
                                                    backgroundColor: regionColors[index % regionColors.length],
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-40 text-muted">
                                <span className="material-icons text-4xl mb-2 text-subtle">location_off</span>
                                <p className="text-sm">No regional data yet</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Orders & Products Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Orders */}
                    <div className="bg-surface rounded-xl border border-border overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                            <div>
                                <h3 className="font-semibold text-heading">Recent Orders</h3>
                                <p className="text-sm text-muted">Latest transactions</p>
                            </div>
                            <Link
                                href={route('seller.orders.index')}
                                className="text-sm font-medium text-brand hover:text-brand-dark"
                            >
                                View All
                            </Link>
                        </div>
                        <div className="divide-y divide-border">
                            {recentOrders?.length > 0 ? (
                                recentOrders.map((order) => (
                                    <Link
                                        key={order.id}
                                        href={route('seller.orders.show', order.id)}
                                        className="flex items-center justify-between p-4 hover:bg-surface-raised transition-colors"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-heading text-sm">{order.order_number}</p>
                                            <p className="text-xs text-muted">{order.customer_name} · {order.location}</p>
                                        </div>
                                        <div className="text-right flex items-center gap-3">
                                            <span className="font-semibold text-heading text-sm">{formatCurrency(order.total)}</span>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusBadge(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 text-muted">
                                    <span className="material-icons text-4xl mb-2 text-subtle">inbox</span>
                                    <p className="text-sm">No orders yet</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Low Stock Alert */}
                    <div className="bg-surface rounded-xl border border-border overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                            <div className="flex items-center gap-2">
                                <span className="material-icons text-warning">warning</span>
                                <div>
                                    <h3 className="font-semibold text-heading">Low Stock Alert</h3>
                                    <p className="text-sm text-muted">Products running low</p>
                                </div>
                            </div>
                            <Link
                                href={route('seller.products.index')}
                                className="text-sm font-medium text-brand hover:text-brand-dark"
                            >
                                Manage
                            </Link>
                        </div>
                        <div className="divide-y divide-border">
                            {lowStockProducts?.length > 0 ? (
                                lowStockProducts.map((product) => (
                                    <Link
                                        key={product.id}
                                        href={route('seller.products.edit', product.id)}
                                        className="flex items-center justify-between p-4 hover:bg-surface-raised transition-colors"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-heading text-sm truncate">{product.name}</p>
                                            <p className="text-xs text-muted">Threshold: {product.low_stock_threshold}</p>
                                        </div>
                                        <span className="px-2.5 py-1 bg-warning-light text-warning rounded-full text-xs font-semibold">
                                            {product.stock_quantity} left
                                        </span>
                                    </Link>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 text-muted">
                                    <span className="material-icons text-4xl text-success mb-2">check_circle</span>
                                    <p className="text-sm text-success">All products well stocked</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Top Products & Orders Chart */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Top Selling Products */}
                    <div className="bg-surface rounded-xl border border-border overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                            <div>
                                <h3 className="font-semibold text-heading">Top Selling</h3>
                                <p className="text-sm text-muted">Your best performers</p>
                            </div>
                            <Link
                                href={route('seller.products.index')}
                                className="text-sm font-medium text-brand hover:text-brand-dark"
                            >
                                View All
                            </Link>
                        </div>
                        <div className="p-4">
                            {topProducts?.length > 0 ? (
                                <div className="space-y-3">
                                    {topProducts.map((product, index) => (
                                        <div key={product.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-surface-raised transition-colors">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm ${
                                                index === 0 ? 'bg-brand-2' : index === 1 ? 'bg-muted' : index === 2 ? 'bg-brand' : 'bg-subtle'
                                            }`}>
                                                {index + 1}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-heading text-sm truncate">{product.name}</p>
                                                <p className="text-xs text-muted">{formatCurrency(product.base_price)}</p>
                                            </div>
                                            <span className="px-2.5 py-1 bg-success-light text-success rounded-full text-xs font-medium">
                                                {product.total_sold} sold
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-8 text-muted">
                                    <span className="material-icons text-4xl mb-2 text-subtle">inventory_2</span>
                                    <p className="text-sm">No sales data yet</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Orders Chart */}
                    <div className="bg-surface rounded-xl p-6 border border-border">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-semibold text-heading">Order Volume</h3>
                                <p className="text-sm text-muted">Orders per month</p>
                            </div>
                        </div>
                        <div className="h-52">
                            <Bar data={ordersChartData} options={ordersChartOptions} />
                        </div>
                    </div>
                </div>
            </div>
        </SellerLayout>
    );
}
