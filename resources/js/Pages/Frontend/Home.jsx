import { Head, Link } from '@inertiajs/react';
import FrontendLayout from '@/Layouts/FrontendLayout';
import HeroSlider from '@/Components/Frontend/HeroSlider';
import CategorySlider from '@/Components/Frontend/CategorySlider';
import ProductCard from '@/Components/Frontend/ProductCard';

export default function Home({ featuredProducts = [], popularProducts = [] }) {
    // Sample products data (in real app, this comes from backend)
    const sampleProducts = [
        { id: 1, name: 'Seeds of Change Organic Quinoa', slug: 'organic-quinoa', category: 'Snack', brand: 'NestFood', rating: 4, reviews: 4, currentPrice: 28.85, oldPrice: 32.00, badge: 'hot', image: '/images/frontend/shop/product-1-1.jpg', hoverImage: '/images/frontend/shop/product-1-2.jpg' },
        { id: 2, name: 'All Natural Italian-Style Chicken Meatballs', slug: 'chicken-meatballs', category: 'Hodo Foods', brand: 'Stouffer', rating: 5, reviews: 5, currentPrice: 52.85, oldPrice: 55.00, badge: 'sale', image: '/images/frontend/shop/product-2-1.jpg', hoverImage: '/images/frontend/shop/product-2-2.jpg' },
        { id: 3, name: 'Angie\'s Boomchickapop Sweet & Salty', slug: 'boomchickapop', category: 'Snack', brand: 'StarKist', rating: 4, reviews: 3, currentPrice: 48.85, oldPrice: 52.00, badge: 'new', image: '/images/frontend/shop/product-3-1.jpg', hoverImage: '/images/frontend/shop/product-3-2.jpg' },
        { id: 4, name: 'Foster Farms Takeout Crispy Classic', slug: 'crispy-classic', category: 'Vegetables', brand: 'NestFood', rating: 5, reviews: 8, currentPrice: 17.85, oldPrice: 19.00, badge: 'best', image: '/images/frontend/shop/product-4-1.jpg', hoverImage: '/images/frontend/shop/product-4-2.jpg' },
        { id: 5, name: 'Blue Diamond Almonds Lightly Salted', slug: 'almonds-salted', category: 'Pet Foods', brand: 'NestFood', rating: 3, reviews: 2, currentPrice: 23.85, oldPrice: 25.00, discount: '-15%', image: '/images/frontend/shop/product-5-1.jpg', hoverImage: '/images/frontend/shop/product-5-2.jpg' },
        { id: 6, name: 'Chobani Complete Vanilla Greek', slug: 'chobani-vanilla', category: 'Hodo Foods', brand: 'NestFood', rating: 4, reviews: 6, currentPrice: 54.85, oldPrice: 55.00, badge: 'hot', image: '/images/frontend/shop/product-6-1.jpg', hoverImage: '/images/frontend/shop/product-6-2.jpg' },
        { id: 7, name: 'Canada Dry Ginger Ale - 2 L Bottle', slug: 'ginger-ale', category: 'Drinks', brand: 'NestFood', rating: 5, reviews: 12, currentPrice: 32.85, oldPrice: 35.00, image: '/images/frontend/shop/product-7-1.jpg', hoverImage: '/images/frontend/shop/product-7-2.jpg' },
        { id: 8, name: 'Encore Seafoods Stuffed Alaskan', slug: 'stuffed-alaskan', category: 'Cream', brand: 'NestFood', rating: 4, reviews: 4, currentPrice: 35.85, oldPrice: 37.00, badge: 'new', image: '/images/frontend/shop/product-8-1.jpg', hoverImage: '/images/frontend/shop/product-8-2.jpg' },
        { id: 9, name: 'Gorton\'s Beer Battered Fish Fillets', slug: 'fish-fillets', category: 'Snack', brand: 'Old El Paso', rating: 4, reviews: 7, currentPrice: 23.85, oldPrice: 25.00, image: '/images/frontend/shop/product-9-1.jpg', hoverImage: '/images/frontend/shop/product-9-2.jpg' },
        { id: 10, name: 'Haagen-Dazs Caramel Cone Ice Cream', slug: 'caramel-ice-cream', category: 'Cream', brand: 'Tyson', rating: 5, reviews: 15, currentPrice: 22.85, oldPrice: 24.00, badge: 'hot', image: '/images/frontend/shop/product-10-1.jpg', hoverImage: '/images/frontend/shop/product-10-2.jpg' },
    ];

    const products = featuredProducts.length > 0 ? featuredProducts : sampleProducts;

    return (
        <FrontendLayout>
            <Head title="Home" />

            <div className="container mx-auto px-4 py-8">
                {/* Hero Section */}
                <section className="mb-12">
                    <HeroSlider />
                </section>

                {/* Featured Categories */}
                <section className="mb-12">
                    <h3 className="text-2xl font-bold text-heading mb-6">Featured Categories</h3>
                    <CategorySlider />
                </section>

                {/* Promotional Banners */}
                <section className="mb-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { image: '/images/frontend/banner/banner-1.png', title: 'Everyday Fresh & Clean with Our Products', link: '/shop' },
                            { image: '/images/frontend/banner/banner-2.png', title: 'Make your Breakfast Healthy and Easy', link: '/shop' },
                            { image: '/images/frontend/banner/banner-3.png', title: 'The best Organic Products Online', link: '/shop' },
                        ].map((banner, index) => (
                            <Link
                                key={index}
                                href={banner.link}
                                className="relative rounded-xl overflow-hidden group h-48"
                            >
                                <img
                                    src={banner.image}
                                    alt={banner.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent flex items-center p-6">
                                    <h4 className="text-white font-bold text-xl max-w-[60%]">{banner.title}</h4>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Popular Products */}
                <section className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold text-heading">Popular Products</h3>
                        <div className="flex gap-2">
                            {['All', 'Milks & Dairies', 'Coffes & Teas', 'Pet Foods', 'Meats', 'Vegetables', 'Fruits'].map((tab, index) => (
                                <button
                                    key={index}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                        index === 0
                                            ? 'bg-brand text-white'
                                            : 'text-heading hover:bg-gray-100'
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </section>

                {/* Deals Section */}
                <section className="mb-12">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Deal of the Day */}
                        <div className="lg:col-span-1 bg-brand-light rounded-xl p-6">
                            <h3 className="text-xl font-bold text-heading mb-4">Deals Of The Day</h3>
                            <div className="bg-white rounded-xl p-4">
                                <img
                                    src="/images/frontend/shop/product-5-1.jpg"
                                    alt="Deal"
                                    className="w-full aspect-square object-contain mb-4"
                                />
                                <h6 className="font-semibold text-heading mb-2">Seeds of Change Organic Quinoa</h6>
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-brand font-bold text-xl">$32.85</span>
                                    <span className="text-body line-through text-sm">$45.00</span>
                                </div>
                                {/* Countdown Timer Placeholder */}
                                <div className="flex gap-2 mb-4">
                                    {['572', '11', '27', '32'].map((num, idx) => (
                                        <div key={idx} className="bg-brand/10 rounded px-2 py-1 text-center">
                                            <span className="text-brand font-bold">{num}</span>
                                            <span className="text-xs text-body block">{['Days', 'Hours', 'Mins', 'Sec'][idx]}</span>
                                        </div>
                                    ))}
                                </div>
                                <button className="w-full bg-brand hover:bg-brand-dark text-white py-3 rounded-md font-semibold transition-colors">
                                    Add To Cart
                                </button>
                            </div>
                        </div>

                        {/* Product Columns */}
                        {['Top Selling', 'Trending Products', 'Recently Added'].map((title, colIndex) => (
                            <div key={colIndex}>
                                <h3 className="text-xl font-bold text-heading mb-4">{title}</h3>
                                <div className="space-y-4">
                                    {products.slice(colIndex * 3, colIndex * 3 + 3).map((product) => (
                                        <div key={product.id} className="flex gap-4 items-center bg-white border border-gray-100 rounded-lg p-3">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-20 h-20 object-contain"
                                            />
                                            <div>
                                                <h6 className="text-heading font-semibold text-sm mb-1 line-clamp-2">{product.name}</h6>
                                                <div className="flex items-center gap-1 mb-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <svg key={i} className={`w-3 h-3 ${i < product.rating ? 'text-brand-2' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                    ))}
                                                </div>
                                                <span className="text-brand font-bold">${product.currentPrice.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </FrontendLayout>
    );
}
