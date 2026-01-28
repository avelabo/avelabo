import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Error503() {
    const [mounted, setMounted] = useState(false);
    const [dots, setDots] = useState('');

    useEffect(() => {
        setMounted(true);

        const interval = setInterval(() => {
            setDots(prev => prev.length >= 3 ? '' : prev + '.');
        }, 500);

        return () => clearInterval(interval);
    }, []);

    const handleRefresh = () => {
        window.location.reload();
    };

    return (
        <>
            <Head title="Service Unavailable | Avelabo">
                <meta name="description" content="Avelabo is temporarily unavailable due to high traffic or maintenance. Our team is working on it. Please try again shortly." />
                <meta name="robots" content="noindex, nofollow" />
                <meta property="og:title" content="Service Unavailable | Avelabo" />
                <meta property="og:description" content="Avelabo is temporarily unavailable. Our team is working on it. Please try again shortly." />
                <meta property="og:type" content="website" />
                <meta property="og:image" content="/images/logo/logo-web-mid.png" />
                <meta name="twitter:card" content="summary" />
                <meta name="twitter:title" content="Service Unavailable | Avelabo" />
                <meta name="twitter:description" content="Avelabo is temporarily unavailable. Please try again shortly." />
                <meta httpEquiv="retry-after" content="300" />
            </Head>

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
                @keyframes pulse {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.05); opacity: 0.8; }
                }
                .animate-float { animation: float 6s ease-in-out infinite; }
                .animate-float-reverse { animation: floatReverse 7s ease-in-out infinite; }
                .animate-draw-line { animation: drawLine 1s ease-out 0.5s forwards; }
                .animate-pulse-scale { animation: pulse 2s ease-in-out infinite; }
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
                            <img
                                src="/images/logo/logo-web-mid.png"
                                alt="Avelabo"
                                className="h-8 lg:h-10"
                            />
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
                                    Error 503
                                </span>
                                <span className="w-0 h-[2px] bg-[#d4a853] animate-draw-line" />
                            </div>

                            {/* Server Icon */}
                            <div
                                className={`mb-8 transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                            >
                                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-[#1a1a1a] rounded-2xl flex items-center justify-center mx-auto animate-pulse-scale">
                                    <svg
                                        className="w-12 h-12 sm:w-16 sm:h-16 text-[#d4a853]"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
                                        />
                                    </svg>
                                </div>
                            </div>

                            {/* Main Headline */}
                            <h1
                                className={`text-5xl sm:text-6xl lg:text-7xl font-bold text-[#1a1a1a] leading-[0.95] tracking-tight mb-5 transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                            >
                                Service
                                <br />
                                <span className="relative inline-block">
                                    <span className="relative z-10">Unavailable</span>
                                    <span className="absolute bottom-1 left-0 w-full h-2.5 lg:h-3 bg-[#d4a853]/20 -z-0" />
                                </span>
                            </h1>

                            {/* Subheadline */}
                            <p
                                className={`text-lg lg:text-xl text-[#666666] max-w-lg mx-auto mb-10 leading-relaxed transition-all duration-700 delay-400 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                            >
                                Our servers are temporarily overloaded or under maintenance. Please try again shortly.
                            </p>

                            {/* Status */}
                            <div
                                className={`mb-10 transition-all duration-700 delay-450 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                            >
                                <p className="text-sm font-medium text-[#999999] tracking-wider uppercase">
                                    Reconnecting{dots}
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div
                                className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                            >
                                <button
                                    onClick={handleRefresh}
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-[#1a1a1a] text-white font-medium rounded-xl hover:bg-[#333] transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Try Again
                                </button>
                            </div>

                            {/* Info Pills */}
                            <div
                                className={`flex flex-wrap justify-center gap-3 mt-10 transition-all duration-700 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                            >
                                {['High Traffic', 'Server Busy', 'Try Again Soon'].map((info, index) => (
                                    <span
                                        key={info}
                                        className="px-4 py-2 text-xs font-medium tracking-wide text-[#666666] border border-[#e5e5e5] rounded-full"
                                        style={{ animationDelay: `${0.6 + index * 0.1}s` }}
                                    >
                                        {info}
                                    </span>
                                ))}
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
