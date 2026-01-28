import { Head, Link } from '@inertiajs/react';
import SellerLayout from '@/Layouts/SellerLayout';
import MetricCard from '@/Components/Shared/MetricCard';
import DashboardCard from '@/Components/Shared/DashboardCard';
import StatusBadge from '@/Components/Shared/StatusBadge';

export default function SellerDashboard({ seller, stats, recentOrders, lowStockProducts }) {
    const statCards = [
        { title: 'Total Products', value: stats?.total_products || 0, icon: 'inventory_2', iconBg: 'bg-info' },
        { title: 'Active Products', value: stats?.active_products || 0, icon: 'check_circle', iconBg: 'bg-success' },
        { title: 'Total Orders', value: stats?.total_orders || 0, icon: 'shopping_bag', iconBg: 'bg-brand' },
        { title: 'Pending Orders', value: stats?.pending_orders || 0, icon: 'pending', iconBg: 'bg-warning' },
    ];

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-MW', {
            style: 'currency',
            currency: 'MWK',
            minimumFractionDigits: 0,
        }).format(amount || 0);
    };

    return (
        <SellerLayout title="Dashboard">
            <Head title="Seller Dashboard" />

            <div className="space-y-6">
                {/* Welcome Banner */}
                <div className="bg-gradient-to-r from-brand to-brand-dark rounded-xl p-6 text-white">
                    <h2 className="text-2xl font-bold mb-2">Welcome back, {seller?.shop_name}!</h2>
                    <p className="text-white/70 mb-4">Here's what's happening with your store today.</p>
                    <div className="flex gap-3">
                        <Link
                            href={route('seller.products.create')}
                            className="btn btn-sm bg-white text-brand hover:bg-gray-100"
                        >
                            <span className="material-icons text-lg">add</span>
                            Add Product
                        </Link>
                        <Link
                            href={route('seller.orders.index')}
                            className="btn btn-sm bg-white/20 text-white hover:bg-white/30"
                        >
                            <span className="material-icons text-lg">visibility</span>
                            View Orders
                        </Link>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {statCards.map((stat, index) => (
                        <MetricCard key={index} {...stat} />
                    ))}
                </div>

                {/* Revenue Cards */}
                <div className="grid md:grid-cols-2 gap-4">
                    <MetricCard
                        title="Total Revenue"
                        value={formatCurrency(stats?.total_revenue)}
                        icon="account_balance_wallet"
                        iconBg="bg-brand"
                        subtitle="All time earnings"
                    />
                    <MetricCard
                        title="This Month"
                        value={formatCurrency(stats?.this_month_revenue)}
                        icon="trending_up"
                        iconBg="bg-success"
                        subtitle="Revenue this month"
                    />
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Recent Orders */}
                    <DashboardCard
                        title="Recent Orders"
                        actionLabel="View All"
                        actionHref={route('seller.orders.index')}
                        noPadding
                    >
                        <div className="divide-y divide-border-light dark:divide-white/10">
                            {recentOrders?.length > 0 ? (
                                recentOrders.map((order) => (
                                    <Link
                                        key={order.id}
                                        href={route('seller.orders.show', order.id)}
                                        className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                                    >
                                        <div>
                                            <p className="font-medium text-heading dark:text-white text-sm">{order.order_number}</p>
                                            <p className="text-xs text-body">{order.user?.name}</p>
                                        </div>
                                        <div className="text-right flex items-center gap-3">
                                            <span className="font-medium text-heading dark:text-white text-sm">{formatCurrency(order.total)}</span>
                                            <StatusBadge status={order.status} />
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="p-8 text-center text-body">
                                    <span className="material-icons text-4xl text-muted mb-2">inbox</span>
                                    <p>No orders yet</p>
                                </div>
                            )}
                        </div>
                    </DashboardCard>

                    {/* Low Stock Products */}
                    <DashboardCard
                        title="Low Stock Alert"
                        actionLabel="Manage Products"
                        actionHref={route('seller.products.index')}
                        noPadding
                    >
                        <div className="divide-y divide-border-light dark:divide-white/10">
                            {lowStockProducts?.length > 0 ? (
                                lowStockProducts.map((product) => (
                                    <Link
                                        key={product.id}
                                        href={route('seller.products.edit', product.id)}
                                        className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                                    >
                                        <div>
                                            <p className="font-medium text-heading dark:text-white text-sm">{product.name}</p>
                                            <p className="text-xs text-body">Threshold: {product.low_stock_threshold}</p>
                                        </div>
                                        <span className="badge-soft-danger px-2.5 py-0.5 rounded-full text-xs font-semibold">
                                            {product.stock_quantity} left
                                        </span>
                                    </Link>
                                ))
                            ) : (
                                <div className="p-8 text-center text-body">
                                    <span className="material-icons text-4xl text-muted mb-2">check_circle</span>
                                    <p>All products are well stocked</p>
                                </div>
                            )}
                        </div>
                    </DashboardCard>
                </div>
            </div>
        </SellerLayout>
    );
}
