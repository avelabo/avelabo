import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import FrontendLayout from '@/Layouts/FrontendLayout';

export default function Account({ user = null, orders = [], billingAddress = null, shippingAddress = null }) {
    const [activeTab, setActiveTab] = useState('dashboard');

    // Form for account details
    const accountForm = useForm({
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        display_name: user?.display_name || '',
        email: user?.email || '',
        current_password: '',
        new_password: '',
        confirm_password: '',
    });

    // Form for order tracking
    const trackingForm = useForm({
        order_id: '',
        billing_email: '',
    });

    // Sample orders data for display
    const sampleOrders = orders.length > 0 ? orders : [
        { id: '#1357', date: 'March 45, 2020', status: 'Processing', total: '$125.00', items: 2 },
        { id: '#2468', date: 'June 29, 2020', status: 'Completed', total: '$364.00', items: 5 },
        { id: '#2366', date: 'August 02, 2020', status: 'Completed', total: '$280.00', items: 3 },
    ];

    // Sample addresses
    const defaultBillingAddress = billingAddress || {
        street: '3522 Interstate',
        street2: '75 Business Spur,',
        city: 'Sault Ste. Marie',
        state: 'MI',
        zip: '49783',
        region: 'New York',
    };

    const defaultShippingAddress = shippingAddress || {
        street: '4299 Express Lane',
        city: 'Sarasota,',
        state: 'FL',
        zip: '34249',
        country: 'USA',
        phone: '1.941.227.4444',
        region: 'Sarasota',
    };

    const handleAccountSubmit = (e) => {
        e.preventDefault();
        accountForm.post('/account/update', {
            preserveScroll: true,
        });
    };

    const handleTrackingSubmit = (e) => {
        e.preventDefault();
        trackingForm.post('/orders/track', {
            preserveScroll: true,
        });
    };

    const tabs = [
        { id: 'dashboard', label: 'Dashboard', icon: 'fi-rs-settings-sliders' },
        { id: 'orders', label: 'Orders', icon: 'fi-rs-shopping-bag' },
        { id: 'track-orders', label: 'Track Your Order', icon: 'fi-rs-shopping-cart' },
        { id: 'address', label: 'My Address', icon: 'fi-rs-marker' },
        { id: 'account-detail', label: 'Account Details', icon: 'fi-rs-user' },
    ];

    const getStatusBadgeClass = (status) => {
        switch (status.toLowerCase()) {
            case 'processing':
                return 'bg-yellow-100 text-yellow-700';
            case 'completed':
                return 'bg-green-100 text-green-700';
            case 'cancelled':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <FrontendLayout>
            <Head title="My Account" />

            {/* Breadcrumb */}
            <section className="bg-grey-9 py-4">
                <div className="max-w-container mx-auto px-4">
                    <nav className="flex items-center gap-2 text-sm">
                        <Link href="/" className="text-muted hover:text-brand transition-colors flex items-center gap-1">
                            <i className="fi-rs-home text-xs"></i> Home
                        </Link>
                        <span className="text-muted">/</span>
                        <span className="text-muted">Pages</span>
                        <span className="text-muted">/</span>
                        <span className="text-brand">My Account</span>
                    </nav>
                </div>
            </section>

            {/* Account Content */}
            <section className="py-12 lg:py-20">
                <div className="max-w-container mx-auto px-4">
                    <div className="max-w-5xl mx-auto">
                        <div className="flex flex-col lg:flex-row gap-8">
                            {/* Sidebar Menu */}
                            <aside className="w-full lg:w-64 flex-shrink-0">
                                <div className="bg-white border border-border rounded-xl overflow-hidden">
                                    <nav>
                                        <ul className="divide-y divide-border">
                                            {tabs.map((tab) => (
                                                <li key={tab.id}>
                                                    <button
                                                        onClick={() => setActiveTab(tab.id)}
                                                        className={`w-full flex items-center gap-3 px-5 py-4 text-left text-heading hover:text-brand hover:bg-grey-9 transition-colors font-semibold ${
                                                            activeTab === tab.id
                                                                ? 'text-brand bg-brand-light border-l-[3px] border-brand'
                                                                : ''
                                                        }`}
                                                    >
                                                        <i className={`${tab.icon} text-lg`}></i> {tab.label}
                                                    </button>
                                                </li>
                                            ))}
                                            <li>
                                                <Link
                                                    href="/logout"
                                                    method="post"
                                                    as="button"
                                                    className="w-full flex items-center gap-3 px-5 py-4 text-left text-heading hover:text-brand hover:bg-grey-9 transition-colors font-semibold"
                                                >
                                                    <i className="fi-rs-sign-out text-lg"></i> Logout
                                                </Link>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                            </aside>

                            {/* Tab Content */}
                            <div className="flex-1">
                                {/* Dashboard Tab */}
                                {activeTab === 'dashboard' && (
                                    <div className="bg-white border border-border rounded-xl overflow-hidden">
                                        <div className="border-b border-border px-6 py-4">
                                            <h3 className="font-quicksand font-bold text-xl text-heading">
                                                Hello {user?.first_name || 'Rosie'}!
                                            </h3>
                                        </div>
                                        <div className="p-6">
                                            <p className="text-body leading-7">
                                                From your account dashboard you can easily check &amp; view your{' '}
                                                <button
                                                    onClick={() => setActiveTab('orders')}
                                                    className="text-brand hover:underline"
                                                >
                                                    recent orders
                                                </button>
                                                ,<br />
                                                manage your{' '}
                                                <button
                                                    onClick={() => setActiveTab('address')}
                                                    className="text-brand hover:underline"
                                                >
                                                    shipping and billing addresses
                                                </button>{' '}
                                                and{' '}
                                                <button
                                                    onClick={() => setActiveTab('account-detail')}
                                                    className="text-brand hover:underline"
                                                >
                                                    edit your password and account details.
                                                </button>
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Orders Tab */}
                                {activeTab === 'orders' && (
                                    <div className="bg-white border border-border rounded-xl overflow-hidden">
                                        <div className="border-b border-border px-6 py-4">
                                            <h3 className="font-quicksand font-bold text-xl text-heading">Your Orders</h3>
                                        </div>
                                        <div className="p-6">
                                            <div className="overflow-x-auto">
                                                <table className="w-full">
                                                    <thead>
                                                        <tr className="border-b border-border">
                                                            <th className="text-left py-3 px-4 font-quicksand font-bold text-heading">Order</th>
                                                            <th className="text-left py-3 px-4 font-quicksand font-bold text-heading">Date</th>
                                                            <th className="text-left py-3 px-4 font-quicksand font-bold text-heading">Status</th>
                                                            <th className="text-left py-3 px-4 font-quicksand font-bold text-heading">Total</th>
                                                            <th className="text-left py-3 px-4 font-quicksand font-bold text-heading">Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {sampleOrders.map((order, index) => (
                                                            <tr key={index} className={index < sampleOrders.length - 1 ? 'border-b border-border' : ''}>
                                                                <td className="py-4 px-4 text-heading font-semibold">{order.id}</td>
                                                                <td className="py-4 px-4">{order.date}</td>
                                                                <td className="py-4 px-4">
                                                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClass(order.status)}`}>
                                                                        {order.status}
                                                                    </span>
                                                                </td>
                                                                <td className="py-4 px-4">{order.total} for {order.items} items</td>
                                                                <td className="py-4 px-4">
                                                                    <Link
                                                                        href={`/orders/${order.id}`}
                                                                        className="inline-block px-4 py-2 bg-brand text-white text-xs font-semibold rounded-md hover:bg-brand-dark transition-colors"
                                                                    >
                                                                        View
                                                                    </Link>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Track Orders Tab */}
                                {activeTab === 'track-orders' && (
                                    <div className="bg-white border border-border rounded-xl overflow-hidden">
                                        <div className="border-b border-border px-6 py-4">
                                            <h3 className="font-quicksand font-bold text-xl text-heading">Orders Tracking</h3>
                                        </div>
                                        <div className="p-6">
                                            <p className="text-body mb-6">
                                                To track your order please enter your Order ID in the box below and press "Track" button. This was given to you on your receipt and in the confirmation email you should have received.
                                            </p>
                                            <form onSubmit={handleTrackingSubmit} className="max-w-lg space-y-5">
                                                <div>
                                                    <label htmlFor="order_id" className="block text-heading font-semibold mb-2">Order ID</label>
                                                    <input
                                                        type="text"
                                                        id="order_id"
                                                        name="order_id"
                                                        value={trackingForm.data.order_id}
                                                        onChange={(e) => trackingForm.setData('order_id', e.target.value)}
                                                        placeholder="Found in your order confirmation email"
                                                        className="w-full border border-border rounded-md px-4 py-3 focus:border-brand focus:outline-none"
                                                    />
                                                    {trackingForm.errors.order_id && (
                                                        <p className="text-red-500 text-sm mt-1">{trackingForm.errors.order_id}</p>
                                                    )}
                                                </div>
                                                <div>
                                                    <label htmlFor="billing_email" className="block text-heading font-semibold mb-2">Billing Email</label>
                                                    <input
                                                        type="email"
                                                        id="billing_email"
                                                        name="billing_email"
                                                        value={trackingForm.data.billing_email}
                                                        onChange={(e) => trackingForm.setData('billing_email', e.target.value)}
                                                        placeholder="Email you used during checkout"
                                                        className="w-full border border-border rounded-md px-4 py-3 focus:border-brand focus:outline-none"
                                                    />
                                                    {trackingForm.errors.billing_email && (
                                                        <p className="text-red-500 text-sm mt-1">{trackingForm.errors.billing_email}</p>
                                                    )}
                                                </div>
                                                <button
                                                    type="submit"
                                                    disabled={trackingForm.processing}
                                                    className="bg-brand hover:bg-brand-dark text-white font-bold px-8 py-3 rounded-md transition-colors disabled:opacity-50"
                                                >
                                                    {trackingForm.processing ? 'Tracking...' : 'Track'}
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                )}

                                {/* Address Tab */}
                                {activeTab === 'address' && (
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {/* Billing Address */}
                                        <div className="bg-white border border-border rounded-xl overflow-hidden">
                                            <div className="border-b border-border px-6 py-4">
                                                <h3 className="font-quicksand font-bold text-lg text-heading">Billing Address</h3>
                                            </div>
                                            <div className="p-6">
                                                <address className="not-italic text-body leading-7 mb-4">
                                                    {defaultBillingAddress.street}<br />
                                                    {defaultBillingAddress.street2}<br />
                                                    {defaultBillingAddress.city}, {defaultBillingAddress.state} {defaultBillingAddress.zip}
                                                </address>
                                                <p className="text-heading font-semibold mb-4">{defaultBillingAddress.region}</p>
                                                <Link
                                                    href="/account/billing-address/edit"
                                                    className="inline-block px-4 py-2 bg-brand text-white text-xs font-semibold rounded-md hover:bg-brand-dark transition-colors"
                                                >
                                                    Edit
                                                </Link>
                                            </div>
                                        </div>

                                        {/* Shipping Address */}
                                        <div className="bg-white border border-border rounded-xl overflow-hidden">
                                            <div className="border-b border-border px-6 py-4">
                                                <h3 className="font-quicksand font-bold text-lg text-heading">Shipping Address</h3>
                                            </div>
                                            <div className="p-6">
                                                <address className="not-italic text-body leading-7 mb-4">
                                                    {defaultShippingAddress.street}<br />
                                                    {defaultShippingAddress.city}<br />
                                                    {defaultShippingAddress.state} {defaultShippingAddress.zip} {defaultShippingAddress.country}<br />
                                                    Phone: {defaultShippingAddress.phone}
                                                </address>
                                                <p className="text-heading font-semibold mb-4">{defaultShippingAddress.region}</p>
                                                <Link
                                                    href="/account/shipping-address/edit"
                                                    className="inline-block px-4 py-2 bg-brand text-white text-xs font-semibold rounded-md hover:bg-brand-dark transition-colors"
                                                >
                                                    Edit
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Account Details Tab */}
                                {activeTab === 'account-detail' && (
                                    <div className="bg-white border border-border rounded-xl overflow-hidden">
                                        <div className="border-b border-border px-6 py-4">
                                            <h3 className="font-quicksand font-bold text-xl text-heading">Account Details</h3>
                                        </div>
                                        <div className="p-6">
                                            <p className="text-body mb-6">
                                                Already have an account?{' '}
                                                <Link href="/login" className="text-brand hover:underline">
                                                    Log in instead!
                                                </Link>
                                            </p>
                                            <form onSubmit={handleAccountSubmit} className="space-y-5">
                                                <div className="grid md:grid-cols-2 gap-5">
                                                    <div>
                                                        <label htmlFor="first_name" className="block text-heading font-semibold mb-2">
                                                            First Name <span className="text-red-500">*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="first_name"
                                                            name="first_name"
                                                            value={accountForm.data.first_name}
                                                            onChange={(e) => accountForm.setData('first_name', e.target.value)}
                                                            required
                                                            className="w-full border border-border rounded-md px-4 py-3 focus:border-brand focus:outline-none"
                                                        />
                                                        {accountForm.errors.first_name && (
                                                            <p className="text-red-500 text-sm mt-1">{accountForm.errors.first_name}</p>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <label htmlFor="last_name" className="block text-heading font-semibold mb-2">
                                                            Last Name <span className="text-red-500">*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="last_name"
                                                            name="last_name"
                                                            value={accountForm.data.last_name}
                                                            onChange={(e) => accountForm.setData('last_name', e.target.value)}
                                                            required
                                                            className="w-full border border-border rounded-md px-4 py-3 focus:border-brand focus:outline-none"
                                                        />
                                                        {accountForm.errors.last_name && (
                                                            <p className="text-red-500 text-sm mt-1">{accountForm.errors.last_name}</p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div>
                                                    <label htmlFor="display_name" className="block text-heading font-semibold mb-2">
                                                        Display Name <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="display_name"
                                                        name="display_name"
                                                        value={accountForm.data.display_name}
                                                        onChange={(e) => accountForm.setData('display_name', e.target.value)}
                                                        required
                                                        className="w-full border border-border rounded-md px-4 py-3 focus:border-brand focus:outline-none"
                                                    />
                                                    {accountForm.errors.display_name && (
                                                        <p className="text-red-500 text-sm mt-1">{accountForm.errors.display_name}</p>
                                                    )}
                                                </div>
                                                <div>
                                                    <label htmlFor="email" className="block text-heading font-semibold mb-2">
                                                        Email Address <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="email"
                                                        id="email"
                                                        name="email"
                                                        value={accountForm.data.email}
                                                        onChange={(e) => accountForm.setData('email', e.target.value)}
                                                        required
                                                        className="w-full border border-border rounded-md px-4 py-3 focus:border-brand focus:outline-none"
                                                    />
                                                    {accountForm.errors.email && (
                                                        <p className="text-red-500 text-sm mt-1">{accountForm.errors.email}</p>
                                                    )}
                                                </div>
                                                <div>
                                                    <label htmlFor="current_password" className="block text-heading font-semibold mb-2">
                                                        Current Password <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="password"
                                                        id="current_password"
                                                        name="current_password"
                                                        value={accountForm.data.current_password}
                                                        onChange={(e) => accountForm.setData('current_password', e.target.value)}
                                                        required
                                                        className="w-full border border-border rounded-md px-4 py-3 focus:border-brand focus:outline-none"
                                                    />
                                                    {accountForm.errors.current_password && (
                                                        <p className="text-red-500 text-sm mt-1">{accountForm.errors.current_password}</p>
                                                    )}
                                                </div>
                                                <div>
                                                    <label htmlFor="new_password" className="block text-heading font-semibold mb-2">
                                                        New Password <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="password"
                                                        id="new_password"
                                                        name="new_password"
                                                        value={accountForm.data.new_password}
                                                        onChange={(e) => accountForm.setData('new_password', e.target.value)}
                                                        required
                                                        className="w-full border border-border rounded-md px-4 py-3 focus:border-brand focus:outline-none"
                                                    />
                                                    {accountForm.errors.new_password && (
                                                        <p className="text-red-500 text-sm mt-1">{accountForm.errors.new_password}</p>
                                                    )}
                                                </div>
                                                <div>
                                                    <label htmlFor="confirm_password" className="block text-heading font-semibold mb-2">
                                                        Confirm Password <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="password"
                                                        id="confirm_password"
                                                        name="confirm_password"
                                                        value={accountForm.data.confirm_password}
                                                        onChange={(e) => accountForm.setData('confirm_password', e.target.value)}
                                                        required
                                                        className="w-full border border-border rounded-md px-4 py-3 focus:border-brand focus:outline-none"
                                                    />
                                                    {accountForm.errors.confirm_password && (
                                                        <p className="text-red-500 text-sm mt-1">{accountForm.errors.confirm_password}</p>
                                                    )}
                                                </div>
                                                <button
                                                    type="submit"
                                                    disabled={accountForm.processing}
                                                    className="bg-brand hover:bg-brand-dark text-white font-bold px-8 py-3 rounded-md transition-colors disabled:opacity-50"
                                                >
                                                    {accountForm.processing ? 'Saving...' : 'Save Changes'}
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </FrontendLayout>
    );
}
