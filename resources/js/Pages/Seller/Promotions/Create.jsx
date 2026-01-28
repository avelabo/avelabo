import { Head, Link, useForm } from '@inertiajs/react';
import SellerLayout from '@/Layouts/SellerLayout';

export default function PromotionsCreate({ categories, brands, tags }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        discount_type: 'percentage',
        discount_value: '',
        scope_type: 'all',
        scope_id: '',
        start_date: '',
        end_date: '',
        is_active: true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('seller.promotions.store'));
    };

    const scopeOptions = () => {
        switch (data.scope_type) {
            case 'category':
                return categories;
            case 'brand':
                return brands;
            case 'tag':
                return tags;
            default:
                return [];
        }
    };

    return (
        <SellerLayout title="Create Promotion">
            <Head title="Create Promotion" />

            <div className="mb-6">
                <Link
                    href={route('seller.promotions.index')}
                    className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-brand transition-colors"
                >
                    <span className="material-icons text-lg">arrow_back</span>
                    Back to Promotions
                </Link>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">Create Promotion</h2>
                <p className="text-gray-500 text-sm">Set up a discount for your products</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Name */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Promotion Name
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand dark:text-white"
                            placeholder="e.g. Summer Sale 20% Off"
                        />
                        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                    </div>

                    {/* Discount Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Discount Type
                        </label>
                        <select
                            value={data.discount_type}
                            onChange={(e) => setData('discount_type', e.target.value)}
                            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand dark:text-white"
                        >
                            <option value="percentage">Percentage (%)</option>
                            <option value="fixed">Fixed Amount (MWK)</option>
                        </select>
                        {errors.discount_type && <p className="mt-1 text-sm text-red-600">{errors.discount_type}</p>}
                    </div>

                    {/* Discount Value */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Discount Value
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            min="0.01"
                            value={data.discount_value}
                            onChange={(e) => setData('discount_value', e.target.value)}
                            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand dark:text-white"
                            placeholder={data.discount_type === 'percentage' ? 'e.g. 10' : 'e.g. 500'}
                        />
                        {errors.discount_value && <p className="mt-1 text-sm text-red-600">{errors.discount_value}</p>}
                    </div>

                    {/* Scope Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Applies To
                        </label>
                        <select
                            value={data.scope_type}
                            onChange={(e) => {
                                setData((prev) => ({ ...prev, scope_type: e.target.value, scope_id: '' }));
                            }}
                            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand dark:text-white"
                        >
                            <option value="all">All Products</option>
                            <option value="category">Specific Category</option>
                            <option value="brand">Specific Brand</option>
                            <option value="tag">Specific Tag</option>
                        </select>
                        {errors.scope_type && <p className="mt-1 text-sm text-red-600">{errors.scope_type}</p>}
                    </div>

                    {/* Scope ID */}
                    {data.scope_type !== 'all' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Select {data.scope_type.charAt(0).toUpperCase() + data.scope_type.slice(1)}
                            </label>
                            <select
                                value={data.scope_id}
                                onChange={(e) => setData('scope_id', e.target.value)}
                                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand dark:text-white"
                            >
                                <option value="">Choose...</option>
                                {scopeOptions().map((item) => (
                                    <option key={item.id} value={item.id}>{item.name}</option>
                                ))}
                            </select>
                            {errors.scope_id && <p className="mt-1 text-sm text-red-600">{errors.scope_id}</p>}
                        </div>
                    )}

                    {/* Start Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Start Date
                        </label>
                        <input
                            type="datetime-local"
                            value={data.start_date}
                            onChange={(e) => setData('start_date', e.target.value)}
                            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand dark:text-white"
                        />
                        {errors.start_date && <p className="mt-1 text-sm text-red-600">{errors.start_date}</p>}
                    </div>

                    {/* End Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            End Date
                        </label>
                        <input
                            type="datetime-local"
                            value={data.end_date}
                            onChange={(e) => setData('end_date', e.target.value)}
                            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand dark:text-white"
                        />
                        {errors.end_date && <p className="mt-1 text-sm text-red-600">{errors.end_date}</p>}
                    </div>

                    {/* Active Toggle */}
                    <div className="md:col-span-2">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={data.is_active}
                                onChange={(e) => setData('is_active', e.target.checked)}
                                className="w-4 h-4 text-brand border-gray-300 rounded focus:ring-brand"
                            />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Activate promotion immediately
                            </span>
                        </label>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
                    <Link
                        href={route('seller.promotions.index')}
                        className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-6 py-2 bg-brand hover:bg-brand-dark text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                    >
                        {processing ? 'Creating...' : 'Create Promotion'}
                    </button>
                </div>
            </form>
        </SellerLayout>
    );
}
