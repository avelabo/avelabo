import { Head, Link } from '@inertiajs/react';
import SellerLayout from '@/Layouts/SellerLayout';

export default function SellerDashboard({ seller, stats, recentOrders, lowStockProducts }) {
    const statCards = [
        { label: 'Total Products', value: stats?.total_products || 0, icon: 'inventory_2', color: 'bg-blue-500' },
        { label: 'Active Products', value: stats?.active_products || 0, icon: 'check_circle', color: 'bg-green-500' },
        { label: 'Total Orders', value: stats?.total_orders || 0, icon: 'shopping_bag', color: 'bg-purple-500' },
        { label: 'Pending Orders', value: stats?.pending_orders || 0, icon: 'pending', color: 'bg-yellow-500' },
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

            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-brand to-brand-dark rounded-xl p-6 mb-8 text-white">
                <h2 className="text-2xl font-bold mb-2">Welcome back, {seller?.shop_name}!</h2>
                <p className="text-white/80 mb-4">Here's what's happening with your store today.</p>
                <div className="flex gap-4">
                    <Link
                        href={route('seller.products.create')}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white text-brand rounded-lg font-medium text-sm hover:bg-gray-100 transition-colors"
                    >
                        <span className="material-icons text-lg">add</span>
                        Add Product
                    </Link>
                    <Link
                        href={route('seller.orders.index')}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-lg font-medium text-sm hover:bg-white/30 transition-colors"
                    >
                        <span className="material-icons text-lg">visibility</span>
                        View Orders
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {statCards.map((stat, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                                <span className="material-icons text-white">{stat.icon}</span>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                                <p className="text-sm text-gray-500">{stat.label}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Revenue Cards */}
            <div className="grid md:grid-cols-2 gap-4 mb-8">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Total Revenue</h3>
                        <span className="material-icons text-gray-400">account_balance_wallet</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{formatCurrency(stats?.total_revenue)}</p>
                    <p className="text-sm text-gray-500 mt-1">All time earnings</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">This Month</h3>
                        <span className="material-icons text-gray-400">trending_up</span>
                    </div>
                    <p className="text-3xl font-bold text-green-600">{formatCurrency(stats?.this_month_revenue)}</p>
                    <p className="text-sm text-gray-500 mt-1">Revenue this month</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Recent Orders */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Orders</h3>
                            <Link href={route('seller.orders.index')} className="text-sm text-brand hover:underline">
                                View All
                            </Link>
                        </div>
                    </div>
                    <div className="divide-y divide-gray-100 dark:divide-gray-700">
                        {recentOrders?.length > 0 ? (
                            recentOrders.map((order) => (
                                <Link
                                    key={order.id}
                                    href={route('seller.orders.show', order.id)}
                                    className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                >
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">{order.order_number}</p>
                                        <p className="text-sm text-gray-500">{order.user?.name}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-gray-900 dark:text-white">{formatCurrency(order.total)}</p>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                                            order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-blue-100 text-blue-700'
                                        }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="p-8 text-center text-gray-500">
                                <span className="material-icons text-4xl text-gray-300 mb-2">inbox</span>
                                <p>No orders yet</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Low Stock Products */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Low Stock Alert</h3>
                            <Link href={route('seller.products.index')} className="text-sm text-brand hover:underline">
                                Manage Products
                            </Link>
                        </div>
                    </div>
                    <div className="divide-y divide-gray-100 dark:divide-gray-700">
                        {lowStockProducts?.length > 0 ? (
                            lowStockProducts.map((product) => (
                                <Link
                                    key={product.id}
                                    href={route('seller.products.edit', product.id)}
                                    className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                >
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">{product.name}</p>
                                        <p className="text-sm text-gray-500">Threshold: {product.low_stock_threshold}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                                            {product.stock_quantity} left
                                        </span>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="p-8 text-center text-gray-500">
                                <span className="material-icons text-4xl text-gray-300 mb-2">check_circle</span>
                                <p>All products are well stocked</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </SellerLayout>
    );
}
