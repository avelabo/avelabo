import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';

export default function Index() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMethod, setSelectedMethod] = useState('');

    // Sample transaction data
    const transactions = [
        { id: '#456667', amount: 294.00, method: 'Amex', methodIcon: '/assets/imgs/card-brands/1.png', date: '16.12.2020, 14:21' },
        { id: '#134768', amount: 294.00, method: 'Master card', methodIcon: '/assets/imgs/card-brands/2.png', date: '16.12.2020, 14:21' },
        { id: '#134768', amount: 294.00, method: 'Paypal', methodIcon: '/assets/imgs/card-brands/3.png', date: '16.12.2020, 14:21' },
        { id: '#134768', amount: 294.00, method: 'Visa', methodIcon: '/assets/imgs/card-brands/4.png', date: '16.12.2020, 14:21' },
        { id: '#887780', amount: 294.00, method: 'Visa', methodIcon: '/assets/imgs/card-brands/4.png', date: '16.12.2020, 14:21' },
        { id: '#344556', amount: 294.00, method: 'Visa', methodIcon: '/assets/imgs/card-brands/4.png', date: '16.12.2020, 14:21' },
        { id: '#134768', amount: 294.00, method: 'Master card', methodIcon: '/assets/imgs/card-brands/2.png', date: '16.12.2020, 14:21' },
        { id: '#134768', amount: 294.00, method: 'Master card', methodIcon: '/assets/imgs/card-brands/2.png', date: '16.12.2020, 14:21' },
        { id: '#998784', amount: 294.00, method: 'Paypal', methodIcon: '/assets/imgs/card-brands/3.png', date: '16.12.2020, 14:21' },
        { id: '#556667', amount: 294.00, method: 'Paypal', methodIcon: '/assets/imgs/card-brands/3.png', date: '16.12.2020, 14:21' },
        { id: '#098989', amount: 294.00, method: 'Paypal', methodIcon: '/assets/imgs/card-brands/3.png', date: '16.12.2020, 14:21' },
        { id: '#134768', amount: 294.00, method: 'Visa', methodIcon: '/assets/imgs/card-brands/4.png', date: '16.12.2020, 14:21' },
    ];

    // Transaction details sidebar data
    const transactionDetails = {
        supplier: 'TemplateMount',
        date: 'December 19th, 2020',
        billingAddress: '1901 Thornridge Cir. Shiloh, Hawaii 81063',
        vatId: '54741654160',
        email: 'support@example.com',
        items: [
            { name: 'Adidas Air Jordan', link: '#' },
            { name: 'Great product', link: '#' }
        ],
        paymentMethod: 'PayPal',
        total: 457.14
    };

    const paymentMethods = [
        { value: '', label: 'Method' },
        { value: 'mastercard', label: 'Master card' },
        { value: 'visa', label: 'Visa card' },
        { value: 'paypal', label: 'Paypal' },
    ];

    return (
        <AdminLayout>
            <Head title="Transactions - Nest Dashboard" />

            <section className="content-main p-4 lg:p-8 dark:bg-dark-body">
                {/* Page title */}
                <div className="mb-8">
                    <h2 className="text-3xl font-quicksand font-bold text-heading dark:text-white">Transactions</h2>
                </div>

                {/* Transactions Card */}
                <div className="bg-white dark:bg-dark-card rounded-card border border-gray-100 dark:border-gray-700">
                    <div className="p-6">
                        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                            {/* Left: Transaction Table (9 cols) */}
                            <div className="xl:col-span-9">
                                {/* Filters */}
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 pb-6 mb-6 border-b border-gray-200 dark:border-gray-700">
                                    <div className="lg:col-span-7">
                                        <input
                                            type="text"
                                            placeholder="Search..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full px-4 py-3 bg-bg-input dark:bg-gray-700 border-0 rounded-lg outline-none focus:ring-2 focus:ring-brand text-sm dark:text-white"
                                        />
                                    </div>
                                    <div className="lg:col-span-5">
                                        <select
                                            value={selectedMethod}
                                            onChange={(e) => setSelectedMethod(e.target.value)}
                                            className="w-full px-4 py-3 bg-bg-input dark:bg-gray-700 border-0 rounded-lg outline-none focus:ring-2 focus:ring-brand text-sm dark:text-white"
                                        >
                                            {paymentMethods.map((method) => (
                                                <option key={method.value} value={method.value}>
                                                    {method.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Table */}
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-gray-50 dark:bg-gray-700">
                                                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">Transaction ID</th>
                                                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">Paid</th>
                                                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">Method</th>
                                                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">Date</th>
                                                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                            {transactions.map((transaction, index) => (
                                                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                    <td className="py-3 px-4 text-sm font-bold text-heading dark:text-white">{transaction.id}</td>
                                                    <td className="py-3 px-4 text-sm dark:text-gray-300">${transaction.amount.toFixed(2)}</td>
                                                    <td className="py-3 px-4">
                                                        <div className="flex items-center gap-2">
                                                            <img
                                                                src={transaction.methodIcon}
                                                                alt={transaction.method}
                                                                className="w-8 h-6 border border-gray-200 dark:border-gray-600 rounded"
                                                            />
                                                            <span className="text-sm text-gray-500 dark:text-gray-400">{transaction.method}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4 text-sm dark:text-gray-300">{transaction.date}</td>
                                                    <td className="py-3 px-4 text-right">
                                                        <Link
                                                            href="#"
                                                            className="px-3 py-1.5 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-heading dark:text-white rounded text-sm transition-colors"
                                                        >
                                                            Details
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Right sidebar: Transaction Details (3 cols) */}
                            <aside className="xl:col-span-3">
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 min-h-full">
                                    <h6 className="font-quicksand font-bold text-heading dark:text-white mb-4">Transaction Details</h6>
                                    <hr className="mb-4 border-gray-200 dark:border-gray-600" />

                                    <div className="space-y-4">
                                        <div>
                                            <h6 className="text-sm font-semibold text-heading dark:text-white mb-1">Supplier:</h6>
                                            <p className="text-sm text-body dark:text-gray-300">{transactionDetails.supplier}</p>
                                        </div>

                                        <div>
                                            <h6 className="text-sm font-semibold text-heading dark:text-white mb-1">Date:</h6>
                                            <p className="text-sm text-body dark:text-gray-300">{transactionDetails.date}</p>
                                        </div>

                                        <div>
                                            <h6 className="text-sm font-semibold text-heading dark:text-white mb-1">Billing address</h6>
                                            <p className="text-sm text-body dark:text-gray-300">{transactionDetails.billingAddress}</p>
                                        </div>

                                        <div>
                                            <h6 className="text-sm font-semibold text-heading dark:text-white mb-1">VAT ID:</h6>
                                            <p className="text-sm text-body dark:text-gray-300">{transactionDetails.vatId}</p>
                                        </div>

                                        <div>
                                            <h6 className="text-sm font-semibold text-heading dark:text-white mb-1">Email:</h6>
                                            <p className="text-sm text-body dark:text-gray-300">{transactionDetails.email}</p>
                                        </div>

                                        <div>
                                            <h6 className="text-sm font-semibold text-heading dark:text-white mb-2">Item purchased:</h6>
                                            <div className="space-y-1">
                                                {transactionDetails.items.map((item, index) => (
                                                    <Link
                                                        key={index}
                                                        href={item.link}
                                                        className="flex items-center gap-1 text-sm text-brand hover:text-brand-dark"
                                                    >
                                                        {item.name}
                                                        <span className="material-icons text-sm">launch</span>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-sm text-body dark:text-gray-300">Payment: {transactionDetails.paymentMethod}</p>
                                            <p className="text-2xl font-bold text-heading dark:text-white mt-1">${transactionDetails.total.toFixed(2)}</p>
                                        </div>

                                        <hr className="border-gray-200 dark:border-gray-600" />

                                        <Link
                                            href="#"
                                            className="block w-full px-4 py-2.5 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-center text-heading dark:text-white rounded-lg font-medium text-sm transition-colors"
                                        >
                                            Download receipt
                                        </Link>
                                    </div>
                                </div>
                            </aside>
                        </div>
                    </div>
                </div>

                {/* Pagination */}
                <div className="mt-8">
                    <nav>
                        <ul className="flex items-center gap-2">
                            <li>
                                <Link
                                    href="#"
                                    className="px-3 py-2 bg-brand text-white rounded-lg text-sm font-medium"
                                >
                                    01
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="px-3 py-2 bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-sm dark:text-white"
                                >
                                    02
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="px-3 py-2 bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-sm dark:text-white"
                                >
                                    03
                                </Link>
                            </li>
                            <li>
                                <span className="px-3 py-2 text-gray-400 dark:text-gray-500 text-sm">...</span>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="px-3 py-2 bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-sm dark:text-white"
                                >
                                    16
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="px-3 py-2 bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-sm dark:text-white"
                                >
                                    <span className="material-icons text-sm">chevron_right</span>
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            </section>
        </AdminLayout>
    );
}
