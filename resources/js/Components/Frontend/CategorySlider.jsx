import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { Link } from '@inertiajs/react';

import 'swiper/css';
import 'swiper/css/navigation';

export default function CategorySlider() {
    const categories = [
        { name: 'Cake & Milk', image: '/images/frontend/shop/cat-1.png', count: 26, bg: '#F2FCE4' },
        { name: 'Organic Kiwi', image: '/images/frontend/shop/cat-2.png', count: 28, bg: '#FFFCEB' },
        { name: 'Peach', image: '/images/frontend/shop/cat-3.png', count: 14, bg: '#ECFFEC' },
        { name: 'Red Apple', image: '/images/frontend/shop/cat-4.png', count: 54, bg: '#FEEFEA' },
        { name: 'Snack', image: '/images/frontend/shop/cat-5.png', count: 56, bg: '#FFF3EB' },
        { name: 'Vegetables', image: '/images/frontend/shop/cat-6.png', count: 72, bg: '#FFF3FF' },
        { name: 'Strawberry', image: '/images/frontend/shop/cat-7.png', count: 36, bg: '#F2FCE4' },
        { name: 'Black plum', image: '/images/frontend/shop/cat-8.png', count: 123, bg: '#FEEFEA' },
        { name: 'Custard Apple', image: '/images/frontend/shop/cat-9.png', count: 34, bg: '#FFFCEB' },
        { name: 'Coffe & Tea', image: '/images/frontend/shop/cat-10.png', count: 89, bg: '#FEEFEA' },
    ];

    return (
        <div className="relative">
            <Swiper
                modules={[Navigation]}
                slidesPerView={2}
                spaceBetween={16}
                navigation={{
                    nextEl: '.category-next',
                    prevEl: '.category-prev',
                }}
                breakpoints={{
                    480: { slidesPerView: 3, spaceBetween: 16 },
                    640: { slidesPerView: 4, spaceBetween: 16 },
                    768: { slidesPerView: 5, spaceBetween: 20 },
                    1024: { slidesPerView: 8, spaceBetween: 20 },
                    1280: { slidesPerView: 10, spaceBetween: 24 },
                }}
                className="categories-slider"
            >
                {categories.map((category, index) => (
                    <SwiperSlide key={index}>
                        <Link
                            href={`/shop?category=${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                            className="category-card block text-center p-4 rounded-xl"
                            style={{ backgroundColor: category.bg }}
                        >
                            <img
                                src={category.image}
                                alt={category.name}
                                className="w-16 h-16 mx-auto mb-3 object-contain"
                            />
                            <h6 className="text-heading font-semibold text-sm mb-1">{category.name}</h6>
                            <p className="text-body text-xs">{category.count} items</p>
                        </Link>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Navigation Buttons */}
            <button className="category-prev absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-brand hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <button className="category-next absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-brand hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </div>
    );
}
