const STATUS_MAP = {
    // Order statuses
    pending: 'badge-soft-warning',
    processing: 'badge-soft-info',
    shipped: 'badge-soft-info',
    delivered: 'badge-soft-success',
    completed: 'badge-soft-success',
    cancelled: 'badge-soft-danger',
    refunded: 'badge-soft-danger',
    failed: 'badge-soft-danger',

    // Product statuses
    active: 'badge-soft-success',
    draft: 'badge-soft-warning',
    inactive: 'badge-soft-danger',

    // Generic
    approved: 'badge-soft-success',
    rejected: 'badge-soft-danger',

    // Capitalised variants (for static data)
    Pending: 'badge-soft-warning',
    Processing: 'badge-soft-info',
    Delivered: 'badge-soft-success',
    Cancelled: 'badge-soft-danger',
};

/**
 * Unified status badge for admin and seller panels.
 *
 * @param {string} status - The status value to display
 * @param {string} [className] - Extra classes
 */
export default function StatusBadge({ status, className = '' }) {
    const badgeClass = STATUS_MAP[status] || 'badge-soft-primary';

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${badgeClass} ${className}`}>
            {status}
        </span>
    );
}
