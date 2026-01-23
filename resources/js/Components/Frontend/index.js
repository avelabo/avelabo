/**
 * Frontend Components Index
 * Export all reusable frontend components for easy importing
 *
 * Usage:
 *   import { ProductCard, StarRating, PriceDisplay } from '@/Components/Frontend';
 */

// Core display components
export { default as ProductCard } from './ProductCard';
export { default as StarRating } from './StarRating';
export { default as Badge, getProductBadgeVariant } from './Badge';
export { default as PriceDisplay, InlinePrice } from './PriceDisplay';

// Navigation components
export { default as Breadcrumb, PageHeader } from './Breadcrumb';
export { default as Pagination, SimplePagination, PaginationInfo } from './Pagination';

// Layout components
export { default as EmptyState } from './EmptyState';
export { default as ProductGrid, ProductCardSkeleton, ProductSection } from './ProductGrid';
export { default as ProductListItem, ProductListItemSkeleton } from './ProductListItem';

// Layout/Page components
export { default as Header } from './Header';
export { default as Footer } from './Footer';
export { default as MobileMenu } from './MobileMenu';
export { default as HeroSlider } from './HeroSlider';
export { default as CategorySlider } from './CategorySlider';
export { default as Toast } from './Toast';
export { default as FormAlert } from './FormAlert';

// Filter components (also available from './Filters')
export * from './Filters';
