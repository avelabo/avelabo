import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import FrontendLayout from '@/Layouts/FrontendLayout';

export default function VendorDetails2() {
    const [showPerPage, setShowPerPage] = useState('50');
    const [sortBy, setSortBy] = useState('Featured');
    const [priceRange, setPriceRange] = useState(250);

    const products = [
        { id: 1, image: '/images/frontend/shop/product-2-1.jpg', badge: 'Hot', badgeClass: 'bg-pink-500', category: 'Hodo Foods', name: 'Field Roast Chao Cheese Creamy Original', rating: 90, weight: '500g', price: 238.85, oldPrice: 245.8, description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nam beatae consectetur, atque inventore aliquam adipisci perspiciatis nostrum qui consequatur praesentium?' },
        { id: 2, image: '/images/frontend/shop/product-3-1.jpg', badge: 'Sale', badgeClass: 'bg-blue-400', category: 'Hodo Foods', name: 'Fresh Organic Mustard Leaves', rating: 90, weight: '500g', price: 238.85, oldPrice: 245.8, description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nam beatae consectetur, atque inventore aliquam adipisci perspiciatis nostrum qui consequatur praesentium?' },
        { id: 3, image: '/images/frontend/shop/product-4-1.jpg', badge: 'New', badgeClass: 'bg-brand', category: 'Hodo Foods', name: 'Organic Green Bell Pepper', rating: 90, weight: '500g', price: 238.85, oldPrice: 245.8, description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nam beatae consectetur, atque inventore aliquam adipisci perspiciatis nostrum qui consequatur praesentium?' },
        { id: 4, image: '/images/frontend/shop/product-5-1.jpg', badge: null, category: 'Hodo Foods', name: "Angie's Boomchickapop Sweet & Salty Kettle Corn", rating: 90, weight: '500g', price: 238.85, oldPrice: 245.8, description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nam beatae consectetur, atque inventore aliquam adipisci perspiciatis nostrum qui consequatur praesentium?' },
        { id: 5, image: '/images/frontend/shop/product-6-1.jpg', badge: 'Best', badgeClass: 'bg-orange-400', category: 'Hodo Foods', name: 'Foster Farms Takeout Crispy Classic Buffalo Wings', rating: 90, weight: '500g', price: 238.85, oldPrice: 245.8, description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nam beatae consectetur, atque inventore aliquam adipisci perspiciatis nostrum qui consequatur praesentium?' },
    ];

    const deals = [
        { id: 1, image: '/images/frontend/banner/banner-5.png', name: 'Seeds of Change Organic Quinoa', rating: 90, vendor: 'NestFood', price: 32.85, oldPrice: 33.8, countdown: { days: 120, hours: 8, mins: 45, secs: 32 } },
        { id: 2, image: '/images/frontend/banner/banner-6.png', name: 'Perdue Simply Smart Organics', rating: 90, vendor: 'Old El Paso', price: 24.85, oldPrice: 26.8, countdown: { days: 240, hours: 12, mins: 30, secs: 15 } },
        { id: 3, image: '/images/frontend/banner/banner-7.png', name: 'Signature Wood-Fired Mushroom', rating: 80, vendor: 'Progresso', price: 12.85, oldPrice: 13.8, countdown: { days: 365, hours: 6, mins: 15, secs: 48 } },
        { id: 4, image: '/images/frontend/banner/banner-8.png', name: 'Simply Lemonade with Raspberry', rating: 80, vendor: 'Yoplait', price: 15.85, oldPrice: 16.8, countdown: { days: 60, hours: 18, mins: 55, secs: 22 } },
    ];

    const categories = [
        { name: 'Milks & Dairies', icon: '/images/frontend/icons/category-1.svg', count: 30 },
        { name: 'Clothing', icon: '/images/frontend/icons/category-2.svg', count: 35 },
        { name: 'Pet Foods', icon: '/images/frontend/icons/category-3.svg', count: 42 },
        { name: 'Baking material', icon: '/images/frontend/icons/category-4.svg', count: 68 },
        { name: 'Fresh Fruit', icon: '/images/frontend/icons/category-5.svg', count: 87 },
    ];

    return (
        <FrontendLayout>
            <Head title="Vendor Details - Nest Food Store" />

            {/* Breadcrumb */}
            <div className="bg-white py-4 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center gap-2 text-sm">
                        <Link href="/" className="text-gray-500 hover:text-brand transition-colors">
                            <i className="fi fi-rs-home"></i>
                        </Link>
                        <span className="text-gray-500">/</span>
                        <Link href="/vendors" className="text-gray-500 hover:text-brand transition-colors">Store</Link>
                        <span className="text-gray-500">/</span>
                        <span className="text-brand">Nest Food</span>
                    </div>
                </div>
            </div>

            {/* Vendor Header Banner */}
            <section className="relative py-16 lg:py-24 bg-cover bg-center" style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/images/frontend/vendor/vendor-header-bg.png')" }}>
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
                        {/* Vendor Logo */}
                        <div className="flex-shrink-0">
                            <img src="/images/frontend/vendor/vendor-17.png" alt="Vendor Logo" className="w-32 h-32 rounded-xl object-cover border-4 border-white shadow-lg" />
                        </div>

                        {/* Vendor Info */}
                        <div className="text-center lg:text-left">
                            <span className="text-gray-300 text-sm">Since 2012</span>
                            <h1 className="text-3xl lg:text-4xl font-bold text-white font-quicksand mt-2 mb-4">
                                <Link href="/vendor" className="hover:text-brand-light transition-colors">Nest Food.,Ltd</Link>
                            </h1>
                            <div className="flex items-center justify-center lg:justify-start gap-2 mb-6">
                                <div className="flex">
                                    {[1,2,3,4,5].map((star) => (
                                        <i key={star} className={`fi fi-rs-star text-xs ${star <= 4 ? 'text-yellow-400' : 'text-gray-300'}`}></i>
                                    ))}
                                </div>
                                <span className="text-gray-300 text-sm">(4.0)</span>
                            </div>

                            <div className="grid lg:grid-cols-3 gap-6">
                                {/* Description */}
                                <div>
                                    <p className="text-white/90 text-sm leading-relaxed">Got a smooth, buttery spread in your fridge? Chances are good that it's Good Chef. This brand made Lionto's list of the most popular grocery brands across the country.</p>
                                </div>

                                {/* Contact Info */}
                                <div className="text-white/90 text-sm space-y-2">
                                    <div className="flex items-start gap-2 justify-center lg:justify-start">
                                        <img src="/images/frontend/icons/icon-location.svg" alt="" className="w-4 h-4 mt-0.5" />
                                        <span><strong>Address:</strong> 5171 W Campbell Ave, Utah 53127 United States</span>
                                    </div>
                                    <div className="flex items-start gap-2 justify-center lg:justify-start">
                                        <img src="/images/frontend/icons/icon-contact.svg" alt="" className="w-4 h-4 mt-0.5" />
                                        <span><strong>Call Us:</strong> (+91) 540-025-124553</span>
                                    </div>
                                </div>

                                {/* Social Links */}
                                <div>
                                    <h6 className="text-white font-semibold mb-3">Follow Us</h6>
                                    <div className="flex items-center justify-center lg:justify-start gap-2">
                                        <a href="#" className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center hover:bg-brand transition-colors">
                                            <img src="/images/frontend/icons/social-tw.svg" alt="Twitter" className="w-4 h-4" />
                                        </a>
                                        <a href="#" className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center hover:bg-brand transition-colors">
                                            <img src="/images/frontend/icons/social-fb.svg" alt="Facebook" className="w-4 h-4" />
                                        </a>
                                        <a href="#" className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center hover:bg-brand transition-colors">
                                            <img src="/images/frontend/icons/social-insta.svg" alt="Instagram" className="w-4 h-4" />
                                        </a>
                                        <a href="#" className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center hover:bg-brand transition-colors">
                                            <img src="/images/frontend/icons/social-pin.svg" alt="Pinterest" className="w-4 h-4" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Products Section */}
            <section className="py-12 lg:py-16">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Products List */}
                        <div className="flex-1 order-2 lg:order-1">
                            {/* Filter Bar */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-200">
                                <p className="text-gray-500">We found <strong className="text-brand">29</strong> items for you!</p>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-500 text-sm"><i className="fi fi-rs-apps mr-1"></i>Show:</span>
                                        <select
                                            value={showPerPage}
                                            onChange={(e) => setShowPerPage(e.target.value)}
                                            className="border border-gray-200 rounded px-3 py-2 text-sm focus:border-brand focus:outline-none"
                                        >
                                            <option>50</option>
                                            <option>100</option>
                                            <option>150</option>
                                            <option>All</option>
                                        </select>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-500 text-sm"><i className="fi fi-rs-apps-sort mr-1"></i>Sort by:</span>
                                        <select
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value)}
                                            className="border border-gray-200 rounded px-3 py-2 text-sm focus:border-brand focus:outline-none"
                                        >
                                            <option>Featured</option>
                                            <option>Price: Low to High</option>
                                            <option>Price: High to Low</option>
                                            <option>Avg. Rating</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Product List (Horizontal Layout) */}
                            <div className="space-y-6 mb-8">
                                {products.map((product) => (
                                    <div key={product.id} className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:border-brand hover:shadow-lg transition-all group flex flex-col md:flex-row">
                                        <div className="relative md:w-72 flex-shrink-0">
                                            <Link href="/shop/product" className="block overflow-hidden">
                                                <img src={product.image} alt={product.name} className="w-full h-64 md:h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                            </Link>
                                            {product.badge && (
                                                <div className="absolute top-3 left-3">
                                                    <span className={`${product.badgeClass} text-white px-3 py-1 rounded text-xs font-bold uppercase`}>{product.badge}</span>
                                                </div>
                                            )}
                                            <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link href="/wishlist" className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-brand hover:text-white transition-colors">
                                                    <i className="fi fi-rs-heart text-xs"></i>
                                                </Link>
                                                <Link href="/compare" className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-brand hover:text-white transition-colors">
                                                    <i className="fi fi-rs-shuffle text-xs"></i>
                                                </Link>
                                                <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-brand hover:text-white transition-colors">
                                                    <i className="fi fi-rs-eye text-xs"></i>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="p-6 flex-1">
                                            <Link href="/shop" className="text-xs text-gray-500 hover:text-brand">{product.category}</Link>
                                            <h4 className="font-quicksand font-bold text-heading text-xl mt-2 mb-3">
                                                <Link href="/shop/product" className="hover:text-brand">{product.name}</Link>
                                            </h4>
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="flex">
                                                    {[1,2,3,4,5].map((star) => (
                                                        <i key={star} className={`fi fi-rs-star text-xs ${star <= product.rating/20 ? 'text-yellow-400' : 'text-gray-300'}`}></i>
                                                    ))}
                                                </div>
                                                <span className="text-sm text-gray-500">({(product.rating/20).toFixed(1)})</span>
                                                <span className="text-sm text-gray-500">{product.weight}</span>
                                            </div>
                                            <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.description}</p>
                                            <div className="flex items-center gap-2 mb-4">
                                                <span className="text-brand text-2xl font-bold">${product.price}</span>
                                                <span className="text-gray-500 line-through">${product.oldPrice}</span>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-3">
                                                <Link href="/cart" className="bg-brand hover:bg-brand-dark text-white px-6 py-3 rounded-md font-semibold transition-colors flex items-center gap-2">
                                                    <i className="fi fi-rs-shopping-cart"></i> Add to Cart
                                                </Link>
                                                <Link href="/compare" className="text-heading hover:text-brand font-semibold flex items-center gap-2">
                                                    <i className="fi fi-rs-shuffle"></i> Add Compare
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            <nav className="flex items-center justify-center gap-2 mb-12">
                                <Link href="#" className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded hover:border-brand hover:text-brand transition-colors">
                                    <i className="fi fi-rs-arrow-small-left"></i>
                                </Link>
                                <Link href="#" className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded hover:border-brand hover:text-brand transition-colors">1</Link>
                                <Link href="#" className="w-10 h-10 flex items-center justify-center border border-brand bg-brand text-white rounded">2</Link>
                                <Link href="#" className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded hover:border-brand hover:text-brand transition-colors">3</Link>
                                <span className="w-10 h-10 flex items-center justify-center text-gray-500">...</span>
                                <Link href="#" className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded hover:border-brand hover:text-brand transition-colors">6</Link>
                                <Link href="#" className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded hover:border-brand hover:text-brand transition-colors">
                                    <i className="fi fi-rs-arrow-small-right"></i>
                                </Link>
                            </nav>

                            {/* Deals of the Day */}
                            <section>
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-2xl font-bold text-heading font-quicksand">Deals Of The Day</h3>
                                    <Link href="/shop" className="text-gray-500 hover:text-brand text-sm flex items-center gap-1">
                                        All Deals <i className="fi fi-rs-angle-right text-xs"></i>
                                    </Link>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {deals.map((deal, index) => (
                                        <div key={deal.id} className={`bg-white border border-gray-100 rounded-xl overflow-hidden ${index >= 2 ? 'hidden lg:block' : ''} ${index >= 3 ? 'hidden xl:block' : ''}`}>
                                            <Link href="/shop/product" className="block">
                                                <img src={deal.image} alt={deal.name} className="w-full" />
                                            </Link>
                                            <div className="p-4">
                                                <div className="flex items-center gap-2 mb-4">
                                                    <div className="flex flex-col items-center">
                                                        <span className="bg-brand text-white px-3 py-2 rounded font-bold text-lg">{deal.countdown.days}</span>
                                                        <span className="text-xs text-gray-500 mt-1 uppercase">Days</span>
                                                    </div>
                                                    <div className="flex flex-col items-center">
                                                        <span className="bg-brand text-white px-3 py-2 rounded font-bold text-lg">{String(deal.countdown.hours).padStart(2, '0')}</span>
                                                        <span className="text-xs text-gray-500 mt-1 uppercase">Hours</span>
                                                    </div>
                                                    <div className="flex flex-col items-center">
                                                        <span className="bg-brand text-white px-3 py-2 rounded font-bold text-lg">{String(deal.countdown.mins).padStart(2, '0')}</span>
                                                        <span className="text-xs text-gray-500 mt-1 uppercase">Mins</span>
                                                    </div>
                                                    <div className="flex flex-col items-center">
                                                        <span className="bg-brand text-white px-3 py-2 rounded font-bold text-lg">{String(deal.countdown.secs).padStart(2, '0')}</span>
                                                        <span className="text-xs text-gray-500 mt-1 uppercase">Secs</span>
                                                    </div>
                                                </div>
                                                <h6 className="font-quicksand font-semibold text-heading mb-2">
                                                    <Link href="/shop/product" className="hover:text-brand">{deal.name}</Link>
                                                </h6>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="flex">
                                                        {[1,2,3,4,5].map((star) => (
                                                            <i key={star} className={`fi fi-rs-star text-xs ${star <= deal.rating/20 ? 'text-yellow-400' : 'text-gray-300'}`}></i>
                                                        ))}
                                                    </div>
                                                    <span className="text-xs text-gray-500">({(deal.rating/20).toFixed(1)})</span>
                                                </div>
                                                <p className="text-xs text-gray-500 mb-3">By <Link href="/vendor" className="text-brand">{deal.vendor}</Link></p>
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <span className="text-brand font-bold">${deal.price}</span>
                                                        <span className="text-gray-500 line-through text-xs ml-1">${deal.oldPrice}</span>
                                                    </div>
                                                    <Link href="/cart" className="text-brand hover:text-brand-dark text-sm flex items-center gap-1">
                                                        <i className="fi fi-rs-shopping-cart"></i> Add
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>

                        {/* Sidebar */}
                        <aside className="w-full lg:w-72 flex-shrink-0 order-1 lg:order-2">
                            {/* Banner Image */}
                            <div className="rounded-xl overflow-hidden mb-6">
                                <img src="/images/frontend/banner/banner-10.jpg" alt="Banner" className="w-full" />
                            </div>

                            {/* Categories Widget */}
                            <div className="bg-white border border-gray-100 rounded-xl p-6 mb-6">
                                <h5 className="font-quicksand font-bold text-heading text-lg mb-5 pb-4 border-b border-gray-100">Category</h5>
                                <ul className="space-y-3">
                                    {categories.map((category, index) => (
                                        <li key={index}>
                                            <Link href="/shop" className="flex items-center justify-between group">
                                                <div className="flex items-center gap-3">
                                                    <img src={category.icon} alt="" className="w-6 h-6" />
                                                    <span className="text-heading group-hover:text-brand transition-colors">{category.name}</span>
                                                </div>
                                                <span className="bg-brand/10 text-brand text-xs px-2 py-1 rounded-full">{category.count}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Filter by Price Widget */}
                            <div className="bg-white border border-gray-100 rounded-xl p-6 mb-6">
                                <h5 className="font-quicksand font-bold text-heading text-lg mb-5 pb-4 border-b border-gray-100">Fill by price</h5>

                                {/* Price Range */}
                                <div className="mb-6">
                                    <input
                                        type="range"
                                        min="0"
                                        max="500"
                                        value={priceRange}
                                        onChange={(e) => setPriceRange(e.target.value)}
                                        className="w-full mb-4 accent-brand"
                                    />
                                    <div className="flex justify-between text-sm">
                                        <span>From: <strong className="text-brand">$0</strong></span>
                                        <span>To: <strong className="text-brand">${priceRange}</strong></span>
                                    </div>
                                </div>

                                {/* Color Filter */}
                                <div className="mb-6">
                                    <label className="font-bold text-heading text-sm mb-3 block">Color</label>
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" className="w-4 h-4 accent-brand" />
                                            <span className="text-sm text-gray-500">Red (56)</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" className="w-4 h-4 accent-brand" />
                                            <span className="text-sm text-gray-500">Green (78)</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" className="w-4 h-4 accent-brand" />
                                            <span className="text-sm text-gray-500">Blue (54)</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Item Condition Filter */}
                                <div className="mb-6">
                                    <label className="font-bold text-heading text-sm mb-3 block">Item Condition</label>
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" className="w-4 h-4 accent-brand" />
                                            <span className="text-sm text-gray-500">New (1506)</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" className="w-4 h-4 accent-brand" />
                                            <span className="text-sm text-gray-500">Refurbished (27)</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" className="w-4 h-4 accent-brand" />
                                            <span className="text-sm text-gray-500">Used (45)</span>
                                        </label>
                                    </div>
                                </div>

                                <Link href="/shop" className="bg-brand hover:bg-brand-dark text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors flex items-center gap-2 w-fit">
                                    <i className="fi fi-rs-filter"></i> Filter
                                </Link>
                            </div>

                            {/* Promo Banner */}
                            <div className="relative rounded-xl overflow-hidden hidden lg:block">
                                <img src="/images/frontend/banner/banner-11.png" alt="Banner" className="w-full" />
                                <div className="absolute inset-0 flex flex-col justify-center p-6">
                                    <span className="text-brand font-semibold text-sm">Organic</span>
                                    <h4 className="text-heading font-bold text-xl mt-2">
                                        Save 17%<br />
                                        on <span className="text-brand">Organic</span><br />
                                        Juice
                                    </h4>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>
        </FrontendLayout>
    );
}
