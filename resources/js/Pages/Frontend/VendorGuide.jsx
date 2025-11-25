import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import FrontendLayout from '@/Layouts/FrontendLayout';

export default function VendorGuide() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        telephone: '',
        subject: '',
        message: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission
        console.log('Form submitted:', formData);
    };

    return (
        <FrontendLayout>
            <Head title="Vendor Guide - Open a Store" />

            {/* Breadcrumb */}
            <div className="bg-white py-4 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center gap-2 text-sm">
                        <Link href="/" className="text-gray-500 hover:text-brand transition-colors">
                            <i className="fi fi-rs-home"></i>
                        </Link>
                        <span className="text-gray-500">/</span>
                        <Link href="/vendors" className="text-gray-500 hover:text-brand transition-colors">Vendor</Link>
                        <span className="text-gray-500">/</span>
                        <span className="text-brand">Open a Store</span>
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <section className="py-12 lg:py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="max-w-2xl mx-auto text-center mb-16">
                        <h1 className="text-3xl lg:text-5xl font-bold text-heading font-quicksand mb-6">
                            Start an online retail business with <span className="text-brand">Nest</span> today
                        </h1>
                        <p className="text-lg text-gray-500">
                            Sell your products and accept credit card payments from buying customers. Shopify gives you everything you need to run a successful online store.
                        </p>
                    </div>

                    {/* Feature Cards */}
                    <div className="max-w-5xl mx-auto mb-16">
                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Feature Card 1 */}
                            <div className="bg-white rounded-xl p-8 text-center border border-gray-100 hover:shadow-lg hover:border-brand transition-all">
                                <img src="/images/frontend/icons/icon-1.svg" alt="Best Prices" className="w-16 h-16 mx-auto mb-6" />
                                <h4 className="text-xl font-bold text-heading font-quicksand mb-4">Best Prices & Offers</h4>
                                <p className="text-gray-500 text-sm mb-4">There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form</p>
                                <a href="#" className="text-brand hover:text-brand-dark font-semibold text-sm">Read more</a>
                            </div>

                            {/* Feature Card 2 */}
                            <div className="bg-white rounded-xl p-8 text-center border border-gray-100 hover:shadow-lg hover:border-brand transition-all">
                                <img src="/images/frontend/icons/icon-2.svg" alt="Wide Assortment" className="w-16 h-16 mx-auto mb-6" />
                                <h4 className="text-xl font-bold text-heading font-quicksand mb-4">Wide Assortment</h4>
                                <p className="text-gray-500 text-sm mb-4">There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form</p>
                                <a href="#" className="text-brand hover:text-brand-dark font-semibold text-sm">Read more</a>
                            </div>

                            {/* Feature Card 3 */}
                            <div className="bg-white rounded-xl p-8 text-center border border-gray-100 hover:shadow-lg hover:border-brand transition-all">
                                <img src="/images/frontend/icons/icon-3.svg" alt="Free Delivery" className="w-16 h-16 mx-auto mb-6" />
                                <h4 className="text-xl font-bold text-heading font-quicksand mb-4">Free Delivery</h4>
                                <p className="text-gray-500 text-sm mb-4">There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form</p>
                                <a href="#" className="text-brand hover:text-brand-dark font-semibold text-sm">Read more</a>
                            </div>
                        </div>
                    </div>

                    {/* Guide Content */}
                    <div className="max-w-3xl mx-auto">
                        <div className="prose prose-lg mb-12">
                            {/* Step 1 */}
                            <div className="mb-10">
                                <h3 className="text-2xl font-bold text-heading font-quicksand mb-4">1. Account Registering</h3>
                                <p className="text-gray-500 mb-4">Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla modi dolores neque omnis ipsa? Quia, nam voluptas! Aut, magnam molestias:</p>
                                <ul className="list-disc list-inside space-y-2 text-gray-500 mb-6">
                                    <li>Name (required)</li>
                                    <li>Age (required)</li>
                                    <li>Date of birth (required)</li>
                                    <li>Passport/ ID no. (required)</li>
                                    <li>Current career (required)</li>
                                    <li>Mobile phone numbers (required)</li>
                                    <li>Email address (required)</li>
                                    <li>Hobbies & interests (optional)</li>
                                    <li>Social profiles (optional)</li>
                                </ul>
                            </div>

                            {/* Step 2 */}
                            <div className="mb-10">
                                <h3 className="text-2xl font-bold text-heading font-quicksand mb-4">2. Choose a package</h3>
                                <p className="text-gray-500">Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit officia necessitatibus repellat placeat aut enim recusandae assumenda adipisci quisquam, deserunt iure veritatis cupiditate modi aspernatur accusantium, mollitia doloribus. Velit, iste.</p>
                            </div>

                            {/* Step 3 */}
                            <div className="mb-10">
                                <h3 className="text-2xl font-bold text-heading font-quicksand mb-4">3. Add your products</h3>
                                <p className="text-gray-500">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Libero ut autem sed! Assumenda, nostrum non doloribus tenetur, pariatur veritatis harum natus ipsam maiores dolorem repudiandae laboriosam, cupiditate odio earum eum?</p>
                            </div>

                            {/* Step 4 */}
                            <div className="mb-10">
                                <h3 className="text-2xl font-bold text-heading font-quicksand mb-4">4. Start selling</h3>
                                <p className="text-gray-500">Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam nesciunt nam aut magnam libero aspernatur eaque praesentium? Tempore labore quis neque? Magni.</p>
                            </div>

                            {/* Step 5 */}
                            <div className="mb-10">
                                <h3 className="text-2xl font-bold text-heading font-quicksand mb-4">5. Accepted Credit Cards</h3>
                                <ul className="list-disc list-inside space-y-2 text-gray-500 mb-4">
                                    <li>Visa</li>
                                    <li>Mastercards</li>
                                    <li>American Express</li>
                                    <li>Discover</li>
                                </ul>
                                <p className="text-sm text-gray-500 italic">*Taxes are calculated by your local bank and location.</p>
                            </div>

                            {/* Step 6 */}
                            <div className="mb-10">
                                <h3 className="text-2xl font-bold text-heading font-quicksand mb-4">6. Get money</h3>
                                <ul className="list-disc list-inside space-y-2 text-gray-500">
                                    <li>Updated content on a regular basis</li>
                                    <li>Secure & hassle-free payment</li>
                                    <li>1-click checkout</li>
                                    <li>Easy access & smart user dashboard</li>
                                </ul>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="bg-white rounded-xl p-8 lg:p-10 border border-gray-100">
                            <h5 className="text-brand font-semibold mb-2">Contact form</h5>
                            <h2 className="text-2xl font-bold text-heading font-quicksand mb-2">Drop Us a Line</h2>
                            <p className="text-gray-500 text-sm mb-8">Your email address will not be published. Required fields are marked *</p>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="First Name"
                                        className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm focus:border-brand focus:outline-none"
                                    />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Your Email"
                                        className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm focus:border-brand focus:outline-none"
                                    />
                                </div>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <input
                                        type="tel"
                                        name="telephone"
                                        value={formData.telephone}
                                        onChange={handleChange}
                                        placeholder="Your Phone"
                                        className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm focus:border-brand focus:outline-none"
                                    />
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        placeholder="Subject"
                                        className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm focus:border-brand focus:outline-none"
                                    />
                                </div>
                                <textarea
                                    name="message"
                                    rows="5"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Message"
                                    className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm focus:border-brand focus:outline-none resize-none"
                                ></textarea>
                                <button
                                    type="submit"
                                    className="bg-brand hover:bg-brand-dark text-white px-8 py-3 rounded-md font-semibold transition-colors"
                                >
                                    Send message
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </FrontendLayout>
    );
}
