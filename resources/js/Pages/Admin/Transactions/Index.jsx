import { Head, Link, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';

export default function Index({ transactions, stats, gateways, filters, canClearData }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [status, setStatus] = useState(filters?.status || '');
    const [gateway, setGateway] = useState(filters?.gateway || '');
    const [dateFrom, setDateFrom] = useState(filters?.date_from || '');
    const [dateTo, setDateTo] = useState(filters?.date_to || '');
    const [showClearModal, setShowClearModal] = useState(false);
    const [confirmation, setConfirmation] = useState('');

    const clearForm = useForm({
        confirmation: '',
    });

    const formatCurrency = (amount, currency) => {
        const symbol = currency?.symbol || 'MK';
        return `${symbol} ${Number(amount || 0).toLocaleString('en-MW', { minimumFractionDigits: 2 })}`;
    };

    const handleFilter = () => {
        router.get(route('admin.transactions.index'), {
            search: search || undefined,
            status: status || undefined,
            gateway: gateway || undefined,
            date_from: dateFrom || undefined,
            date_to: dateTo || undefined,
        }, {
            preserveState: true,
        });
    };

    const handleClearFilters = () => {
        setSearch('');
        setStatus('');
        setGateway('');
        setDateFrom('');
        setDateTo('');
        router.get(route('admin.transactions.index'));
    };

    const handleClearAll = (e) => {
        e.preventDefault();
        clearForm.setData('confirmation', confirmation);
        clearForm.post(route('admin.transactions.clear-all'), {
            onSuccess: () => {
                setShowClearModal(false);
                setConfirmation('');
            },
        });
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

    const getGatewayLogo = (gateway) => {
        if (!gateway) return null;

        // Map gateway slugs to icons or use logo
        const gatewayIcons = {
            'paychangu': '/images/gateways/paychangu.png',
            'tnm-mpamba': '/images/gateways/mpamba.png',
            'airtel-money': '/images/gateways/airtel.png',
            '1khusa': '/images/gateways/1khusa.png',
        };

        return gatewayIcons[gateway.slug] || gateway.logo;
    };

    return (
        <AdminLayout>
            <Head title="Transactions" />

            <div className="space-y-6">
                {/* Page Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-heading dark:text-white">Transactions</h2>
                        <p className="text-body">View and manage all payment transactions</p>
                    </div>
                    {canClearData && (
                        <button
                            onClick={() => setShowClearModal(true)}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                        >
                            <span className="material-icons text-lg">delete_forever</span>
                            Clear All Data
                        </button>
                    )}
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="bg-white dark:bg-dark-card rounded-xl p-4 shadow-card">
                        <p className="text-sm text-body">Total Transactions</p>
                        <p className="text-2xl font-bold text-heading dark:text-white">{stats?.total || 0}</p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
                        <p className="text-sm text-green-700 dark:text-green-400">Paid</p>
                        <p className="text-2xl font-bold text-green-800 dark:text-green-300">{stats?.paid || 0}</p>
                    </div>
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4">
                        <p className="text-sm text-yellow-700 dark:text-yellow-400">Pending</p>
                        <p className="text-2xl font-bold text-yellow-800 dark:text-yellow-300">{stats?.pending || 0}</p>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4">
                        <p className="text-sm text-red-700 dark:text-red-400">Failed</p>
                        <p className="text-2xl font-bold text-red-800 dark:text-red-300">{stats?.failed || 0}</p>
                    </div>
                    <div className="bg-gradient-to-r from-brand to-brand-dark rounded-xl p-4 text-white">
                        <p className="text-sm opacity-90">Total Received</p>
                        <p className="text-2xl font-bold">MK {Number(stats?.total_amount || 0).toLocaleString()}</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white dark:bg-dark-card rounded-xl shadow-card p-4">
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                        <div className="md:col-span-2">
                            <input
                                type="text"
                                placeholder="Search by transaction ID or order..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand"
                            />
                        </div>
                        <div>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand"
                            >
                                <option value="">All Statuses</option>
                                <option value="paid">Paid</option>
                                <option value="pending">Pending</option>
                                <option value="failed">Failed</option>
                                <option value="refunded">Refunded</option>
                            </select>
                        </div>
                        <div>
                            <select
                                value={gateway}
                                onChange={(e) => setGateway(e.target.value)}
                                className="w-full px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand"
                            >
                                <option value="">All Gateways</option>
                                {gateways?.map((gw) => (
                                    <option key={gw.id} value={gw.id}>
                                        {gw.display_name || gw.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="date"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                                className="flex-1 px-3 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand"
                            />
                            <input
                                type="date"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                                className="flex-1 px-3 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={handleFilter}
                                className="flex-1 px-4 py-2.5 bg-brand hover:bg-brand-dark text-white rounded-lg text-sm font-medium transition-colors"
                            >
                                Filter
                            </button>
                            <button
                                onClick={handleClearFilters}
                                className="px-4 py-2.5 bg-gray-100 dark:bg-dark-body hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-sm transition-colors"
                            >
                                Clear
                            </button>
                        </div>
                    </div>
                </div>

                {/* Transactions Table */}
                <div className="bg-white dark:bg-dark-card rounded-xl shadow-card overflow-hidden">
                    {transactions?.data?.length > 0 ? (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 dark:bg-dark-body">
                                        <tr>
                                            <th className="text-left py-3 px-4 text-xs font-semibold text-body uppercase">Transaction ID</th>
                                            <th className="text-left py-3 px-4 text-xs font-semibold text-body uppercase">Order</th>
                                            <th className="text-left py-3 px-4 text-xs font-semibold text-body uppercase">Customer</th>
                                            <th className="text-left py-3 px-4 text-xs font-semibold text-body uppercase">Amount</th>
                                            <th className="text-left py-3 px-4 text-xs font-semibold text-body uppercase">Gateway</th>
                                            <th className="text-left py-3 px-4 text-xs font-semibold text-body uppercase">Status</th>
                                            <th className="text-left py-3 px-4 text-xs font-semibold text-body uppercase">Date</th>
                                            <th className="text-right py-3 px-4 text-xs font-semibold text-body uppercase">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y dark:divide-white/10">
                                        {transactions.data.map((transaction) => (
                                            <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-white/5">
                                                <td className="py-3 px-4">
                                                    <p className="font-medium text-heading dark:text-white font-mono text-sm">
                                                        {transaction.transaction_id || `#${transaction.id}`}
                                                    </p>
                                                </td>
                                                <td className="py-3 px-4">
                                                    {transaction.order ? (
                                                        <Link
                                                            href={route('admin.orders.show', transaction.order.id)}
                                                            className="text-brand hover:underline font-medium"
                                                        >
                                                            {transaction.order.order_number}
                                                        </Link>
                                                    ) : (
                                                        <span className="text-body">-</span>
                                                    )}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div>
                                                        <p className="font-medium text-heading dark:text-white">
                                                            {transaction.order?.user?.name || '-'}
                                                        </p>
                                                        <p className="text-xs text-body">
                                                            {transaction.order?.user?.email || ''}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <p className="font-medium text-heading dark:text-white">
                                                        {formatCurrency(transaction.amount, transaction.currency)}
                                                    </p>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center gap-2">
                                                        {transaction.gateway ? (
                                                            <>
                                                                {getGatewayLogo(transaction.gateway) && (
                                                                    <img
                                                                        src={getGatewayLogo(transaction.gateway)}
                                                                        alt={transaction.gateway.name}
                                                                        className="w-8 h-6 object-contain rounded border dark:border-gray-600"
                                                                        onError={(e) => e.target.style.display = 'none'}
                                                                    />
                                                                )}
                                                                <span className="text-sm text-heading dark:text-white">
                                                                    {transaction.gateway.display_name || transaction.gateway.name}
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <span className="text-sm text-body">Unknown</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(transaction.status)}`}>
                                                        {transaction.status}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-sm text-body">
                                                    {new Date(transaction.created_at).toLocaleString()}
                                                </td>
                                                <td className="py-3 px-4 text-right">
                                                    <Link
                                                        href={route('admin.transactions.show', transaction.id)}
                                                        className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-heading dark:text-white rounded text-xs font-medium transition-colors"
                                                    >
                                                        Details
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {transactions.last_page > 1 && (
                                <div className="px-6 py-4 border-t dark:border-white/10">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm text-body">
                                            Showing {transactions.from} to {transactions.to} of {transactions.total} transactions
                                        </p>
                                        <div className="flex gap-1">
                                            {transactions.links.map((link, index) => (
                                                <Link
                                                    key={index}
                                                    href={link.url || '#'}
                                                    className={`px-3 py-1.5 rounded text-sm ${
                                                        link.active
                                                            ? 'bg-brand text-white'
                                                            : link.url
                                                            ? 'bg-gray-100 dark:bg-dark-body text-body hover:bg-gray-200'
                                                            : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                                                    }`}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="p-12 text-center">
                            <span className="material-icons text-5xl text-gray-300 mb-4">receipt_long</span>
                            <h3 className="text-lg font-medium text-heading dark:text-white mb-2">No transactions found</h3>
                            <p className="text-body">
                                {(search || status || gateway || dateFrom || dateTo)
                                    ? 'Try adjusting your filters to find transactions.'
                                    : 'Transactions will appear here once customers make payments.'}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Clear All Data Modal */}
            {showClearModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white dark:bg-dark-card rounded-xl p-6 max-w-md w-full mx-4 shadow-xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                                <span className="material-icons text-red-600">warning</span>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-heading dark:text-white">Clear All Data</h3>
                                <p className="text-sm text-body">This action cannot be undone</p>
                            </div>
                        </div>

                        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 mb-4">
                            <p className="text-sm text-red-700 dark:text-red-400">
                                This will permanently delete ALL orders, transactions, order items, refunds, and status history.
                                This is intended for development/testing purposes only.
                            </p>
                        </div>

                        <form onSubmit={handleClearAll}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-body mb-2">
                                    Type <span className="font-mono font-bold text-red-600">CLEAR ALL DATA</span> to confirm
                                </label>
                                <input
                                    type="text"
                                    value={confirmation}
                                    onChange={(e) => setConfirmation(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-red-500"
                                    placeholder="CLEAR ALL DATA"
                                />
                                {clearForm.errors.confirmation && (
                                    <p className="text-red-500 text-xs mt-1">{clearForm.errors.confirmation}</p>
                                )}
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowClearModal(false);
                                        setConfirmation('');
                                    }}
                                    className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-heading dark:text-white rounded-lg text-sm font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={confirmation !== 'CLEAR ALL DATA' || clearForm.processing}
                                    className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {clearForm.processing ? 'Clearing...' : 'Clear All Data'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
