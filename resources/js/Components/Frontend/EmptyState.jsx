import { Link } from '@inertiajs/react';

/**
 * EmptyState - Reusable empty state component
 *
 * @param {string} icon - Icon preset: 'cart' | 'heart' | 'box' | 'shop' | 'orders' | 'compare' | 'search' | 'users' | 'custom'
 * @param {React.ReactNode} customIcon - Custom icon element (used when icon='custom')
 * @param {string} title - Main heading text
 * @param {string} description - Descriptive text below title
 * @param {object} action - CTA button config: { label, href?, onClick? }
 * @param {string} size - Size variant: 'sm' | 'md' | 'lg' (default: 'md')
 * @param {string} className - Additional CSS classes
 */
export default function EmptyState({
    icon = 'box',
    customIcon = null,
    title = 'Nothing here yet',
    description = '',
    action = null,
    size = 'md',
    className = '',
}) {
    // Size configurations
    const sizeConfig = {
        sm: {
            container: 'py-8',
            iconSize: 'w-12 h-12 text-4xl',
            titleSize: 'text-lg',
            descSize: 'text-sm',
            buttonSize: 'px-4 py-2 text-sm',
        },
        md: {
            container: 'py-12',
            iconSize: 'w-16 h-16 text-5xl',
            titleSize: 'text-xl',
            descSize: 'text-base',
            buttonSize: 'px-6 py-3 text-sm',
        },
        lg: {
            container: 'py-16',
            iconSize: 'w-20 h-20 text-6xl',
            titleSize: 'text-2xl',
            descSize: 'text-lg',
            buttonSize: 'px-8 py-4 text-base',
        },
    };

    const config = sizeConfig[size] || sizeConfig.md;

    // Icon components
    const icons = {
        cart: (
            <svg className={`${config.iconSize} text-gray-300`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
        ),
        heart: (
            <svg className={`${config.iconSize} text-gray-300`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
        ),
        box: (
            <svg className={`${config.iconSize} text-gray-300`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
        ),
        shop: (
            <svg className={`${config.iconSize} text-gray-300`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
        ),
        orders: (
            <svg className={`${config.iconSize} text-gray-300`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
        ),
        compare: (
            <svg className={`${config.iconSize} text-gray-300`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
        ),
        search: (
            <svg className={`${config.iconSize} text-gray-300`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        ),
        users: (
            <svg className={`${config.iconSize} text-gray-300`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
        ),
    };

    const iconElement = icon === 'custom' ? customIcon : icons[icon] || icons.box;

    return (
        <div className={`text-center ${config.container} ${className}`}>
            {/* Icon */}
            <div className="flex justify-center mb-4">
                {iconElement}
            </div>

            {/* Title */}
            <h3 className={`font-semibold text-heading mb-2 ${config.titleSize}`}>
                {title}
            </h3>

            {/* Description */}
            {description && (
                <p className={`text-body mb-6 max-w-md mx-auto ${config.descSize}`}>
                    {description}
                </p>
            )}

            {/* Action Button */}
            {action && (
                action.href ? (
                    <Link
                        href={action.href}
                        className={`inline-flex items-center gap-2 bg-brand hover:bg-brand-dark text-white rounded-lg font-semibold transition-colors ${config.buttonSize}`}
                    >
                        {action.icon && <i className={action.icon}></i>}
                        {action.label}
                    </Link>
                ) : (
                    <button
                        onClick={action.onClick}
                        className={`inline-flex items-center gap-2 bg-brand hover:bg-brand-dark text-white rounded-lg font-semibold transition-colors ${config.buttonSize}`}
                    >
                        {action.icon && <i className={action.icon}></i>}
                        {action.label}
                    </button>
                )
            )}
        </div>
    );
}
