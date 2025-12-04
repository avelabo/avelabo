import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center">
                        <img src="/images/logo/logo-web-small.png" className="h-10" alt="Avelabo" />
                    </Link>
                    <nav className="flex items-center gap-4">
                        <Link
                            href={route('home')}
                            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                        >
                            Home
                        </Link>
                        <Link
                            href={route('shop')}
                            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                        >
                            Shop
                        </Link>
                    </nav>
                </div>
            </header>

            {/* Content */}
            <main className="flex-1 flex items-center justify-center p-4 py-12">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        &copy; {new Date().getFullYear()} Avelabo. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
