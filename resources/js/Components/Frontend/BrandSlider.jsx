import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { Link } from '@inertiajs/react';

import 'swiper/css';
import 'swiper/css/navigation';

export default function BrandSlider({ brands = [] }) {
    if (brands.length === 0) {
        return null;
    }

    return (
        <div className="relative">
            <Swiper
                modules={[Navigation]}
                slidesPerView={2}
                spaceBetween={16}
                navigation={{
                    nextEl: '.brand-next',
                    prevEl: '.brand-prev',
                }}
                breakpoints={{
                    480: { slidesPerView: 3, spaceBetween: 16 },
                    640: { slidesPerView: 4, spaceBetween: 16 },
                    768: { slidesPerView: 5, spaceBetween: 20 },
                    1024: { slidesPerView: 6, spaceBetween: 20 },
                    1280: { slidesPerView: 8, spaceBetween: 24 },
                }}
                className="brands-slider"
            >
                {brands.map((brand) => (
                    <SwiperSlide key={brand.id}>
                        <Link
                            href={`/shop?brand=${brand.slug}`}
                            className="brand-card group block text-center p-4 rounded-xl bg-white border border-border-light hover:border-brand hover:shadow-card transition-all"
                        >
                            <div className="w-20 h-20 mx-auto mb-3 flex items-center justify-center bg-surface-raised rounded-lg p-2 group-hover:bg-brand-light transition-colors">
                                {brand.logo ? (
                                    <img
                                        src={brand.logo.startsWith('http') ? brand.logo : `/storage/${brand.logo}`}
                                        alt={brand.name}
                                        className="max-w-full max-h-full object-contain"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'flex';
                                        }}
                                    />
                                ) : null}
                                <div
                                    className={`w-full h-full items-center justify-center text-2xl font-bold text-brand ${brand.logo ? 'hidden' : 'flex'}`}
                                >
                                    {brand.name.charAt(0).toUpperCase()}
                                </div>
                            </div>
                            <h6 className="text-heading font-semibold text-sm mb-1 truncate group-hover:text-brand transition-colors">
                                {brand.name}
                            </h6>
                            <p className="text-muted text-xs">
                                {brand.products_count || 0} {brand.products_count === 1 ? 'product' : 'products'}
                            </p>
                        </Link>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Navigation Buttons */}
            <button className="brand-prev absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-brand hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <button className="brand-next absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-brand hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </div>
    );
}
