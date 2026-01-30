import { Head, Link, useForm } from '@inertiajs/react';
import FrontendLayout from '@/Layouts/FrontendLayout';

export default function VendorGuide({ pageContent = {} }) {
    const content = pageContent.content || {};

    const { data, setData, post, processing, errors, reset, recentlySuccessful } = useForm({
        name: '',
        email: '',
        telephone: '',
        subject: 'Seller Inquiry',
        message: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('contact.store'), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    const hero = content.hero || {
        title: 'Become an Avelabo Seller',
        subtitle: 'List your products on Malawi\'s growing marketplace. Reach customers across the country through our trusted platform.',
    };

    const benefits = content.benefits || [
        {
            title: 'Access to Malawian Customers',
            description: 'Reach customers across Malawi without building your own distribution network. We handle the logistics.',
        },
        {
            title: 'Simple Onboarding',
            description: 'Whether you\'re an international supplier or a local business, our seller registration process is straightforward.',
        },
        {
            title: 'Reliable Fulfillment',
            description: 'Our vetted courier network ensures your products reach customers safely and on time.',
        },
        {
            title: 'Transparent Fees',
            description: 'Clear commission structure with no hidden charges. You know exactly what you\'ll earn on every sale.',
        },
    ];

    const requirements = content.requirements || [
        'Registered business or individual seller',
        'Valid identification documents',
        'Product catalog with descriptions and images',
        'Bank account or mobile money for receiving payments',
        'Ability to fulfill orders or ship to our distribution center',
        'Commitment to quality and customer satisfaction',
    ];

    const steps = content.steps || [
        {
            number: '01',
            title: 'Submit Your Application',
            description: 'Fill out the seller registration form. Tell us about your business and the products you want to sell.',
        },
        {
            number: '02',
            title: 'Complete Verification',
            description: 'Submit your business documents for verification. We review applications within 24-48 hours.',
        },
        {
            number: '03',
            title: 'Set Up Your Store',
            description: 'Upload your product catalog, set prices, and configure your seller profile. Our team can help you get started.',
        },
        {
            number: '04',
            title: 'Start Selling',
            description: 'Your products go live. Customers can browse and order, and we handle delivery through our courier network.',
        },
    ];

    const faqs = content.faqs || [
        {
            question: 'Who can sell on Avelabo?',
            answer: 'Both international suppliers and local Malawian businesses can sell on our platform. Whether you\'re a manufacturer, distributor, or retailer, we welcome your application.',
        },
        {
            question: 'How does delivery work?',
            answer: 'We handle all delivery logistics through our vetted courier network. You can either ship products to our distribution center or fulfill orders directly. We\'ll coordinate the last mile.',
        },
        {
            question: 'How do I get paid?',
            answer: 'Payments are processed regularly to your bank account or mobile money. You\'ll receive clear statements showing all sales and commissions.',
        },
        {
            question: 'What products can I sell?',
            answer: 'We accept a wide range of quality products. All items must meet our quality standards and comply with Malawian import regulations where applicable.',
        },
        {
            question: 'Is there any fee to join?',
            answer: 'There\'s no registration fee. We operate on a commission model, so you only pay when you make a sale.',
        },
    ];

    return (
        <FrontendLayout>
            <Head title="Become a Seller" />

            {/* Breadcrumb */}
            <div className="border-b border-border-light">
                <div className="max-w-6xl mx-auto px-6 py-4">
                    <nav className="flex items-center gap-2 text-sm">
                        <Link href="/" className="text-muted hover:text-heading transition-colors">Home</Link>
                        <span className="text-border-dark">/</span>
                        <span className="text-heading font-medium">Become a Seller</span>
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
                                href={route('seller.register')}
                                className="inline-flex items-center gap-2 px-8 py-4 bg-heading text-white font-medium rounded-xl hover:bg-brand-dark transition-colors"
                            >
                                Apply Now
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                        </div>
                        <div className="flex justify-center lg:justify-end">
                            <img
                                src="/images/labos/mrs-labo-gift-bag.png"
                                alt="Mrs. Labo with delivery bag"
                                className="w-56 lg:w-72 h-auto"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="border-y border-border-light bg-surface-raised py-12 lg:py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-10">
                        <h2 className="text-sm uppercase tracking-widest text-muted mb-3">Why Sell on Avelabo</h2>
                        <div className="w-12 h-0.5 bg-heading mx-auto rounded-full"></div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        {benefits.map((benefit, index) => (
                            <div key={index} className="bg-surface rounded-2xl border border-border-light p-6 flex gap-5">
                                <div className="shrink-0 w-10 h-10 bg-heading text-white flex items-center justify-center font-bold rounded-xl text-sm">
                                    {index + 1}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-heading mb-2">{benefit.title}</h3>
                                    <p className="text-body leading-relaxed">{benefit.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Requirements Section */}
            <section className="py-12 lg:py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
                        <div className="lg:col-span-5">
                            <h2 className="text-sm uppercase tracking-widest text-muted mb-3">Requirements</h2>
                            <div className="w-12 h-0.5 bg-heading rounded-full mb-6"></div>
                            <p className="text-xl text-heading font-medium mb-4">
                                What you need to get started
                            </p>
                            <p className="text-body leading-relaxed">
                                We've kept requirements minimal so anyone with motivation and integrity can join. No special skills or expensive equipment needed.
                            </p>
                        </div>
                        <div className="lg:col-span-7">
                            <ul className="space-y-3">
                                {requirements.map((req, index) => (
                                    <li key={index} className="flex gap-4 p-4 bg-surface-raised rounded-xl border border-border-light">
                                        <svg className="w-5 h-5 text-brand shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="text-heading">{req}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Process Section */}
            <section className="border-y border-border-light bg-heading text-white py-12 lg:py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-10">
                        <h2 className="text-sm uppercase tracking-widest text-white/60 mb-3">Getting Started</h2>
                        <div className="w-12 h-0.5 bg-white/30 mx-auto rounded-full mb-6"></div>
                        <p className="text-2xl lg:text-3xl font-bold max-w-2xl mx-auto">
                            From application to first delivery in days, not weeks.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {steps.map((step, index) => (
                            <div key={index} className="bg-white/5 rounded-2xl p-5 border border-white/10">
                                <span className="text-3xl font-bold text-white/20 block mb-3">{step.number}</span>
                                <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                                <p className="text-white/70 leading-relaxed text-sm">{step.description}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 text-center">
                        <Link
                            href={route('seller.register')}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-heading font-medium rounded-xl hover:bg-surface-raised transition-colors"
                        >
                            Start Your Application
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </section>

            {/* FAQs Section */}
            <section className="py-12 lg:py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
                        <div className="lg:col-span-4">
                            <h2 className="text-sm uppercase tracking-widest text-muted mb-3">Common Questions</h2>
                            <div className="w-12 h-0.5 bg-heading rounded-full mb-6"></div>
                            <p className="text-body leading-relaxed">
                                Still have questions? Contact us and we'll help you understand if selling on Avelabo is right for you.
                            </p>
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

            {/* Contact Form Section */}
            <section className="border-t border-border-light bg-surface-raised py-12 lg:py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
                        <div>
                            <h2 className="text-sm uppercase tracking-widest text-muted mb-3">Have Questions?</h2>
                            <div className="w-12 h-0.5 bg-heading rounded-full mb-6"></div>
                            <h3 className="text-2xl lg:text-3xl font-bold text-heading mb-4">
                                We're here to help
                            </h3>
                            <p className="text-body leading-relaxed mb-6">
                                Not sure if selling on Avelabo is right for you? Send us a message and our team will get back to you within 24 hours.
                            </p>
                            <div className="hidden lg:block">
                                <img
                                    src="/images/labos/mr-labo-tablet.png"
                                    alt="Mr. Labo with tablet"
                                    className="w-40 h-auto"
                                />
                            </div>
                        </div>

                        <div className="bg-surface rounded-2xl border border-border-light p-6 lg:p-8">
                            {recentlySuccessful && (
                                <div className="mb-6 p-4 bg-success-light border border-success text-success rounded-xl">
                                    Thank you for your message! We'll get back to you soon.
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-heading mb-2">Your Name</label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className="w-full px-4 py-3 border border-border bg-surface rounded-xl focus:border-heading focus:outline-none transition-colors"
                                            placeholder="John Banda"
                                        />
                                        {errors.name && <p className="text-danger text-sm mt-1">{errors.name}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-heading mb-2">Email</label>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className="w-full px-4 py-3 border border-border bg-surface rounded-xl focus:border-heading focus:outline-none transition-colors"
                                            placeholder="john@example.com"
                                        />
                                        {errors.email && <p className="text-danger text-sm mt-1">{errors.email}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-heading mb-2">Phone Number</label>
                                    <input
                                        type="tel"
                                        value={data.telephone}
                                        onChange={(e) => setData('telephone', e.target.value)}
                                        className="w-full px-4 py-3 border border-border bg-surface rounded-xl focus:border-heading focus:outline-none transition-colors"
                                        placeholder="+265 999 123 456"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-heading mb-2">Your Message</label>
                                    <textarea
                                        rows="4"
                                        value={data.message}
                                        onChange={(e) => setData('message', e.target.value)}
                                        className="w-full px-4 py-3 border border-border bg-surface rounded-xl focus:border-heading focus:outline-none transition-colors resize-none"
                                        placeholder="Tell us about yourself and what you'd like to know..."
                                    ></textarea>
                                    {errors.message && <p className="text-danger text-sm mt-1">{errors.message}</p>}
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-heading text-white font-medium rounded-xl hover:bg-brand-dark transition-colors disabled:opacity-50"
                                >
                                    {processing ? 'Sending...' : 'Send Message'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </FrontendLayout>
    );
}
