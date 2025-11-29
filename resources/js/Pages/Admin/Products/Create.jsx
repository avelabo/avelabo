import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        regular_price: '',
        promotional_price: '',
        currency: 'USD',
        tax_rate: '',
        is_template: false,
        width: '',
        height: '',
        weight: '',
        shipping_fees: '',
        category: '',
        sub_category: '',
        tags: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/products');
    };

    return (
        <AdminLayout>
            <Head title="Add New Product" />

            <div className="space-y-6">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <h2 className="text-2xl font-bold text-heading dark:text-white">Add New Product</h2>
                    <div className="flex gap-3 mt-4 md:mt-0">
                        <button
                            type="button"
                            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-heading rounded-lg font-medium text-sm transition-colors"
                        >
                            Save to draft
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={processing}
                            className="px-4 py-2 bg-brand hover:bg-brand-dark text-white rounded-lg font-medium text-sm transition-colors disabled:opacity-50"
                        >
                            Publish
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Basic & Shipping */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Info Card */}
                        <div className="bg-white dark:bg-dark-card rounded-xl shadow-card">
                            <div className="p-5 border-b dark:border-white/10">
                                <h4 className="font-semibold text-heading dark:text-white">Basic</h4>
                            </div>
                            <div className="p-5">
                                <form>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-heading dark:text-white mb-2">
                                            Product title
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Type here"
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-heading dark:text-white mb-2">
                                            Full description
                                        </label>
                                        <textarea
                                            placeholder="Type here"
                                            rows={4}
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand resize-none"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                        <div>
                                            <label className="block text-sm font-medium text-heading dark:text-white mb-2">
                                                Regular price
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="$"
                                                value={data.regular_price}
                                                onChange={(e) => setData('regular_price', e.target.value)}
                                                className="w-full px-4 py-3 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-heading dark:text-white mb-2">
                                                Promotional price
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="$"
                                                value={data.promotional_price}
                                                onChange={(e) => setData('promotional_price', e.target.value)}
                                                className="w-full px-4 py-3 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-heading dark:text-white mb-2">
                                                Currency
                                            </label>
                                            <select
                                                value={data.currency}
                                                onChange={(e) => setData('currency', e.target.value)}
                                                className="w-full px-4 py-3 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand"
                                            >
                                                <option value="USD">USD</option>
                                                <option value="EUR">EUR</option>
                                                <option value="RUBL">RUBL</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-heading dark:text-white mb-2">
                                            Tax rate
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="%"
                                            value={data.tax_rate}
                                            onChange={(e) => setData('tax_rate', e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand"
                                        />
                                    </div>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={data.is_template}
                                            onChange={(e) => setData('is_template', e.target.checked)}
                                            className="w-4 h-4 rounded border-gray-300 text-brand focus:ring-brand"
                                        />
                                        <span className="text-sm text-body">Make a template</span>
                                    </label>
                                </form>
                            </div>
                        </div>

                        {/* Shipping Card */}
                        <div className="bg-white dark:bg-dark-card rounded-xl shadow-card">
                            <div className="p-5 border-b dark:border-white/10">
                                <h4 className="font-semibold text-heading dark:text-white">Shipping</h4>
                            </div>
                            <div className="p-5">
                                <form>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="block text-sm font-medium text-heading dark:text-white mb-2">
                                                Width
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="inch"
                                                value={data.width}
                                                onChange={(e) => setData('width', e.target.value)}
                                                className="w-full px-4 py-3 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-heading dark:text-white mb-2">
                                                Height
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="inch"
                                                value={data.height}
                                                onChange={(e) => setData('height', e.target.value)}
                                                className="w-full px-4 py-3 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand"
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-heading dark:text-white mb-2">
                                            Weight
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="gam"
                                            value={data.weight}
                                            onChange={(e) => setData('weight', e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-heading dark:text-white mb-2">
                                            Shipping fees
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="$"
                                            value={data.shipping_fees}
                                            onChange={(e) => setData('shipping_fees', e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand"
                                        />
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Media & Organization */}
                    <div className="space-y-6">
                        {/* Media Card */}
                        <div className="bg-white dark:bg-dark-card rounded-xl shadow-card">
                            <div className="p-5 border-b dark:border-white/10">
                                <h4 className="font-semibold text-heading dark:text-white">Media</h4>
                            </div>
                            <div className="p-5">
                                <div className="border-2 border-dashed border-gray-200 dark:border-white/20 rounded-lg p-8 text-center hover:border-brand transition-colors cursor-pointer">
                                    <span className="material-icons text-5xl text-gray-300 mb-4">cloud_upload</span>
                                    <p className="text-sm text-body mb-4">Drop files here or click to upload</p>
                                    <input type="file" className="hidden" id="fileUpload" multiple />
                                    <label
                                        htmlFor="fileUpload"
                                        className="inline-block px-4 py-2 bg-brand hover:bg-brand-dark text-white rounded-lg font-medium text-sm transition-colors cursor-pointer"
                                    >
                                        Browse Files
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Organization Card */}
                        <div className="bg-white dark:bg-dark-card rounded-xl shadow-card">
                            <div className="p-5 border-b dark:border-white/10">
                                <h4 className="font-semibold text-heading dark:text-white">Organization</h4>
                            </div>
                            <div className="p-5">
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-medium text-heading dark:text-white mb-2">
                                            Category
                                        </label>
                                        <select
                                            value={data.category}
                                            onChange={(e) => setData('category', e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand"
                                        >
                                            <option value="">Select</option>
                                            <option value="automobiles">Automobiles</option>
                                            <option value="home">Home items</option>
                                            <option value="electronics">Electronics</option>
                                            <option value="smartphones">Smartphones</option>
                                            <option value="sports">Sport items</option>
                                            <option value="baby">Baby and Toys</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-heading dark:text-white mb-2">
                                            Sub-category
                                        </label>
                                        <select
                                            value={data.sub_category}
                                            onChange={(e) => setData('sub_category', e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand"
                                        >
                                            <option value="">Select</option>
                                            <option value="nissan">Nissan</option>
                                            <option value="honda">Honda</option>
                                            <option value="mercedes">Mercedes</option>
                                            <option value="chevrolet">Chevrolet</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-heading dark:text-white mb-2">
                                        Tags
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter tags"
                                        value={data.tags}
                                        onChange={(e) => setData('tags', e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
