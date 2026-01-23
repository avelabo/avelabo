import { useState } from 'react';
import FilterWidget from './FilterWidget';
import { useCurrency } from '@/hooks/useCurrency';

/**
 * PriceRangeFilter - Price range filter with slider and inputs
 *
 * @param {number} min - Minimum price value (default: 0)
 * @param {number} max - Maximum price value (default: 10000)
 * @param {number} currentMin - Currently selected min price
 * @param {number} currentMax - Currently selected max price
 * @param {function} onApply - Callback when filter is applied: (min, max) => void
 * @param {string} title - Widget title (default: 'Filter by price')
 * @param {string} className - Additional CSS classes
 */
export default function PriceRangeFilter({
    min = 0,
    max = 10000,
    currentMin = null,
    currentMax = null,
    onApply,
    title = 'Filter by price',
    className = '',
}) {
    const { format } = useCurrency();
    const [localMax, setLocalMax] = useState(currentMax || max);

    const handleApply = () => {
        if (onApply) {
            onApply(min, localMax);
        }
    };

    return (
        <FilterWidget title={title} className={className}>
            <div className="mb-5">
                {/* Range Slider */}
                <input
                    type="range"
                    min={min}
                    max={max}
                    value={localMax}
                    onChange={(e) => setLocalMax(parseInt(e.target.value))}
                    className="w-full accent-brand"
                />

                {/* Price Labels */}
                <div className="flex justify-between text-sm mt-2">
                    <span>
                        From: <strong className="text-brand">{format(min)}</strong>
                    </span>
                    <span>
                        To: <strong className="text-brand">{format(localMax)}</strong>
                    </span>
                </div>
            </div>

            {/* Apply Button */}
            <button
                onClick={handleApply}
                className="inline-flex items-center gap-2 bg-brand hover:bg-brand-dark text-white px-5 py-2.5 rounded-md text-sm font-semibold transition-colors"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filter
            </button>
        </FilterWidget>
    );
}

/**
 * PriceRangeInputs - Alternative price filter with min/max inputs
 */
export function PriceRangeInputs({
    min = 0,
    max = 10000,
    currentMin = '',
    currentMax = '',
    onApply,
    title = 'Filter by price',
    className = '',
}) {
    const [localMin, setLocalMin] = useState(currentMin || '');
    const [localMax, setLocalMax] = useState(currentMax || '');

    const handleApply = () => {
        if (onApply) {
            onApply(
                localMin ? parseInt(localMin) : min,
                localMax ? parseInt(localMax) : max
            );
        }
    };

    return (
        <FilterWidget title={title} className={className}>
            <div className="flex items-center gap-3 mb-4">
                <input
                    type="number"
                    placeholder="Min"
                    value={localMin}
                    onChange={(e) => setLocalMin(e.target.value)}
                    className="w-full border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-brand"
                />
                <span className="text-muted">-</span>
                <input
                    type="number"
                    placeholder="Max"
                    value={localMax}
                    onChange={(e) => setLocalMax(e.target.value)}
                    className="w-full border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-brand"
                />
            </div>

            <button
                onClick={handleApply}
                className="w-full bg-brand hover:bg-brand-dark text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors"
            >
                Apply
            </button>
        </FilterWidget>
    );
}
