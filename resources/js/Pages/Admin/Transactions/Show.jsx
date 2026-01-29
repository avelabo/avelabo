import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Show({ transaction }) {
    const formatCurrency = (amount, currency) => {
        const symbol = currency?.symbol || 'MK';
        return `${symbol} ${Number(amount || 0).toLocaleString('en-MW', { minimumFractionDigits: 2 })}`;
    };

    const getStatusColor = (status) => {
        const colors = {
            paid: 'bg-green-100 text-green-700',
            pending: 'bg-yellow-100 text-yellow-700',
            failed: 'bg-red-100 text-red-700',
            refunded: 'bg-gray-100 text-gray-700',
        };
        return colors[status] || 'bg-gray-100 text-gray-700';
    };

    return (
        <AdminLayout>
            <Head title={`Transaction ${transaction.transaction_id || '#' + transaction.id}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href={route('admin.transactions.index')}
                            className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                            <span className="material-icons">arrow_back</span>
                        </Link>
                        <div>
                            <h2 className="text-2xl font-bold text-heading dark:text-white">
                                Transaction Details
                            </h2>
                            <p className="text-body font-mono">
                                {transaction.transaction_id || `#${transaction.id}`}
                            </p>
                        </div>
                    </div>
                    <span className={`px-3 py-1.5 rounded-full text-sm font-medium capitalize ${getStatusColor(transaction.status)}`}>
                        {transaction.status}
                    </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Transaction Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Payment Details */}
                        <div className="bg-white dark:bg-dark-card rounded-xl shadow-card p-6">
                            <h3 className="text-lg font-bold text-heading dark:text-white mb-4">Payment Information</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-body">Transaction ID</p>
                                    <p className="font-medium text-heading dark:text-white font-mono">
                                        {transaction.transaction_id || '-'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-body">Amount</p>
                                    <p className="font-bold text-2xl text-heading dark:text-white">
                                        {formatCurrency(transaction.amount, transaction.currency)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-body">Payment Method</p>
                                    <p className="font-medium text-heading dark:text-white">
                                        {transaction.payment_method || '-'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-body">Status</p>
                                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(transaction.status)}`}>
                                        {transaction.status}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm text-body">Created At</p>
                                    <p className="font-medium text-heading dark:text-white">
                                        {new Date(transaction.created_at).toLocaleString()}
                                    </p>
                                </div>
                                {transaction.paid_at && (
                                    <div>
                                        <p className="text-sm text-body">Paid At</p>
                                        <p className="font-medium text-heading dark:text-white">
                                            {new Date(transaction.paid_at).toLocaleString()}
                                        </p>
                                    </div>
                                )}
                                {transaction.failed_at && (
                                    <div className="col-span-2">
                                        <p className="text-sm text-body">Failed At</p>
                                        <p className="font-medium text-red-600">
                                            {new Date(transaction.failed_at).toLocaleString()}
                                        </p>
                                        {transaction.failure_reason && (
                                            <p className="text-sm text-red-500 mt-1">
                                                Reason: {transaction.failure_reason}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Gateway Info */}
                        <div className="bg-white dark:bg-dark-card rounded-xl shadow-card p-6">
                            <h3 className="text-lg font-bold text-heading dark:text-white mb-4">Payment Gateway</h3>
                            {transaction.gateway ? (
                                <div className="flex items-center gap-4">
                                    {transaction.gateway.logo && (
                                        <img
                                            src={transaction.gateway.logo}
                                            alt={transaction.gateway.name}
                                            className="w-16 h-12 object-contain rounded border dark:border-gray-600"
                                        />
                                    )}
                                    <div>
                                        <p className="font-bold text-heading dark:text-white">
                                            {transaction.gateway.display_name || transaction.gateway.name}
                                        </p>
                                        <p className="text-sm text-body">{transaction.gateway.slug}</p>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-body">No gateway information available</p>
                            )}
                        </div>

                        {/* Gateway Response */}
                        {transaction.gateway_response && (
                            <div className="bg-white dark:bg-dark-card rounded-xl shadow-card p-6">
                                <h3 className="text-lg font-bold text-heading dark:text-white mb-4">Gateway Response</h3>
                                <pre className="bg-gray-100 dark:bg-dark-body rounded-lg p-4 overflow-x-auto text-sm">
                                    {JSON.stringify(transaction.gateway_response, null, 2)}
                                </pre>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Order Info */}
                        {transaction.order && (
                            <div className="bg-white dark:bg-dark-card rounded-xl shadow-card p-6">
                                <h3 className="text-lg font-bold text-heading dark:text-white mb-4">Order Information</h3>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm text-body">Order Number</p>
                                        <Link
                                            href={route('admin.orders.show', transaction.order.id)}
                                            className="font-bold text-brand hover:underline"
                                        >
                                            {transaction.order.order_number}
                                        </Link>
                                    </div>
                                    <div>
                                        <p className="text-sm text-body">Order Total</p>
                                        <p className="font-medium text-heading dark:text-white">
                                            {formatCurrency(transaction.order.total, transaction.currency)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-body">Order Status</p>
                                        <p className="font-medium text-heading dark:text-white capitalize">
                                            {transaction.order.status}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Customer Info */}
                        {transaction.order?.user && (
                            <div className="bg-white dark:bg-dark-card rounded-xl shadow-card p-6">
                                <h3 className="text-lg font-bold text-heading dark:text-white mb-4">Customer</h3>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm text-body">Name</p>
                                        <p className="font-medium text-heading dark:text-white">
                                            {transaction.order.user.name}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-body">Email</p>
                                        <p className="font-medium text-heading dark:text-white">
                                            {transaction.order.user.email}
                                        </p>
                                    </div>
                                    {transaction.order.user.phone && (
                                        <div>
                                            <p className="text-sm text-body">Phone</p>
                                            <p className="font-medium text-heading dark:text-white">
                                                {transaction.order.user.phone}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Refunds */}
                        {transaction.refunds?.length > 0 && (
                            <div className="bg-white dark:bg-dark-card rounded-xl shadow-card p-6">
                                <h3 className="text-lg font-bold text-heading dark:text-white mb-4">Refunds</h3>
                                <div className="space-y-3">
                                    {transaction.refunds.map((refund) => (
                                        <div key={refund.id} className="bg-gray-50 dark:bg-dark-body rounded-lg p-3">
                                            <div className="flex justify-between items-start">
                                                <p className="font-medium text-heading dark:text-white">
                                                    {formatCurrency(refund.amount, transaction.currency)}
                                                </p>
                                                <span className={`px-2 py-0.5 rounded-full text-xs capitalize ${
                                                    refund.status === 'completed'
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                    {refund.status}
                                                </span>
                                            </div>
                                            <p className="text-sm text-body mt-1">{refund.reason}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="bg-white dark:bg-dark-card rounded-xl shadow-card p-6">
                            <h3 className="text-lg font-bold text-heading dark:text-white mb-4">Actions</h3>
                            <div className="space-y-2">
                                {transaction.order && (
                                    <Link
                                        href={route('admin.orders.show', transaction.order.id)}
                                        className="block w-full px-4 py-2.5 bg-brand hover:bg-brand-dark text-white text-center rounded-lg text-sm font-medium transition-colors"
                                    >
                                        View Order
                                    </Link>
                                )}
                                <Link
                                    href={route('admin.transactions.index')}
                                    className="block w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-heading dark:text-white text-center rounded-lg text-sm font-medium transition-colors"
                                >
                                    Back to Transactions
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
