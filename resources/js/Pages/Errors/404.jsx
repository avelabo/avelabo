import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Error404() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <>
            <Head title="Page Not Found | Avelabo" />

            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(2deg); }
                }
                @keyframes floatReverse {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(20px) rotate(-2deg); }
                }
                @keyframes drawLine {
                    from { width: 0; }
                    to { width: 80px; }
                }
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-8px); }
                }
                .animate-float { animation: float 6s ease-in-out infinite; }
                .animate-float-reverse { animation: floatReverse 7s ease-in-out infinite; }
                .animate-draw-line { animation: drawLine 1s ease-out 0.5s forwards; }
                .animate-bounce-slow { animation: bounce 2s ease-in-out infinite; }
            `}</style>

            <div className="min-h-screen bg-white relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute inset-0 pointer-events-none">
                    {/* Top right geometric shape */}
                    <div
                        className="absolute -top-20 -right-20 w-80 h-80 border-[3px] border-[#d4a853]/20 rounded-full animate-float"
                        style={{ animationDelay: '0s' }}
                    />
                    <div
                        className="absolute -top-10 -right-10 w-60 h-60 border-[3px] border-[#1a1a1a]/10 rounded-full animate-float"
                        style={{ animationDelay: '1s' }}
                    />

                    {/* Bottom left geometric shape */}
                    <div
                        className="absolute -bottom-32 -left-32 w-96 h-96 border-[3px] border-[#d4a853]/15 rounded-full animate-float-reverse"
                    />

                    {/* Scattered dots pattern - top left */}
                    <div className="absolute top-20 left-20 grid grid-cols-4 gap-3 opacity-20">
                        {[...Array(16)].map((_, i) => (
                            <div
                                key={i}
                                className="w-1.5 h-1.5 bg-[#1a1a1a] rounded-full"
                                style={{
                                    opacity: Math.random() * 0.5 + 0.3
                                }}
                            />
                        ))}
                    </div>

                    {/* Scattered dots pattern - bottom right */}
                    <div className="absolute bottom-32 right-32 grid grid-cols-5 gap-2 opacity-15">
                        {[...Array(25)].map((_, i) => (
                            <div
                                key={i}
                                className="w-1 h-1 bg-[#d4a853] rounded-full"
                            />
                        ))}
                    </div>

                    {/* Diagonal line accent */}
                    <div className="absolute top-1/4 right-1/4 w-32 h-[2px] bg-[#d4a853]/30 rotate-45 hidden lg:block" />
                    <div className="absolute bottom-1/3 left-1/3 w-24 h-[2px] bg-[#1a1a1a]/10 -rotate-45 hidden lg:block" />
                </div>

                {/* Main Content */}
                <div className="relative z-10 min-h-screen flex flex-col">
                    {/* Header */}
                    <header className="py-6 px-6 lg:px-16">
                        <div className={`transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
                            <Link href="/">
                                <img
                                    src="/images/logo/logo-web-mid.png"
                                    alt="Avelabo"
                                    className="h-8 lg:h-10"
                                />
                            </Link>
                        </div>
                    </header>

                    {/* Hero Section */}
                    <main className="flex-1 flex items-center justify-center px-6 lg:px-16 py-6">
                        <div className="max-w-4xl mx-auto text-center">
                            {/* Eyebrow */}
                            <div
                                className={`inline-flex items-center gap-3 mb-5 transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                            >
                                <span className="w-0 h-[2px] bg-[#d4a853] animate-draw-line" />
                                <span className="text-xs font-semibold tracking-[0.3em] uppercase text-[#d4a853]">
                                    Error 404
                                </span>
                                <span className="w-0 h-[2px] bg-[#d4a853] animate-draw-line" />
                            </div>

                            {/* Big 404 Number */}
                            <div
                                className={`transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                            >
                                <span className="text-[120px] sm:text-[160px] lg:text-[200px] font-bold text-[#1a1a1a]/5 leading-none select-none">
                                    404
                                </span>
                            </div>

                            {/* Main Headline - overlapping the number */}
                            <h1
                                className={`text-5xl sm:text-6xl lg:text-7xl font-bold text-[#1a1a1a] leading-[0.95] tracking-tight -mt-20 sm:-mt-28 lg:-mt-36 mb-5 transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                            >
                                Page
                                <br />
                                <span className="relative inline-block">
                                    <span className="relative z-10">Not Found</span>
                                    <span className="absolute bottom-1 left-0 w-full h-2.5 lg:h-3 bg-[#d4a853]/20 -z-0" />
                                </span>
                            </h1>

                            {/* Subheadline */}
                            <p
                                className={`text-lg lg:text-xl text-[#666666] max-w-md mx-auto mb-10 leading-relaxed transition-all duration-700 delay-400 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                            >
                                The page you're looking for doesn't exist or has been moved.
                            </p>

                            {/* Action Buttons */}
                            <div
                                className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                            >
                                <Link
                                    href="/"
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-[#1a1a1a] text-white font-medium rounded-xl hover:bg-[#333] transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                    Back to Home
                                </Link>
                                <Link
                                    href="/shop"
                                    className="inline-flex items-center gap-2 px-8 py-4 border-2 border-[#1a1a1a] text-[#1a1a1a] font-medium rounded-xl hover:bg-[#1a1a1a] hover:text-white transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                    Browse Shop
                                </Link>
                            </div>
                        </div>
                    </main>

                    {/* Footer */}
                    <footer className="py-6 px-6 lg:px-16">
                        <div
                            className={`flex flex-col sm:flex-row items-center justify-between gap-4 transition-all duration-700 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                        >
                            <p className="text-sm text-[#999999]">
                                &copy; {new Date().getFullYear()} Avelabo. All rights reserved.
                            </p>
                            <div className="flex items-center gap-6">
                                <a href="#" className="text-sm text-[#666666] hover:text-[#1a1a1a] transition-colors">
                                    Contact
                                </a>
                                <a href="#" className="text-sm text-[#666666] hover:text-[#1a1a1a] transition-colors">
                                    Privacy
                                </a>
                            </div>
                        </div>
                    </footer>
                </div>

                {/* Bottom accent bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#d4a853]" />
            </div>
        </>
    );
}
