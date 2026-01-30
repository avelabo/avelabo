import { Head, Link } from '@inertiajs/react';
import FrontendLayout from '@/Layouts/FrontendLayout';

export default function About({ pageContent = {} }) {
    const content = pageContent.content || {};

    const hero = content.hero || {
        title: 'Bringing the World to Malawi',
        subtitle: 'We connect quality international products with Malawian doorsteps through local entrepreneurs who care about their communities.',
    };

    const story = content.story || {
        title: 'Our Story',
        paragraphs: [
            'Avelabo was born from a simple observation: Malawians deserve access to the same quality products available in South Africa, the UAE, and beyond, without the hassle of complex imports or unreliable shipping.',
            'We built a marketplace that bridges this gap. Our platform connects customers with a curated network of international suppliers, while also welcoming vendors from around the world (and right here in Malawi) to sell their products. Local delivery partners handle the last mile, ensuring global selection meets local service.',
            'Every order supports local entrepreneurs. Every vendor gains access to the Malawian market. Every delivery strengthens a community. That\'s not just business; it\'s how commerce should work.',
        ],
    };

    const values = content.values || [
        {
            title: 'Quality First',
            description: 'Every product is verified. Every supplier is vetted. No compromises.',
        },
        {
            title: 'Local Impact',
            description: 'We empower Malawian entrepreneurs to build sustainable businesses.',
        },
        {
            title: 'Honest Pricing',
            description: 'No hidden fees. No surprises. What you see is what you pay.',
        },
        {
            title: 'Real Support',
            description: 'Our team is based in Malawi. We understand your needs because we live here too.',
        },
    ];

    const stats = content.stats || [
        { number: '10K+', label: 'Products Available' },
        { number: '500+', label: 'Brands' },
        { number: '50+', label: 'Categories' },
        { number: '5', label: 'Collection Points' },
    ];

    return (
        <FrontendLayout>
            <Head title="About Us" />

            {/* Breadcrumb */}
            <div className="border-b border-border-light">
                <div className="max-w-6xl mx-auto px-6 py-4">
                    <nav className="flex items-center gap-2 text-sm">
                        <Link href="/" className="text-muted hover:text-heading transition-colors">Home</Link>
                        <span className="text-border-dark">/</span>
                        <span className="text-heading font-medium">About</span>
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

            {/* Visual Divider with Mascot */}
            <section className="border-y border-border-light bg-surface-raised">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex items-center justify-between py-6 lg:py-8">
                        <div className="flex-1 flex items-center gap-6">
                            <div className="hidden md:block w-28 h-28 lg:w-32 lg:h-32 relative">
                                <img
                                    src="/images/labos/mr-mrs-labo-together-gifts.png"
                                    alt="Mr. and Mrs. Labo"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm uppercase tracking-widest text-muted mb-1">Since 2024</p>
                                <p className="text-lg text-heading font-medium">
                                    Building Malawi's most trusted online marketplace
                                </p>
                            </div>
                        </div>
                        <div className="hidden lg:flex items-center gap-10">
                            {stats.slice(0, 2).map((stat, index) => (
                                <div key={index} className="text-right">
                                    <p className="text-3xl font-bold text-heading">{stat.number}</p>
                                    <p className="text-sm text-muted">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-12 lg:py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid lg:grid-cols-12 gap-8 lg:gap-16">
                        <div className="lg:col-span-4">
                            <h2 className="text-sm uppercase tracking-widest text-muted mb-3">{story.title}</h2>
                            <div className="w-12 h-0.5 bg-heading rounded-full"></div>
                        </div>
                        <div className="lg:col-span-8">
                            <div className="space-y-5">
                                {story.paragraphs.map((paragraph, index) => (
                                    <p key={index} className="text-lg text-body leading-relaxed">
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How We Make It Work Teaser */}
            <section className="bg-heading text-white">
                <div className="max-w-6xl mx-auto px-6 py-10 lg:py-12">
                    <div className="grid lg:grid-cols-12 gap-6 lg:gap-10 items-center">
                        <div className="lg:col-span-8">
                            <p className="text-white/60 text-sm uppercase tracking-widest mb-3">The Question Everyone Asks</p>
                            <h2 className="text-2xl lg:text-3xl font-bold mb-3">
                                "How do you operate in a forex shortage?"
                            </h2>
                            <p className="text-white/80 leading-relaxed">
                                With our parent company's presence in Botswana and South Africa, we've found a way to bring international products to Malawi. And we're just getting started. This is more than a marketplace; it's a vision for what Malawian trade could become.
                            </p>
                        </div>
                        <div className="lg:col-span-4 lg:text-right">
                            <Link
                                href={route('the-magic')}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-heading font-medium rounded-xl hover:bg-surface-raised transition-colors"
                            >
                                Read About the Magic
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Grid - Mobile */}
            <section className="lg:hidden border-b border-border-light bg-surface-raised py-8">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid grid-cols-2 gap-6">
                        {stats.map((stat, index) => (
                            <div key={index} className="bg-surface rounded-xl p-4 border border-border-light">
                                <p className="text-2xl font-bold text-heading mb-1">{stat.number}</p>
                                <p className="text-sm text-muted">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-12 lg:py-16 border-t border-border-light lg:border-t-0">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 mb-10">
                        <div className="lg:col-span-4">
                            <h2 className="text-sm uppercase tracking-widest text-muted mb-3">What We Believe</h2>
                            <div className="w-12 h-0.5 bg-heading rounded-full"></div>
                        </div>
                        <div className="lg:col-span-8">
                            <p className="text-xl text-body leading-relaxed">
                                Our values aren't just words on a wall. They're commitments we make to every customer, every seller, and every community we serve.
                            </p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        {values.map((value, index) => (
                            <div key={index} className="bg-surface-raised rounded-2xl p-6 lg:p-8 border border-border-light">
                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-heading text-white text-xs font-bold mb-4">0{index + 1}</span>
                                <h3 className="text-xl font-bold text-heading mb-2">{value.title}</h3>
                                <p className="text-body leading-relaxed">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Full Stats - Desktop */}
            <section className="hidden lg:block border-y border-border-light bg-surface-raised">
                <div className="max-w-6xl mx-auto px-6 py-10">
                    <div className="grid grid-cols-4 gap-4">
                        {stats.map((stat, index) => (
                            <div key={index} className="bg-surface rounded-2xl p-6 text-center border border-border-light">
                                <p className="text-4xl font-bold text-heading mb-1">{stat.number}</p>
                                <p className="text-muted">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-12 lg:py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="bg-surface-raised rounded-3xl p-8 lg:p-12 border border-border-light">
                        <div className="grid lg:grid-cols-2 gap-8 items-center">
                            <div>
                                <h2 className="text-3xl lg:text-4xl font-bold text-heading mb-4">
                                    Ready to discover what's possible?
                                </h2>
                                <p className="text-lg text-body mb-6">
                                    Whether you're shopping for quality products or looking to grow your business as a seller, Avelabo is here for you.
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    <Link
                                        href={route('shop')}
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-heading text-white font-medium rounded-xl hover:bg-brand-dark transition-colors"
                                    >
                                        Browse Products
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </Link>
                                    <Link
                                        href={route('vendor.guide')}
                                        className="inline-flex items-center gap-2 px-6 py-3 border border-heading text-heading font-medium rounded-xl hover:bg-heading hover:text-white transition-colors"
                                    >
                                        Become a Seller
                                    </Link>
                                </div>
                            </div>
                            <div className="flex justify-center lg:justify-end">
                                <img
                                    src="/images/labos/mrs-labo-gift-bag.png"
                                    alt="Mrs. Labo with gift bag"
                                    className="w-40 lg:w-56 h-auto"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </FrontendLayout>
    );
}
