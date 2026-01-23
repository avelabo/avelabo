import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import FrontendLayout from '@/Layouts/FrontendLayout';
import Breadcrumb from '@/Components/Frontend/Breadcrumb';
import StarRating from '@/Components/Frontend/StarRating';
import Pagination from '@/Components/Frontend/Pagination';
import EmptyState from '@/Components/Frontend/EmptyState';

export default function Vendors({ vendors = { data: [] }, filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');

    const breadcrumbItems = [
        { label: 'Home', href: '/' },
        { label: 'Our Sellers' },
    ];

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('vendors'), { search, sort: filters.sort }, { preserveState: true });
    };

    const handleSort = (sortValue) => {
        router.get(route('vendors'), { search: filters.search, sort: sortValue }, { preserveState: true });
    };

    return (
        <FrontendLayout>
            <Head title="Our Sellers - Avelabo Marketplace" />

            {/* Breadcrumb */}
            <div className="border-b border-border-light">
                <div className="container mx-auto px-4 py-4">
                    <Breadcrumb items={breadcrumbItems} separator="chevron" />
                </div>
            </div>

            {/* Hero Section */}
            <section className="py-12 lg:py-16 bg-brand">
                <div className="container mx-auto px-4">
                    <div className="max-w-2xl">
                        <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                            Our Trusted Sellers
                        </h1>
                        <p className="text-white/80 text-lg">
                            Browse through our verified sellers and find quality products from trusted merchants.
                        </p>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-10 lg:py-14">
                <div className="container mx-auto px-4">
                    {/* Search and Sort */}
                    <div className="flex flex-col md:flex-row gap-4 justify-between mb-8">
                        <form onSubmit={handleSearch} className="flex gap-2 max-w-md flex-1">
                            <input
                                type="text"
                                placeholder="Search sellers..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="flex-1 px-4 py-3 border border-border rounded-lg focus:border-brand focus:outline-none transition-colors"
                            />
                            <button
                                type="submit"
                                className="px-5 py-3 bg-brand hover:bg-brand-dark text-white rounded-lg transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>
                        </form>

                        <div className="flex items-center gap-3">
                            <span className="text-muted text-sm">Sort by:</span>
                            <select
                                value={filters.sort || 'featured'}
                                onChange={(e) => handleSort(e.target.value)}
                                className="border border-border rounded-lg px-4 py-3 focus:border-brand focus:outline-none bg-surface transition-colors"
                            >
                                <option value="featured">Featured</option>
                                <option value="newest">Newest</option>
                                <option value="rating">Top Rated</option>
                                <option value="products">Most Products</option>
                            </select>
                        </div>
                    </div>

                    {/* Results Count */}
                    <p className="text-body mb-6">
                        Showing <span className="font-semibold text-heading">{vendors.total || vendors.data?.length || 0}</span> sellers
                    </p>

                    {/* Vendors Grid */}
                    {vendors.data?.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                            {vendors.data.map((vendor) => (
                                <Link
                                    key={vendor.id}
                                    href={route('vendor.details', vendor.slug)}
                                    className="group bg-surface border border-border-light rounded-xl overflow-hidden hover:border-border hover:shadow-card-hover transition-all"
                                >
                                    {/* Banner */}
                                    <div
                                        className="h-28 bg-cover bg-center relative"
                                        style={{
                                            backgroundImage: vendor.banner
                                                ? `url('${vendor.banner}')`
                                                : 'linear-gradient(135deg, #1a1a1a 0%, #333 100%)'
                                        }}
                                    >
                                        <div className="absolute inset-0 bg-black/20"></div>
                                        {vendor.is_featured && (
                                            <div className="absolute top-3 right-3">
                                                <span className="bg-brand-2 text-brand-dark px-2.5 py-1 rounded text-[10px] font-bold uppercase">
                                                    Featured
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="p-5 relative">
                                        {/* Logo */}
                                        <div className="absolute -top-8 left-5">
                                            {vendor.logo ? (
                                                <img
                                                    src={vendor.logo}
                                                    alt={vendor.shop_name}
                                                    className="w-14 h-14 rounded-xl object-cover border-3 border-surface shadow-card"
                                                />
                                            ) : (
                                                <div className="w-14 h-14 rounded-xl bg-brand flex items-center justify-center border-3 border-surface shadow-card">
                                                    <span className="text-xl font-bold text-white">
                                                        {vendor.shop_name?.charAt(0)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-6">
                                            <h3 className="font-bold text-lg text-heading group-hover:text-brand transition-colors flex items-center gap-2">
                                                {vendor.shop_name}
                                                {vendor.is_verified && (
                                                    <svg className="w-4 h-4 text-info" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                                    </svg>
                                                )}
                                            </h3>

                                            {/* Rating */}
                                            <div className="mt-1.5">
                                                <StarRating rating={vendor.rating || 0} size="xs" />
                                            </div>

                                            {/* Description */}
                                            {vendor.description && (
                                                <p className="text-body text-sm mt-3 line-clamp-2">
                                                    {vendor.description}
                                                </p>
                                            )}

                                            {/* Stats */}
                                            <div className="flex items-center gap-5 mt-4 text-sm text-muted">
                                                <span className="flex items-center gap-1.5">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                    </svg>
                                                    {vendor.total_products || 0} products
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                                    </svg>
                                                    {vendor.total_sales || 0} sales
                                                </span>
                                            </div>

                                            {/* Location */}
                                            {vendor.country && (
                                                <div className="flex items-center gap-1.5 mt-3 text-sm text-subtle">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    {vendor.country}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            icon="shop"
                            title="No sellers found"
                            description={filters.search
                                ? 'No sellers match your search criteria.'
                                : 'No sellers available at the moment.'}
                        />
                    )}

                    {/* Pagination */}
                    <Pagination pagination={vendors} />
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-12 lg:py-16 bg-surface-raised">
                <div className="container mx-auto px-4">
                    <div className="max-w-2xl mx-auto text-center">
                        <h2 className="text-2xl lg:text-3xl font-bold text-heading mb-4">
                            Want to become a seller?
                        </h2>
                        <p className="text-body mb-6">
                            Join our marketplace and reach thousands of customers across Malawi.
                        </p>
                        <Link
                            href={route('vendor.guide')}
                            className="inline-flex items-center gap-2 bg-brand hover:bg-brand-dark text-white px-8 py-4 rounded-lg font-semibold transition-all shadow-button hover:shadow-button-hover"
                        >
                            Learn How to Sell
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </section>
        </FrontendLayout>
    );
}
