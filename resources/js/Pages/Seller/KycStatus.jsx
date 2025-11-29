import { Head, Link } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';

export default function KycStatus({ seller, kyc }) {
    const statusConfig = {
        pending: {
            icon: 'hourglass_empty',
            iconBg: 'bg-yellow-100',
            iconColor: 'text-yellow-600',
            title: 'Verification Pending',
            description: 'Your documents are being reviewed. This usually takes 1-2 business days.',
        },
        approved: {
            icon: 'check_circle',
            iconBg: 'bg-green-100',
            iconColor: 'text-green-600',
            title: 'Verification Approved',
            description: 'Congratulations! Your seller account has been verified. You can now start selling.',
        },
        rejected: {
            icon: 'cancel',
            iconBg: 'bg-red-100',
            iconColor: 'text-red-600',
            title: 'Verification Rejected',
            description: 'Unfortunately, your verification was not approved.',
        },
        documents_requested: {
            icon: 'description',
            iconBg: 'bg-orange-100',
            iconColor: 'text-orange-600',
            title: 'Additional Documents Required',
            description: 'We need some additional documents to complete your verification.',
        },
    };

    const status = kyc?.status || 'pending';
    const config = statusConfig[status] || statusConfig.pending;

    return (
        <GuestLayout>
            <Head title="KYC Status" />

            <div className="w-full max-w-md mx-auto">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-8 text-center">
                    <div className={`w-20 h-20 ${config.iconBg} rounded-full flex items-center justify-center mx-auto mb-6`}>
                        <span className={`material-icons text-4xl ${config.iconColor}`}>{config.icon}</span>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{config.title}</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">{config.description}</p>

                    {status === 'rejected' && kyc?.rejection_reason && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
                            <p className="text-sm text-red-800 font-medium mb-1">Reason:</p>
                            <p className="text-sm text-red-600">{kyc.rejection_reason}</p>
                        </div>
                    )}

                    {status === 'documents_requested' && kyc?.rejection_reason && (
                        <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg text-left">
                            <p className="text-sm text-orange-800 font-medium mb-1">What we need:</p>
                            <p className="text-sm text-orange-600">{kyc.rejection_reason}</p>
                        </div>
                    )}

                    {/* Status Timeline */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between relative">
                            <div className="absolute left-0 right-0 top-4 h-0.5 bg-gray-200"></div>

                            <div className="relative flex flex-col items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${kyc ? 'bg-green-500' : 'bg-gray-300'}`}>
                                    <span className="material-icons text-white text-sm">check</span>
                                </div>
                                <span className="text-xs text-gray-500 mt-2">Submitted</span>
                            </div>

                            <div className="relative flex flex-col items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${status === 'pending' ? 'bg-yellow-500 animate-pulse' : status === 'approved' ? 'bg-green-500' : 'bg-gray-300'}`}>
                                    <span className="material-icons text-white text-sm">
                                        {status === 'pending' ? 'pending' : status === 'approved' ? 'check' : 'remove'}
                                    </span>
                                </div>
                                <span className="text-xs text-gray-500 mt-2">Under Review</span>
                            </div>

                            <div className="relative flex flex-col items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${status === 'approved' ? 'bg-green-500' : 'bg-gray-300'}`}>
                                    <span className="material-icons text-white text-sm">
                                        {status === 'approved' ? 'check' : 'remove'}
                                    </span>
                                </div>
                                <span className="text-xs text-gray-500 mt-2">Verified</span>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                        {status === 'approved' && (
                            <Link
                                href={route('seller.dashboard')}
                                className="block w-full py-3 bg-brand hover:bg-brand-dark text-white rounded-lg font-medium text-sm transition-colors"
                            >
                                Go to Seller Dashboard
                            </Link>
                        )}

                        {(status === 'rejected' || status === 'documents_requested') && (
                            <Link
                                href={route('seller.kyc.create')}
                                className="block w-full py-3 bg-brand hover:bg-brand-dark text-white rounded-lg font-medium text-sm transition-colors"
                            >
                                Resubmit Documents
                            </Link>
                        )}

                        <Link
                            href={route('home')}
                            className="block w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium text-sm transition-colors"
                        >
                            Back to Home
                        </Link>
                    </div>

                    {kyc?.submitted_at && (
                        <p className="text-xs text-gray-400 mt-6">
                            Submitted on {new Date(kyc.submitted_at).toLocaleDateString()}
                        </p>
                    )}
                </div>
            </div>
        </GuestLayout>
    );
}
