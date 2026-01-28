import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import MetricCard from '@/Components/Shared/MetricCard';
import DashboardCard from '@/Components/Shared/DashboardCard';
import PageHeader from '@/Components/Shared/PageHeader';
import StatusBadge from '@/Components/Shared/StatusBadge';
import SalesChart from '@/Components/Admin/SalesChart';

export default function Dashboard() {
    const stats = [
        { title: 'Total Revenue', value: '$13,456.52', change: '+12% from last month', changeType: 'increase', icon: 'paid', iconBg: 'bg-brand' },
        { title: 'Total Orders', value: '1,856', change: '+8% from last month', changeType: 'increase', icon: 'shopping_cart', iconBg: 'bg-info' },
        { title: 'Products Sold', value: '678', change: '-5% from last month', changeType: 'decrease', icon: 'inventory_2', iconBg: 'bg-warning' },
        { title: 'New Customers', value: '234', change: '+15% from last month', changeType: 'increase', icon: 'person_add', iconBg: 'bg-danger' },
    ];

    const latestOrders = [
        { id: '#6010', name: 'Dennis Matthews', email: 'dennis@example.com', total: '$78.00', status: 'Pending', date: 'Dec 08, 2023' },
        { id: '#6011', name: 'Susan Myers', email: 'susan@example.com', total: '$156.00', status: 'Delivered', date: 'Dec 07, 2023' },
        { id: '#6012', name: 'Robert Wilson', email: 'robert@example.com', total: '$45.00', status: 'Processing', date: 'Dec 06, 2023' },
        { id: '#6013', name: 'Emily Johnson', email: 'emily@example.com', total: '$234.00', status: 'Delivered', date: 'Dec 05, 2023' },
        { id: '#6014', name: 'Michael Brown', email: 'michael@example.com', total: '$89.00', status: 'Cancelled', date: 'Dec 04, 2023' },
    ];

    const newMembers = [
        { name: 'John Doe', email: 'john@example.com', phone: '+1 234 567 890', avatar: '/images/admin/people/avatar-1.png' },
        { name: 'Jane Smith', email: 'jane@example.com', phone: '+1 234 567 891', avatar: '/images/admin/people/avatar-2.png' },
        { name: 'Bob Wilson', email: 'bob@example.com', phone: '+1 234 567 892', avatar: '/images/admin/people/avatar-3.png' },
        { name: 'Alice Brown', email: 'alice@example.com', phone: '+1 234 567 893', avatar: '/images/admin/people/avatar-4.png' },
    ];

    return (
        <AdminLayout>
            <Head title="Dashboard" />

            <div className="space-y-6">
                {/* Page Header */}
                <PageHeader
                    title="Dashboard"
                    subtitle="Welcome back, Admin!"
                    actions={
                        <>
                            <button className="btn btn-secondary btn-sm">
                                <span className="material-icons text-sm">file_download</span>
                                Export
                            </button>
                            <button className="btn btn-primary btn-sm">
                                <span className="material-icons text-sm">add</span>
                                Create Report
                            </button>
                        </>
                    }
                />

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <MetricCard key={index} {...stat} />
                    ))}
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <SalesChart />
                    </div>

                    {/* Revenue by Area */}
                    <DashboardCard title="Revenue by Area">
                        <div className="space-y-4">
                            {[
                                { area: 'US', value: 44, color: '#5897fb' },
                                { area: 'Europe', value: 55, color: '#7bcf86' },
                                { area: 'Asia', value: 41, color: '#ff9076' },
                                { area: 'Africa', value: 67, color: '#d595e5' },
                            ].map((item, index) => (
                                <div key={index}>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-body text-sm">{item.area}</span>
                                        <span className="font-medium text-heading dark:text-white text-sm">{item.value}%</span>
                                    </div>
                                    <div className="progress">
                                        <div
                                            className="progress-bar"
                                            style={{ width: `${item.value}%`, backgroundColor: item.color }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </DashboardCard>
                </div>

                {/* Bottom Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Latest Orders */}
                    <DashboardCard
                        title="Latest Orders"
                        actionLabel="View All"
                        actionHref="/admin/orders"
                        noPadding
                        className="lg:col-span-2"
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-dark-body">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-body uppercase tracking-wider">Order</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-body uppercase tracking-wider">Customer</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-body uppercase tracking-wider">Total</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-body uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-body uppercase tracking-wider">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border-light dark:divide-white/10">
                                    {latestOrders.map((order, index) => (
                                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-white/5">
                                            <td className="px-6 py-4">
                                                <Link href={`/admin/orders/${order.id}`} className="text-brand font-medium hover:underline">
                                                    {order.id}
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-medium text-heading dark:text-white text-sm">{order.name}</p>
                                                    <p className="text-xs text-body">{order.email}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-medium text-heading dark:text-white text-sm">{order.total}</td>
                                            <td className="px-6 py-4">
                                                <StatusBadge status={order.status} />
                                            </td>
                                            <td className="px-6 py-4 text-body text-sm">{order.date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </DashboardCard>

                    {/* New Members */}
                    <DashboardCard title="New Members" actionLabel="View All" actionHref="/admin/customers">
                        <div className="space-y-4">
                            {newMembers.map((member, index) => (
                                <div key={index} className="flex items-center gap-4">
                                    <img
                                        src={member.avatar}
                                        alt={member.name}
                                        className="w-11 h-11 rounded-full object-cover"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <h6 className="font-medium text-heading dark:text-white text-sm">{member.name}</h6>
                                        <p className="text-xs text-body truncate">{member.email}</p>
                                    </div>
                                    <span className="text-body text-xs hidden xl:block">{member.phone}</span>
                                </div>
                            ))}
                        </div>
                    </DashboardCard>
                </div>
            </div>
        </AdminLayout>
    );
}
