import { Head, Link, usePage } from '@inertiajs/react';
import FrontendLayout from '@/Layouts/FrontendLayout';

export default function TermsConditions({ pageContent = {} }) {
    const { siteSettings } = usePage().props;
    const settings = siteSettings || {};
    const supportEmail = settings.site_support_email || 'support@avelabo.com';
    const siteName = settings.site_name || 'Avelabo';

    const content = pageContent.content || {};
    const lastUpdated = content.last_updated || 'January 2025';

    return (
        <FrontendLayout>
            <Head title="Terms & Conditions" />

            {/* Breadcrumb */}
            <div className="border-b border-border-light">
                <div className="max-w-6xl mx-auto px-6 py-4">
                    <nav className="flex items-center gap-2 text-sm">
                        <Link href="/" className="text-muted hover:text-heading transition-colors">Home</Link>
                        <span className="text-border-dark">/</span>
                        <span className="text-heading font-medium">Terms & Conditions</span>
                    </nav>
                </div>
            </div>

            {/* Hero Section */}
            <section className="py-12 lg:py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-heading leading-tight tracking-tight mb-6">
                            Terms & Conditions
                        </h1>
                        <p className="text-xl md:text-2xl text-body leading-relaxed">
                            Please read these terms carefully before using our platform. By accessing or using {siteName}, you agree to be bound by these terms.
                        </p>
                        <p className="text-sm text-muted mt-4">Last updated: {lastUpdated}</p>
                    </div>
                </div>
            </section>

            {/* Agreement to Terms */}
            <section className="border-t border-border-light bg-surface-sunken py-12 lg:py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid lg:grid-cols-12 gap-8 lg:gap-16">
                        <div className="lg:col-span-4">
                            <h2 className="text-sm uppercase tracking-widest text-muted mb-3">Agreement to Terms</h2>
                            <div className="w-12 h-0.5 bg-heading rounded-full"></div>
                        </div>
                        <div className="lg:col-span-8">
                            <p className="text-lg text-body leading-relaxed mb-4">
                                By accessing or using {siteName} ("we", "us", "our"), you agree to be bound by these Terms and Conditions. If you do not agree to all the terms, you may not access or use our services.
                            </p>
                            <p className="text-lg text-body leading-relaxed">
                                We reserve the right to update these terms at any time. Continued use of the platform after changes constitutes acceptance of the new terms.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Use of Platform */}
            <section className="py-12 lg:py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 mb-10">
                        <div className="lg:col-span-4">
                            <h2 className="text-sm uppercase tracking-widest text-muted mb-3">Use of Platform</h2>
                            <div className="w-12 h-0.5 bg-heading rounded-full"></div>
                        </div>
                        <div className="lg:col-span-8">
                            <p className="text-lg text-body leading-relaxed">
                                {siteName} provides an online marketplace connecting customers with vendors. You may use our platform only for lawful purposes and in accordance with these terms.
                            </p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-surface-raised rounded-2xl p-6 lg:p-8 border border-border-light">
                            <div className="flex items-center gap-3 mb-4">
                                <svg className="w-6 h-6 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <h3 className="text-xl font-bold text-heading">You May</h3>
                            </div>
                            <ul className="space-y-3 text-body">
                                <li>Browse products and make purchases</li>
                                <li>Create an account to track orders</li>
                                <li>Leave honest reviews of products</li>
                                <li>Contact sellers through our platform</li>
                                <li>Subscribe to newsletters and promotions</li>
                            </ul>
                        </div>

                        <div className="bg-surface-raised rounded-2xl p-6 lg:p-8 border border-border-light">
                            <div className="flex items-center gap-3 mb-4">
                                <svg className="w-6 h-6 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                <h3 className="text-xl font-bold text-heading">You May Not</h3>
                            </div>
                            <ul className="space-y-3 text-body">
                                <li>Use the platform for illegal activities</li>
                                <li>Misrepresent your identity</li>
                                <li>Post false or misleading reviews</li>
                                <li>Attempt to hack or disrupt services</li>
                                <li>Scrape or copy content without permission</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Account Responsibilities */}
            <section className="border-y border-border-light bg-heading text-white py-12 lg:py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-10">
                        <h2 className="text-sm uppercase tracking-widest text-white/60 mb-3">Account Responsibilities</h2>
                        <div className="w-12 h-0.5 bg-white/30 mx-auto rounded-full mb-6"></div>
                        <p className="text-2xl lg:text-3xl font-bold text-white max-w-2xl mx-auto">
                            You are responsible for your account security and activities.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { title: 'Accurate Information', desc: 'Provide truthful, accurate, and complete information when creating your account.' },
                            { title: 'Password Security', desc: 'Keep your login credentials secure. Never share your password with others.' },
                            { title: 'Account Activity', desc: 'You are responsible for all activities that occur under your account.' },
                            { title: 'Prompt Reporting', desc: 'Notify us immediately of any unauthorized use of your account.' },
                        ].map((item, index) => (
                            <div key={index} className="bg-white/5 rounded-2xl p-5 border border-white/10">
                                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                                <p className="text-white/70 leading-relaxed text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Orders and Payments */}
            <section className="py-12 lg:py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
                        <div className="lg:col-span-5">
                            <h2 className="text-sm uppercase tracking-widest text-muted mb-3">Orders & Payments</h2>
                            <div className="w-12 h-0.5 bg-heading rounded-full mb-6"></div>
                            <p className="text-xl text-heading font-medium mb-4">
                                How transactions work
                            </p>
                            <p className="text-body leading-relaxed mb-6">
                                When you place an order, you agree to pay the total amount displayed at checkout, including product price, delivery fees, and any applicable taxes.
                            </p>
                            <img
                                src="/images/labos/mrs-labo-gift-bag.png"
                                alt="Mrs. Labo with shopping"
                                className="hidden lg:block w-36 h-auto"
                            />
                        </div>
                        <div className="lg:col-span-7">
                            <div className="space-y-4">
                                {[
                                    { title: 'Order Confirmation', desc: 'An order is confirmed only when you receive an order confirmation from us. We reserve the right to reject or cancel orders due to pricing errors, stock issues, or suspected fraud.' },
                                    { title: 'Pricing', desc: 'All prices are displayed in your selected currency. Prices may change without notice, but changes will not affect orders already confirmed.' },
                                    { title: 'Payment Methods', desc: 'We accept mobile money (Airtel Money, TNM Mpamba), card payments through secure payment gateways, and other methods as displayed at checkout.' },
                                    { title: 'Payment Security', desc: 'All payments are processed through secure, PCI-compliant payment partners. We do not store your full payment details.' },
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

            {/* Product Information */}
            <section className="border-t border-border-light bg-surface-raised py-12 lg:py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid lg:grid-cols-12 gap-8 lg:gap-16">
                        <div className="lg:col-span-4">
                            <h2 className="text-sm uppercase tracking-widest text-muted mb-3">Product Information</h2>
                            <div className="w-12 h-0.5 bg-heading rounded-full"></div>
                        </div>
                        <div className="lg:col-span-8">
                            <div className="space-y-4">
                                <p className="text-lg text-body leading-relaxed">
                                    We strive to display accurate product information, including descriptions, images, and pricing. However:
                                </p>
                                <ul className="space-y-3">
                                    {[
                                        'Product images are for illustration purposes and may vary slightly from the actual product',
                                        'Product availability is subject to change without notice',
                                        'Sellers are responsible for the accuracy of their product listings',
                                        'We do not warrant that product descriptions are error-free',
                                    ].map((item, index) => (
                                        <li key={index} className="flex gap-4 p-4 bg-surface rounded-xl border border-border-light">
                                            <svg className="w-5 h-5 text-muted shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span className="text-body">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Delivery */}
            <section className="py-12 lg:py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid lg:grid-cols-12 gap-8 lg:gap-16">
                        <div className="lg:col-span-4">
                            <h2 className="text-sm uppercase tracking-widest text-muted mb-3">Delivery</h2>
                            <div className="w-12 h-0.5 bg-heading rounded-full"></div>
                        </div>
                        <div className="lg:col-span-8">
                            <div className="space-y-4">
                                <p className="text-lg text-body leading-relaxed mb-4">
                                    We partner with trusted couriers to deliver your orders. By placing an order, you agree to the following:
                                </p>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {[
                                        { title: 'Delivery Times', desc: 'Estimated delivery times are provided in good faith but are not guaranteed. Delays may occur due to factors beyond our control.' },
                                        { title: 'Accurate Address', desc: 'You must provide accurate delivery information. We are not responsible for delays or failed deliveries due to incorrect addresses.' },
                                        { title: 'Inspection', desc: 'You may inspect products upon delivery. Report any damage or discrepancies immediately to the courier and our support team.' },
                                        { title: 'Risk of Loss', desc: 'Risk of loss passes to you upon delivery. Items left at your request without signature are your responsibility.' },
                                    ].map((item, index) => (
                                        <div key={index} className="bg-surface-raised rounded-xl p-5 border border-border-light">
                                            <h3 className="font-bold text-heading mb-2">{item.title}</h3>
                                            <p className="text-body text-sm leading-relaxed">{item.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Intellectual Property */}
            <section className="border-y border-border-light bg-surface-sunken py-12 lg:py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid lg:grid-cols-12 gap-8 lg:gap-16">
                        <div className="lg:col-span-4">
                            <h2 className="text-sm uppercase tracking-widest text-muted mb-3">Intellectual Property</h2>
                            <div className="w-12 h-0.5 bg-heading rounded-full"></div>
                        </div>
                        <div className="lg:col-span-8">
                            <p className="text-lg text-body leading-relaxed mb-4">
                                The {siteName} platform, including its design, logos, content, and software, is protected by intellectual property laws. You may not:
                            </p>
                            <ul className="space-y-2 text-body">
                                <li className="flex gap-3">
                                    <svg className="w-5 h-5 text-danger shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    <span>Copy, modify, or distribute our content without permission</span>
                                </li>
                                <li className="flex gap-3">
                                    <svg className="w-5 h-5 text-danger shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    <span>Use our trademarks or branding without authorization</span>
                                </li>
                                <li className="flex gap-3">
                                    <svg className="w-5 h-5 text-danger shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    <span>Reverse engineer or attempt to extract our source code</span>
                                </li>
                                <li className="flex gap-3">
                                    <svg className="w-5 h-5 text-danger shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    <span>Scrape or harvest data from our platform</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Limitation of Liability */}
            <section className="py-12 lg:py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid lg:grid-cols-12 gap-8 lg:gap-16">
                        <div className="lg:col-span-4">
                            <h2 className="text-sm uppercase tracking-widest text-muted mb-3">Limitation of Liability</h2>
                            <div className="w-12 h-0.5 bg-heading rounded-full"></div>
                        </div>
                        <div className="lg:col-span-8">
                            <div className="bg-surface-raised rounded-2xl p-6 lg:p-8 border border-border-light">
                                <p className="text-body leading-relaxed mb-4">
                                    To the maximum extent permitted by law, {siteName} and its affiliates shall not be liable for:
                                </p>
                                <ul className="space-y-3 text-body mb-4">
                                    <li className="flex gap-3">
                                        <span className="text-muted">•</span>
                                        <span>Indirect, incidental, special, or consequential damages</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="text-muted">•</span>
                                        <span>Loss of profits, data, or business opportunities</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="text-muted">•</span>
                                        <span>Actions of third-party sellers or delivery partners</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="text-muted">•</span>
                                        <span>Service interruptions or technical issues</span>
                                    </li>
                                </ul>
                                <p className="text-muted text-sm">
                                    Our total liability for any claim shall not exceed the amount you paid for the specific product or service that gave rise to the claim.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Dispute Resolution */}
            <section className="border-t border-border-light bg-surface-raised py-12 lg:py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid lg:grid-cols-12 gap-8 lg:gap-16">
                        <div className="lg:col-span-4">
                            <h2 className="text-sm uppercase tracking-widest text-muted mb-3">Dispute Resolution</h2>
                            <div className="w-12 h-0.5 bg-heading rounded-full mb-6"></div>
                            <img
                                src="/images/labos/mr-labo-tablet.png"
                                alt="Mr. Labo"
                                className="hidden lg:block w-32 h-auto"
                            />
                        </div>
                        <div className="lg:col-span-8">
                            <p className="text-lg text-body leading-relaxed mb-6">
                                We aim to resolve any disputes quickly and fairly. If you have a concern:
                            </p>
                            <div className="space-y-4">
                                {[
                                    { step: '1', title: 'Contact Support', desc: 'Reach out to our customer support team first. Most issues can be resolved through direct communication.' },
                                    { step: '2', title: 'Formal Complaint', desc: 'If unresolved, submit a formal complaint in writing. We will investigate and respond within 14 business days.' },
                                    { step: '3', title: 'Mediation', desc: 'If we cannot reach an agreement, we may engage a neutral mediator to help resolve the dispute.' },
                                    { step: '4', title: 'Legal Action', desc: 'As a last resort, disputes shall be governed by the laws of Malawi and resolved in Malawian courts.' },
                                ].map((item, index) => (
                                    <div key={index} className="flex gap-4 bg-surface rounded-xl p-5 border border-border-light">
                                        <div className="shrink-0 w-10 h-10 bg-heading text-white flex items-center justify-center font-bold rounded-xl">
                                            {item.step}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-heading mb-1">{item.title}</h3>
                                            <p className="text-body text-sm leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Termination */}
            <section className="py-12 lg:py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid lg:grid-cols-12 gap-8 lg:gap-16">
                        <div className="lg:col-span-4">
                            <h2 className="text-sm uppercase tracking-widest text-muted mb-3">Termination</h2>
                            <div className="w-12 h-0.5 bg-heading rounded-full"></div>
                        </div>
                        <div className="lg:col-span-8">
                            <p className="text-lg text-body leading-relaxed mb-4">
                                We may terminate or suspend your account and access to our services, without prior notice, if:
                            </p>
                            <ul className="space-y-2 text-body">
                                <li className="flex gap-3">
                                    <svg className="w-5 h-5 text-muted shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    <span>You violate these Terms and Conditions</span>
                                </li>
                                <li className="flex gap-3">
                                    <svg className="w-5 h-5 text-muted shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    <span>You engage in fraudulent or harmful activities</span>
                                </li>
                                <li className="flex gap-3">
                                    <svg className="w-5 h-5 text-muted shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    <span>We are required to do so by law</span>
                                </li>
                            </ul>
                            <p className="text-muted text-sm mt-4">
                                You may delete your account at any time by contacting support. Termination does not affect outstanding orders or payment obligations.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact CTA */}
            <section className="border-t border-border-light bg-heading text-white py-12 lg:py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                        <div className="flex items-center gap-6">
                            <img
                                src="/images/labos/mr-mrs-labo-together-gifts.png"
                                alt="Mr. and Mrs. Labo"
                                className="w-28 lg:w-36 h-auto"
                            />
                            <div>
                                <p className="text-2xl font-bold text-white mb-2">
                                    Questions about our terms?
                                </p>
                                <p className="text-white/70">
                                    Contact us at {supportEmail} and we'll be happy to clarify.
                                </p>
                            </div>
                        </div>
                        <Link
                            href={route('contact')}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-heading font-medium rounded-xl hover:bg-surface-raised transition-colors"
                        >
                            Contact Us
                        </Link>
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
                        <Link href={route('privacy.policy')} className="bg-surface-raised rounded-xl p-5 border border-border-light hover:border-heading transition-colors group">
                            <h3 className="font-bold text-heading group-hover:text-brand transition-colors mb-1">Privacy Policy</h3>
                            <p className="text-sm text-muted">How we handle your data</p>
                        </Link>
                        <Link href={route('refund.policy')} className="bg-surface-raised rounded-xl p-5 border border-border-light hover:border-heading transition-colors group">
                            <h3 className="font-bold text-heading group-hover:text-brand transition-colors mb-1">Refund Policy</h3>
                            <p className="text-sm text-muted">How refunds work</p>
                        </Link>
                        <Link href={route('return.policy')} className="bg-surface-raised rounded-xl p-5 border border-border-light hover:border-heading transition-colors group">
                            <h3 className="font-bold text-heading group-hover:text-brand transition-colors mb-1">Return Policy</h3>
                            <p className="text-sm text-muted">Returning products</p>
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
