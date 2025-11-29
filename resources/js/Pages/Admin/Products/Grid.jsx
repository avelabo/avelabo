import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Grid() {
    const products = [
        { id: 1, name: 'Haagen-Dazs Caramel Cone Ice', price: '$179.00', image: '/images/admin/items/1.jpg' },
        { id: 2, name: 'Seeds of Change Organic Quinoa', price: '$179.00', image: '/images/admin/items/2.jpg' },
        { id: 3, name: 'All Natural Italian-Style', price: '$179.00', image: '/images/admin/items/3.jpg' },
        { id: 4, name: 'Boomchick apop Sweet & Salty', price: '$179.00', image: '/images/admin/items/4.jpg' },
        { id: 5, name: 'Haagen-Dazs Caramel Cone Ice', price: '$179.00', image: '/images/admin/items/5.jpg' },
        { id: 6, name: 'Haagen-Dazs Caramel Cone Ice', price: '$179.00', image: '/images/admin/items/6.jpg' },
        { id: 7, name: 'Haagen-Dazs Caramel Cone Ice', price: '$179.00', image: '/images/admin/items/7.jpg' },
        { id: 8, name: 'Apple Airpods CB-133', price: '$179.00', image: '/images/admin/items/8.jpg' },
    ];

    return (
        <AdminLayout>
            <Head title="Products Grid" />

            <div className="space-y-6">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-heading dark:text-white">Products Grid</h2>
                        <p className="text-body">View products in grid layout</p>
                    </div>
                    <div className="flex gap-3 mt-4 md:mt-0">
                        <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-heading rounded-lg font-medium text-sm transition-colors">
                            Export
                        </button>
                        <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-heading rounded-lg font-medium text-sm transition-colors">
                            Import
                        </button>
                        <Link
                            href="/admin/products/create"
                            className="px-4 py-2 bg-brand hover:bg-brand-dark text-white rounded-lg font-medium text-sm transition-colors"
                        >
                            Create new
                        </Link>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white dark:bg-dark-card rounded-xl p-5 shadow-card">
                    <div className="flex flex-col md:flex-row gap-4">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand"
                        />
                        <select className="px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand">
                            <option>All category</option>
                            <option>Electronics</option>
                            <option>Clothings</option>
                            <option>Something else</option>
                        </select>
                        <select className="px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand">
                            <option>Latest added</option>
                            <option>Cheap first</option>
                            <option>Most viewed</option>
                        </select>
                    </div>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="bg-white dark:bg-dark-card rounded-xl shadow-card overflow-hidden hover:shadow-lg transition-shadow"
                        >
                            <Link href={`/admin/products/${product.id}`} className="block aspect-square overflow-hidden">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                                />
                            </Link>
                            <div className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <Link
                                        href={`/admin/products/${product.id}`}
                                        className="text-sm font-medium text-heading dark:text-white hover:text-brand"
                                    >
                                        {product.name}
                                    </Link>
                                    <Link
                                        href={`/admin/products/${product.id}/edit`}
                                        className="px-2 py-1 bg-brand hover:bg-brand-dark text-white rounded text-xs font-medium transition-colors flex items-center gap-1"
                                    >
                                        <span className="material-icons text-sm">edit</span>
                                        Edit
                                    </Link>
                                </div>
                                <div className="text-lg font-bold text-brand">{product.price}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-start">
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
        </AdminLayout>
    );
}
