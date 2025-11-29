import { Head, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';

export default function SellerRegister({ user }) {
    const { data, setData, post, processing, errors } = useForm({
        shop_name: '',
        shop_description: '',
        business_type: 'individual',
        business_registration_number: '',
        phone: user?.phone || '',
        address: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('seller.register.store'));
    };

    return (
        <GuestLayout>
            <Head title="Become a Seller" />

            <div className="w-full max-w-2xl mx-auto">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-8">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="material-icons text-3xl text-brand">storefront</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Become a Seller</h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Start selling on Avelabo and reach thousands of customers across Malawi
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Shop Information</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Shop Name *
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg outline-none text-sm focus:ring-2 focus:ring-brand focus:border-transparent dark:text-white"
                                        placeholder="Enter your shop name"
                                        value={data.shop_name}
                                        onChange={e => setData('shop_name', e.target.value)}
                                        required
                                    />
                                    {errors.shop_name && <p className="text-red-500 text-xs mt-1">{errors.shop_name}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Shop Description
                                    </label>
                                    <textarea
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg outline-none text-sm focus:ring-2 focus:ring-brand focus:border-transparent dark:text-white"
                                        placeholder="Tell customers about your shop..."
                                        rows={3}
                                        value={data.shop_description}
                                        onChange={e => setData('shop_description', e.target.value)}
                                    />
                                    {errors.shop_description && <p className="text-red-500 text-xs mt-1">{errors.shop_description}</p>}
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Business Details</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Business Type *
                                    </label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <label className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${data.business_type === 'individual' ? 'border-brand bg-brand/5' : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'}`}>
                                            <input
                                                type="radio"
                                                name="business_type"
                                                value="individual"
                                                checked={data.business_type === 'individual'}
                                                onChange={e => setData('business_type', e.target.value)}
                                                className="text-brand focus:ring-brand"
                                            />
                                            <div>
                                                <span className="block text-sm font-medium text-gray-900 dark:text-white">Individual</span>
                                                <span className="text-xs text-gray-500">Selling as yourself</span>
                                            </div>
                                        </label>
                                        <label className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${data.business_type === 'business' ? 'border-brand bg-brand/5' : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'}`}>
                                            <input
                                                type="radio"
                                                name="business_type"
                                                value="business"
                                                checked={data.business_type === 'business'}
                                                onChange={e => setData('business_type', e.target.value)}
                                                className="text-brand focus:ring-brand"
                                            />
                                            <div>
                                                <span className="block text-sm font-medium text-gray-900 dark:text-white">Business</span>
                                                <span className="text-xs text-gray-500">Registered company</span>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                {data.business_type === 'business' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Business Registration Number
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg outline-none text-sm focus:ring-2 focus:ring-brand focus:border-transparent dark:text-white"
                                            placeholder="Enter registration number"
                                            value={data.business_registration_number}
                                            onChange={e => setData('business_registration_number', e.target.value)}
                                        />
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Phone Number *
                                    </label>
                                    <div className="flex gap-2">
                                        <span className="flex items-center px-3 bg-gray-100 dark:bg-gray-600 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-600 dark:text-gray-300">
                                            +265
                                        </span>
                                        <input
                                            type="tel"
                                            className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg outline-none text-sm focus:ring-2 focus:ring-brand focus:border-transparent dark:text-white"
                                            placeholder="999 000 000"
                                            value={data.phone}
                                            onChange={e => setData('phone', e.target.value)}
                                            required
                                        />
                                    </div>
                                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Business Address
                                    </label>
                                    <textarea
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg outline-none text-sm focus:ring-2 focus:ring-brand focus:border-transparent dark:text-white"
                                        placeholder="Enter your business address"
                                        rows={2}
                                        value={data.address}
                                        onChange={e => setData('address', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 bg-brand hover:bg-brand-dark text-white rounded-lg font-medium text-sm transition-colors disabled:opacity-50"
                            disabled={processing}
                        >
                            {processing ? 'Creating Shop...' : 'Create Shop & Continue to KYC'}
                        </button>
                    </form>
                </div>
            </div>
        </GuestLayout>
    );
}
