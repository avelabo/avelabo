import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Index() {
    const sellers = [
        { id: 439, name: 'Eleanor Pena', email: 'eleanor2020@example.com', status: 'Active', date: '08.07.2020', avatar: '/images/admin/people/avatar-1.png' },
        { id: 129, name: 'Mary Monasa', email: 'monalisa@example.com', status: 'Active', date: '11.07.2020', avatar: '/images/admin/people/avatar-2.png' },
        { id: 400, name: 'Jonatan Ive', email: 'mrjohn@example.com', status: 'Active', date: '08.07.2020', avatar: '/images/admin/people/avatar-3.png' },
        { id: 441, name: 'Eleanor Pena', email: 'eleanor2020@example.com', status: 'Inactive', date: '08.07.2020', avatar: '/images/admin/people/avatar-4.png' },
        { id: 442, name: 'Albert Pushkin', email: 'someone@mymail.com', status: 'Active', date: '20.11.2019', avatar: '/images/admin/people/avatar-1.png' },
        { id: 443, name: 'Alexandra Pena', email: 'eleanor2020@example.com', status: 'Inactive', date: '08.07.2020', avatar: '/images/admin/people/avatar-2.png' },
        { id: 444, name: 'Eleanor Pena', email: 'eleanor2020@example.com', status: 'Inactive', date: '08.07.2020', avatar: '/images/admin/people/avatar-3.png' },
        { id: 445, name: 'Alex Pushkina', email: 'alex@gmail.org', status: 'Active', date: '08.07.2020', avatar: '/images/admin/people/avatar-4.png' },
    ];

    const getStatusBadge = (status) => {
        const styles = {
            Active: 'badge-soft-success',
            Inactive: 'badge-soft-danger',
        };
        return styles[status] || 'badge-soft-primary';
    };

    return (
        <AdminLayout>
            <Head title="Sellers List" />

            <div className="space-y-6">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <h2 className="text-2xl font-bold text-heading dark:text-white">Sellers list</h2>
                    <div className="mt-4 md:mt-0">
                        <Link
                            href="/admin/sellers/create"
                            className="px-4 py-2 bg-brand hover:bg-brand-dark text-white rounded-lg font-medium text-sm transition-colors inline-flex items-center"
                        >
                            <span className="material-icons mr-2 text-sm">add</span>
                            Create new
                        </Link>
                    </div>
                </div>

                {/* Sellers Table Card */}
                <div className="bg-white dark:bg-dark-card rounded-xl shadow-card">
                    {/* Filter Bar */}
                    <div className="p-5 border-b dark:border-white/10">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                            <div className="md:col-span-6">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="w-full bg-gray-100 dark:bg-dark-body border-0 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand"
                                />
                            </div>
                            <div className="md:col-span-3">
                                <select className="w-full bg-gray-100 dark:bg-dark-body border-0 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand">
                                    <option>Status</option>
                                    <option>Active</option>
                                    <option>Inactive</option>
                                    <option>Show all</option>
                                </select>
                            </div>
                            <div className="md:col-span-3">
                                <select className="w-full bg-gray-100 dark:bg-dark-body border-0 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand">
                                    <option>Show 20</option>
                                    <option>Show 30</option>
                                    <option>Show 40</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-dark-body">
                                <tr>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-body uppercase">Seller</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-body uppercase">Email</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-body uppercase">Status</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-body uppercase">Registered</th>
                                    <th className="text-right py-3 px-4 text-xs font-semibold text-body uppercase">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y dark:divide-white/10">
                                {sellers.map((seller) => (
                                    <tr key={seller.id} className="hover:bg-gray-50 dark:hover:bg-white/5">
                                        <td className="py-4 px-4">
                                            <Link href={`/admin/sellers/${seller.id}`} className="flex items-center gap-3">
                                                <img
                                                    src={seller.avatar}
                                                    alt={seller.name}
                                                    className="w-10 h-10 rounded-full object-cover"
                                                />
                                                <div>
                                                    <h6 className="text-sm font-medium text-heading dark:text-white">{seller.name}</h6>
                                                    <small className="text-xs text-body">Seller ID: #{seller.id}</small>
                                                </div>
                                            </Link>
                                        </td>
                                        <td className="py-4 px-4 text-sm">{seller.email}</td>
                                        <td className="py-4 px-4">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(seller.status)}`}>
                                                {seller.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-sm">{seller.date}</td>
                                        <td className="py-4 px-4 text-right">
                                            <Link
                                                href={`/admin/sellers/${seller.id}`}
                                                className="px-3 py-1.5 bg-brand hover:bg-brand-dark text-white rounded text-xs font-medium transition-colors"
                                            >
                                                View details
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                <nav className="flex justify-start">
                    <ul className="flex items-center gap-2">
                        <li><button className="px-3 py-2 bg-brand text-white rounded-lg text-sm font-medium">01</button></li>
                        <li><button className="px-3 py-2 bg-gray-100 dark:bg-dark-card text-heading dark:text-white rounded-lg text-sm font-medium hover:bg-gray-200">02</button></li>
                        <li><button className="px-3 py-2 bg-gray-100 dark:bg-dark-card text-heading dark:text-white rounded-lg text-sm font-medium hover:bg-gray-200">03</button></li>
                        <li><span className="px-3 py-2 text-body">...</span></li>
                        <li><button className="px-3 py-2 bg-gray-100 dark:bg-dark-card text-heading dark:text-white rounded-lg text-sm font-medium hover:bg-gray-200">16</button></li>
                        <li>
                            <button className="px-3 py-2 bg-gray-100 dark:bg-dark-card text-heading dark:text-white rounded-lg text-sm font-medium hover:bg-gray-200">
                                <span className="material-icons text-lg">chevron_right</span>
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </AdminLayout>
    );
}
