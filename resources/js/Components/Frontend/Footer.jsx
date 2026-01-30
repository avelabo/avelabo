import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import axios from 'axios';

export default function Footer() {
    const { siteSettings } = usePage().props;
    const [email, setEmail] = useState('');
    const [subscribing, setSubscribing] = useState(false);
    const [message, setMessage] = useState(null);

    const settings = siteSettings || {};

    const handleSubscribe = async (e) => {
        e.preventDefault();
        if (!email) return;

        setSubscribing(true);
        setMessage(null);

        try {
            const response = await axios.post(route('newsletter.subscribe'), { email });
            setMessage({ type: 'success', text: response.data.message });
            setEmail('');
        } catch (error) {
            const errorMessage = error.response?.data?.message
                || error.response?.data?.errors?.email?.[0]
                || 'Something went wrong. Please try again.';
            setMessage({ type: 'error', text: errorMessage });
        } finally {
            setSubscribing(false);
            // Clear message after 5 seconds
            setTimeout(() => setMessage(null), 5000);
        }
    };

    return (
        <footer className="bg-[#2a2a2a] text-white">
            {/* ================================================
                NEWSLETTER SECTION
                ================================================ */}
            <div className="relative overflow-hidden">
                {/* Decorative background */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#f1b945] to-[#e5ad3a]" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

                <div className="relative container mx-auto px-4 py-10 lg:py-12">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                        {/* Newsletter Text */}
                        <div className="flex items-center gap-5 text-center lg:text-left">
                            <div className="hidden sm:flex w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl items-center justify-center flex-shrink-0">
                                <svg className="w-8 h-8 text-[#2a2a2a]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="text-2xl lg:text-3xl font-bold text-[#2a2a2a]">
                                    {settings.newsletter_title || 'Stay in the Loop'}
                                </h4>
                                <p className="text-[#2a2a2a]/70 mt-1">
                                    {settings.newsletter_subtitle || 'Get exclusive deals, new arrivals, and special offers delivered to your inbox.'}
                                </p>
                            </div>
                        </div>

                        {/* Newsletter Form */}
                        <div className="w-full lg:w-auto">
                            <form onSubmit={handleSubscribe} className="flex">
                                <div className="relative flex-1 lg:flex-initial">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email address"
                                        className="
                                            w-full lg:w-80 xl:w-96 px-6 py-4 pr-4
                                            bg-white text-[#2a2a2a] placeholder:text-gray-400
                                            rounded-l-xl border-0
                                            focus:outline-none focus:ring-2 focus:ring-[#2a2a2a]/20
                                        "
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={subscribing}
                                    className="
                                        bg-[#2a2a2a] hover:bg-[#1a1a1a] text-white
                                        px-6 lg:px-8 py-4 rounded-r-xl
                                        font-semibold transition-all duration-200
                                        flex items-center gap-2
                                        disabled:opacity-70
                                    "
                                >
                                    {subscribing ? (
                                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                    ) : (
                                        <>
                                            <span className="hidden sm:inline">Subscribe</span>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                            </svg>
                                        </>
                                    )}
                                </button>
                            </form>
                            {message && (
                                <div className={`mt-3 px-4 py-2 rounded-lg text-sm ${
                                    message.type === 'success'
                                        ? 'bg-green-600/20 text-green-900'
                                        : 'bg-red-600/20 text-red-900'
                                }`}>
                                    {message.text}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ================================================
                FEATURES / TRUST BADGES
                ================================================ */}
            <div className="border-b border-white/10">
                <div className="container mx-auto px-4 py-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
                        {[
                            {
                                icon: (
                                    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                                    </svg>
                                ),
                                title: 'Best Prices',
                                desc: 'Competitive pricing'
                            },
                            {
                                icon: (
                                    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                                    </svg>
                                ),
                                title: 'Trusted Delivery',
                                desc: 'Safe & reliable shipping'
                            },
                            {
                                icon: (
                                    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                                    </svg>
                                ),
                                title: 'Secure Checkout',
                                desc: 'Protected payments'
                            },
                            {
                                icon: (
                                    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                                    </svg>
                                ),
                                title: '24/7 Support',
                                desc: 'We\'re here to help'
                            },
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-4 group"
                            >
                                <div className="w-14 h-14 rounded-xl bg-white/5 group-hover:bg-[#f1b945]/20 flex items-center justify-center text-[#f1b945] transition-colors duration-300 flex-shrink-0">
                                    {feature.icon}
                                </div>
                                <div>
                                    <span className="block font-bold text-white">{feature.title}</span>
                                    <p className="text-sm text-white/70">{feature.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ================================================
                MAIN FOOTER CONTENT
                ================================================ */}
            <div className="py-12 lg:py-16">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">

                        {/* Logo & About */}
                        <div className="lg:col-span-4">
                            <Link href="/" className="inline-block mb-6">
                                <img
                                    src="/images/logo/logo-alt-white-web-mid.png"
                                    alt={settings.site_name || 'Avelabo'}
                                    className="h-10 lg:h-11"
                                />
                            </Link>
                            <p className="text-white/70 leading-relaxed mb-6">
                                {settings.footer_about || 'Your trusted marketplace connecting you with quality products from verified sellers across Malawi and beyond.'}
                            </p>

                            {/* Contact Info */}
                            <div className="space-y-3">
                                <a
                                    href={`tel:${settings.site_phone || '+265999123456'}`}
                                    className="flex items-center gap-3 text-white/70 hover:text-[#f1b945] transition-colors group"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-white/5 group-hover:bg-[#f1b945]/20 flex items-center justify-center transition-colors">
                                        <svg className="w-5 h-5 text-[#f1b945]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                        </svg>
                                    </div>
                                    <span>{settings.site_phone || '+265 999 123 456'}</span>
                                </a>
                                <a
                                    href={`mailto:${settings.site_email || 'info@avelabo.com'}`}
                                    className="flex items-center gap-3 text-white/70 hover:text-[#f1b945] transition-colors group"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-white/5 group-hover:bg-[#f1b945]/20 flex items-center justify-center transition-colors">
                                        <svg className="w-5 h-5 text-[#f1b945]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                        </svg>
                                    </div>
                                    <span>{settings.site_email || 'info@avelabo.com'}</span>
                                </a>
                                <div className="flex items-center gap-3 text-white/70">
                                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                                        <svg className="w-5 h-5 text-[#f1b945]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                        </svg>
                                    </div>
                                    <span>{settings.site_address || 'Lilongwe, Malawi'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="lg:col-span-2">
                            <span className="block text-white font-bold text-lg mb-5">Shop</span>
                            <ul className="space-y-3">
                                <li><Link href="/shop" className="text-white/70 hover:text-[#f1b945] transition-colors">All Products</Link></li>
                                <li><Link href="/shop?sort=newest" className="text-white/70 hover:text-[#f1b945] transition-colors">New Arrivals</Link></li>
                                <li><Link href="/shop?deals=true" className="text-white/70 hover:text-[#f1b945] transition-colors">Deals & Offers</Link></li>
                                <li><Link href="/vendors" className="text-white/70 hover:text-[#f1b945] transition-colors">Our Sellers</Link></li>
                            </ul>
                        </div>

                        {/* Company */}
                        <div className="lg:col-span-2">
                            <span className="block text-white font-bold text-lg mb-5">Company</span>
                            <ul className="space-y-3">
                                <li><Link href="/about" className="text-white/70 hover:text-[#f1b945] transition-colors">About Us</Link></li>
                                <li><Link href="/contact" className="text-white/70 hover:text-[#f1b945] transition-colors">Contact</Link></li>
                                <li><Link href="/privacy-policy" className="text-white/70 hover:text-[#f1b945] transition-colors">Privacy Policy</Link></li>
                                <li><Link href="/purchase-guide" className="text-white/70 hover:text-[#f1b945] transition-colors">Purchase Guide</Link></li>
                            </ul>
                        </div>

                        {/* Account */}
                        <div className="lg:col-span-2">
                            <span className="block text-white font-bold text-lg mb-5">Account</span>
                            <ul className="space-y-3">
                                <li><Link href="/account" className="text-white/70 hover:text-[#f1b945] transition-colors">My Account</Link></li>
                                <li><Link href="/cart" className="text-white/70 hover:text-[#f1b945] transition-colors">View Cart</Link></li>
                                <li><Link href="/wishlist" className="text-white/70 hover:text-[#f1b945] transition-colors">Wishlist</Link></li>
                                <li><Link href="/account" className="text-white/70 hover:text-[#f1b945] transition-colors">Track Order</Link></li>
                            </ul>
                        </div>

                        {/* Sellers */}
                        <div className="lg:col-span-2">
                            <span className="block text-white font-bold text-lg mb-5">Sell With Us</span>
                            <ul className="space-y-3">
                                <li><Link href="/seller/register" className="text-white/70 hover:text-[#f1b945] transition-colors">Become a Seller</Link></li>
                                <li><Link href="/vendor-guide" className="text-white/70 hover:text-[#f1b945] transition-colors">Seller Guide</Link></li>
                                <li><Link href="/seller" className="text-white/70 hover:text-[#f1b945] transition-colors">Seller Portal</Link></li>
                                <li><Link href="/contact" className="text-white/70 hover:text-[#f1b945] transition-colors">Seller Support</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* ================================================
                BOTTOM BAR
                ================================================ */}
            <div className="border-t border-white/10">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                        {/* Copyright */}
                        <p className="text-white/60 text-sm text-center lg:text-left">
                            {settings.copyright_text || `© ${new Date().getFullYear()} Avelabo. All rights reserved.`}
                        </p>

                        {/* Social Links */}
                        <div className="flex items-center gap-3">
                            <span className="text-white/50 text-sm mr-2">Follow us</span>
                            {(settings.social_facebook || !settings.social_facebook) && (
                                <a
                                    href={settings.social_facebook || '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-lg bg-white/5 hover:bg-[#f1b945] flex items-center justify-center text-white/70 hover:text-[#2a2a2a] transition-all duration-200"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                    </svg>
                                </a>
                            )}
                            {(settings.social_twitter || !settings.social_twitter) && (
                                <a
                                    href={settings.social_twitter || '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-lg bg-white/5 hover:bg-[#f1b945] flex items-center justify-center text-white/70 hover:text-[#2a2a2a] transition-all duration-200"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                    </svg>
                                </a>
                            )}
                            {(settings.social_instagram || !settings.social_instagram) && (
                                <a
                                    href={settings.social_instagram || '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-lg bg-white/5 hover:bg-[#f1b945] flex items-center justify-center text-white/70 hover:text-[#2a2a2a] transition-all duration-200"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                    </svg>
                                </a>
                            )}
                            {settings.social_whatsapp && (
                                <a
                                    href={`https://wa.me/${settings.social_whatsapp.replace(/\D/g, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-lg bg-white/5 hover:bg-[#f1b945] flex items-center justify-center text-white/70 hover:text-[#2a2a2a] transition-all duration-200"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                    </svg>
                                </a>
                            )}
                        </div>

                        {/* Payment Methods */}
                        <div className="flex items-center gap-3">
                            <span className="text-white/50 text-sm">We accept</span>
                            <div className="bg-white rounded-lg px-3 py-1.5">
                                <img
                                    src="/images/frontend/theme/payment_logos.png"
                                    alt="Accepted payment methods"
                                    className="h-6 object-contain"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
