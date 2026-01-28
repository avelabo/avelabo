import { Head, Link, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';

export default function Show({ seller, stats, markupTemplates, currencies, countries }) {
    const [activeTab, setActiveTab] = useState('overview');
    const [applyingTemplate, setApplyingTemplate] = useState(null);

    const { data, setData, put, processing, errors } = useForm({
        shop_name: seller?.shop_name || '',
        display_name: seller?.display_name || '',
        description: seller?.description || '',
        business_type: seller?.business_type || 'individual',
        business_name: seller?.business_name || '',
        business_registration_number: seller?.business_registration_number || '',
        default_currency_id: seller?.default_currency_id || '',
        country_id: seller?.country_id || '',
        commission_rate: seller?.commission_rate || 0,
        is_featured: seller?.is_featured || false,
        is_verified: seller?.is_verified || false,
        show_seller_name: seller?.show_seller_name ?? true,
        has_storefront: seller?.has_storefront ?? true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.sellers.update', seller.id));
    };

    const handleStatusChange = (status) => {
        if (confirm(`Are you sure you want to change the seller status to ${status}?`)) {
            router.patch(route('admin.sellers.update-status', seller.id), { status });
        }
    };

    const handleApplyTemplate = (templateId) => {
        setApplyingTemplate(templateId);
        router.post(route('admin.sellers.apply-markup-template', seller.id), { template_id: templateId }, {
            preserveScroll: true,
            onFinish: () => setApplyingTemplate(null),
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-MW', {
            style: 'currency',
            currency: 'MWK',
            minimumFractionDigits: 0,
        }).format(amount || 0);
    };

    const getStatusBadge = (status) => {
        const badges = {
            active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
            approved: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
            pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
            pending_kyc: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
            suspended: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
            rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
        };
        return badges[status] || 'bg-gray-100 text-gray-700';
    };

    return (
        <AdminLayout>
            <Head title={`Seller: ${seller?.shop_name}`} />

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

                {/* Seller Header Card */}
                <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-white/10 overflow-hidden">
                    <div className="h-32 bg-gradient-to-r from-brand to-brand-dark"></div>

                    <div className="p-6">
                        <div className="flex flex-col lg:flex-row gap-6">
                            {/* Logo */}
                            <div className="flex-shrink-0">
                                <div className="w-32 h-32 -mt-20 bg-white dark:bg-dark-card border-4 border-white dark:border-dark-card rounded-xl shadow-lg flex items-center justify-center overflow-hidden">
                                    {seller?.logo ? (
                                        <img
                                            src={`/storage/${seller.logo}`}
                                            className="w-full h-full object-cover"
                                            alt={seller.shop_name}
                                        />
                                    ) : (
                                        <span className="material-icons text-5xl text-gray-300">store</span>
                                    )}
                                </div>
                            </div>

                            {/* Info */}
                            <div className="flex-1">
                                <div className="flex flex-wrap items-start justify-between gap-4">
                                    <div>
                                        <h2 className="text-2xl font-bold text-heading dark:text-white flex items-center gap-3">
                                            {seller?.shop_name}
                                            {seller?.is_verified && (
                                                <span className="material-icons text-blue-500" title="Verified">verified</span>
                                            )}
                                            {seller?.is_featured && (
                                                <span className="px-2 py-0.5 bg-brand/10 text-brand text-xs rounded-full">Featured</span>
                                            )}
                                        </h2>
                                        <p className="text-body mt-1">{seller?.user?.email}</p>
                                        <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(seller?.status)}`}>
                                            {seller?.status?.replace('_', ' ').toUpperCase()}
                                        </span>
                                    </div>

                                    <div className="flex gap-2">
                                        {seller?.status !== 'approved' && seller?.status !== 'active' && (
                                            <button
                                                onClick={() => handleStatusChange('approved')}
                                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium"
                                            >
                                                Approve
                                            </button>
                                        )}
                                        {seller?.status !== 'suspended' && (
                                            <button
                                                onClick={() => handleStatusChange('suspended')}
                                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium"
                                            >
                                                Suspend
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                            <div className="bg-gray-50 dark:bg-dark-body rounded-lg p-4">
                                <p className="text-xs text-body mb-1">Total Products</p>
                                <p className="text-2xl font-bold text-heading dark:text-white">{stats?.total_products || 0}</p>
                            </div>
                            <div className="bg-gray-50 dark:bg-dark-body rounded-lg p-4">
                                <p className="text-xs text-body mb-1">Active Products</p>
                                <p className="text-2xl font-bold text-green-600">{stats?.active_products || 0}</p>
                            </div>
                            <div className="bg-gray-50 dark:bg-dark-body rounded-lg p-4">
                                <p className="text-xs text-body mb-1">Total Orders</p>
                                <p className="text-2xl font-bold text-heading dark:text-white">{stats?.total_orders || 0}</p>
                            </div>
                            <div className="bg-gray-50 dark:bg-dark-body rounded-lg p-4">
                                <p className="text-xs text-body mb-1">Total Revenue</p>
                                <p className="text-2xl font-bold text-brand">{formatCurrency(stats?.total_revenue)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-white/10">
                    <div className="border-b border-gray-100 dark:border-white/10">
                        <nav className="flex gap-4 px-6">
                            {['overview', 'settings', 'markup'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`py-4 px-2 text-sm font-medium border-b-2 transition-colors ${
                                        activeTab === tab
                                            ? 'border-brand text-brand'
                                            : 'border-transparent text-body hover:text-heading'
                                    }`}
                                >
                                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="p-6">
                        {/* Overview Tab */}
                        {activeTab === 'overview' && (
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-semibold text-heading dark:text-white mb-4">Seller Information</h4>
                                    <dl className="space-y-3">
                                        <div className="flex justify-between">
                                            <dt className="text-body">Owner</dt>
                                            <dd className="text-heading dark:text-white">{seller?.user?.name}</dd>
                                        </div>
                                        <div className="flex justify-between">
                                            <dt className="text-body">Email</dt>
                                            <dd className="text-heading dark:text-white">{seller?.user?.email}</dd>
                                        </div>
                                        <div className="flex justify-between">
                                            <dt className="text-body">Phone</dt>
                                            <dd className="text-heading dark:text-white">{seller?.user?.phone || '-'}</dd>
                                        </div>
                                        <div className="flex justify-between">
                                            <dt className="text-body">Business Name</dt>
                                            <dd className="text-heading dark:text-white">{seller?.business_name || '-'}</dd>
                                        </div>
                                        <div className="flex justify-between">
                                            <dt className="text-body">Business Type</dt>
                                            <dd className="text-heading dark:text-white capitalize">{seller?.business_type || '-'}</dd>
                                        </div>
                                        <div className="flex justify-between">
                                            <dt className="text-body">Country</dt>
                                            <dd className="text-heading dark:text-white">{seller?.country?.name || '-'}</dd>
                                        </div>
                                        <div className="flex justify-between">
                                            <dt className="text-body">Default Currency</dt>
                                            <dd className="text-heading dark:text-white">
                                                {seller?.default_currency ? `${seller.default_currency.code} (${seller.default_currency.symbol})` : '-'}
                                            </dd>
                                        </div>
                                        <div className="flex justify-between">
                                            <dt className="text-body">Joined</dt>
                                            <dd className="text-heading dark:text-white">
                                                {new Date(seller?.created_at).toLocaleDateString()}
                                            </dd>
                                        </div>
                                    </dl>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-heading dark:text-white mb-4">Visibility Settings</h4>
                                    <dl className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <dt className="text-body">Show Seller Name</dt>
                                            <dd>
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                    seller?.show_seller_name
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                    {seller?.show_seller_name ? 'Yes' : 'No (Shows as Avelabo)'}
                                                </span>
                                            </dd>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <dt className="text-body">Has Storefront</dt>
                                            <dd>
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                    seller?.has_storefront
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                    {seller?.has_storefront ? 'Yes' : 'No'}
                                                </span>
                                            </dd>
                                        </div>
                                        <div className="flex justify-between">
                                            <dt className="text-body">Commission Rate</dt>
                                            <dd className="text-heading dark:text-white">{seller?.commission_rate || 0}%</dd>
                                        </div>
                                        <div className="flex justify-between">
                                            <dt className="text-body">Markup Template</dt>
                                            <dd className="text-heading dark:text-white">
                                                {seller?.markup_template?.name || 'None'}
                                            </dd>
                                        </div>
                                    </dl>
                                </div>

                                {seller?.description && (
                                    <div className="md:col-span-2">
                                        <h4 className="font-semibold text-heading dark:text-white mb-2">Description</h4>
                                        <p className="text-body">{seller.description}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Settings Tab */}
                        {activeTab === 'settings' && (
                            <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
                                {/* Basic Info Section */}
                                <div className="space-y-4">
                                    <h4 className="font-semibold text-heading dark:text-white">Basic Information</h4>

                                    <div>
                                        <label htmlFor="shop_name" className="block text-sm font-medium text-heading dark:text-white mb-2">
                                            Shop Name *
                                        </label>
                                        <input
                                            id="shop_name"
                                            type="text"
                                            value={data.shop_name}
                                            onChange={(e) => setData('shop_name', e.target.value)}
                                            className="w-full px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm dark:text-white"
                                        />
                                        {errors.shop_name && <p className="mt-1 text-sm text-red-600">{errors.shop_name}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="display_name" className="block text-sm font-medium text-heading dark:text-white mb-2">
                                            Display Name
                                        </label>
                                        <input
                                            id="display_name"
                                            type="text"
                                            value={data.display_name}
                                            onChange={(e) => setData('display_name', e.target.value)}
                                            className="w-full px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm dark:text-white"
                                            placeholder="Public-facing name (leave empty to use shop name)"
                                        />
                                        {errors.display_name && <p className="mt-1 text-sm text-red-600">{errors.display_name}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="description" className="block text-sm font-medium text-heading dark:text-white mb-2">
                                            Description
                                        </label>
                                        <textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            rows={4}
                                            className="w-full px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm dark:text-white"
                                        />
                                        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                                    </div>
                                </div>

                                {/* Business Info Section */}
                                <div className="border-t border-gray-200 dark:border-white/10 pt-6 space-y-4">
                                    <h4 className="font-semibold text-heading dark:text-white">Business Information</h4>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="business_type" className="block text-sm font-medium text-heading dark:text-white mb-2">
                                                Business Type
                                            </label>
                                            <select
                                                id="business_type"
                                                value={data.business_type}
                                                onChange={(e) => setData('business_type', e.target.value)}
                                                className="w-full px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm dark:text-white"
                                            >
                                                <option value="individual">Individual</option>
                                                <option value="company">Company</option>
                                            </select>
                                            {errors.business_type && <p className="mt-1 text-sm text-red-600">{errors.business_type}</p>}
                                        </div>

                                        <div>
                                            <label htmlFor="business_name" className="block text-sm font-medium text-heading dark:text-white mb-2">
                                                Business Name
                                            </label>
                                            <input
                                                id="business_name"
                                                type="text"
                                                value={data.business_name}
                                                onChange={(e) => setData('business_name', e.target.value)}
                                                className="w-full px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm dark:text-white"
                                            />
                                            {errors.business_name && <p className="mt-1 text-sm text-red-600">{errors.business_name}</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="business_registration_number" className="block text-sm font-medium text-heading dark:text-white mb-2">
                                            Business Registration Number
                                        </label>
                                        <input
                                            id="business_registration_number"
                                            type="text"
                                            value={data.business_registration_number}
                                            onChange={(e) => setData('business_registration_number', e.target.value)}
                                            className="w-full px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm dark:text-white"
                                        />
                                        {errors.business_registration_number && <p className="mt-1 text-sm text-red-600">{errors.business_registration_number}</p>}
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="default_currency_id" className="block text-sm font-medium text-heading dark:text-white mb-2">
                                                Default Currency
                                            </label>
                                            <select
                                                id="default_currency_id"
                                                value={data.default_currency_id}
                                                onChange={(e) => setData('default_currency_id', e.target.value)}
                                                className="w-full px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm dark:text-white"
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
                                            <label htmlFor="country_id" className="block text-sm font-medium text-heading dark:text-white mb-2">
                                                Country
                                            </label>
                                            <select
                                                id="country_id"
                                                value={data.country_id}
                                                onChange={(e) => setData('country_id', e.target.value)}
                                                className="w-full px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm dark:text-white"
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

                                {/* Commission Section */}
                                <div className="border-t border-gray-200 dark:border-white/10 pt-6">
                                    <div>
                                        <label htmlFor="commission_rate" className="block text-sm font-medium text-heading dark:text-white mb-2">
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
                                            className="w-full px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm dark:text-white max-w-xs"
                                        />
                                        {errors.commission_rate && <p className="mt-1 text-sm text-red-600">{errors.commission_rate}</p>}
                                    </div>
                                </div>

                                {/* Visibility Options */}
                                <div className="border-t border-gray-200 dark:border-white/10 pt-6">
                                    <h4 className="font-semibold text-heading dark:text-white mb-4">Visibility & Status Options</h4>

                                    <div className="space-y-4">
                                        <label className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-body rounded-lg cursor-pointer">
                                            <div>
                                                <p className="font-medium text-heading dark:text-white">Show Seller Name</p>
                                                <p className="text-sm text-body">
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

                                        <label className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-body rounded-lg cursor-pointer">
                                            <div>
                                                <p className="font-medium text-heading dark:text-white">Has Storefront</p>
                                                <p className="text-sm text-body">
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

                                        <label className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-body rounded-lg cursor-pointer">
                                            <div>
                                                <p className="font-medium text-heading dark:text-white">Featured Seller</p>
                                                <p className="text-sm text-body">
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

                                        <label className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-body rounded-lg cursor-pointer">
                                            <div>
                                                <p className="font-medium text-heading dark:text-white">Verified Seller</p>
                                                <p className="text-sm text-body">
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

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-6 py-2.5 bg-brand hover:bg-brand-dark text-white rounded-lg font-medium text-sm disabled:opacity-50"
                                    >
                                        {processing ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* Markup Tab */}
                        {activeTab === 'markup' && (
                            <div className="space-y-6">
                                <div>
                                    <h4 className="font-semibold text-heading dark:text-white mb-4">Apply Markup Template</h4>
                                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {markupTemplates?.map((template) => (
                                            <div
                                                key={template.id}
                                                className={`p-4 rounded-lg border-2 transition-colors ${
                                                    seller?.markup_template_id === template.id
                                                        ? 'border-brand bg-brand/5'
                                                        : 'border-gray-200 dark:border-white/10 hover:border-brand/50'
                                                }`}
                                            >
                                                <h5 className="font-medium text-heading dark:text-white">{template.name}</h5>
                                                {template.description && (
                                                    <p className="text-sm text-body mt-1">{template.description}</p>
                                                )}
                                                <p className="text-xs text-body mt-2">
                                                    {template.ranges?.length || 0} price ranges
                                                </p>
                                                {seller?.markup_template_id !== template.id && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleApplyTemplate(template.id)}
                                                        disabled={applyingTemplate !== null}
                                                        className="mt-3 px-3 py-1.5 bg-brand hover:bg-brand-dark text-white text-xs rounded-lg disabled:opacity-50"
                                                    >
                                                        {applyingTemplate === template.id ? 'Applying...' : 'Apply Template'}
                                                    </button>
                                                )}
                                                {seller?.markup_template_id === template.id && (
                                                    <span className="inline-block mt-3 px-3 py-1.5 bg-green-100 text-green-700 text-xs rounded-lg">
                                                        Currently Applied
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {seller?.markup_template?.ranges?.length > 0 && (
                                    <div>
                                        <h4 className="font-semibold text-heading dark:text-white mb-4">Current Markup Ranges</h4>
                                        <div className="overflow-x-auto">
                                            <table className="w-full">
                                                <thead className="bg-gray-50 dark:bg-dark-body">
                                                    <tr>
                                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Min Price</th>
                                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Max Price</th>
                                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Markup Amount</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y dark:divide-white/10">
                                                    {seller.markup_template.ranges.map((range) => (
                                                        <tr key={range.id}>
                                                            <td className="px-4 py-3 text-sm text-heading dark:text-white">
                                                                {formatCurrency(range.min_price)}
                                                            </td>
                                                            <td className="px-4 py-3 text-sm text-heading dark:text-white">
                                                                {formatCurrency(range.max_price)}
                                                            </td>
                                                            <td className="px-4 py-3 text-sm text-brand font-medium">
                                                                +{formatCurrency(range.markup_amount)}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
