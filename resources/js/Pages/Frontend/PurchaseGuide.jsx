import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import FrontendLayout from '@/Layouts/FrontendLayout';

export default function PurchaseGuide() {
    const [searchQuery, setSearchQuery] = useState('');

    const categories = [
        { name: 'Milks & Dairies', icon: '/images/frontend/icons/category-1.svg', count: 30 },
        { name: 'Clothing', icon: '/images/frontend/icons/category-2.svg', count: 35 },
        { name: 'Pet Foods', icon: '/images/frontend/icons/category-3.svg', count: 42 },
        { name: 'Baking material', icon: '/images/frontend/icons/category-4.svg', count: 68 },
        { name: 'Fresh Fruit', icon: '/images/frontend/icons/category-5.svg', count: 87 },
    ];

    const trendingProducts = [
        { name: 'Chen Cardigan', price: '$99.50', image: '/images/frontend/shop/thumbnail-3.jpg', rating: 90 },
        { name: 'Chen Sweater', price: '$89.50', image: '/images/frontend/shop/thumbnail-4.jpg', rating: 80 },
        { name: 'Colorful Jacket', price: '$25.00', image: '/images/frontend/shop/thumbnail-5.jpg', rating: 60 },
        { name: 'Lorem, ipsum', price: '$25.00', image: '/images/frontend/shop/thumbnail-6.jpg', rating: 60 },
    ];

    const handleSearch = (e) => {
        e.preventDefault();
        console.log('Search:', searchQuery);
    };

    return (
        <FrontendLayout>
            <Head title="Purchase Guide" />

            {/* Breadcrumb */}
            <section className="bg-gray-50 py-4">
                <div className="max-w-7xl mx-auto px-4">
                    <nav className="flex items-center gap-2 text-sm">
                        <Link href="/" className="text-gray-400 hover:text-brand transition-colors flex items-center gap-1">
                            <i className="fi fi-rs-home text-xs"></i> Home
                        </Link>
                        <span className="text-gray-400">/</span>
                        <span className="text-gray-400">Pages</span>
                        <span className="text-gray-400">/</span>
                        <span className="text-brand">Purchase Guide</span>
                    </nav>
                </div>
            </section>

            {/* Page Content */}
            <section className="py-12 lg:py-16">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex flex-col lg:flex-row gap-8">
                            {/* Left Column - Main Content (9/12) */}
                            <div className="lg:w-9/12">
                                <div className="pr-0 lg:pr-8">
                                    {/* Header */}
                                    <div className="mb-8">
                                        <h1 className="font-quicksand font-bold text-3xl lg:text-4xl text-heading mb-4">Purchase Guide</h1>
                                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
                                            <span>By <a href="#" className="text-brand hover:underline">John</a></span>
                                            <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                                            <span>9 April 2020</span>
                                            <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                                            <span>8 mins read</span>
                                            <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                                            <span>29k Views</span>
                                        </div>
                                    </div>

                                    {/* Featured Image */}
                                    <figure className="mb-8">
                                        <img src="/images/frontend/page/guide-1.png" alt="Purchase Guide" className="w-full rounded-2xl" />
                                    </figure>

                                    {/* Guide Content */}
                                    <div className="space-y-8">
                                        {/* Section 1 */}
                                        <div>
                                            <h3 className="font-quicksand font-bold text-xl text-heading mb-4">1. Account Registering</h3>
                                            <p className="text-gray-500 mb-4">Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla modi dolores neque omnis ipsa? Quia, nam voluptas! Aut, magnam molestias:</p>
                                            <ul className="list-disc list-inside space-y-2 text-gray-500 ml-4">
                                                <li>Name (required)</li>
                                                <li>Age (required)</li>
                                                <li>Date of birth (required)</li>
                                                <li>Passport/ ID no. (required)</li>
                                                <li>Current career (required)</li>
                                                <li>Mobile phone numbers (required)</li>
                                                <li>Email address (required)</li>
                                                <li>Hobbies &amp; interests (optional)</li>
                                                <li>Social profiles (optional)</li>
                                            </ul>
                                        </div>

                                        {/* Section 2 */}
                                        <div>
                                            <h3 className="font-quicksand font-bold text-xl text-heading mb-4">2. Select Product</h3>
                                            <p className="text-gray-500">Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit officia necessitatibus repellat placeat aut enim recusandae assumenda adipisci quisquam, deserunt iure veritatis cupiditate modi aspernatur accusantium, mollitia doloribus. Velit, iste.</p>
                                        </div>

                                        {/* Section 3 */}
                                        <div>
                                            <h3 className="font-quicksand font-bold text-xl text-heading mb-4">3. Confirm Order Content</h3>
                                            <p className="text-gray-500">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Libero ut autem sed! Assumenda, nostrum non doloribus tenetur, pariatur veritatis harum natus ipsam maiores dolorem repudiandae laboriosam, cupiditate odio earum eum?</p>
                                        </div>

                                        {/* Section 4 */}
                                        <div>
                                            <h3 className="font-quicksand font-bold text-xl text-heading mb-4">4. Transaction Completed</h3>
                                            <p className="text-gray-500">Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam nesciunt nam aut magnam libero aspernatur eaque praesentium? Tempore labore quis neque? Magni.</p>
                                        </div>

                                        {/* Section 5 */}
                                        <div>
                                            <h3 className="font-quicksand font-bold text-xl text-heading mb-4">5. Accepted Credit Cards</h3>
                                            <ul className="list-disc list-inside space-y-2 text-gray-500 ml-4 mb-4">
                                                <li>Visa</li>
                                                <li>Mastercards</li>
                                                <li>American Express</li>
                                                <li>Discover</li>
                                            </ul>
                                            <p className="text-sm text-gray-400 italic">*Taxes are calculated by your local bank and location.</p>
                                        </div>

                                        {/* Section 6 */}
                                        <div>
                                            <h3 className="font-quicksand font-bold text-xl text-heading mb-4">6. Download and Setup</h3>
                                            <ul className="list-disc list-inside space-y-2 text-gray-500 ml-4">
                                                <li>Updated content on a regular basis</li>
                                                <li>Secure &amp; hassle-free payment</li>
                                                <li>1-click checkout</li>
                                                <li>Easy access &amp; smart user dashboard</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Sidebar (3/12) */}
                            <div className="lg:w-3/12">
                                <div className="space-y-8">
                                    {/* Search Widget */}
                                    <div className="bg-white border border-gray-200 rounded-xl p-5">
                                        <form onSubmit={handleSearch} className="flex border border-gray-200 rounded-md overflow-hidden">
                                            <input
                                                type="text"
                                                placeholder="Search..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="flex-1 px-4 py-3 focus:outline-none text-sm"
                                            />
                                            <button type="submit" className="px-4 text-brand hover:text-brand-dark transition-colors">
                                                <i className="fi fi-rs-search"></i>
                                            </button>
                                        </form>
                                    </div>

                                    {/* Category Widget */}
                                    <div className="bg-white border border-gray-200 rounded-xl p-5">
                                        <h5 className="font-quicksand font-bold text-heading text-lg mb-5 pb-3 border-b border-gray-200">Category</h5>
                                        <ul className="space-y-3">
                                            {categories.map((category, index) => (
                                                <li key={index}>
                                                    <Link href="/shop" className="flex items-center justify-between text-heading hover:text-brand transition-colors">
                                                        <span className="flex items-center gap-3">
                                                            <img src={category.icon} alt="" className="w-6" />
                                                            {category.name}
                                                        </span>
                                                        <span className="text-gray-400 text-sm">{category.count}</span>
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Trending Now Widget */}
                                    <div className="bg-gray-50 rounded-xl p-5">
                                        <h5 className="font-quicksand font-bold text-heading text-lg mb-5 pb-3 border-b border-gray-200">Trending Now</h5>
                                        <div className="space-y-4">
                                            {trendingProducts.map((product, index) => (
                                                <div key={index} className="flex gap-3">
                                                    <Link href="/product" className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                                                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                                    </Link>
                                                    <div className="flex-1 pt-1">
                                                        <h6 className="font-quicksand font-semibold text-heading text-sm hover:text-brand mb-1">
                                                            <Link href="/product">{product.name}</Link>
                                                        </h6>
                                                        <p className="text-brand font-bold text-sm mb-1">{product.price}</p>
                                                        <div className="flex items-center gap-1">
                                                            {[...Array(5)].map((_, i) => (
                                                                <i
                                                                    key={i}
                                                                    className={`fi fi-rs-star text-xs ${i < Math.floor(product.rating / 20) ? 'text-yellow-400' : 'text-gray-300'}`}
                                                                ></i>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Banner Widget */}
                                    <div className="hidden lg:block relative rounded-xl overflow-hidden">
                                        <img src="/images/frontend/banner/banner-11.png" alt="Organic Juice" className="w-full" />
                                        <div className="absolute top-8 left-6">
                                            <span className="text-brand font-semibold">Organic</span>
                                            <h4 className="font-quicksand font-bold text-heading text-lg leading-tight mt-2">
                                                Save 17% <br />
                                                on <span className="text-brand">Organic</span><br />
                                                Juice
                                            </h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </FrontendLayout>
    );
}
