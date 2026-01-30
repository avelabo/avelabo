import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState, Fragment } from 'react';

export default function NotificationLogsIndex({ logs, stats, emailTypes, filters }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [status, setStatus] = useState(filters?.status || '');
    const [emailType, setEmailType] = useState(filters?.email_type || '');
    const [recipientType, setRecipientType] = useState(filters?.recipient_type || '');
    const [dateFrom, setDateFrom] = useState(filters?.date_from || '');
    const [dateTo, setDateTo] = useState(filters?.date_to || '');
    const [retrying, setRetrying] = useState(null);
    const [retryingAll, setRetryingAll] = useState(false);

    const handleFilter = () => {
        router.get(route('admin.notification-logs.index'), {
            search: search || undefined,
            status: status || undefined,
            email_type: emailType || undefined,
            recipient_type: recipientType || undefined,
            date_from: dateFrom || undefined,
            date_to: dateTo || undefined,
        }, {
            preserveState: true,
        });
    };

    const handleClearFilters = () => {
        setSearch('');
        setStatus('');
        setEmailType('');
        setRecipientType('');
        setDateFrom('');
        setDateTo('');
        router.get(route('admin.notification-logs.index'));
    };

    const handleRetry = (logId) => {
        setRetrying(logId);
        router.post(route('admin.notification-logs.retry', logId), {}, {
            preserveScroll: true,
            onFinish: () => setRetrying(null),
        });
    };

    const handleRetryAll = () => {
        if (!confirm('Retry all failed notifications? This may take a moment.')) return;
        setRetryingAll(true);
        router.post(route('admin.notification-logs.retry-all'), {}, {
            preserveScroll: true,
            onFinish: () => setRetryingAll(false),
        });
    };

    const handleDelete = (logId) => {
        if (!confirm('Delete this notification log?')) return;
        router.delete(route('admin.notification-logs.destroy', logId), {
            preserveScroll: true,
        });
    };

    const handleClearOld = () => {
        if (!confirm('Delete all sent notifications older than 30 days?')) return;
        router.post(route('admin.notification-logs.clear-old'), { days: 30 }, {
            preserveScroll: true,
        });
    };

    const getStatusBadge = (status) => {
        const styles = {
            sent: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
            failed: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
            pending: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
        };
        const icons = {
            sent: 'check_circle',
            failed: 'error',
            pending: 'schedule',
        };
        return (
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border ${styles[status] || styles.pending}`}>
                <span className="material-icons text-sm">{icons[status] || 'help'}</span>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    const getRecipientTypeBadge = (type) => {
        const styles = {
            customer: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
            seller: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
            admin: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
        };
        const icons = {
            customer: 'person',
            seller: 'storefront',
            admin: 'admin_panel_settings',
        };
        return (
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded ${styles[type] || 'bg-gray-100 text-gray-600'}`}>
                <span className="material-icons text-xs">{icons[type] || 'person'}</span>
                {type}
            </span>
        );
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatEmailType = (type) => {
        return type
            .replace(/^(customer|seller|admin)\./, '')
            .replace(/_/g, ' ')
            .replace(/\b\w/g, c => c.toUpperCase());
    };

    return (
        <AdminLayout>
            <Head title="Notification Logs" />

            <div className="space-y-6">
                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-heading dark:text-white flex items-center gap-3">
                            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
                                <span className="material-icons">notifications</span>
                            </span>
                            Notification Logs
                        </h2>
                        <p className="text-body mt-1">Track and manage all email and SMS notifications</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {stats?.retryable > 0 && (
                            <button
                                onClick={handleRetryAll}
                                disabled={retryingAll}
                                className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-medium rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg shadow-amber-500/25 disabled:opacity-50"
                            >
                                <span className={`material-icons text-lg ${retryingAll ? 'animate-spin' : ''}`}>
                                    {retryingAll ? 'refresh' : 'replay'}
                                </span>
                                Retry All Failed ({stats.retryable})
                            </button>
                        )}
                        <button
                            onClick={handleClearOld}
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                        >
                            <span className="material-icons text-lg">auto_delete</span>
                            Clean Old
                        </button>
                    </div>
                </div>

                {/* Stats Cards with Animated Gradients */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="relative overflow-hidden bg-white dark:bg-dark-card rounded-2xl p-5 shadow-card group hover:shadow-lg transition-shadow">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-800 rounded-bl-[4rem] -mr-4 -mt-4 transition-transform group-hover:scale-110" />
                        <div className="relative">
                            <span className="material-icons text-gray-400 mb-2">mail</span>
                            <p className="text-xs font-medium text-body uppercase tracking-wider">Total</p>
                            <p className="text-3xl font-bold text-heading dark:text-white mt-1">{stats?.total || 0}</p>
                        </div>
                    </div>

                    <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-5 text-white shadow-lg shadow-emerald-500/20 group hover:shadow-xl hover:shadow-emerald-500/30 transition-shadow">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-bl-[4rem] -mr-4 -mt-4" />
                        <div className="relative">
                            <span className="material-icons mb-2 opacity-80">check_circle</span>
                            <p className="text-xs font-medium uppercase tracking-wider opacity-80">Sent</p>
                            <p className="text-3xl font-bold mt-1">{stats?.sent || 0}</p>
                        </div>
                    </div>

                    <div className="relative overflow-hidden bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl p-5 text-white shadow-lg shadow-rose-500/20 group hover:shadow-xl hover:shadow-rose-500/30 transition-shadow">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-bl-[4rem] -mr-4 -mt-4" />
                        <div className="relative">
                            <span className="material-icons mb-2 opacity-80">error</span>
                            <p className="text-xs font-medium uppercase tracking-wider opacity-80">Failed</p>
                            <p className="text-3xl font-bold mt-1">{stats?.failed || 0}</p>
                        </div>
                    </div>

                    <div className="relative overflow-hidden bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-5 text-white shadow-lg shadow-amber-500/20 group hover:shadow-xl hover:shadow-amber-500/30 transition-shadow">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-bl-[4rem] -mr-4 -mt-4" />
                        <div className="relative">
                            <span className="material-icons mb-2 opacity-80">schedule</span>
                            <p className="text-xs font-medium uppercase tracking-wider opacity-80">Pending</p>
                            <p className="text-3xl font-bold mt-1">{stats?.pending || 0}</p>
                        </div>
                    </div>

                    <div className="relative overflow-hidden bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-5 text-white shadow-lg shadow-violet-500/20 group hover:shadow-xl hover:shadow-violet-500/30 transition-shadow">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-bl-[4rem] -mr-4 -mt-4" />
                        <div className="relative">
                            <span className="material-icons mb-2 opacity-80">replay</span>
                            <p className="text-xs font-medium uppercase tracking-wider opacity-80">Retryable</p>
                            <p className="text-3xl font-bold mt-1">{stats?.retryable || 0}</p>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white dark:bg-dark-card rounded-2xl shadow-card p-5">
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                        <div className="md:col-span-2">
                            <div className="relative">
                                <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">search</span>
                                <input
                                    type="text"
                                    placeholder="Search by email..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-xl text-sm focus:ring-2 focus:ring-brand"
                                />
                            </div>
                        </div>
                        <div>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-xl text-sm focus:ring-2 focus:ring-brand"
                            >
                                <option value="">All Statuses</option>
                                <option value="sent">Sent</option>
                                <option value="failed">Failed</option>
                                <option value="pending">Pending</option>
                            </select>
                        </div>
                        <div>
                            <select
                                value={emailType}
                                onChange={(e) => setEmailType(e.target.value)}
                                className="w-full px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-xl text-sm focus:ring-2 focus:ring-brand"
                            >
                                <option value="">All Types</option>
                                {emailTypes?.map((type) => (
                                    <option key={type} value={type}>{formatEmailType(type)}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <select
                                value={recipientType}
                                onChange={(e) => setRecipientType(e.target.value)}
                                className="w-full px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-xl text-sm focus:ring-2 focus:ring-brand"
                            >
                                <option value="">All Recipients</option>
                                <option value="customer">Customer</option>
                                <option value="seller">Seller</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={handleFilter}
                                className="flex-1 px-4 py-2.5 bg-brand text-white text-sm font-medium rounded-xl hover:bg-brand-dark transition-colors"
                            >
                                Filter
                            </button>
                            <button
                                onClick={handleClearFilters}
                                className="px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            >
                                <span className="material-icons text-lg">clear</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Logs Table */}
                <div className="bg-white dark:bg-dark-card rounded-2xl shadow-card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-gray-800/50">
                                    <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Type
                                    </th>
                                    <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Recipient
                                    </th>
                                    <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Channel
                                    </th>
                                    <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Attempts
                                    </th>
                                    <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-5 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                                {logs?.data?.map((log) => (
                                    <tr key={log.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors group">
                                        <td className="px-5 py-4">
                                            {getStatusBadge(log.status)}
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-heading dark:text-white">
                                                    {formatEmailType(log.email_type)}
                                                </span>
                                                {getRecipientTypeBadge(log.recipient_type)}
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex flex-col">
                                                {log.user ? (
                                                    <>
                                                        <span className="text-sm font-medium text-heading dark:text-white">
                                                            {log.user.name}
                                                        </span>
                                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                                            {log.recipient_email}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                                        {log.recipient_email}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="inline-flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                                                <span className="material-icons text-sm">
                                                    {log.channel === 'mail' ? 'email' : log.channel === 'sms' ? 'sms' : 'notifications'}
                                                </span>
                                                {log.channel}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={`text-sm font-mono ${log.attempts >= log.max_attempts ? 'text-rose-500' : 'text-gray-600 dark:text-gray-400'}`}>
                                                {log.attempts}/{log.max_attempts}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm text-heading dark:text-white">
                                                    {formatDate(log.created_at)}
                                                </span>
                                                {log.status === 'sent' && log.sent_at && (
                                                    <span className="text-xs text-emerald-600 dark:text-emerald-400">
                                                        Sent: {formatDate(log.sent_at)}
                                                    </span>
                                                )}
                                                {log.status === 'failed' && log.failed_at && (
                                                    <span className="text-xs text-rose-600 dark:text-rose-400">
                                                        Failed: {formatDate(log.failed_at)}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link
                                                    href={route('admin.notification-logs.show', log.id)}
                                                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-brand hover:text-white transition-colors"
                                                    title="View Details"
                                                >
                                                    <span className="material-icons text-lg">visibility</span>
                                                </Link>
                                                {log.status === 'failed' && log.attempts < log.max_attempts && (
                                                    <button
                                                        onClick={() => handleRetry(log.id)}
                                                        disabled={retrying === log.id}
                                                        className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500 hover:text-white transition-colors disabled:opacity-50"
                                                        title="Retry"
                                                    >
                                                        <span className={`material-icons text-lg ${retrying === log.id ? 'animate-spin' : ''}`}>
                                                            {retrying === log.id ? 'refresh' : 'replay'}
                                                        </span>
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(log.id)}
                                                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-rose-500 hover:text-white transition-colors"
                                                    title="Delete"
                                                >
                                                    <span className="material-icons text-lg">delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {(!logs?.data || logs.data.length === 0) && (
                            <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-500">
                                <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                                    <span className="material-icons text-4xl">inbox</span>
                                </div>
                                <p className="text-lg font-medium">No notification logs found</p>
                                <p className="text-sm mt-1">Logs will appear here when notifications are sent</p>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {logs?.links && logs.links.length > 3 && (
                        <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-700/50 flex items-center justify-between">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Showing <span className="font-medium">{logs.from}</span> to <span className="font-medium">{logs.to}</span> of <span className="font-medium">{logs.total}</span> results
                            </p>
                            <nav className="flex items-center gap-1">
                                {logs.links.map((link, index) => (
                                    <Fragment key={index}>
                                        {link.url ? (
                                            <Link
                                                href={link.url}
                                                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                                                    link.active
                                                        ? 'bg-brand text-white'
                                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ) : (
                                            <span
                                                className="px-3 py-1.5 text-sm text-gray-400 dark:text-gray-500"
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        )}
                                    </Fragment>
                                ))}
                            </nav>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
