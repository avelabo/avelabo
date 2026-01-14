import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState, useEffect } from 'react';

export default function Edit({ task, dataSources, sellers, categories, importTypes }) {
    const [sourceCategories, setSourceCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [fetchError, setFetchError] = useState(null);
    const [initialLoad, setInitialLoad] = useState(true);

    const { data, setData, put, processing, errors } = useForm({
        name: task.name || '',
        data_source_id: task.data_source_id || '',
        seller_id: task.seller_id || '',
        import_type: task.import_type || 'products',
        source_category_id: task.source_category_id || '',
        source_category_name: task.source_category_name || '',
        target_category_id: task.target_category_id || '',
        run_in_background: task.run_in_background ?? false,
        settings: task.settings || {},
        is_active: task.is_active ?? true,
    });

    const fetchSourceCategories = async (preserveSelection = false) => {
        if (!data.data_source_id) {
            setSourceCategories([]);
            setFetchError(null);
            return;
        }

        setLoadingCategories(true);
        setFetchError(null);
        try {
            const response = await fetch(route('admin.import.tasks.fetch-source-categories'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
                },
                body: JSON.stringify({ data_source_id: data.data_source_id }),
            });
            const result = await response.json();
            if (result.success) {
                setSourceCategories(result.categories || []);
                setFetchError(null);
            } else {
                setFetchError(result.message || 'Failed to fetch categories');
                setSourceCategories([]);
            }
        } catch (error) {
            console.error('Failed to fetch categories:', error);
            setFetchError('Network error: Could not connect to data source');
            setSourceCategories([]);
        } finally {
            setLoadingCategories(false);
        }
    };

    // Fetch categories when data source changes
    useEffect(() => {
        if (data.data_source_id) {
            if (initialLoad) {
                // On initial load, fetch categories but preserve current selection
                fetchSourceCategories(true);
                setInitialLoad(false);
            } else {
                // On subsequent changes, reset category selection
                setData(prev => ({
                    ...prev,
                    source_category_id: '',
                    source_category_name: '',
                }));
                fetchSourceCategories(false);
            }
        } else {
            setSourceCategories([]);
        }
    }, [data.data_source_id]);

    const handleSourceCategoryChange = (categoryId) => {
        if (categoryId === 'all') {
            setData({
                ...data,
                source_category_id: '',
                source_category_name: 'All Categories',
            });
        } else {
            const category = sourceCategories.find(c => String(c.id) === String(categoryId));
            setData({
                ...data,
                source_category_id: categoryId,
                source_category_name: category?.name || '',
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.import.tasks.update', task.id));
    };

    const flattenCategories = (cats, level = 0) => {
        let result = [];
        cats?.forEach(cat => {
            result.push({ ...cat, level });
            if (cat.children?.length) {
                result = result.concat(flattenCategories(cat.children, level + 1));
            }
        });
        return result;
    };

    const flatCategories = flattenCategories(categories);

    // Get the selected data source name for display
    const selectedDataSource = dataSources?.find(s => String(s.id) === String(data.data_source_id));

    // Determine current dropdown value
    const getCurrentDropdownValue = () => {
        if (data.source_category_id) return data.source_category_id;
        if (data.source_category_name === 'All Categories') return 'all';
        return '';
    };

    return (
        <AdminLayout>
            <Head title={`Edit ${task.name}`} />

            <div className="max-w-3xl mx-auto space-y-6">
                {/* Page Header */}
                <div className="flex items-center gap-4">
                    <Link
                        href={route('admin.import.tasks.index')}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-dark-body rounded-lg transition-colors"
                    >
                        <span className="material-icons">arrow_back</span>
                    </Link>
                    <div>
                        <h2 className="text-2xl font-bold text-heading dark:text-white">Edit Import Task</h2>
                        <p className="text-body">Update {task.name}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info */}
                    <div className="bg-white dark:bg-dark-card rounded-xl shadow-card p-6 space-y-6">
                        <h3 className="text-lg font-semibold text-heading dark:text-white">Basic Information</h3>

                        <div>
                            <label className="block text-sm font-medium text-heading dark:text-white mb-2">
                                Task Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className={`w-full px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand ${
                                    errors.name ? 'ring-2 ring-red-500' : ''
                                }`}
                            />
                            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-heading dark:text-white mb-2">
                                Data Source <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={data.data_source_id}
                                onChange={(e) => setData('data_source_id', e.target.value)}
                                className={`w-full px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand ${
                                    errors.data_source_id ? 'ring-2 ring-red-500' : ''
                                }`}
                            >
                                <option value="">Select data source...</option>
                                {dataSources?.map((source) => (
                                    <option key={source.id} value={source.id}>{source.name}</option>
                                ))}
                            </select>
                            {errors.data_source_id && <p className="mt-1 text-sm text-red-500">{errors.data_source_id}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-heading dark:text-white mb-2">
                                Seller <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={data.seller_id}
                                onChange={(e) => setData('seller_id', e.target.value)}
                                className={`w-full px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand ${
                                    errors.seller_id ? 'ring-2 ring-red-500' : ''
                                }`}
                            >
                                <option value="">Select seller...</option>
                                {sellers?.map((seller) => (
                                    <option key={seller.id} value={seller.id}>{seller.shop_name}</option>
                                ))}
                            </select>
                            {errors.seller_id && <p className="mt-1 text-sm text-red-500">{errors.seller_id}</p>}
                            <p className="mt-1 text-xs text-body">Products will be imported under this seller</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-heading dark:text-white mb-2">
                                Import Type <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={data.import_type}
                                onChange={(e) => setData('import_type', e.target.value)}
                                className="w-full px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand"
                            >
                                {importTypes?.map((type) => (
                                    <option key={type.value} value={type.value}>{type.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Source Category Selection - Show when data source is selected */}
                    {data.data_source_id && (
                        <div className="bg-white dark:bg-dark-card rounded-xl shadow-card p-6 space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-heading dark:text-white">
                                    Source Category
                                </h3>
                                {selectedDataSource && (
                                    <span className="text-xs px-2 py-1 bg-brand/10 text-brand rounded-full">
                                        from {selectedDataSource.name}
                                    </span>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-heading dark:text-white mb-2">
                                    {data.import_type === 'categories' ? 'Categories to Import' : 'Import Products From'}
                                </label>
                                <div className="flex gap-2">
                                    <select
                                        value={getCurrentDropdownValue()}
                                        onChange={(e) => handleSourceCategoryChange(e.target.value)}
                                        disabled={loadingCategories}
                                        className={`flex-1 px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand disabled:opacity-50 ${
                                            fetchError ? 'ring-2 ring-amber-500' : ''
                                        }`}
                                    >
                                        {loadingCategories ? (
                                            <option value="">Loading categories...</option>
                                        ) : fetchError ? (
                                            <option value="">Failed to load categories</option>
                                        ) : (
                                            <>
                                                <option value="">Select a category...</option>
                                                <option value="all">All Categories</option>
                                                {sourceCategories.map((cat) => (
                                                    <option key={cat.id} value={cat.id}>
                                                        {cat.breadcrumbs?.join(' > ') || cat.name}
                                                    </option>
                                                ))}
                                            </>
                                        )}
                                    </select>
                                    <button
                                        type="button"
                                        onClick={() => fetchSourceCategories(true)}
                                        disabled={loadingCategories}
                                        className="px-4 py-2.5 bg-gray-100 dark:bg-dark-body rounded-lg text-sm hover:bg-gray-200 disabled:opacity-50 transition-colors"
                                        title="Refresh categories"
                                    >
                                        <span className={`material-icons text-lg ${loadingCategories ? 'animate-spin' : ''}`}>
                                            {loadingCategories ? 'sync' : 'refresh'}
                                        </span>
                                    </button>
                                </div>
                                {fetchError && (
                                    <p className="mt-1 text-sm text-amber-600 dark:text-amber-400">{fetchError}</p>
                                )}
                                {data.source_category_name && !fetchError && (
                                    <p className="mt-1 text-xs text-green-600 dark:text-green-400">
                                        Current selection: {data.source_category_name}
                                    </p>
                                )}
                                <p className="mt-1 text-xs text-body">
                                    {data.import_type === 'categories'
                                        ? 'Select which categories to import, or choose "All" to import the entire category tree'
                                        : 'Select a category to import products from, or choose "All" to import from all categories'
                                    }
                                </p>
                            </div>

                            {/* Show category count if loaded */}
                            {!loadingCategories && sourceCategories.length > 0 && (
                                <div className="flex items-center gap-2 text-sm text-body">
                                    <span className="material-icons text-lg">folder</span>
                                    <span>{sourceCategories.length} categories available</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Target Category Selection - Show for products import type */}
                    {data.import_type === 'products' && (
                        <div className="bg-white dark:bg-dark-card rounded-xl shadow-card p-6 space-y-6">
                            <h3 className="text-lg font-semibold text-heading dark:text-white">Target Category</h3>

                            <div>
                                <label className="block text-sm font-medium text-heading dark:text-white mb-2">
                                    Import Products Into
                                </label>
                                <select
                                    value={data.target_category_id}
                                    onChange={(e) => setData('target_category_id', e.target.value)}
                                    className="w-full px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand"
                                >
                                    <option value="">Use source category mapping</option>
                                    {flatCategories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {'—'.repeat(cat.level)} {cat.name}
                                        </option>
                                    ))}
                                </select>
                                <p className="mt-1 text-xs text-body">
                                    Select a local category or leave empty to auto-map based on source category
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Target Category Selection - Show for categories import type */}
                    {data.import_type === 'categories' && (
                        <div className="bg-white dark:bg-dark-card rounded-xl shadow-card p-6 space-y-6">
                            <h3 className="text-lg font-semibold text-heading dark:text-white">Target Parent Category</h3>

                            <div>
                                <label className="block text-sm font-medium text-heading dark:text-white mb-2">
                                    Import Categories Under
                                </label>
                                <select
                                    value={data.target_category_id}
                                    onChange={(e) => setData('target_category_id', e.target.value)}
                                    className="w-full px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand"
                                >
                                    <option value="">Root level (no parent)</option>
                                    {flatCategories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {'—'.repeat(cat.level)} {cat.name}
                                        </option>
                                    ))}
                                </select>
                                <p className="mt-1 text-xs text-body">
                                    Imported categories will be created under this parent
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Execution Settings */}
                    <div className="bg-white dark:bg-dark-card rounded-xl shadow-card p-6 space-y-6">
                        <h3 className="text-lg font-semibold text-heading dark:text-white">Execution Settings</h3>

                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={data.run_in_background}
                                onChange={(e) => setData('run_in_background', e.target.checked)}
                                className="w-5 h-5 rounded border-gray-300 text-brand focus:ring-brand"
                            />
                            <div>
                                <span className="font-medium text-heading dark:text-white">Run in Background</span>
                                <p className="text-sm text-body">Execute via queue for large imports</p>
                            </div>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={data.is_active}
                                onChange={(e) => setData('is_active', e.target.checked)}
                                className="w-5 h-5 rounded border-gray-300 text-brand focus:ring-brand"
                            />
                            <div>
                                <span className="font-medium text-heading dark:text-white">Active</span>
                                <p className="text-sm text-body">Enable this task for execution</p>
                            </div>
                        </label>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex items-center gap-4">
                        <Link
                            href={route('admin.import.tasks.index')}
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
