import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import FrontendLayout from '@/Layouts/FrontendLayout';
import { useToast } from '@/Contexts/ToastContext';
import { useCurrency } from '@/hooks/useCurrency';
import Breadcrumb from '@/Components/Frontend/Breadcrumb';
import EmptyState from '@/Components/Frontend/EmptyState';

export default function Cart({ cart }) {
    const { format } = useCurrency();
    const toast = useToast();

    const [loading, setLoading] = useState(false);
    const [updatingItems, setUpdatingItems] = useState({});
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);

    const updateQuantity = (itemId, newQuantity) => {
        if (newQuantity < 0 || updatingItems[itemId]) return;

        setUpdatingItems(prev => ({ ...prev, [itemId]: true }));

        router.patch(route('cart.update', itemId), {
            quantity: newQuantity,
        }, {
            preserveScroll: true,
            onFinish: () => {
                setUpdatingItems(prev => ({ ...prev, [itemId]: false }));
            },
            onError: (errors) => {
                const errorMessage = errors?.error || errors?.quantity || 'Failed to update quantity';
                toast.error(errorMessage);
            },
        });
    };

    const removeItem = (itemId) => {
        if (updatingItems[itemId]) return;

        setUpdatingItems(prev => ({ ...prev, [itemId]: true }));

        router.delete(route('cart.remove', itemId), {
            preserveScroll: true,
            onFinish: () => {
                setUpdatingItems(prev => ({ ...prev, [itemId]: false }));
            },
            onSuccess: () => {
                toast.success('Item removed from cart');
            },
            onError: () => {
                toast.error('Failed to remove item from cart');
            },
        });
    };

    const clearCart = () => {
        if (loading) return;

        if (!confirm('Are you sure you want to clear your basket?')) return;

        setLoading(true);
        router.delete(route('cart.clear'), {
            preserveScroll: true,
            onFinish: () => setLoading(false),
            onSuccess: () => {
                toast.success('Cart cleared successfully');
            },
            onError: () => {
                toast.error('Failed to clear cart');
            },
        });
    };

    const applyCoupon = (e) => {
        e.preventDefault();
        if (couponCode.trim()) {
            setAppliedCoupon(couponCode);
            toast.success(`Coupon "${couponCode}" applied!`);
        }
    };

    const cartItems = cart?.items || [];
    const subtotal = cart?.subtotal || 0;
    const shipping = cart?.shipping || 0;
    const total = cart?.total || 0;
    const itemCount = cart?.item_count || 0;

    // Calculate free shipping progress (example: free shipping over 50000 MWK)
    const freeShippingThreshold = 50000;
    const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
    const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

    const breadcrumbItems = [
        { label: 'Home', href: '/' },
        { label: 'Shop', href: route('shop') },
        { label: 'Basket' },
    ];

    return (
        <FrontendLayout>
            <Head title="Shopping Basket" />

            {/* Breadcrumb */}
            <div className="border-b border-border-light">
                <div className="container mx-auto px-4 py-4">
                    <Breadcrumb items={breadcrumbItems} separator="chevron" />
                </div>
            </div>

            {/* Cart Content */}
            <section className="py-8 lg:py-12">
                <div className="container mx-auto px-4">
                    {/* Page Header */}
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-bold text-heading mb-2">
                                My Basket
                                {itemCount > 0 && (
                                    <span className="text-muted font-normal text-lg ml-2">
                                        ({itemCount} {itemCount === 1 ? 'item' : 'items'})
                                    </span>
                                )}
                            </h1>
                        </div>
                        {cartItems.length > 0 && (
                            <button
                                onClick={clearCart}
                                disabled={loading}
                                className="flex items-center gap-2 text-sm text-muted hover:text-danger transition-colors disabled:opacity-50"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Clear Basket
                            </button>
                        )}
                    </div>

                    {/* Free Shipping Progress */}
                    {cartItems.length > 0 && (
                        <div className="bg-surface-raised rounded-xl p-4 mb-8">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-body">
                                    {amountToFreeShipping > 0 ? (
                                        <>
                                            You're <span className="font-semibold text-heading">{format(amountToFreeShipping)}</span> away from Free Shipping!
                                        </>
                                    ) : (
                                        <span className="text-success font-medium">You've unlocked Free Shipping!</span>
                                    )}
                                </span>
                                {amountToFreeShipping > 0 && (
                                    <Link href={route('shop')} className="text-sm font-medium text-brand hover:text-brand-dark">
                                        + Add Items
                                    </Link>
                                )}
                            </div>
                            <div className="h-2 bg-border-light rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-500 ${
                                        freeShippingProgress >= 100 ? 'bg-success' : 'bg-brand'
                                    }`}
                                    style={{ width: `${freeShippingProgress}%` }}
                                />
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Cart Items */}
                        <div className="flex-1">
                            {cartItems.length === 0 ? (
                                <EmptyState
                                    icon="cart"
                                    title="Your basket is empty"
                                    description="Looks like you haven't added anything to your basket yet."
                                    action={{
                                        label: 'Start Shopping',
                                        href: route('shop'),
                                    }}
                                />
                            ) : (
                                <div className="space-y-4">
                                    {cartItems.map((item) => (
                                        <div
                                            key={item.id}
                                            className={`bg-surface rounded-xl border border-border-light p-4 lg:p-6 transition-opacity ${
                                                updatingItems[item.id] ? 'opacity-60' : ''
                                            }`}
                                        >
                                            <div className="flex gap-4 lg:gap-6">
                                                {/* Product Image */}
                                                <div className="w-24 h-24 lg:w-28 lg:h-28 flex-shrink-0 bg-surface-raised rounded-lg overflow-hidden">
                                                    {item.image ? (
                                                        <img
                                                            src={`/storage/${item.image}`}
                                                            alt={item.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <svg className="w-8 h-8 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Product Details */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="font-semibold text-heading text-base lg:text-lg mb-1 truncate">
                                                                {item.name}
                                                            </h3>
                                                            {item.variant_name && (
                                                                <p className="text-sm text-muted mb-1">
                                                                    {item.variant_name}
                                                                </p>
                                                            )}
                                                            {item.seller_name && (
                                                                <p className="text-sm text-muted">
                                                                    Sold by: <span className="text-brand">{item.seller_name}</span>
                                                                </p>
                                                            )}
                                                            {!item.in_stock && (
                                                                <p className="text-sm text-danger mt-1 font-medium">Out of stock</p>
                                                            )}
                                                        </div>

                                                        {/* Price - Desktop */}
                                                        <div className="hidden lg:block text-right">
                                                            <p className="text-lg font-bold text-heading">
                                                                {format(item.line_total)}
                                                            </p>
                                                            <p className="text-sm text-muted">
                                                                {format(item.unit_price)} each
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Quantity & Actions */}
                                                    <div className="flex items-center justify-between mt-4">
                                                        <div className="flex items-center gap-4">
                                                            {/* Quantity Selector */}
                                                            <div className="flex items-center border border-border rounded-lg overflow-hidden">
                                                                <button
                                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                                    disabled={updatingItems[item.id] || item.quantity <= 1}
                                                                    className="w-9 h-9 flex items-center justify-center text-heading hover:bg-surface-raised transition-colors disabled:opacity-40"
                                                                >
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                                                    </svg>
                                                                </button>
                                                                <span className="w-10 h-9 flex items-center justify-center text-heading font-semibold text-sm border-x border-border">
                                                                    {item.quantity}
                                                                </span>
                                                                <button
                                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                                    disabled={updatingItems[item.id]}
                                                                    className="w-9 h-9 flex items-center justify-center text-heading hover:bg-surface-raised transition-colors disabled:opacity-40"
                                                                >
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                                    </svg>
                                                                </button>
                                                            </div>

                                                            {/* Remove Button */}
                                                            <button
                                                                onClick={() => removeItem(item.id)}
                                                                disabled={updatingItems[item.id]}
                                                                className="text-muted hover:text-danger transition-colors disabled:opacity-50 p-2"
                                                                title="Remove item"
                                                            >
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                            </button>

                                                            {/* Save for Later */}
                                                            <button className="text-sm text-muted hover:text-brand transition-colors underline hidden sm:block">
                                                                Save for Later
                                                            </button>
                                                        </div>

                                                        {/* Price - Mobile */}
                                                        <div className="lg:hidden text-right">
                                                            <p className="font-bold text-heading">
                                                                {format(item.line_total)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Continue Shopping */}
                            {cartItems.length > 0 && (
                                <div className="mt-6">
                                    <Link
                                        href={route('shop')}
                                        className="inline-flex items-center gap-2 text-sm font-medium text-brand hover:text-brand-dark transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                        Continue Shopping
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Order Summary Sidebar */}
                        {cartItems.length > 0 && (
                            <div className="lg:w-[380px] flex-shrink-0">
                                <div className="bg-surface rounded-xl border border-border-light p-6 lg:sticky lg:top-24">
                                    <h2 className="text-lg font-bold text-heading mb-6">Order Summary</h2>

                                    {/* Coupon Code */}
                                    <form onSubmit={applyCoupon} className="mb-6">
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Enter discount code"
                                                value={couponCode}
                                                onChange={(e) => setCouponCode(e.target.value)}
                                                className="flex-1 px-4 py-3 border border-border rounded-lg text-sm outline-none focus:border-brand transition-colors"
                                            />
                                            <button
                                                type="submit"
                                                className="px-5 py-3 bg-brand-dark text-white text-sm font-semibold rounded-lg hover:bg-brand transition-colors"
                                            >
                                                Apply
                                            </button>
                                        </div>
                                        {appliedCoupon && (
                                            <p className="mt-2 text-sm text-success flex items-center gap-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                Coupon "{appliedCoupon}" applied
                                            </p>
                                        )}
                                    </form>

                                    {/* Summary Details */}
                                    <div className="space-y-4 pb-6 border-b border-border-light">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-body">Subtotal</span>
                                            <span className="font-semibold text-heading">{format(subtotal)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-body">Shipping</span>
                                            <span className="font-semibold text-heading">
                                                {shipping === 0 ? (
                                                    <span className="text-success">Free</span>
                                                ) : (
                                                    format(shipping)
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-body">Estimated Taxes</span>
                                            <span className="text-muted">Calculated at Checkout</span>
                                        </div>
                                    </div>

                                    {/* Total */}
                                    <div className="flex justify-between items-center py-6">
                                        <span className="text-heading font-semibold">Total</span>
                                        <span className="text-2xl font-bold text-heading">{format(total)}</span>
                                    </div>

                                    {/* Checkout Button */}
                                    <Link
                                        href={route('checkout')}
                                        className="w-full flex items-center justify-center gap-2 bg-brand hover:bg-brand-dark text-white py-4 rounded-lg font-semibold transition-all shadow-button hover:shadow-button-hover"
                                    >
                                        Proceed to Checkout
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>

                                    {/* Trust Badges */}
                                    <div className="mt-6 pt-6 border-t border-border-light">
                                        <div className="flex items-center justify-center gap-4 text-muted">
                                            <div className="flex items-center gap-1 text-xs">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                </svg>
                                                Secure
                                            </div>
                                            <div className="flex items-center gap-1 text-xs">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                                </svg>
                                                Protected
                                            </div>
                                            <div className="flex items-center gap-1 text-xs">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                </svg>
                                                Easy Returns
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </FrontendLayout>
    );
}
