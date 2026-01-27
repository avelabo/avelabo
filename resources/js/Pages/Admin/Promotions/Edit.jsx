import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Edit({ promotion, categories, brands, tags, sellers }) {
    const { data, setData, put, processing, errors } = useForm({
        name: promotion.name || '',
        type: promotion.type || 'system',
        seller_id: promotion.seller_id || '',
        discount_type: promotion.discount_type || 'percentage',
        discount_value: promotion.discount_value || '',
        scope_type: promotion.scope_type || 'all',
        scope_id: promotion.scope_id || '',
        start_date: promotion.start_date ? promotion.start_date.slice(0, 16) : '',
        end_date: promotion.end_date ? promotion.end_date.slice(0, 16) : '',
        priority: promotion.priority || 0,
        is_active: promotion.is_active ?? true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.promotions.update', promotion.id));
    };

    const scopeOptions = () => {
        switch (data.scope_type) {
            case 'category': return categories;
            case 'brand': return brands;
            case 'tag': return tags;
            default: return [];
        }
    };

    return (
        <AdminLayout>
            <Head title="Edit Promotion" />

            <div className="max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-heading dark:text-white">Edit Promotion</h2>
                        <p className="text-body">Update promotion details</p>
                    </div>
                    <Link
                        href={route('admin.promotions.index')}
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-heading rounded-lg font-medium text-sm transition-colors inline-flex items-center gap-2"
                    >
                        <span className="material-icons text-lg">arrow_back</span>
                        Back
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-white dark:bg-dark-card rounded-xl shadow-card p-6">
                        <h3 className="text-lg font-semibold text-heading dark:text-white mb-4">Promotion Details</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-heading dark:text-white mb-2">
                                    Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className={`w-full px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand ${errors.name ? 'ring-2 ring-red-500' : ''}`}
                                />
                                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-heading dark:text-white mb-2">Type</label>
                                <select
                                    value={data.type}
                                    onChange={(e) => setData('type', e.target.value)}
                                    className="w-full px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand"
                                >
                                    <option value="system">System-wide</option>
                                    <option value="seller">Seller</option>
                                </select>
                            </div>

                            {data.type === 'seller' && (
                                <div>
                                    <label className="block text-sm font-medium text-heading dark:text-white mb-2">Seller</label>
                                    <select
                                        value={data.seller_id}
                                        onChange={(e) => setData('seller_id', e.target.value)}
                                        className={`w-full px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand ${errors.seller_id ? 'ring-2 ring-red-500' : ''}`}
                                    >
                                        <option value="">Select seller...</option>
                                        {sellers.map((s) => (
                                            <option key={s.id} value={s.id}>{s.shop_name}</option>
                                        ))}
                                    </select>
                                    {errors.seller_id && <p className="mt-1 text-sm text-red-500">{errors.seller_id}</p>}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-dark-card rounded-xl shadow-card p-6">
                        <h3 className="text-lg font-semibold text-heading dark:text-white mb-4">Discount</h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-heading dark:text-white mb-2">Discount Type</label>
                                    <select
                                        value={data.discount_type}
                                        onChange={(e) => setData('discount_type', e.target.value)}
                                        className="w-full px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand"
                                    >
                                        <option value="percentage">Percentage (%)</option>
                                        <option value="fixed">Fixed Amount (MK)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-heading dark:text-white mb-2">Value</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        value={data.discount_value}
                                        onChange={(e) => setData('discount_value', e.target.value)}
                                        className={`w-full px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand ${errors.discount_value ? 'ring-2 ring-red-500' : ''}`}
                                    />
                                    {errors.discount_value && <p className="mt-1 text-sm text-red-500">{errors.discount_value}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-heading dark:text-white mb-2">Applies To</label>
                                <select
                                    value={data.scope_type}
                                    onChange={(e) => { setData('scope_type', e.target.value); setData('scope_id', ''); }}
                                    className="w-full px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand"
                                >
                                    <option value="all">All Products</option>
                                    <option value="category">Specific Category</option>
                                    <option value="brand">Specific Brand</option>
                                    <option value="tag">Specific Tag</option>
                                </select>
                            </div>

                            {data.scope_type !== 'all' && (
                                <div>
                                    <label className="block text-sm font-medium text-heading dark:text-white mb-2">
                                        Select {data.scope_type.charAt(0).toUpperCase() + data.scope_type.slice(1)}
                                    </label>
                                    <select
                                        value={data.scope_id}
                                        onChange={(e) => setData('scope_id', e.target.value)}
                                        className={`w-full px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand ${errors.scope_id ? 'ring-2 ring-red-500' : ''}`}
                                    >
                                        <option value="">Select...</option>
                                        {scopeOptions().map((item) => (
                                            <option key={item.id} value={item.id}>{item.name || item.shop_name}</option>
                                        ))}
                                    </select>
                                    {errors.scope_id && <p className="mt-1 text-sm text-red-500">{errors.scope_id}</p>}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-dark-card rounded-xl shadow-card p-6">
                        <h3 className="text-lg font-semibold text-heading dark:text-white mb-4">Schedule</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-heading dark:text-white mb-2">Start Date</label>
                                <input
                                    type="datetime-local"
                                    value={data.start_date}
                                    onChange={(e) => setData('start_date', e.target.value)}
                                    className={`w-full px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand ${errors.start_date ? 'ring-2 ring-red-500' : ''}`}
                                />
                                {errors.start_date && <p className="mt-1 text-sm text-red-500">{errors.start_date}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-heading dark:text-white mb-2">End Date</label>
                                <input
                                    type="datetime-local"
                                    value={data.end_date}
                                    onChange={(e) => setData('end_date', e.target.value)}
                                    className={`w-full px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand ${errors.end_date ? 'ring-2 ring-red-500' : ''}`}
                                />
                                {errors.end_date && <p className="mt-1 text-sm text-red-500">{errors.end_date}</p>}
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-heading dark:text-white mb-2">Priority</label>
                            <input
                                type="number"
                                min="0"
                                value={data.priority}
                                onChange={(e) => setData('priority', parseInt(e.target.value) || 0)}
                                className="w-32 px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand"
                            />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-dark-card rounded-xl shadow-card p-6">
                        <h3 className="text-lg font-semibold text-heading dark:text-white mb-4">Status</h3>
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="is_active"
                                checked={data.is_active}
                                onChange={(e) => setData('is_active', e.target.checked)}
                                className="w-4 h-4 text-brand bg-gray-100 border-gray-300 rounded focus:ring-brand"
                            />
                            <label htmlFor="is_active" className="text-sm text-heading dark:text-white">Active</label>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-4">
                        <Link
                            href={route('admin.promotions.index')}
                            className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-heading rounded-lg font-medium text-sm transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2.5 bg-brand hover:bg-brand-dark text-white rounded-lg font-medium text-sm transition-colors disabled:opacity-50 inline-flex items-center gap-2"
                        >
                            {processing && <span className="material-icons animate-spin text-lg">sync</span>}
                            Update Promotion
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
