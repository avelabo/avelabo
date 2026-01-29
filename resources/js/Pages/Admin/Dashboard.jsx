import { Head, Link, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function Dashboard({ stats, revenueByRegion, salesChart, latestOrders, newMembers, topProducts, orderStatusDistribution }) {
    const { auth } = usePage().props;

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
        accentLight: 'rgba(212, 168, 83, 0.15)',
    };

    // Sales Chart Data
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
                pointHoverRadius: 6,
            },
            {
                label: 'Orders',
                data: salesChart?.map(item => item.orders * 1000) || [],
                borderColor: chartColors.accent,
                backgroundColor: 'transparent',
                tension: 0.4,
                borderDash: [5, 5],
                pointBackgroundColor: chartColors.accent,
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 3,
            },
        ],
    };

    const salesChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        plugins: {
            legend: {
                display: true,
                position: 'top',
                align: 'end',
                labels: {
                    usePointStyle: true,
                    pointStyle: 'circle',
                    padding: 20,
                    font: { size: 12, family: 'Satoshi' },
                },
            },
            tooltip: {
                backgroundColor: '#1a1a1a',
                titleFont: { size: 13, weight: '600' },
                bodyFont: { size: 12 },
                padding: 12,
                cornerRadius: 8,
                displayColors: true,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: 'rgba(0, 0, 0, 0.04)', drawBorder: false },
                ticks: {
                    font: { size: 11 },
                    callback: (value) => formatNumber(value),
                },
            },
            x: {
                grid: { display: false },
                ticks: { font: { size: 11 } },
            },
        },
    };

    // Order Status Chart
    const statusColors = {
        pending: '#f59e0b',
        processing: '#3b82f6',
        shipped: '#8b5cf6',
        delivered: '#22c55e',
        cancelled: '#999999',
    };

    const orderStatusData = {
        labels: Object.keys(orderStatusDistribution || {}).map(s => s.charAt(0).toUpperCase() + s.slice(1)),
        datasets: [{
            data: Object.values(orderStatusDistribution || {}),
            backgroundColor: Object.keys(orderStatusDistribution || {}).map(s => statusColors[s] || '#e5e5e5'),
            borderWidth: 0,
            hoverOffset: 4,
        }],
    };

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    usePointStyle: true,
                    pointStyle: 'circle',
                    padding: 16,
                    font: { size: 11 },
                },
            },
        },
    };

    // Region colors - subtle palette
    const regionColors = ['#1a1a1a', '#d4a853', '#666666', '#3b82f6', '#22c55e', '#999999'];

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
        <AdminLayout>
            <Head title="Dashboard" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-heading">
                            Welcome back, {auth?.user?.name?.split(' ')[0]}
                        </h1>
                        <p className="text-muted mt-1">
                            Here's what's happening with your store today.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Link
                            href={route('admin.orders.index')}
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-surface border border-border rounded-lg text-sm font-medium text-body hover:bg-surface-raised transition-colors"
                        >
                            <span className="material-icons text-lg">shopping_cart</span>
                            View Orders
                        </Link>
                        <Link
                            href={route('admin.products.create')}
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand hover:bg-brand-dark text-white rounded-lg text-sm font-medium transition-colors"
                        >
                            <span className="material-icons text-lg">add</span>
                            Add Product
                        </Link>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Revenue Card */}
                    <div className="bg-surface rounded-xl p-5 border border-border">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-muted text-sm font-medium">Total Revenue</p>
                                <h3 className="text-2xl font-bold text-heading mt-1">{formatCurrency(stats?.total_revenue)}</h3>
                                <p className="text-xs mt-2 flex items-center gap-1">
                                    <span className={`material-icons text-sm ${stats?.revenue_change >= 0 ? 'text-success' : 'text-muted'}`}>
                                        {stats?.revenue_change >= 0 ? 'trending_up' : 'trending_down'}
                                    </span>
                                    <span className={stats?.revenue_change >= 0 ? 'text-success' : 'text-muted'}>
                                        {Math.abs(stats?.revenue_change || 0)}%
                                    </span>
                                    <span className="text-subtle">from last month</span>
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-brand-2-light rounded-xl flex items-center justify-center">
                                <span className="material-icons text-2xl text-brand-2">account_balance_wallet</span>
                            </div>
                        </div>
                    </div>

                    {/* Orders Card */}
                    <div className="bg-surface rounded-xl p-5 border border-border">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-muted text-sm font-medium">Total Orders</p>
                                <h3 className="text-2xl font-bold text-heading mt-1">{formatNumber(stats?.total_orders)}</h3>
                                <p className="text-xs mt-2 flex items-center gap-1">
                                    <span className={`material-icons text-sm ${stats?.orders_change >= 0 ? 'text-success' : 'text-muted'}`}>
                                        {stats?.orders_change >= 0 ? 'trending_up' : 'trending_down'}
                                    </span>
                                    <span className={stats?.orders_change >= 0 ? 'text-success' : 'text-muted'}>
                                        {Math.abs(stats?.orders_change || 0)}%
                                    </span>
                                    <span className="text-subtle">vs last month</span>
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-info-light rounded-xl flex items-center justify-center">
                                <span className="material-icons text-2xl text-info">shopping_bag</span>
                            </div>
                        </div>
                    </div>

                    {/* Products Card */}
                    <div className="bg-surface rounded-xl p-5 border border-border">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-muted text-sm font-medium">Active Products</p>
                                <h3 className="text-2xl font-bold text-heading mt-1">{formatNumber(stats?.active_products)}</h3>
                                <p className="text-xs mt-2 text-subtle">
                                    {stats?.total_products} total products
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                <span className="material-icons text-2xl text-purple-600">inventory_2</span>
                            </div>
                        </div>
                    </div>

                    {/* Customers Card */}
                    <div className="bg-surface rounded-xl p-5 border border-border">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-muted text-sm font-medium">Customers</p>
                                <h3 className="text-2xl font-bold text-heading mt-1">{formatNumber(stats?.total_customers)}</h3>
                                <p className="text-xs mt-2 flex items-center gap-1">
                                    <span className="text-success font-medium">+{stats?.new_customers || 0}</span>
                                    <span className="text-subtle">this month</span>
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-success-light rounded-xl flex items-center justify-center">
                                <span className="material-icons text-2xl text-success">people</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Sales Chart */}
                    <div className="lg:col-span-2 bg-surface rounded-xl p-6 border border-border">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-semibold text-heading">Revenue Overview</h3>
                                <p className="text-sm text-muted">Last 12 months performance</p>
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                                <span className="inline-flex items-center gap-1.5 text-body">
                                    <span className="w-3 h-3 rounded-full bg-brand"></span>
                                    Revenue
                                </span>
                                <span className="inline-flex items-center gap-1.5 text-body">
                                    <span className="w-3 h-3 rounded-full bg-brand-2"></span>
                                    Orders
                                </span>
                            </div>
                        </div>
                        <div className="h-72">
                            <Line data={salesChartData} options={salesChartOptions} />
                        </div>
                    </div>

                    {/* Revenue by Region */}
                    <div className="bg-surface rounded-xl p-6 border border-border">
                        <h3 className="text-lg font-semibold text-heading mb-1">Revenue by Region</h3>
                        <p className="text-sm text-muted mb-6">Distribution across areas</p>

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
                            <div className="flex flex-col items-center justify-center h-48 text-muted">
                                <span className="material-icons text-4xl mb-2 text-subtle">location_off</span>
                                <p className="text-sm">No regional data yet</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Orders and Status Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Latest Orders */}
                    <div className="lg:col-span-2 bg-surface rounded-xl border border-border overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                            <div>
                                <h3 className="font-semibold text-heading">Recent Orders</h3>
                                <p className="text-sm text-muted">Latest transactions</p>
                            </div>
                            <Link
                                href={route('admin.orders.index')}
                                className="text-sm font-medium text-brand hover:text-brand-dark transition-colors"
                            >
                                View All
                            </Link>
                        </div>
                        <div className="overflow-x-auto">
                            {latestOrders?.length > 0 ? (
                                <table className="w-full">
                                    <thead className="bg-surface-raised">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">Order</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">Customer</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">Location</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">Total</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {latestOrders.map((order) => (
                                            <tr key={order.id} className="hover:bg-surface-raised transition-colors">
                                                <td className="px-6 py-4">
                                                    <Link
                                                        href={route('admin.orders.show', order.id)}
                                                        className="font-medium text-brand hover:text-brand-dark"
                                                    >
                                                        {order.order_number}
                                                    </Link>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="font-medium text-heading text-sm">{order.customer_name}</p>
                                                    <p className="text-xs text-muted">{order.customer_email}</p>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-body">{order.location}</td>
                                                <td className="px-6 py-4 font-semibold text-heading">{formatCurrency(order.total)}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getStatusBadge(order.status)}`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 text-muted">
                                    <span className="material-icons text-5xl mb-3 text-subtle">inbox</span>
                                    <p className="text-sm font-medium">No orders yet</p>
                                    <p className="text-xs text-subtle">Orders will appear here when customers make purchases</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Order Status Distribution */}
                    <div className="bg-surface rounded-xl p-6 border border-border">
                        <h3 className="text-lg font-semibold text-heading mb-1">Order Status</h3>
                        <p className="text-sm text-muted mb-4">Current distribution</p>

                        {Object.keys(orderStatusDistribution || {}).length > 0 ? (
                            <div className="h-52">
                                <Doughnut data={orderStatusData} options={doughnutOptions} />
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-52 text-muted">
                                <span className="material-icons text-4xl mb-2 text-subtle">pie_chart</span>
                                <p className="text-sm">No order data</p>
                            </div>
                        )}

                        {/* Quick Stats */}
                        <div className="mt-6 pt-6 border-t border-border grid grid-cols-2 gap-4">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-warning">{stats?.pending_orders || 0}</p>
                                <p className="text-xs text-muted">Pending</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-info">{stats?.processing_orders || 0}</p>
                                <p className="text-xs text-muted">Processing</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* New Members */}
                    <div className="bg-surface rounded-xl border border-border overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                            <div>
                                <h3 className="font-semibold text-heading">New Customers</h3>
                                <p className="text-sm text-muted">Recently joined</p>
                            </div>
                            <Link
                                href={route('admin.users.index')}
                                className="text-sm font-medium text-brand hover:text-brand-dark transition-colors"
                            >
                                View All
                            </Link>
                        </div>
                        <div className="p-4">
                            {newMembers?.length > 0 ? (
                                <div className="space-y-3">
                                    {newMembers.map((member) => (
                                        <div key={member.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-surface-raised transition-colors">
                                            <div className="w-11 h-11 rounded-full bg-brand flex items-center justify-center text-white font-semibold text-sm">
                                                {member.initials}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-heading text-sm truncate">{member.name}</p>
                                                <p className="text-xs text-muted truncate">{member.email}</p>
                                            </div>
                                            <span className="text-xs text-subtle whitespace-nowrap">{member.joined}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-8 text-muted">
                                    <span className="material-icons text-4xl mb-2 text-subtle">person_off</span>
                                    <p className="text-sm">No new customers yet</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Top Products */}
                    <div className="bg-surface rounded-xl border border-border overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                            <div>
                                <h3 className="font-semibold text-heading">Top Selling</h3>
                                <p className="text-sm text-muted">Best performing products</p>
                            </div>
                            <Link
                                href={route('admin.products.index')}
                                className="text-sm font-medium text-brand hover:text-brand-dark transition-colors"
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
                </div>
            </div>
        </AdminLayout>
    );
}
