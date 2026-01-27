import { useState } from 'react';
import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import FrontendLayout from '@/Layouts/FrontendLayout';
import { formatCurrency, getDefaultCurrency } from '@/utils/currency';
import FormAlert from '@/Components/Frontend/FormAlert';
import { useToast } from '@/Contexts/ToastContext';

export default function Checkout({ cart, paymentGateways = [], countries = [], savedAddresses = [], user }) {
    const { props, flash } = usePage().props;
    const pageProps = usePage().props;
    const currency = getDefaultCurrency(pageProps);
    const format = (amount) => formatCurrency(amount, currency);
    const toast = useToast();

    const [showLoginForm, setShowLoginForm] = useState(false);
    const [showShippingAddress, setShowShippingAddress] = useState(false);
    const [showPasswordField, setShowPasswordField] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        billing: {
            first_name: user?.name?.split(' ')[0] || '',
            last_name: user?.name?.split(' ').slice(1).join(' ') || '',
            email: user?.email || '',
            phone: user?.phone || '',
            address_line_1: '',
            address_line_2: '',
            city: '',
            state: '',
            postal_code: '',
            country_id: '',
        },
        shipping: {
            same_as_billing: true,
            first_name: '',
            last_name: '',
            phone: '',
            address_line_1: '',
            address_line_2: '',
            city: '',
            state: '',
            postal_code: '',
            country_id: '',
        },
        payment_gateway_id: paymentGateways[0]?.id || '',
        notes: '',
        create_account: false,
    });

    const loginForm = useForm({
        email: '',
        password: '',
    });

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        loginForm.post(route('login'), {
            onSuccess: () => {
                toast.success('Logged in successfully!');
                router.reload();
            },
            onError: () => {
                toast.error('Invalid email or password. Please try again.');
            },
        });
    };

    const handleCheckoutSubmit = (e) => {
        e.preventDefault();
        post(route('checkout.process'), {
            preserveScroll: true,
            onError: (errors) => {
                console.error('Checkout validation errors:', errors);
                // Scroll to top to show errors
                window.scrollTo({ top: 0, behavior: 'smooth' });
            },
            onSuccess: () => {
                console.log('Checkout submitted successfully');
            },
        });
    };

    const handleBillingChange = (field, value) => {
        setData('billing', { ...data.billing, [field]: value });
    };

    const handleShippingChange = (field, value) => {
        setData('shipping', { ...data.shipping, [field]: value });
    };

    const handleShippingSameAsBilling = (checked) => {
        setData('shipping', { ...data.shipping, same_as_billing: checked });
        setShowShippingAddress(!checked);
    };

    const items = cart?.items || [];
    const itemCount = cart?.item_count || 0;

    return (
        <FrontendLayout>
            <Head title="Checkout" />

            <style>{`
                /* Collapsible sections */
                .collapse {
                    max-height: 0;
                    overflow: hidden;
                    opacity: 0;
                    visibility: hidden;
                    transition: max-height 0.3s ease-out, opacity 0.3s ease-out, visibility 0.3s ease-out;
                }
                .collapse.show {
                    max-height: 2000px;
                    overflow: visible;
                    opacity: 1;
                    visibility: visible;
                }
            `}</style>

            {/* Breadcrumb */}
            <div className="border-b border-border-light">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center gap-2 text-sm">
                        <Link href="/" className="text-muted hover:text-brand transition-colors">Home</Link>
                        <svg className="w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <Link href={route('shop')} className="text-muted hover:text-brand transition-colors">Shop</Link>
                        <svg className="w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <Link href={route('cart')} className="text-muted hover:text-brand transition-colors">Basket</Link>
                        <svg className="w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="text-heading font-medium">Checkout</span>
                    </div>
                </div>
            </div>

            {/* Checkout Section */}
            <section className="py-8 lg:py-12">
                <div className="container mx-auto px-4">
                    {/* Page Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl lg:text-3xl font-bold text-heading mb-2">Checkout</h1>
                        <p className="text-body">
                            {itemCount > 0 ? (
                                <>Complete your order with <span className="text-heading font-semibold">{itemCount}</span> {itemCount === 1 ? 'item' : 'items'}</>
                            ) : (
                                'Your basket is empty'
                            )}
                        </p>
                    </div>

                    {/* Flash Messages */}
                    {pageProps.flash?.error && (
                        <FormAlert type="error" message={pageProps.flash.error} className="mb-6" />
                    )}

                    {pageProps.flash?.success && (
                        <FormAlert type="success" message={pageProps.flash.success} className="mb-6" />
                    )}

                    {/* Validation Error Display */}
                    {Object.keys(errors).length > 0 && (
                        <FormAlert
                            type="error"
                            title="Please fix the following errors:"
                            errors={errors}
                            className="mb-6"
                        />
                    )}

                    <form onSubmit={handleCheckoutSubmit}>
                        {/* Login Section (for guests) - Outside main columns */}
                        {!user && (
                            <div className="mb-12">
                                <div className="flex items-center gap-2 text-body">
                                    <i className="fi-rs-user"></i>
                                    <span>Already have an account?</span>
                                    <button
                                        type="button"
                                        onClick={() => setShowLoginForm(!showLoginForm)}
                                        className="text-brand hover:text-brand-dark font-semibold"
                                    >
                                        Click here to login
                                    </button>
                                </div>

                                <div className={`collapse ${showLoginForm ? 'show' : ''}`}>
                                    <div className="mt-4 bg-white p-6 rounded-lg border border-gray-200">
                                        <p className="text-sm text-body mb-6">
                                            If you have shopped with us before, please enter your details below. If you are a new customer, please proceed to the Billing & Shipping section.
                                        </p>
                                        <div className="mb-4">
                                            <input
                                                type="email"
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
                                                <input type="checkbox" id="remember" name="remember" />
                                                <label htmlFor="remember" className="text-sm text-body">Remember me</label>
                                            </div>
                                            <Link href="#" className="text-sm text-brand hover:text-brand-dark">Forgot password?</Link>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleLoginSubmit}
                                            disabled={loginForm.processing}
                                            className="bg-brand hover:bg-brand-dark text-white px-6 py-3 rounded-md font-semibold transition-colors"
                                        >
                                            {loginForm.processing ? 'Logging in...' : 'Log in'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Main Two-Column Layout */}
                        <div className="flex flex-col lg:flex-row gap-8">
                            {/* Left Column - Billing Form */}
                            <div className="lg:w-7/12">
                                {/* Billing Details Form */}
                                <div className="bg-surface p-6 lg:p-8 rounded-xl border border-border-light">
                                    <h4 className="text-lg font-bold text-heading mb-6">Billing Details</h4>

                                    {/* Phone & Email Row - MOST IMPORTANT */}
                                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <input
                                                type="tel"
                                                value={data.billing.phone}
                                                onChange={(e) => handleBillingChange('phone', e.target.value)}
                                                placeholder="Phone Number *"
                                                required
                                                className={`w-full border-2 rounded-md px-4 py-3 text-sm focus:border-brand focus:outline-none ${errors['billing.phone'] ? 'border-red-500' : 'border-gray-200'}`}
                                            />
                                            <p className="text-xs text-muted mt-1 flex items-center gap-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                                </svg>
                                                Primary contact method
                                            </p>
                                        </div>
                                        <input
                                            type="email"
                                            value={data.billing.email}
                                            onChange={(e) => handleBillingChange('email', e.target.value)}
                                            placeholder="Email Address *"
                                            required
                                            className={`w-full border-2 rounded-md px-4 py-3 text-sm focus:border-brand focus:outline-none ${errors['billing.email'] ? 'border-red-500' : 'border-gray-200'}`}
                                        />
                                    </div>

                                    {/* Name Row */}
                                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                                        <input
                                            type="text"
                                            value={data.billing.first_name}
                                            onChange={(e) => handleBillingChange('first_name', e.target.value)}
                                            placeholder="First name *"
                                            required
                                            className={`w-full border rounded-md px-4 py-3 text-sm focus:border-brand focus:outline-none ${errors['billing.first_name'] ? 'border-red-500' : 'border-gray-200'}`}
                                        />
                                        <input
                                            type="text"
                                            value={data.billing.last_name}
                                            onChange={(e) => handleBillingChange('last_name', e.target.value)}
                                            placeholder="Last name *"
                                            required
                                            className={`w-full border rounded-md px-4 py-3 text-sm focus:border-brand focus:outline-none ${errors['billing.last_name'] ? 'border-red-500' : 'border-gray-200'}`}
                                        />
                                    </div>

                                    {/* Address Row */}
                                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                                        <input
                                            type="text"
                                            value={data.billing.address_line_1}
                                            onChange={(e) => handleBillingChange('address_line_1', e.target.value)}
                                            placeholder="Address *"
                                            required
                                            className={`w-full border rounded-md px-4 py-3 text-sm focus:border-brand focus:outline-none ${errors['billing.address_line_1'] ? 'border-red-500' : 'border-gray-200'}`}
                                        />
                                        <input
                                            type="text"
                                            value={data.billing.address_line_2}
                                            onChange={(e) => handleBillingChange('address_line_2', e.target.value)}
                                            placeholder="Address line 2"
                                            className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm focus:border-brand focus:outline-none"
                                        />
                                    </div>

                                    {/* Country & City Row */}
                                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                                        <select
                                            value={data.billing.country_id}
                                            onChange={(e) => handleBillingChange('country_id', e.target.value)}
                                            required
                                            className={`w-full border rounded-md px-4 py-3 text-sm focus:border-brand focus:outline-none bg-white ${errors['billing.country_id'] ? 'border-red-500' : 'border-gray-200'}`}
                                        >
                                            <option value="">Select Country...</option>
                                            {countries.map((country) => (
                                                <option key={country.id} value={country.id}>{country.name}</option>
                                            ))}
                                        </select>
                                        <input
                                            type="text"
                                            value={data.billing.city}
                                            onChange={(e) => handleBillingChange('city', e.target.value)}
                                            placeholder="City / Town *"
                                            required
                                            className={`w-full border rounded-md px-4 py-3 text-sm focus:border-brand focus:outline-none ${errors['billing.city'] ? 'border-red-500' : 'border-gray-200'}`}
                                        />
                                    </div>

                                    {/* State & Postal Code Row */}
                                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                                        <input
                                            type="text"
                                            value={data.billing.state}
                                            onChange={(e) => handleBillingChange('state', e.target.value)}
                                            placeholder="State / County"
                                            className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm focus:border-brand focus:outline-none"
                                        />
                                        <input
                                            type="text"
                                            value={data.billing.postal_code}
                                            onChange={(e) => handleBillingChange('postal_code', e.target.value)}
                                            placeholder="Postcode / ZIP *"
                                            required
                                            className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm focus:border-brand focus:outline-none"
                                        />
                                    </div>

                                    {/* Additional Information */}
                                    <div className="mb-6">
                                        <textarea
                                            value={data.notes}
                                            onChange={(e) => setData('notes', e.target.value)}
                                            rows="4"
                                            placeholder="Additional information"
                                            className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm focus:border-brand focus:outline-none resize-none"
                                        ></textarea>
                                    </div>

                                    {/* Ship to Different Address */}
                                    <div className="border-t border-gray-200 pt-6">
                                        <div className="mb-4">
                                            <div className="custom-checkbox">
                                                <input
                                                    type="checkbox"
                                                    id="differentaddress"
                                                    checked={!data.shipping.same_as_billing}
                                                    onChange={(e) => handleShippingSameAsBilling(!e.target.checked)}
                                                />
                                                <label htmlFor="differentaddress" className="text-sm text-heading font-semibold">
                                                    Ship to a different address?
                                                </label>
                                            </div>
                                        </div>

                                        <div className={`collapse ${showShippingAddress ? 'show' : ''}`}>
                                            <div className="mt-4 space-y-4">
                                                {/* Phone Number - MOST IMPORTANT */}
                                                <div className="grid md:grid-cols-2 gap-4">
                                                    <div>
                                                        <input
                                                            type="tel"
                                                            value={data.shipping.phone}
                                                            onChange={(e) => handleShippingChange('phone', e.target.value)}
                                                            placeholder="Phone Number *"
                                                            className="w-full border-2 border-gray-200 rounded-md px-4 py-3 text-sm focus:border-brand focus:outline-none"
                                                        />
                                                        <p className="text-xs text-muted mt-1 flex items-center gap-1">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                                            </svg>
                                                            For delivery contact
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Name Row */}
                                                <div className="grid md:grid-cols-2 gap-4">
                                                    <input
                                                        type="text"
                                                        value={data.shipping.first_name}
                                                        onChange={(e) => handleShippingChange('first_name', e.target.value)}
                                                        placeholder="First name *"
                                                        className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm focus:border-brand focus:outline-none"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={data.shipping.last_name}
                                                        onChange={(e) => handleShippingChange('last_name', e.target.value)}
                                                        placeholder="Last name *"
                                                        className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm focus:border-brand focus:outline-none"
                                                    />
                                                </div>

                                                {/* Address Row */}
                                                <div className="grid md:grid-cols-2 gap-4">
                                                    <input
                                                        type="text"
                                                        value={data.shipping.address_line_1}
                                                        onChange={(e) => handleShippingChange('address_line_1', e.target.value)}
                                                        placeholder="Address *"
                                                        className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm focus:border-brand focus:outline-none"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={data.shipping.address_line_2}
                                                        onChange={(e) => handleShippingChange('address_line_2', e.target.value)}
                                                        placeholder="Address line 2"
                                                        className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm focus:border-brand focus:outline-none"
                                                    />
                                                </div>

                                                {/* Country & City Row */}
                                                <div className="grid md:grid-cols-2 gap-4">
                                                    <select
                                                        value={data.shipping.country_id}
                                                        onChange={(e) => handleShippingChange('country_id', e.target.value)}
                                                        className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm focus:border-brand focus:outline-none bg-white"
                                                    >
                                                        <option value="">Select Country...</option>
                                                        {countries.map((country) => (
                                                            <option key={country.id} value={country.id}>{country.name}</option>
                                                        ))}
                                                    </select>
                                                    <input
                                                        type="text"
                                                        value={data.shipping.city}
                                                        onChange={(e) => handleShippingChange('city', e.target.value)}
                                                        placeholder="City / Town *"
                                                        className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm focus:border-brand focus:outline-none"
                                                    />
                                                </div>

                                                {/* State & Postal Code Row */}
                                                <div className="grid md:grid-cols-2 gap-4">
                                                    <input
                                                        type="text"
                                                        value={data.shipping.state}
                                                        onChange={(e) => handleShippingChange('state', e.target.value)}
                                                        placeholder="State / County"
                                                        className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm focus:border-brand focus:outline-none"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={data.shipping.postal_code}
                                                        onChange={(e) => handleShippingChange('postal_code', e.target.value)}
                                                        placeholder="Postcode / ZIP *"
                                                        className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm focus:border-brand focus:outline-none"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Order Summary & Payment */}
                            <div className="lg:w-5/12">
                                {/* Payment Section */}
                                <div className="bg-surface p-6 lg:p-8 rounded-xl border border-border-light mb-6">
                                    <h4 className="text-lg font-bold text-heading mb-6">Payment Method</h4>

                                    {/* Payment Options */}
                                    <div className="space-y-4 mb-8">
                                        {paymentGateways.map((gateway, index) => {
                                            const isSelected = data.payment_gateway_id === gateway.id;
                                            const isPayChangu = gateway.code === 'paychangu' || (gateway.display_name || gateway.name).toLowerCase().includes('paychangu');
                                            const isOneKhusa = gateway.code === 'onekhusa' || gateway.slug === 'onekhusa' || (gateway.display_name || gateway.name).toLowerCase().includes('onekhusa');

                                            return (
                                                <label
                                                    key={gateway.id}
                                                    htmlFor={`payment${index + 1}`}
                                                    className={`block cursor-pointer transition-all duration-300 ${
                                                        isSelected
                                                            ? 'transform -translate-y-1'
                                                            : 'hover:-translate-y-0.5'
                                                    }`}
                                                >
                                                    <div
                                                        className={`relative border-2 rounded-lg p-4 transition-all duration-300 ${
                                                            isSelected
                                                                ? 'border-brand bg-gray-50 shadow-md'
                                                                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                                                        }`}
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            {/* Custom Radio Button */}
                                                            <div className="flex-shrink-0">
                                                                <div
                                                                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                                                                        isSelected
                                                                            ? 'border-brand bg-brand'
                                                                            : 'border-gray-300 bg-white'
                                                                    }`}
                                                                >
                                                                    {isSelected && (
                                                                        <div className="w-2 h-2 rounded-full bg-white"></div>
                                                                    )}
                                                                </div>
                                                                <input
                                                                    type="radio"
                                                                    id={`payment${index + 1}`}
                                                                    name="payment_option"
                                                                    value={gateway.id}
                                                                    checked={isSelected}
                                                                    onChange={(e) => setData('payment_gateway_id', parseInt(e.target.value))}
                                                                    className="sr-only"
                                                                />
                                                            </div>

                                                            {/* Payment Gateway Info */}
                                                            <div className="flex-1 flex items-center justify-between">
                                                                <div>
                                                                    <h5 className={`font-semibold text-base mb-1 ${isSelected ? 'text-brand' : 'text-heading'}`}>
                                                                        {gateway.display_name || gateway.name}
                                                                    </h5>
                                                                    {gateway.description && (
                                                                        <p className="text-body text-sm">
                                                                            {gateway.description}
                                                                        </p>
                                                                    )}
                                                                </div>

                                                                {/* Selected Indicator Badge */}
                                                                {isSelected && (
                                                                    <div className="bg-success text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                                                                        <i className="fi-rs-check text-xs"></i>
                                                                        Selected
                                                                    </div>
                                                                )}

                                                                {/* Payment Gateway Logo/Icon */}
                                                                {isPayChangu && (
                                                                    <div className="flex-shrink-0 ml-4">
                                                                        <img
                                                                            src="/images/frontend/checkout/paychangu_icon.png"
                                                                            alt="PayChangu"
                                                                            className="h-7 object-contain"
                                                                        />
                                                                    </div>
                                                                )}
                                                                {isOneKhusa && (
                                                                    <div className="flex-shrink-0 ml-4">
                                                                        <img
                                                                            src="/images/frontend/checkout/onekhusa_icon.png"
                                                                            alt="OneKhusa"
                                                                            className="h-7 object-contain"
                                                                        />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </label>
                                            );
                                        })}

                                        {paymentGateways.length === 0 && (
                                            <div className="text-center py-8">
                                                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                                                    <i className="fi-rs-credit-card text-2xl text-gray-400"></i>
                                                </div>
                                                <p className="text-muted text-sm">No payment methods available at this time.</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Secure Payment Badge */}
                                    {paymentGateways.length > 0 && (
                                        <div className="flex items-center justify-center gap-2 text-sm text-body mb-6 pb-6 border-b border-gray-100">
                                            <i className="fi-rs-shield-check text-success text-lg"></i>
                                            <span>Your payment information is secure and encrypted</span>
                                        </div>
                                    )}

                                    {/* Place Order Button */}
                                    <button
                                        type="submit"
                                        disabled={processing || paymentGateways.length === 0}
                                        className="group w-full bg-brand hover:bg-brand-dark text-white py-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg disabled:hover:shadow-none"
                                    >
                                        {processing ? (
                                            <>
                                                <i className="fi-rs-spinner animate-spin"></i>
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                                </svg>
                                                Place Order Securely
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                                    <polyline points="12 5 19 12 12 19"></polyline>
                                                </svg>
                                            </>
                                        )}
                                    </button>
                                </div>

                                {/* Order Summary */}
                                <div className="bg-surface p-6 lg:p-8 rounded-xl border border-border-light">
                                    <h4 className="text-lg font-bold text-heading mb-6">Your Order</h4>
                                    <div className="border-t border-border-light mb-6"></div>

                                    {/* Order Items */}
                                    <div className="space-y-4">
                                        {items.map((item) => (
                                            <div key={item.id} className="flex items-center gap-4 pb-4 border-b border-gray-100">
                                                <img
                                                    src={item.image ? `/storage/${item.image}` : '/assets/imgs/shop/product-placeholder.jpg'}
                                                    alt={item.name}
                                                    className="w-16 h-16 object-cover rounded-md"
                                                />
                                                <div className="flex-1">
                                                    <h6 className="text-heading font-semibold text-sm mb-1">
                                                        {item.name}
                                                    </h6>
                                                    {item.variant_name && (
                                                        <p className="text-xs text-body">{item.variant_name}</p>
                                                    )}
                                                </div>
                                                <span className="text-body text-sm">x {item.quantity}</span>
                                                <span className="text-brand font-bold">{format(item.line_total)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                            </div>
                        </div>
                    </form>
                </div>
            </section>
        </FrontendLayout>
    );
}
