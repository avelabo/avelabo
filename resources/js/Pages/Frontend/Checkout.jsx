import { useState, useEffect, useRef } from 'react';
import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import FrontendLayout from '@/Layouts/FrontendLayout';
import { formatCurrency, getDefaultCurrency } from '@/utils/currency';
import FormAlert from '@/Components/Frontend/FormAlert';
import { useToast } from '@/Contexts/ToastContext';

// City-specific icons representing each city's character
const CityIcons = {
    // Mzuzu - Mountains (Northern highlands)
    Mzuzu: ({ className }) => (
        <svg className={className} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 26L12 10L18 18L24 8L28 26" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 26L14 16L18 20" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
            <circle cx="24" cy="6" r="2" fill="currentColor" opacity="0.3"/>
        </svg>
    ),
    // Lilongwe - Capital building/Government
    Lilongwe: ({ className }) => (
        <svg className={className} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M16 4L28 12V14H4V12L16 4Z" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6 14V26H26V14" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 14V22M16 14V22M22 14V22" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4 26H28" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
            <circle cx="16" cy="9" r="1.5" fill="currentColor"/>
        </svg>
    ),
    // Blantyre - Commerce/Trade (Southern commercial hub)
    Blantyre: ({ className }) => (
        <svg className={className} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="6" y="12" width="8" height="14" rx="1" strokeLinecap="round" strokeLinejoin="round"/>
            <rect x="18" y="8" width="8" height="18" rx="1" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 16H12M8 20H12" strokeLinecap="round"/>
            <path d="M20 12H24M20 16H24M20 20H24" strokeLinecap="round"/>
            <path d="M14 18H18" strokeLinecap="round" strokeDasharray="2 2"/>
            <path d="M2 26H30" strokeLinecap="round" strokeWidth="2"/>
        </svg>
    ),
};

// Delivery Instructions Modal
const DeliveryInstructionsModal = ({ city, isOpen, onClose, onConfirm, deliveryAddress, setDeliveryAddress, isGettingLocation, onGetLocation, userCoordinates, onClearLocation }) => {
    if (!isOpen || !city) return null;

    const cityInstructions = {
        Lilongwe: {
            areas: ['Area 47', 'Area 49', 'Area 3', 'Old Town', 'City Centre', 'Area 25'],
            note: 'Deliveries in Lilongwe are typically made within 24-48 hours. Please provide a landmark near your location.',
            tip: 'For faster delivery, mention if you are near Capital Hill, Crossroads, or any major shopping area.',
        },
        Blantyre: {
            areas: ['Limbe', 'Sunnyside', 'Namiwawa', 'Chilomoni', 'Ndirande', 'City Centre'],
            note: 'Blantyre deliveries cover the greater Blantyre-Limbe area. Delivery times are usually 24-48 hours.',
            tip: 'Include landmarks like Chichiri Shopping Mall, Blantyre Market, or BICC for easier navigation.',
        },
        Mzuzu: {
            areas: ['Katoto', 'Chibanja', 'Masasa', 'Zolozolo', 'Lupaso', 'Town Centre'],
            note: 'Mzuzu deliveries may take 48-72 hours. Our driver will contact you before delivery.',
            tip: 'Mention if you are near Mzuzu Market, the Stadium, or any well-known establishment.',
        },
    };

    const info = cityInstructions[city.name] || cityInstructions.Lilongwe;
    const CityIcon = CityIcons[city.name];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-modal-in">
                {/* Header with city accent */}
                <div className="relative px-6 pt-6 pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand to-brand/80 flex items-center justify-center">
                            {CityIcon && <CityIcon className="w-8 h-8 text-white" />}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-heading">Delivering to {city.name}</h3>
                            <p className="text-sm text-muted">{city.region_name}, Malawi</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                    >
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-5">
                    {/* Delivery Note */}
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <div className="flex gap-3">
                            <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-sm text-amber-800">{info.note}</p>
                        </div>
                    </div>

                    {/* Popular Areas */}
                    <div>
                        <p className="text-sm font-medium text-heading mb-2">Popular delivery areas:</p>
                        <div className="flex flex-wrap gap-2">
                            {info.areas.map((area) => (
                                <span
                                    key={area}
                                    className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full"
                                >
                                    {area}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Share Location Section */}
                    <div>
                        <label className="block text-sm font-medium text-heading mb-2">
                            GPS Location
                        </label>

                        {userCoordinates ? (
                            /* Show captured coordinates in custom fields */
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span className="text-sm font-medium text-green-800">Location captured</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={onClearLocation}
                                        className="text-xs text-red-600 hover:text-red-700 font-medium"
                                    >
                                        Clear
                                    </button>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs text-green-700 mb-1">Latitude</label>
                                        <input
                                            type="text"
                                            value={userCoordinates.lat.toFixed(6)}
                                            readOnly
                                            className="w-full bg-white border border-green-200 rounded px-3 py-2 text-sm text-heading font-mono"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-green-700 mb-1">Longitude</label>
                                        <input
                                            type="text"
                                            value={userCoordinates.lng.toFixed(6)}
                                            readOnly
                                            className="w-full bg-white border border-green-200 rounded px-3 py-2 text-sm text-heading font-mono"
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* Share Location Button */
                            <button
                                type="button"
                                onClick={onGetLocation}
                                disabled={isGettingLocation}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-sm font-medium text-heading transition-colors disabled:opacity-50"
                            >
                                {isGettingLocation ? (
                                    <>
                                        <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                        Getting your location...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        Share my current location
                                    </>
                                )}
                            </button>
                        )}
                        <p className="text-xs text-muted mt-2">
                            Sharing your GPS location helps our driver find you more easily
                        </p>
                    </div>

                    {/* Delivery Address Input */}
                    <div>
                        <label className="block text-sm font-medium text-heading mb-2">
                            Delivery Address / Landmark
                        </label>
                        <textarea
                            value={deliveryAddress}
                            onChange={(e) => setDeliveryAddress(e.target.value)}
                            rows={3}
                            placeholder="E.g., Near Capital Hill, Area 47, Plot 123..."
                            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-brand focus:outline-none resize-none"
                        />
                        <p className="text-xs text-muted mt-1.5">{info.tip}</p>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 pb-6 flex gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-4 py-3 border border-gray-200 rounded-lg text-sm font-medium text-heading hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="flex-1 px-4 py-3 bg-brand hover:bg-brand-dark text-white rounded-lg text-sm font-medium transition-colors"
                    >
                        Confirm Location
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes modal-in {
                    from {
                        opacity: 0;
                        transform: scale(0.95) translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }
                .animate-modal-in {
                    animation: modal-in 0.2s ease-out;
                }
            `}</style>
        </div>
    );
};

export default function Checkout({ cart, paymentGateways = [], countries = [], malawi, deliveryCities = [], savedAddresses = [], user }) {
    const { props, flash } = usePage().props;
    const pageProps = usePage().props;
    const currency = getDefaultCurrency(pageProps);
    const format = (amount) => formatCurrency(amount, currency);
    const toast = useToast();

    const [showLoginForm, setShowLoginForm] = useState(false);
    const [showShippingAddress, setShowShippingAddress] = useState(false);
    const [showDeliveryModal, setShowDeliveryModal] = useState(false);
    const [pendingCity, setPendingCity] = useState(null);
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [isGettingLocation, setIsGettingLocation] = useState(false);
    const [userCoordinates, setUserCoordinates] = useState(null);

    // Check if billing country is Malawi
    const [billingIsMalawi, setBillingIsMalawi] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        billing: {
            first_name: user?.name?.split(' ')[0] || '',
            last_name: user?.name?.split(' ').slice(1).join(' ') || '',
            email: user?.email || '',
            phone: user?.phone || '',
            address_line_1: '',
            address_line_2: '',
            city: '',
            city_id: '',
            state: '',
            postal_code: '',
            country_id: malawi?.id || '',
        },
        shipping: {
            same_as_billing: true,
            first_name: '',
            last_name: '',
            phone: '',
            address_line_1: '',
            address_line_2: '',
            city: '',
            city_id: '',
            state: '',
            postal_code: '',
            country_id: malawi?.id || '',
            coordinates: null,
        },
        payment_gateway_id: paymentGateways[0]?.id || '',
        notes: '',
        create_account: false,
    });

    // Update billingIsMalawi when country changes
    useEffect(() => {
        setBillingIsMalawi(String(data.billing.country_id) === String(malawi?.id));
    }, [data.billing.country_id, malawi?.id]);

    const loginForm = useForm({
        email: '',
        password: '',
    });

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        loginForm.post(route('login'), {
            onSuccess: () => {
                toast.success('Logged in successfully!');
                // Redirect back to checkout after login (login route redirects to home by default)
                router.visit(route('checkout'));
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

    // Open modal when city is clicked
    const handleCityClick = (city) => {
        setPendingCity(city);
        setDeliveryAddress(data.shipping.address_line_1 || '');
        setShowDeliveryModal(true);
    };

    // Confirm city selection from modal
    const handleConfirmCity = () => {
        if (pendingCity) {
            setData('shipping', {
                ...data.shipping,
                city_id: pendingCity.id,
                city: pendingCity.name,
                state: pendingCity.region_name,
                country_id: malawi?.id,
                address_line_1: deliveryAddress,
                coordinates: userCoordinates,
            });
            setShowDeliveryModal(false);
            setPendingCity(null);
        }
    };

    // Get user's location
    const handleGetLocation = () => {
        if (!navigator.geolocation) {
            toast.error('Geolocation is not supported by your browser');
            return;
        }

        setIsGettingLocation(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const coords = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                setUserCoordinates(coords);
                setIsGettingLocation(false);
                toast.success('Location captured successfully!');
            },
            (error) => {
                setIsGettingLocation(false);
                toast.error('Unable to get your location. Please enter your address manually.');
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    // Clear user's location
    const handleClearLocation = () => {
        setUserCoordinates(null);
    };

    // Handle billing city selection for Malawi
    const handleBillingCitySelect = (cityId) => {
        const city = deliveryCities.find(c => c.id === cityId);
        if (city) {
            setData('billing', {
                ...data.billing,
                city_id: cityId,
                city: city.name,
                state: city.region_name,
            });
        }
    };

    const items = cart?.items || [];
    const itemCount = cart?.item_count || 0;

    // Get selected delivery city info
    const selectedDeliveryCity = deliveryCities.find(c => c.id === data.shipping.city_id);

    return (
        <FrontendLayout>
            <Head title="Checkout" />

            <style>{`
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
                .city-card {
                    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .city-card:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
                }
                .city-card.selected {
                    transform: translateY(-3px);
                }
            `}</style>

            {/* Delivery Instructions Modal */}
            <DeliveryInstructionsModal
                city={pendingCity}
                isOpen={showDeliveryModal}
                onClose={() => {
                    setShowDeliveryModal(false);
                    setPendingCity(null);
                }}
                onConfirm={handleConfirmCity}
                deliveryAddress={deliveryAddress}
                setDeliveryAddress={setDeliveryAddress}
                isGettingLocation={isGettingLocation}
                onGetLocation={handleGetLocation}
                userCoordinates={userCoordinates}
                onClearLocation={handleClearLocation}
            />

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

                    {/* Login Section (for guests) - Separate form to avoid validation conflicts */}
                    {!user && (
                        <div className="mb-8">
                            <div className="flex items-center gap-2 text-body">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
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
                                <form onSubmit={handleLoginSubmit} className="mt-4 bg-white p-6 rounded-lg border border-gray-200">
                                    <p className="text-sm text-body mb-6">
                                        If you have shopped with us before, please enter your details below. If you are a new customer, please proceed to the Billing & Shipping section.
                                    </p>
                                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                                        <input
                                            type="email"
                                            value={loginForm.data.email}
                                            onChange={(e) => loginForm.setData('email', e.target.value)}
                                            placeholder="Email Address"
                                            autoComplete="email"
                                            className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm focus:border-brand focus:outline-none"
                                        />
                                        <input
                                            type="password"
                                            value={loginForm.data.password}
                                            onChange={(e) => loginForm.setData('password', e.target.value)}
                                            placeholder="Password"
                                            autoComplete="current-password"
                                            className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm focus:border-brand focus:outline-none"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={loginForm.processing}
                                        className="bg-brand hover:bg-brand-dark text-white px-6 py-3 rounded-md font-semibold transition-colors"
                                    >
                                        {loginForm.processing ? 'Logging in...' : 'Log in'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleCheckoutSubmit}>
                        {/* Main Two-Column Layout */}
                        <div className="flex flex-col lg:flex-row gap-8">
                            {/* Left Column - Forms */}
                            <div className="lg:w-7/12 space-y-6">
                                {/* Billing Details */}
                                <div className="bg-surface p-6 lg:p-8 rounded-xl border border-border-light">
                                    <h4 className="text-lg font-bold text-heading mb-6">Payer Details</h4>

                                    {/* Contact Info */}
                                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <input
                                                type="tel"
                                                value={data.billing.phone}
                                                onChange={(e) => handleBillingChange('phone', e.target.value)}
                                                placeholder="Phone Number *"
                                                required
                                                className={`w-full border rounded-md px-4 py-3 text-sm focus:border-brand focus:outline-none ${errors['billing.phone'] ? 'border-red-500' : 'border-gray-200'}`}
                                            />
                                            <p className="text-xs text-muted mt-1 flex items-center gap-1">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                </svg>
                                                Primary contact method
                                            </p>
                                        </div>
                                        <div>
                                            <input
                                                type="email"
                                                value={data.billing.email}
                                                onChange={(e) => handleBillingChange('email', e.target.value)}
                                                placeholder="Email Address *"
                                                required
                                                className={`w-full border rounded-md px-4 py-3 text-sm focus:border-brand focus:outline-none ${errors['billing.email'] ? 'border-red-500' : 'border-gray-200'}`}
                                            />
                                            <p className="text-xs text-muted mt-1 flex items-center gap-1">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                                Order confirmation & updates
                                            </p>
                                        </div>
                                    </div>

                                    {/* Name */}
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

                                    {/* Country Selection */}
                                    <div className="mb-4">
                                        <select
                                            value={data.billing.country_id}
                                            onChange={(e) => handleBillingChange('country_id', e.target.value)}
                                            required
                                            className={`w-full border rounded-md px-4 py-3 text-sm focus:border-brand focus:outline-none bg-white ${errors['billing.country_id'] ? 'border-red-500' : 'border-gray-200'}`}
                                        >
                                            <option value="">Select your country *</option>
                                            {countries.map((country) => (
                                                <option key={country.id} value={country.id}>
                                                    {country.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Address - Only show for non-Malawi billing */}
                                    {!billingIsMalawi && (
                                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                                            <input
                                                type="text"
                                                value={data.billing.address_line_1}
                                                onChange={(e) => handleBillingChange('address_line_1', e.target.value)}
                                                placeholder="Street Address *"
                                                required
                                                className={`w-full border rounded-md px-4 py-3 text-sm focus:border-brand focus:outline-none ${errors['billing.address_line_1'] ? 'border-red-500' : 'border-gray-200'}`}
                                            />
                                            <input
                                                type="text"
                                                value={data.billing.address_line_2}
                                                onChange={(e) => handleBillingChange('address_line_2', e.target.value)}
                                                placeholder="Apartment, suite, etc. (optional)"
                                                className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm focus:border-brand focus:outline-none"
                                            />
                                        </div>
                                    )}

                                    {/* City/State/Postal - Conditional based on country */}
                                    {billingIsMalawi ? (
                                        /* Malawi: Show city dropdown */
                                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                                            <select
                                                value={data.billing.city_id}
                                                onChange={(e) => handleBillingCitySelect(parseInt(e.target.value))}
                                                className={`w-full border rounded-md px-4 py-3 text-sm focus:border-brand focus:outline-none bg-white ${errors['billing.city_id'] ? 'border-red-500' : 'border-gray-200'}`}
                                            >
                                                <option value="">Select City</option>
                                                {deliveryCities.map((city) => (
                                                    <option key={city.id} value={city.id}>
                                                        {city.name} ({city.region_name})
                                                    </option>
                                                ))}
                                            </select>
                                            <input
                                                type="text"
                                                value={data.billing.postal_code}
                                                onChange={(e) => handleBillingChange('postal_code', e.target.value)}
                                                placeholder="Postal Code (optional)"
                                                className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm focus:border-brand focus:outline-none"
                                            />
                                        </div>
                                    ) : (
                                        /* Other countries: Show text fields */
                                        <div className="grid md:grid-cols-3 gap-4 mb-4">
                                            <input
                                                type="text"
                                                value={data.billing.city}
                                                onChange={(e) => handleBillingChange('city', e.target.value)}
                                                placeholder="City *"
                                                className={`w-full border rounded-md px-4 py-3 text-sm focus:border-brand focus:outline-none ${errors['billing.city'] ? 'border-red-500' : 'border-gray-200'}`}
                                            />
                                            <input
                                                type="text"
                                                value={data.billing.state}
                                                onChange={(e) => handleBillingChange('state', e.target.value)}
                                                placeholder="State / Province"
                                                className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm focus:border-brand focus:outline-none"
                                            />
                                            <input
                                                type="text"
                                                value={data.billing.postal_code}
                                                onChange={(e) => handleBillingChange('postal_code', e.target.value)}
                                                placeholder="Postal Code"
                                                className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm focus:border-brand focus:outline-none"
                                            />
                                        </div>
                                    )}

                                    {/* Additional Notes */}
                                    <div>
                                        <textarea
                                            value={data.notes}
                                            onChange={(e) => setData('notes', e.target.value)}
                                            rows="3"
                                            placeholder="Order notes (optional)"
                                            className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm focus:border-brand focus:outline-none resize-none"
                                        ></textarea>
                                        <p className="text-xs text-muted mt-1 flex items-center gap-1">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                            </svg>
                                            E.g., "Please call before delivery" or "Leave at the gate"
                                        </p>
                                    </div>
                                </div>

                                {/* Delivery Location */}
                                <div className="bg-surface p-6 lg:p-8 rounded-xl border border-border-light">
                                    <div className="flex items-center justify-between mb-5">
                                        <div>
                                            <h4 className="text-lg font-bold text-heading">Delivery Location</h4>
                                            <p className="text-sm text-muted mt-0.5">Select your delivery city in Malawi</p>
                                        </div>
                                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-brand text-white text-xs font-semibold rounded-full">
                                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                            </svg>
                                            Malawi Only
                                        </div>
                                    </div>

                                    {/* City Selection Cards - Compact */}
                                    <div className="grid grid-cols-3 gap-3 mb-5">
                                        {deliveryCities.map((city) => {
                                            const isSelected = data.shipping.city_id === city.id;
                                            const CityIcon = CityIcons[city.name];

                                            return (
                                                <button
                                                    key={city.id}
                                                    type="button"
                                                    onClick={() => handleCityClick(city)}
                                                    className={`city-card relative p-4 rounded-xl border text-center transition-all ${
                                                        isSelected
                                                            ? 'bg-brand text-white border-brand shadow-lg'
                                                            : 'bg-white border-gray-200 hover:border-brand/30'
                                                    }`}
                                                >
                                                    {/* Selected indicator */}
                                                    {isSelected && (
                                                        <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm">
                                                            <svg className="w-3 h-3 text-brand" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        </div>
                                                    )}

                                                    {/* City Icon */}
                                                    <div
                                                        className="w-10 h-10 mx-auto mb-2 rounded-lg flex items-center justify-center"
                                                        style={{ backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : 'rgb(249 250 251)' }}
                                                    >
                                                        {CityIcon && (
                                                            <CityIcon
                                                                className="w-6 h-6"
                                                                style={{ color: isSelected ? '#ffffff' : 'var(--color-brand)' }}
                                                            />
                                                        )}
                                                    </div>

                                                    {/* City Name */}
                                                    <h5
                                                        className="font-bold text-sm"
                                                        style={{ color: isSelected ? '#ffffff' : 'var(--color-heading)' }}
                                                    >
                                                        {city.name}
                                                    </h5>

                                                    {/* Region */}
                                                    <p
                                                        className="text-xs mt-0.5"
                                                        style={{ color: isSelected ? 'rgba(255,255,255,0.7)' : 'var(--color-muted)' }}
                                                    >
                                                        {city.region_name.replace(' Region', '')}
                                                    </p>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Error message for city selection */}
                                    {errors['shipping.city_id'] && (
                                        <p className="text-red-500 text-sm mb-4">Please select a delivery city</p>
                                    )}

                                    {/* Selected City Summary */}
                                    {selectedDeliveryCity && (
                                        <div className="bg-gray-50 rounded-xl p-4">
                                            <div className="flex items-start gap-4">
                                                <div className="w-11 h-11 rounded-lg bg-brand flex items-center justify-center flex-shrink-0">
                                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs text-muted mb-0.5">Delivering to</p>
                                                    <p className="font-semibold text-heading">
                                                        {selectedDeliveryCity.name}, {selectedDeliveryCity.region_name}
                                                    </p>
                                                    {data.shipping.address_line_1 && (
                                                        <p className="text-sm text-body mt-1">
                                                            {data.shipping.address_line_1}
                                                        </p>
                                                    )}
                                                    {data.shipping.coordinates && (
                                                        <p className="text-xs text-muted mt-1 flex items-center gap-1">
                                                            <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            </svg>
                                                            GPS: {data.shipping.coordinates.lat.toFixed(6)}, {data.shipping.coordinates.lng.toFixed(6)}
                                                        </p>
                                                    )}
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => handleCityClick(selectedDeliveryCity)}
                                                    className="text-xs text-brand hover:text-brand-dark font-medium"
                                                >
                                                    Edit
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Different Shipping Contact Toggle - Available for all users */}
                                    <div className="border-t border-gray-200 pt-5 mt-5">
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={!data.shipping.same_as_billing}
                                                onChange={(e) => handleShippingSameAsBilling(!e.target.checked)}
                                                className="w-5 h-5 rounded border-gray-300 text-brand focus:ring-brand"
                                            />
                                            <span className="text-sm text-heading font-medium">
                                                Someone else will receive this order
                                            </span>
                                        </label>
                                        <p className="text-xs text-muted mt-1 ml-8">
                                            Enter different contact details for the delivery recipient
                                        </p>

                                        <div className={`collapse ${showShippingAddress ? 'show' : ''}`}>
                                            <div className="mt-5 space-y-4 bg-gray-50 p-5 rounded-lg">
                                                <h5 className="font-semibold text-heading text-sm mb-4">Recipient Details</h5>

                                                {/* Name */}
                                                <div className="grid md:grid-cols-2 gap-4">
                                                    <input
                                                        type="text"
                                                        value={data.shipping.first_name}
                                                        onChange={(e) => handleShippingChange('first_name', e.target.value)}
                                                        placeholder="Recipient First Name *"
                                                        className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm focus:border-brand focus:outline-none"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={data.shipping.last_name}
                                                        onChange={(e) => handleShippingChange('last_name', e.target.value)}
                                                        placeholder="Recipient Last Name *"
                                                        className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm focus:border-brand focus:outline-none"
                                                    />
                                                </div>

                                                {/* Phone */}
                                                <div>
                                                    <input
                                                        type="tel"
                                                        value={data.shipping.phone}
                                                        onChange={(e) => handleShippingChange('phone', e.target.value)}
                                                        placeholder="Recipient Phone Number *"
                                                        className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm focus:border-brand focus:outline-none"
                                                    />
                                                    <p className="text-xs text-muted mt-1">Our delivery driver will contact this number</p>
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
                                    <div className="space-y-3 mb-8">
                                        {paymentGateways.map((gateway, index) => {
                                            const isSelected = data.payment_gateway_id === gateway.id;
                                            const isPayChangu = gateway.code === 'paychangu' || (gateway.display_name || gateway.name).toLowerCase().includes('paychangu');
                                            const isOneKhusa = gateway.code === 'onekhusa' || gateway.slug === 'onekhusa' || (gateway.display_name || gateway.name).toLowerCase().includes('onekhusa');

                                            return (
                                                <label
                                                    key={gateway.id}
                                                    htmlFor={`payment${index + 1}`}
                                                    className="block cursor-pointer"
                                                >
                                                    <div className={`relative border rounded-lg p-4 transition-all ${
                                                        isSelected
                                                            ? 'border-brand bg-brand/5 shadow-md -translate-y-0.5'
                                                            : 'border-gray-200 bg-white hover:border-gray-300'
                                                    }`}>
                                                        {/* Selected Badge */}
                                                        {isSelected && (
                                                            <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-brand text-white text-xs font-semibold rounded-full shadow-sm">
                                                                Selected
                                                            </div>
                                                        )}

                                                        <div className="flex items-center gap-4">
                                                            <div className="flex-shrink-0">
                                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                                                                    isSelected ? 'border-brand bg-brand' : 'border-gray-300 bg-white'
                                                                }`}>
                                                                    {isSelected && <div className="w-2 h-2 rounded-full bg-white"></div>}
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

                                                            <div className="flex-1 flex items-center justify-between">
                                                                <div>
                                                                    <h5 className={`font-semibold text-sm ${isSelected ? 'text-brand' : 'text-heading'}`}>
                                                                        {gateway.display_name || gateway.name}
                                                                    </h5>
                                                                    {gateway.description && (
                                                                        <p className="text-body text-xs mt-0.5">{gateway.description}</p>
                                                                    )}
                                                                </div>

                                                                {isPayChangu && (
                                                                    <img src="/images/frontend/checkout/paychangu_icon.png" alt="PayChangu" className="h-6 object-contain" />
                                                                )}
                                                                {isOneKhusa && (
                                                                    <img src="/images/frontend/checkout/onekhusa_icon.png" alt="OneKhusa" className="h-6 object-contain" />
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </label>
                                            );
                                        })}

                                        {paymentGateways.length === 0 && (
                                            <div className="text-center py-8">
                                                <div className="inline-flex items-center justify-center w-14 h-14 bg-gray-100 rounded-full mb-3">
                                                    <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                                    </svg>
                                                </div>
                                                <p className="text-muted text-sm">No payment methods available</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Secure Payment Badge */}
                                    {paymentGateways.length > 0 && (
                                        <div className="flex items-center justify-center gap-2 text-xs text-muted mb-6 pb-6 border-b border-gray-100">
                                            <svg className="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                            </svg>
                                            Secure & encrypted payment
                                        </div>
                                    )}

                                    {/* Place Order Button */}
                                    <button
                                        type="submit"
                                        disabled={processing || paymentGateways.length === 0 || !data.shipping.city_id}
                                        className="group w-full bg-brand hover:bg-brand-dark text-white py-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {processing ? (
                                            <>
                                                <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                </svg>
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                </svg>
                                                Place Order Securely
                                            </>
                                        )}
                                    </button>

                                    {!data.shipping.city_id && (
                                        <p className="text-center text-xs text-amber-600 mt-3">
                                            Select a delivery city to continue
                                        </p>
                                    )}
                                </div>

                                {/* Order Summary */}
                                <div className="bg-surface p-6 lg:p-8 rounded-xl border border-border-light">
                                    <h4 className="text-lg font-bold text-heading mb-5">Your Order</h4>

                                    {/* Order Items */}
                                    <div className="space-y-4">
                                        {items.map((item) => (
                                            <div key={item.id} className="flex items-center gap-3 pb-4 border-b border-gray-100">
                                                <img
                                                    src={item.image ? `${item.image}` : '/assets/imgs/shop/product-placeholder.jpg'}
                                                    alt={item.name}
                                                    className="w-14 h-14 object-cover rounded-lg"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <h6 className="text-heading font-medium text-sm truncate">{item.name}</h6>
                                                    {item.variant_name && (
                                                        <p className="text-xs text-muted">{item.variant_name}</p>
                                                    )}
                                                    <p className="text-xs text-muted">Qty: {item.quantity}</p>
                                                </div>
                                                <span className="text-heading font-semibold text-sm">{format(item.line_total)}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Totals */}
                                    {cart && (
                                        <div className="mt-5 space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted">Subtotal</span>
                                                <span className="text-heading">{format(cart.subtotal)}</span>
                                            </div>
                                            {cart.discount_amount > 0 && (
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-success">Discount</span>
                                                    <span className="text-success">-{format(cart.discount_amount)}</span>
                                                </div>
                                            )}
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted">Shipping</span>
                                                <span className="text-heading">
                                                    {cart.shipping_amount > 0 ? format(cart.shipping_amount) : 'Free'}
                                                </span>
                                            </div>
                                            <div className="border-t border-gray-200 pt-3 mt-3 flex justify-between">
                                                <span className="text-heading font-bold">Total</span>
                                                <span className="text-brand font-bold text-lg">{format(cart.total)}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </section>
        </FrontendLayout>
    );
}
