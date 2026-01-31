import { Head, Link, usePage } from '@inertiajs/react';
import FrontendLayout from '@/Layouts/FrontendLayout';

export default function ReturnPolicy({ pageContent = {} }) {
    const { siteSettings } = usePage().props;
    const settings = siteSettings || {};
    const supportEmail = settings.site_support_email || 'support@avelabo.com';
    const siteName = settings.site_name || 'Avelabo';

    const content = pageContent.content || {};
    const lastUpdated = content.last_updated || 'January 2025';

    return (
        <FrontendLayout>
            <Head title="Return Policy" />

            {/* Breadcrumb */}
            <div className="border-b border-border-light">
                <div className="max-w-6xl mx-auto px-6 py-4">
                    <nav className="flex items-center gap-2 text-sm">
                        <Link href="/" className="text-muted hover:text-heading transition-colors">Home</Link>
                        <span className="text-border-dark">/</span>
                        <span className="text-heading font-medium">Return Policy</span>
                    </nav>
                </div>
            </div>

            {/* Hero Section */}
            <section className="py-12 lg:py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-heading leading-tight tracking-tight mb-6">
                            Return Policy
                        </h1>
                        <p className="text-xl md:text-2xl text-body leading-relaxed">
                            Sometimes things don't work out. Here's how to return products to {siteName}.
                        </p>
                        <p className="text-sm text-muted mt-4">Last updated: {lastUpdated}</p>
                    </div>
                </div>
            </section>

            {/* Important Notice */}
            <section className="border-t border-border-light bg-blue-50 py-8">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex gap-4 items-start">
                        <div className="shrink-0 w-10 h-10 bg-blue-100 border border-blue-200 rounded-xl flex items-center justify-center">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-bold text-blue-800 mb-1">Inspect Before Accepting</h3>
                            <p className="text-blue-700 text-sm leading-relaxed">
                                We strongly encourage you to inspect all products at the time of delivery. If something is damaged or incorrect, you can refuse delivery right there. This saves time for everyone.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Return Window */}
            <section className="py-12 lg:py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid lg:grid-cols-12 gap-8 lg:gap-16">
                        <div className="lg:col-span-4">
                            <h2 className="text-sm uppercase tracking-widest text-muted mb-3">Return Window</h2>
                            <div className="w-12 h-0.5 bg-heading rounded-full mb-6"></div>
                            <div className="bg-heading text-white rounded-2xl p-6 text-center">
                                <span className="text-5xl font-bold block mb-2">7</span>
                                <span className="text-white/70">Days to Return</span>
                            </div>
                        </div>
                        <div className="lg:col-span-8">
                            <p className="text-lg text-body leading-relaxed mb-4">
                                You have <strong className="text-heading">7 days from delivery</strong> to initiate a return for eligible products. After this window, returns cannot be accepted except for manufacturing defects covered by warranty.
                            </p>
                            <div className="bg-surface-raised rounded-2xl p-6 border border-border-light">
                                <h3 className="font-bold text-heading mb-4">Important Deadlines</h3>
                                <ul className="space-y-3">
                                    <li className="flex gap-4">
                                        <span className="shrink-0 w-6 h-6 bg-brand/10 text-brand rounded-full flex items-center justify-center text-sm font-bold">1</span>
                                        <span className="text-body"><strong className="text-heading">Report within 48 hours</strong> for damaged or defective items</span>
                                    </li>
                                    <li className="flex gap-4">
                                        <span className="shrink-0 w-6 h-6 bg-brand/10 text-brand rounded-full flex items-center justify-center text-sm font-bold">2</span>
                                        <span className="text-body"><strong className="text-heading">Request within 7 days</strong> for all other eligible returns</span>
                                    </li>
                                    <li className="flex gap-4">
                                        <span className="shrink-0 w-6 h-6 bg-brand/10 text-brand rounded-full flex items-center justify-center text-sm font-bold">3</span>
                                        <span className="text-body"><strong className="text-heading">Ship within 3 days</strong> of return approval</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Eligible for Return */}
            <section className="border-y border-border-light bg-heading text-white py-12 lg:py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-10">
                        <h2 className="text-sm uppercase tracking-widest text-white/60 mb-3">Eligible for Return</h2>
                        <div className="w-12 h-0.5 bg-white/30 mx-auto rounded-full mb-6"></div>
                        <p className="text-2xl lg:text-3xl font-bold text-white max-w-2xl mx-auto">
                            Products that qualify for returns
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                            { title: 'Wrong Item Received', desc: 'You received a different product than what you ordered. Contact us immediately with photos.', icon: '📦' },
                            { title: 'Damaged in Transit', desc: 'Product arrived broken or damaged during shipping. Document with photos before opening fully.', icon: '💔' },
                            { title: 'Manufacturing Defect', desc: 'Product has a factory defect that affects functionality. Does not include cosmetic imperfections.', icon: '🔧' },
                            { title: 'Missing Parts', desc: 'Product is incomplete or missing components listed in the description.', icon: '🧩' },
                            { title: 'Not as Described', desc: 'Product is materially different from the listing (not minor variations in color/finish).', icon: '❌' },
                            { title: 'Sealed & Unused', desc: 'Unopened products in original packaging may be returned for select categories only.', icon: '📭' },
                        ].map((item, index) => (
                            <div key={index} className="bg-white/5 rounded-2xl p-5 border border-white/10">
                                <span className="text-2xl mb-3 block">{item.icon}</span>
                                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                                <p className="text-white/70 leading-relaxed text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Not Eligible for Return */}
            <section className="py-12 lg:py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
                        <div className="lg:col-span-5">
                            <h2 className="text-sm uppercase tracking-widest text-muted mb-3">Not Eligible for Return</h2>
                            <div className="w-12 h-0.5 bg-heading rounded-full mb-6"></div>
                            <p className="text-xl text-heading font-medium mb-4">
                                These items cannot be returned
                            </p>
                            <p className="text-body leading-relaxed mb-6">
                                For hygiene, safety, and practical reasons, certain products cannot be accepted for return once delivered.
                            </p>
                            <img
                                src="/images/labos/mr-labo-tablet.png"
                                alt="Mr. Labo"
                                className="hidden lg:block w-32 h-auto"
                            />
                        </div>
                        <div className="lg:col-span-7">
                            <div className="grid sm:grid-cols-2 gap-4">
                                {[
                                    { title: 'Personal Care Items', desc: 'Skincare, haircare, cosmetics, and hygiene products' },
                                    { title: 'Underwear & Intimates', desc: 'Undergarments, swimwear, and similar items' },
                                    { title: 'Opened Software', desc: 'Games, apps, or digital products with used codes' },
                                    { title: 'Perishable Goods', desc: 'Food items, flowers, and other perishables' },
                                    { title: 'Customized Products', desc: 'Items made to order or personalized' },
                                    { title: 'Hazardous Materials', desc: 'Items that cannot be returned by post' },
                                    { title: 'Used Products', desc: 'Items that show signs of use, wear, or washing' },
                                    { title: 'Without Packaging', desc: 'Items returned without original packaging and tags' },
                                ].map((item, index) => (
                                    <div key={index} className="bg-surface-raised rounded-xl p-4 border border-border-light">
                                        <div className="flex items-start gap-3">
                                            <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                            <div>
                                                <h3 className="font-bold text-heading text-sm">{item.title}</h3>
                                                <p className="text-muted text-xs">{item.desc}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Return Condition */}
            <section className="border-t border-border-light bg-surface-raised py-12 lg:py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid lg:grid-cols-12 gap-8 lg:gap-16">
                        <div className="lg:col-span-4">
                            <h2 className="text-sm uppercase tracking-widest text-muted mb-3">Return Condition</h2>
                            <div className="w-12 h-0.5 bg-heading rounded-full"></div>
                        </div>
                        <div className="lg:col-span-8">
                            <p className="text-lg text-body leading-relaxed mb-6">
                                For a return to be accepted, products must meet these conditions:
                            </p>
                            <ul className="space-y-3">
                                {[
                                    'Product must be in original, unused condition',
                                    'All original packaging, tags, and labels must be intact',
                                    'All accessories, manuals, and components must be included',
                                    'Product must not be washed, altered, or damaged by the customer',
                                    'For electronics: security seals must not be broken (where applicable)',
                                ].map((item, index) => (
                                    <li key={index} className="flex gap-4 p-4 bg-surface rounded-xl border border-border-light">
                                        <svg className="w-5 h-5 text-brand shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="text-heading">{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <p className="text-muted text-sm mt-4">
                                Returns that don't meet these conditions may be rejected or subject to a restocking fee.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Return Process */}
            <section className="py-12 lg:py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-10">
                        <h2 className="text-sm uppercase tracking-widest text-muted mb-3">Return Process</h2>
                        <div className="w-12 h-0.5 bg-heading mx-auto rounded-full mb-6"></div>
                        <p className="text-2xl lg:text-3xl font-bold text-heading max-w-2xl mx-auto">
                            How to return a product
                        </p>
                    </div>

                    <div className="relative">
                        {/* Desktop Connection Line */}
                        <div className="hidden lg:block absolute top-16 left-0 right-0 h-0.5 bg-border-light"></div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                {
                                    step: '1',
                                    title: 'Request Return',
                                    desc: 'Contact us via email or the support form with your order number and reason for return.',
                                    icon: (
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                        </svg>
                                    )
                                },
                                {
                                    step: '2',
                                    title: 'Get Approval',
                                    desc: 'We review your request and, if approved, send you return instructions within 1-2 business days.',
                                    icon: (
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    )
                                },
                                {
                                    step: '3',
                                    title: 'Ship the Product',
                                    desc: 'Pack the item securely and ship to the provided address within 3 days of approval.',
                                    icon: (
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                        </svg>
                                    )
                                },
                                {
                                    step: '4',
                                    title: 'Receive Refund',
                                    desc: 'Once we receive and inspect the item, your refund is processed within 5-7 business days.',
                                    icon: (
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    )
                                },
                            ].map((item, index) => (
                                <div key={index} className="relative">
                                    <div className="bg-surface-raised rounded-2xl p-6 border border-border-light text-center relative z-10">
                                        <div className="w-12 h-12 mx-auto bg-heading text-white flex items-center justify-center rounded-xl mb-4">
                                            {item.icon}
                                        </div>
                                        <span className="text-xs font-bold text-muted uppercase tracking-wider">Step {item.step}</span>
                                        <h3 className="text-lg font-bold text-heading mt-1 mb-2">{item.title}</h3>
                                        <p className="text-body text-sm leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Return Shipping */}
            <section className="border-y border-border-light bg-surface-sunken py-12 lg:py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid lg:grid-cols-12 gap-8 lg:gap-16">
                        <div className="lg:col-span-4">
                            <h2 className="text-sm uppercase tracking-widest text-muted mb-3">Return Shipping</h2>
                            <div className="w-12 h-0.5 bg-heading rounded-full"></div>
                        </div>
                        <div className="lg:col-span-8">
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="bg-surface rounded-xl p-5 border border-border-light">
                                    <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center mb-3">
                                        <svg className="w-5 h-5 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <h3 className="font-bold text-heading mb-2">We Cover Shipping If...</h3>
                                    <ul className="space-y-1 text-sm text-body">
                                        <li>• We sent the wrong item</li>
                                        <li>• Product arrived damaged</li>
                                        <li>• Product has manufacturing defect</li>
                                    </ul>
                                </div>
                                <div className="bg-surface rounded-xl p-5 border border-border-light">
                                    <div className="w-10 h-10 bg-muted/10 rounded-xl flex items-center justify-center mb-3">
                                        <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="font-bold text-heading mb-2">You Cover Shipping If...</h3>
                                    <ul className="space-y-1 text-sm text-body">
                                        <li>• Change of mind</li>
                                        <li>• Ordered wrong size/variant</li>
                                        <li>• Product didn't meet expectations</li>
                                    </ul>
                                </div>
                            </div>
                            <p className="text-muted text-sm mt-4">
                                We can arrange pickup in some areas. Contact support for options and pricing.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact CTA */}
            <section className="py-12 lg:py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="bg-surface-raised rounded-3xl border border-border-light p-8 lg:p-10 flex flex-col lg:flex-row items-center justify-between gap-8">
                        <div className="flex items-center gap-6">
                            <img
                                src="/images/labos/mrs-labo-gift-bag.png"
                                alt="Mrs. Labo"
                                className="w-24 lg:w-32 h-auto"
                            />
                            <div>
                                <p className="text-xl font-bold text-heading mb-1">Need to return something?</p>
                                <p className="text-body">Contact us at {supportEmail} with your order details.</p>
                            </div>
                        </div>
                        <Link
                            href={route('help.support')}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-heading text-white font-medium rounded-xl hover:bg-brand-dark transition-colors whitespace-nowrap"
                        >
                            Start Return Request
                        </Link>
                    </div>
                </div>
            </section>

            {/* Related Policies */}
            <section className="border-t border-border-light bg-surface-raised py-12 lg:py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-8">
                        <h2 className="text-sm uppercase tracking-widest text-muted mb-3">Related Policies</h2>
                        <div className="w-12 h-0.5 bg-heading mx-auto rounded-full"></div>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Link href={route('refund.policy')} className="bg-surface rounded-xl p-5 border border-border-light hover:border-heading transition-colors group">
                            <h3 className="font-bold text-heading group-hover:text-brand transition-colors mb-1">Refund Policy</h3>
                            <p className="text-sm text-muted">How refunds work</p>
                        </Link>
                        <Link href={route('terms.conditions')} className="bg-surface rounded-xl p-5 border border-border-light hover:border-heading transition-colors group">
                            <h3 className="font-bold text-heading group-hover:text-brand transition-colors mb-1">Terms & Conditions</h3>
                            <p className="text-sm text-muted">Rules for using our platform</p>
                        </Link>
                        <Link href={route('privacy.policy')} className="bg-surface rounded-xl p-5 border border-border-light hover:border-heading transition-colors group">
                            <h3 className="font-bold text-heading group-hover:text-brand transition-colors mb-1">Privacy Policy</h3>
                            <p className="text-sm text-muted">How we handle your data</p>
                        </Link>
                        <Link href={route('help.support')} className="bg-surface rounded-xl p-5 border border-border-light hover:border-heading transition-colors group">
                            <h3 className="font-bold text-heading group-hover:text-brand transition-colors mb-1">Help & Support</h3>
                            <p className="text-sm text-muted">Get assistance</p>
                        </Link>
                    </div>
                </div>
            </section>
        </FrontendLayout>
    );
}
