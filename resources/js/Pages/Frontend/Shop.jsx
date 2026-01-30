import { useState } from 'react';
import { Link, Head, router } from '@inertiajs/react';
import FrontendLayout from '@/Layouts/FrontendLayout';
import Breadcrumb from '@/Components/Frontend/Breadcrumb';
import ProductCard from '@/Components/Frontend/ProductCard';
import ProductListItem from '@/Components/Frontend/ProductListItem';
import EmptyState from '@/Components/Frontend/EmptyState';
import Pagination from '@/Components/Frontend/Pagination';
import { CategoryFilter, PriceRangeFilter, BrandFilter } from '@/Components/Frontend/Filters';
import { useCurrency } from '@/hooks/useCurrency';

export default function Shop({ products, categories, brands, priceRange, featuredProducts, currentCategory, currentBrand, filters }) {
    const { format } = useCurrency();
    const [showDropdown, setShowDropdown] = useState(null);
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    const sortOptions = [
        { value: 'featured', label: 'Featured' },
        { value: 'price_low', label: 'Price: Low to High' },
        { value: 'price_high', label: 'Price: High to Low' },
        { value: 'newest', label: 'Newest' },
        { value: 'rating', label: 'Top Rated' },
    ];
    const showOptions = [12, 24, 36, 48];

    const handleFilterChange = (key, value) => {
        router.get(route('shop'), { ...filters, [key]: value || undefined }, { preserveState: true, preserveScroll: true });
    };

    const handlePriceFilter = (min, max) => {
        router.get(route('shop'), { ...filters, min_price: min, max_price: max }, { preserveState: true });
    };

    const clearFilters = () => {
        router.get(route('shop'));
    };

    const hasActiveFilters = filters?.category || filters?.brand || filters?.min_price || filters?.max_price || filters?.search;

    // Count active filters for display
    const activeFilterCount = [
        filters?.search,
        filters?.category,
        filters?.brand,
        (filters?.min_price || filters?.max_price),
    ].filter(Boolean).length;

    const breadcrumbItems = [
        { label: 'Home', href: '/' },
        { label: 'Shop', href: route('shop') },
        ...(currentCategory ? [{ label: currentCategory.name }] : []),
    ];

    return (
        <FrontendLayout>
            <Head title={currentCategory ? currentCategory.name : 'Shop'} />

            {/* Breadcrumb */}
            <div className="border-b border-border-light">
                <div className="container mx-auto px-4 py-4">
                    <Breadcrumb items={breadcrumbItems} separator="chevron" />
                </div>
            </div>

            {/* Page Header - Only show when no active filters */}
            {!hasActiveFilters && (
                <div className="bg-surface-raised border-b border-border-light">
                    <div className="container mx-auto px-4 py-8">
                        <h1 className="text-2xl lg:text-3xl font-bold text-heading mb-2">
                            {currentCategory ? currentCategory.name : 'Shop'}
                        </h1>
                        <p className="text-body">
                            Browse our collection of quality products
                        </p>
                    </div>
                </div>
            )}

            {/* Active Filters Bar - Prominent display for non-tech-savvy users */}
            {hasActiveFilters && (
                <div className="bg-gradient-to-r from-brand-2-light/60 via-brand-2-light/40 to-brand-2-light/60 border-b border-brand-2/20">
                    <div className="container mx-auto px-4 py-4">
                        {/* Header with filter count and clear all */}
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-brand-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                </svg>
                                <span className="font-semibold text-heading">
                                    Showing filtered results
                                </span>
                                <span className="text-sm text-body">
                                    ({activeFilterCount} {activeFilterCount === 1 ? 'filter' : 'filters'} applied)
                                </span>
                            </div>
                            <button
                                onClick={clearFilters}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-danger hover:text-white hover:bg-danger rounded-lg transition-all duration-200"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Clear all filters
                            </button>
                        </div>

                        {/* Filter chips with clear labels */}
                        <div className="flex items-center gap-2 flex-wrap">
                            {filters?.search && (
                                <div className="group inline-flex items-center bg-white rounded-lg border border-brand-2/30 shadow-sm overflow-hidden transition-all duration-200 hover:border-brand-2 hover:shadow-md">
                                    <span className="px-3 py-2 text-xs font-semibold text-brand-2 bg-brand-2/10 uppercase tracking-wide">
                                        Search
                                    </span>
                                    <span className="px-3 py-2 text-sm text-heading font-medium">
                                        "{filters.search}"
                                    </span>
                                    <button
                                        onClick={() => handleFilterChange('search', null)}
                                        className="px-2.5 py-2 text-muted hover:text-white hover:bg-danger transition-colors duration-200"
                                        title="Remove search filter"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            )}

                            {filters?.category && currentCategory && (
                                <div className="group inline-flex items-center bg-white rounded-lg border border-brand-2/30 shadow-sm overflow-hidden transition-all duration-200 hover:border-brand-2 hover:shadow-md">
                                    <span className="px-3 py-2 text-xs font-semibold text-brand-2 bg-brand-2/10 uppercase tracking-wide">
                                        Category
                                    </span>
                                    <span className="px-3 py-2 text-sm text-heading font-medium">
                                        {currentCategory.name}
                                    </span>
                                    <button
                                        onClick={() => handleFilterChange('category', null)}
                                        className="px-2.5 py-2 text-muted hover:text-white hover:bg-danger transition-colors duration-200"
                                        title="Remove category filter"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            )}

                            {currentBrand && (
                                <div className="group inline-flex items-center bg-white rounded-lg border border-brand-2/30 shadow-sm overflow-hidden transition-all duration-200 hover:border-brand-2 hover:shadow-md">
                                    <span className="px-3 py-2 text-xs font-semibold text-brand-2 bg-brand-2/10 uppercase tracking-wide">
                                        Brand
                                    </span>
                                    <span className="px-3 py-2 text-sm text-heading font-medium">
                                        {currentBrand.name}
                                    </span>
                                    <button
                                        onClick={() => handleFilterChange('brand', null)}
                                        className="px-2.5 py-2 text-muted hover:text-white hover:bg-danger transition-colors duration-200"
                                        title="Remove brand filter"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            )}

                            {(filters?.min_price || filters?.max_price) && (
                                <div className="group inline-flex items-center bg-white rounded-lg border border-brand-2/30 shadow-sm overflow-hidden transition-all duration-200 hover:border-brand-2 hover:shadow-md">
                                    <span className="px-3 py-2 text-xs font-semibold text-brand-2 bg-brand-2/10 uppercase tracking-wide">
                                        Price
                                    </span>
                                    <span className="px-3 py-2 text-sm text-heading font-medium">
                                        {format(filters.min_price || 0)} – {format(filters.max_price || priceRange?.max)}
                                    </span>
                                    <button
                                        onClick={() => { handleFilterChange('min_price', null); handleFilterChange('max_price', null); }}
                                        className="px-2.5 py-2 text-muted hover:text-white hover:bg-danger transition-colors duration-200"
                                        title="Remove price filter"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Helpful hint for non-tech users */}
                        <p className="mt-3 text-xs text-body flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Click the <span className="inline-flex items-center justify-center w-4 h-4 bg-surface-sunken rounded text-[10px]">✕</span> on any filter to remove it, or "Clear all filters" to see everything
                        </p>
                    </div>
                </div>
            )}

            {/* Shop Content */}
            <section className="py-8 lg:py-12">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Sidebar */}
                        <aside className={`w-full lg:w-[280px] flex-shrink-0 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
                            <div className="lg:sticky lg:top-24 space-y-6">
                                {/* Category Filter */}
                                <div className="bg-surface rounded-xl border border-border-light p-5">
                                    <h3 className="font-semibold text-heading mb-4 flex items-center justify-between">
                                        Categories
                                        {filters?.category && (
                                            <button
                                                onClick={() => handleFilterChange('category', null)}
                                                className="text-xs text-muted hover:text-brand"
                                            >
                                                Clear
                                            </button>
                                        )}
                                    </h3>
                                    <CategoryFilter
                                        categories={categories}
                                        activeCategory={filters?.category}
                                        onCategoryChange={(slug) => handleFilterChange('category', slug)}
                                    />
                                </div>

                                {/* Price Range Filter */}
                                <div className="bg-surface rounded-xl border border-border-light p-5">
                                    <h3 className="font-semibold text-heading mb-4">Price Range</h3>
                                    <PriceRangeFilter
                                        min={priceRange?.min || 0}
                                        max={priceRange?.max || 10000}
                                        currentMax={filters?.max_price}
                                        onApply={handlePriceFilter}
                                    />
                                </div>

                                {/* Brand Filter */}
                                {brands?.length > 0 && (
                                    <div className="bg-surface rounded-xl border border-border-light p-5">
                                        <h3 className="font-semibold text-heading mb-4">Brands</h3>
                                        <BrandFilter
                                            brands={brands}
                                            activeBrand={filters?.brand}
                                            onBrandChange={(brandId) => handleFilterChange('brand', brandId)}
                                        />
                                    </div>
                                )}

                                {/* Featured Products Widget */}
                                {featuredProducts?.length > 0 && (
                                    <div className="bg-surface rounded-xl border border-border-light p-5">
                                        <h3 className="font-semibold text-heading mb-4">Featured Products</h3>
                                        <div className="space-y-4">
                                            {featuredProducts.slice(0, 3).map((product) => (
                                                <ProductListItem
                                                    key={product.id}
                                                    product={product}
                                                    showRating={false}
                                                    imageSize="md"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </aside>

                        {/* Products Grid */}
                        <div className="flex-1">
                            {/* Filter Bar */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b border-border-light">
                                <div className="flex items-center gap-4">
                                    {/* Mobile Filter Toggle */}
                                    <button
                                        onClick={() => setShowMobileFilters(!showMobileFilters)}
                                        className="lg:hidden flex items-center gap-2 text-sm font-medium text-heading px-4 py-2 border border-border rounded-lg"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                        </svg>
                                        Filters
                                    </button>
                                    <p className="text-sm text-body">
                                        <span className="font-semibold text-heading">{products?.total || 0}</span> products found
                                    </p>
                                </div>

                                <div className="flex items-center gap-4">
                                    {/* Show Dropdown */}
                                    <div className="relative">
                                        <button
                                            className="flex items-center gap-2 text-sm text-heading px-3 py-2 border border-border-light rounded-lg hover:border-border transition-colors"
                                            onClick={() => setShowDropdown(showDropdown === 'show' ? null : 'show')}
                                        >
                                            Show: <span className="font-semibold">{filters?.per_page || 12}</span>
                                            <svg className="w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                        {showDropdown === 'show' && (
                                            <ul className="absolute top-full right-0 mt-2 bg-surface rounded-lg shadow-dropdown border border-border-light py-2 min-w-[100px] z-50">
                                                {showOptions.map((option) => (
                                                    <li key={option}>
                                                        <button
                                                            onClick={() => { handleFilterChange('per_page', option); setShowDropdown(null); }}
                                                            className={`block w-full text-left px-4 py-2 hover:bg-surface-raised text-sm transition-colors ${(filters?.per_page || 12) === option ? 'text-brand font-medium' : 'text-heading'}`}
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
                                            className="flex items-center gap-2 text-sm text-heading px-3 py-2 border border-border-light rounded-lg hover:border-border transition-colors"
                                            onClick={() => setShowDropdown(showDropdown === 'sort' ? null : 'sort')}
                                        >
                                            Sort: <span className="font-semibold">{sortOptions.find(o => o.value === (filters?.sort || 'featured'))?.label}</span>
                                            <svg className="w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                        {showDropdown === 'sort' && (
                                            <ul className="absolute top-full right-0 mt-2 bg-surface rounded-lg shadow-dropdown border border-border-light py-2 min-w-[180px] z-50">
                                                {sortOptions.map((option) => (
                                                    <li key={option.value}>
                                                        <button
                                                            onClick={() => { handleFilterChange('sort', option.value); setShowDropdown(null); }}
                                                            className={`block w-full text-left px-4 py-2 hover:bg-surface-raised text-sm transition-colors ${(filters?.sort || 'featured') === option.value ? 'text-brand font-medium' : 'text-heading'}`}
                                                        >
                                                            {option.label}
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Product Grid */}
                            {products?.data?.length > 0 ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6 mb-8">
                                    {products.data.map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>
                            ) : (
                                <EmptyState
                                    icon="box"
                                    title="No products found"
                                    description="Try adjusting your filters or search terms"
                                    action={{
                                        label: 'Clear Filters',
                                        onClick: clearFilters,
                                    }}
                                />
                            )}

                            {/* Pagination */}
                            <Pagination pagination={products} />
                        </div>
                    </div>
                </div>
            </section>
        </FrontendLayout>
    );
}
