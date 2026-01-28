import { Link } from '@inertiajs/react';

/**
 * Wrapper card used across admin and seller dashboards.
 *
 * @param {string} [title] - Optional card heading
 * @param {string} [actionLabel] - Text for the header action link
 * @param {string} [actionHref] - URL for the header action link
 * @param {boolean} [noPadding] - Disable body padding (useful for tables/lists)
 * @param {string} [className] - Additional class names
 * @param {React.ReactNode} children
 */
export default function DashboardCard({ title, actionLabel, actionHref, noPadding, className = '', children }) {
    return (
        <div className={`bg-white dark:bg-dark-card rounded-xl shadow-card overflow-hidden ${className}`}>
            {title && (
                <div className="flex items-center justify-between px-6 py-4 border-b border-border-light dark:border-white/10">
                    <h3 className="font-semibold text-heading dark:text-white">{title}</h3>
                    {actionLabel && actionHref && (
                        <Link href={actionHref} className="text-brand text-sm font-medium hover:underline">
                            {actionLabel}
                        </Link>
                    )}
                </div>
            )}
            <div className={noPadding ? '' : 'p-6'}>{children}</div>
        </div>
    );
}
