import { useEffect, useState } from 'react';

export default function NewsletterSuccessModal({ isOpen, onClose }) {
    const [animationPhase, setAnimationPhase] = useState(0);

    useEffect(() => {
        if (isOpen) {
            // Stagger the animation phases
            setAnimationPhase(1);
            const timer1 = setTimeout(() => setAnimationPhase(2), 150);
            const timer2 = setTimeout(() => setAnimationPhase(3), 300);
            const timer3 = setTimeout(() => setAnimationPhase(4), 450);

            return () => {
                clearTimeout(timer1);
                clearTimeout(timer2);
                clearTimeout(timer3);
            };
        } else {
            setAnimationPhase(0);
        }
    }, [isOpen]);

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-[#1a1a1a]/60 backdrop-blur-sm transition-opacity duration-300 ${
                    animationPhase >= 1 ? 'opacity-100' : 'opacity-0'
                }`}
                onClick={onClose}
            />

            {/* Modal */}
            <div
                className={`relative w-full max-w-md transform transition-all duration-500 ${
                    animationPhase >= 1
                        ? 'opacity-100 scale-100 translate-y-0'
                        : 'opacity-0 scale-95 translate-y-4'
                }`}
            >
                {/* Decorative glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-[#f1b945] via-[#e5ad3a] to-[#f1b945] rounded-3xl blur-lg opacity-40 animate-pulse" />

                {/* Main card */}
                <div className="relative bg-white rounded-2xl overflow-hidden shadow-2xl">
                    {/* Top decorative strip */}
                    <div className="h-2 bg-gradient-to-r from-[#f1b945] via-[#d4a853] to-[#f1b945]" />

                    {/* Content */}
                    <div className="px-8 py-10 text-center">
                        {/* Animated checkmark circle */}
                        <div
                            className={`relative mx-auto mb-6 w-24 h-24 transition-all duration-500 delay-150 ${
                                animationPhase >= 2 ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                            }`}
                        >
                            {/* Outer ring with gradient */}
                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#f1b945] to-[#d4a853] p-1">
                                <div className="w-full h-full rounded-full bg-white" />
                            </div>

                            {/* Inner circle with check */}
                            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-[#f1b945] to-[#d4a853] flex items-center justify-center">
                                <svg
                                    className={`w-10 h-10 text-white transition-all duration-300 delay-300 ${
                                        animationPhase >= 3 ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                                    }`}
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={3}
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M5 13l4 4L19 7"
                                        className={animationPhase >= 3 ? 'animate-draw-check' : ''}
                                        style={{
                                            strokeDasharray: 24,
                                            strokeDashoffset: animationPhase >= 3 ? 0 : 24,
                                            transition: 'stroke-dashoffset 0.4s ease-out 0.3s'
                                        }}
                                    />
                                </svg>
                            </div>

                            {/* Sparkle decorations */}
                            <div className={`absolute -top-1 -right-1 transition-all duration-300 delay-500 ${
                                animationPhase >= 4 ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                            }`}>
                                <svg className="w-5 h-5 text-[#f1b945]" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
                                </svg>
                            </div>
                            <div className={`absolute -bottom-1 -left-2 transition-all duration-300 delay-600 ${
                                animationPhase >= 4 ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                            }`}>
                                <svg className="w-4 h-4 text-[#d4a853]" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
                                </svg>
                            </div>
                            <div className={`absolute top-1 -left-3 transition-all duration-300 delay-700 ${
                                animationPhase >= 4 ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                            }`}>
                                <svg className="w-3 h-3 text-[#f1b945]/70" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
                                </svg>
                            </div>
                        </div>

                        {/* Heading */}
                        <h3
                            className={`text-2xl font-bold text-[#1a1a1a] mb-3 transition-all duration-500 delay-200 ${
                                animationPhase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                            }`}
                        >
                            You're on the list!
                        </h3>

                        {/* Description */}
                        <p
                            className={`text-[#666666] mb-8 leading-relaxed transition-all duration-500 delay-300 ${
                                animationPhase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                            }`}
                        >
                            Thanks for subscribing to our newsletter. Get ready for exclusive deals, new arrivals, and special offers delivered straight to your inbox.
                        </p>

                        {/* Features list */}
                        <div
                            className={`flex flex-wrap justify-center gap-3 mb-8 transition-all duration-500 delay-400 ${
                                animationPhase >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                            }`}
                        >
                            {['Early access', 'Exclusive deals', 'New arrivals'].map((item, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#f1b945]/10 text-[#1a1a1a] text-sm font-medium rounded-full"
                                >
                                    <svg className="w-3.5 h-3.5 text-[#f1b945]" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    {item}
                                </span>
                            ))}
                        </div>

                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className={`w-full bg-[#1a1a1a] hover:bg-[#000000] text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${
                                animationPhase >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                            }`}
                            style={{ transitionDelay: '500ms' }}
                        >
                            Continue Shopping
                        </button>
                    </div>

                    {/* Bottom decorative pattern */}
                    <div className="h-1 bg-gradient-to-r from-transparent via-[#f1b945]/30 to-transparent" />
                </div>

                {/* Close X button */}
                <button
                    onClick={onClose}
                    className={`absolute -top-3 -right-3 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-[#666666] hover:text-[#1a1a1a] hover:scale-110 transition-all duration-300 ${
                        animationPhase >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                    }`}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <style>{`
                @keyframes draw-check {
                    to {
                        stroke-dashoffset: 0;
                    }
                }
                .animate-draw-check {
                    animation: draw-check 0.4s ease-out forwards;
                }
            `}</style>
        </div>
    );
}
