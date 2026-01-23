import FilterWidget from './FilterWidget';

/**
 * BrandFilter - Brand/vendor checkbox filter
 *
 * @param {Array} brands - Array of brand objects: [{ id, name, products_count? }]
 * @param {string|number} activeBrand - Currently selected brand ID
 * @param {function} onBrandChange - Callback when brand is selected: (brandId) => void
 * @param {boolean} showCounts - Whether to show product counts (default: true)
 * @param {boolean} useRadio - Whether to use radio buttons instead of checkboxes (default: true)
 * @param {string} title - Widget title (default: 'Brands')
 * @param {string} className - Additional CSS classes
 */
export default function BrandFilter({
    brands = [],
    activeBrand = null,
    onBrandChange,
    showCounts = true,
    useRadio = true,
    title = 'Brands',
    className = '',
}) {
    if (!brands || brands.length === 0) {
        return null;
    }

    const handleChange = (brandId) => {
        if (onBrandChange) {
            onBrandChange(brandId);
        }
    };

    return (
        <FilterWidget title={title} className={className}>
            <ul className="space-y-2">
                {brands.map((brand) => {
                    const isActive = activeBrand?.toString() === brand.id?.toString();

                    return (
                        <li key={brand.id}>
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input
                                    type={useRadio ? 'radio' : 'checkbox'}
                                    name="brand"
                                    className="w-4 h-4 accent-brand"
                                    checked={isActive}
                                    onChange={() => handleChange(brand.id)}
                                />
                                <span className={`text-sm ${isActive ? 'text-brand' : 'text-body group-hover:text-heading'} transition-colors`}>
                                    {brand.name}
                                </span>
                                {showCounts && brand.products_count !== undefined && (
                                    <span className="text-xs text-muted ml-auto">
                                        ({brand.products_count})
                                    </span>
                                )}
                            </label>
                        </li>
                    );
                })}
            </ul>
        </FilterWidget>
    );
}

/**
 * CheckboxFilter - Generic checkbox filter component
 */
export function CheckboxFilter({
    options = [],
    activeOptions = [],
    onOptionChange,
    title = 'Filter',
    className = '',
}) {
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
        <FilterWidget title={title} className={className}>
            <ul className="space-y-2">
                {options.map((option) => {
                    const isActive = activeOptions.includes(option.id);

                    return (
                        <li key={option.id}>
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 accent-brand rounded"
                                    checked={isActive}
                                    onChange={() => handleChange(option.id)}
                                />
                                <span className={`text-sm ${isActive ? 'text-brand' : 'text-body group-hover:text-heading'} transition-colors`}>
                                    {option.name || option.label}
                                </span>
                                {option.count !== undefined && (
                                    <span className="text-xs text-muted ml-auto">
                                        ({option.count})
                                    </span>
                                )}
                            </label>
                        </li>
                    );
                })}
            </ul>
        </FilterWidget>
    );
}
