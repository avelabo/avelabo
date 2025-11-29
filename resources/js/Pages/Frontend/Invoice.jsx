import { Head, Link } from '@inertiajs/react';

export default function Invoice() {
    const invoiceItems = [
        { name: 'Field Roast Chao Cheese Creamy Original', sku: 'FWM15VKT', unitPrice: 10.99, quantity: 1, amount: 10.99 },
        { name: 'Blue Diamond Almonds Lightly Salted', sku: 'FWM15VKT', unitPrice: 20.00, quantity: 3, amount: 60.00 },
        { name: 'Fresh Organic Mustard Leaves Bell Pepper', sku: 'KVM15VK', unitPrice: 640.00, quantity: 1, amount: 640.00 },
        { name: 'All Natural Italian-Style Chicken Meatballs', sku: '98HFG', unitPrice: 240.00, quantity: 1, amount: 240.00 },
    ];

    const subtotal = 950.99;
    const tax = 85.99;
    const grandTotal = 1036.98;

    const handlePrint = () => {
        window.print();
    };

    const handleDownload = () => {
        // In a real implementation, this would generate a PDF
        console.log('Downloading invoice...');
    };

    return (
        <>
            <Head title="Invoice" />

            <style>{`
                @media print {
                    .no-print {
                        display: none !important;
                    }
                    body {
                        background: white !important;
                    }
                    .invoice-wrapper {
                        box-shadow: none !important;
                        margin: 0 !important;
                        padding: 20px !important;
                    }
                }
            `}</style>

            <div className="font-lato text-sm text-gray-500 leading-6 bg-gray-50 min-h-screen py-8">
                {/* Back to Home Link */}
                <div className="no-print max-w-4xl mx-auto px-4 mb-6">
                    <Link href="/" className="inline-flex items-center gap-2 text-heading hover:text-brand transition-colors font-semibold">
                        <i className="fi fi-rs-home"></i> Homepage
                    </Link>
                </div>

                {/* Invoice Container */}
                <div className="max-w-4xl mx-auto px-4">
                    <div className="invoice-wrapper bg-white rounded-2xl shadow-xl overflow-hidden">
                        {/* Invoice Content */}
                        <div className="p-8 lg:p-12">
                            {/* Invoice Header */}
                            <div className="relative mb-8">
                                {/* Invoice Icon Badge */}
                                <div className="absolute -top-4 -right-4 w-24 h-24 bg-brand/10 rounded-full flex items-center justify-center">
                                    <img src="/images/frontend/icons/icon-invoice.svg" alt="Invoice" className="w-12 h-12" />
                                </div>

                                {/* Logo and Title Row */}
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                                    <div>
                                        <Link href="/">
                                            <img src="/images/frontend/logo.svg" alt="Nest Logo" className="h-12" />
                                        </Link>
                                    </div>
                                    <h1 className="text-3xl lg:text-4xl font-quicksand font-bold text-heading">INVOICE</h1>
                                </div>

                                {/* Address Row */}
                                <div className="flex flex-col md:flex-row md:justify-between gap-4 text-sm">
                                    <div className="text-gray-500">
                                        205 North, Suite 810, Chicago, USA<br />
                                        <abbr title="Phone" className="no-underline">Phone:</abbr> (+123) 456-7890
                                    </div>
                                    <div className="md:text-right">
                                        <strong className="text-brand">Webz Poland</strong><br />
                                        Madalinskiego 871-101 Szczecin, Poland<br />
                                        <abbr title="Email" className="no-underline">Email:</abbr> info@webz.com.pl
                                    </div>
                                </div>

                                {/* Invoice Details Row */}
                                <div className="mt-6 pt-4 border-t border-gray-200">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                        <div>
                                            <strong className="text-brand">Invoice No:</strong> 789654
                                        </div>
                                        <div>
                                            <strong className="text-brand">Issue Date:</strong> 20 April, 2025
                                        </div>
                                        <div>
                                            <strong className="text-brand">Payment Method:</strong> Credit Card
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Invoice Table */}
                            <div className="mb-8 overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-brand text-white">
                                            <th className="text-left py-4 px-4 rounded-tl-lg font-quicksand font-bold">Item</th>
                                            <th className="text-center py-4 px-4 font-quicksand font-bold">Unit Price</th>
                                            <th className="text-center py-4 px-4 font-quicksand font-bold">Quantity</th>
                                            <th className="text-right py-4 px-4 rounded-tr-lg font-quicksand font-bold">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {invoiceItems.map((item, index) => (
                                            <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                                                <td className="py-4 px-4">
                                                    <div>
                                                        <span className="text-heading font-semibold block">{item.name}</span>
                                                        <small className="text-gray-400">SKU: {item.sku}</small>
                                                    </div>
                                                </td>
                                                <td className="text-center py-4 px-4">${item.unitPrice.toFixed(2)}</td>
                                                <td className="text-center py-4 px-4">{item.quantity}</td>
                                                <td className="text-right py-4 px-4 font-semibold">${item.amount.toFixed(2)}</td>
                                            </tr>
                                        ))}
                                        {/* Totals */}
                                        <tr className="bg-gray-50">
                                            <td colSpan="3" className="text-right py-3 px-4 font-semibold text-heading">SubTotal</td>
                                            <td className="text-right py-3 px-4 font-semibold">${subtotal.toFixed(2)}</td>
                                        </tr>
                                        <tr className="bg-gray-50">
                                            <td colSpan="3" className="text-right py-3 px-4 font-semibold text-heading">Tax</td>
                                            <td className="text-right py-3 px-4 font-semibold">${tax.toFixed(2)}</td>
                                        </tr>
                                        <tr className="bg-brand/10">
                                            <td colSpan="3" className="text-right py-4 px-4 font-bold text-heading text-base">Grand Total</td>
                                            <td className="text-right py-4 px-4 font-bold text-brand text-lg">${grandTotal.toFixed(2)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* Invoice Bottom Section */}
                            <div className="border-t border-gray-200 pt-8">
                                <div className="flex flex-col md:flex-row md:justify-between gap-6 mb-8">
                                    {/* Invoice Info */}
                                    <div>
                                        <h6 className="font-quicksand font-bold text-heading mb-3">Invoice Info</h6>
                                        <p className="text-sm text-gray-500">
                                            <strong className="text-heading">Issue date:</strong> 20 March, 2025<br />
                                            <strong className="text-heading">Invoice To:</strong> NestMart Inc<br />
                                            <strong className="text-heading">Swift Code:</strong> BFTV VNVXS
                                        </p>
                                    </div>
                                    {/* Total Amount */}
                                    <div className="md:text-right">
                                        <h6 className="font-quicksand font-bold text-heading mb-3">Total Amount</h6>
                                        <h3 className="text-3xl font-quicksand font-bold text-brand mb-1">${grandTotal.toFixed(2)}</h3>
                                        <p className="text-sm text-gray-400">Taxes Included</p>
                                    </div>
                                </div>

                                {/* Note */}
                                <div className="text-center border-t border-gray-200 pt-6">
                                    <p className="text-sm text-gray-400">
                                        <strong>Note:</strong> This is computer generated receipt and does not require physical signature.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="no-print bg-gray-50 px-8 py-6 flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={handlePrint}
                                className="inline-flex items-center justify-center gap-2 bg-brand hover:bg-brand-dark text-white font-bold py-3 px-8 rounded-lg transition-colors hover:-translate-y-0.5 transform duration-300"
                            >
                                <i className="fi fi-rs-print"></i>
                                Print
                            </button>
                            <button
                                onClick={handleDownload}
                                className="inline-flex items-center justify-center gap-2 bg-heading hover:bg-gray-700 text-white font-bold py-3 px-8 rounded-lg transition-colors hover:-translate-y-0.5 transform duration-300"
                            >
                                <i className="fi fi-rs-download"></i>
                                Download
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
