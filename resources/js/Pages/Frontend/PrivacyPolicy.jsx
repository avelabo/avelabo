import { Head, Link, usePage } from '@inertiajs/react';
import FrontendLayout from '@/Layouts/FrontendLayout';

export default function PrivacyPolicy({ pageContent = {} }) {
    const { siteSettings } = usePage().props;
    const settings = siteSettings || {};
    const supportEmail = settings.site_support_email || 'support@avelabo.com';
    const siteName = settings.site_name || 'Avelabo';

    const content = pageContent.content || {};
    const lastUpdated = content.last_updated || 'January 2025';

    return (
        <FrontendLayout>
            <Head title="Privacy Policy" />

            {/* Breadcrumb */}
            <div className="border-b border-border-light">
                <div className="max-w-6xl mx-auto px-6 py-4">
                    <nav className="flex items-center gap-2 text-sm">
                        <Link href="/" className="text-muted hover:text-heading transition-colors">Home</Link>
                        <span className="text-border-dark">/</span>
                        <span className="text-heading font-medium">Privacy Policy</span>
                    </nav>
                </div>
            </div>

            {/* Hero Section */}
            <section className="py-12 lg:py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-heading leading-tight tracking-tight mb-6">
                            Privacy Policy
                        </h1>
                        <p className="text-xl md:text-2xl text-body leading-relaxed">
                            Your privacy matters to us. This policy explains how we collect, use, and protect your personal information.
                        </p>
                        <p className="text-sm text-muted mt-4">Last updated: {lastUpdated}</p>
                    </div>
                </div>
            </section>

            {/* Introduction */}
            <section className="border-t border-border-light bg-surface-sunken py-12 lg:py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid lg:grid-cols-12 gap-8 lg:gap-16">
                        <div className="lg:col-span-4">
                            <h2 className="text-sm uppercase tracking-widest text-muted mb-3">Introduction</h2>
                            <div className="w-12 h-0.5 bg-heading rounded-full"></div>
                        </div>
                        <div className="lg:col-span-8">
                            <p className="text-lg text-body leading-relaxed">
                                {siteName} ("we", "us", or "our") operates an e-commerce marketplace connecting customers in Malawi with products from local and international vendors. We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains what information we collect, how we use it, and what rights you have in relation to it.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Information We Collect */}
            <section className="py-12 lg:py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 mb-10">
                        <div className="lg:col-span-4">
                            <h2 className="text-sm uppercase tracking-widest text-muted mb-3">Information We Collect</h2>
                            <div className="w-12 h-0.5 bg-heading rounded-full"></div>
                        </div>
                        <div className="lg:col-span-8">
                            <p className="text-lg text-body leading-relaxed mb-6">
                                We collect information that you voluntarily provide to us when you create an account, make a purchase, or contact us.
                            </p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-surface-raised rounded-2xl p-6 lg:p-8 border border-border-light">
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-heading text-white text-xs font-bold mb-4">01</span>
                            <h3 className="text-xl font-bold text-heading mb-3">Personal Information</h3>
                            <ul className="space-y-2 text-body">
                                <li className="flex gap-3">
                                    <svg className="w-5 h-5 text-brand shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Name, email address, and phone number</span>
                                </li>
                                <li className="flex gap-3">
                                    <svg className="w-5 h-5 text-brand shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Delivery and billing addresses</span>
                                </li>
                                <li className="flex gap-3">
                                    <svg className="w-5 h-5 text-brand shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Account login credentials</span>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-surface-raised rounded-2xl p-6 lg:p-8 border border-border-light">
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-heading text-white text-xs font-bold mb-4">02</span>
                            <h3 className="text-xl font-bold text-heading mb-3">Transaction Information</h3>
                            <ul className="space-y-2 text-body">
                                <li className="flex gap-3">
                                    <svg className="w-5 h-5 text-brand shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Order history and purchase details</span>
                                </li>
                                <li className="flex gap-3">
                                    <svg className="w-5 h-5 text-brand shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Payment method information (processed securely by our payment partners)</span>
                                </li>
                                <li className="flex gap-3">
                                    <svg className="w-5 h-5 text-brand shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Delivery preferences</span>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-surface-raised rounded-2xl p-6 lg:p-8 border border-border-light">
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-heading text-white text-xs font-bold mb-4">03</span>
                            <h3 className="text-xl font-bold text-heading mb-3">Automatically Collected</h3>
                            <ul className="space-y-2 text-body">
                                <li className="flex gap-3">
                                    <svg className="w-5 h-5 text-brand shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Device and browser information</span>
                                </li>
                                <li className="flex gap-3">
                                    <svg className="w-5 h-5 text-brand shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>IP address and general location</span>
                                </li>
                                <li className="flex gap-3">
                                    <svg className="w-5 h-5 text-brand shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Browsing activity on our site</span>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-surface-raised rounded-2xl p-6 lg:p-8 border border-border-light">
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-heading text-white text-xs font-bold mb-4">04</span>
                            <h3 className="text-xl font-bold text-heading mb-3">Communications</h3>
                            <ul className="space-y-2 text-body">
                                <li className="flex gap-3">
                                    <svg className="w-5 h-5 text-brand shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Customer support inquiries</span>
                                </li>
                                <li className="flex gap-3">
                                    <svg className="w-5 h-5 text-brand shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Feedback and reviews</span>
                                </li>
                                <li className="flex gap-3">
                                    <svg className="w-5 h-5 text-brand shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Marketing preferences</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* How We Use Your Information */}
            <section className="border-y border-border-light bg-heading text-white py-12 lg:py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-10">
                        <h2 className="text-sm uppercase tracking-widest text-white/60 mb-3">How We Use Your Information</h2>
                        <div className="w-12 h-0.5 bg-white/30 mx-auto rounded-full mb-6"></div>
                        <p className="text-2xl lg:text-3xl font-bold text-white max-w-2xl mx-auto">
                            We use your information only for legitimate purposes.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                            { title: 'Order Fulfillment', desc: 'Processing and delivering your orders, sending confirmations and tracking updates.' },
                            { title: 'Customer Support', desc: 'Responding to inquiries, resolving disputes, and providing assistance.' },
                            { title: 'Account Management', desc: 'Managing your account, preferences, and order history.' },
                            { title: 'Service Improvement', desc: 'Analyzing usage patterns to improve our platform and offerings.' },
                            { title: 'Communication', desc: 'Sending order updates, promotional offers (with consent), and service announcements.' },
                            { title: 'Security', desc: 'Detecting and preventing fraud, protecting our platform and users.' },
                        ].map((item, index) => (
                            <div key={index} className="bg-white/5 rounded-2xl p-5 border border-white/10">
                                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                                <p className="text-white/70 leading-relaxed text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Information Sharing */}
            <section className="py-12 lg:py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
                        <div className="lg:col-span-5">
                            <h2 className="text-sm uppercase tracking-widest text-muted mb-3">Information Sharing</h2>
                            <div className="w-12 h-0.5 bg-heading rounded-full mb-6"></div>
                            <p className="text-xl text-heading font-medium mb-4">
                                We don't sell your data
                            </p>
                            <p className="text-body leading-relaxed mb-6">
                                We only share your information with trusted third parties who help us operate our platform and serve you better. We never sell your personal information to advertisers or data brokers.
                            </p>
                            <img
                                src="/images/labos/mr-labo-empty-hands.png"
                                alt="Mr. Labo"
                                className="hidden lg:block w-32 h-auto"
                            />
                        </div>
                        <div className="lg:col-span-7">
                            <div className="space-y-4">
                                {[
                                    { title: 'Sellers', desc: 'We share your name, delivery address, and contact information with sellers to fulfill your orders. Sellers are contractually obligated to protect your data.' },
                                    { title: 'Payment Processors', desc: 'Payment information is shared with our secure payment partners (PayChangu, Airtel Money, TNM Mpamba) to process transactions. We never store full card details.' },
                                    { title: 'Delivery Partners', desc: 'Courier partners receive your name, phone number, and address to deliver your orders.' },
                                    { title: 'Legal Requirements', desc: 'We may disclose information if required by law or to protect our rights, safety, or property.' },
                                ].map((item, index) => (
                                    <div key={index} className="bg-surface-raised rounded-2xl p-6 border border-border-light">
                                        <h3 className="text-lg font-bold text-heading mb-2">{item.title}</h3>
                                        <p className="text-body leading-relaxed">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Data Security */}
            <section className="border-t border-border-light bg-surface-raised py-12 lg:py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid lg:grid-cols-12 gap-8 lg:gap-16">
                        <div className="lg:col-span-4">
                            <h2 className="text-sm uppercase tracking-widest text-muted mb-3">Data Security</h2>
                            <div className="w-12 h-0.5 bg-heading rounded-full"></div>
                        </div>
                        <div className="lg:col-span-8">
                            <div className="space-y-4">
                                <p className="text-lg text-body leading-relaxed">
                                    We implement industry-standard security measures to protect your personal information, including:
                                </p>
                                <ul className="space-y-3">
                                    {[
                                        'SSL/TLS encryption for all data transmission',
                                        'Secure password hashing and storage',
                                        'Regular security audits and updates',
                                        'Access controls limiting who can view your data',
                                        'PCI-compliant payment processing partners',
                                    ].map((item, index) => (
                                        <li key={index} className="flex gap-4 p-4 bg-surface rounded-xl border border-border-light">
                                            <svg className="w-5 h-5 text-brand shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                            </svg>
                                            <span className="text-heading">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                                <p className="text-muted text-sm mt-4">
                                    While we strive to protect your information, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Your Rights */}
            <section className="py-12 lg:py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-10">
                        <h2 className="text-sm uppercase tracking-widest text-muted mb-3">Your Rights</h2>
                        <div className="w-12 h-0.5 bg-heading mx-auto rounded-full mb-6"></div>
                        <p className="text-2xl lg:text-3xl font-bold text-heading max-w-2xl mx-auto">
                            You have control over your personal data.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { title: 'Access', desc: 'Request a copy of the personal data we hold about you.' },
                            { title: 'Correction', desc: 'Update or correct inaccurate information in your account.' },
                            { title: 'Deletion', desc: 'Request deletion of your personal data, subject to legal requirements.' },
                            { title: 'Opt-out', desc: 'Unsubscribe from marketing communications at any time.' },
                        ].map((right, index) => (
                            <div key={index} className="bg-surface-raised rounded-2xl p-6 border border-border-light text-center">
                                <div className="w-12 h-12 mx-auto bg-heading text-white flex items-center justify-center font-bold rounded-xl mb-4">
                                    {index + 1}
                                </div>
                                <h3 className="text-lg font-bold text-heading mb-2">{right.title}</h3>
                                <p className="text-body text-sm leading-relaxed">{right.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-body">
                            To exercise any of these rights, contact us at{' '}
                            <a href={`mailto:${supportEmail}`} className="text-heading font-medium hover:text-brand transition-colors">
                                {supportEmail}
                            </a>
                        </p>
                    </div>
                </div>
            </section>

            {/* Cookies */}
            <section className="border-y border-border-light bg-surface-sunken py-12 lg:py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid lg:grid-cols-12 gap-8 lg:gap-16">
                        <div className="lg:col-span-4">
                            <h2 className="text-sm uppercase tracking-widest text-muted mb-3">Cookies</h2>
                            <div className="w-12 h-0.5 bg-heading rounded-full"></div>
                        </div>
                        <div className="lg:col-span-8">
                            <p className="text-lg text-body leading-relaxed mb-4">
                                We use cookies and similar technologies to enhance your experience on our platform. These help us:
                            </p>
                            <ul className="space-y-2 text-body mb-4">
                                <li className="flex gap-3">
                                    <svg className="w-5 h-5 text-brand shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Keep you logged in to your account</span>
                                </li>
                                <li className="flex gap-3">
                                    <svg className="w-5 h-5 text-brand shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Remember your cart and preferences</span>
                                </li>
                                <li className="flex gap-3">
                                    <svg className="w-5 h-5 text-brand shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Understand how you use our site to improve it</span>
                                </li>
                            </ul>
                            <p className="text-muted text-sm">
                                You can control cookies through your browser settings. Disabling cookies may affect some features of our site.
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
                                src="/images/labos/mrs-labo-jumping.png"
                                alt="Mrs. Labo"
                                className="w-20 lg:w-28 h-auto"
                            />
                            <div>
                                <p className="text-xl font-bold text-heading mb-1">Questions about privacy?</p>
                                <p className="text-body">Contact us at {supportEmail} and we'll be happy to help.</p>
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

            {/* Other Policies */}
            <section className="border-t border-border-light bg-surface-raised py-12 lg:py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-8">
                        <h2 className="text-sm uppercase tracking-widest text-muted mb-3">Related Policies</h2>
                        <div className="w-12 h-0.5 bg-heading mx-auto rounded-full"></div>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Link href={route('terms.conditions')} className="bg-surface rounded-xl p-5 border border-border-light hover:border-heading transition-colors group">
                            <h3 className="font-bold text-heading group-hover:text-brand transition-colors mb-1">Terms & Conditions</h3>
                            <p className="text-sm text-muted">Rules for using our platform</p>
                        </Link>
                        <Link href={route('refund.policy')} className="bg-surface rounded-xl p-5 border border-border-light hover:border-heading transition-colors group">
                            <h3 className="font-bold text-heading group-hover:text-brand transition-colors mb-1">Refund Policy</h3>
                            <p className="text-sm text-muted">How refunds work</p>
                        </Link>
                        <Link href={route('return.policy')} className="bg-surface rounded-xl p-5 border border-border-light hover:border-heading transition-colors group">
                            <h3 className="font-bold text-heading group-hover:text-brand transition-colors mb-1">Return Policy</h3>
                            <p className="text-sm text-muted">Returning products</p>
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
