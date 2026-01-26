import { useState, useCallback, useRef, useEffect } from 'react';
import { router } from '@inertiajs/react';

/**
 * useSearch - Hook for instant search with debouncing
 *
 * Usage:
 *   const { query, setQuery, results, isLoading, isOpen, setIsOpen, handleSubmit } = useSearch();
 *
 * @param {number} debounceMs - Debounce delay in milliseconds (default: 300)
 * @returns {object} Search state and handlers
 */
export function useSearch(debounceMs = 300) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState({ products: [], categories: [], brands: [] });
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const abortControllerRef = useRef(null);
    const debounceTimerRef = useRef(null);

    const fetchResults = useCallback(async (searchQuery) => {
        // Abort previous request
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        if (searchQuery.length < 2) {
            setResults({ products: [], categories: [], brands: [] });
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        abortControllerRef.current = new AbortController();

        try {
            const response = await fetch(`/search/instant?q=${encodeURIComponent(searchQuery)}`, {
                signal: abortControllerRef.current.signal,
            });

            if (response.ok) {
                const data = await response.json();
                setResults(data);
                setIsOpen(true);
            }
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error('Search error:', error);
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    const debouncedFetch = useCallback((searchQuery) => {
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        debounceTimerRef.current = setTimeout(() => {
            fetchResults(searchQuery);
        }, debounceMs);
    }, [fetchResults, debounceMs]);

    const handleQueryChange = useCallback((newQuery) => {
        setQuery(newQuery);

        if (newQuery.length >= 2) {
            setIsLoading(true);
            debouncedFetch(newQuery);
        } else {
            setResults({ products: [], categories: [], brands: [] });
            setIsOpen(false);
        }
    }, [debouncedFetch]);

    const handleSubmit = useCallback((e) => {
        if (e) {
            e.preventDefault();
        }

        if (query.trim()) {
            setIsOpen(false);
            router.get('/shop', { search: query.trim() });
        }
    }, [query]);

    const clearSearch = useCallback(() => {
        setQuery('');
        setResults({ products: [], categories: [], brands: [] });
        setIsOpen(false);
    }, []);

    const hasResults = results.products.length > 0 ||
                       results.categories.length > 0 ||
                       results.brands.length > 0;

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, []);

    return {
        query,
        setQuery: handleQueryChange,
        results,
        isLoading,
        isOpen,
        setIsOpen,
        hasResults,
        handleSubmit,
        clearSearch,
    };
}

export default useSearch;
