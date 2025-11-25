import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import StatCard from '@/Components/Admin/StatCard';
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

    const getStatusBadge = (status) => {
        const styles = {
            Pending: 'badge-soft-warning',
            Delivered: 'badge-soft-success',
            Processing: 'badge-soft-info',
            Cancelled: 'badge-soft-danger',
        };
        return styles[status] || 'badge-soft-primary';
    };

    return (
        <AdminLayout>
            <Head title="Dashboard" />

            <div className="space-y-6">
                {/* Page Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-heading dark:text-white">Dashboard</h2>
                        <p className="text-body">Welcome back, Admin!</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            <span className="material-icons text-sm mr-2">file_download</span>
                            Export
                        </button>
                        <button className="px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand-dark transition-colors">
                            <span className="material-icons text-sm mr-2">add</span>
                            Create Report
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <StatCard key={index} {...stat} />
                    ))}
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <SalesChart />
                    </div>

                    {/* Revenue by Area */}
                    <div className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-card">
                        <h5 className="font-semibold text-heading dark:text-white mb-6">Revenue by Area</h5>
                        <div className="space-y-4">
                            {[
                                { area: 'US', value: 44, color: '#5897fb' },
                                { area: 'Europe', value: 55, color: '#7bcf86' },
                                { area: 'Asia', value: 41, color: '#ff9076' },
                                { area: 'Africa', value: 67, color: '#d595e5' },
                            ].map((item, index) => (
                                <div key={index}>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-body">{item.area}</span>
                                        <span className="font-medium text-heading dark:text-white">{item.value}%</span>
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
                    </div>
                </div>

                {/* Bottom Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Latest Orders */}
                    <div className="lg:col-span-2 bg-white dark:bg-dark-card rounded-xl shadow-card">
                        <div className="p-6 border-b dark:border-white/10">
                            <div className="flex items-center justify-between">
                                <h5 className="font-semibold text-heading dark:text-white">Latest Orders</h5>
                                <Link href="/admin/orders" className="text-brand text-sm hover:underline">View All</Link>
                            </div>
                        </div>
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
                                <tbody className="divide-y dark:divide-white/10">
                                    {latestOrders.map((order, index) => (
                                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-white/5">
                                            <td className="px-6 py-4">
                                                <Link href={`/admin/orders/${order.id}`} className="text-brand font-medium hover:underline">
                                                    {order.id}
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-medium text-heading dark:text-white">{order.name}</p>
                                                    <p className="text-sm text-body">{order.email}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-medium text-heading dark:text-white">{order.total}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-body">{order.date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* New Members */}
                    <div className="bg-white dark:bg-dark-card rounded-xl shadow-card">
                        <div className="p-6 border-b dark:border-white/10">
                            <div className="flex items-center justify-between">
                                <h5 className="font-semibold text-heading dark:text-white">New Members</h5>
                                <Link href="/admin/customers" className="text-brand text-sm hover:underline">View All</Link>
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            {newMembers.map((member, index) => (
                                <div key={index} className="flex items-center gap-4">
                                    <img
                                        src={member.avatar}
                                        alt={member.name}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                    <div className="flex-1">
                                        <h6 className="font-medium text-heading dark:text-white">{member.name}</h6>
                                        <p className="text-sm text-body">{member.email}</p>
                                    </div>
                                    <span className="text-body text-sm">{member.phone}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
