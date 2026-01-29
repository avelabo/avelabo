import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';

export default function KycIndex({ kycApplications, filters }) {
    const [status, setStatus] = useState(filters?.status || '');

    const handleFilter = (newStatus) => {
        setStatus(newStatus);
        router.get(route('admin.kyc.index'), { status: newStatus }, { preserveState: true });
    };

    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-700',
        approved: 'bg-green-100 text-green-700',
        rejected: 'bg-red-100 text-red-700',
        under_review: 'bg-orange-100 text-orange-700',
    };

    const statusTabs = [
        { value: '', label: 'All', count: filters?.counts?.all || 0 },
        { value: 'pending', label: 'Pending', count: filters?.counts?.pending || 0 },
        { value: 'approved', label: 'Approved', count: filters?.counts?.approved || 0 },
        { value: 'rejected', label: 'Rejected', count: filters?.counts?.rejected || 0 },
        { value: 'under_review', label: 'Under Review', count: filters?.counts?.under_review || 0 },
    ];

    return (
        <AdminLayout>
            <Head title="KYC Verifications" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">KYC Verifications</h2>
                    <p className="text-gray-500 text-sm">Review and manage seller verification applications</p>
                </div>
            </div>

            {/* Status Tabs */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-2 mb-6">
                <div className="flex flex-wrap gap-2">
                    {statusTabs.map((tab) => (
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
                            {tab.count > 0 && (
                                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                                    status === tab.value ? 'bg-white/20' : 'bg-gray-200 dark:bg-gray-600'
                                }`}>
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* KYC Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                {kycApplications?.data?.length > 0 ? (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-700/50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Seller
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Shop Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Document Type
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Submitted
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {kycApplications.data.map((kyc) => (
                                        <tr key={kyc.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                                        <span className="material-icons text-gray-500">person</span>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900 dark:text-white">{kyc.seller?.user?.name}</p>
                                                        <p className="text-sm text-gray-500">{kyc.seller?.user?.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <p className="text-gray-900 dark:text-white">{kyc.seller?.shop_name}</p>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="capitalize text-gray-900 dark:text-white">
                                                    {kyc.document_type?.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[kyc.status] || 'bg-gray-100 text-gray-700'}`}>
                                                    {kyc.status?.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(kyc.submitted_at || kyc.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <Link
                                                    href={route('admin.kyc.show', kyc.id)}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-brand hover:bg-brand/10 rounded-lg transition-colors"
                                                >
                                                    <span className="material-icons text-lg">visibility</span>
                                                    Review
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {kycApplications.last_page > 1 && (
                            <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-gray-500">
                                        Showing {kycApplications.from} to {kycApplications.to} of {kycApplications.total} applications
                                    </p>
                                    <div className="flex gap-2">
                                        {kycApplications.links.map((link, index) => (
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
                        <span className="material-icons text-5xl text-gray-300 mb-4">verified_user</span>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No KYC applications</h3>
                        <p className="text-gray-500">
                            {status ? `No ${status.replace('_', ' ')} applications at the moment.` : 'No verification applications yet.'}
                        </p>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
