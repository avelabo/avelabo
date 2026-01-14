import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function RunDetails({ task, run, items, itemStats }) {
    const getStatusBadge = (status) => {
        const statusStyles = {
            pending: 'bg-yellow-100 text-yellow-700',
            running: 'bg-blue-100 text-blue-700',
            completed: 'bg-green-100 text-green-700',
            failed: 'bg-red-100 text-red-700',
            cancelled: 'bg-gray-100 text-gray-600',
            created: 'bg-green-100 text-green-700',
            updated: 'bg-blue-100 text-blue-700',
            skipped: 'bg-gray-100 text-gray-600',
        };

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status] || statusStyles.pending}`}>
                {status}
            </span>
        );
    };

    const getItemTypeBadge = (type) => {
        const typeStyles = {
            category: 'bg-blue-100 text-blue-700',
            product: 'bg-purple-100 text-purple-700',
            brand: 'bg-orange-100 text-orange-700',
            variant: 'bg-pink-100 text-pink-700',
            image: 'bg-teal-100 text-teal-700',
        };

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeStyles[type] || 'bg-gray-100 text-gray-600'}`}>
                {type}
            </span>
        );
    };

    return (
        <AdminLayout>
            <Head title={`Run #${run.id} Details`} />

            <div className="space-y-6">
                {/* Page Header */}
                <div className="flex items-center gap-4">
                    <Link
                        href={route('admin.import.tasks.show', task.id)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-dark-body rounded-lg transition-colors"
                    >
                        <span className="material-icons">arrow_back</span>
                    </Link>
                    <div>
                        <h2 className="text-2xl font-bold text-heading dark:text-white">Run #{run.id}</h2>
                        <p className="text-body">{task.name}</p>
                    </div>
                </div>

                {/* Run Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-dark-card rounded-xl shadow-card p-6">
                        <h3 className="text-lg font-semibold text-heading dark:text-white mb-4">Run Details</h3>
                        <dl className="space-y-4">
                            <div className="flex justify-between">
                                <dt className="text-body">Status</dt>
                                <dd>{getStatusBadge(run.status)}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-body">Started At</dt>
                                <dd className="font-medium text-heading dark:text-white">
                                    {run.started_at ? new Date(run.started_at).toLocaleString() : '-'}
                                </dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-body">Completed At</dt>
                                <dd className="font-medium text-heading dark:text-white">
                                    {run.completed_at ? new Date(run.completed_at).toLocaleString() : '-'}
                                </dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-body">Total Items</dt>
                                <dd className="font-medium text-heading dark:text-white">{run.total_items}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-body">Processed</dt>
                                <dd className="font-medium text-heading dark:text-white">{run.processed_items}</dd>
                            </div>
                        </dl>
                        {run.error_message && (
                            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                <p className="text-sm text-red-600 font-medium">Error:</p>
                                <p className="text-sm text-red-600">{run.error_message}</p>
                            </div>
                        )}
                    </div>

                    <div className="bg-white dark:bg-dark-card rounded-xl shadow-card p-6">
                        <h3 className="text-lg font-semibold text-heading dark:text-white mb-4">Item Statistics</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 dark:bg-dark-body rounded-lg p-4">
                                <p className="text-sm text-body">Total</p>
                                <p className="text-2xl font-bold text-heading dark:text-white">{itemStats?.total || 0}</p>
                            </div>
                            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                                <p className="text-sm text-green-600">Created</p>
                                <p className="text-2xl font-bold text-green-600">{itemStats?.created || 0}</p>
                            </div>
                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                                <p className="text-sm text-blue-600">Updated</p>
                                <p className="text-2xl font-bold text-blue-600">{itemStats?.updated || 0}</p>
                            </div>
                            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                                <p className="text-sm text-red-600">Failed</p>
                                <p className="text-2xl font-bold text-red-600">{itemStats?.failed || 0}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Items Table */}
                <div className="bg-white dark:bg-dark-card rounded-xl shadow-card">
                    <div className="p-6 border-b dark:border-white/10">
                        <h3 className="text-lg font-semibold text-heading dark:text-white">Imported Items</h3>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-dark-body">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Local ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Error</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y dark:divide-white/10">
                                {items?.data?.length > 0 ? (
                                    items.data.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-dark-body/50">
                                            <td className="px-6 py-4 text-sm font-medium text-heading dark:text-white">
                                                {item.source_id}
                                            </td>
                                            <td className="px-6 py-4">
                                                {getItemTypeBadge(item.item_type)}
                                            </td>
                                            <td className="px-6 py-4">
                                                {getStatusBadge(item.status)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-body">
                                                {item.local_id || '-'}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-red-600 max-w-xs truncate">
                                                {item.error_message || '-'}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center">
                                            <span className="material-icons text-5xl text-gray-300 mb-4">inventory_2</span>
                                            <h3 className="text-lg font-medium text-heading dark:text-white mb-2">No items logged</h3>
                                            <p className="text-body">No individual items were logged for this run.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {items?.last_page > 1 && (
                        <div className="px-6 py-4 border-t dark:border-white/10">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-body">
                                    Showing {items.from} to {items.to} of {items.total} items
                                </p>
                                <div className="flex gap-2">
                                    {items.links.map((link, index) => (
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
