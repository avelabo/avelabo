import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay, EffectFade } from 'swiper/modules';
import { Link } from '@inertiajs/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

export default function HeroSlider({ sliders = [] }) {
    // Fallback slides if no sliders from database
    const defaultSlides = [
        {
            image: '/images/frontend/slider/slider-1.png',
            subtitle: "Don't miss amazing grocery deals",
            title: 'Fresh Vegetables',
            description: 'Save up to 50% off on your first order',
            button_text: 'Shop Now',
            button_link: '/shop',
        },
        {
            image: '/images/frontend/slider/slider-2.png',
            subtitle: 'Fresh & Healthy Organic Food',
            title: 'Delicious Snacks',
            description: 'Get the best quality products at the lowest prices',
            button_text: 'Shop Now',
            button_link: '/shop',
        },
    ];

    const slides = sliders.length > 0 ? sliders : defaultSlides;

    const getImageUrl = (slide) => {
        if (!slide.image) return '/images/frontend/slider/slider-1.png';
        if (slide.image.startsWith('http')) return slide.image;
        return `/storage/${slide.image}`;
    };

    return (
        <Swiper
            modules={[Pagination, Navigation, Autoplay, EffectFade]}
            slidesPerView={1}
            effect="fade"
            fadeEffect={{ crossFade: true }}
            loop={slides.length > 1}
            autoplay={{
                delay: 5000,
                disableOnInteraction: false,
            }}
            pagination={{ clickable: true }}
            navigation={slides.length > 1}
            className="hero-slider rounded-2xl overflow-hidden"
        >
            {slides.map((slide, index) => (
                <SwiperSlide key={slide.id || index}>
                    <div
                        className="relative h-[400px] md:h-[500px] lg:h-[580px] bg-cover bg-center rounded-2xl"
                        style={{ backgroundImage: `url(${getImageUrl(slide)})` }}
                    >
                        <div className="absolute inset-0 flex items-center">
                            <div className="container mx-auto px-8 lg:px-16">
                                <div className="max-w-lg">
                                    {slide.subtitle && (
                                        <p className="text-brand font-semibold mb-3">{slide.subtitle}</p>
                                    )}
                                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-heading mb-4">
                                        {slide.title}
                                    </h1>
                                    {slide.description && (
                                        <p className="text-gray-600 text-lg mb-8">{slide.description}</p>
                                    )}
                                    {slide.button_text && slide.button_link && (
                                        <div className="flex items-center gap-4">
                                            <Link
                                                href={slide.button_link}
                                                className="inline-flex items-center gap-2 bg-brand hover:bg-brand-dark text-white px-8 py-4 rounded-md font-semibold transition-colors"
                                            >
                                                {slide.button_text}
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                </svg>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
    );
}
