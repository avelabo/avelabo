import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import FrontendLayout from '@/Layouts/FrontendLayout';
import ProductCard from '@/Components/Frontend/ProductCard';
import Breadcrumb from '@/Components/Frontend/Breadcrumb';
import StarRating from '@/Components/Frontend/StarRating';
import Pagination from '@/Components/Frontend/Pagination';
import EmptyState from '@/Components/Frontend/EmptyState';
import { FilterWidget, PriceRangeFilter } from '@/Components/Frontend/Filters';
import { useCurrency } from '@/hooks/useCurrency';

export default function VendorDetails({
    vendor = {},
    products = { data: [] },
    categories = [],
    dealProducts = [],
    filters = {},
}) {
    const { format } = useCurrency();
    const [activeCategory, setActiveCategory] = useState(filters.category || '');
    const [viewMode, setViewMode] = useState('grid');
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const headerRef = useRef(null);

    const breadcrumbItems = [
        { label: 'Home', href: '/' },
        { label: 'Sellers', href: route('vendors') },
        { label: vendor.shop_name },
    ];

    const handleFilterChange = (key, value) => {
        router.get(route('vendor.details', vendor.slug), {
            ...filters,
            [key]: value,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleCategoryClick = (categorySlug) => {
        setActiveCategory(categorySlug);
        handleFilterChange('category', categorySlug);
    };

    const handlePriceFilter = (min, max) => {
        router.get(route('vendor.details', vendor.slug), {
            ...filters,
            max_price: max,
        }, {
            preserveState: true,
        });
    };

    // Stats data
    const stats = [
        { label: 'Products', value: vendor.total_products || 0, icon: 'box' },
        { label: 'Sales', value: vendor.total_sales || 0, icon: 'cart' },
        { label: 'Reviews', value: vendor.total_reviews || 0, icon: 'star' },
    ];

    return (
        <FrontendLayout>
            <Head title={`${vendor.shop_name} - Avelabo Marketplace`} />

            {/* Breadcrumb */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <Breadcrumb items={breadcrumbItems} separator="slash" />
                </div>
            </div>

            {/* ============================================
                HERO SECTION - Rounded Card Header Style
                ============================================ */}
            <section className="bg-gray-50 pt-4 pb-6" ref={headerRef}>
                <div className="max-w-7xl mx-auto px-4">
                    {/* Rounded Store Header Card */}
                    <div
                        className="rounded-xl border border-gray-200 overflow-hidden bg-cover bg-center relative"
                        style={{
                            backgroundImage: vendor.banner
                                ? `url('${vendor.banner}')`
                                : 'linear-gradient(135deg, #fef7e6 0%, #fdf0d5 50%, #fce9c4 100%)'
                        }}
                    >
                        {/* Overlay for readability */}
                        <div className="absolute inset-0 bg-white/85" />

                        {/* Store Info Content */}
                        <div className="px-6 lg:px-8 py-6 relative">
                            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">

                                {/* Logo */}
                                <div className="flex-shrink-0 flex items-center">
                                    <div className="relative inline-block">
                                        {vendor.logo ? (
                                            <img
                                                src={vendor.logo}
                                                alt={vendor.shop_name}
                                                className="w-24 h-24 lg:w-28 lg:h-28 rounded-xl object-cover border border-gray-200 bg-white"
                                            />
                                        ) : (
                                            <div className="w-24 h-24 lg:w-28 lg:h-28 rounded-xl bg-gradient-to-br from-[#f1b945] to-[#d4a853] flex items-center justify-center">
                                                <span className="text-4xl lg:text-5xl font-bold text-white">
                                                    {vendor.shop_name?.charAt(0)}
                                                </span>
                                            </div>
                                        )}

                                        {/* Verified Badge */}
                                        {vendor.is_verified && (
                                            <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center ring-2 ring-white">
                                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Store Details */}
                                <div className="flex-1">
                                    <div className="flex flex-col lg:flex-row lg:items-stretch lg:justify-between gap-6">
                                        {/* Left: Name, Rating, Description */}
                                        <div className="flex-1 max-w-2xl">
                                            {/* Established Date */}
                                            <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">
                                                Since {vendor.created_at || '2024'}
                                            </p>

                                            {/* Shop Name */}
                                            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                                                {vendor.shop_name}
                                            </h1>

                                            {/* Rating */}
                                            <div className="flex items-center gap-2 mb-4">
                                                <StarRating rating={vendor.rating || 0} size="sm" />
                                                <span className="text-sm text-gray-500">
                                                    ({vendor.total_reviews || 0})
                                                </span>
                                                {vendor.is_featured && (
                                                    <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-0.5 rounded text-xs font-medium">
                                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                                        </svg>
                                                        Featured
                                                    </span>
                                                )}
                                            </div>

                                            {/* Description */}
                                            <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                                {vendor.description || 'Welcome to our store! We offer carefully curated quality products at competitive prices with excellent customer service.'}
                                            </p>

                                            {/* Contact Info Row */}
                                            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-500">
                                                {vendor.country && (
                                                    <div className="flex items-center gap-1.5">
                                                        <svg className="w-4 h-4 text-[#f1b945]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                        <span>{vendor.country}</span>
                                                    </div>
                                                )}
                                                {vendor.phone && (
                                                    <div className="flex items-center gap-1.5">
                                                        <svg className="w-4 h-4 text-[#f1b945]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                        </svg>
                                                        <span>{vendor.phone}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Right: Follow & Social */}
                                        <div className="flex flex-col items-start lg:items-end justify-end gap-2">
                                            <p className="text-xs text-gray-500">Follow Us</p>
                                            <div className="flex items-center gap-2">
                                                <a href="#" className="w-9 h-9 rounded-full bg-[#2a2a2a] hover:bg-[#1a1a1a] flex items-center justify-center transition-colors">
                                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                                    </svg>
                                                </a>
                                                <a href="#" className="w-9 h-9 rounded-full bg-[#f1b945] hover:bg-[#e5ad3a] flex items-center justify-center transition-colors">
                                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/>
                                                    </svg>
                                                </a>
                                                <a href="#" className="w-9 h-9 rounded-full bg-[#f1416c] hover:bg-[#d93a5f] flex items-center justify-center transition-colors">
                                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                                    </svg>
                                                </a>
                                                <a href="#" className="w-9 h-9 rounded-full bg-[#7239ea] hover:bg-[#6328d4] flex items-center justify-center transition-colors">
                                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                                                    </svg>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================
                CATEGORY TABS - Rounded Card Style
                ============================================ */}
            {categories.length > 0 && (
                <section className="bg-gray-50 pb-2">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="bg-white rounded-xl border border-gray-200 px-4 py-3">
                            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
                                <button
                                    onClick={() => handleCategoryClick('')}
                                    className={`
                                        flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-medium
                                        transition-all duration-200
                                        ${!activeCategory
                                            ? 'bg-[#2a2a2a] text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }
                                    `}
                                >
                                    All Products
                                    <span className="ml-2 text-xs opacity-70">
                                        ({products.total || 0})
                                    </span>
                                </button>

                                {categories.map((category) => (
                                    <button
                                        key={category.id}
                                        onClick={() => handleCategoryClick(category.slug)}
                                        className={`
                                            flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-medium
                                            transition-all duration-200
                                            ${activeCategory === category.slug
                                                ? 'bg-[#2a2a2a] text-white'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }
                                        `}
                                    >
                                        {category.name}
                                        <span className="ml-2 text-xs opacity-70">
                                            ({category.products_count || 0})
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* ============================================
                PRODUCTS SECTION
                ============================================ */}
            <section className="py-8 lg:py-12 bg-gray-50/50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-col lg:flex-row gap-8">

                        {/* Sidebar - Filters */}
                        <aside className="w-full lg:w-72 flex-shrink-0">
                            {/* Mobile Filter Toggle */}
                            <button
                                onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                                className="lg:hidden w-full flex items-center justify-between bg-white border border-gray-200 rounded-xl px-4 py-3 mb-4"
                            >
                                <span className="flex items-center gap-2 font-medium text-gray-700">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                    </svg>
                                    Filters
                                </span>
                                <svg className={`w-5 h-5 transition-transform ${mobileFiltersOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            <div className={`${mobileFiltersOpen ? 'block' : 'hidden'} lg:block space-y-6`}>
                                {/* Price Range Filter */}
                                <div className="bg-white border border-gray-200 rounded-xl p-5">
                                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-[#f1b945]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Price Range
                                    </h4>
                                    <PriceRangeFilter
                                        min={0}
                                        max={1000000}
                                        currentMax={filters.max_price}
                                        onApply={handlePriceFilter}
                                    />
                                </div>

                                {/* Categories Filter */}
                                {categories.length > 0 && (
                                    <div className="bg-white border border-gray-200 rounded-xl p-5">
                                        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                            <svg className="w-5 h-5 text-[#f1b945]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                            </svg>
                                            Categories
                                        </h4>
                                        <ul className="space-y-2">
                                            <li>
                                                <button
                                                    onClick={() => handleCategoryClick('')}
                                                    className={`
                                                        flex items-center justify-between w-full py-2 px-3 rounded-lg
                                                        transition-all duration-150
                                                        ${!activeCategory
                                                            ? 'bg-[#f1b945]/10 text-[#2a2a2a] font-medium'
                                                            : 'text-gray-600 hover:bg-gray-50'
                                                        }
                                                    `}
                                                >
                                                    <span>All Products</span>
                                                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                                                        {products.total || 0}
                                                    </span>
                                                </button>
                                            </li>
                                            {categories.map((category) => (
                                                <li key={category.id}>
                                                    <button
                                                        onClick={() => handleCategoryClick(category.slug)}
                                                        className={`
                                                            flex items-center justify-between w-full py-2 px-3 rounded-lg
                                                            transition-all duration-150
                                                            ${activeCategory === category.slug
                                                                ? 'bg-[#f1b945]/10 text-[#2a2a2a] font-medium'
                                                                : 'text-gray-600 hover:bg-gray-50'
                                                            }
                                                        `}
                                                    >
                                                        <span>{category.name}</span>
                                                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                                                            {category.products_count || 0}
                                                        </span>
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Trust Badges */}
                                <div className="bg-white border border-gray-200 rounded-xl p-5">
                                    <h4 className="font-semibold text-gray-900 mb-4">Why Buy From Us</h4>
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900 text-sm">Quality Guaranteed</p>
                                                <p className="text-gray-500 text-xs">100% authentic products</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900 text-sm">Secure Payments</p>
                                                <p className="text-gray-500 text-xs">Protected transactions</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                                                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900 text-sm">Fast Shipping</p>
                                                <p className="text-gray-500 text-xs">Nationwide delivery</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </aside>

                        {/* Products Grid */}
                        <div className="flex-1">
                            {/* Toolbar */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 bg-white border border-gray-200 rounded-xl px-5 py-4">
                                <p className="text-gray-600">
                                    Showing <span className="font-semibold text-gray-900">{products.data?.length || 0}</span> of{' '}
                                    <span className="font-semibold text-gray-900">{products.total || 0}</span> products
                                </p>

                                <div className="flex items-center gap-4">
                                    {/* Sort */}
                                    <div className="flex items-center gap-2">
                                        <label className="text-sm text-gray-500">Sort:</label>
                                        <select
                                            value={filters.sort || 'featured'}
                                            onChange={(e) => handleFilterChange('sort', e.target.value)}
                                            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-[#f1b945] focus:ring-1 focus:ring-[#f1b945] focus:outline-none bg-white"
                                        >
                                            <option value="featured">Featured</option>
                                            <option value="newest">Newest</option>
                                            <option value="price_low">Price: Low to High</option>
                                            <option value="price_high">Price: High to Low</option>
                                            <option value="rating">Top Rated</option>
                                            <option value="popular">Best Selling</option>
                                        </select>
                                    </div>

                                    {/* View Toggle */}
                                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                                        <button
                                            onClick={() => setViewMode('grid')}
                                            className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-[#2a2a2a] text-white' : 'text-gray-400 hover:text-gray-600'}`}
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => setViewMode('list')}
                                            className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-[#2a2a2a] text-white' : 'text-gray-400 hover:text-gray-600'}`}
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Products */}
                            {products.data?.length > 0 ? (
                                <>
                                    <div className={`
                                        ${viewMode === 'grid'
                                            ? 'grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6'
                                            : 'flex flex-col gap-4'
                                        }
                                    `}>
                                        {products.data.map((product, index) => (
                                            <div
                                                key={product.id}
                                                className="animate-in fade-in-0 slide-in-from-bottom-4"
                                                style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'backwards' }}
                                            >
                                                <ProductCard product={product} variant={viewMode === 'list' ? 'horizontal' : 'default'} />
                                            </div>
                                        ))}
                                    </div>

                                    {/* Pagination */}
                                    <div className="mt-8">
                                        <Pagination pagination={products} />
                                    </div>
                                </>
                            ) : (
                                <EmptyState
                                    icon="box"
                                    title="No products found"
                                    description={activeCategory ? "Try selecting a different category or clearing filters." : "This seller hasn't listed any products yet."}
                                    className="bg-white border border-gray-200 rounded-xl"
                                />
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================
                DEALS SECTION (if available)
                ============================================ */}
            {dealProducts.length > 0 && (
                <section className="py-12 lg:py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
                                    Special Deals
                                </h2>
                                <p className="text-gray-500 mt-1">Limited time offers from {vendor.shop_name}</p>
                            </div>
                            <Link
                                href={route('vendor.details', { slug: vendor.slug, deals: true })}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-[#2a2a2a] hover:bg-[#1a1a1a] text-white font-medium text-sm rounded-lg transition-colors"
                            >
                                View all deals
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
                            {dealProducts.slice(0, 5).map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </FrontendLayout>
    );
}
