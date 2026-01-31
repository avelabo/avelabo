import { Head, Link, useForm, usePage } from '@inertiajs/react';
import FrontendLayout from '@/Layouts/FrontendLayout';
import { useState } from 'react';

export default function HelpSupport({ pageContent = {} }) {
    const { siteSettings } = usePage().props;
    const settings = siteSettings || {};
    const supportEmail = settings.site_support_email || 'support@avelabo.com';
    const supportPhone = settings.site_phone || '+265 999 000 000';
    const siteName = settings.site_name || 'Avelabo';

    const [selectedCategory, setSelectedCategory] = useState('');

    const { data, setData, post, processing, errors, reset, recentlySuccessful } = useForm({
        name: '',
        email: '',
        phone: '',
        order_number: '',
        category: '',
        subject: '',
        message: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('contact.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setSelectedCategory('');
            },
        });
    };

    const categories = [
        { value: 'order_issue', label: 'Order Issue', desc: 'Problems with an existing order' },
        { value: 'delivery', label: 'Delivery', desc: 'Shipping and delivery questions' },
        { value: 'refund', label: 'Refund Request', desc: 'Request a refund for an order' },
        { value: 'return', label: 'Return Request', desc: 'Return a product' },
        { value: 'product', label: 'Product Question', desc: 'Questions about products' },
        { value: 'account', label: 'Account Help', desc: 'Login, password, account issues' },
        { value: 'payment', label: 'Payment Issue', desc: 'Payment problems or questions' },
        { value: 'other', label: 'Other', desc: 'Something else' },
    ];

    const faqs = [
        {
            question: 'How do I track my order?',
            answer: 'Once your order ships, you\'ll receive an SMS and email with tracking information. You can also view your order status in your account dashboard under "My Orders".'
        },
        {
            question: 'How long does delivery take?',
            answer: 'Delivery times vary based on your location and product availability. Typically, orders within major cities take 3-7 business days. Rural areas may take 7-14 days. International products may take 2-4 weeks.'
        },
        {
            question: 'What payment methods do you accept?',
            answer: 'We accept Airtel Money, TNM Mpamba, and card payments through our secure payment gateway. All transactions are encrypted and secure.'
        },
        {
            question: 'Can I cancel my order?',
            answer: 'You can cancel your order before it ships by contacting support. Once an order has shipped from our warehouse or supplier, cancellation is not possible.'
        },
        {
            question: 'How do I return a product?',
            answer: 'To return a product, submit a support ticket within 7 days of delivery. Include your order number and reason for return. We\'ll review and provide return instructions if eligible.'
        },
        {
            question: 'When will I receive my refund?',
            answer: 'Approved refunds are processed within 5-7 business days to your original payment method. Mobile money refunds are faster (1-3 days), while card refunds may take up to 10 days.'
        },
    ];

    return (
        <FrontendLayout>
            <Head title="Help & Support" />

            {/* Breadcrumb */}
            <div className="border-b border-border-light">
                <div className="max-w-6xl mx-auto px-6 py-4">
                    <nav className="flex items-center gap-2 text-sm">
                        <Link href="/" className="text-muted hover:text-heading transition-colors">Home</Link>
                        <span className="text-border-dark">/</span>
                        <span className="text-heading font-medium">Help & Support</span>
                    </nav>
                </div>
            </div>

            {/* Hero Section */}
            <section className="py-12 lg:py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-heading leading-tight tracking-tight mb-6">
                                How Can We Help?
                            </h1>
                            <p className="text-xl text-body leading-relaxed mb-6">
                                Got a question or need assistance? We're here to help. Check our FAQs or submit a support ticket below.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <a
                                    href={`mailto:${supportEmail}`}
                                    className="inline-flex items-center gap-2 px-5 py-3 bg-surface-raised border border-border-light rounded-xl hover:border-heading transition-colors"
                                >
                                    <svg className="w-5 h-5 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <span className="text-heading font-medium">{supportEmail}</span>
                                </a>
                                <a
                                    href={`tel:${supportPhone.replace(/\s/g, '')}`}
                                    className="inline-flex items-center gap-2 px-5 py-3 bg-surface-raised border border-border-light rounded-xl hover:border-heading transition-colors"
                                >
                                    <svg className="w-5 h-5 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    <span className="text-heading font-medium">{supportPhone}</span>
                                </a>
                            </div>
                        </div>
                        <div className="flex justify-center lg:justify-end">
                            <img
                                src="/images/labos/mr-labo-tablet.png"
                                alt="Mr. Labo with tablet"
                                className="w-48 lg:w-64 h-auto"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Support Hours Notice */}
            <section className="border-y border-border-light bg-surface-raised py-6">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <svg className="w-5 h-5 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-heading font-medium">Support Hours</span>
                        </div>
                        <p className="text-body text-center sm:text-right">
                            Monday - Saturday, 8:00 AM - 6:00 PM (CAT) • Response within 24 hours
                        </p>
                    </div>
                </div>
            </section>

            {/* Quick Help Categories */}
            <section className="py-12 lg:py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-10">
                        <h2 className="text-sm uppercase tracking-widest text-muted mb-3">Quick Help</h2>
                        <div className="w-12 h-0.5 bg-heading mx-auto rounded-full mb-6"></div>
                        <p className="text-2xl lg:text-3xl font-bold text-heading max-w-2xl mx-auto">
                            What do you need help with?
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { title: 'Track Order', desc: 'Find your order status', icon: '📦', link: route('account') },
                            { title: 'Returns', desc: 'Return a product', icon: '↩️', link: route('return.policy') },
                            { title: 'Refunds', desc: 'Get your money back', icon: '💰', link: route('refund.policy') },
                            { title: 'Account', desc: 'Manage your account', icon: '👤', link: route('account') },
                        ].map((item, index) => (
                            <Link
                                key={index}
                                href={item.link}
                                className="bg-surface-raised rounded-2xl p-6 border border-border-light hover:border-heading transition-colors group text-center"
                            >
                                <span className="text-3xl mb-3 block">{item.icon}</span>
                                <h3 className="font-bold text-heading group-hover:text-brand transition-colors mb-1">{item.title}</h3>
                                <p className="text-sm text-muted">{item.desc}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQs */}
            <section className="border-y border-border-light bg-surface-sunken py-12 lg:py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
                        <div className="lg:col-span-4">
                            <h2 className="text-sm uppercase tracking-widest text-muted mb-3">Common Questions</h2>
                            <div className="w-12 h-0.5 bg-heading rounded-full mb-6"></div>
                            <p className="text-body leading-relaxed">
                                Quick answers to frequently asked questions. Can't find what you're looking for? Submit a ticket below.
                            </p>
                        </div>
                        <div className="lg:col-span-8">
                            <div className="divide-y divide-border-light">
                                {faqs.map((faq, index) => (
                                    <div key={index} className="py-5 first:pt-0 last:pb-0">
                                        <h3 className="text-lg font-bold text-heading mb-2">{faq.question}</h3>
                                        <p className="text-body leading-relaxed">{faq.answer}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Support Ticket Form */}
            <section className="py-12 lg:py-16" id="ticket">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
                        <div className="lg:col-span-4">
                            <h2 className="text-sm uppercase tracking-widest text-muted mb-3">Submit a Ticket</h2>
                            <div className="w-12 h-0.5 bg-heading rounded-full mb-6"></div>
                            <p className="text-xl text-heading font-medium mb-4">
                                Can't find an answer?
                            </p>
                            <p className="text-body leading-relaxed mb-6">
                                Fill out the form and our support team will get back to you within 24 hours. The more details you provide, the faster we can help.
                            </p>
                            <div className="hidden lg:block">
                                <img
                                    src="/images/labos/mrs-labo-jumping.png"
                                    alt="Mrs. Labo"
                                    className="w-36 h-auto"
                                />
                            </div>
                        </div>

                        <div className="lg:col-span-8">
                            <div className="bg-surface-raised rounded-2xl border border-border-light p-6 lg:p-8">
                                {recentlySuccessful && (
                                    <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl">
                                        <div className="flex items-start gap-3">
                                            <svg className="w-5 h-5 text-green-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <div>
                                                <p className="font-bold">Ticket Submitted!</p>
                                                <p className="text-sm">Thank you for contacting us. We'll respond within 24 hours.</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Category Selection */}
                                    <div>
                                        <label className="block text-sm font-medium text-heading mb-3">What do you need help with? *</label>
                                        <div className="grid sm:grid-cols-2 gap-3">
                                            {categories.map((cat) => (
                                                <label
                                                    key={cat.value}
                                                    className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                                                        data.category === cat.value
                                                            ? 'border-heading bg-heading/5'
                                                            : 'border-border-light hover:border-heading'
                                                    }`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="category"
                                                        value={cat.value}
                                                        checked={data.category === cat.value}
                                                        onChange={(e) => {
                                                            setData('category', e.target.value);
                                                            setSelectedCategory(e.target.value);
                                                        }}
                                                        className="mt-1"
                                                    />
                                                    <div>
                                                        <span className="font-medium text-heading block">{cat.label}</span>
                                                        <span className="text-xs text-muted">{cat.desc}</span>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                        {errors.category && <p className="text-red-500 text-sm mt-2">{errors.category}</p>}
                                    </div>

                                    {/* Contact Info */}
                                    <div className="grid sm:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-sm font-medium text-heading mb-2">Your Name *</label>
                                            <input
                                                type="text"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                className="w-full px-4 py-3 border border-border bg-surface rounded-xl focus:border-heading focus:outline-none transition-colors"
                                                placeholder="John Banda"
                                            />
                                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-heading mb-2">Email Address *</label>
                                            <input
                                                type="email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                className="w-full px-4 py-3 border border-border bg-surface rounded-xl focus:border-heading focus:outline-none transition-colors"
                                                placeholder="john@example.com"
                                            />
                                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                        </div>
                                    </div>

                                    <div className="grid sm:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-sm font-medium text-heading mb-2">Phone Number</label>
                                            <input
                                                type="tel"
                                                value={data.phone}
                                                onChange={(e) => setData('phone', e.target.value)}
                                                className="w-full px-4 py-3 border border-border bg-surface rounded-xl focus:border-heading focus:outline-none transition-colors"
                                                placeholder="+265 999 123 456"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-heading mb-2">
                                                Order Number {['order_issue', 'delivery', 'refund', 'return'].includes(data.category) ? '*' : '(if applicable)'}
                                            </label>
                                            <input
                                                type="text"
                                                value={data.order_number}
                                                onChange={(e) => setData('order_number', e.target.value)}
                                                className="w-full px-4 py-3 border border-border bg-surface rounded-xl focus:border-heading focus:outline-none transition-colors"
                                                placeholder="AVE-123456"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-heading mb-2">Subject *</label>
                                        <input
                                            type="text"
                                            value={data.subject}
                                            onChange={(e) => setData('subject', e.target.value)}
                                            className="w-full px-4 py-3 border border-border bg-surface rounded-xl focus:border-heading focus:outline-none transition-colors"
                                            placeholder="Brief summary of your issue"
                                        />
                                        {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-heading mb-2">Describe Your Issue *</label>
                                        <textarea
                                            rows="5"
                                            value={data.message}
                                            onChange={(e) => setData('message', e.target.value)}
                                            className="w-full px-4 py-3 border border-border bg-surface rounded-xl focus:border-heading focus:outline-none transition-colors resize-none"
                                            placeholder="Please provide as much detail as possible. Include any error messages, what you expected to happen, and what actually happened."
                                        ></textarea>
                                        {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                                    </div>

                                    <div className="flex items-center justify-between pt-4">
                                        <p className="text-sm text-muted">We respond within 24 hours</p>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="inline-flex items-center gap-2 px-6 py-3 bg-heading text-white font-medium rounded-xl hover:bg-brand-dark transition-colors disabled:opacity-50"
                                        >
                                            {processing ? 'Submitting...' : 'Submit Ticket'}
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                            </svg>
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Other Ways to Reach Us */}
            <section className="border-t border-border-light bg-heading text-white py-12 lg:py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-10">
                        <h2 className="text-sm uppercase tracking-widest text-white/60 mb-3">Other Ways to Reach Us</h2>
                        <div className="w-12 h-0.5 bg-white/30 mx-auto rounded-full"></div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                        <a
                            href={`mailto:${supportEmail}`}
                            className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-colors text-center"
                        >
                            <div className="w-12 h-12 mx-auto bg-white/10 rounded-xl flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-1">Email</h3>
                            <p className="text-white/70">{supportEmail}</p>
                        </a>

                        <a
                            href={`tel:${supportPhone.replace(/\s/g, '')}`}
                            className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-colors text-center"
                        >
                            <div className="w-12 h-12 mx-auto bg-white/10 rounded-xl flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-1">Phone</h3>
                            <p className="text-white/70">{supportPhone}</p>
                        </a>

                        {settings.social_whatsapp && (
                            <a
                                href={`https://wa.me/${settings.social_whatsapp.replace(/\D/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-colors text-center"
                            >
                                <div className="w-12 h-12 mx-auto bg-white/10 rounded-xl flex items-center justify-center mb-4">
                                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                    </svg>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-1">WhatsApp</h3>
                                <p className="text-white/70">Chat with us</p>
                            </a>
                        )}
                    </div>
                </div>
            </section>

            {/* Related Policies */}
            <section className="py-12 lg:py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-8">
                        <h2 className="text-sm uppercase tracking-widest text-muted mb-3">Helpful Links</h2>
                        <div className="w-12 h-0.5 bg-heading mx-auto rounded-full"></div>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Link href={route('purchase.guide')} className="bg-surface-raised rounded-xl p-5 border border-border-light hover:border-heading transition-colors group">
                            <h3 className="font-bold text-heading group-hover:text-brand transition-colors mb-1">How to Buy</h3>
                            <p className="text-sm text-muted">Step-by-step guide</p>
                        </Link>
                        <Link href={route('refund.policy')} className="bg-surface-raised rounded-xl p-5 border border-border-light hover:border-heading transition-colors group">
                            <h3 className="font-bold text-heading group-hover:text-brand transition-colors mb-1">Refund Policy</h3>
                            <p className="text-sm text-muted">How refunds work</p>
                        </Link>
                        <Link href={route('return.policy')} className="bg-surface-raised rounded-xl p-5 border border-border-light hover:border-heading transition-colors group">
                            <h3 className="font-bold text-heading group-hover:text-brand transition-colors mb-1">Return Policy</h3>
                            <p className="text-sm text-muted">Returning products</p>
                        </Link>
                        <Link href={route('trust-and-safety')} className="bg-surface-raised rounded-xl p-5 border border-border-light hover:border-heading transition-colors group">
                            <h3 className="font-bold text-heading group-hover:text-brand transition-colors mb-1">Trust & Safety</h3>
                            <p className="text-sm text-muted">How we protect you</p>
                        </Link>
                    </div>
                </div>
            </section>
        </FrontendLayout>
    );
}
