import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import FrontendLayout from '@/Layouts/FrontendLayout';
import ProductCard from '@/Components/Frontend/ProductCard';
import Breadcrumb from '@/Components/Frontend/Breadcrumb';
import StarRating from '@/Components/Frontend/StarRating';
import Pagination from '@/Components/Frontend/Pagination';
import EmptyState from '@/Components/Frontend/EmptyState';
import ProductListItem from '@/Components/Frontend/ProductListItem';
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

    const breadcrumbItems = [
        { label: 'Home', href: '/' },
        { label: 'Vendors', href: route('vendors') },
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

    const handlePriceFilter = (min, max) => {
        router.get(route('vendor.details', vendor.slug), {
            ...filters,
            max_price: max,
        }, {
            preserveState: true,
        });
    };

    return (
        <FrontendLayout>
            <Head title={`${vendor.shop_name} - Avelabo Marketplace`} />

            {/* Breadcrumb */}
            <div className="bg-white py-4 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4">
                    <Breadcrumb items={breadcrumbItems} separator="slash" />
                </div>
            </div>

            {/* Vendor Header Banner */}
            <section
                className="relative py-16 lg:py-24 bg-cover bg-center"
                style={{
                    backgroundImage: vendor.banner
                        ? `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('${vendor.banner}')`
                        : "linear-gradient(rgba(59,130,246,0.8), rgba(59,130,246,0.9))"
                }}
            >
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
                        {/* Vendor Logo */}
                        <div className="flex-shrink-0">
                            {vendor.logo ? (
                                <img src={vendor.logo} alt={vendor.shop_name} className="w-32 h-32 rounded-xl object-cover border-4 border-white shadow-lg" />
                            ) : (
                                <div className="w-32 h-32 rounded-xl bg-white flex items-center justify-center border-4 border-white shadow-lg">
                                    <span className="text-4xl font-bold text-brand">{vendor.shop_name?.charAt(0)}</span>
                                </div>
                            )}
                        </div>

                        {/* Vendor Info */}
                        <div className="text-center lg:text-left flex-1">
                            <span className="text-gray-300 text-sm">Since {vendor.created_at}</span>
                            <h1 className="text-3xl lg:text-4xl font-bold text-white font-quicksand mt-2 mb-4 flex items-center justify-center lg:justify-start gap-2">
                                {vendor.shop_name}
                                {vendor.is_verified && (
                                    <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                    </svg>
                                )}
                            </h1>
                            <div className="flex items-center justify-center lg:justify-start gap-4 mb-6">
                                <StarRating rating={vendor.rating || 0} size="sm" />
                                <span className="text-gray-300 text-sm">({vendor.rating?.toFixed(1) || '0.0'})</span>
                                <span className="text-gray-300 text-sm">| {vendor.total_reviews || 0} reviews</span>
                            </div>

                            <div className="grid lg:grid-cols-3 gap-6">
                                {/* Description */}
                                <div>
                                    <p className="text-white/90 text-sm leading-relaxed">
                                        {vendor.description || 'Welcome to our store! We offer quality products at competitive prices.'}
                                    </p>
                                </div>

                                {/* Stats */}
                                <div className="text-white/90 text-sm space-y-2">
                                    <div className="flex items-center gap-2 justify-center lg:justify-start">
                                        <svg className="w-4 h-4 text-brand-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                        <span><strong>{vendor.total_products || 0}</strong> Products</span>
                                    </div>
                                    <div className="flex items-center gap-2 justify-center lg:justify-start">
                                        <svg className="w-4 h-4 text-brand-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                        <span><strong>{vendor.total_sales || 0}</strong> Sales</span>
                                    </div>
                                    {vendor.country && (
                                        <div className="flex items-center gap-2 justify-center lg:justify-start">
                                            <svg className="w-4 h-4 text-brand-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <span>{vendor.country}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-center lg:justify-start gap-3">
                                    {vendor.is_featured && (
                                        <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                                            Featured Seller
                                        </span>
                                    )}
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
                                <p className="text-gray-500">
                                    We found <strong className="text-brand">{products.total || products.data?.length || 0}</strong> products
                                </p>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-500 text-sm">Show:</span>
                                        <select
                                            value={filters.per_page || 12}
                                            onChange={(e) => handleFilterChange('per_page', e.target.value)}
                                            className="border border-gray-200 rounded px-3 py-2 text-sm focus:border-brand focus:outline-none"
                                        >
                                            <option value="12">12</option>
                                            <option value="24">24</option>
                                            <option value="48">48</option>
                                        </select>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-500 text-sm">Sort by:</span>
                                        <select
                                            value={filters.sort || 'featured'}
                                            onChange={(e) => handleFilterChange('sort', e.target.value)}
                                            className="border border-gray-200 rounded px-3 py-2 text-sm focus:border-brand focus:outline-none"
                                        >
                                            <option value="featured">Featured</option>
                                            <option value="newest">Newest</option>
                                            <option value="price_low">Price: Low to High</option>
                                            <option value="price_high">Price: High to Low</option>
                                            <option value="rating">Top Rated</option>
                                            <option value="popular">Most Popular</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Product Grid */}
                            {products.data?.length > 0 ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
                                    {products.data.map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>
                            ) : (
                                <EmptyState
                                    icon="box"
                                    title="No products available"
                                    description="This seller hasn't listed any products yet."
                                    className="bg-gray-50 rounded-xl"
                                />
                            )}

                            {/* Pagination */}
                            <Pagination pagination={products} className="mb-12" />

                            {/* Deals of the Day */}
                            {dealProducts.length > 0 && (
                                <section>
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-2xl font-bold text-heading font-quicksand">Deals From This Seller</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                        {dealProducts.map((product) => (
                                            <div key={product.id} className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                                                <Link href={route('product.detail', product.slug)} className="block">
                                                    <img
                                                        src={product.primary_image || '/images/frontend/placeholder-product.png'}
                                                        alt={product.name}
                                                        className="w-full h-48 object-contain"
                                                    />
                                                </Link>
                                                <div className="p-4">
                                                    <Link href={route('product.detail', product.slug)}>
                                                        <h6 className="font-quicksand font-semibold text-heading mb-2 hover:text-brand line-clamp-2">
                                                            {product.name}
                                                        </h6>
                                                    </Link>
                                                    <StarRating rating={product.rating || 0} size="xs" className="mb-2" />
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <span className="text-brand font-bold">{format(product.price)}</span>
                                                            {product.compare_price && (
                                                                <span className="text-gray-500 line-through text-xs ml-1">{format(product.compare_price)}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>

                        {/* Sidebar */}
                        <aside className="w-full lg:w-72 flex-shrink-0 order-1 lg:order-2">
                            {/* Categories Widget */}
                            {categories.length > 0 && (
                                <FilterWidget title="Categories" className="mb-6">
                                    <ul className="space-y-3">
                                        <li>
                                            <button
                                                onClick={() => handleFilterChange('category', '')}
                                                className={`flex items-center justify-between w-full group ${!filters.category ? 'text-brand' : ''}`}
                                            >
                                                <span className="text-heading group-hover:text-brand transition-colors">All Products</span>
                                                <span className="bg-brand/10 text-brand text-xs px-2 py-1 rounded-full">
                                                    {products.total || 0}
                                                </span>
                                            </button>
                                        </li>
                                        {categories.map((category) => (
                                            <li key={category.id}>
                                                <button
                                                    onClick={() => handleFilterChange('category', category.slug)}
                                                    className={`flex items-center justify-between w-full group ${filters.category === category.slug ? 'text-brand' : ''}`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        {category.icon && <img src={category.icon} alt="" className="w-6 h-6" />}
                                                        <span className="text-heading group-hover:text-brand transition-colors">{category.name}</span>
                                                    </div>
                                                    <span className="bg-brand/10 text-brand text-xs px-2 py-1 rounded-full">{category.products_count}</span>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </FilterWidget>
                            )}

                            {/* Price Range Filter */}
                            <PriceRangeFilter
                                min={0}
                                max={1000000}
                                currentMax={filters.max_price}
                                onApply={handlePriceFilter}
                                className="mb-6"
                            />
                        </aside>
                    </div>
                </div>
            </section>
        </FrontendLayout>
    );
}
