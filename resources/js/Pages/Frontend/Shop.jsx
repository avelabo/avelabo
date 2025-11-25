import { useState } from 'react';
import { Link, Head } from '@inertiajs/react';
import FrontendLayout from '@/Layouts/FrontendLayout';

export default function Shop() {
    // Filter states
    const [priceRange, setPriceRange] = useState(250);
    const [selectedColors, setSelectedColors] = useState([]);
    const [selectedConditions, setSelectedConditions] = useState([]);
    const [sortBy, setSortBy] = useState('Featured');
    const [showCount, setShowCount] = useState(50);
    const [currentPage, setCurrentPage] = useState(2);
    const [showDropdown, setShowDropdown] = useState(null);

    // Sample data
    const categories = [
        { name: 'Milks & Dairies', icon: '/assets/imgs/theme/icons/category-1.svg', count: 30 },
        { name: 'Clothing', icon: '/assets/imgs/theme/icons/category-2.svg', count: 35 },
        { name: 'Pet Foods', icon: '/assets/imgs/theme/icons/category-3.svg', count: 42 },
        { name: 'Baking material', icon: '/assets/imgs/theme/icons/category-4.svg', count: 68 },
        { name: 'Fresh Fruit', icon: '/assets/imgs/theme/icons/category-5.svg', count: 87 },
    ];

    const colors = [
        { name: 'Red', count: 56 },
        { name: 'Green', count: 78 },
        { name: 'Blue', count: 54 },
    ];

    const conditions = [
        { name: 'New', count: 1506 },
        { name: 'Refurbished', count: 27 },
        { name: 'Used', count: 45 },
    ];

    const newProducts = [
        { name: 'Chen Cardigan', price: '$99.50', rating: 90, image: '/assets/imgs/shop/thumbnail-3.jpg' },
        { name: 'Chen Sweater', price: '$89.50', rating: 80, image: '/assets/imgs/shop/thumbnail-4.jpg' },
        { name: 'Colorful Jacket', price: '$25.00', rating: 60, image: '/assets/imgs/shop/thumbnail-5.jpg' },
    ];

    const products = [
        { id: 1, name: 'Seeds of Change Organic Quinoe', category: 'Snack', price: 28.85, oldPrice: 32.8, rating: 90, ratingCount: 4.0, vendor: 'NestFood', image: '/assets/imgs/shop/product-1-1.jpg', badge: 'Hot' },
        { id: 2, name: 'All Natural Italian-Style Chicken Meatballs', category: 'Hodo Foods', price: 52.85, oldPrice: 55.8, rating: 80, ratingCount: 3.5, vendor: 'Stouffer', image: '/assets/imgs/shop/product-2-1.jpg', badge: 'Sale' },
        { id: 3, name: "Angie's Boomchickapop Sweet & Salty", category: 'Snack', price: 48.85, oldPrice: 52.8, rating: 85, ratingCount: 4.0, vendor: 'StarKist', image: '/assets/imgs/shop/product-3-1.jpg', badge: 'New' },
        { id: 4, name: 'Foster Farms Takeout Crispy Classic', category: 'Vegetables', price: 17.85, oldPrice: 19.8, rating: 90, ratingCount: 4.0, vendor: 'NestFood', image: '/assets/imgs/shop/product-4-1.jpg', badge: null },
        { id: 5, name: 'Blue Diamond Almonds Lightly', category: 'Pet Foods', price: 23.85, oldPrice: 25.8, rating: 90, ratingCount: 4.0, vendor: 'NestFood', image: '/assets/imgs/shop/product-5-1.jpg', badge: '-14%' },
        { id: 6, name: 'Chobani Complete Vanilla Greek', category: 'Hodo Foods', price: 54.85, oldPrice: 55.8, rating: 80, ratingCount: 3.5, vendor: 'NestFood', image: '/assets/imgs/shop/product-6-1.jpg', badge: 'New' },
        { id: 7, name: 'Canada Dry Ginger Ale - 2 L Bottle', category: 'Meats', price: 32.85, oldPrice: 33.8, rating: 90, ratingCount: 4.0, vendor: 'NestFood', image: '/assets/imgs/shop/product-7-1.jpg', badge: 'Sale' },
        { id: 8, name: 'Encore Seafoods Stuffed Alaskan', category: 'Snack', price: 23.85, oldPrice: 25.8, rating: 90, ratingCount: 4.0, vendor: 'NestFood', image: '/assets/imgs/shop/product-8-1.jpg', badge: 'Hot' },
    ];

    const deals = [
        { name: 'Seeds of Change Organic Quinoa, Brown', price: 32.85, oldPrice: 33.8, rating: 90, ratingCount: 4.0, vendor: 'NestFood', image: '/assets/imgs/banner/banner-5.png', countdown: { days: 22, hours: 8, mins: 35, secs: 42 } },
        { name: 'Perdue Simply Smart Organics Gluten', price: 24.85, oldPrice: 26.8, rating: 90, ratingCount: 4.0, vendor: 'Old El Paso', image: '/assets/imgs/banner/banner-6.png', countdown: { days: 46, hours: 12, mins: 28, secs: 15 } },
        { name: 'Signature Wood-Fired Mushroom', price: 12.85, oldPrice: 13.8, rating: 80, ratingCount: 3.0, vendor: 'Progresso', image: '/assets/imgs/banner/banner-7.png', countdown: { days: 90, hours: 6, mins: 45, secs: 22 } },
        { name: 'Simply Lemonade with Raspberry Juice', price: 15.85, oldPrice: 16.8, rating: 80, ratingCount: 3.0, vendor: 'Yoplait', image: '/assets/imgs/banner/banner-8.png', countdown: { days: 5, hours: 18, mins: 32, secs: 8 } },
    ];

    const filterTags = ['Cabbage', 'Broccoli', 'Artichoke', 'Celery', 'Spinach'];

    const sortOptions = ['Featured', 'Price: Low to High', 'Price: High to Low', 'Release Date', 'Avg. Rating'];
    const showOptions = [50, 100, 150, 200, 'All'];

    const handleColorChange = (color) => {
        setSelectedColors(prev =>
            prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
        );
    };

    const handleConditionChange = (condition) => {
        setSelectedConditions(prev =>
            prev.includes(condition) ? prev.filter(c => c !== condition) : [...prev, condition]
        );
    };

    const getBadgeClass = (badge) => {
        switch (badge) {
            case 'Hot': return 'badge-hot';
            case 'Sale': return 'badge-sale';
            case 'New': return 'badge-new';
            default: return 'badge-best';
        }
    };

    return (
        <FrontendLayout>
            <Head title="Shop" />

            {/* Page Header / Breadcrumb */}
            <div className="py-8 mb-8">
                <div className="max-w-container mx-auto px-4">
                    <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-quicksand font-bold text-heading mb-3">Snack</h1>
                            <div className="flex items-center gap-2 text-sm">
                                <Link href="/" className="text-brand hover:text-brand-dark flex items-center gap-1">
                                    <i className="fi-rs-home"></i> Home
                                </Link>
                                <span className="text-muted">•</span>
                                <span className="text-heading">Shop</span>
                                <span className="text-muted">•</span>
                                <span className="text-body">Snack</span>
                            </div>
                        </div>
                        {/* Filter Tags */}
                        <div className="hidden xl:flex items-center gap-3 flex-wrap">
                            {filterTags.map((tag, index) => (
                                <Link
                                    key={tag}
                                    href="#"
                                    className={`flex items-center gap-2 px-4 py-2 border rounded-full text-sm transition-colors ${
                                        index === 1
                                            ? 'border-brand bg-brand/5 text-brand'
                                            : 'border-border text-heading hover:border-brand hover:text-brand'
                                    }`}
                                >
                                    <i className="fi-rs-cross text-xs"></i> {tag}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Shop Content */}
            <div className="max-w-container mx-auto px-4 mb-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar (Left) */}
                    <aside className="w-full lg:w-[280px] flex-shrink-0 order-2 lg:order-1">
                        {/* Category Widget */}
                        <div className="bg-white border border-border rounded-xl p-6 mb-6">
                            <h5 className="font-quicksand font-bold text-heading text-lg mb-5 pb-4 border-b border-border">Category</h5>
                            <ul className="space-y-3">
                                {categories.map((category) => (
                                    <li key={category.name}>
                                        <Link href="/shop" className="flex items-center justify-between group">
                                            <div className="flex items-center gap-3">
                                                <img src={category.icon} alt="" className="w-7" />
                                                <span className="text-heading group-hover:text-brand transition-colors">{category.name}</span>
                                            </div>
                                            <span className="bg-brand/10 text-brand text-xs px-2 py-1 rounded-full">{category.count}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Price Filter Widget */}
                        <div className="bg-white border border-border rounded-xl p-6 mb-6">
                            <h5 className="font-quicksand font-bold text-heading text-lg mb-5 pb-4 border-b border-border">Fill by price</h5>
                            {/* Price Range Slider */}
                            <div className="mb-5">
                                <input
                                    type="range"
                                    min="0"
                                    max="500"
                                    value={priceRange}
                                    onChange={(e) => setPriceRange(e.target.value)}
                                    className="w-full accent-brand"
                                />
                                <div className="flex justify-between text-sm mt-2">
                                    <span>From: <strong className="text-brand">$50</strong></span>
                                    <span>To: <strong className="text-brand">${priceRange}</strong></span>
                                </div>
                            </div>
                            {/* Color Filter */}
                            <div className="mb-5">
                                <label className="font-semibold text-heading block mb-3">Color</label>
                                <div className="space-y-2">
                                    {colors.map((color) => (
                                        <label key={color.name} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 accent-brand rounded"
                                                checked={selectedColors.includes(color.name)}
                                                onChange={() => handleColorChange(color.name)}
                                            />
                                            <span className="text-sm text-body">{color.name} ({color.count})</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            {/* Item Condition Filter */}
                            <div className="mb-5">
                                <label className="font-semibold text-heading block mb-3">Item Condition</label>
                                <div className="space-y-2">
                                    {conditions.map((condition) => (
                                        <label key={condition.name} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 accent-brand rounded"
                                                checked={selectedConditions.includes(condition.name)}
                                                onChange={() => handleConditionChange(condition.name)}
                                            />
                                            <span className="text-sm text-body">{condition.name} ({condition.count})</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <button className="inline-flex items-center gap-2 bg-brand hover:bg-brand-dark text-white px-5 py-2.5 rounded-md text-sm font-semibold transition-colors">
                                <i className="fi-rs-filter"></i> Filter
                            </button>
                        </div>

                        {/* New Products Widget */}
                        <div className="bg-grey-9 rounded-xl p-6 mb-6">
                            <h5 className="font-quicksand font-bold text-heading text-lg mb-5 pb-4 border-b border-border">New products</h5>
                            <div className="space-y-4">
                                {newProducts.map((product) => (
                                    <div key={product.name} className="flex gap-3">
                                        <Link href="/shop/product" className="w-20 h-20 flex-shrink-0">
                                            <img src={product.image} alt="" className="w-full h-full object-cover rounded-lg" />
                                        </Link>
                                        <div className="flex-1">
                                            <h6 className="font-quicksand font-semibold text-heading text-sm mb-1">
                                                <Link href="/shop/product" className="hover:text-brand">{product.name}</Link>
                                            </h6>
                                            <p className="text-brand font-bold text-sm mb-1">{product.price}</p>
                                            <div className="product-rate">
                                                <div className="product-rating" style={{ width: `${product.rating}%` }}></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Banner Widget */}
                        <div className="relative rounded-xl overflow-hidden hidden lg:block">
                            <img src="/assets/imgs/banner/banner-11.png" alt="" className="w-full" />
                            <div className="absolute inset-0 p-6 flex flex-col justify-end">
                                <span className="text-brand text-sm font-semibold">Oganic</span>
                                <h4 className="font-quicksand font-bold text-heading text-xl mt-2">
                                    Save 17%<br />on <span className="text-brand">Oganic</span><br />Juice
                                </h4>
                            </div>
                        </div>
                    </aside>

                    {/* Products Grid (Right) */}
                    <div className="flex-1 order-1 lg:order-2">
                        {/* Shop Filter Bar */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b border-border">
                            <p className="text-sm">We found <strong className="text-brand">29</strong> items for you!</p>
                            <div className="flex items-center gap-4">
                                {/* Show Dropdown */}
                                <div className="relative">
                                    <button
                                        className="flex items-center gap-2 text-sm text-heading"
                                        onClick={() => setShowDropdown(showDropdown === 'show' ? null : 'show')}
                                    >
                                        <i className="fi-rs-apps text-muted"></i>
                                        Show: <span className="font-semibold">{showCount}</span>
                                        <i className="fi-rs-angle-small-down text-muted"></i>
                                    </button>
                                    {showDropdown === 'show' && (
                                        <ul className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-xl py-2 min-w-[100px] z-50">
                                            {showOptions.map((option) => (
                                                <li key={option}>
                                                    <button
                                                        onClick={() => { setShowCount(option); setShowDropdown(null); }}
                                                        className={`block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm ${showCount === option ? 'text-brand' : 'text-heading'}`}
                                                    >
                                                        {option}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                                {/* Sort Dropdown */}
                                <div className="relative">
                                    <button
                                        className="flex items-center gap-2 text-sm text-heading"
                                        onClick={() => setShowDropdown(showDropdown === 'sort' ? null : 'sort')}
                                    >
                                        <i className="fi-rs-apps-sort text-muted"></i>
                                        Sort by: <span className="font-semibold">{sortBy}</span>
                                        <i className="fi-rs-angle-small-down text-muted"></i>
                                    </button>
                                    {showDropdown === 'sort' && (
                                        <ul className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-xl py-2 min-w-[180px] z-50">
                                            {sortOptions.map((option) => (
                                                <li key={option}>
                                                    <button
                                                        onClick={() => { setSortBy(option); setShowDropdown(null); }}
                                                        className={`block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm ${sortBy === option ? 'text-brand' : 'text-heading'}`}
                                                    >
                                                        {option}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Product Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-8">
                            {products.map((product) => (
                                <div key={product.id} className="product-cart-wrap bg-white border border-border rounded-xl overflow-hidden hover:border-border-2 hover:shadow-lg transition-all group">
                                    <div className="relative">
                                        <Link href="/shop/product" className="block overflow-hidden">
                                            <img src={product.image} alt="" className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300" />
                                        </Link>
                                        {product.badge && (
                                            <div className="absolute top-3 left-3">
                                                <span className={getBadgeClass(product.badge)}>{product.badge}</span>
                                            </div>
                                        )}
                                        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Link href="/wishlist" className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-brand hover:text-white transition-colors">
                                                <i className="fi-rs-heart"></i>
                                            </Link>
                                            <Link href="/compare" className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-brand hover:text-white transition-colors">
                                                <i className="fi-rs-shuffle"></i>
                                            </Link>
                                            <button className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-brand hover:text-white transition-colors">
                                                <i className="fi-rs-eye"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <Link href="/shop" className="text-xs text-muted hover:text-brand">{product.category}</Link>
                                        <h6 className="font-quicksand font-semibold text-heading text-sm mt-1 mb-2 line-clamp-2">
                                            <Link href="/shop/product" className="hover:text-brand">{product.name}</Link>
                                        </h6>
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="product-rate">
                                                <div className="product-rating" style={{ width: `${product.rating}%` }}></div>
                                            </div>
                                            <span className="text-xs text-muted">({product.ratingCount})</span>
                                        </div>
                                        <p className="text-xs text-muted mb-3">By <Link href="/vendor" className="text-brand">{product.vendor}</Link></p>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <span className="text-brand font-bold text-lg">${product.price.toFixed(2)}</span>
                                                <span className="text-muted line-through text-sm ml-2">${product.oldPrice.toFixed(2)}</span>
                                            </div>
                                            <Link href="/cart" className="w-9 h-9 bg-brand/10 hover:bg-brand text-brand hover:text-white rounded-md flex items-center justify-center transition-colors">
                                                <i className="fi-rs-shopping-cart"></i>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        <nav className="flex items-center justify-center gap-2 mb-10">
                            <button
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                className="w-10 h-10 flex items-center justify-center border border-border rounded-md hover:border-brand hover:text-brand transition-colors"
                            >
                                <i className="fi-rs-arrow-small-left"></i>
                            </button>
                            {[1, 2, 3].map((page) => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`w-10 h-10 flex items-center justify-center border rounded-md transition-colors ${
                                        currentPage === page
                                            ? 'border-brand bg-brand text-white'
                                            : 'border-border hover:border-brand hover:text-brand'
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}
                            <span className="w-10 h-10 flex items-center justify-center text-muted">...</span>
                            <button
                                onClick={() => setCurrentPage(6)}
                                className={`w-10 h-10 flex items-center justify-center border rounded-md transition-colors ${
                                    currentPage === 6
                                        ? 'border-brand bg-brand text-white'
                                        : 'border-border hover:border-brand hover:text-brand'
                                }`}
                            >
                                6
                            </button>
                            <button
                                onClick={() => setCurrentPage(Math.min(6, currentPage + 1))}
                                className="w-10 h-10 flex items-center justify-center border border-border rounded-md hover:border-brand hover:text-brand transition-colors"
                            >
                                <i className="fi-rs-arrow-small-right"></i>
                            </button>
                        </nav>

                        {/* Deals of the Day Section */}
                        <section className="mb-8">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-quicksand font-bold text-heading text-2xl">Deals Of The Day</h3>
                                <Link href="/shop" className="text-sm text-heading hover:text-brand flex items-center gap-1">
                                    All Deals <i className="fi-rs-angle-right text-xs"></i>
                                </Link>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                                {deals.map((deal, index) => (
                                    <div
                                        key={deal.name}
                                        className={`bg-white border border-border rounded-xl overflow-hidden ${
                                            index === 2 ? 'hidden lg:block' : ''
                                        } ${index === 3 ? 'hidden xl:block' : ''}`}
                                    >
                                        <Link href="/shop/product" className="block">
                                            <img src={deal.image} alt="" className="w-full" />
                                        </Link>
                                        <div className="p-5">
                                            {/* Countdown Timer */}
                                            <div className="flex justify-center gap-2 mb-4">
                                                <div className="bg-brand/10 text-brand px-3 py-2 rounded-md text-center min-w-[50px]">
                                                    <span className="block font-bold text-lg">{String(deal.countdown.days).padStart(2, '0')}</span>
                                                    <span className="text-xs">Days</span>
                                                </div>
                                                <div className="bg-brand/10 text-brand px-3 py-2 rounded-md text-center min-w-[50px]">
                                                    <span className="block font-bold text-lg">{String(deal.countdown.hours).padStart(2, '0')}</span>
                                                    <span className="text-xs">Hours</span>
                                                </div>
                                                <div className="bg-brand/10 text-brand px-3 py-2 rounded-md text-center min-w-[50px]">
                                                    <span className="block font-bold text-lg">{String(deal.countdown.mins).padStart(2, '0')}</span>
                                                    <span className="text-xs">Mins</span>
                                                </div>
                                                <div className="bg-brand/10 text-brand px-3 py-2 rounded-md text-center min-w-[50px]">
                                                    <span className="block font-bold text-lg">{String(deal.countdown.secs).padStart(2, '0')}</span>
                                                    <span className="text-xs">Secs</span>
                                                </div>
                                            </div>
                                            <h6 className="font-quicksand font-semibold text-heading text-base mb-2">
                                                <Link href="/shop/product" className="hover:text-brand">{deal.name}</Link>
                                            </h6>
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="product-rate">
                                                    <div className="product-rating" style={{ width: `${deal.rating}%` }}></div>
                                                </div>
                                                <span className="text-xs text-muted">({deal.ratingCount})</span>
                                            </div>
                                            <p className="text-xs text-muted mb-3">By <Link href="/vendor" className="text-brand">{deal.vendor}</Link></p>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <span className="text-brand font-bold text-lg">${deal.price.toFixed(2)}</span>
                                                    <span className="text-muted line-through text-sm ml-2">${deal.oldPrice.toFixed(2)}</span>
                                                </div>
                                                <Link href="/cart" className="flex items-center gap-1 bg-brand hover:bg-brand-dark text-white px-3 py-2 rounded-md text-xs font-semibold transition-colors">
                                                    <i className="fi-rs-shopping-cart"></i> Add
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </FrontendLayout>
    );
}
