import { useCurrency } from '@/hooks/useCurrency';

/**
 * PriceDisplay - Reusable price display component with currency formatting
 *
 * @param {number} price - Main price to display
 * @param {number} comparePrice - Original/compare price (optional, shows as strikethrough)
 * @param {string} size - Size variant: 'xs' | 'sm' | 'md' | 'lg' | 'xl' (default: 'md')
 * @param {boolean} showCurrency - Whether to show currency symbol (default: true, handled by formatter)
 * @param {boolean} truncate - Whether to truncate long prices (default: false)
 * @param {number} truncateLength - Max characters before truncating (default: 8)
 * @param {string} className - Additional CSS classes
 */
export default function PriceDisplay({
    price,
    comparePrice = null,
    size = 'md',
    truncate = false,
    truncateLength = 8,
    className = '',
}) {
    const { format } = useCurrency();

    // Size classes for main price
    const sizeClasses = {
        xs: 'text-sm',
        sm: 'text-base',
        md: 'text-lg',
        lg: 'text-xl',
        xl: 'text-2xl',
    };

    // Size classes for compare price
    const compareSizeClasses = {
        xs: 'text-xs',
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
        xl: 'text-lg',
    };

    const mainSizeClass = sizeClasses[size] || sizeClasses.md;
    const compareSizeClass = compareSizeClasses[size] || compareSizeClasses.md;

    // Truncate helper
    const truncateText = (text) => {
        if (!truncate || !text) return text;
        const str = String(text);
        return str.length > truncateLength ? str.substring(0, truncateLength) + '...' : str;
    };

    const formattedPrice = format(price);
    const formattedComparePrice = comparePrice ? format(comparePrice) : null;
    const showCompare = comparePrice && comparePrice > price;

    return (
        <div className={`flex items-center flex-wrap gap-x-2 ${className}`}>
            <span className={`text-brand font-bold ${mainSizeClass}`}>
                {formattedPrice}
            </span>
            {showCompare && (
                <span
                    className={`text-body line-through ${compareSizeClass}`}
                    title={formattedComparePrice}
                >
                    {truncate ? truncateText(formattedComparePrice) : formattedComparePrice}
                </span>
            )}
        </div>
    );
}

/**
 * InlinePrice - Simpler inline price component for use in text
 */
export function InlinePrice({ price, className = '' }) {
    const { format } = useCurrency();

    return (
        <span className={`text-brand font-bold ${className}`}>
            {format(price)}
        </span>
    );
}
