/**
 * StarRating - Reusable star rating display component
 *
 * @param {number} rating - Rating value from 0-5
 * @param {number} reviewCount - Number of reviews (optional)
 * @param {string} size - Size variant: 'xs' | 'sm' | 'md' | 'lg' (default: 'sm')
 * @param {boolean} showEmpty - Whether to show empty stars (default: true)
 * @param {string} className - Additional CSS classes
 */
export default function StarRating({
    rating = 0,
    reviewCount = null,
    size = 'sm',
    showEmpty = true,
    className = '',
}) {
    // Clamp rating between 0 and 5
    const clampedRating = Math.min(5, Math.max(0, rating));

    // Size mappings
    const sizeClasses = {
        xs: 'w-3 h-3',
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6',
    };

    const textSizeClasses = {
        xs: 'text-xs',
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
    };

    const starSize = sizeClasses[size] || sizeClasses.sm;
    const textSize = textSizeClasses[size] || textSizeClasses.sm;

    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            const isFilled = i <= clampedRating;
            const isHalfFilled = !isFilled && i - 0.5 <= clampedRating;

            if (!showEmpty && !isFilled && !isHalfFilled) {
                continue;
            }

            stars.push(
                <svg
                    key={i}
                    className={`${starSize} ${isFilled ? 'text-brand-2' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            );
        }
        return stars;
    };

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <div className="flex">{renderStars()}</div>
            {reviewCount !== null && (
                <span className={`text-body ${textSize}`}>({reviewCount})</span>
            )}
        </div>
    );
}
