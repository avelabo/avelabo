/**
 * Badge - Reusable badge/tag component for products and status indicators
 *
 * @param {string} variant - Badge type: 'hot' | 'new' | 'sale' | 'best' | 'featured' | 'success' | 'warning' | 'danger' | 'info'
 * @param {string} size - Size variant: 'xs' | 'sm' | 'md' (default: 'sm')
 * @param {boolean} soft - Whether to use soft/light style (default: false)
 * @param {boolean} rounded - Whether to use fully rounded style (default: false)
 * @param {string} className - Additional CSS classes
 * @param {React.ReactNode} children - Badge content
 */
export default function Badge({
    variant = 'new',
    size = 'sm',
    soft = false,
    rounded = false,
    className = '',
    children,
}) {
    // Product badge variants (use CSS classes from app.css)
    const productVariants = ['hot', 'new', 'sale', 'best'];

    // Status badge variants
    const statusVariantClasses = {
        success: soft ? 'badge-soft-success' : 'bg-success text-white',
        warning: soft ? 'badge-soft-warning' : 'bg-warning text-heading',
        danger: soft ? 'badge-soft-danger' : 'bg-danger text-white',
        info: soft ? 'badge-soft-info' : 'bg-info text-white',
        primary: soft ? 'badge-soft-primary' : 'bg-brand text-white',
        featured: 'badge-hot', // Featured uses hot styling
    };

    // Size classes
    const sizeClasses = {
        xs: 'px-2 py-0.5 text-[10px]',
        sm: 'px-3 py-1 text-xs',
        md: 'px-4 py-1.5 text-sm',
    };

    // Determine the appropriate classes
    let variantClass = '';
    if (productVariants.includes(variant)) {
        variantClass = `badge-${variant}`;
    } else {
        variantClass = statusVariantClasses[variant] || statusVariantClasses.primary;
    }

    const baseClasses = [
        'inline-flex items-center justify-center font-semibold',
        sizeClasses[size] || sizeClasses.sm,
        rounded ? 'rounded-full' : 'rounded',
        variantClass,
        className,
    ].filter(Boolean).join(' ');

    return (
        <span className={baseClasses}>
            {children || (variant.charAt(0).toUpperCase() + variant.slice(1))}
        </span>
    );
}

/**
 * Helper function to determine badge variant from product attributes
 */
export function getProductBadgeVariant(product) {
    if (product?.badge) return product.badge;
    if (product?.is_featured) return 'hot';
    if (product?.is_new) return 'new';
    if (product?.is_on_sale) return 'sale';
    return null;
}
