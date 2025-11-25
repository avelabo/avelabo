import { Link } from '@inertiajs/react';

export default function Footer() {
    return (
        <footer className="bg-gray-50">
            {/* Newsletter Section */}
            <div className="bg-brand py-12">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <img src="/images/frontend/theme/icons/icon-email-2.svg" alt="Newsletter" className="w-12 h-12" />
                            <div className="text-white">
                                <h4 className="text-2xl font-bold text-white">Sign up to Newsletter</h4>
                                <p className="text-white/80">...and receive $25 coupon for first shopping.</p>
                            </div>
                        </div>
                        <div className="flex w-full lg:w-auto">
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                className="flex-1 lg:w-96 px-6 py-4 rounded-l-full border-0 focus:ring-0"
                            />
                            <button className="bg-heading hover:bg-gray-800 text-white px-8 py-4 rounded-r-full font-semibold transition-colors">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="border-b border-gray-200 py-10">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {[
                            { icon: 'icon-1.svg', title: 'Best prices & offers', desc: 'Orders $50 or more' },
                            { icon: 'icon-2.svg', title: 'Free delivery', desc: '24/7 amazing services' },
                            { icon: 'icon-3.svg', title: 'Great daily deal', desc: 'When you sign up' },
                            { icon: 'icon-4.svg', title: 'Wide assortment', desc: 'Mega Discounts' },
                            { icon: 'icon-5.svg', title: 'Easy returns', desc: 'Within 30 days' },
                        ].map((feature, index) => (
                            <div key={index} className="flex items-center gap-4">
                                <img src={`/images/frontend/theme/icons/${feature.icon}`} alt={feature.title} className="w-12 h-12" />
                                <div>
                                    <h6 className="font-semibold text-heading">{feature.title}</h6>
                                    <p className="text-sm text-body">{feature.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Footer */}
            <div className="py-16">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-8">
                        {/* Logo & Contact */}
                        <div className="lg:col-span-2">
                            <Link href="/">
                                <img src="/images/frontend/theme/logo.svg" alt="Nest" className="h-12 mb-6" />
                            </Link>
                            <p className="text-body mb-6">Awesome grocery store website template</p>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <img src="/images/frontend/theme/icons/icon-location.svg" alt="Location" className="w-5 h-5 mt-1" />
                                    <p className="text-heading"><strong>Address:</strong> 5171 W Campbell Ave undefined Kent, Utah 53127 United States</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <img src="/images/frontend/theme/icons/icon-contact.svg" alt="Phone" className="w-5 h-5" />
                                    <p className="text-heading"><strong>Call Us:</strong> (+91) - 540-025-124553</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <img src="/images/frontend/theme/icons/icon-email.svg" alt="Email" className="w-5 h-5" />
                                    <p className="text-heading"><strong>Email:</strong> sale@Nest.com</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <img src="/images/frontend/theme/icons/icon-clock.svg" alt="Hours" className="w-5 h-5" />
                                    <p className="text-heading"><strong>Hours:</strong> 10:00 - 18:00, Mon - Sat</p>
                                </div>
                            </div>
                        </div>

                        {/* Company */}
                        <div>
                            <h5 className="text-heading font-bold text-xl mb-6">Company</h5>
                            <ul className="space-y-3">
                                {['About Us', 'Delivery Information', 'Privacy Policy', 'Terms & Conditions', 'Contact Us', 'Support Center', 'Careers'].map((item, index) => (
                                    <li key={index}>
                                        <Link href="#" className="text-body hover:text-brand transition-colors">{item}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Account */}
                        <div>
                            <h5 className="text-heading font-bold text-xl mb-6">Account</h5>
                            <ul className="space-y-3">
                                {['Sign In', 'View Cart', 'My Wishlist', 'Track My Order', 'Help Ticket', 'Shipping Details', 'Compare products'].map((item, index) => (
                                    <li key={index}>
                                        <Link href="#" className="text-body hover:text-brand transition-colors">{item}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Corporate */}
                        <div>
                            <h5 className="text-heading font-bold text-xl mb-6">Corporate</h5>
                            <ul className="space-y-3">
                                {['Become a Vendor', 'Affiliate Program', 'Farm Business', 'Farm Careers', 'Our Suppliers', 'Accessibility', 'Promotions'].map((item, index) => (
                                    <li key={index}>
                                        <Link href="#" className="text-body hover:text-brand transition-colors">{item}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Popular */}
                        <div>
                            <h5 className="text-heading font-bold text-xl mb-6">Popular</h5>
                            <ul className="space-y-3">
                                {['Milk & Flavoured Milk', 'Butter and Margarine', 'Eggs Substitutes', 'Marmalades', 'Sour Cream and Dips', 'Tea & Kombucha', 'Cheese'].map((item, index) => (
                                    <li key={index}>
                                        <Link href="#" className="text-body hover:text-brand transition-colors">{item}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Footer */}
            <div className="border-t border-gray-200 py-6">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                        <p className="text-body text-sm">&copy; 2024, Nest - Laravel + Inertia + React. All rights reserved</p>
                        <div className="flex items-center gap-4">
                            <span className="text-body text-sm">Follow Us</span>
                            <div className="flex gap-2">
                                {['facebook', 'twitter', 'instagram', 'pinterest', 'youtube'].map((social) => (
                                    <a key={social} href="#" className="w-8 h-8 bg-brand rounded-full flex items-center justify-center hover:bg-brand-dark transition-colors">
                                        <img src={`/images/frontend/theme/icons/icon-${social}-white.svg`} alt={social} className="w-4 h-4" />
                                    </a>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-body">Secured Payment Gateways</span>
                            <img src="/images/frontend/theme/payment-method.png" alt="Payment Methods" className="h-6" />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
