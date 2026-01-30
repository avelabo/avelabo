import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';

export default function CustomersIndex({ users, filters }) {
    const [status, setStatus] = useState(filters?.status || '');
    const [search, setSearch] = useState(filters?.search || '');

    const handleFilter = (newStatus) => {
        setStatus(newStatus);
        router.get(route('admin.users.customers'), {
            status: newStatus || undefined,
            search: search || undefined,
        }, { preserveState: true });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.users.customers'), {
            status: status || undefined,
            search: search || undefined,
        }, { preserveState: true });
    };

    const handleStatusChange = (userId, newStatus) => {
        router.patch(route('admin.users.update-status', userId), {
            status: newStatus,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const statusColors = {
        active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        inactive: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400',
        suspended: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-MW', {
            style: 'currency',
            currency: 'MWK',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <AdminLayout>
            <Head title="Customers" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Customers</h2>
                    <p className="text-gray-500 text-sm">Manage customer accounts and view their purchase history</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4 mb-6">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Status Tabs */}
                    <div className="flex flex-wrap gap-2">
                        {[
                            { value: '', label: 'All' },
                            { value: 'active', label: 'Active' },
                            { value: 'inactive', label: 'Inactive' },
                            { value: 'suspended', label: 'Suspended' },
                        ].map((tab) => (
                            <button
                                key={tab.value}
                                onClick={() => handleFilter(tab.value)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    status === tab.value
                                        ? 'bg-brand text-white'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                        <div className="flex-1 relative">
                            <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                            <input
                                type="text"
                                placeholder="Search by name, email, or phone..."
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand dark:text-white"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors"
                        >
                            Search
                        </button>
                    </form>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                {users?.data?.length > 0 ? (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-700/50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Customer
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Verified
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Total Orders
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Total Spent
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Last Login
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Joined
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {users.data.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-white font-medium">
                                                        {user.name?.charAt(0)?.toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                                                        <p className="text-sm text-gray-500">{user.email}</p>
                                                        {user.phone && (
                                                            <p className="text-xs text-gray-400">{user.phone}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <select
                                                    value={user.status}
                                                    onChange={(e) => handleStatusChange(user.id, e.target.value)}
                                                    className={`px-2 py-1 rounded text-xs font-medium border-0 focus:ring-2 focus:ring-brand ${statusColors[user.status] || 'bg-gray-100'}`}
                                                >
                                                    <option value="active">Active</option>
                                                    <option value="inactive">Inactive</option>
                                                    <option value="suspended">Suspended</option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {user.email_verified_at ? (
                                                    <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-400">
                                                        <span className="material-icons text-sm">verified</span>
                                                        <span className="text-xs">{user.email_verified_at}</span>
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400 text-xs">Not verified</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-1">
                                                    <span className="material-icons text-gray-400 text-sm">shopping_bag</span>
                                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{user.total_orders}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    {formatCurrency(user.total_spent)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {user.last_login_at || 'Never'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {user.created_at}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <Link
                                                    href={route('admin.users.show', user.id)}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-brand hover:bg-brand/10 rounded-lg transition-colors"
                                                >
                                                    <span className="material-icons text-lg">visibility</span>
                                                    View
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {users.last_page > 1 && (
                            <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-gray-500">
                                        Showing {users.from} to {users.to} of {users.total} customers
                                    </p>
                                    <div className="flex gap-2">
                                        {users.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
                                                className={`px-3 py-1 rounded text-sm ${
                                                    link.active
                                                        ? 'bg-brand text-white'
                                                        : link.url
                                                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
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
                        <span className="material-icons text-5xl text-gray-300 mb-4">people</span>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No customers found</h3>
                        <p className="text-gray-500">
                            {search || status ? 'No customers match your filters.' : 'No customers have registered yet.'}
                        </p>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
