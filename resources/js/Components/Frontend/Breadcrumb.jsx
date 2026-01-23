import { Link } from '@inertiajs/react';

/**
 * Breadcrumb - Reusable breadcrumb navigation component
 *
 * @param {Array} items - Array of breadcrumb items: [{ label, href?, icon? }]
 * @param {string} separator - Separator style: 'dot' | 'slash' | 'chevron' | 'dash' (default: 'dot')
 * @param {boolean} showHomeIcon - Whether to show home icon for first item (default: true)
 * @param {string} className - Additional CSS classes
 *
 * Usage:
 *   <Breadcrumb items={[
 *     { label: 'Home', href: '/' },
 *     { label: 'Shop', href: '/shop' },
 *     { label: 'Electronics' }
 *   ]} />
 */
export default function Breadcrumb({
    items = [],
    separator = 'dot',
    showHomeIcon = true,
    className = '',
}) {
    if (!items || items.length === 0) return null;

    // Separator components
    const separators = {
        dot: <span className="text-muted">&#8226;</span>,
        slash: <span className="text-body">/</span>,
        chevron: (
            <svg className="w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
        ),
        dash: <span className="text-muted">-</span>,
    };

    const separatorElement = separators[separator] || separators.dot;

    // Home icon SVG
    const HomeIcon = () => (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
    );

    return (
        <nav className={`flex items-center gap-2 text-sm ${className}`}>
            {items.map((item, index) => {
                const isFirst = index === 0;
                const isLast = index === items.length - 1;
                const showIcon = isFirst && showHomeIcon && item.label?.toLowerCase() === 'home';

                return (
                    <span key={index} className="flex items-center gap-2">
                        {/* Separator (not for first item) */}
                        {!isFirst && separatorElement}

                        {/* Breadcrumb item */}
                        {item.href && !isLast ? (
                            <Link
                                href={item.href}
                                className="text-brand hover:text-brand-dark flex items-center gap-1 transition-colors"
                            >
                                {showIcon && <HomeIcon />}
                                {item.icon && <i className={item.icon}></i>}
                                {item.label}
                            </Link>
                        ) : (
                            <span className={isLast ? 'text-body' : 'text-heading'}>
                                {showIcon && <HomeIcon />}
                                {item.icon && <i className={item.icon}></i>}
                                {item.label}
                            </span>
                        )}
                    </span>
                );
            })}
        </nav>
    );
}

/**
 * PageHeader - Combines page title with breadcrumb
 * Common pattern across many pages
 */
export function PageHeader({
    title,
    subtitle = null,
    breadcrumbItems = [],
    separator = 'dot',
    className = '',
    children,
}) {
    return (
        <div className={`py-8 mb-8 ${className}`}>
            <div className="container mx-auto px-4">
                <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-quicksand font-bold text-heading mb-3">
                            {title}
                        </h1>
                        {breadcrumbItems.length > 0 && (
                            <Breadcrumb items={breadcrumbItems} separator={separator} />
                        )}
                        {subtitle && (
                            <p className="text-body mt-2">{subtitle}</p>
                        )}
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
