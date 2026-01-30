import { Head, Link } from '@inertiajs/react';
import FrontendLayout from '@/Layouts/FrontendLayout';

export default function PurchaseGuide({ pageContent = {} }) {
    const content = pageContent.content || {};

    const hero = content.hero || {
        title: 'How to Shop on Avelabo',
        subtitle: 'Everything you need to know about ordering, paying, and receiving your products.',
    };

    const steps = content.steps || [
        {
            number: '01',
            title: 'Create an Account',
            description: 'Sign up with your email and phone number. You can also shop as a guest, but an account lets you track orders and save favorites.',
            tip: 'Use a phone number you check regularly. We\'ll send order updates via SMS.',
        },
        {
            number: '02',
            title: 'Browse & Search',
            description: 'Explore categories, use search, or filter by price and brand. Every product page shows detailed descriptions, photos, and customer reviews.',
            tip: 'Add items to your wishlist to compare later or wait for price drops.',
        },
        {
            number: '03',
            title: 'Add to Cart',
            description: 'Click "Add to Cart" on any product. Adjust quantities in your cart before checkout. Items stay in your cart even if you leave the site.',
            tip: 'Check for coupon codes before checkout. We often run promotions.',
        },
        {
            number: '04',
            title: 'Checkout & Pay',
            description: 'Enter your delivery address and choose your payment method. We accept Airtel Money, TNM Mpamba, and card payments.',
            tip: 'Double-check your phone number. Payment prompts are sent via SMS.',
        },
        {
            number: '05',
            title: 'Track Your Order',
            description: 'Receive SMS updates at each stage: order confirmed, dispatched, and out for delivery. Track in real-time from your account.',
            tip: 'The tracking page shows your delivery person\'s contact info.',
        },
        {
            number: '06',
            title: 'Receive Delivery',
            description: 'Our courier brings your order to your door. Inspect the product before accepting. Pay on delivery if you chose that option.',
            tip: 'If anything looks wrong, you can refuse the delivery. No questions asked.',
        },
    ];

    const paymentMethods = content.paymentMethods || [
        {
            name: 'Airtel Money',
            description: 'Pay directly from your Airtel Money wallet. You\'ll receive an authorization prompt on your phone.',
        },
        {
            name: 'TNM Mpamba',
            description: 'Use your Mpamba account for quick, secure payment. Confirm with your PIN when prompted.',
        },
        {
            name: 'Card Payment',
            description: 'Visa and Mastercard accepted. Transactions are processed through secure, PCI-compliant gateways.',
        },
        {
            name: 'Pay on Delivery',
            description: 'Available in select areas. Pay the delivery person in cash or mobile money when you receive your order.',
        },
    ];

    const faqs = content.faqs || [
        {
            question: 'How long does delivery take?',
            answer: 'Delivery times vary by location. Orders to major cities (Lilongwe, Blantyre, Mzuzu) typically arrive within 2-5 business days. Rural areas may take 5-10 business days.',
        },
        {
            question: 'Can I change my order after placing it?',
            answer: 'You can cancel or modify orders within 1 hour of placing them. After that, contact support and we\'ll help if the order hasn\'t been dispatched yet.',
        },
        {
            question: 'What if I\'m not home for delivery?',
            answer: 'The delivery person will call you before arriving. You can arrange a specific time or designate someone else to receive it.',
        },
        {
            question: 'How do returns work?',
            answer: 'If a product is defective or not as described, contact us within 7 days. We\'ll arrange pickup and provide a full refund or replacement.',
        },
        {
            question: 'Are prices in MWK?',
            answer: 'Yes, all prices are displayed in Malawian Kwacha. You can also view prices in other currencies using the currency selector.',
        },
    ];

    return (
        <FrontendLayout>
            <Head title="Purchase Guide" />

            {/* Breadcrumb */}
            <div className="border-b border-border-light">
                <div className="max-w-6xl mx-auto px-6 py-4">
                    <nav className="flex items-center gap-2 text-sm">
                        <Link href="/" className="text-muted hover:text-heading transition-colors">Home</Link>
                        <span className="text-border-dark">/</span>
                        <span className="text-heading font-medium">Purchase Guide</span>
                    </nav>
                </div>
            </div>

            {/* Hero Section */}
            <section className="py-12 lg:py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-heading leading-tight tracking-tight mb-6">
                                {hero.title}
                            </h1>
                            <p className="text-xl text-body leading-relaxed mb-6">
                                {hero.subtitle}
                            </p>
                            <Link
                                href={route('shop')}
                                className="inline-flex items-center gap-2 px-8 py-4 bg-heading text-white font-medium rounded-xl hover:bg-brand-dark transition-colors"
                            >
                                Start Shopping
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                        </div>
                        <div className="flex justify-center lg:justify-end">
                            <img
                                src="/images/labos/mrs-labo-gift-bag.png"
                                alt="Mrs. Labo with shopping bag"
                                className="w-56 lg:w-72 h-auto"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Steps Section */}
            <section className="border-t border-border-light">
                <div className="max-w-6xl mx-auto px-6">
                    {/* Section Header */}
                    <div className="py-10 border-b border-border-light">
                        <h2 className="text-sm uppercase tracking-widest text-muted mb-3">Step by Step</h2>
                        <div className="w-12 h-0.5 bg-heading rounded-full"></div>
                    </div>

                    {/* Steps */}
                    <div className="divide-y divide-border-light">
                        {steps.map((step, index) => (
                            <div key={index} className="py-10 lg:py-12">
                                <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
                                    <div className="lg:col-span-2">
                                        <span className="text-5xl lg:text-6xl font-bold text-border-light">{step.number}</span>
                                    </div>
                                    <div className="lg:col-span-4">
                                        <h3 className="text-xl lg:text-2xl font-bold text-heading mb-4">{step.title}</h3>
                                    </div>
                                    <div className="lg:col-span-6">
                                        <p className="text-lg text-body leading-relaxed mb-4">{step.description}</p>
                                        <p className="text-sm text-muted border-l-2 border-border-light pl-4 rounded">
                                            <span className="font-medium text-heading">Tip:</span> {step.tip}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Payment Methods */}
            <section className="border-t border-border-light bg-surface-raised py-12 lg:py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-10">
                        <h2 className="text-sm uppercase tracking-widest text-muted mb-3">Payment Options</h2>
                        <div className="w-12 h-0.5 bg-heading mx-auto rounded-full mb-6"></div>
                        <p className="text-2xl lg:text-3xl font-bold text-heading max-w-2xl mx-auto">
                            Pay the way that works for you.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        {paymentMethods.map((method, index) => (
                            <div key={index} className="bg-surface rounded-2xl border border-border-light p-6">
                                <h3 className="text-lg font-bold text-heading mb-3">{method.name}</h3>
                                <p className="text-body leading-relaxed">{method.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQs Section */}
            <section className="py-12 lg:py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
                        <div className="lg:col-span-4">
                            <h2 className="text-sm uppercase tracking-widest text-muted mb-3">Common Questions</h2>
                            <div className="w-12 h-0.5 bg-heading rounded-full mb-6"></div>
                            <p className="text-body leading-relaxed mb-6">
                                Can't find what you're looking for? Contact our support team for help.
                            </p>
                            <Link
                                href={route('contact')}
                                className="inline-flex items-center gap-2 text-heading font-medium hover:text-muted transition-colors"
                            >
                                Contact Support
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                        </div>
                        <div className="lg:col-span-8">
                            <div className="divide-y divide-border-light">
                                {faqs.map((faq, index) => (
                                    <div key={index} className="py-6 first:pt-0 last:pb-0">
                                        <h3 className="text-lg font-bold text-heading mb-3">{faq.question}</h3>
                                        <p className="text-body leading-relaxed">{faq.answer}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-12 lg:py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="bg-heading rounded-3xl p-8 lg:p-10">
                        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                            <div className="flex items-center gap-6">
                                <img
                                    src="/images/labos/mr-mrs-labo-together-gifts.png"
                                    alt="Mr. and Mrs. Labo"
                                    className="hidden md:block w-28 lg:w-36 h-auto"
                                />
                                <div className="text-white">
                                    <h2 className="text-2xl lg:text-3xl font-bold mb-2">
                                        Ready to start shopping?
                                    </h2>
                                    <p className="text-white/70">
                                        Browse thousands of products from verified vendors.
                                    </p>
                                </div>
                            </div>
                            <Link
                                href={route('shop')}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-heading font-medium rounded-xl hover:bg-surface-raised transition-colors whitespace-nowrap"
                            >
                                Browse Products
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </FrontendLayout>
    );
}
