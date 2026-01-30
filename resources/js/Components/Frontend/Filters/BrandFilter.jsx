import { useState, useMemo } from 'react';

/**
 * BrandFilter - Refined brand filter with search and limited display
 *
 * Design: Clean checkboxes with search for large lists
 */
export default function BrandFilter({
    brands = [],
    activeBrand = null,
    onBrandChange,
    showCounts = true,
    maxVisible = 6,
    showSearch = true,
    className = '',
}) {
    const [showAll, setShowAll] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Filter and limit brands
    const filteredBrands = useMemo(() => {
        if (!searchQuery.trim()) {
            return brands;
        }
        return brands.filter(brand =>
            brand.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [brands, searchQuery]);

    const visibleBrands = useMemo(() => {
        if (showAll || searchQuery.trim() || filteredBrands.length <= maxVisible) {
            return filteredBrands;
        }
        return filteredBrands.slice(0, maxVisible);
    }, [filteredBrands, showAll, maxVisible, searchQuery]);

    const hiddenCount = filteredBrands.length - maxVisible;

    if (!brands || brands.length === 0) {
        return null;
    }

    const handleChange = (brandId) => {
        if (onBrandChange) {
            // Toggle: if clicking active brand, clear it
            onBrandChange(activeBrand?.toString() === brandId?.toString() ? null : brandId);
        }
    };

    return (
        <div className={className}>
            {/* Search Input - only show if many brands */}
            {showSearch && brands.length > maxVisible && (
                <div className="relative mb-4">
                    <input
                        type="text"
                        placeholder="Search brands..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="
                            w-full py-2.5 pl-9 pr-3 rounded-lg
                            text-sm text-heading placeholder:text-muted
                            bg-surface-sunken border-0
                            focus:outline-none focus:ring-2 focus:ring-heading/10
                            transition-all duration-200
                        "
                    />
                    <svg
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-heading"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
            )}

            {/* Brand List */}
            <ul className="space-y-1">
                {visibleBrands.map((brand) => {
                    const isActive = activeBrand?.toString() === brand.id?.toString();

                    return (
                        <li key={brand.id}>
                            <label
                                className={`
                                    flex items-center gap-3 py-2.5 px-3 rounded-lg cursor-pointer
                                    transition-all duration-200
                                    ${isActive
                                        ? 'bg-heading text-white'
                                        : 'hover:bg-surface-sunken text-heading'
                                    }
                                `}
                            >
                                {/* Custom Checkbox */}
                                <span className={`
                                    w-4 h-4 rounded border-2 flex items-center justify-center
                                    transition-all duration-200
                                    ${isActive
                                        ? 'bg-white border-white'
                                        : 'border-border-dark group-hover:border-heading'
                                    }
                                `}>
                                    {isActive && (
                                        <svg className="w-2.5 h-2.5 text-heading" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </span>
                                <input
                                    type="checkbox"
                                    className="sr-only"
                                    checked={isActive}
                                    onChange={() => handleChange(brand.id)}
                                />
                                <span className="flex-1 text-sm font-medium truncate">
                                    {brand.name}
                                </span>
                                {showCounts && brand.products_count !== undefined && (
                                    <span className={`
                                        text-xs font-medium shrink-0
                                        ${isActive ? 'text-white/60' : 'text-muted'}
                                    `}>
                                        {brand.products_count}
                                    </span>
                                )}
                            </label>
                        </li>
                    );
                })}
            </ul>

            {/* No Results */}
            {searchQuery && filteredBrands.length === 0 && (
                <p className="text-sm text-muted text-center py-4">
                    No brands match "{searchQuery}"
                </p>
            )}

            {/* Show More/Less Toggle */}
            {!searchQuery && filteredBrands.length > maxVisible && (
                <button
                    onClick={() => setShowAll(!showAll)}
                    className="
                        mt-3 w-full py-2 px-3 rounded-lg
                        text-sm font-medium text-muted
                        hover:text-heading hover:bg-surface-sunken
                        transition-all duration-200
                        flex items-center justify-center gap-1.5
                    "
                >
                    {showAll ? (
                        <>
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                            Show Less
                        </>
                    ) : (
                        <>
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                            +{hiddenCount} more
                        </>
                    )}
                </button>
            )}
        </div>
    );
}

/**
 * CheckboxFilter - Generic checkbox filter component
 */
export function CheckboxFilter({
    options = [],
    activeOptions = [],
    onOptionChange,
    maxVisible = 6,
    className = '',
}) {
    const [showAll, setShowAll] = useState(false);

    const visibleOptions = useMemo(() => {
        if (showAll || options.length <= maxVisible) {
            return options;
        }
        return options.slice(0, maxVisible);
    }, [options, showAll, maxVisible]);

    const hiddenCount = options.length - maxVisible;

    if (!options || options.length === 0) {
        return null;
    }

    const handleChange = (optionId) => {
        if (onOptionChange) {
            const isActive = activeOptions.includes(optionId);
            if (isActive) {
                onOptionChange(activeOptions.filter((id) => id !== optionId));
            } else {
                onOptionChange([...activeOptions, optionId]);
            }
        }
    };

    return (
        <div className={className}>
            <ul className="space-y-1">
                {visibleOptions.map((option) => {
                    const isActive = activeOptions.includes(option.id);

                    return (
                        <li key={option.id}>
                            <label
                                className={`
                                    flex items-center gap-3 py-2.5 px-3 rounded-lg cursor-pointer
                                    transition-all duration-200
                                    ${isActive
                                        ? 'bg-heading text-white'
                                        : 'hover:bg-surface-sunken text-heading'
                                    }
                                `}
                            >
                                <span className={`
                                    w-4 h-4 rounded border-2 flex items-center justify-center
                                    transition-all duration-200
                                    ${isActive
                                        ? 'bg-white border-white'
                                        : 'border-border-dark'
                                    }
                                `}>
                                    {isActive && (
                                        <svg className="w-2.5 h-2.5 text-heading" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </span>
                                <input
                                    type="checkbox"
                                    className="sr-only"
                                    checked={isActive}
                                    onChange={() => handleChange(option.id)}
                                />
                                <span className="flex-1 text-sm font-medium">
                                    {option.name || option.label}
                                </span>
                                {option.count !== undefined && (
                                    <span className={`text-xs font-medium ${isActive ? 'text-white/60' : 'text-muted'}`}>
                                        {option.count}
                                    </span>
                                )}
                            </label>
                        </li>
                    );
                })}
            </ul>

            {options.length > maxVisible && (
                <button
                    onClick={() => setShowAll(!showAll)}
                    className="
                        mt-3 w-full py-2 px-3 rounded-lg
                        text-sm font-medium text-muted
                        hover:text-heading hover:bg-surface-sunken
                        transition-all duration-200
                        flex items-center justify-center gap-1.5
                    "
                >
                    {showAll ? 'Show Less' : `+${hiddenCount} more`}
                </button>
            )}
        </div>
    );
}
