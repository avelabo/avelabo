import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';

export default function SellersIndex({ users, filters }) {
    const [status, setStatus] = useState(filters?.status || '');
    const [sellerStatus, setSellerStatus] = useState(filters?.seller_status || '');
    const [search, setSearch] = useState(filters?.search || '');

    const handleFilter = (newStatus, newSellerStatus = sellerStatus) => {
        setStatus(newStatus);
        setSellerStatus(newSellerStatus);
        router.get(route('admin.users.sellers'), {
            status: newStatus || undefined,
            seller_status: newSellerStatus || undefined,
            search: search || undefined,
        }, { preserveState: true });
    };

    const handleSellerStatusFilter = (newSellerStatus) => {
        handleFilter(status, newSellerStatus);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.users.sellers'), {
            status: status || undefined,
            seller_status: sellerStatus || undefined,
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

    const sellerStatusColors = {
        approved: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
        rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
        suspended: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };

    return (
        <AdminLayout>
            <Head title="Seller Users" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Sellers</h2>
                    <p className="text-gray-500 text-sm">Manage seller accounts and their shop information</p>
                </div>
                <Link
                    href={route('admin.sellers.index')}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand-dark transition-colors"
                >
                    <span className="material-icons text-lg">store</span>
                    Manage Shops
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4 mb-6">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Account Status Tabs */}
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

                    {/* Seller Status Filter */}
                    <div className="flex items-center gap-2">
                        <select
                            value={sellerStatus}
                            onChange={(e) => handleSellerStatusFilter(e.target.value)}
                            className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand dark:text-white"
                        >
                            <option value="">All Shop Status</option>
                            <option value="approved">Approved</option>
                            <option value="pending">Pending</option>
                            <option value="rejected">Rejected</option>
                            <option value="suspended">Suspended</option>
                        </select>
                    </div>

                    {/* Search */}
                    <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                        <div className="flex-1 relative">
                            <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                            <input
                                type="text"
                                placeholder="Search by name, email, phone, or shop name..."
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
                                            Seller
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Shop
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Account Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Shop Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Rating
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
                                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-medium">
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
                                                {user.seller ? (
                                                    <div>
                                                        <p className="font-medium text-gray-900 dark:text-white">{user.seller.shop_name}</p>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400 text-sm">No shop</span>
                                                )}
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
                                                {user.seller ? (
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${sellerStatusColors[user.seller.status] || 'bg-gray-100 text-gray-700'}`}>
                                                        {user.seller.status?.charAt(0).toUpperCase() + user.seller.status?.slice(1)}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400 text-xs">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {user.seller?.rating ? (
                                                    <div className="flex items-center gap-1">
                                                        <span className="material-icons text-yellow-400 text-sm">star</span>
                                                        <span className="text-sm text-gray-700 dark:text-gray-300">{parseFloat(user.seller.rating).toFixed(1)}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400 text-xs">No ratings</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {user.created_at}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={route('admin.users.show', user.id)}
                                                        className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-brand hover:bg-brand/10 rounded-lg transition-colors"
                                                    >
                                                        <span className="material-icons text-lg">person</span>
                                                        User
                                                    </Link>
                                                    {user.seller && (
                                                        <Link
                                                            href={route('admin.sellers.show', user.seller.id)}
                                                            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                                        >
                                                            <span className="material-icons text-lg">store</span>
                                                            Shop
                                                        </Link>
                                                    )}
                                                </div>
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
                                        Showing {users.from} to {users.to} of {users.total} sellers
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
                        <span className="material-icons text-5xl text-gray-300 mb-4">store</span>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No sellers found</h3>
                        <p className="text-gray-500">
                            {search || status || sellerStatus ? 'No sellers match your filters.' : 'No sellers have registered yet.'}
                        </p>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
