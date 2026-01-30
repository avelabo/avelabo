import { Head, Link } from '@inertiajs/react';
import FrontendLayout from '@/Layouts/FrontendLayout';

export default function TrustAndSafety({ pageContent = {} }) {
    const content = pageContent.content || {};

    const hero = content.hero || {
        title: 'Trust & Reliability',
        subtitle: 'We take your security seriously. Here\'s how we protect every transaction, every delivery, and every customer.',
    };

    const pillars = content.pillars || [
        {
            title: 'Verified Sellers',
            description: 'Every seller, whether international or local, completes verification before selling on our platform. We vet businesses, check credentials, and ensure accountability.',
            points: [
                'Business verification required',
                'Product quality standards enforced',
                'Ongoing performance monitoring',
                'Quick removal of bad actors',
            ],
        },
        {
            title: 'Secure Payments',
            description: 'Your payment information is protected with industry-standard encryption. We support trusted payment methods and never store sensitive financial data.',
            points: [
                'SSL encryption on all transactions',
                'Mobile money integration (Airtel/TNM)',
                'No storage of card details',
                'PCI-compliant payment partners',
            ],
        },
        {
            title: 'Product Quality',
            description: 'Products from all sellers are inspected at our distribution centers before delivery. We stand behind everything sold on our platform.',
            points: [
                'Vetted international and local sellers',
                'Quality inspection at distribution',
                'Authentic products guarantee',
                'Easy returns for defects',
            ],
        },
        {
            title: 'Reliable Delivery',
            description: 'Track every order in real-time. Our vetted courier network ensures safe delivery. Inspect products before accepting.',
            points: [
                'Real-time order tracking',
                'Vetted private and public couriers',
                'Inspection before acceptance',
                '24/7 customer support',
            ],
        },
    ];

    const commitments = content.commitments || [
        {
            title: 'Your Money is Safe',
            description: 'We hold payment in escrow until delivery is confirmed. If something goes wrong, you\'re protected.',
        },
        {
            title: 'Privacy Respected',
            description: 'We collect only what we need to process your orders. Your data is never sold to third parties.',
        },
        {
            title: 'Problems Get Solved',
            description: 'Our dispute resolution process is fair and fast. Most issues are resolved within 48 hours.',
        },
        {
            title: 'Transparent Operations',
            description: 'No hidden fees, no surprise charges. What you see at checkout is what you pay.',
        },
    ];

    const sellerTrust = content.sellerTrust || {
        title: 'How We Protect Sellers',
        points: [
            {
                heading: 'Fair Compensation',
                text: 'Clear commission structure with no hidden deductions. You know exactly what you\'ll earn on every sale.',
            },
            {
                heading: 'Fraud Protection',
                text: 'We verify customer orders and handle payment collection. Sellers are protected from fraudulent buyers.',
            },
            {
                heading: 'Dispute Support',
                text: 'When customers have complaints, we mediate fairly. Honest sellers aren\'t penalized for unreasonable demands.',
            },
            {
                heading: 'Reliable Payouts',
                text: 'Receive timely payments to your bank account or mobile money. No delays on legitimate earnings.',
            },
        ],
    };

    const faqs = content.faqs || [
        {
            question: 'What happens if I receive a damaged product?',
            answer: 'Inspect all products before accepting delivery. If damaged, refuse the delivery and the courier will return it. If you discover damage after, contact support within 24 hours with photos for a full refund or replacement.',
        },
        {
            question: 'How do I know sellers are trustworthy?',
            answer: 'All sellers complete business verification before selling on our platform. You can see seller ratings and reviews on product pages. Sellers with repeated issues are removed from the platform.',
        },
        {
            question: 'Is my payment information safe?',
            answer: 'We use bank-level encryption for all transactions. Mobile money payments go through official Airtel and TNM APIs. Card payments are processed by PCI-compliant partners. We never store your card details.',
        },
        {
            question: 'What if my order doesn\'t arrive?',
            answer: 'Orders not delivered within the promised timeframe can be canceled for a full refund. Contact support and we\'ll resolve it immediately.',
        },
        {
            question: 'How do I report a problem?',
            answer: 'Use the "Report Issue" button on your order page, email support@avelabo.com, or call our hotline. We respond to all reports within 24 hours.',
        },
    ];

    return (
        <FrontendLayout>
            <Head title="Trust & Reliability" />

            {/* Breadcrumb */}
            <div className="border-b border-border-light">
                <div className="max-w-6xl mx-auto px-6 py-4">
                    <nav className="flex items-center gap-2 text-sm">
                        <Link href="/" className="text-muted hover:text-heading transition-colors">Home</Link>
                        <span className="text-border-dark">/</span>
                        <span className="text-heading font-medium">Trust & Reliability</span>
                    </nav>
                </div>
            </div>

            {/* Hero Section */}
            <section className="py-12 lg:py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-heading leading-tight tracking-tight mb-6">
                            {hero.title}
                        </h1>
                        <p className="text-xl md:text-2xl text-body leading-relaxed">
                            {hero.subtitle}
                        </p>
                    </div>
                </div>
            </section>

            {/* Trust Statement */}
            <section className="border-y border-border-light bg-surface-raised">
                <div className="max-w-6xl mx-auto px-6 py-10">
                    <div className="flex items-center gap-8">
                        <img
                            src="/images/labos/mr-mrs-labo-together-gifts.png"
                            alt="Mr. and Mrs. Labo"
                            className="hidden md:block w-28 lg:w-36 h-auto"
                        />
                        <div>
                            <p className="text-lg lg:text-xl text-heading font-medium">
                                "Building trust isn't about promises. It's about consistently doing the right thing, order after order."
                            </p>
                            <p className="text-muted mt-2">The Avelabo Team</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust Pillars */}
            <section className="py-12 lg:py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-10">
                        <h2 className="text-sm uppercase tracking-widest text-muted mb-3">Our Trust Pillars</h2>
                        <div className="w-12 h-0.5 bg-heading mx-auto rounded-full mb-6"></div>
                        <p className="text-2xl lg:text-3xl font-bold text-heading max-w-2xl mx-auto">
                            Four foundations that make Avelabo a safe place to shop and sell.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        {pillars.map((pillar, index) => (
                            <div key={index} className="bg-surface-raised rounded-2xl border border-border-light p-6 lg:p-8">
                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-heading text-white text-xs font-bold mb-4">0{index + 1}</span>
                                <h3 className="text-xl font-bold text-heading mb-4">{pillar.title}</h3>
                                <p className="text-body leading-relaxed mb-5">{pillar.description}</p>
                                <ul className="space-y-3">
                                    {pillar.points.map((point, pointIndex) => (
                                        <li key={pointIndex} className="flex gap-3 text-sm">
                                            <svg className="w-4 h-4 text-brand shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span className="text-body">{point}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Our Commitments */}
            <section className="border-y border-border-light bg-heading text-white py-12 lg:py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
                        <div className="lg:col-span-4">
                            <h2 className="text-sm uppercase tracking-widest text-white/60 mb-3">Our Commitments</h2>
                            <div className="w-12 h-0.5 bg-white/30 rounded-full mb-6"></div>
                            <p className="text-xl font-medium">
                                Promises we make to every customer.
                            </p>
                        </div>
                        <div className="lg:col-span-8">
                            <div className="grid sm:grid-cols-2 gap-4">
                                {commitments.map((commitment, index) => (
                                    <div key={index} className="bg-white/5 rounded-2xl p-5 border border-white/10">
                                        <h3 className="text-lg font-bold mb-2">{commitment.title}</h3>
                                        <p className="text-white/70 leading-relaxed">{commitment.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Seller Trust Section */}
            <section className="py-12 lg:py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
                        <div className="lg:col-span-5">
                            <h2 className="text-sm uppercase tracking-widest text-muted mb-3">{sellerTrust.title}</h2>
                            <div className="w-12 h-0.5 bg-heading rounded-full mb-6"></div>
                            <p className="text-xl text-heading font-medium mb-4">
                                Trust goes both ways
                            </p>
                            <p className="text-body leading-relaxed mb-6">
                                We're building a platform where sellers can build real businesses. That means protecting them too: from fraud, from unfair treatment, and from uncertainty.
                            </p>
                            <img
                                src="/images/labos/mr-labo-tablet.png"
                                alt="Mr. Labo"
                                className="hidden lg:block w-36 h-auto"
                            />
                        </div>
                        <div className="lg:col-span-7">
                            <div className="space-y-4">
                                {sellerTrust.points.map((point, index) => (
                                    <div key={index} className="bg-surface-raised rounded-2xl p-6 border border-border-light">
                                        <h3 className="text-lg font-bold text-heading mb-2">{point.heading}</h3>
                                        <p className="text-body leading-relaxed">{point.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQs Section */}
            <section className="border-t border-border-light bg-surface-raised py-12 lg:py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-10">
                        <h2 className="text-sm uppercase tracking-widest text-muted mb-3">Common Questions</h2>
                        <div className="w-12 h-0.5 bg-heading mx-auto rounded-full"></div>
                    </div>

                    <div className="max-w-3xl mx-auto">
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
                                <p className="text-xl font-bold text-heading mb-1">Still have concerns?</p>
                                <p className="text-body">We're here to answer any questions about safety and security.</p>
                            </div>
                        </div>
                        <Link
                            href={route('contact')}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-heading text-white font-medium rounded-xl hover:bg-brand-dark transition-colors whitespace-nowrap"
                        >
                            Contact Support
                        </Link>
                    </div>
                </div>
            </section>
        </FrontendLayout>
    );
}
