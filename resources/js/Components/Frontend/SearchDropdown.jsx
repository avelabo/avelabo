import { Link } from '@inertiajs/react';
import { useCurrency } from '@/hooks/useCurrency';

export default function SearchDropdown({ results, isLoading, isOpen, onClose, query }) {
    const { format } = useCurrency();

    if (!isOpen) return null;

    const { products = [], categories = [], brands = [], fuzzy = false } = results || {};
    const hasResults = products.length > 0 || categories.length > 0 || brands.length > 0;

    return (
        <div
            className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl shadow-black/10 border border-gray-100 overflow-hidden z-50"
            onMouseDown={(e) => e.stopPropagation()}
        >
            {/* Loading State */}
            {isLoading && (
                <div className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-[#f1b945] border-t-transparent rounded-full animate-spin" />
                        <span className="text-gray-500 text-sm">Searching...</span>
                    </div>
                </div>
            )}

            {/* No Results */}
            {!isLoading && !hasResults && query.length >= 2 && (
                <div className="p-6 text-center">
                    <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                    <p className="text-gray-500 text-sm">No results found for "{query}"</p>
                    <p className="text-gray-400 text-xs mt-1">Try a different search term</p>
                </div>
            )}

            {/* Results */}
            {!isLoading && hasResults && (
                <>
                    <div className="max-h-[420px] overflow-y-auto">
                        {/* Fuzzy Match Indicator */}
                        {fuzzy && (
                            <div className="px-4 py-2 bg-amber-50 border-b border-amber-100">
                                <p className="text-xs text-amber-700 flex items-center gap-1.5">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>Showing similar results for "<strong>{query}</strong>"</span>
                                </p>
                            </div>
                        )}

                        {/* Products Section */}
                        {products.length > 0 && (
                            <div className="border-b border-gray-100">
                                <div className="px-4 py-2 bg-gray-50">
                                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Products</h4>
                                </div>
                                <div className="divide-y divide-gray-50">
                                    {products.map((product) => (
                                        <Link
                                            key={product.id}
                                            href={product.url}
                                            className="flex items-center gap-4 px-4 py-3 hover:bg-[#f1b945]/5 transition-colors"
                                            onClick={onClose}
                                        >
                                            {/* Product Image */}
                                            <div className="w-14 h-14 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                                                {product.image ? (
                                                    <img
                                                        src={product.image}
                                                        alt={product.name}
                                                        className="w-full h-full object-contain p-1"
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Product Info */}
                                            <div className="flex-1 min-w-0">
                                                <h5 className="text-sm font-medium text-[#2a2a2a] truncate">
                                                    {product.name}
                                                </h5>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    {product.category && (
                                                        <span className="text-xs text-gray-400">{product.category}</span>
                                                    )}
                                                    {product.brand && (
                                                        <>
                                                            {product.category && <span className="text-gray-300">|</span>}
                                                            <span className="text-xs text-gray-400">{product.brand}</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Price */}
                                            <div className="text-right flex-shrink-0">
                                                <span className="text-sm font-bold text-[#2a2a2a]">
                                                    {format(product.price)}
                                                </span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Categories Section */}
                        {categories.length > 0 && (
                            <div className="border-b border-gray-100">
                                <div className="px-4 py-2 bg-gray-50">
                                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Categories</h4>
                                </div>
                                <div className="p-3 flex flex-wrap gap-2">
                                    {categories.map((category) => (
                                        <Link
                                            key={category.id}
                                            href={category.url}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-[#f1b945]/20 text-[#2a2a2a] text-sm rounded-full transition-colors"
                                            onClick={onClose}
                                        >
                                            <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                            </svg>
                                            <span>{category.name}</span>
                                            {category.products_count > 0 && (
                                                <span className="text-xs text-gray-400">({category.products_count})</span>
                                            )}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Brands Section */}
                        {brands.length > 0 && (
                            <div>
                                <div className="px-4 py-2 bg-gray-50">
                                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Brands</h4>
                                </div>
                                <div className="p-3 flex flex-wrap gap-2">
                                    {brands.map((brand) => (
                                        <Link
                                            key={brand.id}
                                            href={brand.url}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-[#f1b945]/20 text-[#2a2a2a] text-sm rounded-full transition-colors"
                                            onClick={onClose}
                                        >
                                            <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                            </svg>
                                            <span>{brand.name}</span>
                                            {brand.products_count > 0 && (
                                                <span className="text-xs text-gray-400">({brand.products_count})</span>
                                            )}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* View All Results Link - Fixed at bottom */}
                    {products.length > 0 && (
                        <div className="p-3 bg-gray-50 border-t border-gray-100">
                            <Link
                                href={`/shop?search=${encodeURIComponent(query)}`}
                                className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#2a2a2a] hover:bg-[#1a1a1a] text-white font-medium text-sm rounded-lg transition-colors"
                                onClick={onClose}
                            >
                                <span>View all results</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </Link>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
