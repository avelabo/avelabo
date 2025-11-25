import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import FrontendLayout from '@/Layouts/FrontendLayout';

export default function Checkout({ cartItems = [], countries = [] }) {
    // State for collapsible sections
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [showPasswordField, setShowPasswordField] = useState(false);
    const [showShippingAddress, setShowShippingAddress] = useState(false);

    // Sample cart items (in real app, this comes from backend)
    const sampleCartItems = [
        { id: 1, name: 'Yidarton Women Summer Blue', slug: 'yidarton-summer-blue', image: '/images/frontend/shop/product-1-1.jpg', price: 13.30, quantity: 1, rating: 4.0 },
        { id: 2, name: 'Seeds of Change Organic Quinoa', slug: 'organic-quinoa', image: '/images/frontend/shop/product-2-1.jpg', price: 15.00, quantity: 1, rating: 4.0 },
        { id: 3, name: "Angie's Boomchickapop Sweet", slug: 'boomchickapop', image: '/images/frontend/shop/product-3-1.jpg', price: 17.20, quantity: 1, rating: 4.0 },
    ];

    const items = cartItems.length > 0 ? cartItems : sampleCartItems;
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    // Sample countries (in real app, this comes from backend)
    const sampleCountries = [
        { code: 'US', name: 'USA (US)' },
        { code: 'GB', name: 'United Kingdom (UK)' },
        { code: 'CA', name: 'Canada' },
        { code: 'AU', name: 'Australia' },
        { code: 'DE', name: 'Germany' },
        { code: 'FR', name: 'France' },
        { code: 'IN', name: 'India' },
        { code: 'JP', name: 'Japan' },
        { code: 'CN', name: 'China' },
        { code: 'BR', name: 'Brazil' },
    ];

    const countryList = countries.length > 0 ? countries : sampleCountries;

    // Login form
    const loginForm = useForm({
        email: '',
        password: '',
        remember: false,
    });

    // Coupon form
    const couponForm = useForm({
        coupon_code: '',
    });

    // Checkout form
    const { data, setData, post, processing, errors } = useForm({
        first_name: '',
        last_name: '',
        billing_address: '',
        billing_address2: '',
        country: '',
        city: '',
        zipcode: '',
        phone: '',
        company_name: '',
        email: '',
        additional_info: '',
        create_account: false,
        account_password: '',
        ship_different_address: false,
        shipping_first_name: '',
        shipping_last_name: '',
        shipping_company: '',
        shipping_country: '',
        shipping_address: '',
        shipping_address2: '',
        shipping_state: '',
        shipping_city: '',
        shipping_zipcode: '',
        payment_method: 'bank',
    });

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        loginForm.post('/login');
    };

    const handleCouponSubmit = (e) => {
        e.preventDefault();
        couponForm.post('/cart/coupon');
    };

    const handleCheckoutSubmit = (e) => {
        e.preventDefault();
        post('/checkout/place-order');
    };

    const handleCreateAccountChange = (e) => {
        setData('create_account', e.target.checked);
        setShowPasswordField(e.target.checked);
    };

    const handleShipDifferentAddressChange = (e) => {
        setData('ship_different_address', e.target.checked);
        setShowShippingAddress(e.target.checked);
    };

    return (
        <FrontendLayout>
            <Head title="Checkout" />

            {/* Breadcrumb */}
            <div className="bg-white py-4 border-b border-gray-100">
                <div className="max-w-[1610px] mx-auto px-4">
                    <div className="flex items-center gap-2 text-sm">
                        <Link href="/" className="text-body hover:text-brand transition-colors">
                            <i className="fi fi-rs-home"></i>
                        </Link>
                        <span className="text-body">/</span>
                        <Link href="/shop" className="text-body hover:text-brand transition-colors">Shop</Link>
                        <span className="text-body">/</span>
                        <span className="text-brand">Checkout</span>
                    </div>
                </div>
            </div>

            {/* Checkout Section */}
            <section className="py-12 lg:py-20">
                <div className="max-w-[1610px] mx-auto px-4">
                    {/* Page Header */}
                    <div className="mb-10">
                        <h1 className="text-3xl lg:text-4xl font-bold text-heading font-quicksand mb-2">Checkout</h1>
                        <p className="text-body">There are <span className="text-brand font-semibold">{itemCount}</span> products in your cart</p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Left Column - Forms */}
                        <div className="lg:w-7/12">
                            {/* Login & Coupon Row */}
                            <div className="grid md:grid-cols-2 gap-6 mb-12">
                                {/* Login Toggle */}
                                <div>
                                    <div className="flex items-center gap-2 text-body">
                                        <i className="fi fi-rs-user"></i>
                                        <span>Already have an account?</span>
                                        <button
                                            onClick={() => setShowLoginForm(!showLoginForm)}
                                            className="text-brand hover:text-brand-dark font-semibold"
                                        >
                                            Click here to login
                                        </button>
                                    </div>

                                    {/* Collapsible Login Form */}
                                    <div className={`overflow-hidden transition-all duration-300 ${showLoginForm ? 'max-h-[500px] mt-4' : 'max-h-0'}`}>
                                        <div className="bg-white p-6 rounded-lg border border-gray-200">
                                            <p className="text-sm text-body mb-6">If you have shopped with us before, please enter your details below. If you are a new customer, please proceed to the Billing & Shipping section.</p>
                                            <form onSubmit={handleLoginSubmit}>
                                                <div className="mb-4">
                                                    <input
                                                        type="text"
                                                        value={loginForm.data.email}
                                                        onChange={(e) => loginForm.setData('email', e.target.value)}
                                                        placeholder="Username Or Email"
                                                        className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm focus:border-brand focus:outline-none"
                                                    />
                                                </div>
                                                <div className="mb-4">
                                                    <input
                                                        type="password"
                                                        value={loginForm.data.password}
                                                        onChange={(e) => loginForm.setData('password', e.target.value)}
                                                        placeholder="Password"
                                                        className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm focus:border-brand focus:outline-none"
                                                    />
                                                </div>
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="custom-checkbox">
                                                        <input
                                                            type="checkbox"
                                                            id="remember"
                                                            checked={loginForm.data.remember}
                                                            onChange={(e) => loginForm.setData('remember', e.target.checked)}
                                                        />
                                                        <label htmlFor="remember" className="text-sm text-body">Remember me</label>
                                                    </div>
                                                    <Link href="/forgot-password" className="text-sm text-brand hover:text-brand-dark">Forgot password?</Link>
                                                </div>
                                                <button
                                                    type="submit"
                                                    disabled={loginForm.processing}
                                                    className="bg-brand hover:bg-brand-dark text-white px-6 py-3 rounded-md font-semibold transition-colors"
                                                >
                                                    Log in
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                </div>

                                {/* Coupon Form */}
                                <div>
                                    <form onSubmit={handleCouponSubmit} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={couponForm.data.coupon_code}
                                            onChange={(e) => couponForm.setData('coupon_code', e.target.value)}
                                            placeholder="Enter Coupon Code..."
                                            className="flex-1 border border-gray-200 rounded-md px-4 py-3 text-sm focus:border-brand focus:outline-none"
                                        />
                                        <button
                                            type="submit"
                                            disabled={couponForm.processing}
                                            className="bg-brand hover:bg-brand-dark text-white px-6 py-3 rounded-md font-semibold transition-colors whitespace-nowrap"
                                        >
                                            Apply Coupon
                                        </button>
                                    </form>
                                </div>
                            </div>

                            {/* Billing Details Form */}
                            <div className="bg-white p-6 lg:p-8 rounded-lg border border-gray-200">
                                <h4 className="text-xl font-bold text-heading font-quicksand mb-6">Billing Details</h4>
                                <form onSubmit={handleCheckoutSubmit}>
                                    {/* Name Row */}
                                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                                        <input
                                            type="text"
                                            value={data.first_name}
                                            onChange={(e) => setData('first_name', e.target.value)}
                                            placeholder="First name *"
                                            required
                                            className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm focus:border-brand focus:outline-none"
                                        />
                                        <input
                                            type="text"
                                            value={data.last_name}
                                            onChange={(e) => setData('last_name', e.target.value)}
                                            placeholder="Last name *"
                                            required
                                            className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm focus:border-brand focus:outline-none"
                                        />
                                    </div>

                                    {/* Address Row */}
                                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                                        <input
                                            type="text"
                                            value={data.billing_address}
                                            onChange={(e) => setData('billing_address', e.target.value)}
                                            placeholder="Address *"
                                            required
                                            className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm focus:border-brand focus:outline-none"
                                        />
                                        <input
                                            type="text"
                                            value={data.billing_address2}
                                            onChange={(e) => setData('billing_address2', e.target.value)}
                                            placeholder="Address line 2"
                                            className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm focus:border-brand focus:outline-none"
                                        />
                                    </div>

                                    {/* Country & City Row */}
                                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                                        <select
                                            value={data.country}
                                            onChange={(e) => setData('country', e.target.value)}
                                            className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm focus:border-brand focus:outline-none bg-white"
                                        >
                                            <option value="">Select Country...</option>
                                            {countryList.map((country) => (
                                                <option key={country.code} value={country.code}>{country.name}</option>
                                            ))}
                                        </select>
                                        <input
                                            type="text"
                                            value={data.city}
                                            onChange={(e) => setData('city', e.target.value)}
                                            placeholder="City / Town *"
                                            required
                                            className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm focus:border-brand focus:outline-none"
                                        />
                                    </div>

                                    {/* Zip & Phone Row */}
                                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                                        <input
                                            type="text"
                                            value={data.zipcode}
                                            onChange={(e) => setData('zipcode', e.target.value)}
                                            placeholder="Postcode / ZIP *"
                                            required
                                            className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm focus:border-brand focus:outline-none"
                                        />
                                        <input
                                            type="tel"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            placeholder="Phone *"
                                            required
                                            className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm focus:border-brand focus:outline-none"
                                        />
                                    </div>

                                    {/* Company & Email Row */}
                                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                                        <input
                                            type="text"
                                            value={data.company_name}
                                            onChange={(e) => setData('company_name', e.target.value)}
                                            placeholder="Company Name"
                                            className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm focus:border-brand focus:outline-none"
                                        />
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="Email address *"
                                            required
                                            className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm focus:border-brand focus:outline-none"
                                        />
                                    </div>

                                    {/* Additional Information */}
                                    <div className="mb-6">
                                        <textarea
                                            value={data.additional_info}
                                            onChange={(e) => setData('additional_info', e.target.value)}
                                            rows="4"
                                            placeholder="Additional information"
                                            className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm focus:border-brand focus:outline-none resize-none"
                                        ></textarea>
                                    </div>

                                    {/* Create Account Checkbox */}
                                    <div className="mb-4">
                                        <div className="custom-checkbox">
                                            <input
                                                type="checkbox"
                                                id="createaccount"
                                                checked={data.create_account}
                                                onChange={handleCreateAccountChange}
                                            />
                                            <label htmlFor="createaccount" className="text-sm text-heading font-semibold">Create an account?</label>
                                        </div>
                                    </div>

                                    {/* Password Field (Collapsible) */}
                                    <div className={`overflow-hidden transition-all duration-300 mb-6 ${showPasswordField ? 'max-h-[100px]' : 'max-h-0'}`}>
                                        <div className="grid md:grid-cols-2 gap-4 mt-4">
                                            <input
                                                type="password"
                                                value={data.account_password}
                                                onChange={(e) => setData('account_password', e.target.value)}
                                                placeholder="Password"
                                                className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm focus:border-brand focus:outline-none"
                                            />
                                        </div>
                                    </div>

                                    {/* Ship to Different Address */}
                                    <div className="border-t border-gray-200 pt-6">
                                        <div className="mb-4">
                                            <div className="custom-checkbox">
                                                <input
                                                    type="checkbox"
                                                    id="differentaddress"
                                                    checked={data.ship_different_address}
                                                    onChange={handleShipDifferentAddressChange}
                                                />
                                                <label htmlFor="differentaddress" className="text-sm text-heading font-semibold">Ship to a different address?</label>
                                            </div>
                                        </div>

                                        {/* Shipping Address Form (Collapsible) */}
                                        <div className={`overflow-hidden transition-all duration-300 ${showShippingAddress ? 'max-h-[500px]' : 'max-h-0'}`}>
                                            <div className="mt-4 space-y-4">
                                                {/* Name Row */}
                                                <div className="grid md:grid-cols-2 gap-4">
                                                    <input
                                                        type="text"
                                                        value={data.shipping_first_name}
                                                        onChange={(e) => setData('shipping_first_name', e.target.value)}
                                                        placeholder="First name *"
                                                        className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm focus:border-brand focus:outline-none"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={data.shipping_last_name}
                                                        onChange={(e) => setData('shipping_last_name', e.target.value)}
                                                        placeholder="Last name *"
                                                        className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm focus:border-brand focus:outline-none"
                                                    />
                                                </div>

                                                {/* Company & Country Row */}
                                                <div className="grid md:grid-cols-2 gap-4">
                                                    <input
                                                        type="text"
                                                        value={data.shipping_company}
                                                        onChange={(e) => setData('shipping_company', e.target.value)}
                                                        placeholder="Company Name"
                                                        className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm focus:border-brand focus:outline-none"
                                                    />
                                                    <select
                                                        value={data.shipping_country}
                                                        onChange={(e) => setData('shipping_country', e.target.value)}
                                                        className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm focus:border-brand focus:outline-none bg-white"
                                                    >
                                                        <option value="">Select Country...</option>
                                                        {countryList.map((country) => (
                                                            <option key={country.code} value={country.code}>{country.name}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                {/* Address Row */}
                                                <div className="grid md:grid-cols-2 gap-4">
                                                    <input
                                                        type="text"
                                                        value={data.shipping_address}
                                                        onChange={(e) => setData('shipping_address', e.target.value)}
                                                        placeholder="Address *"
                                                        className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm focus:border-brand focus:outline-none"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={data.shipping_address2}
                                                        onChange={(e) => setData('shipping_address2', e.target.value)}
                                                        placeholder="Address line 2"
                                                        className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm focus:border-brand focus:outline-none"
                                                    />
                                                </div>

                                                {/* State & City Row */}
                                                <div className="grid md:grid-cols-2 gap-4">
                                                    <input
                                                        type="text"
                                                        value={data.shipping_state}
                                                        onChange={(e) => setData('shipping_state', e.target.value)}
                                                        placeholder="State / County *"
                                                        className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm focus:border-brand focus:outline-none"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={data.shipping_city}
                                                        onChange={(e) => setData('shipping_city', e.target.value)}
                                                        placeholder="City / Town *"
                                                        className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm focus:border-brand focus:outline-none"
                                                    />
                                                </div>

                                                {/* Zip Row */}
                                                <div className="grid md:grid-cols-2 gap-4">
                                                    <input
                                                        type="text"
                                                        value={data.shipping_zipcode}
                                                        onChange={(e) => setData('shipping_zipcode', e.target.value)}
                                                        placeholder="Postcode / ZIP *"
                                                        className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm focus:border-brand focus:outline-none"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Right Column - Order Summary & Payment */}
                        <div className="lg:w-5/12">
                            {/* Order Summary */}
                            <div className="bg-white p-6 lg:p-8 rounded-lg border border-gray-200 mb-6">
                                <div className="flex items-end justify-between mb-6">
                                    <h4 className="text-xl font-bold text-heading font-quicksand">Your Order</h4>
                                    <span className="text-body text-sm">Subtotal</span>
                                </div>
                                <div className="border-t-2 border-brand mb-6"></div>

                                {/* Order Items */}
                                <div className="space-y-4">
                                    {items.map((item) => (
                                        <div key={item.id} className="flex items-center gap-4 pb-4 border-b border-gray-100">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-16 h-16 object-cover rounded-md"
                                            />
                                            <div className="flex-1">
                                                <h6 className="text-heading font-semibold text-sm mb-1">
                                                    <Link href={`/product/${item.slug}`} className="hover:text-brand transition-colors">
                                                        {item.name}
                                                    </Link>
                                                </h6>
                                                <div className="flex items-center gap-1">
                                                    <span
                                                        className="star-rating text-sm"
                                                        style={{ '--rating': `${(item.rating / 5) * 100}%` }}
                                                    >
                                                        *****
                                                    </span>
                                                    <span className="text-xs text-body">({item.rating.toFixed(1)})</span>
                                                </div>
                                            </div>
                                            <span className="text-body text-sm">x {item.quantity}</span>
                                            <span className="text-brand font-bold">${item.price.toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Payment Section */}
                            <div className="bg-white p-6 lg:p-8 rounded-lg border border-gray-200">
                                <h4 className="text-xl font-bold text-heading font-quicksand mb-6">Payment</h4>

                                {/* Payment Options */}
                                <div className="space-y-3 mb-6">
                                    <div className="custom-radio">
                                        <input
                                            type="radio"
                                            id="payment1"
                                            name="payment_option"
                                            value="bank"
                                            checked={data.payment_method === 'bank'}
                                            onChange={(e) => setData('payment_method', e.target.value)}
                                        />
                                        <label htmlFor="payment1" className="text-heading">Direct Bank Transfer</label>
                                    </div>
                                    <div className="custom-radio">
                                        <input
                                            type="radio"
                                            id="payment2"
                                            name="payment_option"
                                            value="cod"
                                            checked={data.payment_method === 'cod'}
                                            onChange={(e) => setData('payment_method', e.target.value)}
                                        />
                                        <label htmlFor="payment2" className="text-heading">Cash on delivery</label>
                                    </div>
                                    <div className="custom-radio">
                                        <input
                                            type="radio"
                                            id="payment3"
                                            name="payment_option"
                                            value="online"
                                            checked={data.payment_method === 'online'}
                                            onChange={(e) => setData('payment_method', e.target.value)}
                                        />
                                        <label htmlFor="payment3" className="text-heading">Online Gateway</label>
                                    </div>
                                </div>

                                {/* Payment Logos */}
                                <div className="flex items-center gap-3 mb-6">
                                    <img src="/images/frontend/icons/payment-paypal.svg" alt="PayPal" className="h-6" />
                                    <img src="/images/frontend/icons/payment-visa.svg" alt="Visa" className="h-6" />
                                    <img src="/images/frontend/icons/payment-master.svg" alt="Mastercard" className="h-6" />
                                    <img src="/images/frontend/icons/payment-zapper.svg" alt="Zapper" className="h-6" />
                                </div>

                                {/* Place Order Button */}
                                <button
                                    onClick={handleCheckoutSubmit}
                                    disabled={processing}
                                    className="w-full bg-brand hover:bg-brand-dark text-white py-4 rounded-md font-semibold transition-colors flex items-center justify-center gap-2"
                                >
                                    {processing ? 'Processing...' : 'Place an Order'}
                                    <i className="fi fi-rs-sign-out"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Custom Styles for Checkbox and Radio */}
            <style>{`
                .custom-checkbox input[type="checkbox"] { display: none; }
                .custom-checkbox label { position: relative; padding-left: 28px; cursor: pointer; display: inline-block; }
                .custom-checkbox label:before { content: ''; position: absolute; left: 0; top: 2px; width: 18px; height: 18px; border: 1px solid #ced4da; border-radius: 3px; background: #fff; }
                .custom-checkbox input[type="checkbox"]:checked + label:before { background: #3BB77E; border-color: #3BB77E; }
                .custom-checkbox input[type="checkbox"]:checked + label:after { content: '\\2713'; position: absolute; left: 4px; top: 0px; color: white; font-size: 14px; }
                .custom-radio input[type="radio"] { display: none; }
                .custom-radio label { position: relative; padding-left: 28px; cursor: pointer; display: inline-block; }
                .custom-radio label:before { content: ''; position: absolute; left: 0; top: 3px; width: 18px; height: 18px; border: 1px solid #ced4da; border-radius: 50%; background: #fff; }
                .custom-radio input[type="radio"]:checked + label:before { border-color: #3BB77E; }
                .custom-radio input[type="radio"]:checked + label:after { content: ''; position: absolute; left: 5px; top: 8px; width: 8px; height: 8px; background: #3BB77E; border-radius: 50%; }
                .star-rating { background: linear-gradient(90deg, #FFBC0B var(--rating), #e0e0e0 var(--rating)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
            `}</style>
        </FrontendLayout>
    );
}
