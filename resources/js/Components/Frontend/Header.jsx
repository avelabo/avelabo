import { Link, usePage, router } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';

export default function Header({ isSticky, onMobileMenuToggle }) {
    const { currencies, counts, headerCategories, siteSettings } = usePage().props;
    const [categoriesOpen, setCategoriesOpen] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);
    const [hoveredCategory, setHoveredCategory] = useState(null);
    const categoriesRef = useRef(null);

    const selectedCurrency = currencies?.selected || currencies?.default;
    const activeCurrencies = currencies?.active || [];

    const handleCurrencyChange = (code) => {
        router.post(route('currency.set'), { code }, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    const categories = headerCategories || [];

    // Close categories dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (categoriesRef.current && !categoriesRef.current.contains(event.target)) {
                setCategoriesOpen(false);
                setHoveredCategory(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <>
            {/* Main Header - Rich charcoal background */}
            <header className="bg-[#2a2a2a] relative">
                {/* Subtle gradient overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />

                <div className="container mx-auto px-4 relative">
                    <div className="flex items-center justify-between gap-6 py-4 lg:py-5">

                        {/* Logo */}
                        <Link
                            href="/"
                            className="flex-shrink-0 group relative"
                        >
                            <img
                                src="/images/logo/logo-alt-white-web-mid.png"
                                alt={siteSettings?.site_name || 'Avelabo'}
                                className="h-9 lg:h-11 transition-transform duration-300 group-hover:scale-[1.02]"
                            />
                            {/* Subtle glow on hover */}
                            <div className="absolute inset-0 bg-[#f1b945]/0 group-hover:bg-[#f1b945]/5 rounded-lg transition-colors duration-300 -m-2" />
                        </Link>

                        {/* Search Bar - Elegant floating design */}
                        <div className="hidden lg:flex flex-1 max-w-xl xl:max-w-2xl">
                            <div
                                className={`
                                    flex w-full rounded-lg overflow-hidden
                                    transition-all duration-300 ease-out
                                    ${searchFocused
                                        ? 'ring-2 ring-[#f1b945]/50 shadow-lg shadow-[#f1b945]/10'
                                        : 'ring-1 ring-white/10'
                                    }
                                `}
                            >
                                <div className="relative flex-1">
                                    <input
                                        type="text"
                                        placeholder="Search products, brands, categories..."
                                        onFocus={() => setSearchFocused(true)}
                                        onBlur={() => setSearchFocused(false)}
                                        className="
                                            w-full px-5 py-3 bg-white/95 text-[#2a2a2a] text-sm
                                            placeholder:text-gray-400 border-none
                                            focus:outline-none focus:ring-0
                                        "
                                    />
                                </div>
                                <button
                                    className="
                                        bg-[#f1b945] hover:bg-[#e5ad3a] active:bg-[#d9a32f]
                                        text-[#2a2a2a] font-semibold px-6
                                        transition-all duration-200
                                        flex items-center gap-2
                                    "
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                    </svg>
                                    <span className="hidden xl:inline">Search</span>
                                </button>
                            </div>
                        </div>

                        {/* Header Actions */}
                        <div className="flex items-center gap-2 lg:gap-1">

                            {/* Wishlist */}
                            <Link
                                href="/wishlist"
                                className="
                                    hidden lg:flex items-center gap-2 px-3 py-2 rounded-lg
                                    text-white/80 hover:text-white hover:bg-white/5
                                    transition-all duration-200 group
                                "
                            >
                                <div className="relative">
                                    <svg className="w-6 h-6 transition-transform duration-200 group-hover:scale-110" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                                    </svg>
                                    {counts?.wishlist > 0 && (
                                        <span className="absolute -top-1.5 -right-1.5 bg-[#f1b945] text-[#2a2a2a] text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                            {counts.wishlist}
                                        </span>
                                    )}
                                </div>
                            </Link>

                            {/* Cart */}
                            <Link
                                href="/cart"
                                className="
                                    flex items-center gap-2 px-3 py-2 rounded-lg
                                    text-white/80 hover:text-white hover:bg-white/5
                                    transition-all duration-200 group
                                "
                            >
                                <div className="relative">
                                    <svg className="w-6 h-6 transition-transform duration-200 group-hover:scale-110" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                    </svg>
                                    {counts?.cart > 0 && (
                                        <span className="absolute -top-1.5 -right-1.5 bg-[#f1b945] text-[#2a2a2a] text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                                            {counts.cart}
                                        </span>
                                    )}
                                </div>
                                <span className="hidden xl:block text-sm font-medium">Cart</span>
                            </Link>

                            {/* Divider */}
                            <div className="hidden lg:block w-px h-6 bg-white/10 mx-2" />

                            {/* Account */}
                            <Link
                                href="/account"
                                className="
                                    hidden lg:flex items-center gap-2 px-3 py-2 rounded-lg
                                    text-white/80 hover:text-[#f1b945] hover:bg-white/5
                                    transition-all duration-200 group
                                "
                            >
                                <svg className="w-6 h-6 transition-transform duration-200 group-hover:scale-110" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span className="text-sm font-medium">Account</span>
                            </Link>

                            {/* Mobile Menu Toggle */}
                            <button
                                onClick={onMobileMenuToggle}
                                className="
                                    lg:hidden p-2 rounded-lg
                                    text-white/80 hover:text-white hover:bg-white/5
                                    transition-all duration-200
                                "
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Navigation Bar - Clean white */}
            <nav
                className={`
                    bg-white border-b border-gray-100
                    transition-all duration-300
                    ${isSticky
                        ? 'fixed top-0 left-0 right-0 z-50 shadow-lg shadow-black/5 header-sticky'
                        : ''
                    }
                `}
            >
                <div className="container mx-auto px-4">
                    <div className="hidden lg:flex items-center gap-4 py-2">

                        {/* Categories Dropdown */}
                        <div className="relative" ref={categoriesRef}>
                            <button
                                onClick={() => setCategoriesOpen(!categoriesOpen)}
                                className={`
                                    flex items-center gap-2 px-5 py-2.5 rounded-lg
                                    font-semibold text-sm transition-all duration-200
                                    ${categoriesOpen
                                        ? 'bg-[#2a2a2a] text-white'
                                        : 'bg-gray-100 text-[#2a2a2a] hover:bg-gray-200'
                                    }
                                `}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                </svg>
                                <span>All Categories</span>
                                <svg
                                    className={`w-4 h-4 transition-transform duration-200 ${categoriesOpen ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                </svg>
                            </button>

                            {/* Dropdown Menu with Subcategory Flyout */}
                            <div
                                className={`
                                    absolute top-full left-0 mt-2 flex
                                    transition-all duration-200 origin-top-left z-50
                                    ${categoriesOpen
                                        ? 'opacity-100 scale-100 translate-y-0'
                                        : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                                    }
                                `}
                                onMouseLeave={() => setHoveredCategory(null)}
                            >
                                {/* Main Categories Panel */}
                                <div className="w-72 bg-white rounded-xl shadow-xl shadow-black/10 border border-gray-100 overflow-hidden">
                                    <div
                                        className="py-2 max-h-[420px] overflow-y-auto category-dropdown-scroll"
                                        style={{
                                            scrollbarWidth: 'thin',
                                            scrollbarColor: '#f1b945 #f5f5f5'
                                        }}
                                    >
                                        {categories.length > 0 ? (
                                            categories.map((category) => (
                                                <div
                                                    key={category.id}
                                                    className="relative"
                                                    onMouseEnter={() => setHoveredCategory(category)}
                                                >
                                                    <Link
                                                        href={`/shop?category=${category.slug}`}
                                                        className={`
                                                            flex items-center justify-between px-5 py-3
                                                            transition-all duration-150 group
                                                            ${hoveredCategory?.id === category.id
                                                                ? 'bg-[#f1b945]/10 text-[#2a2a2a]'
                                                                : 'text-gray-700 hover:text-[#2a2a2a] hover:bg-gray-50'
                                                            }
                                                        `}
                                                        onClick={() => {
                                                            setCategoriesOpen(false);
                                                            setHoveredCategory(null);
                                                        }}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <span className={`
                                                                w-1.5 h-1.5 rounded-full transition-colors
                                                                ${hoveredCategory?.id === category.id
                                                                    ? 'bg-[#f1b945]'
                                                                    : 'bg-[#f1b945]/40 group-hover:bg-[#f1b945]'
                                                                }
                                                            `} />
                                                            <span className="font-medium text-sm">{category.name}</span>
                                                        </div>
                                                        {category.children?.length > 0 && (
                                                            <svg
                                                                className={`
                                                                    w-4 h-4 transition-all duration-200
                                                                    ${hoveredCategory?.id === category.id
                                                                        ? 'text-[#f1b945] translate-x-0.5'
                                                                        : 'text-gray-400'
                                                                    }
                                                                `}
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth={2}
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                                            </svg>
                                                        )}
                                                    </Link>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="px-5 py-3 text-gray-500 text-sm">No categories available</p>
                                        )}
                                    </div>
                                </div>

                                {/* Subcategories Flyout Panel */}
                                {hoveredCategory?.children?.length > 0 && (
                                    <div
                                        className="
                                            w-64 bg-white rounded-xl shadow-xl shadow-black/10
                                            border border-gray-100 ml-1 overflow-hidden
                                            animate-in slide-in-from-left-2 duration-200
                                        "
                                    >
                                        {/* Subcategory Header */}
                                        <div className="px-5 py-3 bg-gradient-to-r from-[#f1b945]/10 to-transparent border-b border-gray-100">
                                            <h4 className="font-semibold text-sm text-[#2a2a2a]">
                                                {hoveredCategory.name}
                                            </h4>
                                        </div>

                                        {/* Subcategory List */}
                                        <div
                                            className="py-2 max-h-[360px] overflow-y-auto"
                                            style={{
                                                scrollbarWidth: 'thin',
                                                scrollbarColor: '#f1b945 #f5f5f5'
                                            }}
                                        >
                                            {hoveredCategory.children.map((subcategory) => (
                                                <Link
                                                    key={subcategory.id}
                                                    href={`/shop?category=${subcategory.slug}`}
                                                    className="
                                                        flex items-center gap-3 px-5 py-2.5
                                                        text-gray-600 hover:text-[#2a2a2a] hover:bg-[#f1b945]/5
                                                        transition-all duration-150 group
                                                    "
                                                    onClick={() => {
                                                        setCategoriesOpen(false);
                                                        setHoveredCategory(null);
                                                    }}
                                                >
                                                    <span className="w-1 h-1 rounded-full bg-gray-300 group-hover:bg-[#f1b945] transition-colors" />
                                                    <span className="text-sm">{subcategory.name}</span>
                                                </Link>
                                            ))}

                                            {/* View All Link - Styled as a subtle button */}
                                            <div className="px-4 pt-2 pb-3 mt-1 border-t border-gray-100">
                                                <Link
                                                    href={`/shop?category=${hoveredCategory.slug}`}
                                                    className="
                                                        flex items-center justify-center gap-2 w-full
                                                        px-4 py-2.5 rounded-lg
                                                        bg-[#2a2a2a] hover:bg-[#1a1a1a]
                                                        text-white font-medium text-sm
                                                        transition-all duration-200
                                                        group
                                                    "
                                                    onClick={() => {
                                                        setCategoriesOpen(false);
                                                        setHoveredCategory(null);
                                                    }}
                                                >
                                                    <span>View all {hoveredCategory.name}</span>
                                                    <svg
                                                        className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth={2}
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                                    </svg>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Category Navigation Pills */}
                        <div className="flex-1 flex items-center gap-1 overflow-x-auto scrollbar-hide">
                            {categories.slice(0, 7).map((category) => (
                                <Link
                                    key={category.id}
                                    href={`/shop?category=${category.slug}`}
                                    className="
                                        px-4 py-2 rounded-lg
                                        text-gray-600 hover:text-[#2a2a2a] hover:bg-gray-100
                                        font-medium text-sm whitespace-nowrap
                                        transition-all duration-200
                                    "
                                >
                                    {category.name}
                                </Link>
                            ))}
                            {categories.length > 7 && (
                                <button
                                    onClick={() => setCategoriesOpen(true)}
                                    className="
                                        px-4 py-2 rounded-lg
                                        text-[#2a2a2a] bg-[#f1b945]/20 hover:bg-[#f1b945]/30
                                        font-semibold text-sm whitespace-nowrap
                                        transition-all duration-200
                                    "
                                >
                                    More +
                                </button>
                            )}
                        </div>

                        {/* Sticky Cart (only when sticky) */}
                        {isSticky && (
                            <Link
                                href="/cart"
                                className="
                                    flex items-center gap-2 px-4 py-2 rounded-lg
                                    bg-[#f1b945] hover:bg-[#e5ad3a] text-[#2a2a2a]
                                    font-semibold text-sm transition-all duration-200
                                "
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                </svg>
                                <span>Cart</span>
                                {counts?.cart > 0 && (
                                    <span className="bg-[#2a2a2a] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                        {counts.cart}
                                    </span>
                                )}
                            </Link>
                        )}
                    </div>

                    {/* Mobile Search Bar */}
                    <div className="lg:hidden py-3">
                        <div className="flex rounded-lg overflow-hidden ring-1 ring-gray-200">
                            <input
                                type="text"
                                placeholder="Search products..."
                                className="
                                    flex-1 px-4 py-2.5 bg-white text-[#2a2a2a] text-sm
                                    placeholder:text-gray-400 border-none
                                    focus:outline-none focus:ring-0
                                "
                            />
                            <button className="bg-[#f1b945] text-[#2a2a2a] px-4">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
}
