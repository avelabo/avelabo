import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden">
            {/* Background Layer */}
            <div className="fixed inset-0 -z-10">
                {/* Base gradient - warm cream to soft gray */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#faf8f5] via-[#f5f3f0] to-[#f0eeeb] dark:from-[#1a1a1a] dark:via-[#141414] dark:to-[#0f0f0f]" />

                {/* Subtle radial glow from top-right with brand gold */}
                <div className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] rounded-full bg-gradient-radial from-[#f1b945]/[0.08] via-[#f1b945]/[0.03] to-transparent dark:from-[#f1b945]/[0.05] dark:via-[#f1b945]/[0.02] dark:to-transparent blur-3xl" />

                {/* Secondary glow from bottom-left */}
                <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-gradient-radial from-[#d4a853]/[0.06] via-[#d4a853]/[0.02] to-transparent dark:from-[#d4a853]/[0.04] dark:via-transparent dark:to-transparent blur-3xl" />

                {/* Subtle grid pattern overlay */}
                <div
                    className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]"
                    style={{
                        backgroundImage: `linear-gradient(#1a1a1a 1px, transparent 1px), linear-gradient(90deg, #1a1a1a 1px, transparent 1px)`,
                        backgroundSize: '60px 60px'
                    }}
                />

                {/* Noise texture for subtle depth */}
                <div
                    className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
                    }}
                />
            </div>

            {/* Header */}
            <header className="relative bg-white/60 dark:bg-[#1a1a1a]/60 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center group">
                        <img
                            src="/images/logo/logo-web-small.png"
                            className="h-9 transition-transform duration-300 group-hover:scale-[1.02]"
                            alt="Avelabo"
                        />
                    </Link>
                    <nav className="flex items-center gap-1">
                        <Link
                            href={route('home')}
                            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/70 dark:hover:bg-white/5 transition-all duration-200"
                        >
                            Home
                        </Link>
                        <Link
                            href={route('shop')}
                            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/70 dark:hover:bg-white/5 transition-all duration-200"
                        >
                            Shop
                        </Link>
                    </nav>
                </div>
            </header>

            {/* Content */}
            <main className="relative flex-1 flex items-center justify-center px-6 py-12">
                {/* Form Card */}
                <div className="w-full max-w-[460px]">
                    <div className="bg-white/80 dark:bg-[#1a1a1a]/80 backdrop-blur-xl rounded-2xl shadow-xl shadow-black/[0.03] dark:shadow-black/20 border border-gray-200/60 dark:border-gray-800/60 p-8 sm:p-12">
                        {children}
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="relative py-6 text-center">
                <p className="text-xs text-gray-400 dark:text-gray-500">
                    &copy; {new Date().getFullYear()} Avelabo. All rights reserved.
                </p>
            </footer>
        </div>
    );
}
