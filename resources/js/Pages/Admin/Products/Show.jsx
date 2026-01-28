import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Show({ product, categories, brands, sellers }) {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-MW', {
            style: 'currency',
            currency: 'MWK',
            minimumFractionDigits: 0,
        }).format(amount || 0);
    };

    const getStatusBadge = (status) => {
        const styles = {
            active: 'bg-green-100 text-green-700',
            draft: 'bg-yellow-100 text-yellow-700',
            inactive: 'bg-gray-100 text-gray-600',
        };
        return styles[status] || 'bg-gray-100 text-gray-600';
    };

    const handleDelete = () => {
        if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
            router.delete(route('admin.products.destroy', product.id));
        }
    };

    return (
        <AdminLayout>
            <Head title={product.name} />

            <div className="max-w-5xl mx-auto">
                {/* Page Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-bold text-heading dark:text-white">{product.name}</h2>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusBadge(product.status)}`}>
                                {product.status}
                            </span>
                            {product.is_featured && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                                    Featured
                                </span>
                            )}
                        </div>
                        <p className="text-body">{product.sku || 'No SKU'}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleDelete}
                            className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-medium text-sm transition-colors inline-flex items-center gap-2"
                        >
                            <span className="material-icons text-lg">delete</span>
                            Delete
                        </button>
                        <Link
                            href={route('admin.products.edit', product.id)}
                            className="px-4 py-2 bg-brand hover:bg-brand-dark text-white rounded-lg font-medium text-sm transition-colors inline-flex items-center gap-2"
                        >
                            <span className="material-icons text-lg">edit</span>
                            Edit Product
                        </Link>
                        <Link
                            href={route('admin.products.index')}
                            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-heading rounded-lg font-medium text-sm transition-colors inline-flex items-center gap-2"
                        >
                            <span className="material-icons text-lg">arrow_back</span>
                            Back
                        </Link>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Product Images */}
                    <div className="bg-white dark:bg-dark-card rounded-xl shadow-card p-6">
                        <h3 className="text-lg font-semibold text-heading dark:text-white mb-4">Product Images</h3>
                        {product.images?.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {product.images.map((image, index) => (
                                    <div key={image.id} className="relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                                        <img
                                            src={`/storage/${image.path}`}
                                            alt={image.alt_text || product.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = '/images/frontend/shop/product-placeholder.png';
                                            }}
                                        />
                                        {image.is_primary && (
                                            <span className="absolute top-2 left-2 px-2 py-0.5 bg-brand text-white text-xs rounded font-medium">
                                                Primary
                                            </span>
                                        )}
                                        <span className="absolute top-2 right-2 px-2 py-0.5 bg-black/50 text-white text-xs rounded">
                                            #{index + 1}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                                <span className="material-icons text-4xl text-gray-300 dark:text-gray-600 mb-2">image</span>
                                <p className="text-body">No images uploaded for this product</p>
                            </div>
                        )}
                    </div>

                    {/* Basic Information */}
                    <div className="bg-white dark:bg-dark-card rounded-xl shadow-card p-6">
                        <h3 className="text-lg font-semibold text-heading dark:text-white mb-4">Basic Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-body mb-1">Seller</label>
                                <p className="text-heading dark:text-white">{product.seller?.shop_name || '-'}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-body mb-1">Category</label>
                                <p className="text-heading dark:text-white">{product.category?.name || '-'}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-body mb-1">Brand</label>
                                <p className="text-heading dark:text-white">{product.brand?.name || '-'}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-body mb-1">SKU</label>
                                <p className="text-heading dark:text-white font-mono">{product.sku || '-'}</p>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-body mb-1">Short Description</label>
                                <p className="text-heading dark:text-white">{product.short_description || '-'}</p>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-body mb-1">Full Description</label>
                                <p className="text-heading dark:text-white whitespace-pre-wrap">{product.description || '-'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="bg-white dark:bg-dark-card rounded-xl shadow-card p-6">
                        <h3 className="text-lg font-semibold text-heading dark:text-white mb-4">Pricing</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-body mb-1">Base Price</label>
                                <p className="text-2xl font-bold text-heading dark:text-white">{formatCurrency(product.base_price)}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-body mb-1">Source Compare Price</label>
                                <p className="text-heading dark:text-white">
                                    {product.compare_at_price_source ? (
                                        <span className="text-gray-400">{formatCurrency(product.compare_at_price_source)}</span>
                                    ) : '-'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Inventory */}
                    <div className="bg-white dark:bg-dark-card rounded-xl shadow-card p-6">
                        <h3 className="text-lg font-semibold text-heading dark:text-white mb-4">Inventory</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-body mb-1">Stock Quantity</label>
                                <p className={`text-xl font-bold ${
                                    product.stock_quantity === 0
                                        ? 'text-red-600'
                                        : product.stock_quantity <= product.low_stock_threshold
                                        ? 'text-orange-600'
                                        : 'text-green-600'
                                }`}>
                                    {product.stock_quantity} units
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-body mb-1">Low Stock Threshold</label>
                                <p className="text-heading dark:text-white">{product.low_stock_threshold} units</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-body mb-1">Barcode</label>
                                <p className="text-heading dark:text-white font-mono">{product.barcode || '-'}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-body mb-1">Inventory Settings</label>
                                <div className="flex flex-col gap-1">
                                    <span className={`text-sm ${product.track_inventory ? 'text-green-600' : 'text-gray-500'}`}>
                                        {product.track_inventory ? 'Tracking inventory' : 'Not tracking'}
                                    </span>
                                    <span className={`text-sm ${product.allow_backorders ? 'text-blue-600' : 'text-gray-500'}`}>
                                        {product.allow_backorders ? 'Backorders allowed' : 'No backorders'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Shipping */}
                    <div className="bg-white dark:bg-dark-card rounded-xl shadow-card p-6">
                        <h3 className="text-lg font-semibold text-heading dark:text-white mb-4">Shipping</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-body mb-1">Weight</label>
                                <p className="text-heading dark:text-white">{product.weight ? `${product.weight} kg` : '-'}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-body mb-1">Length</label>
                                <p className="text-heading dark:text-white">{product.length ? `${product.length} cm` : '-'}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-body mb-1">Width</label>
                                <p className="text-heading dark:text-white">{product.width ? `${product.width} cm` : '-'}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-body mb-1">Height</label>
                                <p className="text-heading dark:text-white">{product.height ? `${product.height} cm` : '-'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Meta Information */}
                    <div className="bg-white dark:bg-dark-card rounded-xl shadow-card p-6">
                        <h3 className="text-lg font-semibold text-heading dark:text-white mb-4">Meta Information</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-body mb-1">Created At</label>
                                <p className="text-heading dark:text-white">
                                    {new Date(product.created_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-body mb-1">Last Updated</label>
                                <p className="text-heading dark:text-white">
                                    {new Date(product.updated_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-body mb-1">Product ID</label>
                                <p className="text-heading dark:text-white font-mono">{product.id}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-body mb-1">Slug</label>
                                <p className="text-heading dark:text-white font-mono text-sm break-all">{product.slug || '-'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
