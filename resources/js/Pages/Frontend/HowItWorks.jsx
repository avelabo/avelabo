import { Head, Link } from '@inertiajs/react';
import FrontendLayout from '@/Layouts/FrontendLayout';

export default function HowItWorks({ pageContent = {} }) {
    const content = pageContent.content || {};

    const hero = content.hero || {
        title: 'How Avelabo Works',
        subtitle: 'From vendors worldwide to your doorstep: here\'s the journey your products take.',
    };

    const buyerSteps = content.buyerSteps || [
        {
            number: '01',
            title: 'Browse & Discover',
            description: 'Explore thousands of quality products from verified vendors. Filter by category, price, or brand to find exactly what you need.',
            detail: 'Our catalog features products from international and local vendors, all curated for Malawian customers.',
        },
        {
            number: '02',
            title: 'Add to Cart & Checkout',
            description: 'Select your items, review your cart, and proceed to checkout. Pay securely with mobile money (Airtel Money, TNM Mpamba) or card.',
            detail: 'All prices include delivery to major cities. No hidden fees.',
        },
        {
            number: '03',
            title: 'Track Your Order',
            description: 'Receive SMS updates at every stage. Track your order in real-time from your account dashboard.',
            detail: 'From order confirmation to dispatch to delivery, you\'ll always know where your package is.',
        },
        {
            number: '04',
            title: 'Receive & Enjoy',
            description: 'A local Avelabo seller delivers your order to your doorstep. Inspect before accepting, and enjoy your purchase.',
            detail: 'Questions after delivery? Our support team is just a message away.',
        },
    ];

    const sellerSteps = content.sellerSteps || [
        {
            number: '01',
            title: 'Apply to Sell',
            description: 'Submit your seller application with your business details. We review applications within 24-48 hours.',
        },
        {
            number: '02',
            title: 'Set Up Your Store',
            description: 'Upload your product catalog, set prices, and configure your seller profile. Our team can help you get started.',
        },
        {
            number: '03',
            title: 'Receive Orders',
            description: 'When customers order your products, you get notified. Prepare orders for our courier network to collect.',
        },
        {
            number: '04',
            title: 'Get Paid',
            description: 'We handle delivery and payment collection. You receive your earnings regularly to your account.',
        },
    ];

    const uniquePoints = content.uniquePoints || [
        {
            title: 'Open to All Sellers',
            description: 'International suppliers and local Malawian businesses alike can sell on our platform.',
        },
        {
            title: 'Vetted Courier Network',
            description: 'Products from anywhere, delivered reliably by our trusted courier partners.',
        },
        {
            title: 'Verified Quality',
            description: 'Every seller is vetted. Products are inspected at our distribution centers.',
        },
        {
            title: 'Fair Pricing',
            description: 'Our transparent model means sellers and customers all win.',
        },
    ];

    return (
        <FrontendLayout>
            <Head title="How It Works" />

            {/* Breadcrumb */}
            <div className="border-b border-border-light">
                <div className="max-w-6xl mx-auto px-6 py-4">
                    <nav className="flex items-center gap-2 text-sm">
                        <Link href="/" className="text-muted hover:text-heading transition-colors">Home</Link>
                        <span className="text-border-dark">/</span>
                        <span className="text-heading font-medium">How It Works</span>
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
                            <p className="text-xl text-body leading-relaxed">
                                {hero.subtitle}
                            </p>
                        </div>
                        <div className="flex justify-center lg:justify-end">
                            <img
                                src="/images/labos/mr-labo-tablet.png"
                                alt="Mr. Labo with tablet"
                                className="w-56 lg:w-72 h-auto"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* For Buyers Section */}
            <section className="border-t border-border-light">
                <div className="max-w-6xl mx-auto px-6">
                    {/* Section Header */}
                    <div className="py-10 border-b border-border-light">
                        <div className="flex items-center gap-4">
                            <span className="text-xs font-medium text-white bg-heading px-3 py-1 rounded-lg">FOR BUYERS</span>
                            <h2 className="text-2xl lg:text-3xl font-bold text-heading">Shopping Made Simple</h2>
                        </div>
                    </div>

                    {/* Steps */}
                    <div className="divide-y divide-border-light">
                        {buyerSteps.map((step, index) => (
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
                                        <p className="text-muted">{step.detail}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Buyer CTA */}
                    <div className="py-10 border-t border-border-light">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                            <p className="text-lg text-heading font-medium">Ready to start shopping?</p>
                            <Link
                                href={route('shop')}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-heading text-white font-medium rounded-xl hover:bg-brand-dark transition-colors"
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

            {/* For Sellers Section */}
            <section className="bg-surface-raised border-t border-border-light">
                <div className="max-w-6xl mx-auto px-6">
                    {/* Section Header */}
                    <div className="py-10 border-b border-border-light">
                        <div className="flex items-center gap-4">
                            <span className="text-xs font-medium text-heading bg-brand-2 px-3 py-1 rounded-lg">FOR SELLERS</span>
                            <h2 className="text-2xl lg:text-3xl font-bold text-heading">Sell to All of Malawi</h2>
                        </div>
                    </div>

                    {/* Steps Grid */}
                    <div className="py-10 lg:py-12">
                        <div className="grid md:grid-cols-2 gap-6">
                            {sellerSteps.map((step, index) => (
                                <div key={index} className="bg-surface rounded-2xl p-6 border border-border-light relative pl-20">
                                    <span className="absolute left-6 top-6 text-4xl font-bold text-border-dark">{step.number}</span>
                                    <h3 className="text-lg font-bold text-heading mb-3">{step.title}</h3>
                                    <p className="text-body leading-relaxed">{step.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Seller CTA */}
                    <div className="py-10 border-t border-border-light">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                            <p className="text-lg text-heading font-medium">Want to sell on Avelabo?</p>
                            <Link
                                href={route('vendor.guide')}
                                className="inline-flex items-center gap-2 px-6 py-3 border border-heading text-heading font-medium rounded-xl hover:bg-heading hover:text-white transition-colors"
                            >
                                Learn More
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* What Makes Us Different */}
            <section className="py-12 lg:py-16 border-t border-border-light">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 mb-10">
                        <div className="lg:col-span-5">
                            <h2 className="text-sm uppercase tracking-widest text-muted mb-3">What Makes Us Different</h2>
                            <div className="w-12 h-0.5 bg-heading rounded-full mb-6"></div>
                            <p className="text-2xl lg:text-3xl font-bold text-heading leading-snug">
                                A marketplace built for Malawi, not adapted for it.
                            </p>
                        </div>
                        <div className="lg:col-span-7">
                            <div className="grid sm:grid-cols-2 gap-4">
                                {uniquePoints.map((point, index) => (
                                    <div key={index} className="bg-surface-raised rounded-2xl p-6 border border-border-light">
                                        <h3 className="text-heading font-bold mb-2">{point.title}</h3>
                                        <p className="text-body leading-relaxed">{point.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Visual with Mascots */}
                    <div className="bg-surface-raised rounded-3xl border border-border-light p-8 lg:p-10 flex flex-col lg:flex-row items-center justify-between gap-8">
                        <div className="flex items-center gap-6">
                            <img
                                src="/images/labos/mrs-labo-jumping.png"
                                alt="Mrs. Labo jumping"
                                className="w-24 lg:w-32 h-auto"
                            />
                            <div>
                                <p className="text-lg font-medium text-heading mb-1">Have questions?</p>
                                <p className="text-muted">We're here to help you understand how Avelabo works.</p>
                            </div>
                        </div>
                        <Link
                            href={route('contact')}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-heading text-white font-medium rounded-xl hover:bg-brand-dark transition-colors whitespace-nowrap"
                        >
                            Contact Us
                        </Link>
                    </div>
                </div>
            </section>
        </FrontendLayout>
    );
}
