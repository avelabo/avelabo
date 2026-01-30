import { Head, Link, useForm, usePage } from '@inertiajs/react';
import FrontendLayout from '@/Layouts/FrontendLayout';
import FormAlert from '@/Components/Frontend/FormAlert';
import { useToast } from '@/Contexts/ToastContext';

export default function Contact({ contactInfo = {}, flash = {} }) {
    const { siteSettings } = usePage().props;
    const settings = siteSettings || {};

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const toast = useToast();

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('contact.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                toast.success('Message sent successfully! We\'ll get back to you soon.');
            },
            onError: () => {
                toast.error('Failed to send message. Please check the form and try again.');
            },
        });
    };

    return (
        <FrontendLayout>
            <Head title="Contact Us" />

            {/* Breadcrumb */}
            <section className="bg-gray-50 py-4">
                <div className="max-w-7xl mx-auto px-4">
                    <nav className="flex items-center gap-2 text-sm">
                        <Link href="/" className="text-gray-400 hover:text-brand transition-colors flex items-center gap-1">
                            <i className="fi fi-rs-home text-xs"></i> Home
                        </Link>
                        <span className="text-gray-400">/</span>
                        <span className="text-brand">Contact</span>
                    </nav>
                </div>
            </section>

            {/* Hero Section */}
            <section className="py-12 lg:py-16">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="max-w-5xl mx-auto">
                        <div className="flex flex-col lg:flex-row lg:items-end gap-8 lg:gap-12 mb-12">
                            {/* Left Column - Title & Description */}
                            <div className="lg:w-1/3">
                                <h4 className="text-brand font-quicksand font-bold text-lg mb-4">How can we help you?</h4>
                                <h1 className="font-quicksand font-bold text-2xl lg:text-3xl text-heading mb-6">Get in Touch</h1>
                                <p className="text-gray-500 mb-4">
                                    Have questions about our marketplace? Want to become a seller? Need help with an order?
                                    We're here to help!
                                </p>
                                <p className="text-gray-500">
                                    Our support team is available Monday - Saturday, 8:00 AM - 6:00 PM (CAT).
                                </p>
                            </div>

                            {/* Right Column - Feature Boxes */}
                            <div className="lg:w-2/3">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="bg-white p-6 rounded-xl border border-gray-200 hover:border-brand hover:shadow-lg transition-all">
                                        <h5 className="font-quicksand font-bold text-heading mb-3">Customer Support</h5>
                                        <p className="text-gray-500 text-sm">Need help with an order? Our support team is ready to assist you with any questions.</p>
                                    </div>

                                    <div className="bg-white p-6 rounded-xl border border-gray-200 hover:border-brand hover:shadow-lg transition-all">
                                        <h5 className="font-quicksand font-bold text-heading mb-3">Seller Support</h5>
                                        <p className="text-gray-500 text-sm">Want to become a seller or need help with your store? Contact our seller support team.</p>
                                    </div>

                                    <div className="bg-white p-6 rounded-xl border border-gray-200 hover:border-brand hover:shadow-lg transition-all">
                                        <h5 className="font-quicksand font-bold text-brand mb-3">Partnerships</h5>
                                        <p className="text-gray-500 text-sm">Interested in partnering with Avelabo? Let's discuss how we can work together.</p>
                                    </div>

                                    <div className="bg-white p-6 rounded-xl border border-gray-200 hover:border-brand hover:shadow-lg transition-all">
                                        <h5 className="font-quicksand font-bold text-heading mb-3">General Inquiries</h5>
                                        <p className="text-gray-500 text-sm">For any other questions or feedback, we'd love to hear from you.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Map Placeholder Section */}
            <section className="hidden md:block mb-12">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="bg-gradient-to-r from-brand to-brand-dark rounded-2xl overflow-hidden h-80 flex items-center justify-center text-white">
                        <div className="text-center">
                            <i className="fi fi-rs-marker text-6xl mb-4 block opacity-80"></i>
                            <h3 className="text-2xl font-bold mb-2">We're in Malawi</h3>
                            <p className="opacity-80">Serving customers across the country</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Info & Contact Form */}
            <section className="pb-12 lg:pb-20">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="max-w-5xl mx-auto">
                        {/* Contact Info Cards */}
                        <div className="grid md:grid-cols-3 gap-6 mb-16">
                            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all">
                                <div className="w-12 h-12 bg-brand/10 rounded-xl flex items-center justify-center mb-4">
                                    <i className="fi fi-rs-marker text-brand text-xl"></i>
                                </div>
                                <h4 className="text-heading font-quicksand font-bold text-lg mb-2">Our Location</h4>
                                <p className="text-gray-500 text-sm">{contactInfo.address || settings.site_address}</p>
                            </div>
                            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all">
                                <div className="w-12 h-12 bg-brand/10 rounded-xl flex items-center justify-center mb-4">
                                    <i className="fi fi-rs-phone-call text-brand text-xl"></i>
                                </div>
                                <h4 className="text-heading font-quicksand font-bold text-lg mb-2">Phone</h4>
                                <p className="text-gray-500 text-sm">{contactInfo.phone || settings.site_phone}</p>
                                {(contactInfo.phone_2 || settings.site_phone_2) && (
                                    <p className="text-gray-500 text-sm">{contactInfo.phone_2 || settings.site_phone_2}</p>
                                )}
                            </div>
                            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all">
                                <div className="w-12 h-12 bg-brand/10 rounded-xl flex items-center justify-center mb-4">
                                    <i className="fi fi-rs-envelope text-brand text-xl"></i>
                                </div>
                                <h4 className="text-heading font-quicksand font-bold text-lg mb-2">Email</h4>
                                <p className="text-gray-500 text-sm">{contactInfo.email || settings.site_email}</p>
                                {(contactInfo.support_email || settings.site_support_email) && (
                                    <p className="text-gray-500 text-sm">{contactInfo.support_email || settings.site_support_email}</p>
                                )}
                            </div>
                        </div>

                        {/* Flash Message */}
                        {flash?.success && (
                            <FormAlert type="success" message={flash.success} className="mb-8" />
                        )}

                        {flash?.error && (
                            <FormAlert type="error" message={flash.error} className="mb-8" />
                        )}

                        {/* Contact Form & Image */}
                        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                            {/* Contact Form */}
                            <div className="lg:w-2/3">
                                <div className="bg-white border border-gray-200 rounded-xl p-6 lg:p-8">
                                    <h5 className="text-brand font-quicksand font-semibold mb-2">Send us a message</h5>
                                    <h2 className="font-quicksand font-bold text-2xl text-heading mb-2">Drop Us a Line</h2>
                                    <p className="text-gray-400 text-sm mb-8">We'll get back to you within 24 hours</p>

                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        <div className="grid md:grid-cols-2 gap-5">
                                            <div>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={data.name}
                                                    onChange={(e) => setData('name', e.target.value)}
                                                    placeholder="Your Name *"
                                                    className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:border-brand focus:outline-none transition-colors"
                                                />
                                                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                                            </div>
                                            <div>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={data.email}
                                                    onChange={(e) => setData('email', e.target.value)}
                                                    placeholder="Your Email *"
                                                    className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:border-brand focus:outline-none transition-colors"
                                                />
                                                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-5">
                                            <div>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={data.phone}
                                                    onChange={(e) => setData('phone', e.target.value)}
                                                    placeholder="Your Phone"
                                                    className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:border-brand focus:outline-none transition-colors"
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    type="text"
                                                    name="subject"
                                                    value={data.subject}
                                                    onChange={(e) => setData('subject', e.target.value)}
                                                    placeholder="Subject *"
                                                    className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:border-brand focus:outline-none transition-colors"
                                                />
                                                {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
                                            </div>
                                        </div>

                                        <div>
                                            <textarea
                                                name="message"
                                                value={data.message}
                                                onChange={(e) => setData('message', e.target.value)}
                                                placeholder="Your Message *"
                                                rows="5"
                                                className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:border-brand focus:outline-none transition-colors resize-none"
                                            ></textarea>
                                            {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="bg-brand hover:bg-brand-dark text-white font-bold px-8 py-4 rounded-lg transition-colors hover:-translate-y-0.5 transform duration-300 disabled:opacity-50"
                                        >
                                            {processing ? 'Sending...' : 'Send Message'}
                                        </button>
                                    </form>
                                </div>
                            </div>

                            {/* Contact Info Sidebar */}
                            <div className="lg:w-1/3">
                                <div className="bg-brand rounded-xl p-6 lg:p-8 text-white mb-6">
                                    <h3 className="font-bold text-xl mb-4">Quick Contact</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <i className="fi fi-rs-phone-call mt-1"></i>
                                            <div>
                                                <p className="font-semibold">Phone</p>
                                                <p className="text-white/80">{contactInfo.phone || settings.site_phone}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <i className="fi fi-rs-envelope mt-1"></i>
                                            <div>
                                                <p className="font-semibold">Email</p>
                                                <p className="text-white/80">{contactInfo.support_email || settings.site_support_email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <i className="fi fi-rs-clock mt-1"></i>
                                            <div>
                                                <p className="font-semibold">Working Hours</p>
                                                <p className="text-white/80">{contactInfo.hours || settings.site_hours}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-xl p-6">
                                    <h4 className="font-bold text-heading mb-4">Follow Us</h4>
                                    <div className="flex gap-3">
                                        {settings.social_facebook && (
                                            <a href={settings.social_facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-brand text-white rounded-full flex items-center justify-center hover:bg-brand-dark transition-colors">
                                                <i className="fi fi-brands-facebook"></i>
                                            </a>
                                        )}
                                        {settings.social_twitter && (
                                            <a href={settings.social_twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-brand text-white rounded-full flex items-center justify-center hover:bg-brand-dark transition-colors">
                                                <i className="fi fi-brands-twitter"></i>
                                            </a>
                                        )}
                                        {settings.social_instagram && (
                                            <a href={settings.social_instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-brand text-white rounded-full flex items-center justify-center hover:bg-brand-dark transition-colors">
                                                <i className="fi fi-brands-instagram"></i>
                                            </a>
                                        )}
                                        {settings.social_whatsapp && (
                                            <a href={`https://wa.me/${settings.social_whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-brand text-white rounded-full flex items-center justify-center hover:bg-brand-dark transition-colors">
                                                <i className="fi fi-brands-whatsapp"></i>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </FrontendLayout>
    );
}
