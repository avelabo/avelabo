import { useState } from 'react';
import { Link, Head, router } from '@inertiajs/react';
import FrontendLayout from '@/Layouts/FrontendLayout';
import { useToast } from '@/Contexts/ToastContext';
import { useCurrency } from '@/hooks/useCurrency';
import Breadcrumb from '@/Components/Frontend/Breadcrumb';
import StarRating from '@/Components/Frontend/StarRating';
import Badge from '@/Components/Frontend/Badge';
import PriceDisplay from '@/Components/Frontend/PriceDisplay';
import ProductCard from '@/Components/Frontend/ProductCard';

export default function ProductDetail({ product, relatedProducts }) {
    const { format } = useCurrency();
    const toast = useToast();
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [activeTab, setActiveTab] = useState('description');
    const [addingToBasket, setAddingToBasket] = useState(false);

    const breadcrumbItems = [
        { label: 'Home', href: '/' },
        { label: 'Shop', href: route('shop') },
        ...(product.category ? [{ label: product.category.name, href: route('shop', { category: product.category.slug }) }] : []),
        { label: product.name },
    ];

    const getCurrentPrice = () => {
        if (selectedVariant) {
            return selectedVariant.price;
        }
        return product.price;
    };

    const getComparePrice = () => {
        return product.compare_price;
    };

    const isInStock = () => {
        if (selectedVariant) {
            return selectedVariant.is_in_stock;
        }
        return product.is_in_stock;
    };

    const handleQuantityChange = (delta) => {
        const newQty = quantity + delta;
        if (newQty >= 1 && newQty <= (product.stock_quantity || 99)) {
            setQuantity(newQty);
        }
    };

    const handleVariantSelect = (variant) => {
        setSelectedVariant(variant);
    };

    const addToBasket = () => {
        if (addingToBasket) return;

        if (product.variants?.length > 0 && !selectedVariant) {
            toast.error('Please select an option');
            return;
        }

        setAddingToBasket(true);

        router.post(route('cart.add'), {
            product_id: product.id,
            quantity: quantity,
            variant_id: selectedVariant?.id || null,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Added to basket!');
            },
            onError: (errors) => {
                const errorMessage = errors?.error || errors?.product_id || 'Failed to add to basket';
                toast.error(errorMessage);
            },
            onFinish: () => {
                setAddingToBasket(false);
            },
        });
    };

    const addToWishlist = () => {
        router.post(route('wishlist.add'), {
            product_id: product.id,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Added to wishlist!');
            },
            onError: () => {
                toast.error('Failed to add to wishlist');
            },
        });
    };

    const images = product.images?.length > 0
        ? product.images
        : [{ id: 0, url: null, alt: product.name }];

    // Parse specifications from product data
    const specifications = [];
    if (product.sku) specifications.push({ label: 'SKU', value: product.sku });
    if (product.brand?.name) specifications.push({ label: 'Brand', value: product.brand.name });
    if (product.category?.name) specifications.push({ label: 'Category', value: product.category.name });
    if (product.weight) specifications.push({ label: 'Weight', value: `${product.weight} kg` });
    if (product.dimensions) specifications.push({ label: 'Dimensions', value: product.dimensions });

    return (
        <FrontendLayout>
            <Head title={product.name} />

            {/* Breadcrumb */}
            <div className="border-b border-border-light">
                <div className="container mx-auto px-4 py-4">
                    <Breadcrumb items={breadcrumbItems} separator="chevron" />
                </div>
            </div>

            {/* Product Main Section */}
            <section className="py-8 lg:py-12">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                        {/* Product Gallery */}
                        <div className="lg:w-1/2">
                            <div className="sticky top-24">
                                {/* Main Image */}
                                <div className="relative bg-surface-raised rounded-xl overflow-hidden mb-4 aspect-square">
                                    {/* Badges */}
                                    <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                                        {product.is_on_sale && (
                                            <span className="bg-danger text-white text-xs font-semibold px-3 py-1.5 rounded-md">
                                                -{product.discount_percentage}%
                                            </span>
                                        )}
                                        {product.is_new && (
                                            <span className="bg-brand text-white text-xs font-semibold px-3 py-1.5 rounded-md">
                                                NEW
                                            </span>
                                        )}
                                    </div>

                                    {images[selectedImage]?.url ? (
                                        <img
                                            src={images[selectedImage].url}
                                            alt={images[selectedImage].alt || product.name}
                                            className="w-full h-full object-contain p-4"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-surface-sunken flex items-center justify-center">
                                            <svg className="w-24 h-24 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    )}
                                </div>

                                {/* Thumbnail Gallery */}
                                {images.length > 1 && (
                                    <div className="flex gap-3 overflow-x-auto pb-2">
                                        {images.map((image, index) => (
                                            <button
                                                key={image.id}
                                                onClick={() => setSelectedImage(index)}
                                                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                                                    selectedImage === index
                                                        ? 'border-brand ring-2 ring-brand/20'
                                                        : 'border-border-light hover:border-border'
                                                }`}
                                            >
                                                {image.url ? (
                                                    <img src={image.url} alt={image.alt} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full bg-surface-sunken flex items-center justify-center">
                                                        <svg className="w-6 h-6 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="lg:w-1/2">
                            {/* Category & Brand */}
                            <div className="flex items-center gap-2 text-sm text-muted mb-3">
                                {product.category && (
                                    <Link
                                        href={route('shop', { category: product.category.slug })}
                                        className="hover:text-brand transition-colors"
                                    >
                                        {product.category.name}
                                    </Link>
                                )}
                                {product.category && product.brand && <span>/</span>}
                                {product.brand && (
                                    <span className="font-medium text-[#2a2a2a]">{product.brand.name}</span>
                                )}
                            </div>

                            {/* Product Name */}
                            <h1 className="text-2xl lg:text-3xl font-bold text-heading mb-4 leading-tight">
                                {product.name}
                            </h1>

                            {/* Rating */}
                            {product.rating > 0 && (
                                <div className="flex items-center gap-3 mb-5">
                                    <StarRating rating={product.rating} size="md" />
                                    <span className="text-sm text-muted">
                                        ({product.reviews_count || 0} reviews)
                                    </span>
                                </div>
                            )}

                            {/* Price */}
                            <div className="flex items-baseline gap-3 mb-6">
                                <span className="text-3xl font-bold text-heading">
                                    {format(getCurrentPrice())}
                                </span>
                                {getComparePrice() && getComparePrice() > getCurrentPrice() && (
                                    <span className="text-lg text-muted line-through">
                                        {format(getComparePrice())}
                                    </span>
                                )}
                            </div>

                            {/* Short Description */}
                            {product.short_description && (
                                <p className="text-body leading-relaxed mb-6">
                                    {product.short_description}
                                </p>
                            )}

                            {/* Divider */}
                            <div className="border-t border-border-light my-6"></div>

                            {/* Stock Status */}
                            <div className="flex items-center gap-4 mb-6">
                                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
                                    isInStock()
                                        ? product.is_low_stock
                                            ? 'bg-warning-light text-warning'
                                            : 'bg-success-light text-success'
                                        : 'bg-danger-light text-danger'
                                }`}>
                                    {isInStock() ? (
                                        <>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            {product.is_low_stock ? 'Low Stock' : 'In Stock'}
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                            Out of Stock
                                        </>
                                    )}
                                </div>
                                {isInStock() && product.stock_quantity && (
                                    <span className="text-sm text-muted">
                                        {product.stock_quantity} units available
                                    </span>
                                )}
                            </div>

                            {/* Variants */}
                            {product.variants?.length > 0 && (
                                <div className="mb-6">
                                    <label className="block text-sm font-semibold text-heading mb-3">
                                        Select Option
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {product.variants.map((variant) => (
                                            <button
                                                key={variant.id}
                                                onClick={() => handleVariantSelect(variant)}
                                                disabled={!variant.is_in_stock}
                                                className={`px-4 py-2.5 text-sm font-medium rounded-lg border-2 transition-all ${
                                                    selectedVariant?.id === variant.id
                                                        ? 'border-brand bg-brand text-white'
                                                        : variant.is_in_stock
                                                        ? 'border-border hover:border-brand text-heading'
                                                        : 'border-border-light text-muted cursor-not-allowed line-through'
                                                }`}
                                            >
                                                {variant.attributes?.map(attr => attr.value).join(' / ')}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Quantity & Actions */}
                            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                                {/* Quantity Selector */}
                                <div className="flex items-center border border-border rounded-lg overflow-hidden">
                                    <button
                                        onClick={() => handleQuantityChange(-1)}
                                        disabled={quantity <= 1}
                                        className="w-12 h-12 flex items-center justify-center text-heading hover:bg-surface-raised transition-colors disabled:opacity-40"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                        </svg>
                                    </button>
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                        className="w-16 h-12 text-center border-x border-border outline-none text-heading font-semibold"
                                    />
                                    <button
                                        onClick={() => handleQuantityChange(1)}
                                        className="w-12 h-12 flex items-center justify-center text-heading hover:bg-surface-raised transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Add to Cart Button */}
                                <button
                                    onClick={addToBasket}
                                    disabled={!isInStock() || addingToBasket}
                                    className="flex-1 flex items-center justify-center gap-2 bg-brand hover:bg-brand-dark text-white px-8 py-3.5 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-button hover:shadow-button-hover"
                                >
                                    {addingToBasket ? (
                                        <>
                                            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Adding...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                            </svg>
                                            Add to Basket
                                        </>
                                    )}
                                </button>

                                {/* Wishlist Button */}
                                <button
                                    onClick={addToWishlist}
                                    className="w-12 h-12 flex items-center justify-center border border-border rounded-lg hover:border-brand hover:text-brand transition-all text-heading"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </button>
                            </div>

                            {/* Trust Badges */}
                            <div className="flex flex-wrap gap-4 py-5 border-t border-b border-border-light mb-6">
                                <div className="flex items-center gap-2 text-sm text-body">
                                    <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Free Shipping
                                </div>
                                <div className="flex items-center gap-2 text-sm text-body">
                                    <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                    Secure Payment
                                </div>
                                <div className="flex items-center gap-2 text-sm text-body">
                                    <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Easy Returns
                                </div>
                            </div>

                            {/* Seller Info */}
                            {product.seller && (
                                <div className="bg-surface-raised rounded-xl p-5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-brand rounded-lg flex items-center justify-center text-white font-bold text-lg">
                                            {product.seller.shop_name?.charAt(0) || 'S'}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-muted">Sold by</p>
                                            <p className="font-semibold text-heading">{product.seller.shop_name || product.seller.name}</p>
                                        </div>
                                        <Link
                                            href={route('vendor.details', product.seller.slug || product.seller.id)}
                                            className="text-sm font-medium text-brand hover:text-brand-dark transition-colors"
                                        >
                                            View Store
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Product Details Tabs */}
            <section className="py-8 lg:py-12 bg-surface-raised">
                <div className="container mx-auto px-4">
                    {/* Tab Navigation */}
                    <div className="flex gap-1 border-b border-border mb-8 overflow-x-auto">
                        {['description', 'specifications', 'reviews'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-4 text-sm font-semibold whitespace-nowrap transition-colors border-b-2 -mb-px ${
                                    activeTab === tab
                                        ? 'text-brand border-brand'
                                        : 'text-muted border-transparent hover:text-heading'
                                }`}
                            >
                                {tab === 'description' && 'Description'}
                                {tab === 'specifications' && 'Specifications'}
                                {tab === 'reviews' && `Reviews (${product.reviews_count || 0})`}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="bg-surface rounded-xl p-6 lg:p-8">
                        {/* Description Tab */}
                        {activeTab === 'description' && (
                            <div className="prose prose-gray max-w-none">
                                {product.description ? (
                                    <div
                                        className="text-body leading-relaxed"
                                        dangerouslySetInnerHTML={{ __html: product.description.replace(/\n/g, '<br>') }}
                                    />
                                ) : (
                                    <p className="text-muted">No description available for this product.</p>
                                )}
                            </div>
                        )}

                        {/* Specifications Tab */}
                        {activeTab === 'specifications' && (
                            <div>
                                {specifications.length > 0 ? (
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {specifications.map((spec, index) => (
                                            <div
                                                key={index}
                                                className="flex justify-between py-3 px-4 bg-surface-raised rounded-lg"
                                            >
                                                <span className="text-muted">{spec.label}</span>
                                                <span className="font-medium text-heading">{spec.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-muted text-center py-8">
                                        No specifications available for this product.
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Reviews Tab */}
                        {activeTab === 'reviews' && (
                            <div>
                                {product.reviews?.length > 0 ? (
                                    <div className="space-y-6">
                                        {product.reviews.map((review) => (
                                            <div key={review.id} className="pb-6 border-b border-border-light last:border-0">
                                                <div className="flex items-start gap-4">
                                                    <div className="w-10 h-10 bg-surface-raised rounded-full flex items-center justify-center flex-shrink-0">
                                                        <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                        </svg>
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <div>
                                                                <p className="font-semibold text-heading">{review.user_name}</p>
                                                                <p className="text-xs text-muted">{review.created_at}</p>
                                                            </div>
                                                            <StarRating rating={review.rating} size="sm" />
                                                        </div>
                                                        {review.title && (
                                                            <p className="font-medium text-heading mb-2">{review.title}</p>
                                                        )}
                                                        {review.comment && (
                                                            <p className="text-body">{review.comment}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <svg className="w-16 h-16 text-muted mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                        <p className="text-muted mb-2">No reviews yet</p>
                                        <p className="text-sm text-subtle">Be the first to review this product!</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Related Products */}
            {relatedProducts?.length > 0 && (
                <section className="py-12 lg:py-16">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-heading">Related Products</h2>
                            <Link
                                href={route('shop', product.category ? { category: product.category.slug } : {})}
                                className="text-sm font-medium text-brand hover:text-brand-dark transition-colors flex items-center gap-1"
                            >
                                View All
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
                            {relatedProducts.slice(0, 5).map((item) => (
                                <ProductCard key={item.id} product={item} />
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </FrontendLayout>
    );
}
