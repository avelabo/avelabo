import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function MarkupTemplatesIndex({ templates }) {
    const handleDelete = (template) => {
        if (confirm(`Are you sure you want to delete "${template.name}"? This will remove markup rules for all sellers using this template.`)) {
            router.delete(route('admin.markup-templates.destroy', template.id));
        }
    };

    return (
        <AdminLayout>
            <Head title="Markup Templates" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Markup Templates</h2>
                    <p className="text-gray-500 text-sm">Create and manage price markup templates for sellers</p>
                </div>
                <Link
                    href={route('admin.markup-templates.create')}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-brand hover:bg-brand-dark text-white rounded-lg font-medium text-sm transition-colors"
                >
                    <span className="material-icons text-lg">add</span>
                    New Template
                </Link>
            </div>

            {/* Info Banner */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6">
                <div className="flex gap-3">
                    <span className="material-icons text-blue-600">info</span>
                    <div className="text-sm text-blue-700 dark:text-blue-400">
                        <p className="font-medium mb-1">How Markup Templates Work</p>
                        <p>Markup templates define percentage increases applied to seller product prices. The markup is INVISIBLE to customers - they only see the final price. Templates can have multiple ranges based on product price tiers.</p>
                    </div>
                </div>
            </div>

            {/* Templates Grid */}
            {templates?.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {templates.map((template) => (
                        <div key={template.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{template.name}</h3>
                                        {template.description && (
                                            <p className="text-sm text-gray-500 mt-1">{template.description}</p>
                                        )}
                                    </div>
                                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                                        template.is_active
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-gray-100 text-gray-700'
                                    }`}>
                                        {template.is_active ? 'Active' : 'Inactive'}
                                    </div>
                                </div>

                                {/* Markup Ranges */}
                                <div className="space-y-2 mb-4">
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Price Ranges</p>
                                    {template.ranges?.length > 0 ? (
                                        <div className="space-y-1">
                                            {template.ranges.slice(0, 3).map((range, index) => (
                                                <div key={index} className="flex items-center justify-between text-sm">
                                                    <span className="text-gray-600 dark:text-gray-400">
                                                        {range.min_price ? `MWK ${range.min_price.toLocaleString()}` : '0'} - {range.max_price ? `MWK ${range.max_price.toLocaleString()}` : 'Any'}
                                                    </span>
                                                    <span className="font-medium text-brand">+{range.markup_percentage}%</span>
                                                </div>
                                            ))}
                                            {template.ranges.length > 3 && (
                                                <p className="text-xs text-gray-500">+{template.ranges.length - 3} more ranges</p>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-500">No ranges defined</p>
                                    )}
                                </div>

                                {/* Sellers Count */}
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <span className="material-icons text-lg">store</span>
                                    <span>{template.sellers_count || 0} sellers using this template</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-100 dark:border-gray-700 flex justify-between">
                                <Link
                                    href={route('admin.markup-templates.edit', template.id)}
                                    className="inline-flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-brand transition-colors"
                                >
                                    <span className="material-icons text-lg">edit</span>
                                    Edit
                                </Link>
                                <button
                                    onClick={() => handleDelete(template)}
                                    className="inline-flex items-center gap-1 text-sm text-red-600 hover:text-red-700 transition-colors"
                                >
                                    <span className="material-icons text-lg">delete</span>
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-12 text-center">
                    <span className="material-icons text-5xl text-gray-300 mb-4">price_change</span>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Markup Templates</h3>
                    <p className="text-gray-500 mb-6">Create your first markup template to start applying price markups to seller products.</p>
                    <Link
                        href={route('admin.markup-templates.create')}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-brand hover:bg-brand-dark text-white rounded-lg font-medium text-sm transition-colors"
                    >
                        <span className="material-icons text-lg">add</span>
                        Create First Template
                    </Link>
                </div>
            )}
        </AdminLayout>
    );
}
