import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';

export default function NotificationLogShow({ log }) {
    const [retrying, setRetrying] = useState(false);

    const handleRetry = () => {
        setRetrying(true);
        router.post(route('admin.notification-logs.retry', log.id), {}, {
            preserveScroll: true,
            onFinish: () => setRetrying(false),
        });
    };

    const handleDelete = () => {
        if (!confirm('Delete this notification log?')) return;
        router.delete(route('admin.notification-logs.destroy', log.id), {
            onSuccess: () => {
                router.visit(route('admin.notification-logs.index'));
            },
        });
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleString('en-GB', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    };

    const formatEmailType = (type) => {
        return type
            .replace(/^(customer|seller|admin)\./, '')
            .replace(/_/g, ' ')
            .replace(/\b\w/g, c => c.toUpperCase());
    };

    const getStatusConfig = (status) => {
        const configs = {
            sent: {
                bg: 'bg-emerald-500',
                icon: 'check_circle',
                text: 'Sent Successfully',
                description: 'This notification was delivered successfully.',
            },
            failed: {
                bg: 'bg-rose-500',
                icon: 'error',
                text: 'Failed',
                description: 'This notification could not be delivered.',
            },
            pending: {
                bg: 'bg-amber-500',
                icon: 'schedule',
                text: 'Pending',
                description: 'This notification is waiting to be processed.',
            },
        };
        return configs[status] || configs.pending;
    };

    const statusConfig = getStatusConfig(log.status);

    return (
        <AdminLayout>
            <Head title={`Notification Log #${log.id}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Link
                            href={route('admin.notification-logs.index')}
                            className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                            <span className="material-icons">arrow_back</span>
                        </Link>
                        <div>
                            <h2 className="text-2xl font-bold text-heading dark:text-white">
                                Notification Log #{log.id}
                            </h2>
                            <p className="text-body mt-1">{formatEmailType(log.email_type)}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {log.status === 'failed' && log.attempts < log.max_attempts && (
                            <button
                                onClick={handleRetry}
                                disabled={retrying}
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-medium rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg shadow-amber-500/25 disabled:opacity-50"
                            >
                                <span className={`material-icons ${retrying ? 'animate-spin' : ''}`}>
                                    {retrying ? 'refresh' : 'replay'}
                                </span>
                                {retrying ? 'Retrying...' : 'Retry Notification'}
                            </button>
                        )}
                        <button
                            onClick={handleDelete}
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-xl hover:bg-rose-500 hover:text-white transition-all"
                        >
                            <span className="material-icons">delete</span>
                            Delete
                        </button>
                    </div>
                </div>

                {/* Status Banner */}
                <div className={`${statusConfig.bg} rounded-2xl p-6 text-white shadow-lg`}>
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
                            <span className="material-icons text-3xl">{statusConfig.icon}</span>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">{statusConfig.text}</h3>
                            <p className="text-white/80 mt-1">{statusConfig.description}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Notification Info */}
                        <div className="bg-white dark:bg-dark-card rounded-2xl shadow-card overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700/50">
                                <h3 className="text-lg font-semibold text-heading dark:text-white flex items-center gap-2">
                                    <span className="material-icons text-brand">info</span>
                                    Notification Details
                                </h3>
                            </div>
                            <div className="p-6">
                                <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <dt className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email Type</dt>
                                        <dd className="mt-1 text-sm font-medium text-heading dark:text-white">{formatEmailType(log.email_type)}</dd>
                                        <dd className="text-xs text-gray-400 dark:text-gray-500 font-mono mt-0.5">{log.email_type}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Recipient Type</dt>
                                        <dd className="mt-1">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${
                                                log.recipient_type === 'customer' ? 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400' :
                                                log.recipient_type === 'seller' ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400' :
                                                'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                                            }`}>
                                                <span className="material-icons text-sm">
                                                    {log.recipient_type === 'customer' ? 'person' : log.recipient_type === 'seller' ? 'storefront' : 'admin_panel_settings'}
                                                </span>
                                                {log.recipient_type.charAt(0).toUpperCase() + log.recipient_type.slice(1)}
                                            </span>
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Channel</dt>
                                        <dd className="mt-1 text-sm text-heading dark:text-white flex items-center gap-2">
                                            <span className="material-icons text-lg text-gray-400">
                                                {log.channel === 'mail' ? 'email' : log.channel === 'sms' ? 'sms' : 'notifications'}
                                            </span>
                                            {log.channel.charAt(0).toUpperCase() + log.channel.slice(1)}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Notification Class</dt>
                                        <dd className="mt-1 text-xs text-gray-600 dark:text-gray-400 font-mono break-all">{log.notification_class}</dd>
                                    </div>
                                </dl>
                            </div>
                        </div>

                        {/* Error Details (if failed) */}
                        {log.status === 'failed' && log.error_message && (
                            <div className="bg-white dark:bg-dark-card rounded-2xl shadow-card overflow-hidden border-l-4 border-rose-500">
                                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700/50 bg-rose-50 dark:bg-rose-900/10">
                                    <h3 className="text-lg font-semibold text-rose-700 dark:text-rose-400 flex items-center gap-2">
                                        <span className="material-icons">error_outline</span>
                                        Error Details
                                    </h3>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div>
                                        <dt className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Error Message</dt>
                                        <dd className="p-4 bg-rose-50 dark:bg-rose-900/20 rounded-xl text-sm text-rose-700 dark:text-rose-300 font-mono">
                                            {log.error_message}
                                        </dd>
                                    </div>
                                    {log.error_trace && (
                                        <div>
                                            <dt className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Stack Trace</dt>
                                            <dd className="p-4 bg-gray-900 rounded-xl text-xs text-gray-300 font-mono overflow-x-auto max-h-64 overflow-y-auto">
                                                <pre className="whitespace-pre-wrap break-words">{log.error_trace}</pre>
                                            </dd>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Notification Data */}
                        {log.notification_data && Object.keys(log.notification_data).length > 0 && (
                            <div className="bg-white dark:bg-dark-card rounded-2xl shadow-card overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700/50">
                                    <h3 className="text-lg font-semibold text-heading dark:text-white flex items-center gap-2">
                                        <span className="material-icons text-brand">data_object</span>
                                        Notification Data
                                    </h3>
                                </div>
                                <div className="p-6">
                                    <pre className="p-4 bg-gray-900 rounded-xl text-xs text-gray-300 font-mono overflow-x-auto">
                                        {JSON.stringify(log.notification_data, null, 2)}
                                    </pre>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Recipient Info */}
                        <div className="bg-white dark:bg-dark-card rounded-2xl shadow-card overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700/50">
                                <h3 className="text-lg font-semibold text-heading dark:text-white flex items-center gap-2">
                                    <span className="material-icons text-brand">person</span>
                                    Recipient
                                </h3>
                            </div>
                            <div className="p-6">
                                {log.user ? (
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center text-white font-bold text-lg">
                                            {log.user.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-medium text-heading dark:text-white">{log.user.name}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{log.user.email}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500">
                                            <span className="material-icons">email</span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-heading dark:text-white">Guest</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{log.recipient_email}</p>
                                        </div>
                                    </div>
                                )}

                                {log.recipient_phone && (
                                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700/50">
                                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Phone</p>
                                        <p className="mt-1 text-sm text-heading dark:text-white">{log.recipient_phone}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="bg-white dark:bg-dark-card rounded-2xl shadow-card overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700/50">
                                <h3 className="text-lg font-semibold text-heading dark:text-white flex items-center gap-2">
                                    <span className="material-icons text-brand">schedule</span>
                                    Timeline
                                </h3>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                                            <span className="material-icons text-blue-600 dark:text-blue-400 text-sm">add_circle</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-heading dark:text-white">Created</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(log.created_at)}</p>
                                        </div>
                                    </div>

                                    {log.last_attempt_at && (
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                                                <span className="material-icons text-amber-600 dark:text-amber-400 text-sm">replay</span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-heading dark:text-white">Last Attempt</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(log.last_attempt_at)}</p>
                                                <p className="text-xs text-gray-400 mt-0.5">Attempt {log.attempts} of {log.max_attempts}</p>
                                            </div>
                                        </div>
                                    )}

                                    {log.sent_at && (
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                                                <span className="material-icons text-emerald-600 dark:text-emerald-400 text-sm">check_circle</span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-heading dark:text-white">Sent</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(log.sent_at)}</p>
                                            </div>
                                        </div>
                                    )}

                                    {log.failed_at && (
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center flex-shrink-0">
                                                <span className="material-icons text-rose-600 dark:text-rose-400 text-sm">error</span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-heading dark:text-white">Failed</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(log.failed_at)}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Attempts Counter */}
                        <div className="bg-white dark:bg-dark-card rounded-2xl shadow-card p-6">
                            <div className="text-center">
                                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-3 ${
                                    log.attempts >= log.max_attempts
                                        ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                                }`}>
                                    <span className="text-2xl font-bold">{log.attempts}</span>
                                </div>
                                <p className="text-sm font-medium text-heading dark:text-white">
                                    of {log.max_attempts} attempts
                                </p>
                                {log.attempts >= log.max_attempts ? (
                                    <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">Maximum attempts reached</p>
                                ) : log.status === 'failed' ? (
                                    <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">{log.max_attempts - log.attempts} retries remaining</p>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
