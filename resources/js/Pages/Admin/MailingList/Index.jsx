import { Head, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState, useRef } from 'react';

export default function MailingListIndex({
    subscribers = { data: [], links: [], meta: {} },
    stats = {},
    settings = {},
    filters = {},
    sources = {}
}) {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    const [importing, setImporting] = useState(false);
    const fileInputRef = useRef(null);

    const addForm = useForm({
        email: '',
        name: '',
    });

    const handleSearch = (e) => {
        router.get(route('admin.mailing-list.index'), {
            ...filters,
            search: e.target.value,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleFilterChange = (key, value) => {
        router.get(route('admin.mailing-list.index'), {
            ...filters,
            [key]: value,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleToggle = (subscriber) => {
        router.patch(route('admin.mailing-list.toggle', subscriber.id), {}, {
            preserveScroll: true,
        });
    };

    const handleDelete = (subscriber) => {
        if (confirm('Are you sure you want to delete this subscriber?')) {
            router.delete(route('admin.mailing-list.destroy', subscriber.id), {
                preserveScroll: true,
            });
        }
    };

    const handleAddSubmit = (e) => {
        e.preventDefault();
        addForm.post(route('admin.mailing-list.store'), {
            preserveScroll: true,
            onSuccess: () => {
                setShowAddModal(false);
                addForm.reset();
            },
        });
    };

    const handleImportAllUsers = () => {
        if (confirm(`Import all ${stats.users_not_subscribed} unsubscribed users?`)) {
            setImporting(true);
            router.post(route('admin.mailing-list.import-users'), {
                import_all: true,
            }, {
                preserveScroll: true,
                onFinish: () => setImporting(false),
            });
        }
    };

    const handleFileImport = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setImporting(true);
        router.post(route('admin.mailing-list.import-file'), {
            file: file,
        }, {
            preserveScroll: true,
            forceFormData: true,
            onFinish: () => {
                setImporting(false);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            },
        });
    };

    const handleExport = (activeOnly = true) => {
        window.location.href = route('admin.mailing-list.export', { active_only: activeOnly });
    };

    const handleBulkAction = (action) => {
        if (selectedIds.length === 0) {
            alert('Please select at least one subscriber.');
            return;
        }

        const messages = {
            activate: 'activate',
            deactivate: 'deactivate',
            delete: 'permanently delete',
        };

        if (confirm(`Are you sure you want to ${messages[action]} ${selectedIds.length} subscribers?`)) {
            router.post(route('admin.mailing-list.bulk-action'), {
                action,
                ids: selectedIds,
            }, {
                preserveScroll: true,
                onSuccess: () => setSelectedIds([]),
            });
        }
    };

    const handleSettingsChange = (key, value) => {
        router.post(route('admin.mailing-list.settings'), {
            [key]: value,
        }, {
            preserveScroll: true,
        });
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === subscribers.data.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(subscribers.data.map(s => s.id));
        }
    };

    const toggleSelect = (id) => {
        setSelectedIds(prev =>
            prev.includes(id)
                ? prev.filter(i => i !== id)
                : [...prev, id]
        );
    };

    return (
        <AdminLayout>
            <Head title="Mailing List" />

            <section className="content-main p-4 lg:p-8">
                {/* Header */}
                <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-quicksand font-bold text-heading dark:text-white">
                            Mailing List
                        </h2>
                        <p className="text-body mt-1">Manage newsletter subscribers</p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand-dark transition-colors"
                        >
                            <span className="material-icons text-sm">add</span>
                            Add Subscriber
                        </button>
                        <button
                            onClick={() => setShowImportModal(true)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            <span className="material-icons text-sm">upload</span>
                            Import
                        </button>
                        <button
                            onClick={() => handleExport(true)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <span className="material-icons text-sm">download</span>
                            Export
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
                    <StatCard icon="people" label="Total" value={stats.total} color="brand" />
                    <StatCard icon="check_circle" label="Active" value={stats.active} color="green" />
                    <StatCard icon="cancel" label="Inactive" value={stats.inactive} color="red" />
                    <StatCard icon="language" label="Website" value={stats.from_website} color="blue" />
                    <StatCard icon="upload_file" label="Imported" value={stats.from_import} color="purple" />
                    <StatCard icon="person_add" label="Registration" value={stats.from_registration} color="amber" />
                    <StatCard icon="person_off" label="Not Subscribed" value={stats.users_not_subscribed} color="gray" />
                </div>

                {/* Settings Card */}
                <div className="bg-white dark:bg-dark-card rounded-card border border-gray-100 dark:border-gray-700 mb-6 p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="material-icons text-amber-500">settings</span>
                            <div>
                                <h4 className="font-medium text-heading dark:text-white">Auto-subscribe new users</h4>
                                <p className="text-sm text-gray-500">Automatically add new users to the mailing list</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => handleSettingsChange('auto_subscribe_users', !settings.auto_subscribe_users)}
                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 ${
                                settings.auto_subscribe_users ? 'bg-brand' : 'bg-gray-200 dark:bg-gray-600'
                            }`}
                        >
                            <span
                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                    settings.auto_subscribe_users ? 'translate-x-5' : 'translate-x-0'
                                }`}
                            />
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white dark:bg-dark-card rounded-card border border-gray-100 dark:border-gray-700 mb-6">
                    <div className="p-4 flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Search by email or name..."
                                defaultValue={filters.search || ''}
                                onChange={(e) => handleSearch(e)}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 focus:ring-brand focus:border-brand"
                            />
                        </div>
                        <select
                            value={filters.status || ''}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 focus:ring-brand focus:border-brand"
                        >
                            <option value="">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                        <select
                            value={filters.source || ''}
                            onChange={(e) => handleFilterChange('source', e.target.value)}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 focus:ring-brand focus:border-brand"
                        >
                            <option value="">All Sources</option>
                            {Object.entries(sources).map(([key, label]) => (
                                <option key={key} value={key}>{label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Bulk Actions */}
                {selectedIds.length > 0 && (
                    <div className="bg-brand/10 rounded-lg p-4 mb-4 flex items-center justify-between">
                        <span className="text-brand font-medium">
                            {selectedIds.length} subscriber(s) selected
                        </span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleBulkAction('activate')}
                                className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                            >
                                Activate
                            </button>
                            <button
                                onClick={() => handleBulkAction('deactivate')}
                                className="px-3 py-1 bg-amber-600 text-white rounded text-sm hover:bg-amber-700"
                            >
                                Deactivate
                            </button>
                            <button
                                onClick={() => handleBulkAction('delete')}
                                className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                )}

                {/* Table */}
                <div className="bg-white dark:bg-dark-card rounded-card border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-800">
                                <tr>
                                    <th className="px-4 py-3 text-left">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.length === subscribers.data.length && subscribers.data.length > 0}
                                            onChange={toggleSelectAll}
                                            className="rounded border-gray-300 text-brand focus:ring-brand"
                                        />
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                        Source
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                        Subscribed
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                        Linked User
                                    </th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {subscribers.data.map((subscriber) => (
                                    <tr key={subscriber.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                        <td className="px-4 py-3">
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.includes(subscriber.id)}
                                                onChange={() => toggleSelect(subscriber.id)}
                                                className="rounded border-gray-300 text-brand focus:ring-brand"
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-heading dark:text-white font-medium">
                                                {subscriber.email}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-body dark:text-gray-400">
                                            {subscriber.name || '-'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <SourceBadge source={subscriber.source} />
                                        </td>
                                        <td className="px-4 py-3">
                                            <StatusBadge active={subscriber.is_active} />
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                                            {new Date(subscriber.subscribed_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-3">
                                            {subscriber.user ? (
                                                <span className="inline-flex items-center gap-1 text-sm text-green-600">
                                                    <span className="material-icons text-sm">link</span>
                                                    {subscriber.user.name}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleToggle(subscriber)}
                                                    className={`p-1.5 rounded-lg transition-colors ${
                                                        subscriber.is_active
                                                            ? 'text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20'
                                                            : 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
                                                    }`}
                                                    title={subscriber.is_active ? 'Deactivate' : 'Activate'}
                                                >
                                                    <span className="material-icons text-sm">
                                                        {subscriber.is_active ? 'toggle_off' : 'toggle_on'}
                                                    </span>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(subscriber)}
                                                    className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                                    title="Delete"
                                                >
                                                    <span className="material-icons text-sm">delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {subscribers.data.length === 0 && (
                                    <tr>
                                        <td colSpan="8" className="px-4 py-12 text-center text-gray-500">
                                            <span className="material-icons text-4xl mb-2">mail</span>
                                            <p>No subscribers found</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {subscribers.links && subscribers.links.length > 3 && (
                        <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                            <p className="text-sm text-gray-500">
                                Showing {subscribers.meta?.from || 0} to {subscribers.meta?.to || 0} of {subscribers.meta?.total || 0} subscribers
                            </p>
                            <div className="flex gap-1">
                                {subscribers.links.map((link, index) => (
                                    <button
                                        key={index}
                                        onClick={() => link.url && router.get(link.url)}
                                        disabled={!link.url}
                                        className={`px-3 py-1 rounded text-sm ${
                                            link.active
                                                ? 'bg-brand text-white'
                                                : link.url
                                                    ? 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                                                    : 'bg-gray-50 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Add Subscriber Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-dark-card rounded-xl max-w-md w-full p-6">
                        <h3 className="text-xl font-bold text-heading dark:text-white mb-4">
                            Add Subscriber
                        </h3>
                        <form onSubmit={handleAddSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        value={addForm.data.email}
                                        onChange={e => addForm.setData('email', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 focus:ring-brand focus:border-brand"
                                        required
                                    />
                                    {addForm.errors.email && (
                                        <p className="text-red-500 text-sm mt-1">{addForm.errors.email}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        value={addForm.data.name}
                                        onChange={e => addForm.setData('name', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 focus:ring-brand focus:border-brand"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={addForm.processing}
                                    className="px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand-dark disabled:opacity-50"
                                >
                                    {addForm.processing ? 'Adding...' : 'Add Subscriber'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Import Modal */}
            {showImportModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-dark-card rounded-xl max-w-md w-full p-6">
                        <h3 className="text-xl font-bold text-heading dark:text-white mb-4">
                            Import Subscribers
                        </h3>

                        <div className="space-y-4">
                            {/* Import from Users */}
                            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="material-icons text-green-500">people</span>
                                    <div>
                                        <h4 className="font-medium text-heading dark:text-white">Import from Users</h4>
                                        <p className="text-sm text-gray-500">
                                            {stats.users_not_subscribed} users not yet subscribed
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleImportAllUsers}
                                    disabled={importing || stats.users_not_subscribed === 0}
                                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                                >
                                    {importing ? 'Importing...' : `Import All ${stats.users_not_subscribed} Users`}
                                </button>
                            </div>

                            {/* Import from File */}
                            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="material-icons text-blue-500">upload_file</span>
                                    <div>
                                        <h4 className="font-medium text-heading dark:text-white">Import from File</h4>
                                        <p className="text-sm text-gray-500">
                                            Upload Excel or CSV file
                                        </p>
                                    </div>
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    accept=".xlsx,.xls,.csv"
                                    onChange={handleFileImport}
                                    className="w-full"
                                    disabled={importing}
                                />
                                <p className="text-xs text-gray-400 mt-2">
                                    File must have columns: email (required), name (optional)
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-end mt-6">
                            <button
                                type="button"
                                onClick={() => setShowImportModal(false)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}

function StatCard({ icon, label, value, color }) {
    const colors = {
        brand: 'text-brand bg-brand/10',
        green: 'text-green-600 bg-green-100 dark:bg-green-900/20',
        red: 'text-red-600 bg-red-100 dark:bg-red-900/20',
        blue: 'text-blue-600 bg-blue-100 dark:bg-blue-900/20',
        purple: 'text-purple-600 bg-purple-100 dark:bg-purple-900/20',
        amber: 'text-amber-600 bg-amber-100 dark:bg-amber-900/20',
        gray: 'text-gray-600 bg-gray-100 dark:bg-gray-700',
    };

    return (
        <div className="bg-white dark:bg-dark-card rounded-lg border border-gray-100 dark:border-gray-700 p-4">
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors[color]}`}>
                    <span className="material-icons text-xl">{icon}</span>
                </div>
                <div>
                    <p className="text-2xl font-bold text-heading dark:text-white">{value || 0}</p>
                    <p className="text-xs text-gray-500">{label}</p>
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ active }) {
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
            active
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
        }`}>
            {active ? 'Active' : 'Inactive'}
        </span>
    );
}

function SourceBadge({ source }) {
    const styles = {
        website: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
        import: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
        user_registration: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
    };

    const labels = {
        website: 'Website',
        import: 'Import',
        user_registration: 'Registration',
    };

    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${styles[source] || styles.import}`}>
            {labels[source] || source}
        </span>
    );
}
