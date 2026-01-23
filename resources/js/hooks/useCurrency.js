import { usePage } from '@inertiajs/react';
import { formatCurrency, getDefaultCurrency, createCurrencyFormatter } from '@/utils/currency';

/**
 * useCurrency - Hook for currency formatting
 *
 * Replaces the common pattern:
 *   const { props } = usePage();
 *   const currency = getDefaultCurrency(props);
 *   const format = (amount) => formatCurrency(amount, currency);
 *
 * Usage:
 *   const { currency, format } = useCurrency();
 *   format(99.99) // Returns formatted currency string
 *
 * @returns {{ currency: object, format: function }}
 */
export function useCurrency() {
    const { props } = usePage();
    const currency = getDefaultCurrency(props);
    const format = createCurrencyFormatter(currency);

    return {
        currency,
        format,
    };
}

export default useCurrency;
