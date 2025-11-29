import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';

export default function Show({ order }) {
    const [status, setStatus] = useState('new');
    const [notes, setNotes] = useState('');

    // Sample data - would come from props in real implementation
    const orderData = order || {
        id: '3453012',
        date: 'Wed, Aug 13, 2020, 4:34PM',
        customer: {
            name: 'John Alexander',
            email: 'alex@example.com',
            phone: '+998 99 22123456',
        },
        shipping: {
            method: 'Fargo express',
            payMethod: 'card',
            status: 'new',
        },
        address: {
            city: 'Tashkent, Uzbekistan',
            street: 'Block A, House 123, Floor 2',
            postalCode: 'Po Box 10000',
        },
        items: [
            { id: 1, name: 'Haagen-Dazs Caramel Cone Ice', price: 44.25, quantity: 2, total: 99.50, image: '/images/admin/items/1.jpg' },
            { id: 2, name: 'Seeds of Change Organic', price: 7.50, quantity: 2, total: 15.00, image: '/images/admin/items/2.jpg' },
            { id: 3, name: 'All Natural Italian-Style', price: 43.50, quantity: 2, total: 102.04, image: '/images/admin/items/3.jpg' },
            { id: 4, name: 'Sweet & Salty Kettle Corn', price: 99.00, quantity: 3, total: 297.00, image: '/images/admin/items/4.jpg' },
        ],
        subtotal: 973.35,
        shippingCost: 10.00,
        grandTotal: 983.00,
        paymentStatus: 'Payment done',
        payment: {
            cardType: 'Master Card',
            cardNumber: '**** **** 4768',
            businessName: 'Grand Market LLC',
            phone: '+1 (800) 555-154-52',
        },
    };

    return (
        <AdminLayout>
            <Head title="Order Detail" />

            <div className="space-y-6">
                {/* Page Header */}
                <div>
                    <h2 className="text-2xl font-bold text-heading dark:text-white">Order detail</h2>
                    <p className="text-body">Details for Order ID: {orderData.id}</p>
                </div>

                {/* Order Card */}
                <div className="bg-white dark:bg-dark-card rounded-xl shadow-card">
                    {/* Card Header */}
                    <header className="p-5 border-b dark:border-white/10">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div>
                                <span className="flex items-center gap-2 text-heading dark:text-white font-medium">
                                    <span className="material-icons text-brand">calendar_today</span>
                                    <b>{orderData.date}</b>
                                </span>
                                <p className="text-sm text-body mt-1">Order ID: {orderData.id}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand"
                                >
                                    <option value="">Change status</option>
                                    <option value="awaiting">Awaiting payment</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="delivered">Delivered</option>
                                </select>
                                <button className="px-4 py-2.5 bg-brand hover:bg-brand-dark text-white rounded-lg font-medium text-sm transition-colors">
                                    Save
                                </button>
                                <button className="p-2.5 bg-gray-200 dark:bg-dark-body hover:bg-gray-300 rounded-lg transition-colors">
                                    <span className="material-icons">print</span>
                                </button>
                            </div>
                        </div>
                    </header>

                    {/* Card Body */}
                    <div className="p-5">
                        {/* Order Info Row */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            {/* Customer */}
                            <div className="flex items-start gap-4">
                                <span className="w-12 h-12 inline-flex items-center justify-center rounded-full bg-blue-100 shrink-0">
                                    <span className="material-icons text-blue-500">person</span>
                                </span>
                                <div>
                                    <h6 className="font-medium text-heading dark:text-white mb-2">Customer</h6>
                                    <p className="text-sm text-body mb-2">
                                        {orderData.customer.name}<br />
                                        {orderData.customer.email}<br />
                                        {orderData.customer.phone}
                                    </p>
                                    <Link href="#" className="text-sm text-brand hover:text-brand-dark">View profile</Link>
                                </div>
                            </div>

                            {/* Order Info */}
                            <div className="flex items-start gap-4">
                                <span className="w-12 h-12 inline-flex items-center justify-center rounded-full bg-blue-100 shrink-0">
                                    <span className="material-icons text-blue-500">local_shipping</span>
                                </span>
                                <div>
                                    <h6 className="font-medium text-heading dark:text-white mb-2">Order info</h6>
                                    <p className="text-sm text-body mb-2">
                                        Shipping: {orderData.shipping.method}<br />
                                        Pay method: {orderData.shipping.payMethod}<br />
                                        Status: {orderData.shipping.status}
                                    </p>
                                    <Link href="#" className="text-sm text-brand hover:text-brand-dark">Download info</Link>
                                </div>
                            </div>

                            {/* Deliver to */}
                            <div className="flex items-start gap-4">
                                <span className="w-12 h-12 inline-flex items-center justify-center rounded-full bg-blue-100 shrink-0">
                                    <span className="material-icons text-blue-500">place</span>
                                </span>
                                <div>
                                    <h6 className="font-medium text-heading dark:text-white mb-2">Deliver to</h6>
                                    <p className="text-sm text-body mb-2">
                                        City: {orderData.address.city}<br />
                                        {orderData.address.street}<br />
                                        {orderData.address.postalCode}
                                    </p>
                                    <Link href="#" className="text-sm text-brand hover:text-brand-dark">View on map</Link>
                                </div>
                            </div>
                        </div>

                        {/* Products & Payment Row */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Products Table */}
                            <div className="lg:col-span-2 overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 dark:bg-dark-body">
                                        <tr>
                                            <th className="text-left py-3 px-4 text-xs font-semibold text-body uppercase w-2/5">Product</th>
                                            <th className="text-left py-3 px-4 text-xs font-semibold text-body uppercase w-1/5">Unit Price</th>
                                            <th className="text-left py-3 px-4 text-xs font-semibold text-body uppercase w-1/5">Quantity</th>
                                            <th className="text-right py-3 px-4 text-xs font-semibold text-body uppercase w-1/5">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y dark:divide-white/10">
                                        {orderData.items.map((item) => (
                                            <tr key={item.id}>
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center gap-3">
                                                        <img src={item.image} alt={item.name} className="w-10 h-10 rounded object-cover" />
                                                        <span className="text-sm">{item.name}</span>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 text-sm">${item.price.toFixed(2)}</td>
                                                <td className="py-3 px-4 text-sm">{item.quantity}</td>
                                                <td className="py-3 px-4 text-sm text-right">${item.total.toFixed(2)}</td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <td colSpan="4" className="py-4 px-4">
                                                <div className="flex justify-end">
                                                    <div className="space-y-2 text-right">
                                                        <div className="flex justify-between gap-8">
                                                            <span className="text-body">Subtotal:</span>
                                                            <span className="font-medium">${orderData.subtotal.toFixed(2)}</span>
                                                        </div>
                                                        <div className="flex justify-between gap-8">
                                                            <span className="text-body">Shipping cost:</span>
                                                            <span className="font-medium">${orderData.shippingCost.toFixed(2)}</span>
                                                        </div>
                                                        <div className="flex justify-between gap-8">
                                                            <span className="text-body">Grand total:</span>
                                                            <span className="text-xl font-bold text-heading dark:text-white">${orderData.grandTotal.toFixed(2)}</span>
                                                        </div>
                                                        <div className="flex justify-between gap-8 items-center">
                                                            <span className="text-body">Status:</span>
                                                            <span className="badge-soft-success px-3 py-1 rounded text-xs font-medium">{orderData.paymentStatus}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* Payment & Notes */}
                            <div className="space-y-6">
                                {/* Payment Info */}
                                <div className="bg-gray-50 dark:bg-dark-body rounded-lg p-5">
                                    <h6 className="font-medium text-heading dark:text-white mb-4">Payment info</h6>
                                    <div className="flex items-center gap-2 mb-2">
                                        <img src="/images/admin/card-brands/2.png" alt="Card" className="h-5 border rounded" />
                                        <span className="text-sm">{orderData.payment.cardType} {orderData.payment.cardNumber}</span>
                                    </div>
                                    <p className="text-sm text-body">
                                        Business name: {orderData.payment.businessName}<br />
                                        Phone: {orderData.payment.phone}
                                    </p>
                                </div>

                                {/* Notes */}
                                <div>
                                    <label className="block text-sm font-medium text-heading dark:text-white mb-2">Notes</label>
                                    <textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand resize-none"
                                        rows={3}
                                        placeholder="Type some note"
                                    />
                                    <button className="mt-3 px-4 py-2.5 bg-brand hover:bg-brand-dark text-white rounded-lg font-medium text-sm transition-colors">
                                        Save note
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
