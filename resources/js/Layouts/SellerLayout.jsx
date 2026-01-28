import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function SellerLayout({ children, title }) {
    const { auth, seller } = usePage().props;
    const { url } = usePage();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.body.classList.toggle('dark');
    };

    const navigation = [
        { name: 'Dashboard', href: route('seller.dashboard'), icon: 'dashboard', current: route().current('seller.dashboard') },
        { name: 'Products', href: route('seller.products.index'), icon: 'inventory_2', current: route().current('seller.products.*') },
        { name: 'Orders', href: route('seller.orders.index'), icon: 'shopping_bag', current: route().current('seller.orders.*') },
        { name: 'Profile', href: route('seller.profile'), icon: 'person', current: route().current('seller.profile') },
        { name: 'Settings', href: route('seller.settings'), icon: 'settings', current: route().current('seller.settings') },
    ];

    return (
        <div className={`min-h-screen ${darkMode ? 'dark bg-dark-body' : 'bg-admin-body'}`}>
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-50 h-full w-64 bg-admin-sidebar text-white transition-all duration-300
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}
            >
                {/* Logo */}
                <div className="flex items-center justify-between h-16 px-4 border-b border-white/10">
                    <Link href={route('seller.dashboard')} className="flex items-center gap-3">
                        <img src="/images/logo/logo-light-web-small.png" className="h-8" alt="Avelabo Seller" />
                    </Link>
                    <button
                        className="lg:hidden text-white"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <span className="material-icons">close</span>
                    </button>
                </div>

                {/* Seller Info */}
                <div className="p-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                            <span className="material-icons text-brand-2">storefront</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">
                                {seller?.shop_name || 'My Shop'}
                            </p>
                            <p className="text-xs text-white/50">
                                {seller?.status === 'approved' ? (
                                    <span className="inline-flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                                        Verified
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></span>
                                        Pending
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="p-4 overflow-y-auto h-[calc(100%-64px-80px-56px)]">
                    <ul className="space-y-1">
                        {navigation.map((item) => (
                            <li key={item.name}>
                                <Link
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                                        ${item.current
                                            ? 'bg-brand text-white'
                                            : 'hover:bg-white/10'
                                        }
                                    `}
                                >
                                    <span className="material-icons text-xl">{item.icon}</span>
                                    <span className="sidebar-text">{item.name}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Back to Store */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
                    <Link
                        href={route('home')}
                        className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
                    >
                        <span className="material-icons text-lg">arrow_back</span>
                        Back to Store
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <div className="transition-all duration-300 lg:ml-64">
                {/* Top Header */}
                <header className="sticky top-0 z-30 bg-white dark:bg-dark-sidebar shadow-sm h-16">
                    <div className="flex items-center justify-between h-full px-6">
                        {/* Left Side */}
                        <div className="flex items-center gap-4">
                            <button
                                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10"
                                onClick={() => setSidebarOpen(true)}
                            >
                                <span className="material-icons">menu</span>
                            </button>

                            <h1 className="text-lg font-semibold text-heading dark:text-white">
                                {title || 'Seller Dashboard'}
                            </h1>
                        </div>

                        {/* Right Side */}
                        <div className="flex items-center gap-3">
                            {/* Dark Mode Toggle */}
                            <button
                                onClick={toggleDarkMode}
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10"
                            >
                                <span className="material-icons text-xl">
                                    {darkMode ? 'light_mode' : 'dark_mode'}
                                </span>
                            </button>

                            {/* Notifications */}
                            <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10">
                                <span className="material-icons text-xl">notifications</span>
                            </button>

                            {/* Profile */}
                            <div className="relative">
                                <button
                                    onClick={() => setProfileOpen(!profileOpen)}
                                    className="flex items-center gap-3"
                                >
                                    <div className="w-9 h-9 bg-brand/10 rounded-full flex items-center justify-center">
                                        <span className="material-icons text-brand text-lg">person</span>
                                    </div>
                                    <span className="hidden sm:block text-sm font-medium text-heading dark:text-white">
                                        {auth?.user?.name}
                                    </span>
                                </button>

                                {profileOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-dark-card rounded-lg shadow-dropdown z-50">
                                        <div className="p-4 border-b border-border-light dark:border-white/10">
                                            <p className="font-medium text-heading dark:text-white">{auth?.user?.name}</p>
                                            <p className="text-sm text-body">{auth?.user?.email}</p>
                                        </div>
                                        <div className="py-2">
                                            <Link href={route('seller.profile')} className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 dark:hover:bg-white/5 text-sm">
                                                <span className="material-icons text-sm">person</span>
                                                My Profile
                                            </Link>
                                            <Link href={route('seller.settings')} className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 dark:hover:bg-white/5 text-sm">
                                                <span className="material-icons text-sm">settings</span>
                                                Settings
                                            </Link>
                                        </div>
                                        <div className="border-t border-border-light dark:border-white/10 py-2">
                                            <Link href="/logout" method="post" as="button" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 dark:hover:bg-white/5 w-full text-left text-danger text-sm">
                                                <span className="material-icons text-sm">logout</span>
                                                Logout
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
