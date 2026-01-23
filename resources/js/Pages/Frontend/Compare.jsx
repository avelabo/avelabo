import { Head, Link, router } from '@inertiajs/react';
import FrontendLayout from '@/Layouts/FrontendLayout';
import Breadcrumb from '@/Components/Frontend/Breadcrumb';
import StarRating from '@/Components/Frontend/StarRating';
import EmptyState from '@/Components/Frontend/EmptyState';
import { useCurrency } from '@/hooks/useCurrency';
import { useToast } from '@/Contexts/ToastContext';

export default function Compare({ products = [] }) {
    const { format } = useCurrency();
    const toast = useToast();

    const breadcrumbItems = [
        { label: 'Home', href: '/' },
        { label: 'Compare Products' },
    ];

    const handleAddToCart = (product) => {
        router.post(route('cart.add'), {
            product_id: product.id,
            quantity: 1,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Product added to cart!');
            },
            onError: (errors) => {
                const errorMessage = errors?.error || errors?.product_id || 'Failed to add to cart';
                toast.error(errorMessage);
            },
        });
    };

    const handleRemoveFromCompare = (productId) => {
        router.delete(route('compare.remove', productId), {
            preserveScroll: true,
        });
    };

    return (
        <FrontendLayout>
            <Head title="Compare Products" />

            {/* Breadcrumb */}
            <div className="bg-gray-50 py-4">
                <div className="container mx-auto px-4">
                    <Breadcrumb items={breadcrumbItems} separator="slash" />
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <h1 className="text-3xl font-bold text-heading mb-8 font-quicksand">Compare Products</h1>

                {products.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr>
                                    <th className="border border-gray-200 p-4 bg-gray-50 text-left">Product</th>
                                    {products.map((product) => (
                                        <th key={product.id} className="border border-gray-200 p-4 min-w-[200px]">
                                            <div className="text-center relative">
                                                <button
                                                    onClick={() => handleRemoveFromCompare(product.id)}
                                                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                                                    title="Remove from compare"
                                                >
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                                <img
                                                    src={product.image || product.primary_image || '/images/frontend/placeholder-product.png'}
                                                    alt={product.name}
                                                    className="w-32 h-32 object-contain mx-auto mb-3"
                                                />
                                                <Link
                                                    href={`/product/${product.slug}`}
                                                    className="font-semibold text-heading hover:text-brand transition-colors"
                                                >
                                                    {product.name}
                                                </Link>
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="border border-gray-200 p-4 bg-gray-50 font-semibold">Price</td>
                                    {products.map((product) => (
                                        <td key={product.id} className="border border-gray-200 p-4 text-center">
                                            <span className="text-brand font-bold text-xl">{format(product.price)}</span>
                                            {product.compare_price && product.compare_price > product.price && (
                                                <span className="block text-gray-400 line-through text-sm mt-1">
                                                    {format(product.compare_price)}
                                                </span>
                                            )}
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="border border-gray-200 p-4 bg-gray-50 font-semibold">Availability</td>
                                    {products.map((product) => (
                                        <td key={product.id} className="border border-gray-200 p-4 text-center">
                                            <span className={`px-3 py-1 rounded-full text-sm ${product.in_stock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {product.in_stock ? 'In Stock' : 'Out of Stock'}
                                            </span>
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="border border-gray-200 p-4 bg-gray-50 font-semibold">Rating</td>
                                    {products.map((product) => (
                                        <td key={product.id} className="border border-gray-200 p-4">
                                            <div className="flex justify-center">
                                                <StarRating
                                                    rating={product.rating || 0}
                                                    reviewCount={product.reviews_count}
                                                    size="sm"
                                                />
                                            </div>
                                        </td>
                                    ))}
                                </tr>
                                {products.some(p => p.category) && (
                                    <tr>
                                        <td className="border border-gray-200 p-4 bg-gray-50 font-semibold">Category</td>
                                        {products.map((product) => (
                                            <td key={product.id} className="border border-gray-200 p-4 text-center">
                                                <span className="text-body">{product.category?.name || '-'}</span>
                                            </td>
                                        ))}
                                    </tr>
                                )}
                                {products.some(p => p.brand) && (
                                    <tr>
                                        <td className="border border-gray-200 p-4 bg-gray-50 font-semibold">Brand</td>
                                        {products.map((product) => (
                                            <td key={product.id} className="border border-gray-200 p-4 text-center">
                                                <span className="text-body">{product.brand?.name || '-'}</span>
                                            </td>
                                        ))}
                                    </tr>
                                )}
                                <tr>
                                    <td className="border border-gray-200 p-4 bg-gray-50 font-semibold">Action</td>
                                    {products.map((product) => (
                                        <td key={product.id} className="border border-gray-200 p-4 text-center">
                                            <button
                                                onClick={() => handleAddToCart(product)}
                                                disabled={!product.in_stock}
                                                className="px-6 py-2 bg-brand hover:bg-brand-dark text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Add to Cart
                                            </button>
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <EmptyState
                        icon="compare"
                        title="No Products to Compare"
                        description="Add products to your compare list to see them side by side."
                        action={{
                            label: 'Browse Products',
                            href: '/shop',
                        }}
                        className="bg-gray-50 rounded-xl"
                    />
                )}
            </div>
        </FrontendLayout>
    );
}
