import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Maintenance() {
    const [mounted, setMounted] = useState(false);
    const [dots, setDots] = useState('');

    useEffect(() => {
        setMounted(true);

        const interval = setInterval(() => {
            setDots(prev => prev.length >= 3 ? '' : prev + '.');
        }, 500);

        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <Head title="Under Maintenance | Avelabo">
                <meta name="description" content="Avelabo is currently undergoing scheduled maintenance. We're making improvements to serve you better. Please check back shortly." />
                <meta name="robots" content="noindex, nofollow" />
                <meta property="og:title" content="Under Maintenance | Avelabo" />
                <meta property="og:description" content="Avelabo is currently undergoing scheduled maintenance. We're making improvements to serve you better." />
                <meta property="og:type" content="website" />
                <meta property="og:image" content="/images/logo/logo-web-mid.png" />
                <meta name="twitter:card" content="summary" />
                <meta name="twitter:title" content="Under Maintenance | Avelabo" />
                <meta name="twitter:description" content="Avelabo is currently undergoing scheduled maintenance. We're making improvements to serve you better." />
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
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes drawLine {
                    from { width: 0; }
                    to { width: 80px; }
                }
                .animate-float { animation: float 6s ease-in-out infinite; }
                .animate-float-reverse { animation: floatReverse 7s ease-in-out infinite; }
                .animate-spin-slow { animation: spin 8s linear infinite; }
                .animate-draw-line { animation: drawLine 1s ease-out 0.5s forwards; }
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
                                    Scheduled Maintenance
                                </span>
                                <span className="w-0 h-[2px] bg-[#d4a853] animate-draw-line" />
                            </div>

                            {/* Main Headline */}
                            <h1
                                className={`text-5xl sm:text-6xl lg:text-7xl font-bold text-[#1a1a1a] leading-[0.95] tracking-tight mb-5 transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                            >
                                We're Making
                                <br />
                                <span className="relative inline-block">
                                    <span className="relative z-10">Things Better</span>
                                    <span className="absolute bottom-1 left-0 w-full h-2.5 lg:h-3 bg-[#d4a853]/20 -z-0" />
                                </span>
                            </h1>

                            {/* Subheadline */}
                            <p
                                className={`text-lg lg:text-xl text-[#666666] max-w-xl mx-auto mb-10 leading-relaxed transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                            >
                                Our site is currently undergoing scheduled maintenance.
                                We'll be back shortly with an improved experience.
                            </p>

                            {/* Maintenance Indicator */}
                            <div
                                className={`transition-all duration-700 delay-400 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                            >
                                <div className="flex items-center justify-center gap-6">
                                    {/* Gear Icon */}
                                    <div className="w-24 h-24 sm:w-32 sm:h-32 bg-[#1a1a1a] rounded-2xl flex items-center justify-center">
                                        <svg
                                            className="w-12 h-12 sm:w-16 sm:h-16 text-white animate-spin-slow"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1.5}
                                                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1.5}
                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                        </svg>
                                    </div>
                                </div>

                                {/* Working text */}
                                <p className="mt-6 text-sm font-medium text-[#999999] tracking-wider uppercase">
                                    Working on it{dots}
                                </p>
                            </div>

                            {/* Status Pills */}
                            <div
                                className={`flex flex-wrap justify-center gap-3 mt-10 transition-all duration-700 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                            >
                                {['System Upgrade', 'Performance Boost', 'New Features', 'Bug Fixes'].map((feature, index) => (
                                    <span
                                        key={feature}
                                        className="px-4 py-2 text-xs font-medium tracking-wide text-[#666666] border border-[#e5e5e5] rounded-full"
                                        style={{ animationDelay: `${0.6 + index * 0.1}s` }}
                                    >
                                        {feature}
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
