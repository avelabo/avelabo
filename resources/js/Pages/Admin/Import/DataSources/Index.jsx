import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';

export default function Index({ dataSources, filters, stats }) {
    const [search, setSearch] = useState(filters?.search || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.import.data-sources.index'), { search }, { preserveState: true });
    };

    const handleFilterChange = (key, value) => {
        router.get(route('admin.import.data-sources.index'), { ...filters, [key]: value || undefined }, { preserveState: true });
    };

    const handleDelete = (dataSource) => {
        if (confirm(`Are you sure you want to delete "${dataSource.name}"?`)) {
            router.delete(route('admin.import.data-sources.destroy', dataSource.id));
        }
    };

    const toggleStatus = (dataSource) => {
        router.patch(route('admin.import.data-sources.toggle-status', dataSource.id));
    };

    return (
        <AdminLayout>
            <Head title="Data Sources" />

            <div className="space-y-6">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-heading dark:text-white">Data Sources</h2>
                        <p className="text-body">Configure external data sources for product imports</p>
                    </div>
                    <Link
                        href={route('admin.import.data-sources.create')}
                        className="px-4 py-2 bg-brand hover:bg-brand-dark text-white rounded-lg font-medium text-sm transition-colors inline-flex items-center gap-2 mt-4 md:mt-0"
                    >
                        <span className="material-icons text-lg">add</span>
                        Add Data Source
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-dark-card rounded-xl p-4 shadow-card">
                        <p className="text-sm text-body">Total Sources</p>
                        <p className="text-2xl font-bold text-heading dark:text-white">{stats?.total || 0}</p>
                    </div>
                    <div className="bg-white dark:bg-dark-card rounded-xl p-4 shadow-card">
                        <p className="text-sm text-green-600">Active</p>
                        <p className="text-2xl font-bold text-green-600">{stats?.active || 0}</p>
                    </div>
                    <div className="bg-white dark:bg-dark-card rounded-xl p-4 shadow-card">
                        <p className="text-sm text-gray-500">Inactive</p>
                        <p className="text-2xl font-bold text-gray-500">{stats?.inactive || 0}</p>
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
                                        placeholder="Search data sources..."
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

                    {/* Data Sources Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-dark-body">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Base URL</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Auth</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tasks</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y dark:divide-white/10">
                                {dataSources?.data?.length > 0 ? (
                                    dataSources.data.map((dataSource) => (
                                        <tr key={dataSource.id} className="hover:bg-gray-50 dark:hover:bg-dark-body/50">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-brand/10 rounded-lg flex items-center justify-center">
                                                        <span className="material-icons text-brand">cloud</span>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-heading dark:text-white">{dataSource.name}</p>
                                                        <p className="text-sm text-body">{dataSource.slug}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-body">
                                                <span className="truncate max-w-xs block">{dataSource.base_url}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    dataSource.auth_type === 'none'
                                                        ? 'bg-gray-100 text-gray-600'
                                                        : 'bg-blue-100 text-blue-700'
                                                }`}>
                                                    {dataSource.auth_type === 'none' ? 'None' : dataSource.auth_type === 'api_key' ? 'API Key' : 'Bearer'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-body">
                                                {dataSource.import_tasks_count || 0} tasks
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => toggleStatus(dataSource)}
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        dataSource.is_active
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-gray-100 text-gray-600'
                                                    }`}
                                                >
                                                    {dataSource.is_active ? 'Active' : 'Inactive'}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={route('admin.import.data-sources.edit', dataSource.id)}
                                                        className="p-2 text-gray-500 hover:text-brand hover:bg-gray-100 dark:hover:bg-dark-body rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <span className="material-icons text-lg">edit</span>
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(dataSource)}
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
                                            <span className="material-icons text-5xl text-gray-300 mb-4">cloud_off</span>
                                            <h3 className="text-lg font-medium text-heading dark:text-white mb-2">No data sources found</h3>
                                            <p className="text-body mb-6">Get started by adding your first data source.</p>
                                            <Link
                                                href={route('admin.import.data-sources.create')}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-brand hover:bg-brand-dark text-white rounded-lg font-medium text-sm transition-colors"
                                            >
                                                <span className="material-icons text-lg">add</span>
                                                Add Data Source
                                            </Link>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {dataSources?.last_page > 1 && (
                        <div className="px-6 py-4 border-t dark:border-white/10">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-body">
                                    Showing {dataSources.from} to {dataSources.to} of {dataSources.total} sources
                                </p>
                                <div className="flex gap-2">
                                    {dataSources.links.map((link, index) => (
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
