import { Head, useForm } from '@inertiajs/react';
import SellerLayout from '@/Layouts/SellerLayout';
import { useState } from 'react';

export default function SellerProfile({ seller, user }) {
    const { data, setData, patch, processing, errors } = useForm({
        shop_name: seller?.shop_name || '',
        shop_description: seller?.shop_description || '',
        business_type: seller?.business_type || 'individual',
        business_registration_number: seller?.business_registration_number || '',
        phone: seller?.phone || '',
        address: seller?.address || '',
    });

    const [logoPreview, setLogoPreview] = useState(null);
    const [bannerPreview, setBannerPreview] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        patch(route('seller.profile.update'));
    };

    return (
        <SellerLayout title="Shop Profile">
            <Head title="Shop Profile" />

            {/* Header */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Shop Profile</h2>
                <p className="text-gray-500 text-sm">Manage your shop information and branding</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <form onSubmit={handleSubmit}>
                        {/* Shop Information */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6 mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Shop Information</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Shop Name *
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg outline-none text-sm focus:ring-2 focus:ring-brand dark:text-white"
                                        placeholder="Enter your shop name"
                                        value={data.shop_name}
                                        onChange={(e) => setData('shop_name', e.target.value)}
                                        required
                                    />
                                    {errors.shop_name && <p className="text-red-500 text-xs mt-1">{errors.shop_name}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Shop Description
                                    </label>
                                    <textarea
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg outline-none text-sm focus:ring-2 focus:ring-brand dark:text-white"
                                        placeholder="Tell customers about your shop..."
                                        rows={4}
                                        value={data.shop_description}
                                        onChange={(e) => setData('shop_description', e.target.value)}
                                    />
                                    {errors.shop_description && <p className="text-red-500 text-xs mt-1">{errors.shop_description}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Business Details */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6 mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Business Details</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Business Type
                                    </label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <label className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${data.business_type === 'individual' ? 'border-brand bg-brand/5' : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'}`}>
                                            <input
                                                type="radio"
                                                name="business_type"
                                                value="individual"
                                                checked={data.business_type === 'individual'}
                                                onChange={(e) => setData('business_type', e.target.value)}
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
                                                onChange={(e) => setData('business_type', e.target.value)}
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
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg outline-none text-sm focus:ring-2 focus:ring-brand dark:text-white"
                                            placeholder="Enter registration number"
                                            value={data.business_registration_number}
                                            onChange={(e) => setData('business_registration_number', e.target.value)}
                                        />
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Phone Number
                                    </label>
                                    <div className="flex gap-2">
                                        <span className="flex items-center px-3 bg-gray-100 dark:bg-gray-600 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-600 dark:text-gray-300">
                                            +265
                                        </span>
                                        <input
                                            type="tel"
                                            className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg outline-none text-sm focus:ring-2 focus:ring-brand dark:text-white"
                                            placeholder="999 000 000"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                        />
                                    </div>
                                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Business Address
                                    </label>
                                    <textarea
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg outline-none text-sm focus:ring-2 focus:ring-brand dark:text-white"
                                        placeholder="Enter your business address"
                                        rows={2}
                                        value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="px-6 py-3 bg-brand hover:bg-brand-dark text-white rounded-lg font-medium text-sm transition-colors disabled:opacity-50"
                            disabled={processing}
                        >
                            {processing ? 'Saving...' : 'Save Changes'}
                        </button>
                    </form>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Shop Status */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Shop Status</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                    seller?.status === 'approved' ? 'bg-green-100' : 'bg-yellow-100'
                                }`}>
                                    <span className={`material-icons ${
                                        seller?.status === 'approved' ? 'text-green-600' : 'text-yellow-600'
                                    }`}>
                                        {seller?.status === 'approved' ? 'verified' : 'pending'}
                                    </span>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white capitalize">
                                        {seller?.status || 'Pending'}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {seller?.status === 'approved' ? 'Your shop is verified' : 'Awaiting verification'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Account Info */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Account Info</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                    <span className="material-icons text-gray-500">person</span>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">{user?.name}</p>
                                    <p className="text-gray-500">{user?.email}</p>
                                </div>
                            </div>
                            <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
                                <p className="text-gray-500">Member since</p>
                                <p className="text-gray-900 dark:text-white">
                                    {new Date(seller?.created_at).toLocaleDateString('en-US', {
                                        month: 'long',
                                        year: 'numeric',
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Stats</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Total Products</span>
                                <span className="font-medium text-gray-900 dark:text-white">{seller?.products_count || 0}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Total Orders</span>
                                <span className="font-medium text-gray-900 dark:text-white">{seller?.orders_count || 0}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Rating</span>
                                <span className="font-medium text-gray-900 dark:text-white flex items-center gap-1">
                                    <span className="material-icons text-yellow-500 text-sm">star</span>
                                    {seller?.rating || 'N/A'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SellerLayout>
    );
}
