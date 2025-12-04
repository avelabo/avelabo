import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Sidebar({ isOpen, isMobileOpen, onClose }) {
    const { url } = usePage();
    const [expandedMenus, setExpandedMenus] = useState([]);

    const menuItems = [
        {
            name: 'Dashboard',
            icon: 'dashboard',
            href: '/admin',
        },
        {
            name: 'KYC Verifications',
            icon: 'verified_user',
            href: '/admin/kyc',
        },
        {
            name: 'Sellers',
            icon: 'store',
            children: [
                { name: 'All Sellers', href: '/admin/sellers' },
                { name: 'Markup Templates', href: '/admin/markup-templates' },
            ],
        },
        {
            name: 'Products',
            icon: 'inventory_2',
            children: [
                { name: 'Product List', href: '/admin/products' },
                { name: 'Add Product', href: '/admin/products/create' },
                { name: 'Categories', href: '/admin/categories' },
            ],
        },
        {
            name: 'Sliders',
            icon: 'view_carousel',
            children: [
                { name: 'All Sliders', href: '/admin/sliders' },
                { name: 'Add Slider', href: '/admin/sliders/create' },
            ],
        },
        {
            name: 'Orders',
            icon: 'shopping_cart',
            children: [
                { name: 'Order List', href: '/admin/orders' },
            ],
        },
        {
            name: 'Scraping',
            icon: 'cloud_download',
            children: [
                { name: 'Sources', href: '/admin/scraping' },
                { name: 'Add Source', href: '/admin/scraping/create' },
            ],
        },
        {
            name: 'Pages',
            icon: 'article',
            children: [
                { name: 'All Pages', href: '/admin/pages' },
                { name: 'Add Page', href: '/admin/pages/create' },
            ],
        },
        {
            name: 'Contact Messages',
            icon: 'mail',
            href: '/admin/contact-messages',
        },
        {
            name: 'Users',
            icon: 'people',
            href: '/admin/users',
        },
        {
            name: 'Transaction',
            icon: 'account_balance',
            href: '/admin/transactions',
        },
        {
            name: 'Brands',
            icon: 'branding_watermark',
            href: '/admin/brands',
        },
        {
            name: 'Reviews',
            icon: 'star',
            href: '/admin/reviews',
        },
        {
            name: 'Settings',
            icon: 'settings',
            href: '/admin/settings',
        },
    ];

    const toggleMenu = (index) => {
        setExpandedMenus(prev =>
            prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index]
        );
    };

    const isActive = (href) => url === href || url.startsWith(href + '/');

    return (
        <aside
            className={`fixed top-0 left-0 z-50 h-full bg-admin-sidebar text-white transition-all duration-300
                ${isOpen ? 'w-64' : 'w-20'}
                ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}
        >
            {/* Logo */}
            <div className="flex items-center justify-between h-16 px-4 border-b border-white/10">
                <Link href="/admin" className="flex items-center gap-3">
                    
                    {isOpen && <img src="/images/logo/logo-light-web-small.png" alt="Avelabo" className="h-8" />}
                </Link>
                <button onClick={onClose} className="lg:hidden text-white">
                    <span className="material-icons">close</span>
                </button>
            </div>

            {/* Navigation */}
            <nav className="p-4 overflow-y-auto h-[calc(100%-64px)]">
                <ul className="space-y-1">
                    {menuItems.map((item, index) => (
                        <li key={index} className="menu-item">
                            {item.children ? (
                                <>
                                    <button
                                        onClick={() => toggleMenu(index)}
                                        className={`flex items-center justify-between w-full px-4 py-3 rounded-lg hover:bg-white/10 transition-colors
                                            ${expandedMenus.includes(index) ? 'bg-white/10' : ''}
                                        `}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="material-icons text-xl">{item.icon}</span>
                                            {isOpen && <span className="sidebar-text">{item.name}</span>}
                                        </div>
                                        {isOpen && (
                                            <span className={`material-icons text-sm transition-transform ${expandedMenus.includes(index) ? 'rotate-180' : ''}`}>
                                                expand_more
                                            </span>
                                        )}
                                    </button>
                                    {isOpen && expandedMenus.includes(index) && (
                                        <ul className="ml-8 mt-1 space-y-1 submenu">
                                            {item.children.map((child, childIndex) => (
                                                <li key={childIndex}>
                                                    <Link
                                                        href={child.href}
                                                        className={`block px-4 py-2 rounded-lg text-sm hover:bg-white/10 transition-colors
                                                            ${isActive(child.href) ? 'bg-brand text-white' : 'text-gray-300'}
                                                        `}
                                                    >
                                                        {child.name}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </>
                            ) : (
                                <Link
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors
                                        ${isActive(item.href) ? 'bg-brand text-white' : ''}
                                    `}
                                >
                                    <span className="material-icons text-xl">{item.icon}</span>
                                    {isOpen && <span className="sidebar-text">{item.name}</span>}
                                </Link>
                            )}
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
}
