import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import FrontendLayout from '@/Layouts/FrontendLayout';

export default function Cart() {
    // Initial cart items state
    const [cartItems, setCartItems] = useState([
        {
            id: 1,
            name: 'Field Roast Chao Cheese Creamy Original',
            slug: 'field-roast-chao-cheese',
            price: 2.51,
            quantity: 1,
            rating: 4.0,
            image: '/images/frontend/shop/product-1-1.jpg',
        },
        {
            id: 2,
            name: 'Blue Diamond Almonds Lightly Salted',
            slug: 'blue-diamond-almonds',
            price: 3.20,
            quantity: 1,
            rating: 4.0,
            image: '/images/frontend/shop/product-2-1.jpg',
        },
        {
            id: 3,
            name: 'Fresh Organic Mustard Leaves Bell Pepper',
            slug: 'fresh-organic-mustard',
            price: 2.43,
            quantity: 1,
            rating: 4.0,
            image: '/images/frontend/shop/product-3-1.jpg',
        },
    ]);

    // Shipping form state
    const [shippingInfo, setShippingInfo] = useState({
        country: 'United Kingdom',
        state: '',
        zipCode: '',
    });

    // Coupon state
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);

    // Update quantity handler
    const updateQuantity = (itemId, newQuantity) => {
        if (newQuantity < 1) return;
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === itemId ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    // Remove item handler
    const removeItem = (itemId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
    };

    // Clear cart handler
    const clearCart = () => {
        setCartItems([]);
    };

    // Apply coupon handler
    const applyCoupon = (e) => {
        e.preventDefault();
        if (couponCode.trim()) {
            // In a real app, this would validate with the backend
            setAppliedCoupon(couponCode);
            alert(`Coupon "${couponCode}" applied!`);
        }
    };

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 0; // Free shipping
    const total = subtotal + shipping;

    return (
        <FrontendLayout>
            <Head title="Shopping Cart" />

            {/* Page Header / Breadcrumb */}
            <div className="bg-grey-9 py-5">
                <div className="max-w-container mx-auto px-4">
                    <div className="flex items-center gap-2 text-sm">
                        <Link href="/" className="text-brand hover:text-brand-dark flex items-center gap-1">
                            <i className="fi-rs-home"></i> Home
                        </Link>
                        <span className="text-muted">•</span>
                        <span className="text-heading">Shop</span>
                        <span className="text-muted">•</span>
                        <span className="text-body">Cart</span>
                    </div>
                </div>
            </div>

            {/* Cart Content */}
            <div className="max-w-container mx-auto px-4 py-12">
                {/* Cart Header */}
                <div className="mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl font-quicksand font-bold text-heading mb-2">Your Cart</h1>
                            <p className="text-body">
                                There are <span className="text-brand font-semibold">{cartItems.length}</span> products in your cart
                            </p>
                        </div>
                        <button
                            onClick={clearCart}
                            className="flex items-center gap-2 text-muted hover:text-red-500 transition-colors"
                        >
                            <i className="fi-rs-trash"></i> Clear Cart
                        </button>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Cart Table */}
                    <div className="flex-1">
                        <div className="bg-white border border-border rounded-xl overflow-hidden">
                            {/* Table Header (Desktop) */}
                            <div className="hidden md:grid grid-cols-12 gap-4 bg-grey-9 px-6 py-4 text-sm font-semibold text-heading">
                                <div className="col-span-1">
                                    <input type="checkbox" className="w-4 h-4 accent-brand rounded" />
                                </div>
                                <div className="col-span-5">Product</div>
                                <div className="col-span-2">Unit Price</div>
                                <div className="col-span-2">Quantity</div>
                                <div className="col-span-1">Subtotal</div>
                                <div className="col-span-1 text-center">Remove</div>
                            </div>

                            {/* Cart Items */}
                            {cartItems.length === 0 ? (
                                <div className="px-6 py-12 text-center">
                                    <p className="text-muted text-lg mb-4">Your cart is empty</p>
                                    <Link
                                        href="/shop"
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-brand hover:bg-brand-dark text-white rounded-md font-semibold transition-colors"
                                    >
                                        Continue Shopping
                                    </Link>
                                </div>
                            ) : (
                                cartItems.map((item, index) => (
                                    <div
                                        key={item.id}
                                        className={`grid grid-cols-1 md:grid-cols-12 gap-4 items-center px-6 py-6 ${
                                            index < cartItems.length - 1 ? 'border-b border-border' : ''
                                        }`}
                                    >
                                        <div className="hidden md:block col-span-1">
                                            <input type="checkbox" className="w-4 h-4 accent-brand rounded" />
                                        </div>
                                        <div className="col-span-1 md:col-span-5">
                                            <div className="flex items-center gap-4">
                                                <Link href={`/product/${item.slug}`} className="w-20 h-20 flex-shrink-0">
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="w-full h-full object-cover rounded-lg"
                                                    />
                                                </Link>
                                                <div>
                                                    <h6 className="font-quicksand font-semibold text-heading mb-2">
                                                        <Link href={`/product/${item.slug}`} className="hover:text-brand">
                                                            {item.name}
                                                        </Link>
                                                    </h6>
                                                    <div className="flex items-center gap-2">
                                                        <div className="product-rate">
                                                            <div
                                                                className="product-rating"
                                                                style={{ width: `${(item.rating / 5) * 100}%` }}
                                                            ></div>
                                                        </div>
                                                        <span className="text-xs text-muted">({item.rating.toFixed(1)})</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-span-1 md:col-span-2">
                                            <span className="md:hidden text-sm text-muted">Price: </span>
                                            <span className="text-body font-semibold">${item.price.toFixed(2)}</span>
                                        </div>
                                        <div className="col-span-1 md:col-span-2">
                                            <div className="flex items-center border border-border rounded-md w-fit">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="w-10 h-10 flex items-center justify-center text-heading hover:text-brand transition-colors"
                                                >
                                                    <i className="fi-rs-angle-small-down"></i>
                                                </button>
                                                <input
                                                    type="text"
                                                    value={item.quantity}
                                                    onChange={(e) => {
                                                        const val = parseInt(e.target.value) || 1;
                                                        updateQuantity(item.id, val);
                                                    }}
                                                    className="w-12 h-10 text-center border-x border-border outline-none text-heading font-semibold"
                                                />
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="w-10 h-10 flex items-center justify-center text-heading hover:text-brand transition-colors"
                                                >
                                                    <i className="fi-rs-angle-small-up"></i>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="col-span-1 md:col-span-1">
                                            <span className="md:hidden text-sm text-muted">Subtotal: </span>
                                            <span className="text-brand font-bold">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </span>
                                        </div>
                                        <div className="col-span-1 md:col-span-1 text-center">
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="text-muted hover:text-red-500 transition-colors"
                                            >
                                                <i className="fi-rs-trash"></i>
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
                                    href="/shop"
                                    className="inline-flex items-center gap-2 px-6 py-3 border-2 border-border-2 text-brand rounded-md hover:bg-brand hover:text-white hover:border-brand transition-colors font-semibold"
                                >
                                    <i className="fi-rs-arrow-left"></i> Continue Shopping
                                </Link>
                                <button className="inline-flex items-center gap-2 px-6 py-3 border-2 border-border-2 text-brand rounded-md hover:bg-brand hover:text-white hover:border-brand transition-colors font-semibold">
                                    <i className="fi-rs-refresh"></i> Update Cart
                                </button>
                            </div>
                        )}

                        {/* Shipping & Coupon Section */}
                        {cartItems.length > 0 && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
                                {/* Calculate Shipping */}
                                <div className="border border-border rounded-xl p-6 lg:p-8">
                                    <h4 className="font-quicksand font-bold text-heading text-lg mb-3">Calculate Shipping</h4>
                                    <p className="text-sm text-muted mb-6">Flat rate: <strong className="text-brand">5%</strong></p>
                                    <form className="space-y-4">
                                        <div>
                                            <select
                                                value={shippingInfo.country}
                                                onChange={(e) => setShippingInfo({ ...shippingInfo, country: e.target.value })}
                                                className="w-full border border-border rounded-md px-4 py-3 text-sm text-heading outline-none focus:border-brand"
                                            >
                                                <option>United Kingdom</option>
                                                <option>United States</option>
                                                <option>Canada</option>
                                                <option>Australia</option>
                                                <option>Germany</option>
                                                <option>France</option>
                                                <option>India</option>
                                                <option>Japan</option>
                                                <option>China</option>
                                                <option>Brazil</option>
                                            </select>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <input
                                                type="text"
                                                placeholder="State / Country"
                                                value={shippingInfo.state}
                                                onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                                                className="border border-border rounded-md px-4 py-3 text-sm outline-none focus:border-brand"
                                            />
                                            <input
                                                type="text"
                                                placeholder="PostCode / ZIP"
                                                value={shippingInfo.zipCode}
                                                onChange={(e) => setShippingInfo({ ...shippingInfo, zipCode: e.target.value })}
                                                className="border border-border rounded-md px-4 py-3 text-sm outline-none focus:border-brand"
                                            />
                                        </div>
                                    </form>
                                </div>

                                {/* Apply Coupon */}
                                <div className="p-6 lg:p-8">
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
                    <div className="w-full lg:w-[380px] flex-shrink-0">
                        <div className="bg-white border border-border rounded-xl p-6 lg:p-8 sticky top-24">
                            <h4 className="font-quicksand font-bold text-heading text-xl mb-6 pb-4 border-b border-border">Cart Totals</h4>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-muted">Subtotal</span>
                                    <span className="text-brand font-bold text-lg">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="border-t border-border"></div>
                                <div className="flex justify-between items-center">
                                    <span className="text-muted">Shipping</span>
                                    <span className="text-heading font-semibold">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-muted">Estimate for</span>
                                    <span className="text-heading font-semibold">{shippingInfo.country}</span>
                                </div>
                                <div className="border-t border-border"></div>
                                <div className="flex justify-between items-center">
                                    <span className="text-heading font-semibold">Total</span>
                                    <span className="text-brand font-bold text-2xl">${total.toFixed(2)}</span>
                                </div>
                            </div>

                            <Link
                                href="/checkout"
                                className="w-full flex items-center justify-center gap-2 bg-brand hover:bg-brand-dark text-white py-4 rounded-md font-quicksand font-bold transition-colors"
                            >
                                Proceed To CheckOut <i className="fi-rs-sign-out"></i>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </FrontendLayout>
    );
}
