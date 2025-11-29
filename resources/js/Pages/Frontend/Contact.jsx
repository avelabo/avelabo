import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import FrontendLayout from '@/Layouts/FrontendLayout';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
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
                        <span className="text-gray-400">Pages</span>
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
                                <h4 className="text-brand font-quicksand font-bold text-lg mb-4">How can help you ?</h4>
                                <h1 className="font-quicksand font-bold text-2xl lg:text-3xl text-heading mb-6">Let us know how we can help you</h1>
                                <p className="text-gray-500 mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.</p>
                                <p className="text-gray-500">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.</p>
                            </div>

                            {/* Right Column - Feature Boxes */}
                            <div className="lg:w-2/3">
                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* Feature Box 1 */}
                                    <div className="bg-white p-6 rounded-xl border border-gray-200 hover:border-brand hover:shadow-lg transition-all">
                                        <h5 className="font-quicksand font-bold text-heading mb-3">01. Visit Feedback</h5>
                                        <p className="text-gray-500 text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.</p>
                                    </div>

                                    {/* Feature Box 2 */}
                                    <div className="bg-white p-6 rounded-xl border border-gray-200 hover:border-brand hover:shadow-lg transition-all">
                                        <h5 className="font-quicksand font-bold text-heading mb-3">02. Employer Services</h5>
                                        <p className="text-gray-500 text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.</p>
                                    </div>

                                    {/* Feature Box 3 */}
                                    <div className="bg-white p-6 rounded-xl border border-gray-200 hover:border-brand hover:shadow-lg transition-all">
                                        <h5 className="font-quicksand font-bold text-brand mb-3">03. Billing Inquiries</h5>
                                        <p className="text-gray-500 text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.</p>
                                    </div>

                                    {/* Feature Box 4 */}
                                    <div className="bg-white p-6 rounded-xl border border-gray-200 hover:border-brand hover:shadow-lg transition-all">
                                        <h5 className="font-quicksand font-bold text-heading mb-3">04. General Inquiries</h5>
                                        <p className="text-gray-500 text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.</p>
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
                    <div className="bg-gray-200 rounded-2xl overflow-hidden h-80 flex items-center justify-center">
                        <div className="text-center">
                            <i className="fi fi-rs-marker text-6xl text-gray-400 mb-4 block"></i>
                            <p className="text-gray-400 text-lg font-quicksand font-semibold">Map placeholder</p>
                            <p className="text-gray-400 text-sm">Interactive map would be displayed here</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Location Cards & Contact Form */}
            <section className="pb-12 lg:pb-20">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="max-w-5xl mx-auto">
                        {/* Location Cards */}
                        <div className="grid md:grid-cols-3 gap-6 mb-16">
                            {/* Office Card */}
                            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all">
                                <h4 className="text-brand font-quicksand font-bold text-lg mb-4">Office</h4>
                                <address className="not-italic text-gray-500 text-sm leading-7 mb-4">
                                    205 North Michigan Avenue, Suite 810<br />
                                    Chicago, 60601, USA<br />
                                    <strong className="text-heading">Phone:</strong> (123) 456-7890<br />
                                    <strong className="text-heading">Email:</strong> contact@Evara.com
                                </address>
                                <a href="#" className="inline-flex items-center gap-2 bg-brand text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-brand-dark transition-colors hover:-translate-y-0.5 transform duration-300">
                                    <i className="fi fi-rs-marker"></i> View map
                                </a>
                            </div>

                            {/* Studio Card */}
                            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all">
                                <h4 className="text-brand font-quicksand font-bold text-lg mb-4">Studio</h4>
                                <address className="not-italic text-gray-500 text-sm leading-7 mb-4">
                                    205 North Michigan Avenue, Suite 810<br />
                                    Chicago, 60601, USA<br />
                                    <strong className="text-heading">Phone:</strong> (123) 456-7890<br />
                                    <strong className="text-heading">Email:</strong> contact@Evara.com
                                </address>
                                <a href="#" className="inline-flex items-center gap-2 bg-brand text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-brand-dark transition-colors hover:-translate-y-0.5 transform duration-300">
                                    <i className="fi fi-rs-marker"></i> View map
                                </a>
                            </div>

                            {/* Shop Card */}
                            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all">
                                <h4 className="text-brand font-quicksand font-bold text-lg mb-4">Shop</h4>
                                <address className="not-italic text-gray-500 text-sm leading-7 mb-4">
                                    205 North Michigan Avenue, Suite 810<br />
                                    Chicago, 60601, USA<br />
                                    <strong className="text-heading">Phone:</strong> (123) 456-7890<br />
                                    <strong className="text-heading">Email:</strong> contact@Evara.com
                                </address>
                                <a href="#" className="inline-flex items-center gap-2 bg-brand text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-brand-dark transition-colors hover:-translate-y-0.5 transform duration-300">
                                    <i className="fi fi-rs-marker"></i> View map
                                </a>
                            </div>
                        </div>

                        {/* Contact Form & Image */}
                        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                            {/* Contact Form */}
                            <div className="lg:w-2/3">
                                <div className="bg-white border border-gray-200 rounded-xl p-6 lg:p-8">
                                    <h5 className="text-brand font-quicksand font-semibold mb-2">Contact form</h5>
                                    <h2 className="font-quicksand font-bold text-2xl text-heading mb-2">Drop Us a Line</h2>
                                    <p className="text-gray-400 text-sm mb-8">Your email address will not be published. Required fields are marked *</p>

                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        <div className="grid md:grid-cols-2 gap-5">
                                            <div>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    placeholder="First Name"
                                                    className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:border-brand focus:outline-none transition-colors"
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    placeholder="Your Email"
                                                    className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:border-brand focus:outline-none transition-colors"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-5">
                                            <div>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    placeholder="Your Phone"
                                                    className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:border-brand focus:outline-none transition-colors"
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    type="text"
                                                    name="subject"
                                                    value={formData.subject}
                                                    onChange={handleChange}
                                                    placeholder="Subject"
                                                    className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:border-brand focus:outline-none transition-colors"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <textarea
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                placeholder="Message"
                                                rows="5"
                                                className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:border-brand focus:outline-none transition-colors resize-none"
                                            ></textarea>
                                        </div>

                                        <button
                                            type="submit"
                                            className="bg-brand hover:bg-brand-dark text-white font-bold px-8 py-4 rounded-lg transition-colors hover:-translate-y-0.5 transform duration-300"
                                        >
                                            Send message
                                        </button>
                                    </form>
                                </div>
                            </div>

                            {/* Contact Image */}
                            <div className="hidden lg:block lg:w-1/3">
                                <img
                                    src="/images/frontend/page/contact-2.png"
                                    alt="Contact"
                                    className="rounded-2xl w-full h-auto mt-12"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </FrontendLayout>
    );
}
