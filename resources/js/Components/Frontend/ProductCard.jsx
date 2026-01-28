import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { useToast } from '@/Contexts/ToastContext';
import { useCurrency } from '@/hooks/useCurrency';
import StarRating from '@/Components/Frontend/StarRating';

export default function ProductCard({ product, variant = 'default', className = '' }) {
    const { format } = useCurrency();
    const toast = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const handleAddToBasket = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsLoading(true);

        router.post(route('cart.add'), {
            product_id: product.id,
            quantity: 1,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setIsLoading(false);
                toast.success('Added to basket!');
            },
            onError: (errors) => {
                setIsLoading(false);
                const errorMessage = errors?.error || errors?.product_id || 'Failed to add to basket';
                toast.error(errorMessage);
            },
        });
    };

    const handleAddToWishlist = (e) => {
        e.preventDefault();
        e.stopPropagation();

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

    const {
        id,
        name = '',
        slug = '',
        primary_image,
        category,
        seller,
        rating = 0,
        reviews_count = 0,
        price = 0,
        compare_price,
        is_in_stock = true,
        is_new = false,
        is_featured = false,
    } = product || {};

    // Handle category - could be string or object
    const categoryName = typeof category === 'object' ? category?.name : category || null;
    const categorySlug = typeof category === 'object' ? category?.slug : null;

    // Handle seller/brand - could be string or object
    const brandName = typeof seller === 'object' ? (seller?.display_name || seller?.shop_name) : (seller || null);

    // Handle image - use SVG data URI as final fallback to prevent infinite loops
    const placeholderSvg = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"%3E%3Crect fill="%23f5f5f5" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23999" font-family="sans-serif" font-size="12"%3ENo Image%3C/text%3E%3C/svg%3E';
    const productImage = imageError ? placeholderSvg : (primary_image || placeholderSvg);

    // Calculate discount
    const hasDiscount = compare_price && compare_price > price;
    const discountPercent = hasDiscount
        ? Math.round(((compare_price - price) / compare_price) * 100)
        : 0;

    return (
        <div
            className={`group bg-surface border border-border-light rounded-xl overflow-hidden transition-all hover:border-border hover:shadow-product-hover ${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Product Image */}
            <Link href={`/product/${slug}`}>
                <div className="relative aspect-square bg-surface-raised overflow-hidden">
                    {/* Badges */}
                    <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
                        {hasDiscount && (
                            <span className="bg-danger text-white text-[10px] font-bold px-2 py-1 rounded">
                                -{discountPercent}%
                            </span>
                        )}
                        {is_new && (
                            <span className="bg-brand text-white text-[10px] font-bold px-2 py-1 rounded">
                                NEW
                            </span>
                        )}
                        {is_featured && (
                            <span className="bg-brand-2 text-brand-dark text-[10px] font-bold px-2 py-1 rounded">
                                HOT
                            </span>
                        )}
                    </div>

                    {/* Quick Actions */}
                    <div className={`absolute top-3 right-3 z-10 flex flex-col gap-2 transition-all duration-200 ${
                        isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
                    }`}>
                        <button
                            onClick={handleAddToWishlist}
                            className="w-8 h-8 bg-surface rounded-lg shadow-sm flex items-center justify-center text-body hover:text-danger hover:bg-surface transition-colors"
                            title="Add to Wishlist"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </button>
                    </div>

                    {/* Image */}
                    <img
                        src={productImage}
                        alt={name}
                        className="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                        onError={() => !imageError && setImageError(true)}
                    />

                    {/* Out of Stock Overlay */}
                    {!is_in_stock && (
                        <div className="absolute inset-0 bg-surface/80 flex items-center justify-center">
                            <span className="bg-muted text-white text-xs font-semibold px-3 py-1.5 rounded">
                                Out of Stock
                            </span>
                        </div>
                    )}
                </div>
            </Link>

            {/* Product Info */}
            <div className="p-4">
                {/* Category */}
                {categoryName && (
                    <Link
                        href={categorySlug ? route('shop', { category: categorySlug }) : '#'}
                        className="text-[11px] text-muted hover:text-brand transition-colors uppercase tracking-wider"
                    >
                        {categoryName}
                    </Link>
                )}

                {/* Product Name */}
                <Link href={`/product/${slug}`}>
                    <h3 className="text-sm font-semibold text-heading mt-1 mb-2 line-clamp-2 hover:text-brand-2 transition-colors" title={name}>
                        {name}
                    </h3>
                </Link>

                {/* Rating */}
                {rating > 0 && (
                    <div className="flex items-center gap-1.5 mb-2">
                        <StarRating rating={rating} size="sm" showCount={false} />
                        <span className="text-[11px] text-muted">
                            ({reviews_count})
                        </span>
                    </div>
                )}

                {/* Vendor */}
                {brandName && (
                    <p className="text-[11px] text-muted mb-3">
                        By <span className="text-brand">{brandName}</span>
                    </p>
                )}

                {/* Price & Add to Basket */}
                <div className="flex items-center justify-between gap-2 mt-auto">
                    <div className="flex flex-col">
                        <span className="text-base font-bold text-heading">
                            {format(price)}
                        </span>
                        {hasDiscount && (
                            <span className="text-xs text-muted line-through">
                                {format(compare_price)}
                            </span>
                        )}
                    </div>

                    {is_in_stock && (
                        <button
                            onClick={handleAddToBasket}
                            disabled={isLoading}
                            className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all ${
                                isLoading
                                    ? 'bg-surface-raised text-muted cursor-wait'
                                    : 'bg-brand text-white hover:bg-brand-dark shadow-button hover:shadow-button-hover'
                            }`}
                            title="Add to Basket"
                        >
                            {isLoading ? (
                                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
