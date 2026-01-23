import { Head, Link, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useMemo } from 'react';

export default function MarkupTemplateEdit({ template }) {
    const currencyCode = template.currency?.code || 'ZAR';

    const { data, setData, put, processing, errors } = useForm({
        name: template.name || '',
        description: template.description || '',
        is_active: template.is_active ?? true,
        is_default: template.is_default ?? false,
        ranges: template.ranges?.length > 0
            ? template.ranges.map(r => ({
                id: r.id,
                min_price: r.min_price || '',
                max_price: r.max_price || '',
                markup_amount: r.markup_amount || '',
            }))
            : [{ min_price: '', max_price: '', markup_amount: '' }],
    });

    const addRange = () => {
        setData('ranges', [...data.ranges, { min_price: '', max_price: '', markup_amount: '' }]);
    };

    const removeRange = (index) => {
        setData('ranges', data.ranges.filter((_, i) => i !== index));
    };

    const updateRange = (index, field, value) => {
        const newRanges = [...data.ranges];
        newRanges[index][field] = value;
        setData('ranges', newRanges);
    };

    // Validate ranges for overlaps and gaps
    const rangeValidation = useMemo(() => {
        const warnings = [];
        const sortedRanges = [...data.ranges]
            .filter(r => r.min_price !== '' && r.max_price !== '')
            .map(r => ({
                min: parseFloat(r.min_price) || 0,
                max: parseFloat(r.max_price) || Infinity,
            }))
            .sort((a, b) => a.min - b.min);

        for (let i = 0; i < sortedRanges.length - 1; i++) {
            const current = sortedRanges[i];
            const next = sortedRanges[i + 1];

            // Check for overlap
            if (current.max > next.min) {
                warnings.push({
                    type: 'overlap',
                    message: `Ranges overlap between ${current.min}-${current.max} and ${next.min}-${next.max}`,
                });
            }

            // Check for gap
            if (current.max < next.min - 0.01) {
                warnings.push({
                    type: 'gap',
                    message: `Gap in coverage between ${current.max} and ${next.min}`,
                });
            }
        }

        return warnings;
    }, [data.ranges]);

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.markup-templates.update', template.id));
    };

    const handleDelete = () => {
        if (template.sellers_count > 0) {
            alert(`Cannot delete this template. It is currently assigned to ${template.sellers_count} seller(s). Please reassign them first.`);
            return;
        }
        if (confirm(`Are you sure you want to delete "${template.name}"?`)) {
            router.delete(route('admin.markup-templates.destroy', template.id));
        }
    };

    return (
        <AdminLayout>
            <Head title={`Edit ${template.name}`} />

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Link
                        href={route('admin.markup-templates.index')}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        <span className="material-icons text-gray-500">arrow_back</span>
                    </Link>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Template</h2>
                            {template.is_default && (
                                <span className="px-2 py-0.5 bg-brand/10 text-brand text-xs font-medium rounded-full">Default</span>
                            )}
                        </div>
                        <p className="text-gray-500 text-sm">{template.name} • Currency: {currencyCode}</p>
                    </div>
                </div>
                <button
                    onClick={handleDelete}
                    disabled={template.sellers_count > 0}
                    className="inline-flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title={template.sellers_count > 0 ? 'Cannot delete: template is in use' : 'Delete template'}
                >
                    <span className="material-icons text-lg">delete</span>
                    Delete
                </button>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Info */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Template Information</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Template Name *
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg outline-none text-sm focus:ring-2 focus:ring-brand dark:text-white"
                                        placeholder="e.g., Standard Markup, Premium Sellers"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                    />
                                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg outline-none text-sm focus:ring-2 focus:ring-brand dark:text-white"
                                        placeholder="Describe when to use this template..."
                                        rows={3}
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Price Ranges */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Price Ranges</h3>
                                    <p className="text-sm text-gray-500">Define fixed markup amounts ({currencyCode}) for different price tiers</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={addRange}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-brand hover:bg-brand/10 rounded-lg transition-colors"
                                >
                                    <span className="material-icons text-lg">add</span>
                                    Add Range
                                </button>
                            </div>

                            {/* Validation Warnings */}
                            {rangeValidation.length > 0 && (
                                <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                                    <div className="flex gap-2">
                                        <span className="material-icons text-yellow-600 text-lg">warning</span>
                                        <div className="text-sm text-yellow-700 dark:text-yellow-400">
                                            <p className="font-medium mb-1">Range Issues Detected</p>
                                            <ul className="list-disc list-inside space-y-1">
                                                {rangeValidation.map((warning, i) => (
                                                    <li key={`${warning.type}-${i}`}>{warning.message}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-4">
                                {data.ranges.map((range, index) => (
                                    <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <div className="flex-1 grid grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 mb-1">
                                                    Min Price ({currencyCode})
                                                </label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    className="w-full px-3 py-2 bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-lg outline-none text-sm focus:ring-2 focus:ring-brand dark:text-white"
                                                    placeholder="0"
                                                    value={range.min_price}
                                                    onChange={(e) => updateRange(index, 'min_price', e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 mb-1">
                                                    Max Price ({currencyCode})
                                                </label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    className="w-full px-3 py-2 bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-lg outline-none text-sm focus:ring-2 focus:ring-brand dark:text-white"
                                                    placeholder="No limit"
                                                    value={range.max_price}
                                                    onChange={(e) => updateRange(index, 'max_price', e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 mb-1">
                                                    Markup Amount ({currencyCode})
                                                </label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    className="w-full px-3 py-2 bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-lg outline-none text-sm focus:ring-2 focus:ring-brand dark:text-white"
                                                    placeholder="5000"
                                                    value={range.markup_amount}
                                                    onChange={(e) => updateRange(index, 'markup_amount', e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        {data.ranges.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeRange(index)}
                                                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                            >
                                                <span className="material-icons text-lg">delete</span>
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {errors.ranges && <p className="text-red-500 text-xs mt-2">{errors.ranges}</p>}

                            {/* Tip */}
                            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                                <div className="flex gap-2">
                                    <span className="material-icons text-blue-600 text-lg">lightbulb</span>
                                    <div className="text-sm text-blue-700 dark:text-blue-400">
                                        <p className="font-medium">Tip: Price Range Matching</p>
                                        <p>If a product price is {currencyCode} 5,000 and you have a range 0-10,000 with {currencyCode} 1,000 markup, the customer sees {currencyCode} 6,000. Leave Max Price empty for no upper limit.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Status */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Status</h3>

                            <div className="space-y-4">
                                <label htmlFor="is_active" className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        id="is_active"
                                        type="checkbox"
                                        checked={data.is_active}
                                        onChange={(e) => setData('is_active', e.target.checked)}
                                        className="w-5 h-5 text-brand rounded focus:ring-brand"
                                    />
                                    <div>
                                        <span className="block text-sm font-medium text-gray-900 dark:text-white">Active</span>
                                        <span className="text-xs text-gray-500">Template can be assigned to sellers</span>
                                    </div>
                                </label>

                                <label htmlFor="is_default" className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        id="is_default"
                                        type="checkbox"
                                        checked={data.is_default}
                                        onChange={(e) => setData('is_default', e.target.checked)}
                                        className="w-5 h-5 text-brand rounded focus:ring-brand"
                                    />
                                    <div>
                                        <span className="block text-sm font-medium text-gray-900 dark:text-white">Default Template</span>
                                        <span className="text-xs text-gray-500">Auto-apply to new sellers</span>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Usage Info */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Usage</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Currency</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{currencyCode}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Sellers using template</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{template.sellers_count || 0}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Price ranges</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{data.ranges.length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Created</span>
                                    <span className="text-gray-900 dark:text-white">
                                        {new Date(template.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Last updated</span>
                                    <span className="text-gray-900 dark:text-white">
                                        {new Date(template.updated_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Preview */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Preview</h3>
                            <div className="space-y-3">
                                <p className="text-sm text-gray-500">Example calculations:</p>
                                {data.ranges.filter(r => r.markup_amount).length > 0 ? (
                                    data.ranges.filter(r => r.markup_amount).slice(0, 3).map((range, index) => {
                                        const basePrice = parseFloat(range.min_price) || 1000;
                                        const markupAmount = parseFloat(range.markup_amount) || 0;
                                        const finalPrice = basePrice + markupAmount;
                                        return (
                                            <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-500">Base Price</span>
                                                    <span className="text-gray-900 dark:text-white">{currencyCode} {Number(basePrice).toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-500">Markup</span>
                                                    <span className="text-green-600">+{currencyCode} {Number(markupAmount).toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between text-sm font-medium pt-2 border-t border-gray-200 dark:border-gray-600 mt-2">
                                                    <span className="text-gray-700 dark:text-gray-300">Customer Sees</span>
                                                    <span className="text-brand">{currencyCode} {Number(finalPrice).toLocaleString()}</span>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
                                        <span className="material-icons text-gray-400 text-2xl">calculate</span>
                                        <p className="text-sm text-gray-500 mt-1">Enter markup amounts to see preview</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
                            <button
                                type="submit"
                                className="w-full py-3 bg-brand hover:bg-brand-dark text-white rounded-lg font-medium text-sm transition-colors disabled:opacity-50"
                                disabled={processing || rangeValidation.some(w => w.type === 'overlap')}
                            >
                                {processing ? 'Saving...' : 'Save Changes'}
                            </button>
                            {rangeValidation.some(w => w.type === 'overlap') && (
                                <p className="text-red-500 text-xs mt-2 text-center">Fix overlapping ranges before saving</p>
                            )}
                            <Link
                                href={route('admin.markup-templates.index')}
                                className="block w-full py-3 mt-3 text-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium text-sm transition-colors"
                            >
                                Cancel
                            </Link>
                        </div>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}
