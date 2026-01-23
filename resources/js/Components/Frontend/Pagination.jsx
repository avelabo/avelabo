import { Link } from '@inertiajs/react';

/**
 * Pagination - Reusable pagination component for Laravel paginated data
 *
 * @param {object} pagination - Laravel pagination object with links array
 * @param {boolean} preserveScroll - Whether to preserve scroll position (default: true)
 * @param {boolean} preserveState - Whether to preserve component state (default: true)
 * @param {string} className - Additional CSS classes
 *
 * Expected pagination object structure:
 * {
 *   current_page: 1,
 *   last_page: 10,
 *   total: 100,
 *   links: [
 *     { url: null, label: '&laquo; Previous', active: false },
 *     { url: '/page/1', label: '1', active: true },
 *     ...
 *   ]
 * }
 */
export default function Pagination({
    pagination,
    preserveScroll = true,
    preserveState = true,
    className = '',
}) {
    // Don't render if there's only one page or no pagination data
    if (!pagination || pagination.last_page <= 1) {
        return null;
    }

    return (
        <nav className={`flex items-center justify-center gap-2 ${className}`}>
            {pagination.links.map((link, index) => (
                <Link
                    key={index}
                    href={link.url || '#'}
                    preserveScroll={preserveScroll}
                    preserveState={preserveState}
                    className={`px-4 py-2 flex items-center justify-center border rounded-md transition-colors min-w-[40px] ${
                        link.active
                            ? 'border-brand bg-brand text-white'
                            : link.url
                            ? 'border-border hover:border-brand hover:text-brand'
                            : 'border-border text-gray-400 cursor-not-allowed pointer-events-none'
                    }`}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                />
            ))}
        </nav>
    );
}

/**
 * SimplePagination - Simpler prev/next only pagination
 */
export function SimplePagination({
    pagination,
    preserveScroll = true,
    preserveState = true,
    className = '',
}) {
    if (!pagination || pagination.last_page <= 1) {
        return null;
    }

    const prevLink = pagination.links[0];
    const nextLink = pagination.links[pagination.links.length - 1];

    return (
        <nav className={`flex items-center justify-between gap-4 ${className}`}>
            <Link
                href={prevLink.url || '#'}
                preserveScroll={preserveScroll}
                preserveState={preserveState}
                className={`inline-flex items-center gap-2 px-4 py-2 border rounded-md transition-colors ${
                    prevLink.url
                        ? 'border-border hover:border-brand hover:text-brand'
                        : 'border-border text-gray-400 cursor-not-allowed pointer-events-none'
                }`}
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
            </Link>

            <span className="text-sm text-body">
                Page {pagination.current_page} of {pagination.last_page}
            </span>

            <Link
                href={nextLink.url || '#'}
                preserveScroll={preserveScroll}
                preserveState={preserveState}
                className={`inline-flex items-center gap-2 px-4 py-2 border rounded-md transition-colors ${
                    nextLink.url
                        ? 'border-border hover:border-brand hover:text-brand'
                        : 'border-border text-gray-400 cursor-not-allowed pointer-events-none'
                }`}
            >
                Next
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </Link>
        </nav>
    );
}

/**
 * PaginationInfo - Shows "Showing X to Y of Z results" text
 */
export function PaginationInfo({ pagination, className = '' }) {
    if (!pagination || !pagination.total) {
        return null;
    }

    const from = pagination.from || 0;
    const to = pagination.to || 0;
    const total = pagination.total || 0;

    return (
        <p className={`text-sm text-body ${className}`}>
            Showing <strong className="text-heading">{from}</strong> to{' '}
            <strong className="text-heading">{to}</strong> of{' '}
            <strong className="text-brand">{total}</strong> results
        </p>
    );
}
