import { Link } from '@inertiajs/react';
import { useState } from 'react';

export default function MobileMenu({ isOpen, onClose }) {
    const [expandedMenu, setExpandedMenu] = useState(null);

    const menuItems = [
        { name: 'Home', href: '/' },
        { name: 'Shop', href: '/shop' },
        {
            name: 'Vendors',
            href: '/vendors',
            children: [
                { name: 'Vendors List', href: '/vendors' },
                { name: 'Vendor Details', href: '/vendors/1' },
            ]
        },
        {
            name: 'Pages',
            href: '#',
            children: [
                { name: 'About Us', href: '/about' },
                { name: 'Contact', href: '/contact' },
                { name: 'My Account', href: '/account' },
            ]
        },
        { name: 'Blog', href: '/blog' },
        { name: 'Contact', href: '/contact' },
    ];

    const categories = [
        'Milks and Dairies', 'Clothing & beauty', 'Pet Foods & Toy',
        'Baking material', 'Fresh Fruit', 'Wines & Drinks',
        'Fresh Seafood', 'Fast food', 'Vegetables', 'Bread and Juice'
    ];

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
                    <nav className="p-4">
                        <h6 className="text-brand font-semibold text-sm uppercase mb-4">Menu</h6>
                        <ul className="space-y-2">
                            {menuItems.map((item, index) => (
                                <li key={index}>
                                    {item.children ? (
                                        <div>
                                            <button
                                                onClick={() => setExpandedMenu(expandedMenu === index ? null : index)}
                                                className="flex items-center justify-between w-full py-2 text-heading hover:text-brand"
                                            >
                                                <span>{item.name}</span>
                                                <svg className={`w-4 h-4 transition-transform ${expandedMenu === index ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>
                                            {expandedMenu === index && (
                                                <ul className="pl-4 space-y-2 mt-2">
                                                    {item.children.map((child, childIndex) => (
                                                        <li key={childIndex}>
                                                            <Link href={child.href} className="block py-1 text-body hover:text-brand">
                                                                {child.name}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    ) : (
                                        <Link href={item.href} className="block py-2 text-heading hover:text-brand">
                                            {item.name}
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div className="p-4 border-t">
                        <h6 className="text-brand font-semibold text-sm uppercase mb-4">Categories</h6>
                        <ul className="space-y-2">
                            {categories.map((category, index) => (
                                <li key={index}>
                                    <Link href={`/shop?category=${category.toLowerCase()}`} className="block py-1 text-body hover:text-brand">
                                        {category}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white">
                    <div className="flex items-center gap-3">
                        <img src="/images/frontend/theme/icons/icon-headphone.svg" alt="Support" className="w-10 h-10" />
                        <div>
                            <span className="text-brand font-bold text-lg">1900 - 888</span>
                            <p className="text-xs text-body">24/7 Support Center</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
