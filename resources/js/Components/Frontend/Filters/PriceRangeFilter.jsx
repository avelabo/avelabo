import { useState, useEffect } from 'react';
import { useCurrency } from '@/hooks/useCurrency';

/**
 * PriceRangeFilter - Clean price range filter with dual slider
 */
export default function PriceRangeFilter({
    min = 0,
    max = 10000,
    currentMin = null,
    currentMax = null,
    onApply,
    className = '',
}) {
    const { format } = useCurrency();
    const [localMin, setLocalMin] = useState(currentMin || min);
    const [localMax, setLocalMax] = useState(currentMax || max);

    // Update local state when props change
    useEffect(() => {
        setLocalMin(currentMin || min);
        setLocalMax(currentMax || max);
    }, [currentMin, currentMax, min, max]);

    const handleApply = () => {
        if (onApply) {
            onApply(localMin, localMax);
        }
    };

    // Calculate percentage for visual indicator
    const minPercent = ((localMin - min) / (max - min)) * 100;
    const maxPercent = ((localMax - min) / (max - min)) * 100;

    return (
        <div className={className}>
            {/* Price Display */}
            <div className="flex items-center justify-between mb-6">
                <div className="text-center">
                    <span className="text-xs text-muted block mb-1">From</span>
                    <span className="text-sm font-semibold text-heading">{format(localMin)}</span>
                </div>
                <div className="flex-1 mx-4 h-px bg-border-light" />
                <div className="text-center">
                    <span className="text-xs text-muted block mb-1">To</span>
                    <span className="text-sm font-semibold text-heading">{format(localMax)}</span>
                </div>
            </div>

            {/* Dual Range Slider */}
            <div className="relative h-2 mb-6">
                {/* Track Background */}
                <div className="absolute inset-0 bg-surface-sunken rounded-full" />

                {/* Active Track */}
                <div
                    className="absolute h-full bg-heading rounded-full"
                    style={{
                        left: `${minPercent}%`,
                        width: `${maxPercent - minPercent}%`,
                    }}
                />

                {/* Min Slider */}
                <input
                    type="range"
                    min={min}
                    max={max}
                    value={localMin}
                    onChange={(e) => {
                        const value = Math.min(Number(e.target.value), localMax - 1);
                        setLocalMin(value);
                    }}
                    className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none
                        [&::-webkit-slider-thumb]:pointer-events-auto
                        [&::-webkit-slider-thumb]:appearance-none
                        [&::-webkit-slider-thumb]:w-5
                        [&::-webkit-slider-thumb]:h-5
                        [&::-webkit-slider-thumb]:rounded-full
                        [&::-webkit-slider-thumb]:bg-white
                        [&::-webkit-slider-thumb]:border-2
                        [&::-webkit-slider-thumb]:border-heading
                        [&::-webkit-slider-thumb]:cursor-pointer
                        [&::-webkit-slider-thumb]:shadow-md
                        [&::-webkit-slider-thumb]:transition-transform
                        [&::-webkit-slider-thumb]:hover:scale-110
                        [&::-moz-range-thumb]:pointer-events-auto
                        [&::-moz-range-thumb]:appearance-none
                        [&::-moz-range-thumb]:w-5
                        [&::-moz-range-thumb]:h-5
                        [&::-moz-range-thumb]:rounded-full
                        [&::-moz-range-thumb]:bg-white
                        [&::-moz-range-thumb]:border-2
                        [&::-moz-range-thumb]:border-heading
                        [&::-moz-range-thumb]:cursor-pointer
                    "
                />

                {/* Max Slider */}
                <input
                    type="range"
                    min={min}
                    max={max}
                    value={localMax}
                    onChange={(e) => {
                        const value = Math.max(Number(e.target.value), localMin + 1);
                        setLocalMax(value);
                    }}
                    className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none
                        [&::-webkit-slider-thumb]:pointer-events-auto
                        [&::-webkit-slider-thumb]:appearance-none
                        [&::-webkit-slider-thumb]:w-5
                        [&::-webkit-slider-thumb]:h-5
                        [&::-webkit-slider-thumb]:rounded-full
                        [&::-webkit-slider-thumb]:bg-white
                        [&::-webkit-slider-thumb]:border-2
                        [&::-webkit-slider-thumb]:border-heading
                        [&::-webkit-slider-thumb]:cursor-pointer
                        [&::-webkit-slider-thumb]:shadow-md
                        [&::-webkit-slider-thumb]:transition-transform
                        [&::-webkit-slider-thumb]:hover:scale-110
                        [&::-moz-range-thumb]:pointer-events-auto
                        [&::-moz-range-thumb]:appearance-none
                        [&::-moz-range-thumb]:w-5
                        [&::-moz-range-thumb]:h-5
                        [&::-moz-range-thumb]:rounded-full
                        [&::-moz-range-thumb]:bg-white
                        [&::-moz-range-thumb]:border-2
                        [&::-moz-range-thumb]:border-heading
                        [&::-moz-range-thumb]:cursor-pointer
                    "
                />
            </div>

            {/* Apply Button */}
            <button
                onClick={handleApply}
                className="
                    w-full py-2.5 px-4 rounded-lg
                    text-sm font-medium
                    bg-heading text-white
                    hover:bg-brand-dark
                    transition-colors duration-200
                    flex items-center justify-center gap-2
                "
            >
                Apply Filter
            </button>
        </div>
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
        <div className={className}>
            <div className="flex items-center gap-3 mb-4">
                <div className="flex-1">
                    <label className="text-xs text-muted mb-1.5 block">Min</label>
                    <input
                        type="number"
                        placeholder="0"
                        value={localMin}
                        onChange={(e) => setLocalMin(e.target.value)}
                        className="
                            w-full py-2.5 px-3 rounded-lg
                            text-sm text-heading
                            bg-surface-sunken border-0
                            focus:outline-none focus:ring-2 focus:ring-heading/10
                            transition-all duration-200
                        "
                    />
                </div>
                <span className="text-muted mt-5">—</span>
                <div className="flex-1">
                    <label className="text-xs text-muted mb-1.5 block">Max</label>
                    <input
                        type="number"
                        placeholder="10000"
                        value={localMax}
                        onChange={(e) => setLocalMax(e.target.value)}
                        className="
                            w-full py-2.5 px-3 rounded-lg
                            text-sm text-heading
                            bg-surface-sunken border-0
                            focus:outline-none focus:ring-2 focus:ring-heading/10
                            transition-all duration-200
                        "
                    />
                </div>
            </div>

            <button
                onClick={handleApply}
                className="
                    w-full py-2.5 px-4 rounded-lg
                    text-sm font-medium
                    bg-heading text-white
                    hover:bg-brand-dark
                    transition-colors duration-200
                "
            >
                Apply
            </button>
        </div>
    );
}
