import { Head, Link, useForm } from '@inertiajs/react';
import SellerLayout from '@/Layouts/SellerLayout';

export default function OrderShow({ order }) {
    const { data, setData, patch, processing } = useForm({
        status: order.status,
    });

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-MW', {
            style: 'currency',
            currency: 'MWK',
            minimumFractionDigits: 0,
        }).format(amount || 0);
    };

    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-700',
        confirmed: 'bg-blue-100 text-blue-700',
        processing: 'bg-purple-100 text-purple-700',
        shipped: 'bg-indigo-100 text-indigo-700',
        delivered: 'bg-green-100 text-green-700',
        cancelled: 'bg-red-100 text-red-700',
    };

    const statusOptions = [
        { value: 'pending', label: 'Pending', icon: 'hourglass_empty' },
        { value: 'confirmed', label: 'Confirmed', icon: 'check_circle' },
        { value: 'processing', label: 'Processing', icon: 'sync' },
        { value: 'shipped', label: 'Shipped', icon: 'local_shipping' },
        { value: 'delivered', label: 'Delivered', icon: 'done_all' },
        { value: 'cancelled', label: 'Cancelled', icon: 'cancel' },
    ];

    const handleStatusUpdate = (newStatus) => {
        if (newStatus !== order.status) {
            patch(route('seller.orders.update-status', order.id), {
                data: { status: newStatus },
                preserveScroll: true,
            });
        }
    };

    return (
        <SellerLayout title={`Order ${order.order_number}`}>
            <Head title={`Order ${order.order_number}`} />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                    <Link
                        href={route('seller.orders.index')}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        <span className="material-icons text-gray-500">arrow_back</span>
                    </Link>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{order.order_number}</h2>
                        <p className="text-gray-500 text-sm">
                            Placed on {new Date(order.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </p>
                    </div>
                </div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize ${statusColors[order.status] || 'bg-gray-100 text-gray-700'}`}>
                    {order.status}
                </span>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Order Items */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Order Items</h3>
                        </div>
                        <div className="divide-y divide-gray-100 dark:divide-gray-700">
                            {order.items?.map((item) => (
                                <div key={item.id} className="p-6 flex items-center gap-4">
                                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                                        {item.product?.primary_image ? (
                                            <img
                                                src={item.product.primary_image}
                                                alt={item.product.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <span className="material-icons text-gray-400">image</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-900 dark:text-white">{item.product?.name}</p>
                                        <p className="text-sm text-gray-500">SKU: {item.product?.sku || 'N/A'}</p>
                                        {item.variant && (
                                            <p className="text-sm text-gray-500">Variant: {item.variant}</p>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-gray-900 dark:text-white">{formatCurrency(item.price)}</p>
                                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-6 bg-gray-50 dark:bg-gray-700/50">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Subtotal</span>
                                    <span className="text-gray-900 dark:text-white">{formatCurrency(order.subtotal)}</span>
                                </div>
                                {order.discount > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Discount</span>
                                        <span className="text-green-600">-{formatCurrency(order.discount)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Shipping</span>
                                    <span className="text-gray-900 dark:text-white">{formatCurrency(order.shipping_cost)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Tax</span>
                                    <span className="text-gray-900 dark:text-white">{formatCurrency(order.tax)}</span>
                                </div>
                                <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                                    <div className="flex justify-between">
                                        <span className="font-medium text-gray-900 dark:text-white">Total</span>
                                        <span className="font-bold text-lg text-gray-900 dark:text-white">{formatCurrency(order.total)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Timeline */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Timeline</h3>
                        <div className="space-y-4">
                            {order.status_history?.map((history, index) => (
                                <div key={index} className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${statusColors[history.status] || 'bg-gray-100'}`}>
                                            <span className="material-icons text-sm">
                                                {statusOptions.find(s => s.value === history.status)?.icon || 'circle'}
                                            </span>
                                        </div>
                                        {index < order.status_history.length - 1 && (
                                            <div className="w-0.5 h-full bg-gray-200 dark:bg-gray-700 my-1" />
                                        )}
                                    </div>
                                    <div className="flex-1 pb-4">
                                        <p className="font-medium text-gray-900 dark:text-white capitalize">{history.status}</p>
                                        <p className="text-sm text-gray-500">
                                            {new Date(history.created_at).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </p>
                                        {history.note && (
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{history.note}</p>
                                        )}
                                    </div>
                                </div>
                            )) || (
                                <p className="text-gray-500 text-sm">No timeline history available</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Update Status */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Update Status</h3>
                        <div className="space-y-2">
                            {statusOptions.map((status) => (
                                <button
                                    key={status.value}
                                    onClick={() => handleStatusUpdate(status.value)}
                                    disabled={processing || status.value === order.status}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                                        status.value === order.status
                                            ? 'bg-brand/10 text-brand border border-brand'
                                            : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                                    } disabled:opacity-50`}
                                >
                                    <span className="material-icons text-lg">{status.icon}</span>
                                    <span className="font-medium">{status.label}</span>
                                    {status.value === order.status && (
                                        <span className="material-icons text-sm ml-auto">check</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Customer Information */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Customer</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                    <span className="material-icons text-gray-500">person</span>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">{order.user?.name}</p>
                                    <p className="text-sm text-gray-500">{order.user?.email}</p>
                                </div>
                            </div>
                            {order.user?.phone && (
                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                    <span className="material-icons text-lg">phone</span>
                                    <span>{order.user.phone}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Shipping Address</h3>
                        {order.shipping_address ? (
                            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                <p className="font-medium text-gray-900 dark:text-white">{order.shipping_address.name}</p>
                                <p>{order.shipping_address.address_line_1}</p>
                                {order.shipping_address.address_line_2 && (
                                    <p>{order.shipping_address.address_line_2}</p>
                                )}
                                <p>
                                    {order.shipping_address.city}, {order.shipping_address.state}
                                </p>
                                <p>{order.shipping_address.postal_code}</p>
                                {order.shipping_address.phone && (
                                    <p className="flex items-center gap-1">
                                        <span className="material-icons text-sm">phone</span>
                                        {order.shipping_address.phone}
                                    </p>
                                )}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">No shipping address provided</p>
                        )}
                    </div>

                    {/* Payment Information */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Payment</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Method</span>
                                <span className="text-gray-900 dark:text-white capitalize">{order.payment_method || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Status</span>
                                <span className={`font-medium capitalize ${
                                    order.payment_status === 'paid' ? 'text-green-600' :
                                    order.payment_status === 'pending' ? 'text-yellow-600' :
                                    'text-red-600'
                                }`}>
                                    {order.payment_status || 'Pending'}
                                </span>
                            </div>
                            {order.payment_reference && (
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Reference</span>
                                    <span className="text-gray-900 dark:text-white">{order.payment_reference}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Order Notes */}
                    {order.notes && (
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Notes</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{order.notes}</p>
                        </div>
                    )}
                </div>
            </div>
        </SellerLayout>
    );
}
