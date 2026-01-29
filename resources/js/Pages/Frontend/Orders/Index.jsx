import { Head, Link, router } from '@inertiajs/react';
import FrontendLayout from '@/Layouts/FrontendLayout';
import Pagination from '@/Components/Frontend/Pagination';
import EmptyState from '@/Components/Frontend/EmptyState';
import { useCurrency } from '@/hooks/useCurrency';

export default function OrdersIndex({ orders, filters, statuses }) {
    const { format } = useCurrency();

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-MW', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-700',
            awaiting_payment: 'bg-orange-100 text-orange-700',
            processing: 'bg-blue-100 text-blue-700',
            partially_shipped: 'bg-indigo-100 text-indigo-700',
            shipped: 'bg-purple-100 text-purple-700',
            delivered: 'bg-green-100 text-green-700',
            cancelled: 'bg-red-100 text-red-700',
            refunded: 'bg-gray-100 text-gray-700',
        };
        return colors[status] || 'bg-gray-100 text-gray-700';
    };

    const handleFilterChange = (status) => {
        router.get(route('customer.orders.index'), {
            status: status || undefined,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <FrontendLayout>
            <Head title="My Orders" />

            <div className="container mx-auto px-4 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-heading font-quicksand">My Orders</h1>
                    <p className="text-muted mt-1">View and track your order history</p>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl border border-border p-4 mb-6">
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => handleFilterChange('')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                !filters.status
                                    ? 'bg-brand text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            All Orders
                        </button>
                        {Object.entries(statuses).map(([key, label]) => (
                            <button
                                key={key}
                                onClick={() => handleFilterChange(key)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    filters.status === key
                                        ? 'bg-brand text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Orders List */}
                {orders.data.length > 0 ? (
                    <div className="space-y-4">
                        {orders.data.map((order) => (
                            <div key={order.id} className="bg-white rounded-xl border border-border overflow-hidden">
                                {/* Order Header */}
                                <div className="bg-gray-50 px-6 py-4 border-b border-border flex flex-wrap items-center justify-between gap-4">
                                    <div className="flex flex-wrap items-center gap-4">
                                        <div>
                                            <span className="text-sm text-muted">Order</span>
                                            <p className="font-semibold text-heading">{order.order_number}</p>
                                        </div>
                                        <div>
                                            <span className="text-sm text-muted">Date</span>
                                            <p className="text-heading">{formatDate(order.created_at)}</p>
                                        </div>
                                        <div>
                                            <span className="text-sm text-muted">Items</span>
                                            <p className="text-heading">{order.items_count || order.items?.length || 0}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                            {statuses[order.status] || order.status}
                                        </span>
                                        <span className="font-bold text-brand text-lg">{format(order.total)}</span>
                                    </div>
                                </div>

                                {/* Order Items Preview */}
                                <div className="px-6 py-4">
                                    <div className="flex flex-wrap gap-3">
                                        {order.items?.slice(0, 4).map((item) => (
                                            <div key={item.id} className="flex items-center gap-3 bg-gray-50 rounded-lg p-2 pr-4">
                                                <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                                                    {item.product_image ? (
                                                        <img
                                                            src={`${item.product_image}`}
                                                            alt={item.product_name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium text-heading truncate max-w-[150px]">
                                                        {item.product_name}
                                                    </p>
                                                    <p className="text-xs text-muted">Qty: {item.quantity}</p>
                                                </div>
                                            </div>
                                        ))}
                                        {order.items?.length > 4 && (
                                            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-lg text-muted text-sm font-medium">
                                                +{order.items.length - 4}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Order Actions */}
                                <div className="px-6 py-4 border-t border-border flex flex-wrap items-center justify-between gap-4">
                                    <div className="flex flex-wrap gap-2">
                                        {order.items?.some(item => item.tracking_number) && (
                                            <span className="text-sm text-muted flex items-center gap-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                                                </svg>
                                                Tracking available
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex gap-3">
                                        {['pending', 'awaiting_payment'].includes(order.status) && (
                                            <button
                                                onClick={() => {
                                                    if (confirm('Are you sure you want to cancel this order?')) {
                                                        router.post(route('customer.orders.cancel', order.id));
                                                    }
                                                }}
                                                className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                Cancel Order
                                            </button>
                                        )}
                                        <Link
                                            href={route('customer.orders.show', order.id)}
                                            className="px-4 py-2 text-sm bg-brand text-white hover:bg-brand-dark rounded-lg transition-colors"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        icon="orders"
                        title="No orders yet"
                        description={filters.status
                            ? `No ${statuses[filters.status]?.toLowerCase() || filters.status} orders found.`
                            : "You haven't placed any orders yet. Start shopping to see your orders here."}
                        action={{
                            label: 'Start Shopping',
                            href: route('shop'),
                        }}
                        className="bg-white rounded-xl border border-border"
                    />
                )}

                {/* Pagination */}
                <Pagination pagination={orders} className="mt-8" />
            </div>
        </FrontendLayout>
    );
}
