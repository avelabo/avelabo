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

export default function Shop({ products, categories, brands, priceRange, featuredProducts, currentCategory, filters }) {
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

            {/* Page Header */}
            <div className="bg-surface-raised border-b border-border-light">
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-2xl lg:text-3xl font-bold text-heading mb-2">
                        {currentCategory ? currentCategory.name : 'Shop'}
                    </h1>
                    <p className="text-body">
                        Browse our collection of quality products
                    </p>

                    {/* Active Filter Tags */}
                    {hasActiveFilters && (
                        <div className="flex items-center gap-2 flex-wrap mt-4">
                            {filters?.search && (
                                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-surface border border-border text-sm text-heading rounded-full">
                                    Search: "{filters.search}"
                                    <button onClick={() => handleFilterChange('search', null)} className="hover:text-danger">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </span>
                            )}
                            {filters?.category && currentCategory && (
                                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-surface border border-border text-sm text-heading rounded-full">
                                    {currentCategory.name}
                                    <button onClick={() => handleFilterChange('category', null)} className="hover:text-danger">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </span>
                            )}
                            {(filters?.min_price || filters?.max_price) && (
                                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-surface border border-border text-sm text-heading rounded-full">
                                    Price: {format(filters.min_price || 0)} - {format(filters.max_price || priceRange?.max)}
                                    <button onClick={() => { handleFilterChange('min_price', null); handleFilterChange('max_price', null); }} className="hover:text-danger">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </span>
                            )}
                            <button onClick={clearFilters} className="text-sm text-brand hover:text-brand-dark font-medium">
                                Clear all
                            </button>
                        </div>
                    )}
                </div>
            </div>

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
