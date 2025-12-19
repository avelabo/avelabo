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

            {/* Breadcrumb */}
            <div className="bg-grey-9 py-4">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-2 text-sm">
                        <Link href="/" className="text-brand hover:text-brand-dark flex items-center gap-1">
                            <i className="fi-rs-home"></i> Home
                        </Link>
                        <span className="text-muted">-</span>
                        <Link href={route('cart')} className="text-muted hover:text-brand">Basket</Link>
                        <span className="text-muted">-</span>
                        <span className="text-body">Checkout</span>
                    </div>
                </div>
            </div>

            {/* Checkout Section */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    {/* Page Header */}
                    <div className="mb-10">
                        <h1 className="text-3xl font-bold text-heading font-quicksand mb-2">Checkout</h1>
                        <p className="text-body">
                            There are <span className="text-brand font-semibold">{itemCount}</span> products in your basket
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
                        <div className="flex flex-col lg:flex-row gap-8">
                            {/* Left Column - Forms */}
                            <div className="lg:w-7/12">
                                {/* Login Section (for guests) */}
                                {!user && (
                                    <div className="mb-8">
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

                                        {showLoginForm && (
                                            <div className="mt-4 bg-white p-6 rounded-lg border border-border">
                                                <p className="text-sm text-body mb-4">
                                                    If you have shopped with us before, log in for faster checkout.
                                                    New customers can proceed with Quick Checkout below.
                                                </p>
                                                <div className="space-y-4">
                                                    <input
                                                        type="email"
                                                        value={loginForm.data.email}
                                                        onChange={(e) => loginForm.setData('email', e.target.value)}
                                                        placeholder="Email"
                                                        className="w-full border border-border rounded-md px-4 py-3 text-sm focus:border-brand focus:outline-none"
                                                    />
                                                    <input
                                                        type="password"
                                                        value={loginForm.data.password}
                                                        onChange={(e) => loginForm.setData('password', e.target.value)}
                                                        placeholder="Password"
                                                        className="w-full border border-border rounded-md px-4 py-3 text-sm focus:border-brand focus:outline-none"
                                                    />
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
                                        )}
                                    </div>
                                )}

                                {/* Billing Details Form */}
                                <div className="bg-white p-6 lg:p-8 rounded-lg border border-border mb-6">
                                    <h4 className="text-xl font-bold text-heading font-quicksand mb-6">
                                        {user ? 'Billing Details' : 'Quick Checkout'}
                                    </h4>

                                    {!user && (
                                        <p className="text-sm text-body mb-6 bg-blue-50 p-3 rounded-lg">
                                            <i className="fi-rs-info mr-2"></i>
                                            An account will be created automatically using your email address.
                                        </p>
                                    )}

                                    {/* Name Row */}
                                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <input
                                                type="text"
                                                value={data.billing.first_name}
                                                onChange={(e) => handleBillingChange('first_name', e.target.value)}
                                                placeholder="First name *"
                                                required
                                                className={`w-full border rounded-md px-4 py-3 text-sm focus:border-brand focus:outline-none ${errors['billing.first_name'] ? 'border-red-500' : 'border-border'}`}
                                            />
                                        </div>
                                        <div>
                                            <input
                                                type="text"
                                                value={data.billing.last_name}
                                                onChange={(e) => handleBillingChange('last_name', e.target.value)}
                                                placeholder="Last name *"
                                                required
                                                className={`w-full border rounded-md px-4 py-3 text-sm focus:border-brand focus:outline-none ${errors['billing.last_name'] ? 'border-red-500' : 'border-border'}`}
                                            />
                                        </div>
                                    </div>

                                    {/* Email & Phone Row */}
                                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <input
                                                type="email"
                                                value={data.billing.email}
                                                onChange={(e) => handleBillingChange('email', e.target.value)}
                                                placeholder="Email address *"
                                                required
                                                className={`w-full border rounded-md px-4 py-3 text-sm focus:border-brand focus:outline-none ${errors['billing.email'] ? 'border-red-500' : 'border-border'}`}
                                            />
                                        </div>
                                        <div>
                                            <input
                                                type="tel"
                                                value={data.billing.phone}
                                                onChange={(e) => handleBillingChange('phone', e.target.value)}
                                                placeholder="Phone *"
                                                required
                                                className={`w-full border rounded-md px-4 py-3 text-sm focus:border-brand focus:outline-none ${errors['billing.phone'] ? 'border-red-500' : 'border-border'}`}
                                            />
                                        </div>
                                    </div>

                                    {/* Address Row */}
                                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <input
                                                type="text"
                                                value={data.billing.address_line_1}
                                                onChange={(e) => handleBillingChange('address_line_1', e.target.value)}
                                                placeholder="Address *"
                                                required
                                                className={`w-full border rounded-md px-4 py-3 text-sm focus:border-brand focus:outline-none ${errors['billing.address_line_1'] ? 'border-red-500' : 'border-border'}`}
                                            />
                                        </div>
                                        <div>
                                            <input
                                                type="text"
                                                value={data.billing.address_line_2}
                                                onChange={(e) => handleBillingChange('address_line_2', e.target.value)}
                                                placeholder="Address line 2 (optional)"
                                                className="w-full border border-border rounded-md px-4 py-3 text-sm focus:border-brand focus:outline-none"
                                            />
                                        </div>
                                    </div>

                                    {/* City & State Row */}
                                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <input
                                                type="text"
                                                value={data.billing.city}
                                                onChange={(e) => handleBillingChange('city', e.target.value)}
                                                placeholder="City / Town *"
                                                required
                                                className={`w-full border rounded-md px-4 py-3 text-sm focus:border-brand focus:outline-none ${errors['billing.city'] ? 'border-red-500' : 'border-border'}`}
                                            />
                                        </div>
                                        <div>
                                            <input
                                                type="text"
                                                value={data.billing.state}
                                                onChange={(e) => handleBillingChange('state', e.target.value)}
                                                placeholder="State / Region"
                                                className="w-full border border-border rounded-md px-4 py-3 text-sm focus:border-brand focus:outline-none"
                                            />
                                        </div>
                                    </div>

                                    {/* Country & Postal Code Row */}
                                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <select
                                                value={data.billing.country_id}
                                                onChange={(e) => handleBillingChange('country_id', e.target.value)}
                                                required
                                                className={`w-full border rounded-md px-4 py-3 text-sm focus:border-brand focus:outline-none bg-white ${errors['billing.country_id'] ? 'border-red-500' : 'border-border'}`}
                                            >
                                                <option value="">Select Country *</option>
                                                {countries.map((country) => (
                                                    <option key={country.id} value={country.id}>{country.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <input
                                                type="text"
                                                value={data.billing.postal_code}
                                                onChange={(e) => handleBillingChange('postal_code', e.target.value)}
                                                placeholder="Postal Code"
                                                className="w-full border border-border rounded-md px-4 py-3 text-sm focus:border-brand focus:outline-none"
                                            />
                                        </div>
                                    </div>

                                    {/* Order Notes */}
                                    <div className="mb-4">
                                        <textarea
                                            value={data.notes}
                                            onChange={(e) => setData('notes', e.target.value)}
                                            rows="3"
                                            placeholder="Order notes (optional)"
                                            className="w-full border border-border rounded-md px-4 py-3 text-sm focus:border-brand focus:outline-none resize-none"
                                        ></textarea>
                                    </div>

                                    {/* Ship to Different Address */}
                                    <div className="border-t border-border pt-6">
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={!data.shipping.same_as_billing}
                                                onChange={(e) => handleShippingSameAsBilling(!e.target.checked)}
                                                className="w-4 h-4 accent-brand"
                                            />
                                            <span className="text-sm text-heading font-semibold">Ship to a different address?</span>
                                        </label>

                                        {showShippingAddress && (
                                            <div className="mt-6 space-y-4">
                                                <div className="grid md:grid-cols-2 gap-4">
                                                    <input
                                                        type="text"
                                                        value={data.shipping.first_name}
                                                        onChange={(e) => handleShippingChange('first_name', e.target.value)}
                                                        placeholder="First name *"
                                                        className="w-full border border-border rounded-md px-4 py-3 text-sm focus:border-brand focus:outline-none"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={data.shipping.last_name}
                                                        onChange={(e) => handleShippingChange('last_name', e.target.value)}
                                                        placeholder="Last name *"
                                                        className="w-full border border-border rounded-md px-4 py-3 text-sm focus:border-brand focus:outline-none"
                                                    />
                                                </div>
                                                <input
                                                    type="tel"
                                                    value={data.shipping.phone}
                                                    onChange={(e) => handleShippingChange('phone', e.target.value)}
                                                    placeholder="Phone *"
                                                    className="w-full border border-border rounded-md px-4 py-3 text-sm focus:border-brand focus:outline-none"
                                                />
                                                <div className="grid md:grid-cols-2 gap-4">
                                                    <input
                                                        type="text"
                                                        value={data.shipping.address_line_1}
                                                        onChange={(e) => handleShippingChange('address_line_1', e.target.value)}
                                                        placeholder="Address *"
                                                        className="w-full border border-border rounded-md px-4 py-3 text-sm focus:border-brand focus:outline-none"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={data.shipping.address_line_2}
                                                        onChange={(e) => handleShippingChange('address_line_2', e.target.value)}
                                                        placeholder="Address line 2"
                                                        className="w-full border border-border rounded-md px-4 py-3 text-sm focus:border-brand focus:outline-none"
                                                    />
                                                </div>
                                                <div className="grid md:grid-cols-2 gap-4">
                                                    <input
                                                        type="text"
                                                        value={data.shipping.city}
                                                        onChange={(e) => handleShippingChange('city', e.target.value)}
                                                        placeholder="City / Town *"
                                                        className="w-full border border-border rounded-md px-4 py-3 text-sm focus:border-brand focus:outline-none"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={data.shipping.state}
                                                        onChange={(e) => handleShippingChange('state', e.target.value)}
                                                        placeholder="State / Region"
                                                        className="w-full border border-border rounded-md px-4 py-3 text-sm focus:border-brand focus:outline-none"
                                                    />
                                                </div>
                                                <div className="grid md:grid-cols-2 gap-4">
                                                    <select
                                                        value={data.shipping.country_id}
                                                        onChange={(e) => handleShippingChange('country_id', e.target.value)}
                                                        className="w-full border border-border rounded-md px-4 py-3 text-sm focus:border-brand focus:outline-none bg-white"
                                                    >
                                                        <option value="">Select Country *</option>
                                                        {countries.map((country) => (
                                                            <option key={country.id} value={country.id}>{country.name}</option>
                                                        ))}
                                                    </select>
                                                    <input
                                                        type="text"
                                                        value={data.shipping.postal_code}
                                                        onChange={(e) => handleShippingChange('postal_code', e.target.value)}
                                                        placeholder="Postal Code"
                                                        className="w-full border border-border rounded-md px-4 py-3 text-sm focus:border-brand focus:outline-none"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Order Summary & Payment */}
                            <div className="lg:w-5/12">
                                {/* Order Summary */}
                                <div className="bg-white p-6 lg:p-8 rounded-lg border border-border mb-6">
                                    <h4 className="text-xl font-bold text-heading font-quicksand mb-6">Your Order</h4>
                                    <div className="border-t-2 border-brand mb-6"></div>

                                    {/* Order Items */}
                                    <div className="space-y-4 mb-6">
                                        {items.map((item) => (
                                            <div key={item.id} className="flex items-center gap-4 pb-4 border-b border-border">
                                                <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                                    {item.image ? (
                                                        <img
                                                            src={`/storage/${item.image}`}
                                                            alt={item.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                            <i className="fi-rs-picture"></i>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h6 className="text-heading font-semibold text-sm mb-1 truncate">
                                                        {item.name}
                                                    </h6>
                                                    {item.variant_name && (
                                                        <p className="text-xs text-muted">{item.variant_name}</p>
                                                    )}
                                                    <p className="text-xs text-muted">Qty: {item.quantity}</p>
                                                </div>
                                                <span className="text-brand font-bold">{format(item.line_total)}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Order Totals */}
                                    <div className="space-y-3 border-t border-border pt-4">
                                        <div className="flex justify-between">
                                            <span className="text-body">Subtotal</span>
                                            <span className="font-semibold">{format(cart?.subtotal)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-body">Shipping</span>
                                            <span className="font-semibold">{cart?.shipping === 0 ? 'Free' : format(cart?.shipping)}</span>
                                        </div>
                                        <div className="flex justify-between text-lg border-t border-border pt-3">
                                            <span className="font-bold text-heading">Total</span>
                                            <span className="font-bold text-brand">{format(cart?.total)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Section */}
                                <div className="bg-white p-6 lg:p-8 rounded-lg border border-border">
                                    <h4 className="text-xl font-bold text-heading font-quicksand mb-6">Payment Method</h4>

                                    {/* Payment Options */}
                                    <div className="space-y-4 mb-6">
                                        {paymentGateways.map((gateway) => {
                                            // Define payment method details based on gateway
                                            const getPaymentDetails = () => {
                                                switch (gateway.slug || gateway.name) {
                                                    case 'onekhusa':
                                                        return {
                                                            title: 'Pay with OneKhusa',
                                                            subtitle: 'Mobile Money & Card Payments',
                                                            fee: '1% transaction fee',
                                                            bgColor: 'bg-[#0078d4]',
                                                            borderColor: 'border-[#0078d4]',
                                                            methods: [
                                                                { name: 'Airtel Money' },
                                                                { name: 'TNM Mpamba' },
                                                                { name: 'Visa' },
                                                                { name: 'Mastercard' },
                                                            ]
                                                        };
                                                    case 'paychangu':
                                                        return {
                                                            title: 'Pay using PayChangu',
                                                            subtitle: 'Mobile Money & Card Payments',
                                                            fee: '4% transaction fee',
                                                            bgColor: 'bg-[#00aab3]',
                                                            borderColor: 'border-[#00aab3]',
                                                            methods: [
                                                                { name: 'Airtel Money' },
                                                                { name: 'TNM Mpamba' },
                                                                { name: 'Visa' },
                                                                { name: 'Mastercard' },
                                                            ]
                                                        };
                                                    case 'cash-on-delivery':
                                                    case 'cod':
                                                        return {
                                                            title: 'Cash on Delivery',
                                                            subtitle: 'Pay when your order arrives',
                                                            fee: null,
                                                            bgColor: 'bg-gray-100',
                                                            borderColor: 'border-gray-300',
                                                            textColor: 'text-heading',
                                                            methods: [
                                                                { name: 'Cash' },
                                                            ]
                                                        };
                                                    default:
                                                        return {
                                                            title: gateway.display_name,
                                                            subtitle: gateway.description,
                                                            fee: null,
                                                            bgColor: 'bg-gray-100',
                                                            borderColor: 'border-gray-300',
                                                            methods: []
                                                        };
                                                }
                                            };

                                            const details = getPaymentDetails();
                                            const isSelected = data.payment_gateway_id === gateway.id;
                                            const isCOD = gateway.slug === 'cash-on-delivery' || gateway.name === 'cod';

                                            return (
                                                <label
                                                    key={gateway.id}
                                                    className={`block p-5 rounded-xl cursor-pointer transition-all ${
                                                        isCOD
                                                            ? `${details.bgColor} ${isSelected ? 'ring-2 ring-gray-400 shadow-md' : 'hover:shadow-md'}`
                                                            : `${details.bgColor} ${isSelected ? 'ring-2 ring-white/50 shadow-lg' : 'hover:shadow-lg'}`
                                                    }`}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <input
                                                            type="radio"
                                                            name="payment_gateway_id"
                                                            value={gateway.id}
                                                            checked={isSelected}
                                                            onChange={(e) => setData('payment_gateway_id', parseInt(e.target.value))}
                                                            className={`w-4 h-4 mt-1 ${isCOD ? 'accent-gray-600' : 'accent-white'}`}
                                                        />
                                                        <div className="flex-1">
                                                            <div className="flex items-center justify-between mb-1">
                                                                <span className={`font-bold text-lg ${isCOD ? 'text-heading' : 'text-white'}`}>
                                                                    {details.title}
                                                                </span>
                                                                {gateway.logo && (
                                                                    <img src={gateway.logo} alt={gateway.name} className="h-6" />
                                                                )}
                                                            </div>
                                                            <div className="flex items-center gap-2 mb-3">
                                                                <p className={`text-sm ${isCOD ? 'text-body' : 'text-white/80'}`}>
                                                                    {details.subtitle}
                                                                </p>
                                                                {details.fee && (
                                                                    <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                                                                        isCOD ? 'bg-gray-200 text-gray-700' : 'bg-white/20 text-white'
                                                                    }`}>
                                                                        {details.fee}
                                                                    </span>
                                                                )}
                                                            </div>

                                                            {/* Payment Method Badges */}
                                                            {details.methods.length > 0 && (
                                                                <div className="flex flex-wrap gap-2">
                                                                    {details.methods.map((method, idx) => (
                                                                        <span
                                                                            key={idx}
                                                                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                                                                                isCOD ? 'bg-white text-gray-700 shadow-sm' : 'bg-white/20 text-white'
                                                                            }`}
                                                                        >
                                                                            {method.name === 'Visa' && (
                                                                                <svg className="w-4 h-3" viewBox="0 0 50 16" fill="currentColor">
                                                                                    <path d="M19.5 1.5L17 14.5H14L16.5 1.5H19.5ZM32.5 9.5L34 4.5L35 9.5H32.5ZM36.5 14.5H39.5L37 1.5H34.5C33.5 1.5 33 2 32.5 3L27.5 14.5H31L31.5 13H35.5L36 14.5H36.5ZM28 10C28 6 22.5 5.5 22.5 4C22.5 3.5 23 3 24 3C25 3 26.5 3.5 27 3.5L27.5 1C27 1 25.5 0.5 24 0.5C21 0.5 19 2 19 4.5C19 8 24.5 8.5 24.5 10.5C24.5 11 24 11.5 23 11.5C21.5 11.5 20 11 19.5 10.5L19 13.5C19.5 13.5 21.5 14.5 23.5 14.5C26.5 14.5 28 13 28 10ZM13 1.5L9 14.5H5.5L3.5 4C3.5 3.5 3 3 2.5 2.5C1.5 2 0 1.5 0 1.5L0 1H5.5C6.5 1 7 1.5 7.5 2.5L8.5 9.5L12 1.5H13Z"/>
                                                                                </svg>
                                                                            )}
                                                                            {method.name === 'Mastercard' && (
                                                                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                                                                    <circle cx="8" cy="12" r="6" fillOpacity="0.8"/>
                                                                                    <circle cx="16" cy="12" r="6" fillOpacity="0.8"/>
                                                                                </svg>
                                                                            )}
                                                                            {method.name === 'Airtel Money' && (
                                                                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                                                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                                                                                </svg>
                                                                            )}
                                                                            {method.name === 'TNM Mpamba' && (
                                                                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                                                                    <path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/>
                                                                                </svg>
                                                                            )}
                                                                            {method.name === 'Cash' && (
                                                                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                                                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"/>
                                                                                </svg>
                                                                            )}
                                                                            {method.name}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </label>
                                            );
                                        })}

                                        {paymentGateways.length === 0 && (
                                            <p className="text-muted text-sm">No payment methods available.</p>
                                        )}
                                    </div>

                                    {/* Place Order Button */}
                                    <button
                                        type="submit"
                                        disabled={processing || paymentGateways.length === 0}
                                        className="w-full bg-brand hover:bg-brand-dark text-white py-4 rounded-md font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {processing ? (
                                            <>
                                                <i className="fi-rs-spinner animate-spin"></i>
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                Place Order
                                                <i className="fi-rs-arrow-right"></i>
                                            </>
                                        )}
                                    </button>

                                    <p className="text-xs text-muted text-center mt-4">
                                        By placing your order, you agree to our Terms & Conditions and Privacy Policy.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </section>
        </FrontendLayout>
    );
}
