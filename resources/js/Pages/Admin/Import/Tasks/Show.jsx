import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Show({ task, runs, runStats }) {
    const handleRun = () => {
        if (confirm(`Run import task "${task.name}"?`)) {
            router.post(route('admin.import.tasks.run', task.id));
        }
    };

    const getStatusBadge = (status) => {
        const statusStyles = {
            pending: 'bg-yellow-100 text-yellow-700',
            running: 'bg-blue-100 text-blue-700',
            completed: 'bg-green-100 text-green-700',
            failed: 'bg-red-100 text-red-700',
            cancelled: 'bg-gray-100 text-gray-600',
        };

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status] || statusStyles.pending}`}>
                {status}
            </span>
        );
    };

    const formatDuration = (seconds) => {
        if (!seconds) return '-';
        if (seconds < 60) return `${seconds}s`;
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}m ${remainingSeconds}s`;
    };

    return (
        <AdminLayout>
            <Head title={`Import Task: ${task.name}`} />

            <div className="space-y-6">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href={route('admin.import.tasks.index')}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-dark-body rounded-lg transition-colors"
                        >
                            <span className="material-icons">arrow_back</span>
                        </Link>
                        <div>
                            <h2 className="text-2xl font-bold text-heading dark:text-white">{task.name}</h2>
                            <p className="text-body">Import task details and run history</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 mt-4 md:mt-0">
                        <Link
                            href={route('admin.import.tasks.edit', task.id)}
                            className="px-4 py-2 bg-gray-100 dark:bg-dark-body text-heading dark:text-white rounded-lg font-medium text-sm hover:bg-gray-200 transition-colors inline-flex items-center gap-2"
                        >
                            <span className="material-icons text-lg">edit</span>
                            Edit
                        </Link>
                        <button
                            onClick={handleRun}
                            disabled={!task.is_active}
                            className="px-4 py-2 bg-brand hover:bg-brand-dark text-white rounded-lg font-medium text-sm transition-colors inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="material-icons text-lg">play_arrow</span>
                            Run Now
                        </button>
                    </div>
                </div>

                {/* Task Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-dark-card rounded-xl shadow-card p-6">
                        <h3 className="text-lg font-semibold text-heading dark:text-white mb-4">Task Configuration</h3>
                        <dl className="space-y-4">
                            <div className="flex justify-between">
                                <dt className="text-body">Data Source</dt>
                                <dd className="font-medium text-heading dark:text-white">{task.data_source?.name || '-'}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-body">Seller</dt>
                                <dd className="font-medium text-heading dark:text-white">{task.seller?.shop_name || '-'}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-body">Import Type</dt>
                                <dd>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        task.import_type === 'categories'
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'bg-purple-100 text-purple-700'
                                    }`}>
                                        {task.import_type}
                                    </span>
                                </dd>
                            </div>
                            {task.source_category_name && (
                                <div className="flex justify-between">
                                    <dt className="text-body">Source Category</dt>
                                    <dd className="font-medium text-heading dark:text-white">{task.source_category_name}</dd>
                                </div>
                            )}
                            {task.target_category && (
                                <div className="flex justify-between">
                                    <dt className="text-body">Target Category</dt>
                                    <dd className="font-medium text-heading dark:text-white">{task.target_category.name}</dd>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <dt className="text-body">Execution Mode</dt>
                                <dd className="font-medium text-heading dark:text-white">
                                    {task.run_in_background ? 'Background (Queue)' : 'Synchronous'}
                                </dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-body">Status</dt>
                                <dd>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        task.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                    }`}>
                                        {task.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </dd>
                            </div>
                        </dl>
                    </div>

                    {/* Run Stats */}
                    <div className="bg-white dark:bg-dark-card rounded-xl shadow-card p-6">
                        <h3 className="text-lg font-semibold text-heading dark:text-white mb-4">Run Statistics</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 dark:bg-dark-body rounded-lg p-4">
                                <p className="text-sm text-body">Total Runs</p>
                                <p className="text-2xl font-bold text-heading dark:text-white">{runStats?.total || 0}</p>
                            </div>
                            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                                <p className="text-sm text-green-600">Completed</p>
                                <p className="text-2xl font-bold text-green-600">{runStats?.completed || 0}</p>
                            </div>
                            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                                <p className="text-sm text-red-600">Failed</p>
                                <p className="text-2xl font-bold text-red-600">{runStats?.failed || 0}</p>
                            </div>
                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                                <p className="text-sm text-blue-600">Running</p>
                                <p className="text-2xl font-bold text-blue-600">{runStats?.running || 0}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Run History */}
                <div className="bg-white dark:bg-dark-card rounded-xl shadow-card">
                    <div className="p-6 border-b dark:border-white/10">
                        <h3 className="text-lg font-semibold text-heading dark:text-white">Run History</h3>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-dark-body">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Run ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Started</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Results</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y dark:divide-white/10">
                                {runs?.data?.length > 0 ? (
                                    runs.data.map((run) => (
                                        <tr key={run.id} className="hover:bg-gray-50 dark:hover:bg-dark-body/50">
                                            <td className="px-6 py-4 text-sm font-medium text-heading dark:text-white">
                                                #{run.id}
                                            </td>
                                            <td className="px-6 py-4">
                                                {getStatusBadge(run.status)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-body">
                                                {run.started_at
                                                    ? new Date(run.started_at).toLocaleString()
                                                    : new Date(run.created_at).toLocaleString()
                                                }
                                            </td>
                                            <td className="px-6 py-4 text-sm text-body">
                                                {run.started_at && run.completed_at
                                                    ? formatDuration(Math.round((new Date(run.completed_at) - new Date(run.started_at)) / 1000))
                                                    : run.status === 'running' ? 'In progress...' : '-'
                                                }
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                {run.status === 'completed' || run.status === 'failed' ? (
                                                    <div className="space-y-1">
                                                        <p className="text-body">
                                                            <span className="text-green-600">{run.created_items} created</span>
                                                            {' / '}
                                                            <span className="text-blue-600">{run.updated_items} updated</span>
                                                        </p>
                                                        {run.failed_items > 0 && (
                                                            <p className="text-red-600">{run.failed_items} failed</p>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-body">
                                                        {run.processed_items} / {run.total_items} processed
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link
                                                    href={route('admin.import.tasks.run-details', [task.id, run.id])}
                                                    className="p-2 text-gray-500 hover:text-brand hover:bg-gray-100 dark:hover:bg-dark-body rounded-lg transition-colors inline-flex"
                                                    title="View Details"
                                                >
                                                    <span className="material-icons text-lg">visibility</span>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center">
                                            <span className="material-icons text-5xl text-gray-300 mb-4">history</span>
                                            <h3 className="text-lg font-medium text-heading dark:text-white mb-2">No runs yet</h3>
                                            <p className="text-body mb-6">This task has not been executed yet.</p>
                                            <button
                                                onClick={handleRun}
                                                disabled={!task.is_active}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-brand hover:bg-brand-dark text-white rounded-lg font-medium text-sm transition-colors disabled:opacity-50"
                                            >
                                                <span className="material-icons text-lg">play_arrow</span>
                                                Run Now
                                            </button>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {runs?.last_page > 1 && (
                        <div className="px-6 py-4 border-t dark:border-white/10">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-body">
                                    Showing {runs.from} to {runs.to} of {runs.total} runs
                                </p>
                                <div className="flex gap-2">
                                    {runs.links.map((link, index) => (
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
