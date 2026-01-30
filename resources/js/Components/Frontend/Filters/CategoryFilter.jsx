import { useState, useMemo } from 'react';
import { Link } from '@inertiajs/react';

/**
 * CategoryFilter - Refined category filter with collapsible subcategories
 *
 * Design: Clean, minimal aesthetic with smooth animations
 * Strategy: Show limited parent categories, expandable subcategories on demand
 */
export default function CategoryFilter({
    categories = [],
    activeCategory = null,
    onCategoryChange = null,
    baseRoute = 'shop',
    showCounts = true,
    maxVisible = 8,
    className = '',
}) {
    const [expandedCategories, setExpandedCategories] = useState(() => {
        // Auto-expand category that contains the active subcategory
        if (activeCategory) {
            const parent = categories.find(cat =>
                cat.children?.some(child => child.slug === activeCategory)
            );
            return parent ? [parent.id] : [];
        }
        return [];
    });
    const [showAll, setShowAll] = useState(false);

    // Memoize visible categories
    const visibleCategories = useMemo(() => {
        if (showAll || categories.length <= maxVisible) {
            return categories;
        }
        return categories.slice(0, maxVisible);
    }, [categories, showAll, maxVisible]);

    const hiddenCount = categories.length - maxVisible;

    if (!categories || categories.length === 0) {
        return null;
    }

    const handleCategoryClick = (e, category) => {
        if (onCategoryChange) {
            e.preventDefault();
            onCategoryChange(category.slug);
        }
    };

    const toggleExpand = (categoryId, e) => {
        e.stopPropagation();
        setExpandedCategories(prev =>
            prev.includes(categoryId)
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId]
        );
    };

    const isExpanded = (categoryId) => expandedCategories.includes(categoryId);

    return (
        <div className={className}>
            <ul className="space-y-1">
                {visibleCategories.map((category) => {
                    const isActive = activeCategory === category.slug;
                    const hasChildren = category.children?.length > 0;
                    const expanded = isExpanded(category.id);
                    const hasActiveChild = category.children?.some(child => child.slug === activeCategory);

                    return (
                        <li key={category.id}>
                            {/* Parent Category */}
                            <div
                                className={`
                                    group flex items-center gap-2 py-2.5 px-3 rounded-lg cursor-pointer
                                    transition-all duration-200 ease-out
                                    ${isActive || hasActiveChild
                                        ? 'bg-heading text-white'
                                        : 'hover:bg-surface-sunken text-heading'
                                    }
                                `}
                            >
                                {/* Expand/Collapse Toggle for categories with children */}
                                {hasChildren ? (
                                    <button
                                        onClick={(e) => toggleExpand(category.id, e)}
                                        className={`
                                            w-5 h-5 flex items-center justify-center rounded
                                            transition-all duration-200
                                            ${isActive || hasActiveChild
                                                ? 'text-white/70 hover:text-white hover:bg-white/10'
                                                : 'text-muted hover:text-heading hover:bg-border-light'
                                            }
                                        `}
                                    >
                                        <svg
                                            className={`w-3.5 h-3.5 transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                ) : (
                                    <span className="w-5 h-5 flex items-center justify-center">
                                        <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-white' : 'bg-border-dark'}`} />
                                    </span>
                                )}

                                {/* Category Link */}
                                <Link
                                    href={route(baseRoute, { category: category.slug })}
                                    onClick={(e) => handleCategoryClick(e, category)}
                                    className="flex-1 flex items-center justify-between min-w-0"
                                >
                                    <span className="text-sm font-medium truncate">
                                        {category.name}
                                    </span>
                                    {showCounts && category.products_count !== undefined && (
                                        <span className={`
                                            text-xs font-medium ml-2 shrink-0
                                            ${isActive || hasActiveChild ? 'text-white/60' : 'text-muted'}
                                        `}>
                                            {category.products_count}
                                        </span>
                                    )}
                                </Link>
                            </div>

                            {/* Subcategories - Animated Collapse */}
                            {hasChildren && (
                                <div
                                    className={`
                                        overflow-hidden transition-all duration-300 ease-out
                                        ${expanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
                                    `}
                                >
                                    <ul className="ml-5 mt-1 mb-2 pl-3 border-l border-border-light space-y-0.5">
                                        {category.children.map((child) => {
                                            const isChildActive = activeCategory === child.slug;

                                            return (
                                                <li key={child.id}>
                                                    <Link
                                                        href={route(baseRoute, { category: child.slug })}
                                                        onClick={(e) => handleCategoryClick(e, child)}
                                                        className={`
                                                            flex items-center justify-between py-2 px-3 rounded-md
                                                            text-sm transition-all duration-150
                                                            ${isChildActive
                                                                ? 'bg-heading/5 text-heading font-medium'
                                                                : 'text-body hover:text-heading hover:bg-surface-sunken'
                                                            }
                                                        `}
                                                    >
                                                        <span className="truncate">{child.name}</span>
                                                        {showCounts && child.products_count !== undefined && (
                                                            <span className="text-xs text-muted ml-2 shrink-0">
                                                                {child.products_count}
                                                            </span>
                                                        )}
                                                    </Link>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            )}
                        </li>
                    );
                })}
            </ul>

            {/* Show More/Less Toggle */}
            {categories.length > maxVisible && (
                <button
                    onClick={() => setShowAll(!showAll)}
                    className="
                        mt-4 w-full py-2.5 px-3 rounded-lg
                        text-sm font-medium text-muted
                        border border-dashed border-border-light
                        hover:border-border hover:text-heading hover:bg-surface-sunken
                        transition-all duration-200
                        flex items-center justify-center gap-2
                    "
                >
                    {showAll ? (
                        <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                            Show Less
                        </>
                    ) : (
                        <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                            Show {hiddenCount} More
                        </>
                    )}
                </button>
            )}
        </div>
    );
}
