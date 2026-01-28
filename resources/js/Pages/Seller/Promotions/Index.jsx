import { Head, Link, router } from '@inertiajs/react';
import SellerLayout from '@/Layouts/SellerLayout';
import { useState } from 'react';

export default function PromotionsIndex({ promotions, filters }) {
    const [search, setSearch] = useState(filters?.search || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('seller.promotions.index'), { search }, { preserveState: true });
    };

    const handleDelete = (promotion) => {
        if (confirm(`Are you sure you want to delete "${promotion.name}"?`)) {
            router.delete(route('seller.promotions.destroy', promotion.id));
        }
    };

    const handleToggleStatus = (promotion) => {
        router.patch(route('seller.promotions.toggle-status', promotion.id));
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('en-MW', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const getStatusBadge = (promotion) => {
        const now = new Date();
        const start = new Date(promotion.start_date);
        const end = new Date(promotion.end_date);

        if (!promotion.is_active) {
            return { label: 'Inactive', classes: 'bg-gray-100 text-gray-700' };
        }
        if (now < start) {
            return { label: 'Scheduled', classes: 'bg-blue-100 text-blue-700' };
        }
        if (now > end) {
            return { label: 'Expired', classes: 'bg-red-100 text-red-700' };
        }
        return { label: 'Active', classes: 'bg-green-100 text-green-700' };
    };

    return (
        <SellerLayout title="Promotions">
            <Head title="Promotions" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Promotions</h2>
                    <p className="text-gray-500 text-sm">Create and manage discounts for your products</p>
                </div>
                <Link
                    href={route('seller.promotions.create')}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-brand hover:bg-brand-dark text-white rounded-lg font-medium text-sm transition-colors"
                >
                    <span className="material-icons text-lg">add</span>
                    New Promotion
                </Link>
            </div>

            {/* Search */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4 mb-6">
                <form onSubmit={handleSearch} className="flex gap-4">
                    <div className="flex-1 relative">
                        <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                        <input
                            type="text"
                            placeholder="Search promotions..."
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

            {/* Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                {promotions?.data?.length > 0 ? (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-700/50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Discount</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Scope</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Period</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {promotions.data.map((promotion) => {
                                        const status = getStatusBadge(promotion);
                                        return (
                                            <tr key={promotion.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <p className="font-medium text-gray-900 dark:text-white">{promotion.name}</p>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <p className="text-gray-900 dark:text-white">
                                                        {promotion.discount_type === 'percentage'
                                                            ? `${promotion.discount_value}%`
                                                            : `MWK ${Number(promotion.discount_value).toLocaleString()}`}
                                                    </p>
                                                    <p className="text-xs text-gray-500 capitalize">{promotion.discount_type}</p>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="capitalize text-gray-700 dark:text-gray-300 text-sm">{promotion.scope_type}</span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <p>{formatDate(promotion.start_date)}</p>
                                                    <p>{formatDate(promotion.end_date)}</p>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.classes}`}>
                                                        {status.label}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => handleToggleStatus(promotion)}
                                                            className="p-2 text-gray-500 hover:text-brand hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                                            title={promotion.is_active ? 'Deactivate' : 'Activate'}
                                                        >
                                                            <span className="material-icons text-lg">
                                                                {promotion.is_active ? 'toggle_on' : 'toggle_off'}
                                                            </span>
                                                        </button>
                                                        <Link
                                                            href={route('seller.promotions.edit', promotion.id)}
                                                            className="p-2 text-gray-500 hover:text-brand hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                                        >
                                                            <span className="material-icons text-lg">edit</span>
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(promotion)}
                                                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                        >
                                                            <span className="material-icons text-lg">delete</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {promotions.last_page > 1 && (
                            <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-gray-500">
                                        Showing {promotions.from} to {promotions.to} of {promotions.total} results
                                    </p>
                                    <div className="flex gap-2">
                                        {promotions.links.map((link, index) => (
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
                        <span className="material-icons text-5xl text-gray-300 mb-4">local_offer</span>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No promotions yet</h3>
                        <p className="text-gray-500 mb-6">Create your first promotion to offer discounts on your products.</p>
                        <Link
                            href={route('seller.promotions.create')}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-brand hover:bg-brand-dark text-white rounded-lg font-medium text-sm transition-colors"
                        >
                            <span className="material-icons text-lg">add</span>
                            Create Your First Promotion
                        </Link>
                    </div>
                )}
            </div>
        </SellerLayout>
    );
}
