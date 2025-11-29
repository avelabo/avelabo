import { Head, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import { useState } from 'react';

export default function SellerKyc({ seller, existingKyc, documentTypes }) {
    const { data, setData, post, processing, errors, progress } = useForm({
        document_type: 'national_id',
        id_front: null,
        id_back: null,
        selfie: null,
        business_document: null,
    });

    const [previews, setPreviews] = useState({});

    const handleFileChange = (field, file) => {
        setData(field, file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviews(prev => ({ ...prev, [field]: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('seller.kyc.store'), {
            forceFormData: true,
        });
    };

    if (existingKyc && existingKyc.status === 'pending') {
        return (
            <GuestLayout>
                <Head title="KYC Pending" />
                <div className="w-full max-w-md mx-auto text-center">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-8">
                        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="material-icons text-3xl text-yellow-600">hourglass_empty</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">KYC Under Review</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Your documents are being reviewed. This usually takes 1-2 business days.
                        </p>
                        <a href={route('seller.kyc.status')} className="text-brand hover:underline">
                            Check Status
                        </a>
                    </div>
                </div>
            </GuestLayout>
        );
    }

    return (
        <GuestLayout>
            <Head title="KYC Verification" />

            <div className="w-full max-w-2xl mx-auto">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-8">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="material-icons text-3xl text-brand">verified_user</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Identity Verification</h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Complete KYC verification to start selling on Avelabo
                        </p>
                    </div>

                    {existingKyc?.status === 'rejected' && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-800 font-medium">Previous submission rejected:</p>
                            <p className="text-sm text-red-600">{existingKyc.rejection_reason}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                ID Document Type *
                            </label>
                            <select
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg outline-none text-sm focus:ring-2 focus:ring-brand focus:border-transparent dark:text-white"
                                value={data.document_type}
                                onChange={e => setData('document_type', e.target.value)}
                            >
                                {Object.entries(documentTypes).map(([value, label]) => (
                                    <option key={value} value={value}>{label}</option>
                                ))}
                            </select>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 mb-6">
                            {/* ID Front */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    ID Front *
                                </label>
                                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center hover:border-brand transition-colors">
                                    {previews.id_front ? (
                                        <div className="relative">
                                            <img src={previews.id_front} alt="ID Front" className="w-full h-32 object-cover rounded" />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setData('id_front', null);
                                                    setPreviews(prev => ({ ...prev, id_front: null }));
                                                }}
                                                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full"
                                            >
                                                <span className="material-icons text-sm">close</span>
                                            </button>
                                        </div>
                                    ) : (
                                        <label className="cursor-pointer">
                                            <span className="material-icons text-4xl text-gray-400">add_photo_alternate</span>
                                            <p className="text-sm text-gray-500 mt-2">Upload front of ID</p>
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/*,.pdf"
                                                onChange={e => handleFileChange('id_front', e.target.files[0])}
                                            />
                                        </label>
                                    )}
                                </div>
                                {errors.id_front && <p className="text-red-500 text-xs mt-1">{errors.id_front}</p>}
                            </div>

                            {/* ID Back */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    ID Back (Optional)
                                </label>
                                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center hover:border-brand transition-colors">
                                    {previews.id_back ? (
                                        <div className="relative">
                                            <img src={previews.id_back} alt="ID Back" className="w-full h-32 object-cover rounded" />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setData('id_back', null);
                                                    setPreviews(prev => ({ ...prev, id_back: null }));
                                                }}
                                                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full"
                                            >
                                                <span className="material-icons text-sm">close</span>
                                            </button>
                                        </div>
                                    ) : (
                                        <label className="cursor-pointer">
                                            <span className="material-icons text-4xl text-gray-400">add_photo_alternate</span>
                                            <p className="text-sm text-gray-500 mt-2">Upload back of ID</p>
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/*,.pdf"
                                                onChange={e => handleFileChange('id_back', e.target.files[0])}
                                            />
                                        </label>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Selfie */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Selfie with ID *
                            </label>
                            <p className="text-xs text-gray-500 mb-2">Take a clear photo of yourself holding your ID document</p>
                            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center hover:border-brand transition-colors">
                                {previews.selfie ? (
                                    <div className="relative inline-block">
                                        <img src={previews.selfie} alt="Selfie" className="h-40 object-cover rounded" />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setData('selfie', null);
                                                setPreviews(prev => ({ ...prev, selfie: null }));
                                            }}
                                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full"
                                        >
                                            <span className="material-icons text-sm">close</span>
                                        </button>
                                    </div>
                                ) : (
                                    <label className="cursor-pointer">
                                        <span className="material-icons text-4xl text-gray-400">face</span>
                                        <p className="text-sm text-gray-500 mt-2">Upload selfie with ID</p>
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={e => handleFileChange('selfie', e.target.files[0])}
                                        />
                                    </label>
                                )}
                            </div>
                            {errors.selfie && <p className="text-red-500 text-xs mt-1">{errors.selfie}</p>}
                        </div>

                        {progress && (
                            <div className="mb-4">
                                <div className="bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-brand h-2 rounded-full transition-all"
                                        style={{ width: `${progress.percentage}%` }}
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Uploading... {progress.percentage}%</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full py-3 bg-brand hover:bg-brand-dark text-white rounded-lg font-medium text-sm transition-colors disabled:opacity-50"
                            disabled={processing}
                        >
                            {processing ? 'Submitting...' : 'Submit for Verification'}
                        </button>
                    </form>
                </div>
            </div>
        </GuestLayout>
    );
}
