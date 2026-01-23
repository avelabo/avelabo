import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Create({ currencies, countries, markupTemplates, availableUsers }) {
    const { data, setData, post, processing, errors } = useForm({
        user_id: '',
        shop_name: '',
        description: '',
        business_type: 'individual',
        business_name: '',
        business_registration_number: '',
        default_currency_id: '',
        country_id: '',
        markup_template_id: '',
        commission_rate: 10,
        status: 'approved',
        show_seller_name: true,
        has_storefront: true,
        is_featured: false,
        is_verified: false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.sellers.store'));
    };

    return (
        <AdminLayout>
            <Head title="Create Seller" />

            <div className="space-y-6">
                {/* Back Link */}
                <div>
                    <Link
                        href={route('admin.sellers.index')}
                        className="inline-flex items-center text-brand hover:text-brand-dark font-medium"
                    >
                        <span className="material-icons mr-1">arrow_back</span> Back to Sellers
                    </Link>
                </div>

                {/* Header */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create Seller</h2>
                    <p className="text-gray-500 text-sm">Add a new seller account to the platform</p>
                </div>

                {/* Form */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
                    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
                        {/* User Selection */}
                        <div>
                            <label htmlFor="user_id" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                                Select User *
                            </label>
                            <select
                                id="user_id"
                                value={data.user_id}
                                onChange={(e) => setData('user_id', e.target.value)}
                                className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg text-sm dark:text-white"
                                required
                            >
                                <option value="">Select a user</option>
                                {availableUsers?.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.name} ({user.email})
                                    </option>
                                ))}
                            </select>
                            {errors.user_id && <p className="mt-1 text-sm text-red-600">{errors.user_id}</p>}
                            {availableUsers?.length === 0 && (
                                <p className="mt-1 text-sm text-yellow-600">No available users. All active users are already sellers.</p>
                            )}
                        </div>

                        {/* Basic Info Section */}
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-6 space-y-4">
                            <h4 className="font-semibold text-gray-900 dark:text-white">Basic Information</h4>

                            <div>
                                <label htmlFor="shop_name" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                                    Shop Name *
                                </label>
                                <input
                                    id="shop_name"
                                    type="text"
                                    value={data.shop_name}
                                    onChange={(e) => setData('shop_name', e.target.value)}
                                    className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg text-sm dark:text-white"
                                    required
                                />
                                {errors.shop_name && <p className="mt-1 text-sm text-red-600">{errors.shop_name}</p>}
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={4}
                                    className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg text-sm dark:text-white"
                                />
                                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                            </div>
                        </div>

                        {/* Business Info Section */}
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-6 space-y-4">
                            <h4 className="font-semibold text-gray-900 dark:text-white">Business Information</h4>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="business_type" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                                        Business Type *
                                    </label>
                                    <select
                                        id="business_type"
                                        value={data.business_type}
                                        onChange={(e) => setData('business_type', e.target.value)}
                                        className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg text-sm dark:text-white"
                                        required
                                    >
                                        <option value="individual">Individual</option>
                                        <option value="company">Company</option>
                                    </select>
                                    {errors.business_type && <p className="mt-1 text-sm text-red-600">{errors.business_type}</p>}
                                </div>

                                <div>
                                    <label htmlFor="business_name" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                                        Business Name
                                    </label>
                                    <input
                                        id="business_name"
                                        type="text"
                                        value={data.business_name}
                                        onChange={(e) => setData('business_name', e.target.value)}
                                        className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg text-sm dark:text-white"
                                    />
                                    {errors.business_name && <p className="mt-1 text-sm text-red-600">{errors.business_name}</p>}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="business_registration_number" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                                    Business Registration Number
                                </label>
                                <input
                                    id="business_registration_number"
                                    type="text"
                                    value={data.business_registration_number}
                                    onChange={(e) => setData('business_registration_number', e.target.value)}
                                    className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg text-sm dark:text-white"
                                />
                                {errors.business_registration_number && <p className="mt-1 text-sm text-red-600">{errors.business_registration_number}</p>}
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="default_currency_id" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                                        Default Currency *
                                    </label>
                                    <select
                                        id="default_currency_id"
                                        value={data.default_currency_id}
                                        onChange={(e) => setData('default_currency_id', e.target.value)}
                                        className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg text-sm dark:text-white"
                                        required
                                    >
                                        <option value="">Select Currency</option>
                                        {currencies?.map((currency) => (
                                            <option key={currency.id} value={currency.id}>
                                                {currency.code} - {currency.name} ({currency.symbol})
                                            </option>
                                        ))}
                                    </select>
                                    {errors.default_currency_id && <p className="mt-1 text-sm text-red-600">{errors.default_currency_id}</p>}
                                </div>

                                <div>
                                    <label htmlFor="country_id" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                                        Country *
                                    </label>
                                    <select
                                        id="country_id"
                                        value={data.country_id}
                                        onChange={(e) => setData('country_id', e.target.value)}
                                        className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg text-sm dark:text-white"
                                        required
                                    >
                                        <option value="">Select Country</option>
                                        {countries?.map((country) => (
                                            <option key={country.id} value={country.id}>
                                                {country.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.country_id && <p className="mt-1 text-sm text-red-600">{errors.country_id}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Commission & Markup Section */}
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-6 space-y-4">
                            <h4 className="font-semibold text-gray-900 dark:text-white">Commission & Markup</h4>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="commission_rate" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                                        Commission Rate (%)
                                    </label>
                                    <input
                                        id="commission_rate"
                                        type="number"
                                        min="0"
                                        max="100"
                                        step="0.1"
                                        value={data.commission_rate}
                                        onChange={(e) => setData('commission_rate', e.target.value)}
                                        className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg text-sm dark:text-white"
                                    />
                                    {errors.commission_rate && <p className="mt-1 text-sm text-red-600">{errors.commission_rate}</p>}
                                </div>

                                <div>
                                    <label htmlFor="markup_template_id" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                                        Markup Template
                                    </label>
                                    <select
                                        id="markup_template_id"
                                        value={data.markup_template_id}
                                        onChange={(e) => setData('markup_template_id', e.target.value)}
                                        className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg text-sm dark:text-white"
                                    >
                                        <option value="">No template</option>
                                        {markupTemplates?.map((template) => (
                                            <option key={template.id} value={template.id}>
                                                {template.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.markup_template_id && <p className="mt-1 text-sm text-red-600">{errors.markup_template_id}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Status Section */}
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-6 space-y-4">
                            <h4 className="font-semibold text-gray-900 dark:text-white">Status</h4>

                            <div>
                                <label htmlFor="status" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                                    Account Status *
                                </label>
                                <select
                                    id="status"
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                    className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg text-sm dark:text-white max-w-xs"
                                    required
                                >
                                    <option value="pending">Pending</option>
                                    <option value="approved">Approved</option>
                                    <option value="suspended">Suspended</option>
                                </select>
                                {errors.status && <p className="mt-1 text-sm text-red-600">{errors.status}</p>}
                            </div>
                        </div>

                        {/* Visibility Options */}
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Visibility & Status Options</h4>

                            <div className="space-y-4">
                                <label className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer">
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">Show Seller Name</p>
                                        <p className="text-sm text-gray-500">
                                            When disabled, products will appear under "Avelabo" instead of the seller's shop name
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setData('show_seller_name', !data.show_seller_name)}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                            data.show_seller_name ? 'bg-brand' : 'bg-gray-300 dark:bg-gray-600'
                                        }`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                data.show_seller_name ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                        />
                                    </button>
                                </label>

                                <label className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer">
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">Has Storefront</p>
                                        <p className="text-sm text-gray-500">
                                            When disabled, seller won't have a public storefront page on the website
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setData('has_storefront', !data.has_storefront)}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                            data.has_storefront ? 'bg-brand' : 'bg-gray-300 dark:bg-gray-600'
                                        }`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                data.has_storefront ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                        />
                                    </button>
                                </label>

                                <label className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer">
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">Featured Seller</p>
                                        <p className="text-sm text-gray-500">
                                            Featured sellers are highlighted on the vendors page
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setData('is_featured', !data.is_featured)}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                            data.is_featured ? 'bg-brand' : 'bg-gray-300 dark:bg-gray-600'
                                        }`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                data.is_featured ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                        />
                                    </button>
                                </label>

                                <label className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer">
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">Verified Seller</p>
                                        <p className="text-sm text-gray-500">
                                            Verified sellers display a verification badge on their profile and products
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setData('is_verified', !data.is_verified)}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                            data.is_verified ? 'bg-brand' : 'bg-gray-300 dark:bg-gray-600'
                                        }`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                data.is_verified ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                        />
                                    </button>
                                </label>
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="pt-6 flex gap-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2.5 bg-brand hover:bg-brand-dark text-white rounded-lg font-medium text-sm disabled:opacity-50"
                            >
                                {processing ? 'Creating...' : 'Create Seller'}
                            </button>
                            <Link
                                href={route('admin.sellers.index')}
                                className="px-6 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium text-sm"
                            >
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
