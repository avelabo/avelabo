import { Link } from '@inertiajs/react';
import { useState } from 'react';

export default function Header({ isSticky, onMobileMenuToggle }) {
    const [categoriesOpen, setCategoriesOpen] = useState(false);

    return (
        <>
            {/* Top Bar */}
            <div className="hidden lg:block bg-white border-b border-gray-100">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between py-2 text-sm">
                        <div className="flex items-center gap-6 text-body">
                            <span>About Us</span>
                            <span>|</span>
                            <span>My Account</span>
                            <span>|</span>
                            <span>Wishlist</span>
                            <span>|</span>
                            <span>Order Tracking</span>
                        </div>
                        <div className="flex items-center gap-4 text-body">
                            <span>Need help? Call Us: <strong className="text-brand">1900 - 888</strong></span>
                            <span>|</span>
                            <select className="bg-transparent border-none text-sm cursor-pointer">
                                <option>English</option>
                                <option>French</option>
                            </select>
                            <select className="bg-transparent border-none text-sm cursor-pointer">
                                <option>USD</option>
                                <option>EUR</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Middle Header */}
            <div className="bg-white py-4 lg:py-6 border-b border-gray-100">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between gap-4">
                        {/* Logo */}
                        <Link href="/" className="flex-shrink-0">
                            <img
                                src="/images/frontend/theme/logo.svg"
                                alt="Nest"
                                className="h-10 lg:h-12"
                            />
                        </Link>

                        {/* Search Bar */}
                        <div className="hidden lg:flex flex-1 max-w-2xl">
                            <div className="flex w-full">
                                <select className="border border-r-0 border-gray-200 rounded-l-md px-4 py-3 bg-gray-50 text-sm">
                                    <option>All Categories</option>
                                    <option>Milks & Dairies</option>
                                    <option>Wines & Alcohol</option>
                                    <option>Fresh Seafood</option>
                                </select>
                                <div className="relative flex-1">
                                    <input
                                        type="text"
                                        placeholder="Search for items..."
                                        className="w-full border border-gray-200 px-4 py-3 text-sm focus:border-brand focus:ring-0"
                                    />
                                </div>
                                <button className="bg-brand hover:bg-brand-dark text-white px-6 rounded-r-md transition-colors">
                                    Search
                                </button>
                            </div>
                        </div>

                        {/* Header Actions */}
                        <div className="flex items-center gap-4 lg:gap-6">
                            {/* Compare */}
                            <Link href="/compare" className="hidden lg:flex items-center gap-2 text-heading hover:text-brand transition-colors">
                                <div className="relative">
                                    <img src="/images/frontend/theme/icons/icon-compare.svg" alt="Compare" className="w-6 h-6" />
                                    <span className="absolute -top-2 -right-2 bg-brand text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
                                </div>
                                <span className="text-sm">Compare</span>
                            </Link>

                            {/* Wishlist */}
                            <Link href="/wishlist" className="hidden lg:flex items-center gap-2 text-heading hover:text-brand transition-colors">
                                <div className="relative">
                                    <img src="/images/frontend/theme/icons/icon-heart.svg" alt="Wishlist" className="w-6 h-6" />
                                    <span className="absolute -top-2 -right-2 bg-brand text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">6</span>
                                </div>
                                <span className="text-sm">Wishlist</span>
                            </Link>

                            {/* Cart */}
                            <Link href="/cart" className="flex items-center gap-2 text-heading hover:text-brand transition-colors">
                                <div className="relative">
                                    <img src="/images/frontend/theme/icons/icon-cart.svg" alt="Cart" className="w-6 h-6" />
                                    <span className="absolute -top-2 -right-2 bg-brand text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">2</span>
                                </div>
                                <span className="hidden lg:block text-sm">Cart</span>
                            </Link>

                            {/* Account */}
                            <Link href="/account" className="hidden lg:flex items-center gap-2 text-heading hover:text-brand transition-colors">
                                <img src="/images/frontend/theme/icons/icon-user.svg" alt="Account" className="w-6 h-6" />
                                <span className="text-sm">Account</span>
                            </Link>

                            {/* Mobile Menu Toggle */}
                            <button
                                onClick={onMobileMenuToggle}
                                className="lg:hidden p-2"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Header / Navigation */}
            <div className={`bg-white border-b border-gray-100 ${isSticky ? 'fixed top-0 left-0 right-0 z-50 shadow-md header-sticky' : ''}`}>
                <div className="container mx-auto px-4">
                    <div className="hidden lg:flex items-center justify-between py-3">
                        {/* Categories Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setCategoriesOpen(!categoriesOpen)}
                                className="flex items-center gap-2 bg-brand text-white px-6 py-3 rounded-md hover:bg-brand-dark transition-colors font-quicksand"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                                <span className="font-semibold">Browse All Categories</span>
                                <svg className={`w-4 h-4 transition-transform ${categoriesOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {categoriesOpen && (
                                <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-dropdown z-50 py-4">
                                    {['Milks and Dairies', 'Wines & Alcohol', 'Clothing & Beauty', 'Pet Foods & Toy', 'Fast food', 'Baking material', 'Vegetables', 'Fresh Seafood', 'Noodles & Rice', 'Ice cream'].map((category, index) => (
                                        <Link
                                            key={index}
                                            href={`/shop?category=${category.toLowerCase().replace(/\s+/g, '-')}`}
                                            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                                        >
                                            <img src={`/images/frontend/shop/cat-${index + 1}.png`} alt={category} className="w-8 h-8 object-contain" />
                                            <span className="text-heading hover:text-brand">{category}</span>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Main Navigation */}
                        <nav className="flex items-center gap-8 font-quicksand">
                            <Link href="/" className="text-heading hover:text-brand font-semibold transition-colors">Home</Link>
                            <Link href="/about" className="text-heading hover:text-brand font-semibold transition-colors">About</Link>
                            <Link href="/shop" className="text-heading hover:text-brand font-semibold transition-colors">Shop</Link>
                            <Link href="/vendors" className="text-heading hover:text-brand font-semibold transition-colors">Vendors</Link>
                            <div className="relative group">
                                <Link href="/blog" className="text-heading hover:text-brand font-semibold transition-colors flex items-center gap-1">
                                    Blog
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </Link>
                            </div>
                            <Link href="/contact" className="text-heading hover:text-brand font-semibold transition-colors">Contact</Link>
                        </nav>

                        {/* Hotline */}
                        <div className="flex items-center gap-3 font-quicksand">
                            <img src="/images/frontend/theme/icons/icon-headphone.svg" alt="Support" className="w-10 h-10" />
                            <div>
                                <span className="text-brand font-bold text-xl">1900 - 888</span>
                                <p className="text-xs text-body font-lato">24/7 Support Center</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
