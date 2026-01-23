import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import { Link } from '@inertiajs/react';
import { useState, useRef } from 'react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export default function HeroSlider({ sliders = [] }) {
    const [isPlaying, setIsPlaying] = useState(true);
    const swiperRef = useRef(null);

    // Fallback slides if no sliders from database
    const defaultSlides = [
        {
            image: '/images/frontend/slider/slider-1.png',
            subtitle: "Don't miss amazing grocery deals",
            title: 'Fresh Vegetables',
            description: 'Save up to 50% off on your first order',
            button_text: 'Shop Now',
            button_link: '/shop',
            bg_color: '#3b82f6',
        },
        {
            image: '/images/frontend/slider/slider-2.png',
            subtitle: 'Fresh & Healthy Organic Food',
            title: 'Delicious Snacks',
            description: 'Get the best quality products at the lowest prices',
            button_text: 'Shop Now',
            button_link: '/shop',
            bg_color: '#f1b945',
        },
    ];

    const slides = sliders.length > 0 ? sliders : defaultSlides;

    const getImageUrl = (slide) => {
        if (!slide.image) return '/images/frontend/slider/slider-1.png';
        if (slide.image.startsWith('http')) return slide.image;
        return `/storage/${slide.image}`;
    };

    const toggleAutoplay = () => {
        if (swiperRef.current) {
            if (isPlaying) {
                swiperRef.current.autoplay.stop();
            } else {
                swiperRef.current.autoplay.start();
            }
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <div className="relative">
            <Swiper
                onSwiper={(swiper) => (swiperRef.current = swiper)}
                modules={[Pagination, Navigation, Autoplay]}
                slidesPerView={1}
                loop={slides.length > 1}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                    el: '.hero-pagination',
                    bulletClass: 'hero-bullet',
                    bulletActiveClass: 'hero-bullet-active',
                }}
                navigation={{
                    prevEl: '.hero-prev',
                    nextEl: '.hero-next',
                }}
                className="hero-slider rounded-xl overflow-hidden"
            >
                {slides.map((slide, index) => (
                    <SwiperSlide key={slide.id || index}>
                        <div
                            className="relative h-[280px] sm:h-[320px] lg:h-[340px] bg-cover bg-center"
                            style={{
                                backgroundImage: `url(${getImageUrl(slide)})`,
                                backgroundColor: slide.bg_color || '#3b82f6',
                            }}
                        >
                            {/* Content overlay */}
                            <div className="absolute inset-0 flex items-center">
                                <div className="px-6 sm:px-10 lg:px-12 w-full">
                                    <div className="max-w-md">
                                        {slide.subtitle && (
                                            <p className="text-white/80 text-sm mb-2">{slide.subtitle}</p>
                                        )}
                                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">
                                            {slide.title}
                                        </h2>
                                        {slide.description && (
                                            <p className="text-white/70 text-sm mb-5 line-clamp-2">{slide.description}</p>
                                        )}
                                        {slide.button_text && slide.button_link && (
                                            <Link
                                                href={slide.button_link}
                                                className="inline-flex items-center gap-2 bg-[#2a2a2a] hover:bg-[#1a1a1a] text-white px-5 py-2.5 rounded-md font-medium text-sm transition-colors"
                                            >
                                                {slide.button_text}
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Bottom controls bar */}
            <div className="absolute bottom-4 left-0 right-0 z-10 px-6 flex items-center justify-between">
                {/* Pagination dots */}
                <div className="hero-pagination flex items-center gap-1.5" />

                {/* Navigation controls */}
                {slides.length > 1 && (
                    <div className="flex items-center gap-2">
                        <button
                            className="hero-prev w-9 h-9 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-colors shadow-sm"
                            aria-label="Previous slide"
                        >
                            <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            className="hero-next w-9 h-9 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-colors shadow-sm"
                            aria-label="Next slide"
                        >
                            <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                        <button
                            onClick={toggleAutoplay}
                            className="w-9 h-9 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-colors shadow-sm"
                            aria-label={isPlaying ? 'Pause autoplay' : 'Start autoplay'}
                        >
                            {isPlaying ? (
                                <svg className="w-4 h-4 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                                </svg>
                            ) : (
                                <svg className="w-4 h-4 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            )}
                        </button>
                    </div>
                )}
            </div>

            {/* Custom styles for pagination bullets */}
            <style>{`
                .hero-bullet {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.5);
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .hero-bullet-active {
                    background: rgba(255, 255, 255, 0.95);
                    width: 8px;
                }
            `}</style>
        </div>
    );
}
