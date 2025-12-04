import { Link, usePage } from '@inertiajs/react';

export default function Footer() {
    const { siteSettings } = usePage().props;

    const settings = siteSettings || {};

    return (
        <footer className="bg-gray-50">
            {/* Newsletter Section */}
            <div className="bg-brand py-12">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <img src="/images/frontend/theme/icons/icon-email-2.svg" alt="Newsletter" className="w-12 h-12" />
                            <div className="text-white">
                                <h4 className="text-2xl font-bold text-white">
                                    {settings.newsletter_title || 'Sign up to Newsletter'}
                                </h4>
                                <p className="text-white/80">
                                    {settings.newsletter_subtitle || '...and receive updates on latest deals and promotions.'}
                                </p>
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
                                <img src="/images/logo/logo-web-small.png" alt={settings.site_name || 'Avelabo'} className="h-12 mb-6" />
                            </Link>
                            <p className="text-body mb-6">
                                {settings.footer_about || 'Your one-stop marketplace for quality products from around the world.'}
                            </p>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <img src="/images/frontend/theme/icons/icon-location.svg" alt="Location" className="w-5 h-5 mt-1" />
                                    <p className="text-heading">
                                        <strong>Address:</strong> {settings.site_address || 'Area 47, Sector 3, Lilongwe, Malawi'}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <img src="/images/frontend/theme/icons/icon-contact.svg" alt="Phone" className="w-5 h-5" />
                                    <p className="text-heading">
                                        <strong>Call Us:</strong> {settings.site_phone || '+265 999 123 456'}
                                        {settings.site_phone_2 && ` / ${settings.site_phone_2}`}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <img src="/images/frontend/theme/icons/icon-email.svg" alt="Email" className="w-5 h-5" />
                                    <p className="text-heading">
                                        <strong>Email:</strong> {settings.site_email || 'info@avelabo.mw'}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <img src="/images/frontend/theme/icons/icon-clock.svg" alt="Hours" className="w-5 h-5" />
                                    <p className="text-heading">
                                        <strong>Hours:</strong> {settings.site_hours || 'Mon-Fri: 8:00 AM - 5:00 PM'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Company */}
                        <div>
                            <h5 className="text-heading font-bold text-xl mb-6">Company</h5>
                            <ul className="space-y-3">
                                <li><Link href="/about" className="text-body hover:text-brand transition-colors">About Us</Link></li>
                                <li><Link href="/contact" className="text-body hover:text-brand transition-colors">Contact Us</Link></li>
                                <li><Link href="/privacy-policy" className="text-body hover:text-brand transition-colors">Privacy Policy</Link></li>
                                <li><Link href="/purchase-guide" className="text-body hover:text-brand transition-colors">Purchase Guide</Link></li>
                                <li><Link href="/vendor-guide" className="text-body hover:text-brand transition-colors">Vendor Guide</Link></li>
                            </ul>
                        </div>

                        {/* Account */}
                        <div>
                            <h5 className="text-heading font-bold text-xl mb-6">Account</h5>
                            <ul className="space-y-3">
                                <li><Link href="/login" className="text-body hover:text-brand transition-colors">Sign In</Link></li>
                                <li><Link href="/cart" className="text-body hover:text-brand transition-colors">View Basket</Link></li>
                                <li><Link href="/wishlist" className="text-body hover:text-brand transition-colors">My Wishlist</Link></li>
                                <li><Link href="/account" className="text-body hover:text-brand transition-colors">Track My Order</Link></li>
                                <li><Link href="/compare" className="text-body hover:text-brand transition-colors">Compare Products</Link></li>
                            </ul>
                        </div>

                        {/* Sellers */}
                        <div>
                            <h5 className="text-heading font-bold text-xl mb-6">Sellers</h5>
                            <ul className="space-y-3">
                                <li><Link href="/seller/register" className="text-body hover:text-brand transition-colors">Become a Vendor</Link></li>
                                <li><Link href="/vendors" className="text-body hover:text-brand transition-colors">Our Vendors</Link></li>
                                <li><Link href="/vendor-guide" className="text-body hover:text-brand transition-colors">Vendor Guide</Link></li>
                                <li><Link href="/seller" className="text-body hover:text-brand transition-colors">Seller Portal</Link></li>
                            </ul>
                        </div>

                        {/* Support */}
                        <div>
                            <h5 className="text-heading font-bold text-xl mb-6">Support</h5>
                            <ul className="space-y-3">
                                <li><Link href="/contact" className="text-body hover:text-brand transition-colors">Help Center</Link></li>
                                <li><Link href="/purchase-guide" className="text-body hover:text-brand transition-colors">How to Buy</Link></li>
                                <li><Link href="/contact" className="text-body hover:text-brand transition-colors">Shipping Info</Link></li>
                                <li><Link href="/contact" className="text-body hover:text-brand transition-colors">Returns & Refunds</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Footer */}
            <div className="border-t border-gray-200 py-6">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                        <p className="text-body text-sm">
                            {settings.copyright_text || `© ${new Date().getFullYear()} Avelabo. All Rights Reserved.`}
                        </p>
                        <div className="flex items-center gap-4">
                            <span className="text-body text-sm">Follow Us</span>
                            <div className="flex gap-2">
                                {settings.social_facebook && (
                                    <a href={settings.social_facebook} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-brand rounded-full flex items-center justify-center hover:bg-brand-dark transition-colors">
                                        <img src="/images/frontend/theme/icons/icon-facebook-white.svg" alt="Facebook" className="w-4 h-4" />
                                    </a>
                                )}
                                {settings.social_twitter && (
                                    <a href={settings.social_twitter} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-brand rounded-full flex items-center justify-center hover:bg-brand-dark transition-colors">
                                        <img src="/images/frontend/theme/icons/icon-twitter-white.svg" alt="Twitter" className="w-4 h-4" />
                                    </a>
                                )}
                                {settings.social_instagram && (
                                    <a href={settings.social_instagram} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-brand rounded-full flex items-center justify-center hover:bg-brand-dark transition-colors">
                                        <img src="/images/frontend/theme/icons/icon-instagram-white.svg" alt="Instagram" className="w-4 h-4" />
                                    </a>
                                )}
                                {settings.social_youtube && (
                                    <a href={settings.social_youtube} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-brand rounded-full flex items-center justify-center hover:bg-brand-dark transition-colors">
                                        <img src="/images/frontend/theme/icons/icon-youtube-white.svg" alt="YouTube" className="w-4 h-4" />
                                    </a>
                                )}
                                {settings.social_whatsapp && (
                                    <a href={`https://wa.me/${settings.social_whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-brand rounded-full flex items-center justify-center hover:bg-brand-dark transition-colors">
                                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                        </svg>
                                    </a>
                                )}
                                {/* Fallback if no social links configured */}
                                {!settings.social_facebook && !settings.social_twitter && !settings.social_instagram && !settings.social_youtube && (
                                    <>
                                        <a href="#" className="w-8 h-8 bg-brand rounded-full flex items-center justify-center hover:bg-brand-dark transition-colors">
                                            <img src="/images/frontend/theme/icons/icon-facebook-white.svg" alt="Facebook" className="w-4 h-4" />
                                        </a>
                                        <a href="#" className="w-8 h-8 bg-brand rounded-full flex items-center justify-center hover:bg-brand-dark transition-colors">
                                            <img src="/images/frontend/theme/icons/icon-twitter-white.svg" alt="Twitter" className="w-4 h-4" />
                                        </a>
                                        <a href="#" className="w-8 h-8 bg-brand rounded-full flex items-center justify-center hover:bg-brand-dark transition-colors">
                                            <img src="/images/frontend/theme/icons/icon-instagram-white.svg" alt="Instagram" className="w-4 h-4" />
                                        </a>
                                    </>
                                )}
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
