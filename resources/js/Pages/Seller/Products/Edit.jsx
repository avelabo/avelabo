import { Head, useForm, Link, router } from '@inertiajs/react';
import SellerLayout from '@/Layouts/SellerLayout';
import { useState } from 'react';

export default function ProductEdit({ product, categories }) {
    const { data, setData, post, processing, errors, progress } = useForm({
        _method: 'PUT',
        name: product.name || '',
        description: product.description || '',
        category_id: product.category_id || '',
        brand: product.brand || '',
        sku: product.sku || '',
        base_price: product.base_price || '',
        compare_price: product.compare_price || '',
        cost_price: product.cost_price || '',
        stock_quantity: product.stock_quantity || '',
        low_stock_threshold: product.low_stock_threshold || '5',
        weight: product.weight || '',
        weight_unit: product.weight_unit || 'kg',
        is_active: product.is_active ?? true,
        is_featured: product.is_featured ?? false,
        images: [],
        remove_images: [],
    });

    const [imagePreviews, setImagePreviews] = useState([]);
    const [existingImages, setExistingImages] = useState(product.images || []);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setData('images', [...data.images, ...files]);

        files.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviews((prev) => [...prev, reader.result]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeNewImage = (index) => {
        setData('images', data.images.filter((_, i) => i !== index));
        setImagePreviews(imagePreviews.filter((_, i) => i !== index));
    };

    const removeExistingImage = (imageId) => {
        setData('remove_images', [...data.remove_images, imageId]);
        setExistingImages(existingImages.filter((img) => img.id !== imageId));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('seller.products.update', product.id), {
            forceFormData: true,
        });
    };

    const handleDelete = () => {
        if (confirm(`Are you sure you want to delete "${product.name}"? This action cannot be undone.`)) {
            router.delete(route('seller.products.destroy', product.id));
        }
    };

    return (
        <SellerLayout title="Edit Product">
            <Head title={`Edit ${product.name}`} />

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Link
                        href={route('seller.products.index')}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        <span className="material-icons text-gray-500">arrow_back</span>
                    </Link>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Product</h2>
                        <p className="text-gray-500 text-sm">{product.name}</p>
                    </div>
                </div>
                <button
                    onClick={handleDelete}
                    className="inline-flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg font-medium text-sm transition-colors"
                >
                    <span className="material-icons text-lg">delete</span>
                    Delete Product
                </button>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Information */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Product Name *
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg outline-none text-sm focus:ring-2 focus:ring-brand dark:text-white"
                                        placeholder="Enter product name"
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
                                        placeholder="Describe your product..."
                                        rows={5}
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                    />
                                    {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Category *
                                        </label>
                                        <select
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg outline-none text-sm focus:ring-2 focus:ring-brand dark:text-white"
                                            value={data.category_id}
                                            onChange={(e) => setData('category_id', e.target.value)}
                                            required
                                        >
                                            <option value="">Select category</option>
                                            {categories?.map((category) => (
                                                <option key={category.id} value={category.id}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.category_id && <p className="text-red-500 text-xs mt-1">{errors.category_id}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Brand
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg outline-none text-sm focus:ring-2 focus:ring-brand dark:text-white"
                                            placeholder="Brand name"
                                            value={data.brand}
                                            onChange={(e) => setData('brand', e.target.value)}
                                        />
                                        {errors.brand && <p className="text-red-500 text-xs mt-1">{errors.brand}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        SKU (Stock Keeping Unit)
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg outline-none text-sm focus:ring-2 focus:ring-brand dark:text-white"
                                        placeholder="e.g., PROD-001"
                                        value={data.sku}
                                        onChange={(e) => setData('sku', e.target.value)}
                                    />
                                    {errors.sku && <p className="text-red-500 text-xs mt-1">{errors.sku}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Product Images */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Product Images</h3>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                {/* Existing Images */}
                                {existingImages.map((image, index) => (
                                    <div key={image.id} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                                        <img
                                            src={image.url}
                                            alt={`Product ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeExistingImage(image.id)}
                                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                        >
                                            <span className="material-icons text-sm">close</span>
                                        </button>
                                        {image.is_primary && (
                                            <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-brand text-white text-xs rounded">
                                                Primary
                                            </span>
                                        )}
                                    </div>
                                ))}

                                {/* New Image Previews */}
                                {imagePreviews.map((preview, index) => (
                                    <div key={`new-${index}`} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                                        <img
                                            src={preview}
                                            alt={`New ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeNewImage(index)}
                                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                        >
                                            <span className="material-icons text-sm">close</span>
                                        </button>
                                        <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-blue-500 text-white text-xs rounded">
                                            New
                                        </span>
                                    </div>
                                ))}

                                <label className="aspect-square border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-brand transition-colors">
                                    <span className="material-icons text-3xl text-gray-400">add_photo_alternate</span>
                                    <span className="text-sm text-gray-500 mt-2">Add Image</span>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageChange}
                                    />
                                </label>
                            </div>

                            {errors.images && <p className="text-red-500 text-xs">{errors.images}</p>}
                            <p className="text-xs text-gray-500">First image will be used as primary. Recommended size: 800x800px</p>
                        </div>

                        {/* Pricing */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Pricing</h3>

                            <div className="grid md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Base Price (MWK) *
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg outline-none text-sm focus:ring-2 focus:ring-brand dark:text-white"
                                        placeholder="0.00"
                                        value={data.base_price}
                                        onChange={(e) => setData('base_price', e.target.value)}
                                        required
                                    />
                                    {errors.base_price && <p className="text-red-500 text-xs mt-1">{errors.base_price}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Compare Price (MWK)
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg outline-none text-sm focus:ring-2 focus:ring-brand dark:text-white"
                                        placeholder="Original price for strikethrough"
                                        value={data.compare_price}
                                        onChange={(e) => setData('compare_price', e.target.value)}
                                    />
                                    {errors.compare_price && <p className="text-red-500 text-xs mt-1">{errors.compare_price}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Cost Price (MWK)
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg outline-none text-sm focus:ring-2 focus:ring-brand dark:text-white"
                                        placeholder="Your cost (not shown to customers)"
                                        value={data.cost_price}
                                        onChange={(e) => setData('cost_price', e.target.value)}
                                    />
                                    {errors.cost_price && <p className="text-red-500 text-xs mt-1">{errors.cost_price}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Inventory */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Inventory</h3>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Stock Quantity *
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg outline-none text-sm focus:ring-2 focus:ring-brand dark:text-white"
                                        placeholder="Available quantity"
                                        value={data.stock_quantity}
                                        onChange={(e) => setData('stock_quantity', e.target.value)}
                                        required
                                    />
                                    {errors.stock_quantity && <p className="text-red-500 text-xs mt-1">{errors.stock_quantity}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Low Stock Threshold
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg outline-none text-sm focus:ring-2 focus:ring-brand dark:text-white"
                                        placeholder="Alert when stock falls below"
                                        value={data.low_stock_threshold}
                                        onChange={(e) => setData('low_stock_threshold', e.target.value)}
                                    />
                                    {errors.low_stock_threshold && <p className="text-red-500 text-xs mt-1">{errors.low_stock_threshold}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Shipping */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Shipping</h3>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Weight
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg outline-none text-sm focus:ring-2 focus:ring-brand dark:text-white"
                                        placeholder="Product weight"
                                        value={data.weight}
                                        onChange={(e) => setData('weight', e.target.value)}
                                    />
                                    {errors.weight && <p className="text-red-500 text-xs mt-1">{errors.weight}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Weight Unit
                                    </label>
                                    <select
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg outline-none text-sm focus:ring-2 focus:ring-brand dark:text-white"
                                        value={data.weight_unit}
                                        onChange={(e) => setData('weight_unit', e.target.value)}
                                    >
                                        <option value="kg">Kilograms (kg)</option>
                                        <option value="g">Grams (g)</option>
                                        <option value="lb">Pounds (lb)</option>
                                    </select>
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
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.is_active}
                                        onChange={(e) => setData('is_active', e.target.checked)}
                                        className="w-5 h-5 text-brand rounded focus:ring-brand"
                                    />
                                    <div>
                                        <span className="block text-sm font-medium text-gray-900 dark:text-white">Active</span>
                                        <span className="text-xs text-gray-500">Product is visible to customers</span>
                                    </div>
                                </label>

                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.is_featured}
                                        onChange={(e) => setData('is_featured', e.target.checked)}
                                        className="w-5 h-5 text-brand rounded focus:ring-brand"
                                    />
                                    <div>
                                        <span className="block text-sm font-medium text-gray-900 dark:text-white">Featured</span>
                                        <span className="text-xs text-gray-500">Show in featured section</span>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Product Info</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Created</span>
                                    <span className="text-gray-900 dark:text-white">
                                        {new Date(product.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Last Updated</span>
                                    <span className="text-gray-900 dark:text-white">
                                        {new Date(product.updated_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Total Sales</span>
                                    <span className="text-gray-900 dark:text-white">{product.total_sales || 0}</span>
                                </div>
                            </div>
                        </div>

                        {/* Upload Progress */}
                        {progress && (
                            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
                                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Uploading...</h3>
                                <div className="bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-brand h-2 rounded-full transition-all"
                                        style={{ width: `${progress.percentage}%` }}
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">{progress.percentage}% complete</p>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
                            <button
                                type="submit"
                                className="w-full py-3 bg-brand hover:bg-brand-dark text-white rounded-lg font-medium text-sm transition-colors disabled:opacity-50"
                                disabled={processing}
                            >
                                {processing ? 'Saving Changes...' : 'Save Changes'}
                            </button>
                            <Link
                                href={route('seller.products.index')}
                                className="block w-full py-3 mt-3 text-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium text-sm transition-colors"
                            >
                                Cancel
                            </Link>
                        </div>
                    </div>
                </div>
            </form>
        </SellerLayout>
    );
}
