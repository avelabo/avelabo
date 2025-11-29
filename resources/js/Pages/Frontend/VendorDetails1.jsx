import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import FrontendLayout from '@/Layouts/FrontendLayout';

export default function VendorDetails1() {
    const [searchQuery, setSearchQuery] = useState('');
    const [showPerPage, setShowPerPage] = useState('50');
    const [sortBy, setSortBy] = useState('Featured');

    const products = [
        { id: 1, image: '/images/frontend/shop/product-1-1.jpg', badge: 'Hot', badgeClass: 'bg-pink-500', category: 'Snack', name: 'Seeds of Change Organic Quinoa', rating: 90, vendor: 'NestFood', price: 28.85, oldPrice: 32.8 },
        { id: 2, image: '/images/frontend/shop/product-2-1.jpg', badge: 'Sale', badgeClass: 'bg-blue-400', category: 'Hodo Foods', name: 'All Natural Italian-Style Chicken Meatballs', rating: 80, vendor: 'Stouffer', price: 52.85, oldPrice: 55.8 },
        { id: 3, image: '/images/frontend/shop/product-3-1.jpg', badge: 'New', badgeClass: 'bg-brand', category: 'Snack', name: "Angie's Boomchickapop Sweet & Salty", rating: 85, vendor: 'StarKist', price: 48.85, oldPrice: 52.8 },
        { id: 4, image: '/images/frontend/shop/product-4-1.jpg', badge: null, badgeClass: null, category: 'Vegetables', name: 'Foster Farms Takeout Crispy Classic', rating: 90, vendor: 'NestFood', price: 17.85, oldPrice: 19.8 },
        { id: 5, image: '/images/frontend/shop/product-5-1.jpg', badge: '-14%', badgeClass: 'bg-orange-400', category: 'Pet Foods', name: 'Blue Diamond Almonds Lightly Salted', rating: 90, vendor: 'NestFood', price: 23.85, oldPrice: 25.8 },
        { id: 6, image: '/images/frontend/shop/product-6-1.jpg', badge: null, badgeClass: null, category: 'Hodo Foods', name: 'Chobani Complete Vanilla Greek Yogurt', rating: 90, vendor: 'NestFood', price: 54.85, oldPrice: 55.8 },
        { id: 7, image: '/images/frontend/shop/product-7-1.jpg', badge: null, badgeClass: null, category: 'Meats', name: 'Canada Dry Ginger Ale – 2 L Bottle', rating: 90, vendor: 'NestFood', price: 32.85, oldPrice: 33.8 },
        { id: 8, image: '/images/frontend/shop/product-8-1.jpg', badge: 'Sale', badgeClass: 'bg-blue-400', category: 'Snack', name: 'Encore Seafoods Stuffed Alaskan Salmon', rating: 90, vendor: 'NestFood', price: 35.85, oldPrice: 37.8 },
        { id: 9, image: '/images/frontend/shop/product-9-1.jpg', badge: 'Hot', badgeClass: 'bg-pink-500', category: 'Coffee', name: "Gorton's Beer Battered Fish Fillets", rating: 90, vendor: 'Old El Paso', price: 23.85, oldPrice: 25.8 },
        { id: 10, image: '/images/frontend/shop/product-10-1.jpg', badge: null, badgeClass: null, category: 'Cream', name: 'Haagen-Dazs Caramel Cone Ice Cream', rating: 50, vendor: 'Tyson', price: 22.85, oldPrice: 24.8 },
    ];

    const deals = [
        { id: 1, image: '/images/frontend/banner/banner-5.png', name: 'Seeds of Change Organic Quinoa, Brown', rating: 90, vendor: 'NestFood', price: 32.85, oldPrice: 33.8, countdown: { days: 120, hours: 8, mins: 45, secs: 32 } },
        { id: 2, image: '/images/frontend/banner/banner-6.png', name: 'Perdue Simply Smart Organics Gluten', rating: 90, vendor: 'Old El Paso', price: 24.85, oldPrice: 26.8, countdown: { days: 240, hours: 12, mins: 30, secs: 15 } },
        { id: 3, image: '/images/frontend/banner/banner-7.png', name: 'Signature Wood-Fired Mushroom', rating: 80, vendor: 'Progresso', price: 12.85, oldPrice: 13.8, countdown: { days: 365, hours: 6, mins: 15, secs: 48 } },
        { id: 4, image: '/images/frontend/banner/banner-8.png', name: 'Simply Lemonade with Raspberry Juice', rating: 80, vendor: 'Yoplait', price: 15.85, oldPrice: 16.8, countdown: { days: 60, hours: 18, mins: 55, secs: 22 } },
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

            {/* Vendor Header */}
            <section className="py-12 lg:py-20">
                <div className="max-w-7xl mx-auto px-4">
                    {/* Store Name & Search */}
                    <div className="text-center mb-12">
                        <h1 className="text-3xl lg:text-5xl font-bold text-heading font-quicksand mb-8">Nest Food Store</h1>
                        <div className="max-w-lg mx-auto">
                            <form className="flex" onSubmit={(e) => e.preventDefault()}>
                                <input
                                    type="text"
                                    placeholder="Search in this store..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="flex-1 border border-gray-200 border-r-0 rounded-l-md px-4 py-3 focus:border-brand focus:outline-none"
                                />
                                <button type="submit" className="bg-brand hover:bg-brand-dark text-white px-6 rounded-r-md transition-colors">
                                    <i className="fi fi-rs-search"></i>
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Main Content with Sidebar */}
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Products Section */}
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

                            {/* Product Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
                                {products.map((product) => (
                                    <div key={product.id} className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:border-brand hover:shadow-lg transition-all group">
                                        <div className="relative">
                                            <Link href="/shop/product" className="block overflow-hidden">
                                                <img src={product.image} alt={product.name} className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300" />
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
                                        <div className="p-4">
                                            <Link href="/shop" className="text-xs text-gray-500 hover:text-brand">{product.category}</Link>
                                            <h6 className="font-quicksand font-semibold text-heading text-sm mt-1 mb-2 line-clamp-2">
                                                <Link href="/shop/product" className="hover:text-brand">{product.name}</Link>
                                            </h6>
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="flex">
                                                    {[1,2,3,4,5].map((star) => (
                                                        <i key={star} className={`fi fi-rs-star text-xs ${star <= product.rating/20 ? 'text-yellow-400' : 'text-gray-300'}`}></i>
                                                    ))}
                                                </div>
                                                <span className="text-xs text-gray-500">({(product.rating/20).toFixed(1)})</span>
                                            </div>
                                            <p className="text-xs text-gray-500 mb-3">By <Link href="/vendor" className="text-brand">{product.vendor}</Link></p>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <span className="text-brand font-bold">${product.price}</span>
                                                    <span className="text-gray-500 line-through text-xs ml-1">${product.oldPrice}</span>
                                                </div>
                                                <Link href="/cart" className="w-8 h-8 bg-brand/10 hover:bg-brand text-brand hover:text-white rounded flex items-center justify-center transition-colors">
                                                    <i className="fi fi-rs-shopping-cart text-xs"></i>
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
                            {/* Vendor Info Widget */}
                            <div className="bg-brand-light rounded-xl p-6 mb-6">
                                <div className="text-center mb-6">
                                    <img src="/images/frontend/vendor/vendor-16.png" alt="Vendor Logo" className="w-24 h-24 mx-auto rounded-full object-cover mb-4" />
                                </div>
                                <div className="text-center mb-4">
                                    <span className="text-xs text-gray-500">Since 2012</span>
                                    <h4 className="font-quicksand font-bold text-heading text-lg mt-1">
                                        <Link href="/vendor" className="hover:text-brand">Nest Food.,Ltd</Link>
                                    </h4>
                                </div>
                                <div className="flex items-center justify-center gap-2 mb-4">
                                    <div className="flex">
                                        {[1,2,3,4,5].map((star) => (
                                            <i key={star} className={`fi fi-rs-star text-xs ${star <= 4 ? 'text-yellow-400' : 'text-gray-300'}`}></i>
                                        ))}
                                    </div>
                                    <span className="text-xs text-gray-500">(4.0)</span>
                                </div>
                                <p className="text-sm text-heading mb-6">Got a smooth, buttery spread in your fridge? Chances are good that it's Good Chef. This brand made Lionto's list of the most popular grocery brands across the country.</p>

                                <div className="mb-6">
                                    <h6 className="font-semibold text-heading mb-3">Follow Us</h6>
                                    <div className="flex items-center gap-2">
                                        <a href="#" className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-brand transition-colors group">
                                            <img src="/images/frontend/icons/social-tw.svg" alt="Twitter" className="w-4 h-4" />
                                        </a>
                                        <a href="#" className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-brand transition-colors group">
                                            <img src="/images/frontend/icons/social-fb.svg" alt="Facebook" className="w-4 h-4" />
                                        </a>
                                        <a href="#" className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-brand transition-colors group">
                                            <img src="/images/frontend/icons/social-insta.svg" alt="Instagram" className="w-4 h-4" />
                                        </a>
                                        <a href="#" className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-brand transition-colors group">
                                            <img src="/images/frontend/icons/social-pin.svg" alt="Pinterest" className="w-4 h-4" />
                                        </a>
                                    </div>
                                </div>

                                <div className="space-y-3 text-sm mb-6">
                                    <div className="flex items-start gap-2">
                                        <img src="/images/frontend/icons/icon-location.svg" alt="" className="w-4 h-4 mt-1" />
                                        <span className="text-heading"><strong>Address:</strong> 5171 W Campbell Ave, Utah 53127 United States</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <img src="/images/frontend/icons/icon-contact.svg" alt="" className="w-4 h-4 mt-1" />
                                        <span className="text-heading"><strong>Call Us:</strong> (+91) 540-025-124553</span>
                                    </div>
                                </div>

                                <Link href="/vendor" className="inline-flex items-center gap-2 bg-brand hover:bg-brand-dark text-white px-4 py-2 rounded-md text-sm transition-colors">
                                    Contact Seller <i className="fi fi-rs-arrow-small-right"></i>
                                </Link>
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
                        </aside>
                    </div>
                </div>
            </section>
        </FrontendLayout>
    );
}
