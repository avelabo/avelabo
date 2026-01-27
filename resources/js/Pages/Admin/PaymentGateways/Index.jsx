import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';

export default function Index({ gateways, filters, stats }) {
    const [search, setSearch] = useState(filters?.search || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.payment-gateways.index'), { search }, { preserveState: true });
    };

    const handleFilterChange = (key, value) => {
        router.get(route('admin.payment-gateways.index'), { ...filters, [key]: value || undefined }, { preserveState: true });
    };

    const handleDelete = (gateway) => {
        if (confirm(`Are you sure you want to delete "${gateway.name}"?`)) {
            router.delete(route('admin.payment-gateways.destroy', gateway.id));
        }
    };

    const toggleStatus = (gateway) => {
        router.patch(route('admin.payment-gateways.toggle-status', gateway.id));
    };

    const toggleTestMode = (gateway) => {
        router.patch(route('admin.payment-gateways.toggle-test-mode', gateway.id));
    };

    const formatFees = (gateway) => {
        const parts = [];
        if (gateway.transaction_fee_percentage) {
            parts.push(`${gateway.transaction_fee_percentage}%`);
        }
        if (gateway.transaction_fee_fixed) {
            parts.push(`MWK ${gateway.transaction_fee_fixed}`);
        }
        return parts.length > 0 ? parts.join(' + ') : 'None';
    };

    return (
        <AdminLayout>
            <Head title="Payment Gateways" />

            <div className="space-y-6">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-heading dark:text-white">Payment Gateways</h2>
                        <p className="text-body">Manage payment gateways</p>
                    </div>
                    <Link
                        href={route('admin.payment-gateways.create')}
                        className="px-4 py-2 bg-brand hover:bg-brand-dark text-white rounded-lg font-medium text-sm transition-colors inline-flex items-center gap-2 mt-4 md:mt-0"
                    >
                        <span className="material-icons text-lg">add</span>
                        Add Gateway
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-dark-card rounded-xl p-4 shadow-card">
                        <p className="text-sm text-body">Total Gateways</p>
                        <p className="text-2xl font-bold text-heading dark:text-white">{stats?.total || 0}</p>
                    </div>
                    <div className="bg-white dark:bg-dark-card rounded-xl p-4 shadow-card">
                        <p className="text-sm text-green-600">Active</p>
                        <p className="text-2xl font-bold text-green-600">{stats?.active || 0}</p>
                    </div>
                    <div className="bg-white dark:bg-dark-card rounded-xl p-4 shadow-card">
                        <p className="text-sm text-yellow-600">Test Mode</p>
                        <p className="text-2xl font-bold text-yellow-600">{stats?.test_mode || 0}</p>
                    </div>
                </div>

                {/* Filters & Table */}
                <div className="bg-white dark:bg-dark-card rounded-xl shadow-card">
                    <div className="p-5 border-b dark:border-white/10">
                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Search */}
                            <form onSubmit={handleSearch} className="flex-1">
                                <div className="relative">
                                    <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                                    <input
                                        type="text"
                                        placeholder="Search gateways..."
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>
                            </form>
                            {/* Status Filter */}
                            <select
                                className="px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand"
                                value={filters?.status || ''}
                                onChange={(e) => handleFilterChange('status', e.target.value)}
                            >
                                <option value="">All Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                    </div>

                    {/* Gateways Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-dark-body">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gateway</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Display Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fees</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payments</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test Mode</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y dark:divide-white/10">
                                {gateways?.data?.length > 0 ? (
                                    gateways.data.map((gateway) => (
                                        <tr key={gateway.id} className="hover:bg-gray-50 dark:hover:bg-dark-body/50">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {gateway.logo ? (
                                                        <img
                                                            src={`/storage/${gateway.logo}`}
                                                            alt={gateway.name}
                                                            className="w-10 h-10 object-contain rounded-lg bg-white"
                                                        />
                                                    ) : (
                                                        <div className="w-10 h-10 bg-gray-100 dark:bg-dark-body rounded-lg flex items-center justify-center">
                                                            <span className="material-icons text-gray-400">payment</span>
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-medium text-heading dark:text-white">
                                                            {gateway.name}
                                                        </p>
                                                        <p className="text-sm text-body">{gateway.slug}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-heading dark:text-white">
                                                {gateway.display_name}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-body">
                                                {formatFees(gateway)}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <span className="text-body">{gateway.payments_count} payments</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => toggleStatus(gateway)}
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        gateway.is_active
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-gray-100 text-gray-600'
                                                    }`}
                                                >
                                                    {gateway.is_active ? 'Active' : 'Inactive'}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => toggleTestMode(gateway)}
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        gateway.is_test_mode
                                                            ? 'bg-amber-100 text-amber-700'
                                                            : 'bg-gray-100 text-gray-600'
                                                    }`}
                                                >
                                                    {gateway.is_test_mode ? 'Test' : 'Live'}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={route('admin.payment-gateways.edit', gateway.id)}
                                                        className="p-2 text-gray-500 hover:text-brand hover:bg-gray-100 dark:hover:bg-dark-body rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <span className="material-icons text-lg">edit</span>
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(gateway)}
                                                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <span className="material-icons text-lg">delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-12 text-center">
                                            <span className="material-icons text-5xl text-gray-300 mb-4">payment</span>
                                            <h3 className="text-lg font-medium text-heading dark:text-white mb-2">No payment gateways found</h3>
                                            <p className="text-body mb-6">Get started by adding your first payment gateway.</p>
                                            <Link
                                                href={route('admin.payment-gateways.create')}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-brand hover:bg-brand-dark text-white rounded-lg font-medium text-sm transition-colors"
                                            >
                                                <span className="material-icons text-lg">add</span>
                                                Add Gateway
                                            </Link>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {gateways?.last_page > 1 && (
                        <div className="px-6 py-4 border-t dark:border-white/10">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-body">
                                    Showing {gateways.from} to {gateways.to} of {gateways.total} gateways
                                </p>
                                <div className="flex gap-2">
                                    {gateways.links.map((link, index) => (
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
                </div>
            </div>
        </AdminLayout>
    );
}
