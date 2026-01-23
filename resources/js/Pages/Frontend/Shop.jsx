import { useState } from 'react';
import { Link, Head, router } from '@inertiajs/react';
import FrontendLayout from '@/Layouts/FrontendLayout';
import Toast from '@/Components/Frontend/Toast';
import { PageHeader } from '@/Components/Frontend/Breadcrumb';
import ProductCard from '@/Components/Frontend/ProductCard';
import ProductListItem from '@/Components/Frontend/ProductListItem';
import EmptyState from '@/Components/Frontend/EmptyState';
import Pagination from '@/Components/Frontend/Pagination';
import { CategoryFilter, PriceRangeFilter, BrandFilter } from '@/Components/Frontend/Filters';
import { useCurrency } from '@/hooks/useCurrency';

export default function Shop({ products, categories, brands, priceRange, featuredProducts, currentCategory, filters }) {
    const { format } = useCurrency();

    // Filter states
    const [localPriceRange, setLocalPriceRange] = useState(filters?.max_price || priceRange?.max || 500);
    const [showDropdown, setShowDropdown] = useState(null);
    const [showToast, setShowToast] = useState(false);

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

    // Breadcrumb items
    const breadcrumbItems = [
        { label: 'Home', href: '/' },
        { label: 'Shop', href: route('shop') },
        ...(currentCategory ? [{ label: currentCategory.name }] : []),
    ];

    return (
        <FrontendLayout>
            {showToast && (
                <Toast
                    message="Product added to cart!"
                    type="success"
                    onClose={() => setShowToast(false)}
                />
            )}
            <Head title={currentCategory ? currentCategory.name : 'Shop'} />

            {/* Page Header / Breadcrumb */}
            <PageHeader
                title={currentCategory ? currentCategory.name : 'Shop'}
                breadcrumbItems={breadcrumbItems}
            >
                {/* Active Filter Tags */}
                {hasActiveFilters && (
                    <div className="flex items-center gap-3 flex-wrap">
                        {filters?.search && (
                            <span className="flex items-center gap-2 px-4 py-2 border border-brand bg-brand/5 text-brand rounded-full text-sm">
                                Search: {filters.search}
                                <button onClick={() => handleFilterChange('search', null)} className="hover:text-brand-dark">
                                    <i className="fi-rs-cross text-xs"></i>
                                </button>
                            </span>
                        )}
                        {filters?.category && (
                            <span className="flex items-center gap-2 px-4 py-2 border border-brand bg-brand/5 text-brand rounded-full text-sm">
                                {currentCategory?.name}
                                <button onClick={() => handleFilterChange('category', null)} className="hover:text-brand-dark">
                                    <i className="fi-rs-cross text-xs"></i>
                                </button>
                            </span>
                        )}
                        <button onClick={clearFilters} className="text-sm text-muted hover:text-brand">
                            Clear all
                        </button>
                    </div>
                )}
            </PageHeader>

            {/* Shop Content */}
            <div className="container mx-auto px-4 mb-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar (Left) */}
                    <aside className="w-full lg:w-[280px] flex-shrink-0 order-2 lg:order-1">
                        {/* Category Filter */}
                        <CategoryFilter
                            categories={categories}
                            activeCategory={filters?.category}
                            onCategoryChange={(slug) => handleFilterChange('category', slug)}
                            className="mb-6"
                        />

                        {/* Price Range Filter */}
                        <PriceRangeFilter
                            min={priceRange?.min || 0}
                            max={priceRange?.max || 10000}
                            currentMax={filters?.max_price}
                            onApply={handlePriceFilter}
                            className="mb-6"
                        />

                        {/* Brand Filter */}
                        <BrandFilter
                            brands={brands}
                            activeBrand={filters?.brand}
                            onBrandChange={(brandId) => handleFilterChange('brand', brandId)}
                            className="mb-6"
                        />

                        {/* Featured Products Widget */}
                        {featuredProducts?.length > 0 && (
                            <div className="bg-grey-9 rounded-xl p-6 mb-6">
                                <h5 className="font-quicksand font-bold text-heading text-lg mb-5 pb-4 border-b border-border">Featured Products</h5>
                                <div className="space-y-4">
                                    {featuredProducts.map((product) => (
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
                    </aside>

                    {/* Products Grid (Right) */}
                    <div className="flex-1 order-1 lg:order-2">
                        {/* Shop Filter Bar */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b border-border">
                            <p className="text-sm">
                                We found <strong className="text-brand">{products?.total || 0}</strong> items for you!
                            </p>
                            <div className="flex items-center gap-4">
                                {/* Show Dropdown */}
                                <div className="relative">
                                    <button
                                        className="flex items-center gap-2 text-sm text-heading"
                                        onClick={() => setShowDropdown(showDropdown === 'show' ? null : 'show')}
                                    >
                                        <i className="fi-rs-apps text-muted"></i>
                                        Show: <span className="font-semibold">{filters?.per_page || 12}</span>
                                        <i className="fi-rs-angle-small-down text-muted"></i>
                                    </button>
                                    {showDropdown === 'show' && (
                                        <ul className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-xl py-2 min-w-[100px] z-50">
                                            {showOptions.map((option) => (
                                                <li key={option}>
                                                    <button
                                                        onClick={() => { handleFilterChange('per_page', option); setShowDropdown(null); }}
                                                        className={`block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm ${(filters?.per_page || 12) === option ? 'text-brand' : 'text-heading'}`}
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
                                        className="flex items-center gap-2 text-sm text-heading"
                                        onClick={() => setShowDropdown(showDropdown === 'sort' ? null : 'sort')}
                                    >
                                        <i className="fi-rs-apps-sort text-muted"></i>
                                        Sort by: <span className="font-semibold">{sortOptions.find(o => o.value === (filters?.sort || 'featured'))?.label}</span>
                                        <i className="fi-rs-angle-small-down text-muted"></i>
                                    </button>
                                    {showDropdown === 'sort' && (
                                        <ul className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-xl py-2 min-w-[180px] z-50">
                                            {sortOptions.map((option) => (
                                                <li key={option.value}>
                                                    <button
                                                        onClick={() => { handleFilterChange('sort', option.value); setShowDropdown(null); }}
                                                        className={`block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm ${(filters?.sort || 'featured') === option.value ? 'text-brand' : 'text-heading'}`}
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
                            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-8">
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
                        <Pagination pagination={products} className="mb-10" />
                    </div>
                </div>
            </div>
        </FrontendLayout>
    );
}
