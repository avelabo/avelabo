import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function MobileMenu({ isOpen, onClose }) {
    const { headerCategories, counts, siteSettings } = usePage().props;
    const [categoriesOpen, setCategoriesOpen] = useState(false);

    const categories = headerCategories || [];

    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black/50 z-40 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* Menu */}
            <div className={`fixed top-0 left-0 w-80 h-full bg-white z-50 transform transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <Link href="/">
                        <img src="/images/logo/logo-web-small.png" alt="Avelabo" className="h-8" />
                    </Link>
                    <button onClick={onClose} className="p-2 hover:text-brand">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Search */}
                <div className="p-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search for items..."
                            className="w-full border border-gray-200 rounded-lg px-4 py-3 pr-12"
                        />
                        <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-brand text-white p-2 rounded">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Navigation */}
                <div className="overflow-y-auto h-[calc(100%-200px)]">
                    {/* Categories Dropdown */}
                    <div className="p-4 border-b">
                        <button
                            onClick={() => setCategoriesOpen(!categoriesOpen)}
                            className="flex items-center justify-between w-full bg-brand text-white px-4 py-3 rounded-md font-quicksand"
                        >
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                                <span className="font-semibold">All Categories</span>
                            </div>
                            <svg className={`w-4 h-4 transition-transform ${categoriesOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        {categoriesOpen && (
                            <ul className="mt-2 space-y-1 max-h-60 overflow-y-auto">
                                {categories.length > 0 ? (
                                    categories.map((category) => (
                                        <li key={category.id}>
                                            <Link
                                                href={`/shop?category=${category.slug}`}
                                                className="block px-4 py-2 text-heading hover:text-brand hover:bg-gray-50 rounded-md text-sm font-medium"
                                                onClick={onClose}
                                            >
                                                {category.name}
                                            </Link>
                                        </li>
                                    ))
                                ) : (
                                    <li className="px-4 py-2 text-body text-sm">No categories available</li>
                                )}
                            </ul>
                        )}
                    </div>

                    {/* Category Links (same as desktop nav) */}
                    <nav className="p-4">
                        <h6 className="text-brand font-semibold text-sm uppercase mb-4">Browse Categories</h6>
                        <ul className="space-y-2">
                            {categories.slice(0, 8).map((category) => (
                                <li key={category.id}>
                                    <Link
                                        href={`/shop?category=${category.slug}`}
                                        className="block py-2 text-heading hover:text-brand font-medium text-sm"
                                        onClick={onClose}
                                    >
                                        {category.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Quick Links */}
                    <div className="p-4 border-t">
                        <h6 className="text-brand font-semibold text-sm uppercase mb-4">Quick Links</h6>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/" className="block py-2 text-heading hover:text-brand" onClick={onClose}>
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/shop" className="block py-2 text-heading hover:text-brand" onClick={onClose}>
                                    Shop
                                </Link>
                            </li>
                            <li>
                                <Link href="/wishlist" className="flex items-center justify-between py-2 text-heading hover:text-brand" onClick={onClose}>
                                    <span>Wishlist</span>
                                    {counts?.wishlist > 0 && (
                                        <span className="bg-brand text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                            {counts.wishlist}
                                        </span>
                                    )}
                                </Link>
                            </li>
                            <li>
                                <Link href="/cart" className="flex items-center justify-between py-2 text-heading hover:text-brand" onClick={onClose}>
                                    <span>Basket</span>
                                    {counts?.cart > 0 && (
                                        <span className="bg-brand text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                            {counts.cart}
                                        </span>
                                    )}
                                </Link>
                            </li>
                            <li>
                                <Link href="/account" className="block py-2 text-heading hover:text-brand" onClick={onClose}>
                                    Account
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white">
                    <div className="flex items-center gap-3">
                        <img src="/images/frontend/theme/icons/icon-headphone.svg" alt="Support" className="w-10 h-10" />
                        <div>
                            <span className="text-brand font-bold text-lg">{siteSettings?.site_phone || '+265 999 123 456'}</span>
                            <p className="text-xs text-body">24/7 Support Center</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
