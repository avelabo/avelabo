import { useState, useEffect } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import FrontendLayout from '@/Layouts/FrontendLayout';

export default function Account({
    user = null,
    orders = [],
    addresses = [],
    billingAddress = null,
    shippingAddress = null,
    countries = [],
    flash = {},
}) {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [greeting, setGreeting] = useState('Hello');

    // Dynamic greeting based on time of day
    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good morning');
        else if (hour < 17) setGreeting('Good afternoon');
        else setGreeting('Good evening');
    }, []);

    // Form for account details (profile update)
    const profileForm = useForm({
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        phone: user?.phone || '',
    });

    // Form for password update
    const passwordForm = useForm({
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
    });

    // Form for order tracking
    const trackingForm = useForm({
        order_id: '',
        billing_email: '',
    });

    // Form for address management
    const addressForm = useForm({
        label: 'Home',
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        phone: '',
        address_line_1: '',
        address_line_2: '',
        city_name: '',
        region_name: '',
        country_id: '',
        postal_code: '',
        is_default: false,
        is_billing: false,
    });

    const handleProfileSubmit = (e) => {
        e.preventDefault();
        profileForm.put(route('account.profile.update'), {
            preserveScroll: true,
        });
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        passwordForm.put(route('account.password.update'), {
            preserveScroll: true,
            onSuccess: () => {
                passwordForm.reset();
            },
        });
    };

    const handleTrackingSubmit = (e) => {
        e.preventDefault();
        trackingForm.post(route('account.track-order'), {
            preserveScroll: true,
        });
    };

    const handleAddressSubmit = (e) => {
        e.preventDefault();
        if (editingAddress) {
            addressForm.put(route('account.addresses.update', editingAddress.id), {
                preserveScroll: true,
                onSuccess: () => {
                    setShowAddressModal(false);
                    setEditingAddress(null);
                    addressForm.reset();
                },
            });
        } else {
            addressForm.post(route('account.addresses.store'), {
                preserveScroll: true,
                onSuccess: () => {
                    setShowAddressModal(false);
                    addressForm.reset();
                },
            });
        }
    };

    const handleDeleteAddress = (addressId) => {
        if (confirm('Are you sure you want to delete this address?')) {
            router.delete(route('account.addresses.destroy', addressId), {
                preserveScroll: true,
            });
        }
    };

    const handleSetDefaultAddress = (addressId) => {
        router.post(route('account.addresses.default', addressId), {}, {
            preserveScroll: true,
        });
    };

    const openAddressModal = (address = null) => {
        if (address) {
            setEditingAddress(address);
            addressForm.setData({
                label: address.label || 'Home',
                first_name: address.first_name || '',
                last_name: address.last_name || '',
                phone: address.phone || '',
                address_line_1: address.address_line_1 || '',
                address_line_2: address.address_line_2 || '',
                city_name: address.city_name || '',
                region_name: address.region_name || '',
                country_id: address.country_id || '',
                postal_code: address.postal_code || '',
                is_default: address.is_default || false,
                is_billing: address.is_billing || false,
            });
        } else {
            setEditingAddress(null);
            addressForm.reset();
            addressForm.setData('first_name', user?.first_name || '');
            addressForm.setData('last_name', user?.last_name || '');
        }
        setShowAddressModal(true);
    };

    const tabs = [
        { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon },
        { id: 'orders', label: 'Orders', icon: OrdersIcon },
        { id: 'track-orders', label: 'Track Order', icon: TrackIcon },
        { id: 'address', label: 'Addresses', icon: AddressIcon },
        { id: 'account-detail', label: 'Settings', icon: SettingsIcon },
    ];

    const getStatusConfig = (status) => {
        switch (status?.toLowerCase()) {
            case 'processing':
                return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: ProcessingIcon };
            case 'completed':
            case 'delivered':
                return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: DeliveredIcon };
            case 'cancelled':
                return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', icon: CancelledIcon };
            case 'shipped':
                return { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200', icon: ShippedIcon };
            case 'pending':
            default:
                return { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200', icon: PendingIcon };
        }
    };

    const formatAddress = (address) => {
        if (!address) return null;
        const parts = [
            address.address_line_1,
            address.address_line_2,
            address.city_name,
            address.region_name,
            address.postal_code,
            address.country_name,
        ].filter(Boolean);
        return parts;
    };

    // Calculate stats
    const stats = {
        totalOrders: orders.length,
        delivered: orders.filter(o => o.status?.toLowerCase() === 'delivered').length,
        inProgress: orders.filter(o => ['pending', 'processing', 'shipped'].includes(o.status?.toLowerCase())).length,
        savedAddresses: addresses.length,
    };

    // Get member duration
    const getMemberDuration = () => {
        if (!user?.created_at) return 'New member';
        return `Member since ${user.created_at}`;
    };

    // Get initials for avatar
    const getInitials = () => {
        const first = user?.first_name?.[0] || user?.name?.[0] || '';
        const last = user?.last_name?.[0] || '';
        return (first + last).toUpperCase() || 'U';
    };

    return (
        <FrontendLayout>
            <Head title="My Account" />

            {/* Breadcrumb */}
            <div className="border-b border-border-light">
                <div className="max-w-6xl mx-auto px-6 py-4">
                    <nav className="flex items-center gap-2 text-sm">
                        <Link href="/" className="text-muted hover:text-heading transition-colors">Home</Link>
                        <span className="text-border-dark">/</span>
                        <span className="text-heading font-medium">My Account</span>
                    </nav>
                </div>
            </div>

            {/* Flash Messages */}
            {flash?.success && (
                <div className="max-w-6xl mx-auto px-6 pt-6">
                    <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-800 px-5 py-4 rounded-xl">
                        <svg className="w-5 h-5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-medium">{flash.success}</span>
                    </div>
                </div>
            )}

            {/* Account Content */}
            <section className="py-8 lg:py-12">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Sidebar */}
                        <aside className="w-full lg:w-72 flex-shrink-0">
                            {/* Profile Card */}
                            <div className="bg-surface-raised rounded-2xl border border-border-light p-6 mb-4">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-16 h-16 rounded-2xl bg-heading text-white flex items-center justify-center text-xl font-bold">
                                        {getInitials()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h2 className="font-bold text-heading text-lg truncate">
                                            {user?.first_name || user?.name || 'Welcome'}
                                        </h2>
                                        <p className="text-sm text-muted truncate">{user?.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    {getMemberDuration()}
                                </div>
                            </div>

                            {/* Navigation */}
                            <nav className="bg-white border border-border-light rounded-2xl overflow-hidden">
                                <ul>
                                    {tabs.map((tab, index) => (
                                        <li key={tab.id}>
                                            <button
                                                onClick={() => setActiveTab(tab.id)}
                                                className={`w-full flex items-center gap-3 px-5 py-4 text-left transition-all ${
                                                    activeTab === tab.id
                                                        ? 'bg-heading text-white'
                                                        : 'text-heading hover:bg-surface-raised'
                                                } ${index !== 0 ? 'border-t border-border-light' : ''}`}
                                            >
                                                <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-white' : 'text-muted'}`} />
                                                <span className="font-medium">{tab.label}</span>
                                                {tab.id === 'orders' && stats.inProgress > 0 && (
                                                    <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full ${
                                                        activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-700'
                                                    }`}>
                                                        {stats.inProgress}
                                                    </span>
                                                )}
                                            </button>
                                        </li>
                                    ))}
                                    <li className="border-t border-border-light">
                                        <Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                            className="w-full flex items-center gap-3 px-5 py-4 text-left text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            <LogoutIcon className="w-5 h-5" />
                                            <span className="font-medium">Sign Out</span>
                                        </Link>
                                    </li>
                                </ul>
                            </nav>

                            {/* Quick Links */}
                            <div className="mt-4 p-4 bg-brand-2-light/30 rounded-2xl border border-brand-2/20">
                                <p className="text-xs uppercase tracking-widest text-brand-2 font-semibold mb-3">Quick Links</p>
                                <div className="space-y-2">
                                    <Link href={route('shop')} className="flex items-center gap-2 text-sm text-heading hover:text-brand-2 transition-colors">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                        Continue Shopping
                                    </Link>
                                    <Link href={route('wishlist')} className="flex items-center gap-2 text-sm text-heading hover:text-brand-2 transition-colors">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                        My Wishlist
                                    </Link>
                                    <Link href={route('contact')} className="flex items-center gap-2 text-sm text-heading hover:text-brand-2 transition-colors">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Need Help?
                                    </Link>
                                </div>
                            </div>
                        </aside>

                        {/* Main Content */}
                        <div className="flex-1 min-w-0">
                            {/* Dashboard Tab */}
                            {activeTab === 'dashboard' && (
                                <div className="space-y-6">
                                    {/* Welcome Banner */}
                                    <div className="relative bg-heading rounded-2xl p-6 lg:p-8 overflow-hidden">
                                        {/* Decorative Elements */}
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>

                                        <div className="relative">
                                            <p className="text-white/60 text-sm uppercase tracking-widest mb-2">{greeting}</p>
                                            <h1 className="text-2xl lg:text-3xl font-bold text-white mb-3">
                                                {user?.first_name || user?.name || 'Welcome back'}!
                                            </h1>
                                            <p className="text-white/80 max-w-lg">
                                                Your personal dashboard is ready. Check your orders, manage addresses, and keep your account up to date.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                        <StatCard
                                            icon={OrdersIcon}
                                            label="Total Orders"
                                            value={stats.totalOrders}
                                            onClick={() => setActiveTab('orders')}
                                        />
                                        <StatCard
                                            icon={DeliveredIcon}
                                            label="Delivered"
                                            value={stats.delivered}
                                            color="emerald"
                                            onClick={() => setActiveTab('orders')}
                                        />
                                        <StatCard
                                            icon={ShippedIcon}
                                            label="In Progress"
                                            value={stats.inProgress}
                                            color="amber"
                                            onClick={() => setActiveTab('orders')}
                                        />
                                        <StatCard
                                            icon={AddressIcon}
                                            label="Addresses"
                                            value={stats.savedAddresses}
                                            onClick={() => setActiveTab('address')}
                                        />
                                    </div>

                                    {/* Recent Orders & Quick Actions */}
                                    <div className="grid lg:grid-cols-3 gap-6">
                                        {/* Recent Orders */}
                                        <div className="lg:col-span-2 bg-white border border-border-light rounded-2xl overflow-hidden">
                                            <div className="flex items-center justify-between px-6 py-4 border-b border-border-light">
                                                <h3 className="font-bold text-heading">Recent Orders</h3>
                                                <button
                                                    onClick={() => setActiveTab('orders')}
                                                    className="text-sm text-muted hover:text-heading transition-colors"
                                                >
                                                    View all
                                                </button>
                                            </div>
                                            <div className="divide-y divide-border-light">
                                                {orders.slice(0, 3).length > 0 ? (
                                                    orders.slice(0, 3).map((order) => {
                                                        const statusConfig = getStatusConfig(order.status);
                                                        return (
                                                            <div key={order.id} className="p-4 hover:bg-surface-raised transition-colors">
                                                                <div className="flex items-center justify-between mb-2">
                                                                    <span className="font-semibold text-heading">{order.order_number}</span>
                                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border} border`}>
                                                                        <statusConfig.icon className="w-3.5 h-3.5" />
                                                                        {order.status}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center justify-between text-sm">
                                                                    <span className="text-muted">{order.date}</span>
                                                                    <span className="text-heading font-medium">{order.total}</span>
                                                                </div>
                                                            </div>
                                                        );
                                                    })
                                                ) : (
                                                    <div className="p-8 text-center">
                                                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-surface-raised flex items-center justify-center">
                                                            <OrdersIcon className="w-8 h-8 text-muted" />
                                                        </div>
                                                        <p className="text-muted mb-4">No orders yet</p>
                                                        <Link
                                                            href={route('shop')}
                                                            className="inline-flex items-center gap-2 px-4 py-2 bg-heading text-white text-sm font-medium rounded-lg hover:bg-brand-dark transition-colors"
                                                        >
                                                            Start Shopping
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                            </svg>
                                                        </Link>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Quick Actions */}
                                        <div className="bg-white border border-border-light rounded-2xl overflow-hidden">
                                            <div className="px-6 py-4 border-b border-border-light">
                                                <h3 className="font-bold text-heading">Quick Actions</h3>
                                            </div>
                                            <div className="p-4 space-y-2">
                                                <QuickActionButton
                                                    icon={TrackIcon}
                                                    label="Track an Order"
                                                    onClick={() => setActiveTab('track-orders')}
                                                />
                                                <QuickActionButton
                                                    icon={AddressIcon}
                                                    label="Add New Address"
                                                    onClick={() => {
                                                        setActiveTab('address');
                                                        setTimeout(() => openAddressModal(), 100);
                                                    }}
                                                />
                                                <QuickActionButton
                                                    icon={SettingsIcon}
                                                    label="Update Profile"
                                                    onClick={() => setActiveTab('account-detail')}
                                                />
                                                <QuickActionButton
                                                    icon={SecurityIcon}
                                                    label="Change Password"
                                                    onClick={() => setActiveTab('account-detail')}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Default Addresses Preview */}
                                    {(shippingAddress || billingAddress) && (
                                        <div className="grid md:grid-cols-2 gap-4">
                                            {shippingAddress && (
                                                <AddressPreviewCard
                                                    type="Shipping"
                                                    address={shippingAddress}
                                                    onEdit={() => {
                                                        setActiveTab('address');
                                                        setTimeout(() => openAddressModal(shippingAddress), 100);
                                                    }}
                                                />
                                            )}
                                            {billingAddress && billingAddress.id !== shippingAddress?.id && (
                                                <AddressPreviewCard
                                                    type="Billing"
                                                    address={billingAddress}
                                                    onEdit={() => {
                                                        setActiveTab('address');
                                                        setTimeout(() => openAddressModal(billingAddress), 100);
                                                    }}
                                                />
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Orders Tab */}
                            {activeTab === 'orders' && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-2xl font-bold text-heading">Your Orders</h2>
                                            <p className="text-muted mt-1">View and track all your orders</p>
                                        </div>
                                    </div>

                                    {orders.length > 0 ? (
                                        <div className="space-y-4">
                                            {orders.map((order) => {
                                                const statusConfig = getStatusConfig(order.status);
                                                return (
                                                    <div key={order.id} className="bg-white border border-border-light rounded-2xl overflow-hidden hover:border-border transition-colors">
                                                        <div className="p-5 lg:p-6">
                                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                                                                <div className="flex items-center gap-4">
                                                                    <div className={`w-12 h-12 rounded-xl ${statusConfig.bg} flex items-center justify-center`}>
                                                                        <statusConfig.icon className={`w-6 h-6 ${statusConfig.text}`} />
                                                                    </div>
                                                                    <div>
                                                                        <h4 className="font-bold text-heading">{order.order_number}</h4>
                                                                        <p className="text-sm text-muted">{order.date}</p>
                                                                    </div>
                                                                </div>
                                                                <span className={`self-start sm:self-center inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border} border`}>
                                                                    {order.status}
                                                                </span>
                                                            </div>
                                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-border-light">
                                                                <div className="flex items-center gap-6">
                                                                    <div>
                                                                        <p className="text-xs text-muted uppercase tracking-wide">Total</p>
                                                                        <p className="font-bold text-heading">{order.total}</p>
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-xs text-muted uppercase tracking-wide">Items</p>
                                                                        <p className="font-bold text-heading">{order.items}</p>
                                                                    </div>
                                                                </div>
                                                                <Link
                                                                    href={route('customer.orders.show', order.id)}
                                                                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-heading text-white text-sm font-medium rounded-xl hover:bg-brand-dark transition-colors"
                                                                >
                                                                    View Details
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                                    </svg>
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <EmptyState
                                            icon={OrdersIcon}
                                            title="No orders yet"
                                            description="When you place an order, it will appear here for easy tracking and management."
                                            actionLabel="Browse Products"
                                            actionHref={route('shop')}
                                        />
                                    )}
                                </div>
                            )}

                            {/* Track Orders Tab */}
                            {activeTab === 'track-orders' && (
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-2xl font-bold text-heading">Track Your Order</h2>
                                        <p className="text-muted mt-1">Enter your order details to see the current status</p>
                                    </div>

                                    <div className="bg-white border border-border-light rounded-2xl p-6 lg:p-8">
                                        <form onSubmit={handleTrackingSubmit} className="max-w-md space-y-5">
                                            <div>
                                                <label htmlFor="order_id" className="block text-sm font-semibold text-heading mb-2">
                                                    Order Number
                                                </label>
                                                <input
                                                    type="text"
                                                    id="order_id"
                                                    name="order_id"
                                                    value={trackingForm.data.order_id}
                                                    onChange={(e) => trackingForm.setData('order_id', e.target.value)}
                                                    placeholder="e.g., ORD-ABC123"
                                                    className="w-full border border-border rounded-xl px-4 py-3 focus:border-heading focus:outline-none focus:ring-2 focus:ring-heading/10 transition-all"
                                                />
                                                {trackingForm.errors.order_id && (
                                                    <p className="text-red-500 text-sm mt-2">{trackingForm.errors.order_id}</p>
                                                )}
                                            </div>
                                            <div>
                                                <label htmlFor="billing_email" className="block text-sm font-semibold text-heading mb-2">
                                                    Email Address
                                                </label>
                                                <input
                                                    type="email"
                                                    id="billing_email"
                                                    name="billing_email"
                                                    value={trackingForm.data.billing_email}
                                                    onChange={(e) => trackingForm.setData('billing_email', e.target.value)}
                                                    placeholder="Email used during checkout"
                                                    className="w-full border border-border rounded-xl px-4 py-3 focus:border-heading focus:outline-none focus:ring-2 focus:ring-heading/10 transition-all"
                                                />
                                                {trackingForm.errors.billing_email && (
                                                    <p className="text-red-500 text-sm mt-2">{trackingForm.errors.billing_email}</p>
                                                )}
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={trackingForm.processing}
                                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-heading hover:bg-brand-dark text-white font-semibold px-8 py-3 rounded-xl transition-colors disabled:opacity-50"
                                            >
                                                {trackingForm.processing ? (
                                                    <>
                                                        <LoadingSpinner />
                                                        Tracking...
                                                    </>
                                                ) : (
                                                    <>
                                                        <TrackIcon className="w-5 h-5" />
                                                        Track Order
                                                    </>
                                                )}
                                            </button>
                                        </form>

                                        <div className="mt-8 pt-8 border-t border-border-light">
                                            <p className="text-sm text-muted">
                                                <strong className="text-heading">Can't find your order?</strong> Check your confirmation email for the order number, or{' '}
                                                <Link href={route('contact')} className="text-heading underline hover:text-brand-2">contact our support team</Link>.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Address Tab */}
                            {activeTab === 'address' && (
                                <div className="space-y-6">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div>
                                            <h2 className="text-2xl font-bold text-heading">Saved Addresses</h2>
                                            <p className="text-muted mt-1">Manage your shipping and billing addresses</p>
                                        </div>
                                        <button
                                            onClick={() => openAddressModal()}
                                            className="inline-flex items-center justify-center gap-2 bg-heading hover:bg-brand-dark text-white font-semibold px-5 py-2.5 rounded-xl transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            Add Address
                                        </button>
                                    </div>

                                    {addresses.length > 0 ? (
                                        <div className="grid md:grid-cols-2 gap-4">
                                            {addresses.map((address) => (
                                                <div key={address.id} className="bg-white border border-border-light rounded-2xl overflow-hidden hover:border-border transition-colors group">
                                                    <div className="px-5 py-4 border-b border-border-light flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-bold text-heading">{address.label}</span>
                                                            {address.is_default && (
                                                                <span className="px-2 py-0.5 bg-heading text-white text-xs font-medium rounded-md">Default</span>
                                                            )}
                                                            {address.is_billing && (
                                                                <span className="px-2 py-0.5 bg-brand-2 text-heading text-xs font-medium rounded-md">Billing</span>
                                                            )}
                                                        </div>
                                                        <AddressLabelIcon label={address.label} />
                                                    </div>
                                                    <div className="p-5">
                                                        <p className="font-semibold text-heading mb-1">{address.full_name}</p>
                                                        <address className="not-italic text-muted text-sm leading-relaxed mb-4">
                                                            {formatAddress(address)?.map((line, i) => (
                                                                <span key={i}>{line}<br /></span>
                                                            ))}
                                                        </address>
                                                        {address.phone && (
                                                            <p className="text-sm text-muted mb-4 flex items-center gap-2">
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                                </svg>
                                                                {address.phone}
                                                            </p>
                                                        )}
                                                        <div className="flex flex-wrap gap-2">
                                                            <button
                                                                onClick={() => openAddressModal(address)}
                                                                className="px-3 py-1.5 bg-surface-raised text-heading text-sm font-medium rounded-lg hover:bg-surface-sunken transition-colors"
                                                            >
                                                                Edit
                                                            </button>
                                                            {!address.is_default && (
                                                                <button
                                                                    onClick={() => handleSetDefaultAddress(address.id)}
                                                                    className="px-3 py-1.5 text-heading text-sm font-medium rounded-lg hover:bg-surface-raised transition-colors"
                                                                >
                                                                    Set Default
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={() => handleDeleteAddress(address.id)}
                                                                className="px-3 py-1.5 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <EmptyState
                                            icon={AddressIcon}
                                            title="No saved addresses"
                                            description="Add your shipping and billing addresses for faster checkout."
                                            actionLabel="Add Your First Address"
                                            onAction={() => openAddressModal()}
                                        />
                                    )}
                                </div>
                            )}

                            {/* Account Details Tab */}
                            {activeTab === 'account-detail' && (
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-2xl font-bold text-heading">Account Settings</h2>
                                        <p className="text-muted mt-1">Update your personal information and password</p>
                                    </div>

                                    {/* Profile Form */}
                                    <div className="bg-white border border-border-light rounded-2xl overflow-hidden">
                                        <div className="px-6 py-4 border-b border-border-light">
                                            <h3 className="font-bold text-heading flex items-center gap-2">
                                                <UserIcon className="w-5 h-5 text-muted" />
                                                Personal Information
                                            </h3>
                                        </div>
                                        <form onSubmit={handleProfileSubmit} className="p-6 space-y-5">
                                            <div className="grid md:grid-cols-2 gap-5">
                                                <div>
                                                    <label htmlFor="first_name" className="block text-sm font-semibold text-heading mb-2">
                                                        First Name <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="first_name"
                                                        name="first_name"
                                                        value={profileForm.data.first_name}
                                                        onChange={(e) => profileForm.setData('first_name', e.target.value)}
                                                        required
                                                        className="w-full border border-border rounded-xl px-4 py-3 focus:border-heading focus:outline-none focus:ring-2 focus:ring-heading/10 transition-all"
                                                    />
                                                    {profileForm.errors.first_name && (
                                                        <p className="text-red-500 text-sm mt-2">{profileForm.errors.first_name}</p>
                                                    )}
                                                </div>
                                                <div>
                                                    <label htmlFor="last_name" className="block text-sm font-semibold text-heading mb-2">
                                                        Last Name <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="last_name"
                                                        name="last_name"
                                                        value={profileForm.data.last_name}
                                                        onChange={(e) => profileForm.setData('last_name', e.target.value)}
                                                        required
                                                        className="w-full border border-border rounded-xl px-4 py-3 focus:border-heading focus:outline-none focus:ring-2 focus:ring-heading/10 transition-all"
                                                    />
                                                    {profileForm.errors.last_name && (
                                                        <p className="text-red-500 text-sm mt-2">{profileForm.errors.last_name}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div>
                                                <label htmlFor="email" className="block text-sm font-semibold text-heading mb-2">
                                                    Email Address
                                                </label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    value={user?.email || ''}
                                                    disabled
                                                    className="w-full border border-border rounded-xl px-4 py-3 bg-surface-raised text-muted cursor-not-allowed"
                                                />
                                                <p className="text-sm text-muted mt-2">Email address cannot be changed</p>
                                            </div>
                                            <div>
                                                <label htmlFor="phone" className="block text-sm font-semibold text-heading mb-2">
                                                    Phone Number
                                                </label>
                                                <input
                                                    type="tel"
                                                    id="phone"
                                                    name="phone"
                                                    value={profileForm.data.phone}
                                                    onChange={(e) => profileForm.setData('phone', e.target.value)}
                                                    placeholder="+265 999 123 456"
                                                    className="w-full border border-border rounded-xl px-4 py-3 focus:border-heading focus:outline-none focus:ring-2 focus:ring-heading/10 transition-all"
                                                />
                                                {profileForm.errors.phone && (
                                                    <p className="text-red-500 text-sm mt-2">{profileForm.errors.phone}</p>
                                                )}
                                            </div>
                                            <div className="pt-2">
                                                <button
                                                    type="submit"
                                                    disabled={profileForm.processing}
                                                    className="inline-flex items-center justify-center gap-2 bg-heading hover:bg-brand-dark text-white font-semibold px-6 py-3 rounded-xl transition-colors disabled:opacity-50"
                                                >
                                                    {profileForm.processing ? (
                                                        <>
                                                            <LoadingSpinner />
                                                            Saving...
                                                        </>
                                                    ) : (
                                                        'Save Changes'
                                                    )}
                                                </button>
                                            </div>
                                        </form>
                                    </div>

                                    {/* Password Form */}
                                    <div className="bg-white border border-border-light rounded-2xl overflow-hidden">
                                        <div className="px-6 py-4 border-b border-border-light">
                                            <h3 className="font-bold text-heading flex items-center gap-2">
                                                <SecurityIcon className="w-5 h-5 text-muted" />
                                                Change Password
                                            </h3>
                                        </div>
                                        <form onSubmit={handlePasswordSubmit} className="p-6 space-y-5">
                                            <div>
                                                <label htmlFor="current_password" className="block text-sm font-semibold text-heading mb-2">
                                                    Current Password <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="password"
                                                    id="current_password"
                                                    name="current_password"
                                                    value={passwordForm.data.current_password}
                                                    onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                                                    required
                                                    className="w-full border border-border rounded-xl px-4 py-3 focus:border-heading focus:outline-none focus:ring-2 focus:ring-heading/10 transition-all"
                                                />
                                                {passwordForm.errors.current_password && (
                                                    <p className="text-red-500 text-sm mt-2">{passwordForm.errors.current_password}</p>
                                                )}
                                            </div>
                                            <div className="grid md:grid-cols-2 gap-5">
                                                <div>
                                                    <label htmlFor="new_password" className="block text-sm font-semibold text-heading mb-2">
                                                        New Password <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="password"
                                                        id="new_password"
                                                        name="new_password"
                                                        value={passwordForm.data.new_password}
                                                        onChange={(e) => passwordForm.setData('new_password', e.target.value)}
                                                        required
                                                        className="w-full border border-border rounded-xl px-4 py-3 focus:border-heading focus:outline-none focus:ring-2 focus:ring-heading/10 transition-all"
                                                    />
                                                    {passwordForm.errors.new_password && (
                                                        <p className="text-red-500 text-sm mt-2">{passwordForm.errors.new_password}</p>
                                                    )}
                                                </div>
                                                <div>
                                                    <label htmlFor="new_password_confirmation" className="block text-sm font-semibold text-heading mb-2">
                                                        Confirm New Password <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="password"
                                                        id="new_password_confirmation"
                                                        name="new_password_confirmation"
                                                        value={passwordForm.data.new_password_confirmation}
                                                        onChange={(e) => passwordForm.setData('new_password_confirmation', e.target.value)}
                                                        required
                                                        className="w-full border border-border rounded-xl px-4 py-3 focus:border-heading focus:outline-none focus:ring-2 focus:ring-heading/10 transition-all"
                                                    />
                                                </div>
                                            </div>
                                            <div className="pt-2">
                                                <button
                                                    type="submit"
                                                    disabled={passwordForm.processing}
                                                    className="inline-flex items-center justify-center gap-2 bg-heading hover:bg-brand-dark text-white font-semibold px-6 py-3 rounded-xl transition-colors disabled:opacity-50"
                                                >
                                                    {passwordForm.processing ? (
                                                        <>
                                                            <LoadingSpinner />
                                                            Updating...
                                                        </>
                                                    ) : (
                                                        'Update Password'
                                                    )}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Address Modal */}
            {showAddressModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowAddressModal(false)}>
                    <div
                        className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="sticky top-0 bg-white border-b border-border-light px-6 py-4 flex items-center justify-between z-10">
                            <h3 className="font-bold text-xl text-heading">
                                {editingAddress ? 'Edit Address' : 'Add New Address'}
                            </h3>
                            <button
                                onClick={() => {
                                    setShowAddressModal(false);
                                    setEditingAddress(null);
                                }}
                                className="w-8 h-8 rounded-lg hover:bg-surface-raised flex items-center justify-center text-muted hover:text-heading transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleAddressSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-heading mb-2">Address Label</label>
                                <div className="flex gap-2">
                                    {['Home', 'Work', 'Other'].map((label) => (
                                        <button
                                            key={label}
                                            type="button"
                                            onClick={() => addressForm.setData('label', label)}
                                            className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                                                addressForm.data.label === label
                                                    ? 'bg-heading text-white border-heading'
                                                    : 'bg-white text-heading border-border hover:border-heading'
                                            }`}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-heading mb-2">First Name *</label>
                                    <input
                                        type="text"
                                        value={addressForm.data.first_name}
                                        onChange={(e) => addressForm.setData('first_name', e.target.value)}
                                        required
                                        className="w-full border border-border rounded-xl px-4 py-3 focus:border-heading focus:outline-none focus:ring-2 focus:ring-heading/10 transition-all"
                                    />
                                    {addressForm.errors.first_name && (
                                        <p className="text-red-500 text-sm mt-1">{addressForm.errors.first_name}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-heading mb-2">Last Name *</label>
                                    <input
                                        type="text"
                                        value={addressForm.data.last_name}
                                        onChange={(e) => addressForm.setData('last_name', e.target.value)}
                                        required
                                        className="w-full border border-border rounded-xl px-4 py-3 focus:border-heading focus:outline-none focus:ring-2 focus:ring-heading/10 transition-all"
                                    />
                                    {addressForm.errors.last_name && (
                                        <p className="text-red-500 text-sm mt-1">{addressForm.errors.last_name}</p>
                                    )}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-heading mb-2">Phone Number</label>
                                <input
                                    type="tel"
                                    value={addressForm.data.phone}
                                    onChange={(e) => addressForm.setData('phone', e.target.value)}
                                    placeholder="+265 999 123 456"
                                    className="w-full border border-border rounded-xl px-4 py-3 focus:border-heading focus:outline-none focus:ring-2 focus:ring-heading/10 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-heading mb-2">Street Address *</label>
                                <input
                                    type="text"
                                    value={addressForm.data.address_line_1}
                                    onChange={(e) => addressForm.setData('address_line_1', e.target.value)}
                                    required
                                    placeholder="House number and street name"
                                    className="w-full border border-border rounded-xl px-4 py-3 focus:border-heading focus:outline-none focus:ring-2 focus:ring-heading/10 transition-all"
                                />
                                {addressForm.errors.address_line_1 && (
                                    <p className="text-red-500 text-sm mt-1">{addressForm.errors.address_line_1}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-heading mb-2">Apartment, suite, etc. (optional)</label>
                                <input
                                    type="text"
                                    value={addressForm.data.address_line_2}
                                    onChange={(e) => addressForm.setData('address_line_2', e.target.value)}
                                    className="w-full border border-border rounded-xl px-4 py-3 focus:border-heading focus:outline-none focus:ring-2 focus:ring-heading/10 transition-all"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-heading mb-2">City *</label>
                                    <input
                                        type="text"
                                        value={addressForm.data.city_name}
                                        onChange={(e) => addressForm.setData('city_name', e.target.value)}
                                        required
                                        className="w-full border border-border rounded-xl px-4 py-3 focus:border-heading focus:outline-none focus:ring-2 focus:ring-heading/10 transition-all"
                                    />
                                    {addressForm.errors.city_name && (
                                        <p className="text-red-500 text-sm mt-1">{addressForm.errors.city_name}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-heading mb-2">Region/State</label>
                                    <input
                                        type="text"
                                        value={addressForm.data.region_name}
                                        onChange={(e) => addressForm.setData('region_name', e.target.value)}
                                        className="w-full border border-border rounded-xl px-4 py-3 focus:border-heading focus:outline-none focus:ring-2 focus:ring-heading/10 transition-all"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-heading mb-2">Country *</label>
                                    <select
                                        value={addressForm.data.country_id}
                                        onChange={(e) => addressForm.setData('country_id', e.target.value)}
                                        required
                                        className="w-full border border-border rounded-xl px-4 py-3 focus:border-heading focus:outline-none focus:ring-2 focus:ring-heading/10 transition-all bg-white"
                                    >
                                        <option value="">Select</option>
                                        {countries.map((country) => (
                                            <option key={country.id} value={country.id}>
                                                {country.name}
                                            </option>
                                        ))}
                                    </select>
                                    {addressForm.errors.country_id && (
                                        <p className="text-red-500 text-sm mt-1">{addressForm.errors.country_id}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-heading mb-2">Postal Code</label>
                                    <input
                                        type="text"
                                        value={addressForm.data.postal_code}
                                        onChange={(e) => addressForm.setData('postal_code', e.target.value)}
                                        className="w-full border border-border rounded-xl px-4 py-3 focus:border-heading focus:outline-none focus:ring-2 focus:ring-heading/10 transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-3 pt-2">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            checked={addressForm.data.is_default}
                                            onChange={(e) => addressForm.setData('is_default', e.target.checked)}
                                            className="sr-only"
                                        />
                                        <div className={`w-5 h-5 rounded border-2 transition-colors ${addressForm.data.is_default ? 'bg-heading border-heading' : 'border-border group-hover:border-heading'}`}>
                                            {addressForm.data.is_default && (
                                                <svg className="w-full h-full text-white p-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </div>
                                    </div>
                                    <span className="text-sm text-heading">Set as default shipping address</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            checked={addressForm.data.is_billing}
                                            onChange={(e) => addressForm.setData('is_billing', e.target.checked)}
                                            className="sr-only"
                                        />
                                        <div className={`w-5 h-5 rounded border-2 transition-colors ${addressForm.data.is_billing ? 'bg-heading border-heading' : 'border-border group-hover:border-heading'}`}>
                                            {addressForm.data.is_billing && (
                                                <svg className="w-full h-full text-white p-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </div>
                                    </div>
                                    <span className="text-sm text-heading">Use as billing address</span>
                                </label>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAddressModal(false);
                                        setEditingAddress(null);
                                    }}
                                    className="flex-1 border border-border text-heading font-semibold py-3 rounded-xl hover:bg-surface-raised transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={addressForm.processing}
                                    className="flex-1 bg-heading hover:bg-brand-dark text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50"
                                >
                                    {addressForm.processing ? 'Saving...' : (editingAddress ? 'Update' : 'Save Address')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </FrontendLayout>
    );
}

// Icon Components
function DashboardIcon({ className }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
        </svg>
    );
}

function OrdersIcon({ className }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
    );
}

function TrackIcon({ className }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
    );
}

function AddressIcon({ className }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    );
}

function SettingsIcon({ className }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    );
}

function LogoutIcon({ className }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
    );
}

function UserIcon({ className }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
    );
}

function SecurityIcon({ className }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
    );
}

function ProcessingIcon({ className }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );
}

function DeliveredIcon({ className }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );
}

function CancelledIcon({ className }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );
}

function ShippedIcon({ className }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
        </svg>
    );
}

function PendingIcon({ className }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );
}

function LoadingSpinner() {
    return (
        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    );
}

// Reusable Components
function StatCard({ icon: Icon, label, value, color = 'default', onClick }) {
    const colorClasses = {
        default: 'bg-white',
        emerald: 'bg-emerald-50',
        amber: 'bg-amber-50',
    };

    return (
        <button
            onClick={onClick}
            className={`${colorClasses[color]} border border-border-light rounded-2xl p-5 text-left hover:border-border transition-colors group w-full`}
        >
            <div className="flex items-center justify-between mb-3">
                <Icon className="w-6 h-6 text-muted" />
                <svg className="w-4 h-4 text-muted opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </div>
            <p className="text-3xl font-bold text-heading mb-1">{value}</p>
            <p className="text-sm text-muted">{label}</p>
        </button>
    );
}

function QuickActionButton({ icon: Icon, label, onClick }) {
    return (
        <button
            onClick={onClick}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left hover:bg-surface-raised transition-colors group"
        >
            <div className="w-10 h-10 rounded-xl bg-surface-raised flex items-center justify-center group-hover:bg-white transition-colors">
                <Icon className="w-5 h-5 text-muted" />
            </div>
            <span className="font-medium text-heading">{label}</span>
            <svg className="w-4 h-4 text-muted ml-auto opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
        </button>
    );
}

function AddressPreviewCard({ type, address, onEdit }) {
    return (
        <div className="bg-white border border-border-light rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-muted uppercase tracking-wide">{type} Address</span>
                    <span className="px-2 py-0.5 bg-heading text-white text-xs font-medium rounded-md">Default</span>
                </div>
                <button
                    onClick={onEdit}
                    className="text-sm text-muted hover:text-heading transition-colors"
                >
                    Edit
                </button>
            </div>
            <p className="font-semibold text-heading mb-1">{address.full_name}</p>
            <p className="text-sm text-muted leading-relaxed">{address.full_address}</p>
        </div>
    );
}

function AddressLabelIcon({ label }) {
    if (label === 'Home') {
        return (
            <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
        );
    }
    if (label === 'Work') {
        return (
            <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
        );
    }
    return (
        <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    );
}

function EmptyState({ icon: Icon, title, description, actionLabel, actionHref, onAction }) {
    return (
        <div className="bg-surface-raised rounded-2xl p-8 lg:p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white border border-border-light flex items-center justify-center">
                <Icon className="w-10 h-10 text-muted" />
            </div>
            <h3 className="text-xl font-bold text-heading mb-2">{title}</h3>
            <p className="text-muted mb-6 max-w-sm mx-auto">{description}</p>
            {actionHref ? (
                <Link
                    href={actionHref}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-heading text-white font-semibold rounded-xl hover:bg-brand-dark transition-colors"
                >
                    {actionLabel}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </Link>
            ) : (
                <button
                    onClick={onAction}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-heading text-white font-semibold rounded-xl hover:bg-brand-dark transition-colors"
                >
                    {actionLabel}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                </button>
            )}
        </div>
    );
}
