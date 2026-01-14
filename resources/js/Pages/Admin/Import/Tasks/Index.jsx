import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';

export default function Index({ tasks, filters, stats, dataSources, sellers }) {
    const [search, setSearch] = useState(filters?.search || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.import.tasks.index'), { search }, { preserveState: true });
    };

    const handleFilterChange = (key, value) => {
        router.get(route('admin.import.tasks.index'), { ...filters, [key]: value || undefined }, { preserveState: true });
    };

    const handleDelete = (task) => {
        if (confirm(`Are you sure you want to delete "${task.name}"?`)) {
            router.delete(route('admin.import.tasks.destroy', task.id));
        }
    };

    const handleRun = (task) => {
        if (confirm(`Run import task "${task.name}"?`)) {
            router.post(route('admin.import.tasks.run', task.id));
        }
    };

    const getStatusBadge = (run) => {
        if (!run) return null;

        const statusStyles = {
            pending: 'bg-yellow-100 text-yellow-700',
            running: 'bg-blue-100 text-blue-700',
            completed: 'bg-green-100 text-green-700',
            failed: 'bg-red-100 text-red-700',
            cancelled: 'bg-gray-100 text-gray-600',
        };

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[run.status] || statusStyles.pending}`}>
                {run.status}
            </span>
        );
    };

    return (
        <AdminLayout>
            <Head title="Import Tasks" />

            <div className="space-y-6">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-heading dark:text-white">Import Tasks</h2>
                        <p className="text-body">Manage and run data import tasks</p>
                    </div>
                    <Link
                        href={route('admin.import.tasks.create')}
                        className="px-4 py-2 bg-brand hover:bg-brand-dark text-white rounded-lg font-medium text-sm transition-colors inline-flex items-center gap-2 mt-4 md:mt-0"
                    >
                        <span className="material-icons text-lg">add</span>
                        Add Task
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-dark-card rounded-xl p-4 shadow-card">
                        <p className="text-sm text-body">Total Tasks</p>
                        <p className="text-2xl font-bold text-heading dark:text-white">{stats?.total || 0}</p>
                    </div>
                    <div className="bg-white dark:bg-dark-card rounded-xl p-4 shadow-card">
                        <p className="text-sm text-green-600">Active</p>
                        <p className="text-2xl font-bold text-green-600">{stats?.active || 0}</p>
                    </div>
                    <div className="bg-white dark:bg-dark-card rounded-xl p-4 shadow-card">
                        <p className="text-sm text-blue-600">Category Tasks</p>
                        <p className="text-2xl font-bold text-blue-600">{stats?.categories || 0}</p>
                    </div>
                    <div className="bg-white dark:bg-dark-card rounded-xl p-4 shadow-card">
                        <p className="text-sm text-purple-600">Product Tasks</p>
                        <p className="text-2xl font-bold text-purple-600">{stats?.products || 0}</p>
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
                                        placeholder="Search tasks..."
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>
                            </form>
                            {/* Filters */}
                            <select
                                className="px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand"
                                value={filters?.data_source_id || ''}
                                onChange={(e) => handleFilterChange('data_source_id', e.target.value)}
                            >
                                <option value="">All Sources</option>
                                {dataSources?.map((source) => (
                                    <option key={source.id} value={source.id}>{source.name}</option>
                                ))}
                            </select>
                            <select
                                className="px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand"
                                value={filters?.import_type || ''}
                                onChange={(e) => handleFilterChange('import_type', e.target.value)}
                            >
                                <option value="">All Types</option>
                                <option value="categories">Categories</option>
                                <option value="products">Products</option>
                            </select>
                        </div>
                    </div>

                    {/* Tasks Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-dark-body">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Run</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y dark:divide-white/10">
                                {tasks?.data?.length > 0 ? (
                                    tasks.data.map((task) => (
                                        <tr key={task.id} className="hover:bg-gray-50 dark:hover:bg-dark-body/50">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                                        task.import_type === 'categories' ? 'bg-blue-100' : 'bg-purple-100'
                                                    }`}>
                                                        <span className={`material-icons ${
                                                            task.import_type === 'categories' ? 'text-blue-600' : 'text-purple-600'
                                                        }`}>
                                                            {task.import_type === 'categories' ? 'folder' : 'inventory_2'}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <Link
                                                            href={route('admin.import.tasks.show', task.id)}
                                                            className="font-medium text-heading dark:text-white hover:text-brand"
                                                        >
                                                            {task.name}
                                                        </Link>
                                                        <p className="text-sm text-body">
                                                            {task.seller?.shop_name || 'No seller'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-body">
                                                {task.data_source?.name || 'Unknown'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    task.import_type === 'categories'
                                                        ? 'bg-blue-100 text-blue-700'
                                                        : 'bg-purple-100 text-purple-700'
                                                }`}>
                                                    {task.import_type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-body">
                                                {task.latest_run ? (
                                                    <div>
                                                        <p>{new Date(task.latest_run.started_at || task.latest_run.created_at).toLocaleDateString()}</p>
                                                        {task.latest_run.status === 'completed' && (
                                                            <p className="text-xs text-green-600">
                                                                {task.latest_run.created_items} created, {task.latest_run.updated_items} updated
                                                            </p>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400">Never</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                {getStatusBadge(task.latest_run)}
                                                {!task.latest_run && (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                                        Not run
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleRun(task)}
                                                        disabled={task.latest_run?.status === 'running'}
                                                        className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                        title="Run Task"
                                                    >
                                                        <span className="material-icons text-lg">play_arrow</span>
                                                    </button>
                                                    <Link
                                                        href={route('admin.import.tasks.show', task.id)}
                                                        className="p-2 text-gray-500 hover:text-brand hover:bg-gray-100 dark:hover:bg-dark-body rounded-lg transition-colors"
                                                        title="View Details"
                                                    >
                                                        <span className="material-icons text-lg">visibility</span>
                                                    </Link>
                                                    <Link
                                                        href={route('admin.import.tasks.edit', task.id)}
                                                        className="p-2 text-gray-500 hover:text-brand hover:bg-gray-100 dark:hover:bg-dark-body rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <span className="material-icons text-lg">edit</span>
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(task)}
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
                                        <td colSpan="6" className="px-6 py-12 text-center">
                                            <span className="material-icons text-5xl text-gray-300 mb-4">task</span>
                                            <h3 className="text-lg font-medium text-heading dark:text-white mb-2">No import tasks found</h3>
                                            <p className="text-body mb-6">Get started by creating your first import task.</p>
                                            <Link
                                                href={route('admin.import.tasks.create')}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-brand hover:bg-brand-dark text-white rounded-lg font-medium text-sm transition-colors"
                                            >
                                                <span className="material-icons text-lg">add</span>
                                                Add Task
                                            </Link>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {tasks?.last_page > 1 && (
                        <div className="px-6 py-4 border-t dark:border-white/10">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-body">
                                    Showing {tasks.from} to {tasks.to} of {tasks.total} tasks
                                </p>
                                <div className="flex gap-2">
                                    {tasks.links.map((link, index) => (
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
