import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Edit({ dataSource, currencies, authTypes }) {
    const { data, setData, put, processing, errors } = useForm({
        name: dataSource.name || '',
        base_url: dataSource.base_url || '',
        category_listing_url: dataSource.category_listing_url || '',
        category_search_url: dataSource.category_search_url || '',
        product_listing_url: dataSource.product_listing_url || '',
        product_by_category_url: dataSource.product_by_category_url || '',
        auth_type: dataSource.auth_type || 'none',
        auth_credentials: dataSource.auth_credentials || {
            api_key: '',
            bearer_token: '',
        },
        default_currency_id: dataSource.default_currency_id || '',
        is_active: dataSource.is_active ?? true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.import.data-sources.update', dataSource.id));
    };

    return (
        <AdminLayout>
            <Head title={`Edit ${dataSource.name}`} />

            <div className="max-w-3xl mx-auto space-y-6">
                {/* Page Header */}
                <div className="flex items-center gap-4">
                    <Link
                        href={route('admin.import.data-sources.index')}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-dark-body rounded-lg transition-colors"
                    >
                        <span className="material-icons">arrow_back</span>
                    </Link>
                    <div>
                        <h2 className="text-2xl font-bold text-heading dark:text-white">Edit Data Source</h2>
                        <p className="text-body">Update {dataSource.name} configuration</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info */}
                    <div className="bg-white dark:bg-dark-card rounded-xl shadow-card p-6 space-y-6">
                        <h3 className="text-lg font-semibold text-heading dark:text-white">Basic Information</h3>

                        <div>
                            <label className="block text-sm font-medium text-heading dark:text-white mb-2">
                                Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className={`w-full px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand ${
                                    errors.name ? 'ring-2 ring-red-500' : ''
                                }`}
                                placeholder="e.g., Takealot"
                            />
                            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-heading dark:text-white mb-2">
                                Base URL <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="url"
                                value={data.base_url}
                                onChange={(e) => setData('base_url', e.target.value)}
                                className={`w-full px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand ${
                                    errors.base_url ? 'ring-2 ring-red-500' : ''
                                }`}
                                placeholder="https://api.example.com"
                            />
                            {errors.base_url && <p className="mt-1 text-sm text-red-500">{errors.base_url}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-heading dark:text-white mb-2">
                                Default Currency
                            </label>
                            <select
                                value={data.default_currency_id}
                                onChange={(e) => setData('default_currency_id', e.target.value)}
                                className="w-full px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand"
                            >
                                <option value="">Select currency...</option>
                                {currencies?.map((currency) => (
                                    <option key={currency.id} value={currency.id}>
                                        {currency.code} - {currency.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* API Endpoints */}
                    <div className="bg-white dark:bg-dark-card rounded-xl shadow-card p-6 space-y-6">
                        <h3 className="text-lg font-semibold text-heading dark:text-white">API Endpoints</h3>

                        <div>
                            <label className="block text-sm font-medium text-heading dark:text-white mb-2">
                                Category Listing URL <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.category_listing_url}
                                onChange={(e) => setData('category_listing_url', e.target.value)}
                                className={`w-full px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand ${
                                    errors.category_listing_url ? 'ring-2 ring-red-500' : ''
                                }`}
                                placeholder="/api/categories"
                            />
                            {errors.category_listing_url && <p className="mt-1 text-sm text-red-500">{errors.category_listing_url}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-heading dark:text-white mb-2">
                                Category Search URL
                            </label>
                            <input
                                type="text"
                                value={data.category_search_url}
                                onChange={(e) => setData('category_search_url', e.target.value)}
                                className="w-full px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand"
                                placeholder="/api/categories/search"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-heading dark:text-white mb-2">
                                Product Listing URL
                            </label>
                            <input
                                type="text"
                                value={data.product_listing_url}
                                onChange={(e) => setData('product_listing_url', e.target.value)}
                                className="w-full px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand"
                                placeholder="/api/products"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-heading dark:text-white mb-2">
                                Products by Category URL <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.product_by_category_url}
                                onChange={(e) => setData('product_by_category_url', e.target.value)}
                                className={`w-full px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand ${
                                    errors.product_by_category_url ? 'ring-2 ring-red-500' : ''
                                }`}
                                placeholder="/api/categories/{category_id}/products"
                            />
                            {errors.product_by_category_url && <p className="mt-1 text-sm text-red-500">{errors.product_by_category_url}</p>}
                            <p className="mt-1 text-xs text-body">Use {'{category_id}'} as placeholder</p>
                        </div>
                    </div>

                    {/* Authentication */}
                    <div className="bg-white dark:bg-dark-card rounded-xl shadow-card p-6 space-y-6">
                        <h3 className="text-lg font-semibold text-heading dark:text-white">Authentication</h3>

                        <div>
                            <label className="block text-sm font-medium text-heading dark:text-white mb-2">
                                Authentication Type
                            </label>
                            <select
                                value={data.auth_type}
                                onChange={(e) => setData('auth_type', e.target.value)}
                                className="w-full px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand"
                            >
                                {authTypes?.map((type) => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {data.auth_type === 'api_key' && (
                            <div>
                                <label className="block text-sm font-medium text-heading dark:text-white mb-2">
                                    API Key
                                </label>
                                <input
                                    type="password"
                                    value={data.auth_credentials?.api_key || ''}
                                    onChange={(e) => setData('auth_credentials', { ...data.auth_credentials, api_key: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand"
                                    placeholder="Enter new API key or leave empty to keep current"
                                />
                            </div>
                        )}

                        {data.auth_type === 'bearer_token' && (
                            <div>
                                <label className="block text-sm font-medium text-heading dark:text-white mb-2">
                                    Bearer Token
                                </label>
                                <input
                                    type="password"
                                    value={data.auth_credentials?.bearer_token || ''}
                                    onChange={(e) => setData('auth_credentials', { ...data.auth_credentials, bearer_token: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand"
                                    placeholder="Enter new bearer token or leave empty to keep current"
                                />
                            </div>
                        )}
                    </div>

                    {/* Status */}
                    <div className="bg-white dark:bg-dark-card rounded-xl shadow-card p-6">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={data.is_active}
                                onChange={(e) => setData('is_active', e.target.checked)}
                                className="w-5 h-5 rounded border-gray-300 text-brand focus:ring-brand"
                            />
                            <div>
                                <span className="font-medium text-heading dark:text-white">Active</span>
                                <p className="text-sm text-body">Enable this data source for imports</p>
                            </div>
                        </label>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex items-center gap-4">
                        <Link
                            href={route('admin.import.data-sources.index')}
                            className="px-6 py-2.5 bg-gray-100 dark:bg-dark-body text-heading dark:text-white rounded-lg font-medium text-sm hover:bg-gray-200 dark:hover:bg-dark-card transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2.5 bg-brand hover:bg-brand-dark text-white rounded-lg font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {processing ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
