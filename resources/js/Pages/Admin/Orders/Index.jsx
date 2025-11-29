import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';

export default function Index() {
    const [filters, setFilters] = useState({
        orderId: '',
        customer: '',
        status: '',
        total: '',
        dateAdded: '',
        dateModified: '',
    });

    const orders = [
        { id: 452, customer: 'Devon Lane', price: '$948.55', status: 'Received', date: '07.05.2020' },
        { id: 789, customer: 'Guy Hawkins', price: '$0.00', status: 'Cancelled', date: '25.05.2020' },
        { id: 478, customer: 'Leslie Alexander', price: '$293.01', status: 'Pending', date: '18.05.2020' },
        { id: 589, customer: 'Albert Flores', price: '$105.55', status: 'Pending', date: '07.02.2020' },
        { id: 345, customer: 'Eleanor Pena', price: '$779.58', status: 'Received', date: '18.03.2020' },
        { id: 456, customer: 'Dianne Russell', price: '$576.28', status: 'Received', date: '23.04.2020' },
        { id: 768, customer: 'Savannah Nguyen', price: '$589.99', status: 'Received', date: '18.05.2020' },
        { id: 977, customer: 'Kathryn Murphy', price: '$169.43', status: 'Received', date: '23.03.2020' },
    ];

    const getStatusBadge = (status) => {
        const styles = {
            Received: 'badge-soft-success',
            Pending: 'badge-soft-warning',
            Cancelled: 'badge-soft-danger',
        };
        return styles[status] || 'badge-soft-primary';
    };

    return (
        <AdminLayout>
            <Head title="Order List" />

            <div className="space-y-6">
                {/* Page Header */}
                <div>
                    <h2 className="text-2xl font-bold text-heading dark:text-white">Order List</h2>
                    <p className="text-body">Manage your customer orders</p>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                    {/* Orders Table */}
                    <div className="xl:col-span-3">
                        <div className="bg-white dark:bg-dark-card rounded-xl shadow-card">
                            {/* Filters Header */}
                            <header className="p-5 border-b dark:border-white/10">
                                <div className="flex flex-col md:flex-row gap-4">
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand"
                                    />
                                    <select className="px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand">
                                        <option>Status</option>
                                        <option>Received</option>
                                        <option>Pending</option>
                                        <option>Cancelled</option>
                                    </select>
                                    <select className="px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand">
                                        <option>Show 20</option>
                                        <option>Show 30</option>
                                        <option>Show 40</option>
                                    </select>
                                </div>
                            </header>

                            {/* Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 dark:bg-dark-body">
                                        <tr>
                                            <th className="text-left py-3 px-4 text-xs font-semibold text-body uppercase">ID</th>
                                            <th className="text-left py-3 px-4 text-xs font-semibold text-body uppercase">Customer name</th>
                                            <th className="text-left py-3 px-4 text-xs font-semibold text-body uppercase">Price</th>
                                            <th className="text-left py-3 px-4 text-xs font-semibold text-body uppercase">Status</th>
                                            <th className="text-left py-3 px-4 text-xs font-semibold text-body uppercase">Date</th>
                                            <th className="text-right py-3 px-4 text-xs font-semibold text-body uppercase">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y dark:divide-white/10">
                                        {orders.map((order) => (
                                            <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-white/5">
                                                <td className="py-3 px-4 text-sm">{order.id}</td>
                                                <td className="py-3 px-4 text-sm font-medium text-heading dark:text-white">{order.customer}</td>
                                                <td className="py-3 px-4 text-sm">{order.price}</td>
                                                <td className="py-3 px-4">
                                                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(order.status)}`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-sm">{order.date}</td>
                                                <td className="py-3 px-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link
                                                            href={`/admin/orders/${order.id}`}
                                                            className="px-3 py-1.5 bg-brand hover:bg-brand-dark text-white rounded text-xs font-medium transition-colors"
                                                        >
                                                            Detail
                                                        </Link>
                                                        <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded">
                                                            <span className="material-icons text-lg">more_horiz</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Pagination */}
                        <div className="mt-6">
                            <nav className="flex items-center gap-1">
                                <button className="px-3 py-2 bg-brand text-white rounded text-sm font-medium">01</button>
                                <button className="px-3 py-2 bg-white dark:bg-dark-card border border-gray-200 dark:border-white/10 text-body rounded text-sm font-medium hover:bg-gray-50">02</button>
                                <button className="px-3 py-2 bg-white dark:bg-dark-card border border-gray-200 dark:border-white/10 text-body rounded text-sm font-medium hover:bg-gray-50">03</button>
                                <span className="px-3 py-2 text-body text-sm">...</span>
                                <button className="px-3 py-2 bg-white dark:bg-dark-card border border-gray-200 dark:border-white/10 text-body rounded text-sm font-medium hover:bg-gray-50">16</button>
                                <button className="px-3 py-2 bg-white dark:bg-dark-card border border-gray-200 dark:border-white/10 text-body rounded text-sm font-medium hover:bg-gray-50">
                                    <span className="material-icons text-sm">chevron_right</span>
                                </button>
                            </nav>
                        </div>
                    </div>

                    {/* Filter Sidebar */}
                    <div className="xl:col-span-1">
                        <div className="bg-white dark:bg-dark-card rounded-xl shadow-card p-5">
                            <h5 className="font-semibold text-heading dark:text-white mb-5">Filter by</h5>
                            <form className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-heading dark:text-white mb-2">Order ID</label>
                                    <input
                                        type="text"
                                        placeholder="Type here"
                                        value={filters.orderId}
                                        onChange={(e) => setFilters({ ...filters, orderId: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-heading dark:text-white mb-2">Customer</label>
                                    <input
                                        type="text"
                                        placeholder="Type here"
                                        value={filters.customer}
                                        onChange={(e) => setFilters({ ...filters, customer: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-heading dark:text-white mb-2">Order Status</label>
                                    <select
                                        value={filters.status}
                                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand"
                                    >
                                        <option value="">All</option>
                                        <option value="received">Received</option>
                                        <option value="pending">Pending</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-heading dark:text-white mb-2">Total</label>
                                    <input
                                        type="text"
                                        placeholder="Type here"
                                        value={filters.total}
                                        onChange={(e) => setFilters({ ...filters, total: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-heading dark:text-white mb-2">Date Added</label>
                                    <input
                                        type="date"
                                        value={filters.dateAdded}
                                        onChange={(e) => setFilters({ ...filters, dateAdded: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-heading dark:text-white mb-2">Date Modified</label>
                                    <input
                                        type="date"
                                        value={filters.dateModified}
                                        onChange={(e) => setFilters({ ...filters, dateModified: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand"
                                    />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
