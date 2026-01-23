import { Link } from '@inertiajs/react';
import FilterWidget from './FilterWidget';

/**
 * CategoryFilter - Category tree filter with product counts
 *
 * @param {Array} categories - Array of category objects with optional children
 * @param {string} activeCategory - Currently selected category slug
 * @param {function} onCategoryChange - Optional callback for category selection
 * @param {string} baseRoute - Route name for category links (default: 'shop')
 * @param {boolean} showCounts - Whether to show product counts (default: true)
 * @param {string} title - Widget title (default: 'Category')
 * @param {string} className - Additional CSS classes
 */
export default function CategoryFilter({
    categories = [],
    activeCategory = null,
    onCategoryChange = null,
    baseRoute = 'shop',
    showCounts = true,
    title = 'Category',
    className = '',
}) {
    if (!categories || categories.length === 0) {
        return null;
    }

    const handleCategoryClick = (e, category) => {
        if (onCategoryChange) {
            e.preventDefault();
            onCategoryChange(category.slug);
        }
    };

    const renderCategory = (category, isChild = false) => {
        const isActive = activeCategory === category.slug;

        return (
            <li key={category.id}>
                <Link
                    href={route(baseRoute, { category: category.slug })}
                    onClick={(e) => handleCategoryClick(e, category)}
                    className={`flex items-center justify-between group ${
                        isActive ? 'text-brand' : ''
                    }`}
                >
                    <div className="flex items-center gap-3">
                        {category.icon && !isChild && (
                            <i className={category.icon}></i>
                        )}
                        <span
                            className={`${
                                isChild ? 'text-sm' : ''
                            } ${
                                isActive
                                    ? 'text-brand'
                                    : 'text-heading group-hover:text-brand'
                            } transition-colors`}
                        >
                            {category.name}
                        </span>
                    </div>
                    {showCounts && category.products_count !== undefined && (
                        <span
                            className={`${
                                isChild ? 'text-xs text-muted' : 'bg-brand/10 text-brand text-xs px-2 py-1 rounded-full'
                            }`}
                        >
                            {isChild ? `(${category.products_count})` : category.products_count}
                        </span>
                    )}
                </Link>

                {/* Subcategories */}
                {category.children?.length > 0 && (
                    <ul className="ml-6 mt-2 space-y-2">
                        {category.children.map((child) => renderCategory(child, true))}
                    </ul>
                )}
            </li>
        );
    };

    return (
        <FilterWidget title={title} className={className}>
            <ul className="space-y-3">
                {categories.map((category) => renderCategory(category))}
            </ul>
        </FilterWidget>
    );
}
