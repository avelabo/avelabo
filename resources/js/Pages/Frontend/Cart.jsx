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

    // Coupon state
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);

    // Update quantity handler
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

    // Remove item handler
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

    // Clear cart handler
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

    // Apply coupon handler
    const applyCoupon = (e) => {
        e.preventDefault();
        if (couponCode.trim()) {
            // TODO: Implement coupon functionality
            setAppliedCoupon(couponCode);
            alert(`Coupon "${couponCode}" applied!`);
        }
    };

    const cartItems = cart?.items || [];
    const subtotal = cart?.subtotal || 0;
    const shipping = cart?.shipping || 0;
    const total = cart?.total || 0;

    const breadcrumbItems = [
        { label: 'Home', href: '/' },
        { label: 'Shop', href: route('shop') },
        { label: 'Basket' },
    ];

    return (
        <FrontendLayout>
            <Head title="Shopping Basket" />

            {/* Page Header / Breadcrumb */}
            <div className="bg-grey-9 py-5">
                <div className="container mx-auto px-4">
                    <Breadcrumb items={breadcrumbItems} separator="dash" />
                </div>
            </div>

            {/* Cart Content */}
            <div className="container mx-auto px-4 py-12">
                {/* Cart Header */}
                <div className="mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl font-quicksand font-bold text-heading mb-2">Your Basket</h1>
                            <p className="text-body">
                                There are <span className="text-brand font-semibold">{cart?.item_count || 0}</span> products in your basket
                            </p>
                        </div>
                        {cartItems.length > 0 && (
                            <button
                                onClick={clearCart}
                                disabled={loading}
                                className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors disabled:opacity-50 px-4 py-2 border border-gray-300 rounded-md hover:border-red-500"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Clear Basket
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Cart Table */}
                    <div className="flex-1">
                        <div className="bg-white border border-border rounded-xl overflow-hidden">
                            {/* Table Header (Desktop) */}
                            <div className="hidden md:grid grid-cols-12 gap-4 bg-grey-9 px-6 py-4 text-sm font-semibold text-heading">
                                <div className="col-span-6">Product</div>
                                <div className="col-span-2">Unit Price</div>
                                <div className="col-span-2">Quantity</div>
                                <div className="col-span-1">Subtotal</div>
                                <div className="col-span-1 text-center">Remove</div>
                            </div>

                            {/* Basket Items */}
                            {cartItems.length === 0 ? (
                                <div className="px-6 py-12">
                                    <EmptyState
                                        icon="cart"
                                        title="Your basket is empty"
                                        description="Add some products to your basket to get started."
                                        action={{
                                            label: 'Continue Shopping',
                                            href: route('shop'),
                                        }}
                                        size="sm"
                                    />
                                </div>
                            ) : (
                                cartItems.map((item, index) => (
                                    <div
                                        key={item.id}
                                        className={`grid grid-cols-1 md:grid-cols-12 gap-4 items-center px-6 py-6 ${
                                            index < cartItems.length - 1 ? 'border-b border-border' : ''
                                        } ${updatingItems[item.id] ? 'opacity-50' : ''}`}
                                    >
                                        <div className="col-span-1 md:col-span-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                                                    {item.image ? (
                                                        <img
                                                            src={`/storage/${item.image}`}
                                                            alt={item.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                            <i className="fi-rs-picture text-2xl"></i>
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <h6 className="font-quicksand font-semibold text-heading mb-1">
                                                        {item.name}
                                                    </h6>
                                                    {item.variant_name && (
                                                        <p className="text-xs text-muted mb-1">{item.variant_name}</p>
                                                    )}
                                                    {item.seller_name && (
                                                        <p className="text-xs text-muted">
                                                            Sold by: <span className="text-brand">{item.seller_name}</span>
                                                        </p>
                                                    )}
                                                    {!item.in_stock && (
                                                        <p className="text-xs text-red-500 mt-1">Out of stock</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-span-1 md:col-span-2">
                                            <span className="md:hidden text-sm text-muted">Price: </span>
                                            <span className="text-body font-semibold">{format(item.unit_price)}</span>
                                        </div>
                                        <div className="col-span-1 md:col-span-2">
                                            <div className="flex items-center border border-gray-300 rounded-md w-fit bg-white">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    disabled={updatingItems[item.id] || item.quantity <= 1}
                                                    className="w-10 h-10 flex items-center justify-center text-gray-700 hover:text-brand transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                                    </svg>
                                                </button>
                                                <span className="w-12 h-10 flex items-center justify-center border-x border-gray-300 text-gray-900 font-semibold">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    disabled={updatingItems[item.id]}
                                                    className="w-10 h-10 flex items-center justify-center text-gray-700 hover:text-brand transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="col-span-1 md:col-span-1">
                                            <span className="md:hidden text-sm text-muted">Subtotal: </span>
                                            <span className="text-brand font-bold">
                                                {format(item.line_total)}
                                            </span>
                                        </div>
                                        <div className="col-span-1 md:col-span-1 text-center">
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                disabled={updatingItems[item.id]}
                                                className="text-gray-600 hover:text-red-500 transition-colors disabled:opacity-50 p-2"
                                                title="Remove item"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Cart Actions */}
                        {cartItems.length > 0 && (
                            <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6 pt-6 border-t border-border">
                                <Link
                                    href={route('shop')}
                                    className="inline-flex items-center gap-2 px-6 py-3 border-2 border-border-2 text-brand rounded-md hover:bg-brand hover:text-white hover:border-brand transition-colors font-semibold"
                                >
                                    <i className="fi-rs-arrow-left"></i> Continue Shopping
                                </Link>
                            </div>
                        )}

                        {/* Coupon Section */}
                        {cartItems.length > 0 && (
                            <div className="mt-12">
                                <div className="bg-white border border-border rounded-xl p-6 lg:p-8">
                                    <h4 className="font-quicksand font-bold text-heading text-lg mb-3">Apply Coupon</h4>
                                    <p className="text-sm text-muted mb-6">Using A Promo Code?</p>
                                    <form onSubmit={applyCoupon} className="flex gap-3">
                                        <input
                                            type="text"
                                            placeholder="Enter Your Coupon"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value)}
                                            className="flex-1 border border-border rounded-md px-4 py-3 text-sm outline-none focus:border-brand"
                                        />
                                        <button
                                            type="submit"
                                            className="inline-flex items-center gap-2 px-6 py-3 bg-brand hover:bg-brand-dark text-white rounded-md font-semibold transition-colors"
                                        >
                                            <i className="fi-rs-label"></i> Apply
                                        </button>
                                    </form>
                                    {appliedCoupon && (
                                        <p className="mt-3 text-sm text-brand">
                                            Coupon "{appliedCoupon}" applied!
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Cart Totals Sidebar */}
                    {cartItems.length > 0 && (
                        <div className="w-full lg:w-[380px] flex-shrink-0">
                            <div className="bg-white border border-border rounded-xl p-6 lg:p-8 sticky top-24">
                                <h4 className="font-quicksand font-bold text-heading text-xl mb-6 pb-4 border-b border-border">Basket Totals</h4>

                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between items-center">
                                        <span className="text-muted">Subtotal</span>
                                        <span className="text-brand font-bold text-lg">{format(subtotal)}</span>
                                    </div>
                                    <div className="border-t border-border"></div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-muted">Shipping</span>
                                        <span className="text-heading font-semibold">{shipping === 0 ? 'Free' : format(shipping)}</span>
                                    </div>
                                    <div className="border-t border-border"></div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-heading font-semibold">Total</span>
                                        <span className="text-brand font-bold text-2xl">{format(total)}</span>
                                    </div>
                                </div>

                                <Link
                                    href={route('checkout')}
                                    className="w-full flex items-center justify-center gap-2 bg-brand hover:bg-brand-dark text-white py-4 rounded-md font-quicksand font-bold transition-colors"
                                >
                                    Proceed To CheckOut <i className="fi-rs-sign-out"></i>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </FrontendLayout>
    );
}
