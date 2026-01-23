import { Link } from '@inertiajs/react';
import StarRating from '@/Components/Frontend/StarRating';
import PriceDisplay from '@/Components/Frontend/PriceDisplay';

/**
 * ProductListItem - Horizontal product card for sidebars and lists
 *
 * @param {object} product - Product data object
 * @param {boolean} showRating - Whether to show star rating (default: true)
 * @param {boolean} showComparePrice - Whether to show compare/old price (default: true)
 * @param {string} imageSize - Image size: 'sm' | 'md' | 'lg' (default: 'md')
 * @param {string} className - Additional CSS classes
 */
export default function ProductListItem({
    product,
    showRating = true,
    showComparePrice = true,
    imageSize = 'md',
    className = '',
}) {
    if (!product) return null;

    // Image size configurations
    const imageSizes = {
        sm: 'w-16 h-16',
        md: 'w-20 h-20',
        lg: 'w-24 h-24',
    };

    const imageClass = imageSizes[imageSize] || imageSizes.md;

    // Handle image - use SVG data URI as fallback
    const placeholderSvg = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"%3E%3Crect fill="%23f3f4f6" width="80" height="80"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af" font-family="sans-serif" font-size="10"%3ENo Image%3C/text%3E%3C/svg%3E';
    const productImage = product.primary_image
        ? `/storage/${product.primary_image}`
        : product.image || placeholderSvg;

    const productUrl = product.slug ? `/product/${product.slug}` : '#';

    return (
        <div className={`flex gap-3 ${className}`}>
            {/* Product Image */}
            <Link href={productUrl} className={`${imageClass} flex-shrink-0`}>
                <img
                    src={productImage}
                    alt={product.name || 'Product'}
                    className="w-full h-full object-cover rounded-lg"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = placeholderSvg;
                    }}
                />
            </Link>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
                {/* Product Name */}
                <h6 className="font-quicksand font-semibold text-heading text-sm mb-1">
                    <Link
                        href={productUrl}
                        className="hover:text-brand line-clamp-2 transition-colors"
                    >
                        {product.name}
                    </Link>
                </h6>

                {/* Rating */}
                {showRating && product.rating > 0 && (
                    <StarRating
                        rating={product.rating}
                        reviewCount={product.reviews_count}
                        size="xs"
                        className="mb-1"
                    />
                )}

                {/* Price */}
                <PriceDisplay
                    price={product.price || product.display_price || 0}
                    comparePrice={showComparePrice ? (product.compare_price || product.old_price) : null}
                    size="sm"
                />
            </div>
        </div>
    );
}

/**
 * ProductListItemSkeleton - Loading skeleton for ProductListItem
 */
export function ProductListItemSkeleton({ imageSize = 'md' }) {
    const imageSizes = {
        sm: 'w-16 h-16',
        md: 'w-20 h-20',
        lg: 'w-24 h-24',
    };

    const imageClass = imageSizes[imageSize] || imageSizes.md;

    return (
        <div className="flex gap-3 animate-pulse">
            <div className={`${imageClass} bg-gray-200 rounded-lg flex-shrink-0`}></div>
            <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
        </div>
    );
}
