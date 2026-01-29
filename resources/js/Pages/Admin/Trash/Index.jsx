import { Head, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState, useEffect } from 'react';

export default function Index({ items, stats, filter }) {
    const [selectedItems, setSelectedItems] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEmptyModal, setShowEmptyModal] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [expandedItem, setExpandedItem] = useState(null);

    const deleteForm = useForm({
        password: '',
    });

    const emptyForm = useForm({
        password: '',
        type: 'all',
    });

    const typeIcons = {
        product: 'inventory_2',
        seller: 'store',
        order: 'shopping_cart',
        promotion: 'campaign',
        coupon: 'confirmation_number',
        user: 'person',
    };

    const typeColors = {
        product: { bg: 'bg-blue-500/10', text: 'text-blue-600', border: 'border-blue-500/20' },
        seller: { bg: 'bg-emerald-500/10', text: 'text-emerald-600', border: 'border-emerald-500/20' },
        order: { bg: 'bg-amber-500/10', text: 'text-amber-600', border: 'border-amber-500/20' },
        promotion: { bg: 'bg-purple-500/10', text: 'text-purple-600', border: 'border-purple-500/20' },
        coupon: { bg: 'bg-pink-500/10', text: 'text-pink-600', border: 'border-pink-500/20' },
        user: { bg: 'bg-cyan-500/10', text: 'text-cyan-600', border: 'border-cyan-500/20' },
    };

    const formatTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    const handleFilterChange = (newFilter) => {
        router.get(route('admin.trash.index'), { filter: newFilter }, { preserveState: true });
    };

    const handleRestore = (item) => {
        router.post(route('admin.trash.restore', { type: item.type, id: item.id }), {}, {
            preserveScroll: true,
        });
    };

    const handleRestoreAll = () => {
        router.post(route('admin.trash.restore-all'), { type: filter }, {
            preserveScroll: true,
        });
    };

    const handleDeleteClick = (item) => {
        setDeleteTarget(item);
        setShowDeleteModal(true);
        deleteForm.reset();
    };

    const handleEmptyClick = () => {
        emptyForm.setData('type', filter);
        setShowEmptyModal(true);
        emptyForm.reset();
    };

    const confirmDelete = (e) => {
        e.preventDefault();
        deleteForm.delete(route('admin.trash.force-delete', { type: deleteTarget.type, id: deleteTarget.id }), {
            preserveScroll: true,
            onSuccess: () => {
                setShowDeleteModal(false);
                setDeleteTarget(null);
                deleteForm.reset();
            },
        });
    };

    const confirmEmpty = (e) => {
        e.preventDefault();
        emptyForm.post(route('admin.trash.empty'), {
            preserveScroll: true,
            onSuccess: () => {
                setShowEmptyModal(false);
                emptyForm.reset();
            },
        });
    };

    const toggleItemExpand = (itemId) => {
        setExpandedItem(expandedItem === itemId ? null : itemId);
    };

    const filterTabs = [
        { key: 'all', label: 'All', count: stats.total },
        { key: 'products', label: 'Products', count: stats.products },
        { key: 'sellers', label: 'Sellers', count: stats.sellers },
        { key: 'orders', label: 'Orders', count: stats.orders },
        { key: 'promotions', label: 'Promotions', count: stats.promotions },
        { key: 'coupons', label: 'Coupons', count: stats.coupons },
        { key: 'users', label: 'Users', count: stats.users },
    ];

    return (
        <AdminLayout>
            <Head title="Trash Bin" />

            <div className="space-y-6">
                {/* Header with gradient accent */}
                <div className="relative overflow-hidden bg-white dark:bg-dark-card rounded-2xl shadow-card">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-orange-500 to-amber-500" />
                    <div className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center">
                                    <span className="material-icons text-3xl text-red-500">delete_sweep</span>
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-heading dark:text-white">Trash Bin</h1>
                                    <p className="text-body mt-0.5">
                                        {stats.total === 0
                                            ? 'Your trash is empty'
                                            : `${stats.total} item${stats.total !== 1 ? 's' : ''} waiting for action`
                                        }
                                    </p>
                                </div>
                            </div>
                            {stats.total > 0 && (
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={handleRestoreAll}
                                        className="px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 text-emerald-600 rounded-xl font-medium text-sm transition-all inline-flex items-center gap-2"
                                    >
                                        <span className="material-icons text-lg">restore</span>
                                        Restore {filter !== 'all' ? filter : 'All'}
                                    </button>
                                    <button
                                        onClick={handleEmptyClick}
                                        className="px-4 py-2.5 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 rounded-xl font-medium text-sm transition-all inline-flex items-center gap-2"
                                    >
                                        <span className="material-icons text-lg">delete_forever</span>
                                        Empty {filter !== 'all' ? filter : 'Trash'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="bg-white dark:bg-dark-card rounded-2xl shadow-card p-2">
                    <div className="flex flex-wrap gap-2">
                        {filterTabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => handleFilterChange(tab.key)}
                                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                                    filter === tab.key
                                        ? 'bg-brand text-white shadow-sm'
                                        : 'text-body hover:bg-gray-100 dark:hover:bg-dark-body'
                                }`}
                            >
                                {tab.label}
                                {tab.count > 0 && (
                                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                                        filter === tab.key
                                            ? 'bg-white/20 text-white'
                                            : 'bg-gray-100 dark:bg-dark-body text-body'
                                    }`}>
                                        {tab.count}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Items List */}
                {items.length > 0 ? (
                    <div className="space-y-3">
                        {items.map((item, index) => {
                            const colors = typeColors[item.type];
                            const isExpanded = expandedItem === `${item.type}-${item.id}`;

                            return (
                                <div
                                    key={`${item.type}-${item.id}`}
                                    className={`bg-white dark:bg-dark-card rounded-2xl shadow-card overflow-hidden transition-all duration-300 hover:shadow-card-hover`}
                                    style={{
                                        animationDelay: `${index * 50}ms`,
                                        animation: 'fadeInUp 0.4s ease-out forwards'
                                    }}
                                >
                                    <div className="p-5">
                                        <div className="flex items-start gap-4">
                                            {/* Type Icon */}
                                            <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                                                <span className={`material-icons text-xl ${colors.text}`}>
                                                    {typeIcons[item.type]}
                                                </span>
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className={`px-2 py-0.5 rounded-md text-xs font-medium uppercase tracking-wide ${colors.bg} ${colors.text}`}>
                                                                {item.type}
                                                            </span>
                                                            <span className="text-xs text-muted">
                                                                {formatTimeAgo(item.deleted_at)}
                                                            </span>
                                                        </div>
                                                        <h3 className="text-lg font-semibold text-heading dark:text-white truncate">
                                                            {item.name}
                                                        </h3>
                                                        <p className="text-sm text-body truncate mt-0.5">
                                                            {item.description}
                                                        </p>

                                                        {/* Meta info */}
                                                        {Object.keys(item.meta).length > 0 && (
                                                            <div className="flex flex-wrap gap-3 mt-2">
                                                                {Object.entries(item.meta).map(([key, value]) => (
                                                                    value && (
                                                                        <span key={key} className="text-xs text-muted">
                                                                            <span className="capitalize">{key}:</span>{' '}
                                                                            <span className="text-body">{value}</span>
                                                                        </span>
                                                                    )
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="flex items-center gap-2 flex-shrink-0">
                                                        {item.cascade.length > 0 && (
                                                            <button
                                                                onClick={() => toggleItemExpand(`${item.type}-${item.id}`)}
                                                                className="p-2 text-gray-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10 rounded-lg transition-colors"
                                                                title="View cascade items"
                                                            >
                                                                <span className={`material-icons text-lg transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                                                                    expand_more
                                                                </span>
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => handleRestore(item)}
                                                            className="p-2 text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-lg transition-colors"
                                                            title="Restore"
                                                        >
                                                            <span className="material-icons text-lg">restore</span>
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteClick(item)}
                                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                                                            title="Delete permanently"
                                                        >
                                                            <span className="material-icons text-lg">delete_forever</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Cascade Preview (Collapsed) */}
                                        {item.cascade.length > 0 && !isExpanded && (
                                            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/5">
                                                <div className="flex items-center gap-2 text-xs">
                                                    <span className="material-icons text-amber-500 text-sm">warning</span>
                                                    <span className="text-amber-600 dark:text-amber-400 font-medium">
                                                        Will also delete:
                                                    </span>
                                                    <span className="text-body">
                                                        {item.cascade.join(', ')}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Cascade Details (Expanded) */}
                                    {item.cascade.length > 0 && isExpanded && (
                                        <div className="px-5 pb-5">
                                            <div className="bg-amber-50/50 dark:bg-amber-500/5 border border-amber-200/50 dark:border-amber-500/20 rounded-xl p-4">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <span className="material-icons text-amber-500">account_tree</span>
                                                    <span className="font-semibold text-amber-700 dark:text-amber-400">
                                                        Cascade Deletion Preview
                                                    </span>
                                                </div>
                                                <p className="text-sm text-amber-600/80 dark:text-amber-400/80 mb-3">
                                                    Permanently deleting this {item.type} will also remove the following related data:
                                                </p>
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                    {item.cascade.map((cascadeItem, idx) => (
                                                        <div key={idx} className="flex items-center gap-2 bg-white dark:bg-dark-card rounded-lg px-3 py-2">
                                                            <span className="material-icons text-red-400 text-sm">remove_circle</span>
                                                            <span className="text-sm text-heading dark:text-white">{cascadeItem}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    /* Empty State */
                    <div className="bg-white dark:bg-dark-card rounded-2xl shadow-card">
                        <div className="py-20 px-6 text-center">
                            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-50 dark:from-dark-body dark:to-dark-card rounded-full flex items-center justify-center">
                                <span className="material-icons text-5xl text-gray-300 dark:text-gray-600">
                                    auto_delete
                                </span>
                            </div>
                            <h3 className="text-xl font-semibold text-heading dark:text-white mb-2">
                                {filter === 'all' ? 'Trash is Empty' : `No deleted ${filter}`}
                            </h3>
                            <p className="text-body max-w-md mx-auto">
                                {filter === 'all'
                                    ? 'Items you delete will appear here. You can restore them or permanently delete them.'
                                    : `There are no deleted ${filter} in the trash bin.`
                                }
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && deleteTarget && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
                        <div
                            className="fixed inset-0 transition-opacity bg-black/60 backdrop-blur-sm"
                            onClick={() => setShowDeleteModal(false)}
                        />

                        <div className="relative inline-block w-full max-w-lg overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-dark-card rounded-2xl shadow-modal">
                            {/* Danger stripe */}
                            <div className="h-1.5 bg-gradient-to-r from-red-500 via-red-600 to-orange-500" />

                            <div className="p-6">
                                {/* Header */}
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="w-12 h-12 bg-red-100 dark:bg-red-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <span className="material-icons text-2xl text-red-500">warning</span>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-heading dark:text-white">
                                            Permanent Deletion
                                        </h3>
                                        <p className="text-body mt-1">
                                            This action cannot be undone.
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setShowDeleteModal(false)}
                                        className="ml-auto p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg"
                                    >
                                        <span className="material-icons">close</span>
                                    </button>
                                </div>

                                {/* Item Info */}
                                <div className="bg-gray-50 dark:bg-dark-body rounded-xl p-4 mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 ${typeColors[deleteTarget.type].bg} rounded-lg flex items-center justify-center`}>
                                            <span className={`material-icons ${typeColors[deleteTarget.type].text}`}>
                                                {typeIcons[deleteTarget.type]}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-heading dark:text-white">{deleteTarget.name}</p>
                                            <p className="text-sm text-body">{deleteTarget.type}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Cascade Warning */}
                                {deleteTarget.cascade.length > 0 && (
                                    <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl p-4 mb-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="material-icons text-red-500 text-sm">link_off</span>
                                            <span className="font-semibold text-red-700 dark:text-red-400 text-sm">
                                                Related data will be deleted:
                                            </span>
                                        </div>
                                        <ul className="space-y-1">
                                            {deleteTarget.cascade.map((item, idx) => (
                                                <li key={idx} className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                                                    <span className="material-icons text-xs">remove</span>
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Password Confirmation */}
                                <form onSubmit={confirmDelete}>
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-heading dark:text-white mb-2">
                                            Enter your password to confirm
                                        </label>
                                        <input
                                            type="password"
                                            value={deleteForm.data.password}
                                            onChange={(e) => deleteForm.setData('password', e.target.value)}
                                            className={`w-full px-4 py-3 bg-gray-100 dark:bg-dark-body border-0 rounded-xl text-sm focus:ring-2 focus:ring-red-500 ${deleteForm.errors.password ? 'ring-2 ring-red-500' : ''}`}
                                            placeholder="Enter your password"
                                            autoFocus
                                        />
                                        {deleteForm.errors.password && (
                                            <p className="mt-2 text-sm text-red-500">{deleteForm.errors.password}</p>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center justify-end gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setShowDeleteModal(false)}
                                            className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-dark-body dark:hover:bg-dark-body/80 text-heading dark:text-white rounded-xl font-medium text-sm transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={deleteForm.processing}
                                            className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium text-sm transition-colors disabled:opacity-50 inline-flex items-center gap-2"
                                        >
                                            {deleteForm.processing && (
                                                <span className="material-icons animate-spin text-lg">sync</span>
                                            )}
                                            Delete Permanently
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Empty Trash Modal */}
            {showEmptyModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
                        <div
                            className="fixed inset-0 transition-opacity bg-black/60 backdrop-blur-sm"
                            onClick={() => setShowEmptyModal(false)}
                        />

                        <div className="relative inline-block w-full max-w-lg overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-dark-card rounded-2xl shadow-modal">
                            {/* Danger stripe */}
                            <div className="h-1.5 bg-gradient-to-r from-red-600 via-red-500 to-orange-500" />

                            <div className="p-6">
                                {/* Header */}
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="w-12 h-12 bg-red-100 dark:bg-red-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <span className="material-icons text-2xl text-red-500">delete_forever</span>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-heading dark:text-white">
                                            Empty Trash
                                        </h3>
                                        <p className="text-body mt-1">
                                            Permanently delete {filter === 'all' ? 'all items' : `all ${filter}`} from trash.
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setShowEmptyModal(false)}
                                        className="ml-auto p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg"
                                    >
                                        <span className="material-icons">close</span>
                                    </button>
                                </div>

                                {/* Summary */}
                                <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl p-4 mb-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="material-icons text-red-500">error_outline</span>
                                        <span className="font-semibold text-red-700 dark:text-red-400">
                                            This will permanently delete:
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        {(filter === 'all' ? filterTabs.slice(1) : filterTabs.filter(t => t.key === filter)).map(tab => (
                                            tab.count > 0 && (
                                                <div key={tab.key} className="flex items-center gap-2 bg-white dark:bg-dark-card rounded-lg px-3 py-2">
                                                    <span className="material-icons text-red-400 text-sm">
                                                        {typeIcons[tab.key.replace(/s$/, '')]}
                                                    </span>
                                                    <span className="text-sm text-heading dark:text-white">
                                                        {tab.count} {tab.label.toLowerCase()}
                                                    </span>
                                                </div>
                                            )
                                        ))}
                                    </div>
                                    <p className="text-xs text-red-600 dark:text-red-400 mt-3">
                                        All related data (images, variants, reviews, etc.) will also be deleted.
                                    </p>
                                </div>

                                {/* Password Confirmation */}
                                <form onSubmit={confirmEmpty}>
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-heading dark:text-white mb-2">
                                            Enter your password to confirm
                                        </label>
                                        <input
                                            type="password"
                                            value={emptyForm.data.password}
                                            onChange={(e) => emptyForm.setData('password', e.target.value)}
                                            className={`w-full px-4 py-3 bg-gray-100 dark:bg-dark-body border-0 rounded-xl text-sm focus:ring-2 focus:ring-red-500 ${emptyForm.errors.password ? 'ring-2 ring-red-500' : ''}`}
                                            placeholder="Enter your password"
                                            autoFocus
                                        />
                                        {emptyForm.errors.password && (
                                            <p className="mt-2 text-sm text-red-500">{emptyForm.errors.password}</p>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center justify-end gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setShowEmptyModal(false)}
                                            className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-dark-body dark:hover:bg-dark-body/80 text-heading dark:text-white rounded-xl font-medium text-sm transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={emptyForm.processing}
                                            className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium text-sm transition-colors disabled:opacity-50 inline-flex items-center gap-2"
                                        >
                                            {emptyForm.processing && (
                                                <span className="material-icons animate-spin text-lg">sync</span>
                                            )}
                                            Empty Trash
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(16px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </AdminLayout>
    );
}
