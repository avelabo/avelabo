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
                            <span className="material-icons text-sm">home</span> Home
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
                            <span className="material-icons text-6xl mb-4 block opacity-80">location_on</span>
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
                                    <span className="material-icons text-brand text-xl">location_on</span>
                                </div>
                                <h4 className="text-heading font-quicksand font-bold text-lg mb-2">Our Location</h4>
                                <p className="text-gray-500 text-sm">{contactInfo.address || settings.site_address}</p>
                            </div>
                            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all">
                                <div className="w-12 h-12 bg-brand/10 rounded-xl flex items-center justify-center mb-4">
                                    <span className="material-icons text-brand text-xl">phone</span>
                                </div>
                                <h4 className="text-heading font-quicksand font-bold text-lg mb-2">Phone</h4>
                                <p className="text-gray-500 text-sm">{contactInfo.phone || settings.site_phone}</p>
                                {(contactInfo.phone_2 || settings.site_phone_2) && (
                                    <p className="text-gray-500 text-sm">{contactInfo.phone_2 || settings.site_phone_2}</p>
                                )}
                            </div>
                            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all">
                                <div className="w-12 h-12 bg-brand/10 rounded-xl flex items-center justify-center mb-4">
                                    <span className="material-icons text-brand text-xl">email</span>
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
                                            <span className="material-icons text-lg mt-0.5">phone</span>
                                            <div>
                                                <p className="font-semibold">Phone</p>
                                                <p className="text-white/80">{contactInfo.phone || settings.site_phone}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <span className="material-icons text-lg mt-0.5">email</span>
                                            <div>
                                                <p className="font-semibold">Email</p>
                                                <p className="text-white/80">{contactInfo.support_email || settings.site_support_email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <span className="material-icons text-lg mt-0.5">schedule</span>
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
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                                            </a>
                                        )}
                                        {settings.social_twitter && (
                                            <a href={settings.social_twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-brand text-white rounded-full flex items-center justify-center hover:bg-brand-dark transition-colors">
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                                            </a>
                                        )}
                                        {settings.social_instagram && (
                                            <a href={settings.social_instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-brand text-white rounded-full flex items-center justify-center hover:bg-brand-dark transition-colors">
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                                            </a>
                                        )}
                                        {settings.social_linkedin && (
                                            <a href={settings.social_linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-brand text-white rounded-full flex items-center justify-center hover:bg-brand-dark transition-colors">
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                                            </a>
                                        )}
                                        {settings.social_tiktok && (
                                            <a href={settings.social_tiktok} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-brand text-white rounded-full flex items-center justify-center hover:bg-brand-dark transition-colors">
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/></svg>
                                            </a>
                                        )}
                                        {settings.social_whatsapp && (
                                            <a href={`https://wa.me/${settings.social_whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-brand text-white rounded-full flex items-center justify-center hover:bg-brand-dark transition-colors">
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
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
