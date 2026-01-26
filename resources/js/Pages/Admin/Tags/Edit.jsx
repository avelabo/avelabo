import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

const presetColors = [
    '#ef4444', // red
    '#f97316', // orange
    '#f59e0b', // amber
    '#eab308', // yellow
    '#84cc16', // lime
    '#22c55e', // green
    '#14b8a6', // teal
    '#06b6d4', // cyan
    '#0ea5e9', // sky
    '#3b82f6', // blue
    '#6366f1', // indigo
    '#8b5cf6', // violet
    '#a855f7', // purple
    '#d946ef', // fuchsia
    '#ec4899', // pink
    '#64748b', // slate
];

export default function Edit({ tag }) {
    const { data, setData, put, processing, errors } = useForm({
        name: tag.name || '',
        color: tag.color || '#6366f1',
        is_active: tag.is_active ?? true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.tags.update', tag.id));
    };

    return (
        <AdminLayout>
            <Head title={`Edit: ${tag.name}`} />

            <div className="max-w-2xl mx-auto">
                {/* Page Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-heading dark:text-white">Edit Tag</h2>
                        <p className="text-body">{tag.name}</p>
                    </div>
                    <Link
                        href={route('admin.tags.index')}
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-heading rounded-lg font-medium text-sm transition-colors inline-flex items-center gap-2"
                    >
                        <span className="material-icons text-lg">arrow_back</span>
                        Back
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <div className="bg-white dark:bg-dark-card rounded-xl shadow-card p-6">
                        <h3 className="text-lg font-semibold text-heading dark:text-white mb-4">Tag Details</h3>
                        <div className="space-y-6">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-heading dark:text-white mb-2">
                                    Tag Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className={`w-full px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand ${errors.name ? 'ring-2 ring-red-500' : ''}`}
                                    placeholder="e.g., New Arrival, Sale, Trending"
                                />
                                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                            </div>

                            {/* Color */}
                            <div>
                                <label className="block text-sm font-medium text-heading dark:text-white mb-2">
                                    Tag Color <span className="text-red-500">*</span>
                                </label>
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {presetColors.map((color) => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() => setData('color', color)}
                                            className={`w-8 h-8 rounded-lg border-2 transition-all ${
                                                data.color === color
                                                    ? 'border-heading dark:border-white scale-110'
                                                    : 'border-transparent hover:scale-105'
                                            }`}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={data.color}
                                        onChange={(e) => setData('color', e.target.value)}
                                        className="w-12 h-10 rounded cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        value={data.color}
                                        onChange={(e) => setData('color', e.target.value)}
                                        className="w-28 px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm font-mono focus:ring-2 focus:ring-brand"
                                        placeholder="#000000"
                                    />
                                </div>
                                {errors.color && <p className="mt-1 text-sm text-red-500">{errors.color}</p>}
                            </div>

                            {/* Preview */}
                            <div>
                                <label className="block text-sm font-medium text-heading dark:text-white mb-2">
                                    Preview
                                </label>
                                <span
                                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white"
                                    style={{ backgroundColor: data.color }}
                                >
                                    {data.name || 'Tag Preview'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Status */}
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
                            <label htmlFor="is_active" className="text-sm text-heading dark:text-white">
                                Active (visible on the website)
                            </label>
                        </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex items-center justify-end gap-4">
                        <Link
                            href={route('admin.tags.index')}
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
                            Update Tag
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
