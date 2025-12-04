import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function SellerLayout({ children, title }) {
    const { auth, seller } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navigation = [
        { name: 'Dashboard', href: route('seller.dashboard'), icon: 'dashboard', current: route().current('seller.dashboard') },
        { name: 'Products', href: route('seller.products.index'), icon: 'inventory_2', current: route().current('seller.products.*') },
        { name: 'Orders', href: route('seller.orders.index'), icon: 'shopping_bag', current: route().current('seller.orders.*') },
        { name: 'Profile', href: route('seller.profile'), icon: 'person', current: route().current('seller.profile') },
        { name: 'Settings', href: route('seller.settings'), icon: 'settings', current: route().current('seller.settings') },
    ];

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
                        <Link href={route('seller.dashboard')} className="flex items-center">
                            <img src="/images/logo/logo-web-small.png" className="h-8" alt="Avelabo Seller" />
                        </Link>
                        <button
                            className="lg:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <span className="material-icons">close</span>
                        </button>
                    </div>

                    {/* Seller Info */}
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-brand/10 rounded-full flex items-center justify-center">
                                <span className="material-icons text-brand">storefront</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                    {seller?.shop_name || 'My Shop'}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {seller?.status === 'approved' ? 'Verified Seller' : 'Pending Verification'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                    item.current
                                        ? 'bg-brand/10 text-brand'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                            >
                                <span className="material-icons text-xl">{item.icon}</span>
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Back to Store */}
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                        <Link
                            href={route('home')}
                            className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                        >
                            <span className="material-icons text-lg">arrow_back</span>
                            Back to Store
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="lg:pl-64 flex flex-col min-h-screen">
                {/* Top Header */}
                <header className="sticky top-0 z-30 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center px-4 lg:px-8">
                    <button
                        className="lg:hidden p-2 mr-2 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <span className="material-icons">menu</span>
                    </button>

                    <h1 className="text-lg font-semibold text-gray-900 dark:text-white flex-1">
                        {title || 'Seller Dashboard'}
                    </h1>

                    <div className="flex items-center gap-4">
                        {/* Notifications */}
                        <button className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg relative">
                            <span className="material-icons">notifications</span>
                        </button>

                        {/* User Menu */}
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                <span className="material-icons text-gray-500">person</span>
                            </div>
                            <span className="hidden sm:block text-sm text-gray-700 dark:text-gray-300">
                                {auth?.user?.name}
                            </span>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
