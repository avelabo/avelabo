import ProductCard from '@/Components/Frontend/ProductCard';
import EmptyState from '@/Components/Frontend/EmptyState';

/**
 * ProductGrid - Responsive product grid with built-in empty state
 *
 * @param {Array} products - Array of product objects
 * @param {number} columns - Number of columns on desktop: 2 | 3 | 4 | 5 (default: 4)
 * @param {object} emptyState - EmptyState props: { icon, title, description, action }
 * @param {boolean} loading - Whether to show loading skeletons
 * @param {number} skeletonCount - Number of skeleton items to show when loading (default: 8)
 * @param {string} className - Additional CSS classes
 */
export default function ProductGrid({
    products = [],
    columns = 4,
    emptyState = null,
    loading = false,
    skeletonCount = 8,
    className = '',
}) {
    // Column configuration for different breakpoints
    const columnClasses = {
        2: 'grid-cols-1 sm:grid-cols-2',
        3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-2 md:grid-cols-3 xl:grid-cols-4',
        5: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
    };

    const gridClass = columnClasses[columns] || columnClasses[4];

    // Loading state
    if (loading) {
        return (
            <div className={`grid ${gridClass} gap-4 md:gap-6 ${className}`}>
                {Array.from({ length: skeletonCount }).map((_, index) => (
                    <ProductCardSkeleton key={index} />
                ))}
            </div>
        );
    }

    // Empty state
    if (!products || products.length === 0) {
        const defaultEmptyState = {
            icon: 'box',
            title: 'No products found',
            description: 'Try adjusting your filters or search terms',
            ...emptyState,
        };

        return (
            <EmptyState
                icon={defaultEmptyState.icon}
                title={defaultEmptyState.title}
                description={defaultEmptyState.description}
                action={defaultEmptyState.action}
            />
        );
    }

    // Product grid
    return (
        <div className={`grid ${gridClass} gap-4 md:gap-6 ${className}`}>
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
}

/**
 * ProductCardSkeleton - Loading skeleton for ProductCard
 */
export function ProductCardSkeleton() {
    return (
        <div className="bg-white border border-gray-100 rounded-xl p-4 animate-pulse">
            {/* Image skeleton */}
            <div className="w-full aspect-square bg-gray-200 rounded-lg mb-4"></div>

            {/* Category skeleton */}
            <div className="h-3 bg-gray-200 rounded w-1/3 mb-2"></div>

            {/* Title skeleton */}
            <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-3"></div>

            {/* Rating skeleton */}
            <div className="flex items-center gap-2 mb-3">
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="w-4 h-4 bg-gray-200 rounded"></div>
                    ))}
                </div>
                <div className="h-3 bg-gray-200 rounded w-8"></div>
            </div>

            {/* Vendor skeleton */}
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>

            {/* Price skeleton */}
            <div className="h-5 bg-gray-200 rounded w-1/3 mb-3"></div>

            {/* Button skeleton */}
            <div className="h-10 bg-gray-200 rounded w-full"></div>
        </div>
    );
}

/**
 * ProductSection - Titled section with product grid
 */
export function ProductSection({
    title,
    subtitle = null,
    products = [],
    columns = 4,
    viewAllHref = null,
    emptyState = null,
    loading = false,
    className = '',
    children,
}) {
    return (
        <section className={className}>
            {/* Section Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-quicksand font-bold text-heading">
                        {title}
                    </h2>
                    {subtitle && (
                        <p className="text-body mt-1">{subtitle}</p>
                    )}
                </div>
                {viewAllHref && (
                    <a
                        href={viewAllHref}
                        className="text-brand hover:text-brand-dark font-semibold flex items-center gap-1 transition-colors"
                    >
                        View All
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </a>
                )}
            </div>

            {/* Product Grid or Custom Content */}
            {children || (
                <ProductGrid
                    products={products}
                    columns={columns}
                    emptyState={emptyState}
                    loading={loading}
                />
            )}
        </section>
    );
}
