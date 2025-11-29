import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Show() {
    // Sample seller data
    const seller = {
        id: 129,
        name: 'Noodles Co.',
        address: '3891 Ranchview Dr. Richardson, California 62639',
        logo: '/images/admin/brands/vendor-2.png',
        manager: 'Jerome Bell',
        email: 'info@example.com',
        phone: '(229) 555-0109, (808) 555-0111',
        country: 'California',
        street: 'Ranchview Dr. Richardson',
        postalCode: '62639',
        totalSales: 238,
        revenue: 2380,
    };

    // Sample products data
    const products = [
        { id: 1, name: 'Product name', price: 179.00, image: '/images/admin/items/1.jpg' },
        { id: 2, name: 'Product name', price: 179.00, image: '/images/admin/items/2.jpg' },
        { id: 3, name: 'All Natural Italian-Style', price: 179.00, image: '/images/admin/items/3.jpg' },
        { id: 4, name: 'Boomchick apop Sweet & Salty', price: 179.00, image: '/images/admin/items/4.jpg' },
        { id: 5, name: 'Product name', price: 179.00, image: '/images/admin/items/5.jpg' },
        { id: 6, name: 'Product name', price: 179.00, image: '/images/admin/items/6.jpg' },
        { id: 7, name: 'Product name', price: 179.00, image: '/images/admin/items/7.jpg' },
        { id: 8, name: 'Apple Airpods CB-133', price: 179.00, image: '/images/admin/items/8.jpg' },
        { id: 9, name: 'Product name', price: 179.00, image: '/images/admin/items/9.jpg' },
        { id: 10, name: 'Product name', price: 179.00, image: '/images/admin/items/10.jpg' },
        { id: 11, name: 'All Natural Italian-Style', price: 179.00, image: '/images/admin/items/11.jpg' },
        { id: 12, name: 'Boomchick apop Sweet & Salty', price: 179.00, image: '/images/admin/items/12.jpg' },
        { id: 13, name: 'Product name', price: 179.00, image: '/images/admin/items/1.jpg' },
        { id: 14, name: 'Product name', price: 179.00, image: '/images/admin/items/2.jpg' },
        { id: 15, name: 'All Natural Italian-Style', price: 179.00, image: '/images/admin/items/3.jpg' },
        { id: 16, name: 'Boomchick apop Sweet & Salty', price: 179.00, image: '/images/admin/items/4.jpg' },
        { id: 17, name: 'Product name', price: 179.00, image: '/images/admin/items/5.jpg' },
        { id: 18, name: 'Product name', price: 179.00, image: '/images/admin/items/6.jpg' },
        { id: 19, name: 'Product name', price: 179.00, image: '/images/admin/items/7.jpg' },
        { id: 20, name: 'Apple Airpods CB-133', price: 179.00, image: '/images/admin/items/8.jpg' },
        { id: 21, name: 'Product name', price: 179.00, image: '/images/admin/items/9.jpg' },
        { id: 22, name: 'Product name', price: 179.00, image: '/images/admin/items/10.jpg' },
        { id: 23, name: 'All Natural Italian-Style', price: 179.00, image: '/images/admin/items/11.jpg' },
        { id: 24, name: 'Boomchick apop Sweet & Salty', price: 179.00, image: '/images/admin/items/12.jpg' },
    ];

    return (
        <AdminLayout>
            <Head title="Seller Profile" />

            <div className="space-y-6">
                {/* Back Link */}
                <div>
                    <Link
                        href="/admin/sellers"
                        className="inline-flex items-center text-brand hover:text-brand-dark dark:text-brand dark:hover:text-brand-dark font-medium"
                    >
                        <span className="material-icons mr-1">arrow_back</span> Go back
                    </Link>
                </div>

                {/* Seller Profile Card */}
                <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-white/10 overflow-hidden">
                    {/* Header Banner */}
                    <div className="h-40 bg-brand"></div>

                    <div className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            {/* Logo */}
                            <div className="lg:col-span-2 flex justify-center lg:justify-start">
                                <div className="w-48 h-48 -mt-32 bg-white dark:bg-dark-card border-4 border-white dark:border-dark-card rounded-lg shadow-lg flex items-center justify-center p-4">
                                    <img
                                        src={seller.logo}
                                        className="max-w-full max-h-full object-contain"
                                        alt="Logo Brand"
                                    />
                                </div>
                            </div>

                            {/* Seller Info */}
                            <div className="lg:col-span-6">
                                <h3 className="text-2xl font-quicksand font-bold text-heading dark:text-white mb-2">
                                    {seller.name}
                                </h3>
                                <p className="text-body dark:text-gray-300">{seller.address}</p>
                            </div>

                            {/* Actions */}
                            <div className="lg:col-span-4 flex flex-col sm:flex-row gap-3 lg:justify-end">
                                <select className="bg-gray-100 dark:bg-dark-body border-0 rounded-lg px-4 py-2 text-sm outline-none dark:text-white">
                                    <option>Actions</option>
                                    <option>Disable shop</option>
                                    <option>Analyze</option>
                                    <option>Something</option>
                                </select>
                                <a
                                    href="#"
                                    className="px-4 py-2 bg-brand hover:bg-brand-dark text-white rounded-lg font-medium text-sm transition-colors inline-flex items-center justify-center"
                                >
                                    View live <span className="material-icons ml-2 text-lg">launch</span>
                                </a>
                            </div>
                        </div>

                        <hr className="my-6 dark:border-white/10" />

                        {/* Stats and Info */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6">
                            {/* Stats */}
                            <div className="lg:col-span-2">
                                <div className="bg-gray-50 dark:bg-dark-body rounded-lg p-4">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total sales:</p>
                                    <h5 className="text-xl font-bold text-green-600 mb-3">{seller.totalSales}</h5>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Revenue:</p>
                                    <h5 className="text-xl font-bold text-green-600">${seller.revenue}</h5>
                                </div>
                            </div>

                            {/* Contacts */}
                            <div className="lg:col-span-3">
                                <h6 className="text-sm font-quicksand font-bold text-heading dark:text-white mb-3">
                                    Contacts
                                </h6>
                                <p className="text-sm text-body dark:text-gray-300 leading-relaxed">
                                    Manager: {seller.manager} <br />
                                    {seller.email} <br />
                                    {seller.phone}
                                </p>
                            </div>

                            {/* Address */}
                            <div className="lg:col-span-3">
                                <h6 className="text-sm font-quicksand font-bold text-heading dark:text-white mb-3">
                                    Address
                                </h6>
                                <p className="text-sm text-body dark:text-gray-300 leading-relaxed">
                                    Country: {seller.country} <br />
                                    Address: {seller.street} <br />
                                    Postal code: {seller.postalCode}
                                </p>
                            </div>

                            {/* Map */}
                            <div className="lg:col-span-4 flex justify-center lg:justify-end">
                                <div className="relative inline-block">
                                    <img
                                        src="/images/admin/misc/map.jpg"
                                        className="rounded-lg h-32 object-cover"
                                        alt="map"
                                    />
                                    <span
                                        className="absolute w-3 h-3 bg-red-500 rounded-full border-2 border-white"
                                        style={{ top: '50px', left: '100px' }}
                                    ></span>
                                    <button className="absolute bottom-2 right-2 px-3 py-1 bg-brand hover:bg-brand-dark text-white rounded text-xs font-medium transition-colors">
                                        Large
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Products by Seller */}
                <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-white/10 p-6">
                    <h3 className="text-xl font-quicksand font-bold text-heading dark:text-white mb-6">
                        Products by seller
                    </h3>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="bg-white dark:bg-dark-body border border-gray-100 dark:border-white/10 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                            >
                                <Link href="#" className="block aspect-square overflow-hidden bg-gray-50 dark:bg-dark-sidebar">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                                    />
                                </Link>
                                <div className="p-3">
                                    <Link
                                        href="#"
                                        className="text-sm font-medium text-heading dark:text-white hover:text-brand line-clamp-2"
                                    >
                                        {product.name}
                                    </Link>
                                    <div className="text-brand font-bold mt-2">${product.price.toFixed(2)}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pagination */}
                <nav className="flex justify-start">
                    <ul className="flex items-center gap-2">
                        <li>
                            <button className="px-3 py-2 bg-brand text-white rounded-lg text-sm font-medium hover:bg-brand-dark transition-colors">
                                01
                            </button>
                        </li>
                        <li>
                            <button className="px-3 py-2 bg-gray-100 dark:bg-dark-card text-heading dark:text-white rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
                                02
                            </button>
                        </li>
                        <li>
                            <button className="px-3 py-2 bg-gray-100 dark:bg-dark-card text-heading dark:text-white rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
                                03
                            </button>
                        </li>
                        <li>
                            <span className="px-3 py-2 text-gray-400 dark:text-gray-500">...</span>
                        </li>
                        <li>
                            <button className="px-3 py-2 bg-gray-100 dark:bg-dark-card text-heading dark:text-white rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
                                16
                            </button>
                        </li>
                        <li>
                            <button className="px-3 py-2 bg-gray-100 dark:bg-dark-card text-heading dark:text-white rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
                                <span className="material-icons text-lg">chevron_right</span>
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </AdminLayout>
    );
}
