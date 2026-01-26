import { Head, Link, router, usePage } from '@inertiajs/react';
import FrontendLayout from '@/Layouts/FrontendLayout';
import HeroSlider from '@/Components/Frontend/HeroSlider';
import BrandSlider from '@/Components/Frontend/BrandSlider';
import ProductCard from '@/Components/Frontend/ProductCard';
import { formatCurrency } from '@/utils/currency';
import { useState, useEffect } from 'react';

export default function Home({
    sliders = [],
    featuredProducts = [],
    popularProducts = [],
    newProducts = [],
    saleProducts = [],
    featuredBrands = [],
    bestSellers = [],
    dailyDeals = [],
}) {
    const { currencies } = usePage().props;
    const currentCurrency = currencies?.selected || currencies?.default;
    const [activeTab, setActiveTab] = useState('all');
    const [countdown, setCountdown] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

    // Countdown timer for daily deals (ends at midnight)
    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            const midnight = new Date();
            midnight.setHours(24, 0, 0, 0);
            const diff = midnight - now;

            setCountdown({
                days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                mins: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
                secs: Math.floor((diff % (1000 * 60)) / 1000),
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatPrice = (amount) => formatCurrency(amount, currentCurrency);

    // Determine which products to show based on active tab
    const getDisplayProducts = () => {
        switch (activeTab) {
            case 'featured':
                return featuredProducts;
            case 'new':
                return newProducts;
            case 'sale':
                return saleProducts;
            case 'all':
            default:
                return popularProducts.length > 0 ? popularProducts : featuredProducts;
        }
    };

    const displayProducts = getDisplayProducts();
    const dealProduct = dailyDeals[0] || featuredProducts[0];

    const handleAddToBasket = (product) => {
        router.post(route('cart.add'), {
            product_id: product.id,
            quantity: 1,
        }, {
            preserveScroll: true,
        });
    };

    const tabs = [
        { id: 'all', label: 'All' },
        { id: 'featured', label: 'Featured' },
        { id: 'new', label: 'New Arrivals' },
        { id: 'sale', label: 'On Sale' },
    ];

    return (
        <FrontendLayout>
            <Head title="Home - Avelabo Marketplace" />

            <div className="container mx-auto px-4">
                {/* Hero Section */}
                <section className="mb-8 lg:mb-10 pt-4">
                    <HeroSlider sliders={sliders} />
                </section>
                {/* Featured Brands */}
                {featuredBrands.length > 0 && (
                    <section className="mb-10 lg:mb-14">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl lg:text-2xl font-bold text-heading">Featured Brands</h2>
                            <Link
                                href={route('shop')}
                                className="text-sm font-medium text-brand hover:text-brand-dark transition-colors flex items-center gap-1"
                            >
                                View All
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>
                        <BrandSlider brands={featuredBrands} />
                    </section>
                )}

                {/* Popular Products */}
                <section className="mb-10 lg:mb-14">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                        <h2 className="text-xl lg:text-2xl font-bold text-heading">Popular Products</h2>
                        <div className="flex flex-wrap gap-2">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                        activeTab === tab.id
                                            ? 'bg-brand text-white'
                                            : 'text-body hover:bg-surface-raised'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {displayProducts.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
                            {displayProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-surface-raised rounded-xl">
                            <img
                                src="/images/frontend/theme/grey-avelabo-icon.png"
                                alt="No products"
                                className="w-20 h-20 mx-auto mb-4 opacity-50"
                            />
                            <p className="text-muted mb-4">No products available yet</p>
                            <Link href="/shop" className="inline-block px-6 py-3 bg-brand text-white rounded-lg font-semibold hover:bg-brand-dark transition-colors">
                                Browse Shop
                            </Link>
                        </div>
                    )}
                </section>

                {/* Deals Section */}
                <section className="mb-10 lg:mb-14">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Deal of the Day */}
                        <div className="lg:col-span-1 bg-surface-raised rounded-xl p-6">
                            <h3 className="text-lg font-bold text-heading mb-4">Deal Of The Day</h3>
                            {dealProduct ? (
                                <div className="bg-surface rounded-xl p-4 border border-border-light">
                                    <Link href={route('product.detail', dealProduct.slug)}>
                                        <img
                                            src={dealProduct.primary_image || '/images/frontend/placeholder-product.png'}
                                            alt={dealProduct.name}
                                            className="w-full aspect-square object-contain mb-4 hover:scale-105 transition-transform"
                                        />
                                    </Link>
                                    <Link href={route('product.detail', dealProduct.slug)}>
                                        <h6 className="font-semibold text-heading mb-2 hover:text-brand transition-colors line-clamp-2">
                                            {dealProduct.name}
                                        </h6>
                                    </Link>
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-heading font-bold text-xl">{formatPrice(dealProduct.price)}</span>
                                        {dealProduct.compare_price && (
                                            <span className="text-muted line-through text-sm">{formatPrice(dealProduct.compare_price)}</span>
                                        )}
                                    </div>
                                    {/* Countdown Timer */}
                                    <div className="flex gap-2 mb-4">
                                        {[
                                            { value: countdown.days, label: 'Days' },
                                            { value: countdown.hours, label: 'Hrs' },
                                            { value: countdown.mins, label: 'Min' },
                                            { value: countdown.secs, label: 'Sec' },
                                        ].map((item, idx) => (
                                            <div key={idx} className="bg-surface-sunken rounded-lg px-2 py-1.5 text-center flex-1">
                                                <span className="text-heading font-bold text-sm block">{String(item.value).padStart(2, '0')}</span>
                                                <span className="text-[10px] text-muted">{item.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => handleAddToBasket(dealProduct)}
                                        className="w-full bg-brand hover:bg-brand-dark text-white py-3 rounded-lg font-semibold transition-colors"
                                    >
                                        Add To Basket
                                    </button>
                                </div>
                            ) : (
                                <div className="bg-surface rounded-xl p-4 text-center text-muted border border-border-light">
                                    No deals available
                                </div>
                            )}
                        </div>

                        {/* Product Columns */}
                        {[
                            { title: 'Top Selling', products: bestSellers },
                            { title: 'Trending Products', products: popularProducts.slice(0, 3) },
                            { title: 'Recently Added', products: newProducts.slice(0, 3) },
                        ].map((column, colIndex) => (
                            <div key={colIndex}>
                                <h3 className="text-lg font-bold text-heading mb-4">{column.title}</h3>
                                <div className="space-y-3">
                                    {column.products.length > 0 ? (
                                        column.products.slice(0, 3).map((product) => (
                                            <Link
                                                key={product.id}
                                                href={route('product.detail', product.slug)}
                                                className="flex gap-4 items-center bg-surface border border-border-light rounded-xl p-3 hover:border-border hover:shadow-card transition-all group"
                                            >
                                                <div className="w-20 h-20 bg-surface-raised rounded-lg overflow-hidden flex-shrink-0">
                                                    <img
                                                        src={product.primary_image || '/images/frontend/placeholder-product.png'}
                                                        alt={product.name}
                                                        className="w-full h-full object-contain p-1"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h6 className="text-heading font-semibold text-sm mb-1.5 line-clamp-2 group-hover:text-brand transition-colors">{product.name}</h6>
                                                    <div className="flex items-center gap-1 mb-1">
                                                        {[...Array(5)].map((_, i) => (
                                                            <svg
                                                                key={i}
                                                                className={`w-3 h-3 ${i < (product.rating || 0) ? 'text-warning' : 'text-border'}`}
                                                                fill="currentColor"
                                                                viewBox="0 0 20 20"
                                                            >
                                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                            </svg>
                                                        ))}
                                                    </div>
                                                    <span className="text-heading font-bold">{formatPrice(product.price)}</span>
                                                </div>
                                            </Link>
                                        ))
                                    ) : (
                                        <div className="bg-surface-raised rounded-xl p-4 text-center text-muted text-sm">
                                            No products yet
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* View All Products CTA */}
                <section className="text-center pb-10 lg:pb-14">
                    <Link
                        href="/shop"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-brand hover:bg-brand-dark text-white rounded-lg font-semibold transition-all shadow-button hover:shadow-button-hover"
                    >
                        View All Products
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </section>
            </div>
        </FrontendLayout>
    );
}
