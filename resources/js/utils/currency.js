/**
 * Currency formatting utilities for Avelabo
 * Supports MWK (Malawi Kwacha), ZAR (South African Rand), USD (US Dollar)
 */

/**
 * Format a currency amount using the provided currency settings
 * @param {number} amount - The amount to format
 * @param {object} currency - Currency object with code, symbol, symbol_before, decimal_places
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount, currency = null) {
    // Handle pre-formatted price objects from backend
    if (typeof amount === 'object' && amount?.formatted) {
        return amount.formatted;
    }

    // Default currency settings
    const defaultCurrency = {
        code: 'MWK',
        symbol: 'MK',
        symbol_before: true,
        decimal_places: 0,
    };

    // Merge with defaults to handle missing properties
    const curr = {
        ...defaultCurrency,
        ...currency,
    };

    const value = Number(amount) || 0;

    // Format the number with appropriate decimal places
    // MWK typically shows no decimals, ZAR and USD show 2
    const decimalPlaces = curr.code === 'MWK' ? 0 : (curr.decimal_places ?? 2);

    const formattedNumber = new Intl.NumberFormat('en', {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
    }).format(value);

    // Place symbol before or after based on currency setting (default to before)
    const symbolBefore = curr.symbol_before !== false;

    if (symbolBefore) {
        return `${curr.symbol}${formattedNumber}`;
    } else {
        return `${formattedNumber} ${curr.symbol}`;
    }
}

/**
 * Get the default currency from page props
 * @param {object} pageProps - Inertia page props
 * @returns {object} Default currency object
 */
export function getDefaultCurrency(pageProps) {
    return pageProps?.currencies?.default || {
        code: 'MWK',
        symbol: 'MK',
        symbol_before: true,
        decimal_places: 0,
    };
}

/**
 * Get active currencies from page props
 * @param {object} pageProps - Inertia page props
 * @returns {array} Array of active currency objects
 */
export function getActiveCurrencies(pageProps) {
    return pageProps?.currencies?.active || [];
}

/**
 * Create a currency formatter function bound to a specific currency
 * @param {object} currency - Currency object
 * @returns {function} Formatter function
 */
export function createCurrencyFormatter(currency) {
    return (amount) => formatCurrency(amount, currency);
}
