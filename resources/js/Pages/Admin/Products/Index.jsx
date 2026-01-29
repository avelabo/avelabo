import { Head, Link, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';

export default function Index({ products, filters, categories, sellers, brands, stats, currencies, displayCurrency }) {
    const [selectAll, setSelectAll] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [search, setSearch] = useState(filters?.search || '');
    const [showClearModal, setShowClearModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null); // { type: 'single' | 'bulk', product?: object, ids?: array }
    const [deleteImages, setDeleteImages] = useState(false);
    const [showOrphanModal, setShowOrphanModal] = useState(false);

    const clearForm = useForm({
        clear_type: 'all',
        category_id: '',
        brand_id: '',
        date: '',
        password: '',
        delete_images: false,
    });

    const orphanForm = useForm({
        password: '',
        force: false,
    });

    const getStatusBadge = (status) => {
        const styles = {
            active: 'bg-green-100 text-green-700',
            draft: 'bg-yellow-100 text-yellow-700',
            inactive: 'bg-gray-100 text-gray-600',
        };
        return styles[status] || 'bg-gray-100 text-gray-600';
    };

    const toggleSelectAll = () => {
        if (selectAll) {
            setSelectedItems([]);
        } else {
            setSelectedItems(products.data.map(p => p.id));
        }
        setSelectAll(!selectAll);
    };

    const toggleItem = (id) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter(item => item !== id));
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.products.index'), { search }, { preserveState: true });
    };

    const handleFilterChange = (key, value) => {
        router.get(route('admin.products.index'), { ...filters, [key]: value || undefined }, { preserveState: true });
    };

    const handleDelete = (product) => {
        setDeleteTarget({ type: 'single', product });
        setDeleteImages(false);
        setShowDeleteModal(true);
    };

    const handleBulkAction = (action) => {
        if (selectedItems.length === 0) {
            alert('Please select at least one product');
            return;
        }

        if (action === 'delete') {
            setDeleteTarget({ type: 'bulk', ids: [...selectedItems] });
            setDeleteImages(false);
            setShowDeleteModal(true);
        } else if (['active', 'inactive', 'draft'].includes(action)) {
            router.post(route('admin.products.bulk-status'), { ids: selectedItems, status: action });
            setSelectedItems([]);
            setSelectAll(false);
        }
    };

    const confirmDelete = () => {
        if (deleteTarget.type === 'single') {
            router.delete(route('admin.products.destroy', deleteTarget.product.id), {
                data: { delete_images: deleteImages },
                onSuccess: () => {
                    setShowDeleteModal(false);
                    setDeleteTarget(null);
                },
            });
        } else if (deleteTarget.type === 'bulk') {
            router.post(route('admin.products.bulk-delete'), {
                ids: deleteTarget.ids,
                delete_images: deleteImages,
            }, {
                onSuccess: () => {
                    setShowDeleteModal(false);
                    setDeleteTarget(null);
                    setSelectedItems([]);
                    setSelectAll(false);
                },
            });
        }
    };

    const handleOrphanCleanup = (e) => {
        e.preventDefault();
        orphanForm.post(route('admin.products.clean-orphaned-images'), {
            onSuccess: () => {
                setShowOrphanModal(false);
                orphanForm.reset();
            },
        });
    };

    const handleClearSubmit = (e) => {
        e.preventDefault();
        clearForm.post(route('admin.products.bulk-clear'), {
            onSuccess: () => {
                setShowClearModal(false);
                clearForm.reset();
            },
        });
    };

    const getClearTypeLabel = () => {
        switch (clearForm.data.clear_type) {
            case 'all': return 'ALL products';
            case 'category': return `products in selected category`;
            case 'brand': return `products of selected brand`;
            case 'created_before': return `products created before the selected date`;
            case 'created_after': return `products created after the selected date`;
            case 'updated_before': return `products updated before the selected date`;
            case 'updated_after': return `products updated after the selected date`;
            default: return 'products';
        }
    };

    const formatCurrency = (amount, currencyCode = displayCurrency) => {
        const currencySymbols = {
            'MWK': 'MK',
            'ZAR': 'R',
            'USD': '$',
        };
        const symbol = currencySymbols[currencyCode] || currencyCode;
        const formatted = new Intl.NumberFormat('en', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(amount || 0);
        return `${symbol} ${formatted}`;
    };

    const handleCurrencyChange = (currency) => {
        router.get(route('admin.products.index'), { ...filters, currency: currency || undefined }, { preserveState: true });
    };

    return (
        <AdminLayout>
            <Head title="Products" />

            <div className="space-y-6">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-heading dark:text-white">Products</h2>
                        <p className="text-body">Manage all products across sellers</p>
                    </div>
                    <div className="flex gap-3 mt-4 md:mt-0">
                        <button
                            onClick={() => setShowOrphanModal(true)}
                            className="px-4 py-2 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-lg font-medium text-sm transition-colors inline-flex items-center gap-2"
                            title="Remove image files from disk that are no longer linked to products"
                        >
                            <span className="material-icons text-lg">cleaning_services</span>
                            Clean Orphans
                        </button>
                        <button
                            onClick={() => setShowClearModal(true)}
                            className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-medium text-sm transition-colors inline-flex items-center gap-2"
                        >
                            <span className="material-icons text-lg">delete_sweep</span>
                            Clear Products
                        </button>
                        <Link
                            href={route('admin.products.create')}
                            className="px-4 py-2 bg-brand hover:bg-brand-dark text-white rounded-lg font-medium text-sm transition-colors inline-flex items-center gap-2"
                        >
                            <span className="material-icons text-lg">add</span>
                            Add Product
                        </Link>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <div className="bg-white dark:bg-dark-card rounded-xl p-4 shadow-card">
                        <p className="text-sm text-body">Total</p>
                        <p className="text-2xl font-bold text-heading dark:text-white">{stats.total}</p>
                    </div>
                    <div className="bg-white dark:bg-dark-card rounded-xl p-4 shadow-card">
                        <p className="text-sm text-green-600">Active</p>
                        <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                    </div>
                    <div className="bg-white dark:bg-dark-card rounded-xl p-4 shadow-card">
                        <p className="text-sm text-yellow-600">Draft</p>
                        <p className="text-2xl font-bold text-yellow-600">{stats.draft}</p>
                    </div>
                    <div className="bg-white dark:bg-dark-card rounded-xl p-4 shadow-card">
                        <p className="text-sm text-gray-500">Inactive</p>
                        <p className="text-2xl font-bold text-gray-500">{stats.inactive}</p>
                    </div>
                    <div className="bg-white dark:bg-dark-card rounded-xl p-4 shadow-card">
                        <p className="text-sm text-orange-600">Low Stock</p>
                        <p className="text-2xl font-bold text-orange-600">{stats.low_stock}</p>
                    </div>
                    <div className="bg-white dark:bg-dark-card rounded-xl p-4 shadow-card">
                        <p className="text-sm text-red-600">Out of Stock</p>
                        <p className="text-2xl font-bold text-red-600">{stats.out_of_stock}</p>
                    </div>
                </div>

                {/* Filters Card */}
                <div className="bg-white dark:bg-dark-card rounded-xl shadow-card">
                    <div className="p-5 border-b dark:border-white/10">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                            {/* Search */}
                            <div className="md:col-span-4">
                                <form onSubmit={handleSearch}>
                                    <div className="relative">
                                        <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                                        <input
                                            type="text"
                                            placeholder="Search products..."
                                            className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                        />
                                    </div>
                                </form>
                            </div>
                            {/* Category Filter */}
                            <div className="md:col-span-2">
                                <select
                                    className="w-full px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand"
                                    value={filters?.category_id || ''}
                                    onChange={(e) => handleFilterChange('category_id', e.target.value)}
                                >
                                    <option value="">All Categories</option>
                                    {categories?.map((category) => (
                                        <option key={category.id} value={category.id}>{category.name}</option>
                                    ))}
                                </select>
                            </div>
                            {/* Seller Filter */}
                            <div className="md:col-span-2">
                                <select
                                    className="w-full px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand"
                                    value={filters?.seller_id || ''}
                                    onChange={(e) => handleFilterChange('seller_id', e.target.value)}
                                >
                                    <option value="">All Sellers</option>
                                    {sellers?.map((seller) => (
                                        <option key={seller.id} value={seller.id}>{seller.shop_name}</option>
                                    ))}
                                </select>
                            </div>
                            {/* Status Filter */}
                            <div className="md:col-span-2">
                                <select
                                    className="w-full px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand"
                                    value={filters?.status || ''}
                                    onChange={(e) => handleFilterChange('status', e.target.value)}
                                >
                                    <option value="">All Status</option>
                                    <option value="active">Active</option>
                                    <option value="draft">Draft</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                            {/* Stock Filter */}
                            <div className="md:col-span-2">
                                <select
                                    className="w-full px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand"
                                    value={filters?.stock || ''}
                                    onChange={(e) => handleFilterChange('stock', e.target.value)}
                                >
                                    <option value="">All Stock</option>
                                    <option value="low">Low Stock</option>
                                    <option value="out">Out of Stock</option>
                                </select>
                            </div>
                        </div>
                        {/* Currency Selector Row */}
                        <div className="mt-4 flex items-center gap-3">
                            <span className="text-sm text-body">Display prices in:</span>
                            <select
                                className="px-4 py-2 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand"
                                value={displayCurrency || 'MWK'}
                                onChange={(e) => handleCurrencyChange(e.target.value)}
                            >
                                {currencies?.map((currency) => (
                                    <option key={currency.id} value={currency.code}>
                                        {currency.code} ({currency.symbol})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Bulk Actions */}
                    {selectedItems.length > 0 && (
                        <div className="px-5 py-3 bg-gray-50 dark:bg-dark-body border-b dark:border-white/10 flex items-center gap-4">
                            <span className="text-sm text-body">{selectedItems.length} selected</span>
                            <button
                                onClick={() => handleBulkAction('active')}
                                className="px-3 py-1.5 bg-green-100 text-green-700 rounded text-xs font-medium hover:bg-green-200"
                            >
                                Set Active
                            </button>
                            <button
                                onClick={() => handleBulkAction('draft')}
                                className="px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded text-xs font-medium hover:bg-yellow-200"
                            >
                                Set Draft
                            </button>
                            <button
                                onClick={() => handleBulkAction('inactive')}
                                className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded text-xs font-medium hover:bg-gray-300"
                            >
                                Set Inactive
                            </button>
                            <button
                                onClick={() => handleBulkAction('delete')}
                                className="px-3 py-1.5 bg-red-100 text-red-700 rounded text-xs font-medium hover:bg-red-200"
                            >
                                Delete
                            </button>
                        </div>
                    )}

                    {/* Products Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-dark-body">
                                <tr>
                                    <th className="px-6 py-3 text-left">
                                        <input
                                            type="checkbox"
                                            checked={selectAll}
                                            onChange={toggleSelectAll}
                                            className="w-4 h-4 text-brand bg-gray-100 border-gray-300 rounded focus:ring-brand"
                                        />
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seller</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Base Price</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <span className="text-green-600">+Markup</span>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y dark:divide-white/10">
                                {products?.data?.length > 0 ? (
                                    products.data.map((product) => (
                                        <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-dark-body/50">
                                            <td className="px-6 py-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedItems.includes(product.id)}
                                                    onChange={() => toggleItem(product.id)}
                                                    className="w-4 h-4 text-brand bg-gray-100 border-gray-300 rounded focus:ring-brand"
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 bg-gray-100 dark:bg-dark-body rounded-lg overflow-hidden flex-shrink-0">
                                                        {product.primary_image_url ? (
                                                            <img
                                                                src={`${product.primary_image_url}`}
                                                                alt={product.name}
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => {
                                                                    e.target.onerror = null;
                                                                    e.target.src = '/images/frontend/shop/product-placeholder.png';
                                                                }}
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <span className="material-icons text-gray-400">image</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <Link
                                                            href={route('admin.products.show', product.id)}
                                                            className="font-medium text-heading dark:text-white hover:text-brand"
                                                        >
                                                            {product.name}
                                                        </Link>
                                                        <p className="text-sm text-body">{product.sku}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-body">
                                                {product.seller?.shop_name || '-'}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-body">
                                                {product.category?.name || '-'}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                                    {product.original_currency}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-right">
                                                <div className="text-heading dark:text-white font-medium">
                                                    {formatCurrency(product.converted_base_price)}
                                                </div>
                                                <div className="text-xs text-body">
                                                    {formatCurrency(product.base_price, product.original_currency)} orig
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-right">
                                                <div className="text-green-600 dark:text-green-400 font-semibold">
                                                    {formatCurrency(product.price_with_markup)}
                                                </div>
                                                {product.markup_amount > 0 && (
                                                    <div className="text-xs text-green-500">
                                                        +{formatCurrency(product.markup_amount)}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    product.stock_quantity === 0
                                                        ? 'bg-red-100 text-red-700'
                                                        : product.stock_quantity <= product.low_stock_threshold
                                                        ? 'bg-orange-100 text-orange-700'
                                                        : 'bg-green-100 text-green-700'
                                                }`}>
                                                    {product.stock_quantity} units
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusBadge(product.status)}`}>
                                                    {product.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={route('admin.products.edit', product.id)}
                                                        className="p-2 text-gray-500 hover:text-brand hover:bg-gray-100 dark:hover:bg-dark-body rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <span className="material-icons text-lg">edit</span>
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(product)}
                                                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <span className="material-icons text-lg">delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="10" className="px-6 py-12 text-center">
                                            <span className="material-icons text-5xl text-gray-300 mb-4">inventory_2</span>
                                            <h3 className="text-lg font-medium text-heading dark:text-white mb-2">No products found</h3>
                                            <p className="text-body mb-6">Try adjusting your filters or add a new product.</p>
                                            <Link
                                                href={route('admin.products.create')}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-brand hover:bg-brand-dark text-white rounded-lg font-medium text-sm transition-colors"
                                            >
                                                <span className="material-icons text-lg">add</span>
                                                Add Product
                                            </Link>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {products?.last_page > 1 && (
                        <div className="px-6 py-4 border-t dark:border-white/10">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-body">
                                    Showing {products.from} to {products.to} of {products.total} products
                                </p>
                                <div className="flex gap-2">
                                    {products.links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url || '#'}
                                            className={`px-3 py-1.5 rounded text-sm ${
                                                link.active
                                                    ? 'bg-brand text-white'
                                                    : link.url
                                                    ? 'bg-gray-100 dark:bg-dark-body text-body hover:bg-gray-200'
                                                    : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Clear Products Modal */}
            {showClearModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
                        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowClearModal(false)} />

                        <div className="relative inline-block w-full max-w-lg p-6 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-dark-card rounded-xl shadow-xl">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                        <span className="material-icons text-red-600">warning</span>
                                    </div>
                                    <h3 className="text-lg font-semibold text-heading dark:text-white">Clear Products</h3>
                                </div>
                                <button
                                    onClick={() => setShowClearModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <span className="material-icons">close</span>
                                </button>
                            </div>

                            <form onSubmit={handleClearSubmit}>
                                <div className="space-y-4">
                                    {/* Clear Type Selection */}
                                    <div>
                                        <label className="block text-sm font-medium text-heading dark:text-white mb-2">
                                            Clear Type
                                        </label>
                                        <select
                                            value={clearForm.data.clear_type}
                                            onChange={(e) => clearForm.setData('clear_type', e.target.value)}
                                            className="w-full px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand"
                                        >
                                            <option value="all">All Products</option>
                                            <option value="category">By Category</option>
                                            <option value="brand">By Brand</option>
                                            <option value="created_before">Created Before Date</option>
                                            <option value="created_after">Created After Date</option>
                                            <option value="updated_before">Updated Before Date</option>
                                            <option value="updated_after">Updated After Date</option>
                                        </select>
                                    </div>

                                    {/* Category Selection */}
                                    {clearForm.data.clear_type === 'category' && (
                                        <div>
                                            <label className="block text-sm font-medium text-heading dark:text-white mb-2">
                                                Select Category
                                            </label>
                                            <select
                                                value={clearForm.data.category_id}
                                                onChange={(e) => clearForm.setData('category_id', e.target.value)}
                                                className="w-full px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand"
                                            >
                                                <option value="">Select a category</option>
                                                {categories?.map((category) => (
                                                    <option key={category.id} value={category.id}>{category.name}</option>
                                                ))}
                                            </select>
                                            {clearForm.errors.category_id && (
                                                <p className="mt-1 text-sm text-red-500">{clearForm.errors.category_id}</p>
                                            )}
                                        </div>
                                    )}

                                    {/* Brand Selection */}
                                    {clearForm.data.clear_type === 'brand' && (
                                        <div>
                                            <label className="block text-sm font-medium text-heading dark:text-white mb-2">
                                                Select Brand
                                            </label>
                                            <select
                                                value={clearForm.data.brand_id}
                                                onChange={(e) => clearForm.setData('brand_id', e.target.value)}
                                                className="w-full px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand"
                                            >
                                                <option value="">Select a brand</option>
                                                {brands?.map((brand) => (
                                                    <option key={brand.id} value={brand.id}>{brand.name}</option>
                                                ))}
                                            </select>
                                            {clearForm.errors.brand_id && (
                                                <p className="mt-1 text-sm text-red-500">{clearForm.errors.brand_id}</p>
                                            )}
                                        </div>
                                    )}

                                    {/* Date Selection */}
                                    {['created_before', 'created_after', 'updated_before', 'updated_after'].includes(clearForm.data.clear_type) && (
                                        <div>
                                            <label className="block text-sm font-medium text-heading dark:text-white mb-2">
                                                Select Date
                                            </label>
                                            <input
                                                type="date"
                                                value={clearForm.data.date}
                                                onChange={(e) => clearForm.setData('date', e.target.value)}
                                                className="w-full px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand"
                                            />
                                            {clearForm.errors.date && (
                                                <p className="mt-1 text-sm text-red-500">{clearForm.errors.date}</p>
                                            )}
                                        </div>
                                    )}

                                    {/* Delete Images Option */}
                                    <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-dark-body rounded-lg">
                                        <input
                                            type="checkbox"
                                            id="clear_delete_images"
                                            checked={clearForm.data.delete_images}
                                            onChange={(e) => clearForm.setData('delete_images', e.target.checked)}
                                            className="w-4 h-4 text-brand bg-gray-100 border-gray-300 rounded focus:ring-brand"
                                        />
                                        <label htmlFor="clear_delete_images" className="text-sm text-heading dark:text-white">
                                            Also delete image files from disk (runs in background)
                                        </label>
                                    </div>

                                    {/* Warning Message */}
                                    <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                        <p className="text-sm text-red-700 dark:text-red-400">
                                            <strong>Warning:</strong> This will permanently delete {getClearTypeLabel()}.
                                            This action cannot be undone.
                                        </p>
                                    </div>

                                    {/* Password Confirmation */}
                                    <div>
                                        <label className="block text-sm font-medium text-heading dark:text-white mb-2">
                                            Enter your password to confirm
                                        </label>
                                        <input
                                            type="password"
                                            value={clearForm.data.password}
                                            onChange={(e) => clearForm.setData('password', e.target.value)}
                                            className={`w-full px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand ${clearForm.errors.password ? 'ring-2 ring-red-500' : ''}`}
                                            placeholder="Enter your password"
                                        />
                                        {clearForm.errors.password && (
                                            <p className="mt-1 text-sm text-red-500">{clearForm.errors.password}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-end gap-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowClearModal(false)}
                                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-heading rounded-lg font-medium text-sm transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={clearForm.processing}
                                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium text-sm transition-colors disabled:opacity-50 inline-flex items-center gap-2"
                                    >
                                        {clearForm.processing && <span className="material-icons animate-spin text-lg">sync</span>}
                                        Delete Products
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && deleteTarget && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
                        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowDeleteModal(false)} />

                        <div className="relative inline-block w-full max-w-md p-6 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-dark-card rounded-xl shadow-xl">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                        <span className="material-icons text-red-600">delete</span>
                                    </div>
                                    <h3 className="text-lg font-semibold text-heading dark:text-white">
                                        Delete {deleteTarget.type === 'single' ? 'Product' : 'Products'}
                                    </h3>
                                </div>
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <span className="material-icons">close</span>
                                </button>
                            </div>

                            <p className="text-body mb-4">
                                {deleteTarget.type === 'single'
                                    ? `Are you sure you want to delete "${deleteTarget.product.name}"?`
                                    : `Are you sure you want to delete ${deleteTarget.ids.length} products?`
                                }
                            </p>

                            {/* Delete Images Option */}
                            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-dark-body rounded-lg mb-4">
                                <input
                                    type="checkbox"
                                    id="delete_images_checkbox"
                                    checked={deleteImages}
                                    onChange={(e) => setDeleteImages(e.target.checked)}
                                    className="w-4 h-4 text-brand bg-gray-100 border-gray-300 rounded focus:ring-brand"
                                />
                                <label htmlFor="delete_images_checkbox" className="text-sm text-heading dark:text-white">
                                    Also delete image files from disk (runs in background)
                                </label>
                            </div>

                            <div className="flex items-center justify-end gap-3">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-heading rounded-lg font-medium text-sm transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium text-sm transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Clean Orphaned Images Modal */}
            {showOrphanModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
                        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowOrphanModal(false)} />

                        <div className="relative inline-block w-full max-w-md p-6 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-dark-card rounded-xl shadow-xl">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                                        <span className="material-icons text-orange-600">cleaning_services</span>
                                    </div>
                                    <h3 className="text-lg font-semibold text-heading dark:text-white">Clean Orphaned Images</h3>
                                </div>
                                <button
                                    onClick={() => setShowOrphanModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <span className="material-icons">close</span>
                                </button>
                            </div>

                            <form onSubmit={handleOrphanCleanup}>
                                <div className="space-y-4">
                                    <p className="text-body">
                                        This will scan the storage for image files that are no longer associated with any product
                                        and delete them to free up disk space. This runs as a background task.
                                    </p>

                                    <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                                        <p className="text-sm text-orange-700 dark:text-orange-400">
                                            <strong>What gets cleaned:</strong>
                                        </p>
                                        <ul className="text-sm text-orange-700 dark:text-orange-400 list-disc ml-5 mt-1">
                                            <li>Product directories for deleted products</li>
                                            <li>Image files not referenced in the database</li>
                                        </ul>
                                    </div>

                                    {/* Force Mode Option */}
                                    <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                        <input
                                            type="checkbox"
                                            id="force_cleanup"
                                            checked={orphanForm.data.force}
                                            onChange={(e) => orphanForm.setData('force', e.target.checked)}
                                            className="w-4 h-4 mt-0.5 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500"
                                        />
                                        <div>
                                            <label htmlFor="force_cleanup" className="text-sm font-medium text-red-700 dark:text-red-400">
                                                Force mode (aggressive)
                                            </label>
                                            <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                                                Also delete images for soft-deleted products. Use this if you've permanently cleared products and want to reclaim disk space.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Password Confirmation */}
                                    <div>
                                        <label className="block text-sm font-medium text-heading dark:text-white mb-2">
                                            Enter your password to confirm
                                        </label>
                                        <input
                                            type="password"
                                            value={orphanForm.data.password}
                                            onChange={(e) => orphanForm.setData('password', e.target.value)}
                                            className={`w-full px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand ${orphanForm.errors.password ? 'ring-2 ring-red-500' : ''}`}
                                            placeholder="Enter your password"
                                        />
                                        {orphanForm.errors.password && (
                                            <p className="mt-1 text-sm text-red-500">{orphanForm.errors.password}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center justify-end gap-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowOrphanModal(false)}
                                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-heading rounded-lg font-medium text-sm transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={orphanForm.processing}
                                        className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium text-sm transition-colors disabled:opacity-50 inline-flex items-center gap-2"
                                    >
                                        {orphanForm.processing && <span className="material-icons animate-spin text-lg">sync</span>}
                                        Start Cleanup
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
