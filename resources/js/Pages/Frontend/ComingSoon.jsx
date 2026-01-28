import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function ComingSoon() {
    const [mounted, setMounted] = useState(false);
    const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        setMounted(true);

        const getTargetDate = () => {
            const now = new Date();
            const target = new Date();
            target.setDate(now.getDate() + 1);
            target.setHours(8, 0, 0, 0);
            return target;
        };

        const targetDate = getTargetDate();

        const updateCountdown = () => {
            const now = new Date();
            const diff = targetDate - now;

            if (diff <= 0) {
                setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
                return;
            }

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setTimeLeft({ hours, minutes, seconds });
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <Head title="Coming Soon | Avelabo" />

            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(2deg); }
                }
                @keyframes floatReverse {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(20px) rotate(-2deg); }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(40px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(0.8); }
                    to { opacity: 1; transform: scale(1); }
                }
                @keyframes drawLine {
                    from { width: 0; }
                    to { width: 80px; }
                }
                .animate-float { animation: float 6s ease-in-out infinite; }
                .animate-float-reverse { animation: floatReverse 7s ease-in-out infinite; }
                .animate-pulse-slow { animation: pulse 3s ease-in-out infinite; }
                .animate-slide-up { animation: slideUp 0.8s ease-out forwards; }
                .animate-scale-in { animation: scaleIn 0.6s ease-out forwards; }
                .animate-draw-line { animation: drawLine 1s ease-out 0.5s forwards; }
                .delay-100 { animation-delay: 0.1s; }
                .delay-200 { animation-delay: 0.2s; }
                .delay-300 { animation-delay: 0.3s; }
                .delay-400 { animation-delay: 0.4s; }
                .delay-500 { animation-delay: 0.5s; }
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
                                    animationDelay: `${i * 0.1}s`,
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
                                    Launching Soon
                                </span>
                                <span className="w-0 h-[2px] bg-[#d4a853] animate-draw-line" />
                            </div>

                            {/* Main Headline */}
                            <h1
                                className={`text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1a1a1a] leading-[1] tracking-tight mb-5 transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                            >
                                Something
                                <br />
                                <span className="relative inline-block">
                                    <span className="relative z-10">Extraordinary</span>
                                    <span className="absolute bottom-1 left-0 w-full h-2 lg:h-3 bg-[#d4a853]/20 -z-0" />
                                </span>
                                <br />
                                is Coming
                            </h1>

                            {/* Subheadline */}
                            <p
                                className={`text-base lg:text-lg text-[#666666] max-w-lg mx-auto mb-8 leading-relaxed transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                            >
                                We're crafting a new shopping experience for Malawi.
                                Premium products, curated selection, delivered to your door.
                            </p>

                            {/* Countdown Timer */}
                            <div
                                className={`transition-all duration-700 delay-400 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                            >
                                <div className="flex items-center justify-center gap-4 sm:gap-6">
                                    {/* Hours */}
                                    <div className="flex flex-col items-center">
                                        <div className="w-20 h-20 sm:w-28 sm:h-28 bg-[#1a1a1a] rounded-xl flex items-center justify-center relative overflow-hidden">
                                            <span className="text-3xl sm:text-5xl font-bold text-white tabular-nums">
                                                {String(timeLeft.hours).padStart(2, '0')}
                                            </span>
                                            <div className="absolute inset-x-0 top-1/2 h-[1px] bg-white/10" />
                                        </div>
                                        <span className="mt-3 text-xs sm:text-sm font-medium tracking-wider uppercase text-[#999999]">
                                            Hours
                                        </span>
                                    </div>

                                    {/* Separator */}
                                    <div className="flex flex-col gap-2 pb-6">
                                        <div className="w-2 h-2 bg-[#d4a853] rounded-full" />
                                        <div className="w-2 h-2 bg-[#d4a853] rounded-full" />
                                    </div>

                                    {/* Minutes */}
                                    <div className="flex flex-col items-center">
                                        <div className="w-20 h-20 sm:w-28 sm:h-28 bg-[#1a1a1a] rounded-xl flex items-center justify-center relative overflow-hidden">
                                            <span className="text-3xl sm:text-5xl font-bold text-white tabular-nums">
                                                {String(timeLeft.minutes).padStart(2, '0')}
                                            </span>
                                            <div className="absolute inset-x-0 top-1/2 h-[1px] bg-white/10" />
                                        </div>
                                        <span className="mt-3 text-xs sm:text-sm font-medium tracking-wider uppercase text-[#999999]">
                                            Minutes
                                        </span>
                                    </div>

                                    {/* Separator */}
                                    <div className="flex flex-col gap-2 pb-6">
                                        <div className="w-2 h-2 bg-[#d4a853] rounded-full" />
                                        <div className="w-2 h-2 bg-[#d4a853] rounded-full" />
                                    </div>

                                    {/* Seconds */}
                                    <div className="flex flex-col items-center">
                                        <div className="w-20 h-20 sm:w-28 sm:h-28 bg-[#1a1a1a] rounded-xl flex items-center justify-center relative overflow-hidden">
                                            <span className="text-3xl sm:text-5xl font-bold text-white tabular-nums">
                                                {String(timeLeft.seconds).padStart(2, '0')}
                                            </span>
                                            <div className="absolute inset-x-0 top-1/2 h-[1px] bg-white/10" />
                                        </div>
                                        <span className="mt-3 text-xs sm:text-sm font-medium tracking-wider uppercase text-[#999999]">
                                            Seconds
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Feature Pills */}
                            <div
                                className={`flex flex-wrap justify-center gap-3 mt-10 transition-all duration-700 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                            >
                                {['Premium Quality', 'Fast Delivery', 'Secure Payments', 'Local Support'].map((feature, index) => (
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
                    <footer className="py-8 px-6 lg:px-16">
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
