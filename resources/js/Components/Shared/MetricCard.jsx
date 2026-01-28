/**
 * Unified metric / stat card for admin and seller dashboards.
 *
 * @param {string} title - Label (e.g. "Total Revenue")
 * @param {string|number} value - The metric value
 * @param {string} icon - Material icon name
 * @param {string} [iconBg] - Tailwind bg class for the icon circle (default: "bg-brand")
 * @param {string} [change] - Trend text (e.g. "+12% from last month")
 * @param {'increase'|'decrease'} [changeType] - Direction of the trend
 * @param {string} [subtitle] - Alternative to change — static helper text
 */
export default function MetricCard({ title, value, icon, iconBg = 'bg-brand', change, changeType = 'increase', subtitle }) {
    return (
        <div className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-card">
            <div className="flex items-center justify-between">
                <div className="min-w-0">
                    <p className="text-body text-sm mb-1 truncate">{title}</p>
                    <h3 className="text-2xl font-bold text-heading dark:text-white">{value}</h3>
                    {change && (
                        <p className={`text-sm mt-2 ${changeType === 'increase' ? 'text-success' : 'text-danger'}`}>
                            <span className="inline-flex items-center gap-1">
                                <span className="material-icons text-sm">
                                    {changeType === 'increase' ? 'trending_up' : 'trending_down'}
                                </span>
                                {change}
                            </span>
                        </p>
                    )}
                    {!change && subtitle && (
                        <p className="text-sm text-body mt-1">{subtitle}</p>
                    )}
                </div>
                <div className={`w-14 h-14 ${iconBg} rounded-2xl flex items-center justify-center shrink-0`}>
                    <span className="material-icons text-white text-2xl">{icon}</span>
                </div>
            </div>
        </div>
    );
}
