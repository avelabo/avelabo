import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Create({ categories, brands, tags }) {
    const { data, setData, post, processing, errors } = useForm({
        code: '',
        name: '',
        discount_type: 'percentage',
        discount_value: '',
        scope_type: 'all',
        scope_id: '',
        min_order_amount: '',
        max_discount_amount: '',
        usage_limit: '',
        usage_limit_per_user: 1,
        requires_auth: true,
        start_date: '',
        end_date: '',
        is_active: true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.coupons.store'));
    };

    const scopeOptions = () => {
        switch (data.scope_type) {
            case 'category': return categories;
            case 'brand': return brands;
            case 'tag': return tags;
            default: return [];
        }
    };

    const generateCode = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 8; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
        setData('code', code);
    };

    return (
        <AdminLayout>
            <Head title="Add Coupon" />

            <div className="max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-heading dark:text-white">Add Coupon</h2>
                        <p className="text-body">Create a new discount coupon</p>
                    </div>
                    <Link
                        href={route('admin.coupons.index')}
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-heading rounded-lg font-medium text-sm transition-colors inline-flex items-center gap-2"
                    >
                        <span className="material-icons text-lg">arrow_back</span>
                        Back
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-white dark:bg-dark-card rounded-xl shadow-card p-6">
                        <h3 className="text-lg font-semibold text-heading dark:text-white mb-4">Coupon Details</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-heading dark:text-white mb-2">
                                    Code <span className="text-red-500">*</span>
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={data.code}
                                        onChange={(e) => setData('code', e.target.value.toUpperCase())}
                                        className={`flex-1 px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm font-mono uppercase focus:ring-2 focus:ring-brand ${errors.code ? 'ring-2 ring-red-500' : ''}`}
                                        placeholder="e.g., SUMMER20"
                                    />
                                    <button
                                        type="button"
                                        onClick={generateCode}
                                        className="px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-heading rounded-lg text-sm font-medium transition-colors"
                                    >
                                        Generate
                                    </button>
                                </div>
                                {errors.code && <p className="mt-1 text-sm text-red-500">{errors.code}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-heading dark:text-white mb-2">
                                    Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className={`w-full px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand ${errors.name ? 'ring-2 ring-red-500' : ''}`}
                                    placeholder="e.g., Summer Sale Coupon"
                                />
                                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-dark-card rounded-xl shadow-card p-6">
                        <h3 className="text-lg font-semibold text-heading dark:text-white mb-4">Discount</h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-heading dark:text-white mb-2">Type</label>
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
                                    <label className="block text-sm font-medium text-heading dark:text-white mb-2">Value <span className="text-red-500">*</span></label>
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

                            {data.discount_type === 'percentage' && (
                                <div>
                                    <label className="block text-sm font-medium text-heading dark:text-white mb-2">Max Discount Amount (MK)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={data.max_discount_amount}
                                        onChange={(e) => setData('max_discount_amount', e.target.value)}
                                        className="w-full px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand"
                                        placeholder="Leave empty for no cap"
                                    />
                                </div>
                            )}

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
                                            <option key={item.id} value={item.id}>{item.name}</option>
                                        ))}
                                    </select>
                                    {errors.scope_id && <p className="mt-1 text-sm text-red-500">{errors.scope_id}</p>}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-dark-card rounded-xl shadow-card p-6">
                        <h3 className="text-lg font-semibold text-heading dark:text-white mb-4">Limits</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-heading dark:text-white mb-2">Min Order Amount (MK)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={data.min_order_amount}
                                    onChange={(e) => setData('min_order_amount', e.target.value)}
                                    className="w-full px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand"
                                    placeholder="Leave empty for no minimum"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-heading dark:text-white mb-2">Total Usage Limit</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={data.usage_limit}
                                        onChange={(e) => setData('usage_limit', e.target.value)}
                                        className="w-full px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand"
                                        placeholder="Unlimited"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-heading dark:text-white mb-2">Per User Limit</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={data.usage_limit_per_user}
                                        onChange={(e) => setData('usage_limit_per_user', parseInt(e.target.value) || 1)}
                                        className="w-full px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="requires_auth"
                                    checked={data.requires_auth}
                                    onChange={(e) => setData('requires_auth', e.target.checked)}
                                    className="w-4 h-4 text-brand bg-gray-100 border-gray-300 rounded focus:ring-brand"
                                />
                                <label htmlFor="requires_auth" className="text-sm text-heading dark:text-white">
                                    Require login to use this coupon
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-dark-card rounded-xl shadow-card p-6">
                        <h3 className="text-lg font-semibold text-heading dark:text-white mb-4">Schedule</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-heading dark:text-white mb-2">Start Date <span className="text-red-500">*</span></label>
                                <input
                                    type="datetime-local"
                                    value={data.start_date}
                                    onChange={(e) => setData('start_date', e.target.value)}
                                    className={`w-full px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand ${errors.start_date ? 'ring-2 ring-red-500' : ''}`}
                                />
                                {errors.start_date && <p className="mt-1 text-sm text-red-500">{errors.start_date}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-heading dark:text-white mb-2">End Date <span className="text-red-500">*</span></label>
                                <input
                                    type="datetime-local"
                                    value={data.end_date}
                                    onChange={(e) => setData('end_date', e.target.value)}
                                    className={`w-full px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand ${errors.end_date ? 'ring-2 ring-red-500' : ''}`}
                                />
                                {errors.end_date && <p className="mt-1 text-sm text-red-500">{errors.end_date}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-dark-card rounded-xl shadow-card p-6">
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
                        <Link href={route('admin.coupons.index')} className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-heading rounded-lg font-medium text-sm transition-colors">Cancel</Link>
                        <button type="submit" disabled={processing} className="px-6 py-2.5 bg-brand hover:bg-brand-dark text-white rounded-lg font-medium text-sm transition-colors disabled:opacity-50 inline-flex items-center gap-2">
                            {processing && <span className="material-icons animate-spin text-lg">sync</span>}
                            Create Coupon
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
