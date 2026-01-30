import { Head, Link } from '@inertiajs/react';
import FrontendLayout from '@/Layouts/FrontendLayout';

export default function TheMagic({ pageContent = {} }) {
    const content = pageContent.content || {};

    const hero = content.hero || {
        title: 'The Magic Behind Avelabo',
        subtitle: 'How we bring global products to Malawi while empowering local entrepreneurs.',
    };

    const problem = content.problem || {
        title: 'The Challenge',
        description: 'For years, Malawians faced a frustrating choice: pay premium prices for imported goods, navigate complex shipping from abroad, or settle for limited local selection. International vendors struggled to reach Malawian customers. Local businesses lacked a platform to compete. Something had to change.',
    };

    const solution = content.solution || {
        title: 'Our Solution',
        points: [
            {
                heading: 'Global Sourcing, Local Options',
                text: 'We work with established international suppliers from South Africa, UAE, and beyond. We also welcome vendors, whether international or local Malawian businesses, to sell on our platform.',
            },
            {
                heading: 'Vetted Courier Network',
                text: 'We partner with trusted private and public couriers to handle delivery. Every courier is vetted to ensure your products arrive safely and on time.',
            },
            {
                heading: 'Centralized Distribution',
                text: 'Products from all vendors are consolidated at our distribution centers across Malawi, enabling efficient fulfillment nationwide.',
            },
            {
                heading: 'Fair Pricing for All',
                text: 'Our transparent model means everyone wins. Customers get competitive prices. Vendors access the Malawian market. And we build a sustainable business that keeps serving Malawi.',
            },
        ],
    };

    const flow = content.flow || {
        title: 'The Journey of Your Order',
        steps: [
            {
                label: 'Vendor',
                location: 'International or Local',
                description: 'Products sourced from verified suppliers and sellers',
            },
            {
                label: 'Avelabo Hub',
                location: 'Distribution Center',
                description: 'Quality checked and organized for local distribution',
            },
            {
                label: 'Courier',
                location: 'Vetted Network',
                description: 'Trusted couriers handle delivery to your area',
            },
            {
                label: 'You',
                location: 'Your Doorstep',
                description: 'Product delivered with care, inspected before payment',
            },
        ],
    };

    const benefits = content.benefits || {
        customers: [
            'Access to global and local products in one place',
            'Competitive prices with transparent pricing',
            'Reliable delivery by vetted couriers',
            'Easy payment via mobile money',
            'Real support from a team based in Malawi',
        ],
        sellers: [
            'Reach Malawian customers without local presence',
            'No need to build delivery infrastructure',
            'Simple onboarding for international and local sellers',
            'Consolidated fulfillment through our distribution centers',
            'Transparent fees and reliable payouts',
        ],
        communities: [
            'Access to quality products previously unavailable',
            'More choice and competitive pricing',
            'Local businesses can sell alongside international brands',
            'Building digital commerce infrastructure in Malawi',
            'Economic growth through increased trade',
        ],
    };

    return (
        <FrontendLayout>
            <Head title="The Magic Behind Avelabo" />

            {/* Breadcrumb */}
            <div className="border-b border-border-light">
                <div className="max-w-6xl mx-auto px-6 py-4">
                    <nav className="flex items-center gap-2 text-sm">
                        <Link href="/" className="text-muted hover:text-heading transition-colors">Home</Link>
                        <span className="text-border-dark">/</span>
                        <span className="text-heading font-medium">The Magic</span>
                    </nav>
                </div>
            </div>

            {/* Hero Section */}
            <section className="py-12 lg:py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-heading leading-tight tracking-tight mb-6">
                            {hero.title}
                        </h1>
                        <p className="text-xl md:text-2xl text-body leading-relaxed">
                            {hero.subtitle}
                        </p>
                    </div>
                </div>
            </section>

            {/* Problem Section */}
            <section className="border-t border-border-light bg-surface-sunken">
                <div className="max-w-6xl mx-auto px-6 py-12 lg:py-16">
                    <div className="grid lg:grid-cols-12 gap-8 lg:gap-16">
                        <div className="lg:col-span-4">
                            <h2 className="text-sm uppercase tracking-widest text-muted mb-3">{problem.title}</h2>
                            <div className="w-12 h-0.5 bg-heading rounded-full"></div>
                        </div>
                        <div className="lg:col-span-8">
                            <p className="text-xl lg:text-2xl text-heading leading-relaxed font-medium">
                                {problem.description}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Solution Section */}
            <section className="py-12 lg:py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 mb-10">
                        <div className="lg:col-span-4">
                            <h2 className="text-sm uppercase tracking-widest text-muted mb-3">{solution.title}</h2>
                            <div className="w-12 h-0.5 bg-heading rounded-full mb-6"></div>
                            <div className="hidden lg:block">
                                <img
                                    src="/images/labos/mr-labo-empty-hands.png"
                                    alt="Mr. Labo explaining"
                                    className="w-40 h-auto"
                                />
                            </div>
                        </div>
                        <div className="lg:col-span-8">
                            <div className="space-y-6">
                                {solution.points.map((point, index) => (
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

            {/* Flow Section */}
            <section className="bg-heading text-white">
                <div className="max-w-6xl mx-auto px-6 py-12 lg:py-16">
                    <div className="text-center mb-10">
                        <h2 className="text-sm uppercase tracking-widest text-white/60 mb-3">{flow.title}</h2>
                        <div className="w-12 h-0.5 bg-white/30 mx-auto rounded-full"></div>
                    </div>

                    {/* Desktop Flow */}
                    <div className="hidden lg:block">
                        <div className="flex items-start justify-between relative">
                            {/* Connection Line */}
                            <div className="absolute top-8 left-0 right-0 h-0.5 bg-white/20"></div>

                            {flow.steps.map((step, index) => (
                                <div key={index} className="relative flex-1 px-4 text-center">
                                    {/* Node */}
                                    <div className="w-16 h-16 mx-auto bg-white/10 border border-white/30 rounded-2xl flex items-center justify-center mb-5 relative z-10">
                                        <span className="text-xl font-bold text-white">{index + 1}</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-1">{step.label}</h3>
                                    <p className="text-sm text-white/60 mb-2">{step.location}</p>
                                    <p className="text-sm text-white/80 leading-relaxed">{step.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Mobile Flow */}
                    <div className="lg:hidden space-y-6">
                        {flow.steps.map((step, index) => (
                            <div key={index} className="flex gap-4">
                                <div className="flex flex-col items-center">
                                    <div className="w-11 h-11 bg-white/10 border border-white/30 rounded-xl flex items-center justify-center">
                                        <span className="font-bold text-white">{index + 1}</span>
                                    </div>
                                    {index < flow.steps.length - 1 && (
                                        <div className="w-0.5 h-full bg-white/20 mt-2"></div>
                                    )}
                                </div>
                                <div className="flex-1 pb-6">
                                    <h3 className="text-lg font-bold text-white mb-1">{step.label}</h3>
                                    <p className="text-sm text-white/60 mb-1">{step.location}</p>
                                    <p className="text-sm text-white/80 leading-relaxed">{step.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-12 lg:py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-10">
                        <h2 className="text-sm uppercase tracking-widest text-muted mb-3">Everyone Wins</h2>
                        <div className="w-12 h-0.5 bg-heading mx-auto rounded-full mb-6"></div>
                        <p className="text-2xl lg:text-3xl font-bold text-heading max-w-2xl mx-auto">
                            A model built for mutual benefit, not extraction.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                        {/* Customers */}
                        <div className="bg-surface-raised rounded-2xl p-6 lg:p-8 border border-border-light">
                            <h3 className="text-xs font-medium uppercase tracking-widest text-muted mb-5">For Customers</h3>
                            <ul className="space-y-3">
                                {benefits.customers.map((item, index) => (
                                    <li key={index} className="flex gap-3">
                                        <svg className="w-5 h-5 text-brand shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="text-body text-sm">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Sellers */}
                        <div className="bg-surface-raised rounded-2xl p-6 lg:p-8 border border-border-light">
                            <h3 className="text-xs font-medium uppercase tracking-widest text-muted mb-5">For Sellers</h3>
                            <ul className="space-y-3">
                                {benefits.sellers.map((item, index) => (
                                    <li key={index} className="flex gap-3">
                                        <svg className="w-5 h-5 text-brand shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="text-body text-sm">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Communities */}
                        <div className="bg-surface-raised rounded-2xl p-6 lg:p-8 border border-border-light">
                            <h3 className="text-xs font-medium uppercase tracking-widest text-muted mb-5">For Communities</h3>
                            <ul className="space-y-3">
                                {benefits.communities.map((item, index) => (
                                    <li key={index} className="flex gap-3">
                                        <svg className="w-5 h-5 text-brand shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="text-body text-sm">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* The Big Question Section */}
            <section className="py-12 lg:py-16 border-t border-border-light bg-surface-raised">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="bg-surface rounded-3xl p-8 lg:p-12 border border-border-light">
                        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
                            <div className="lg:col-span-5">
                                <h2 className="text-sm uppercase tracking-widest text-muted mb-3">The Big Question</h2>
                                <div className="w-12 h-0.5 bg-heading rounded-full mb-6"></div>
                                <p className="text-2xl lg:text-3xl font-bold text-heading leading-snug">
                                    "How do you operate in a forex shortage?"
                                </p>
                            </div>
                            <div className="lg:col-span-7">
                                <div className="space-y-4">
                                    <p className="text-body leading-relaxed">
                                        It's the question everyone asks, and it's a fair one. Malawi's forex challenges are well-known. So how does Avelabo bring international products to your doorstep?
                                    </p>
                                    <p className="text-body leading-relaxed">
                                        Our parent company operates branches in <strong className="text-heading">Botswana and South Africa</strong>. This unique positioning allows us to finance our operations using income generated from these markets, bypassing the typical forex constraints that limit other importers.
                                    </p>
                                    <p className="text-body leading-relaxed">
                                        For us, Avelabo is a trial run: an opportunity to explore the viability of this model in Malawi. If successful, we're not just building a marketplace. We're building a pathway to bring forex <em>into</em> the country through investment from international partners who see the potential in serving the Malawian market.
                                    </p>
                                    <p className="text-heading font-medium pt-2">
                                        This isn't just commerce. It's a vision for what Malawian trade could become.
                                    </p>
                                </div>
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
                                    alt="Mr. and Mrs. Labo with gifts"
                                    className="w-28 lg:w-36 h-auto"
                                />
                                <div className="text-white">
                                    <h2 className="text-2xl lg:text-3xl font-bold mb-2">
                                        Ready to experience the magic?
                                    </h2>
                                    <p className="text-white/70">
                                        Join thousands of Malawians who've discovered a better way to shop.
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <Link
                                    href={route('shop')}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-heading font-medium rounded-xl hover:bg-surface-raised transition-colors"
                                >
                                    Start Shopping
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </Link>
                                <Link
                                    href={route('vendor.guide')}
                                    className="inline-flex items-center gap-2 px-6 py-3 border border-white/30 text-white font-medium rounded-xl hover:bg-white/10 transition-colors"
                                >
                                    Become a Seller
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </FrontendLayout>
    );
}
