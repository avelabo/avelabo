import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';

export default function KycShow({ kyc, seller }) {
    const [selectedAction, setSelectedAction] = useState(null);

    const approveForm = useForm({});
    const rejectForm = useForm({ rejection_reason: '' });
    const requestDocsForm = useForm({ rejection_reason: '' });

    const handleApprove = () => {
        approveForm.post(route('admin.kyc.approve', kyc.id));
    };

    const handleReject = (e) => {
        e.preventDefault();
        rejectForm.post(route('admin.kyc.reject', kyc.id));
    };

    const handleRequestDocuments = (e) => {
        e.preventDefault();
        requestDocsForm.post(route('admin.kyc.request-documents', kyc.id));
    };

    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-700',
        approved: 'bg-green-100 text-green-700',
        rejected: 'bg-red-100 text-red-700',
        under_review: 'bg-orange-100 text-orange-700',
    };

    const documentTypes = {
        national_id: 'National ID',
        passport: 'Passport',
        driving_license: 'Driving License',
    };

    return (
        <AdminLayout>
            <Head title={`KYC Review - ${seller?.shop_name}`} />

            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <Link
                    href={route('admin.kyc.index')}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                    <span className="material-icons text-gray-500">arrow_back</span>
                </Link>
                <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">KYC Review</h2>
                    <p className="text-gray-500 text-sm">{seller?.shop_name}</p>
                </div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize ${statusColors[kyc.status] || 'bg-gray-100 text-gray-700'}`}>
                    {kyc.status?.replace('_', ' ')}
                </span>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Seller Information */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Seller Information</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Shop Name</p>
                                <p className="font-medium text-gray-900 dark:text-white">{seller?.shop_name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Owner Name</p>
                                <p className="font-medium text-gray-900 dark:text-white">{seller?.user?.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="font-medium text-gray-900 dark:text-white">{seller?.user?.email}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Phone</p>
                                <p className="font-medium text-gray-900 dark:text-white">{seller?.phone || 'Not provided'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Business Type</p>
                                <p className="font-medium text-gray-900 dark:text-white capitalize">{seller?.business_type}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Registration Number</p>
                                <p className="font-medium text-gray-900 dark:text-white">{seller?.business_registration_number || 'N/A'}</p>
                            </div>
                            {seller?.address && (
                                <div className="md:col-span-2">
                                    <p className="text-sm text-gray-500">Address</p>
                                    <p className="font-medium text-gray-900 dark:text-white">{seller.address}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Document Type */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Document Information</h3>
                        <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div className="w-12 h-12 bg-brand/10 rounded-lg flex items-center justify-center">
                                <span className="material-icons text-brand">badge</span>
                            </div>
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">
                                    {documentTypes[kyc.document_type] || kyc.document_type}
                                </p>
                                <p className="text-sm text-gray-500">
                                    Submitted on {new Date(kyc.submitted_at || kyc.created_at).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Uploaded Documents */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Uploaded Documents</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            {/* ID Front */}
                            <div>
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">ID Front</p>
                                <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                                    {kyc.id_front_url ? (
                                        <a href={kyc.id_front_url} target="_blank" rel="noopener noreferrer">
                                            <img
                                                src={kyc.id_front_url}
                                                alt="ID Front"
                                                className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                                            />
                                        </a>
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <span className="material-icons text-4xl text-gray-400">image</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* ID Back */}
                            <div>
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">ID Back</p>
                                <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                                    {kyc.id_back_url ? (
                                        <a href={kyc.id_back_url} target="_blank" rel="noopener noreferrer">
                                            <img
                                                src={kyc.id_back_url}
                                                alt="ID Back"
                                                className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                                            />
                                        </a>
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            <span className="text-sm">Not provided</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Selfie */}
                            <div className="md:col-span-2">
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Selfie with ID</p>
                                <div className="max-w-md aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                                    {kyc.selfie_url ? (
                                        <a href={kyc.selfie_url} target="_blank" rel="noopener noreferrer">
                                            <img
                                                src={kyc.selfie_url}
                                                alt="Selfie"
                                                className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                                            />
                                        </a>
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <span className="material-icons text-4xl text-gray-400">image</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Previous rejection reason */}
                    {kyc.rejection_reason && kyc.status !== 'approved' && (
                        <div className="bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800 p-6">
                            <h3 className="text-lg font-semibold text-red-700 dark:text-red-400 mb-2">Previous Feedback</h3>
                            <p className="text-red-600 dark:text-red-500">{kyc.rejection_reason}</p>
                        </div>
                    )}
                </div>

                {/* Sidebar - Actions */}
                <div className="space-y-6">
                    {kyc.status === 'pending' || kyc.status === 'under_review' ? (
                        <>
                            {/* Quick Actions */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Actions</h3>
                                <div className="space-y-3">
                                    <button
                                        onClick={handleApprove}
                                        disabled={approveForm.processing}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium text-sm transition-colors disabled:opacity-50"
                                    >
                                        <span className="material-icons text-lg">check_circle</span>
                                        {approveForm.processing ? 'Approving...' : 'Approve KYC'}
                                    </button>

                                    <button
                                        onClick={() => setSelectedAction('reject')}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium text-sm transition-colors"
                                    >
                                        <span className="material-icons text-lg">cancel</span>
                                        Reject KYC
                                    </button>

                                    <button
                                        onClick={() => setSelectedAction('request_docs')}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium text-sm transition-colors"
                                    >
                                        <span className="material-icons text-lg">description</span>
                                        Request Documents
                                    </button>
                                </div>
                            </div>

                            {/* Rejection Form */}
                            {selectedAction === 'reject' && (
                                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Reject Application</h3>
                                    <form onSubmit={handleReject}>
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Rejection Reason *
                                            </label>
                                            <textarea
                                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg outline-none text-sm focus:ring-2 focus:ring-red-500 dark:text-white"
                                                placeholder="Explain why the application is being rejected..."
                                                rows={4}
                                                value={rejectForm.data.rejection_reason}
                                                onChange={(e) => rejectForm.setData('rejection_reason', e.target.value)}
                                                required
                                            />
                                            {rejectForm.errors.rejection_reason && (
                                                <p className="text-red-500 text-xs mt-1">{rejectForm.errors.rejection_reason}</p>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setSelectedAction(null)}
                                                className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={rejectForm.processing}
                                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                                            >
                                                {rejectForm.processing ? 'Rejecting...' : 'Confirm Reject'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {/* Request Documents Form */}
                            {selectedAction === 'request_docs' && (
                                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Request Additional Documents</h3>
                                    <form onSubmit={handleRequestDocuments}>
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                What documents are needed? *
                                            </label>
                                            <textarea
                                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg outline-none text-sm focus:ring-2 focus:ring-orange-500 dark:text-white"
                                                placeholder="Describe what additional documents or information is required..."
                                                rows={4}
                                                value={requestDocsForm.data.rejection_reason}
                                                onChange={(e) => requestDocsForm.setData('rejection_reason', e.target.value)}
                                                required
                                            />
                                            {requestDocsForm.errors.rejection_reason && (
                                                <p className="text-red-500 text-xs mt-1">{requestDocsForm.errors.rejection_reason}</p>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setSelectedAction(null)}
                                                className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={requestDocsForm.processing}
                                                className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors disabled:opacity-50"
                                            >
                                                {requestDocsForm.processing ? 'Sending...' : 'Send Request'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
                            <div className={`text-center p-4 rounded-lg ${
                                kyc.status === 'approved' ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'
                            }`}>
                                <span className={`material-icons text-4xl ${
                                    kyc.status === 'approved' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                    {kyc.status === 'approved' ? 'check_circle' : 'cancel'}
                                </span>
                                <p className={`font-medium mt-2 ${
                                    kyc.status === 'approved' ? 'text-green-700' : 'text-red-700'
                                }`}>
                                    {kyc.status === 'approved' ? 'Application Approved' : 'Application Rejected'}
                                </p>
                                {kyc.reviewed_at && (
                                    <p className="text-sm text-gray-500 mt-1">
                                        on {new Date(kyc.reviewed_at).toLocaleDateString()}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Application Timeline */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Timeline</h3>
                        <div className="space-y-4">
                            <div className="flex gap-3">
                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="material-icons text-green-600 text-sm">check</span>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">Submitted</p>
                                    <p className="text-sm text-gray-500">
                                        {new Date(kyc.submitted_at || kyc.created_at).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            {kyc.reviewed_at && (
                                <div className="flex gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                        kyc.status === 'approved' ? 'bg-green-100' : 'bg-red-100'
                                    }`}>
                                        <span className={`material-icons text-sm ${
                                            kyc.status === 'approved' ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                            {kyc.status === 'approved' ? 'verified' : 'close'}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white capitalize">
                                            {kyc.status?.replace('_', ' ')}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {new Date(kyc.reviewed_at).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
