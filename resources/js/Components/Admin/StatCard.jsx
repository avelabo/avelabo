export default function StatCard({ title, value, change, changeType = 'increase', icon, iconBg = 'bg-brand' }) {
    return (
        <div className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-card">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-body text-sm mb-1">{title}</p>
                    <h3 className="text-2xl font-bold text-heading dark:text-white">{value}</h3>
                    {change && (
                        <p className={`text-sm mt-2 ${changeType === 'increase' ? 'text-success' : 'text-danger'}`}>
                            <span className="inline-flex items-center">
                                <span className="material-icons text-sm mr-1">
                                    {changeType === 'increase' ? 'trending_up' : 'trending_down'}
                                </span>
                                {change}
                            </span>
                        </p>
                    )}
                </div>
                <div className={`w-14 h-14 ${iconBg} rounded-full flex items-center justify-center`}>
                    <span className="material-icons text-white text-2xl">{icon}</span>
                </div>
            </div>
        </div>
    );
}
