import { Link } from '@inertiajs/react';

/**
 * Unified page header for admin and seller panels.
 *
 * @param {string} title - Page heading
 * @param {string} [subtitle] - Optional description text
 * @param {string} [backHref] - If provided, renders a back arrow link
 * @param {React.ReactNode} [actions] - Right-side action buttons / elements
 */
export default function PageHeader({ title, subtitle, backHref, actions }) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
                {backHref && (
                    <Link
                        href={backHref}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                    >
                        <span className="material-icons text-heading dark:text-white">arrow_back</span>
                    </Link>
                )}
                <div>
                    <h2 className="text-2xl font-bold text-heading dark:text-white">{title}</h2>
                    {subtitle && <p className="text-body text-sm mt-0.5">{subtitle}</p>}
                </div>
            </div>
            {actions && <div className="flex items-center gap-3">{actions}</div>}
        </div>
    );
}
