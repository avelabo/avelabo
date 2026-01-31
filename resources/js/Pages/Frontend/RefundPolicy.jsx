import { Head, Link, usePage } from '@inertiajs/react';
import FrontendLayout from '@/Layouts/FrontendLayout';

export default function RefundPolicy({ pageContent = {} }) {
    const { siteSettings } = usePage().props;
    const settings = siteSettings || {};
    const supportEmail = settings.site_support_email || 'support@avelabo.com';
    const siteName = settings.site_name || 'Avelabo';

    const content = pageContent.content || {};
    const lastUpdated = content.last_updated || 'January 2025';

    return (
        <FrontendLayout>
            <Head title="Refund Policy" />

            {/* Breadcrumb */}
            <div className="border-b border-border-light">
                <div className="max-w-6xl mx-auto px-6 py-4">
                    <nav className="flex items-center gap-2 text-sm">
                        <Link href="/" className="text-muted hover:text-heading transition-colors">Home</Link>
                        <span className="text-border-dark">/</span>
                        <span className="text-heading font-medium">Refund Policy</span>
                    </nav>
                </div>
            </div>

            {/* Hero Section */}
            <section className="py-12 lg:py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-heading leading-tight tracking-tight mb-6">
                            Refund Policy
                        </h1>
                        <p className="text-xl md:text-2xl text-body leading-relaxed">
                            We want you to be happy with every purchase. Here's how refunds work at {siteName}.
                        </p>
                        <p className="text-sm text-muted mt-4">Last updated: {lastUpdated}</p>
                    </div>
                </div>
            </section>

            {/* Important Notice */}
            <section className="border-t border-border-light bg-amber-50 py-8">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex gap-4 items-start">
                        <div className="shrink-0 w-10 h-10 bg-amber-100 border border-amber-200 rounded-xl flex items-center justify-center">
                            <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-bold text-amber-800 mb-1">Please Read Carefully</h3>
                            <p className="text-amber-700 text-sm leading-relaxed">
                                As a small business importing products from international suppliers, we have specific refund limitations. We cannot simply refund all purchases, but we are committed to fair treatment when genuine issues arise.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Approach */}
            <section className="py-12 lg:py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid lg:grid-cols-12 gap-8 lg:gap-16">
                        <div className="lg:col-span-4">
                            <h2 className="text-sm uppercase tracking-widest text-muted mb-3">Our Approach</h2>
                            <div className="w-12 h-0.5 bg-heading rounded-full mb-6"></div>
                            <img
                                src="/images/labos/mr-labo-empty-hands.png"
                                alt="Mr. Labo"
                                className="hidden lg:block w-32 h-auto"
                            />
                        </div>
                        <div className="lg:col-span-8">
                            <p className="text-lg text-body leading-relaxed mb-4">
                                We believe in treating customers fairly while running a sustainable business. Unlike large retailers, we import products specifically for orders and have limited ability to absorb returns and refunds.
                            </p>
                            <p className="text-lg text-body leading-relaxed">
                                That said, we stand behind the quality of products on our platform and will always work with you to resolve genuine issues.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* When You Can Get a Refund */}
            <section className="border-y border-border-light bg-heading text-white py-12 lg:py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-10">
                        <h2 className="text-sm uppercase tracking-widest text-white/60 mb-3">When You Can Get a Refund</h2>
                        <div className="w-12 h-0.5 bg-white/30 mx-auto rounded-full mb-6"></div>
                        <p className="text-2xl lg:text-3xl font-bold text-white max-w-2xl mx-auto">
                            Full refunds are available in these situations
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                            {
                                title: 'Wrong Product Delivered',
                                desc: 'If you receive a product different from what you ordered, we will arrange a pickup and issue a full refund or send the correct item.',
                                icon: (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                    </svg>
                                )
                            },
                            {
                                title: 'Defective on Arrival',
                                desc: 'Products that are faulty or damaged when delivered qualify for a full refund. Report within 48 hours with photos.',
                                icon: (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                )
                            },
                            {
                                title: 'Order Never Arrived',
                                desc: 'If your order is lost and cannot be located or recovered, you are entitled to a full refund.',
                                icon: (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                )
                            },
                            {
                                title: 'Order Cancelled Before Shipping',
                                desc: 'If you cancel before the product ships from our supplier or warehouse, you receive a full refund.',
                                icon: (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                )
                            },
                            {
                                title: 'Significantly Different',
                                desc: 'If a product is materially different from its description (not minor variations), we will process a refund.',
                                icon: (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )
                            },
                            {
                                title: 'Seller Did Not Fulfill',
                                desc: 'If a seller fails to fulfill an order within a reasonable timeframe, you can request a full refund.',
                                icon: (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                )
                            },
                        ].map((item, index) => (
                            <div key={index} className="bg-white/5 rounded-2xl p-5 border border-white/10">
                                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-4 text-white">
                                    {item.icon}
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                                <p className="text-white/70 leading-relaxed text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* When Refunds Are Not Available */}
            <section className="py-12 lg:py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
                        <div className="lg:col-span-5">
                            <h2 className="text-sm uppercase tracking-widest text-muted mb-3">When Refunds Are Limited</h2>
                            <div className="w-12 h-0.5 bg-heading rounded-full mb-6"></div>
                            <p className="text-xl text-heading font-medium mb-4">
                                We cannot offer refunds for:
                            </p>
                            <p className="text-body leading-relaxed">
                                These limitations exist because we import products specifically for orders and bear significant costs for international shipping and customs.
                            </p>
                        </div>
                        <div className="lg:col-span-7">
                            <div className="space-y-4">
                                {[
                                    { title: 'Change of Mind', desc: 'If you simply change your mind or no longer want the product after ordering, we cannot offer a refund. Please review your order carefully before confirming.' },
                                    { title: 'Product Already Shipped', desc: 'Once a product has shipped from our international suppliers, cancellation and refund become difficult. Shipping costs are non-recoverable.' },
                                    { title: 'Minor Variations', desc: 'Slight differences in color, packaging, or minor details between the product image and actual product do not qualify for refunds.' },
                                    { title: 'Used or Damaged by Customer', desc: 'Products that have been used, altered, or damaged after delivery are not eligible for refunds.' },
                                    { title: 'Buyer\'s Remorse on Pricing', desc: 'If a product price drops after purchase or you find it cheaper elsewhere, this does not qualify for a refund.' },
                                ].map((item, index) => (
                                    <div key={index} className="bg-surface-raised rounded-2xl p-6 border border-border-light">
                                        <div className="flex items-start gap-4">
                                            <div className="shrink-0 w-8 h-8 bg-red-100 border border-red-200 rounded-lg flex items-center justify-center">
                                                <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-heading mb-1">{item.title}</h3>
                                                <p className="text-body leading-relaxed">{item.desc}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Partial Refunds */}
            <section className="border-t border-border-light bg-surface-raised py-12 lg:py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid lg:grid-cols-12 gap-8 lg:gap-16">
                        <div className="lg:col-span-4">
                            <h2 className="text-sm uppercase tracking-widest text-muted mb-3">Partial Refunds</h2>
                            <div className="w-12 h-0.5 bg-heading rounded-full"></div>
                        </div>
                        <div className="lg:col-span-8">
                            <p className="text-lg text-body leading-relaxed mb-6">
                                In some situations, we may offer partial refunds:
                            </p>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {[
                                    { title: 'Late Delivery', desc: 'If delivery is significantly delayed beyond the promised timeframe, we may offer partial compensation.' },
                                    { title: 'Minor Defects', desc: 'Products with minor defects that don\'t affect functionality may receive a partial refund if you choose to keep them.' },
                                    { title: 'Cancelled After Processing', desc: 'Orders cancelled after processing but before international shipping may incur processing fees.' },
                                    { title: 'Return Shipping Costs', desc: 'For valid returns, we may deduct return shipping costs from the refund amount.' },
                                ].map((item, index) => (
                                    <div key={index} className="bg-surface rounded-xl p-5 border border-border-light">
                                        <h3 className="font-bold text-heading mb-2">{item.title}</h3>
                                        <p className="text-body text-sm leading-relaxed">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Refund Process */}
            <section className="py-12 lg:py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-10">
                        <h2 className="text-sm uppercase tracking-widest text-muted mb-3">Refund Process</h2>
                        <div className="w-12 h-0.5 bg-heading mx-auto rounded-full mb-6"></div>
                        <p className="text-2xl lg:text-3xl font-bold text-heading max-w-2xl mx-auto">
                            How to request a refund
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { step: '01', title: 'Contact Support', desc: 'Email us at ' + supportEmail + ' or use the help form within 48 hours of delivery.' },
                            { step: '02', title: 'Provide Details', desc: 'Include your order number, photos of any issues, and a clear description of the problem.' },
                            { step: '03', title: 'Review & Decision', desc: 'We review your request within 2-3 business days and communicate our decision.' },
                            { step: '04', title: 'Refund Processed', desc: 'Approved refunds are processed within 5-7 business days to your original payment method.' },
                        ].map((item, index) => (
                            <div key={index} className="bg-surface-raised rounded-2xl p-6 border border-border-light text-center">
                                <span className="text-4xl font-bold text-heading/10 block mb-3">{item.step}</span>
                                <h3 className="text-lg font-bold text-heading mb-2">{item.title}</h3>
                                <p className="text-body text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Refund Methods */}
            <section className="border-y border-border-light bg-surface-sunken py-12 lg:py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid lg:grid-cols-12 gap-8 lg:gap-16">
                        <div className="lg:col-span-4">
                            <h2 className="text-sm uppercase tracking-widest text-muted mb-3">Refund Methods</h2>
                            <div className="w-12 h-0.5 bg-heading rounded-full"></div>
                        </div>
                        <div className="lg:col-span-8">
                            <p className="text-lg text-body leading-relaxed mb-4">
                                Refunds are processed to the original payment method:
                            </p>
                            <ul className="space-y-3">
                                {[
                                    { method: 'Mobile Money', time: '1-3 business days', note: 'Airtel Money, TNM Mpamba' },
                                    { method: 'Card Payments', time: '5-10 business days', note: 'Depends on your bank' },
                                    { method: 'Store Credit', time: 'Immediate', note: 'Available for future purchases' },
                                ].map((item, index) => (
                                    <li key={index} className="flex items-center gap-4 p-4 bg-surface rounded-xl border border-border-light">
                                        <svg className="w-5 h-5 text-brand shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <div className="flex-1">
                                            <span className="font-bold text-heading">{item.method}</span>
                                            <span className="text-muted text-sm ml-2">({item.note})</span>
                                        </div>
                                        <span className="text-sm text-muted">{item.time}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Commitment */}
            <section className="py-12 lg:py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="bg-surface-raised rounded-3xl p-8 lg:p-12 border border-border-light">
                        <div className="grid lg:grid-cols-2 gap-8 items-center">
                            <div>
                                <h2 className="text-2xl lg:text-3xl font-bold text-heading mb-4">
                                    Our Commitment to You
                                </h2>
                                <p className="text-lg text-body leading-relaxed mb-4">
                                    We understand these policies may seem strict compared to large retailers. But we're a small business working hard to bring quality products to Malawi.
                                </p>
                                <p className="text-body leading-relaxed">
                                    When genuine problems arise, we will always work with you to find a fair solution. Our goal is your satisfaction, not avoiding responsibility.
                                </p>
                            </div>
                            <div className="flex justify-center lg:justify-end">
                                <img
                                    src="/images/labos/mr-mrs-labo-together-gifts.png"
                                    alt="Mr. and Mrs. Labo with gifts"
                                    className="w-40 lg:w-56 h-auto"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact CTA */}
            <section className="border-t border-border-light bg-heading text-white py-12 lg:py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center">
                        <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
                            Need to request a refund?
                        </h2>
                        <p className="text-white/70 mb-8 max-w-xl mx-auto">
                            Contact our support team with your order details and we'll review your request promptly.
                        </p>
                        <div className="flex flex-wrap justify-center gap-3">
                            <Link
                                href={route('help.support')}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-heading font-medium rounded-xl hover:bg-surface-raised transition-colors"
                            >
                                Submit Support Ticket
                            </Link>
                            <a
                                href={`mailto:${supportEmail}`}
                                className="inline-flex items-center gap-2 px-6 py-3 border border-white/30 text-white font-medium rounded-xl hover:bg-white/10 transition-colors"
                            >
                                Email {supportEmail}
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Related Policies */}
            <section className="py-12 lg:py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-8">
                        <h2 className="text-sm uppercase tracking-widest text-muted mb-3">Related Policies</h2>
                        <div className="w-12 h-0.5 bg-heading mx-auto rounded-full"></div>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Link href={route('return.policy')} className="bg-surface-raised rounded-xl p-5 border border-border-light hover:border-heading transition-colors group">
                            <h3 className="font-bold text-heading group-hover:text-brand transition-colors mb-1">Return Policy</h3>
                            <p className="text-sm text-muted">How to return products</p>
                        </Link>
                        <Link href={route('terms.conditions')} className="bg-surface-raised rounded-xl p-5 border border-border-light hover:border-heading transition-colors group">
                            <h3 className="font-bold text-heading group-hover:text-brand transition-colors mb-1">Terms & Conditions</h3>
                            <p className="text-sm text-muted">Rules for using our platform</p>
                        </Link>
                        <Link href={route('privacy.policy')} className="bg-surface-raised rounded-xl p-5 border border-border-light hover:border-heading transition-colors group">
                            <h3 className="font-bold text-heading group-hover:text-brand transition-colors mb-1">Privacy Policy</h3>
                            <p className="text-sm text-muted">How we handle your data</p>
                        </Link>
                        <Link href={route('help.support')} className="bg-surface-raised rounded-xl p-5 border border-border-light hover:border-heading transition-colors group">
                            <h3 className="font-bold text-heading group-hover:text-brand transition-colors mb-1">Help & Support</h3>
                            <p className="text-sm text-muted">Get assistance</p>
                        </Link>
                    </div>
                </div>
            </section>
        </FrontendLayout>
    );
}
