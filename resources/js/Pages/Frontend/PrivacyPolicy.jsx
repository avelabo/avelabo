import { Head, Link } from '@inertiajs/react';
import FrontendLayout from '@/Layouts/FrontendLayout';

export default function PrivacyPolicy() {
    const categories = [
        { name: 'Milks & Dairies', icon: '/images/frontend/icons/category-1.svg', count: 30 },
        { name: 'Clothing', icon: '/images/frontend/icons/category-2.svg', count: 35 },
        { name: 'Pet Foods', icon: '/images/frontend/icons/category-3.svg', count: 42 },
        { name: 'Baking material', icon: '/images/frontend/icons/category-4.svg', count: 68 },
        { name: 'Fresh Fruit', icon: '/images/frontend/icons/category-5.svg', count: 87 },
    ];

    return (
        <FrontendLayout>
            <Head title="Privacy Policy" />

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
                        <span className="text-brand">Privacy Policy</span>
                    </nav>
                </div>
            </section>

            {/* Privacy Policy Content */}
            <section className="py-12 lg:py-16">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex flex-col lg:flex-row gap-8">
                            {/* Left Column - Main Content (9/12) */}
                            <div className="lg:w-9/12">
                                <article className="lg:pr-8">
                                    {/* Article Header */}
                                    <header className="mb-8 border-b border-gray-200 pb-6">
                                        <h1 className="font-quicksand font-bold text-3xl lg:text-4xl text-heading mb-4">Privacy Policy</h1>
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
                                            <span>By <a href="#" className="text-brand hover:underline">John</a></span>
                                            <span className="text-gray-400">|</span>
                                            <span>9 April 2020</span>
                                            <span className="text-gray-400">|</span>
                                            <span>8 mins read</span>
                                            <span className="text-gray-400">|</span>
                                            <span>29k Views</span>
                                        </div>
                                    </header>

                                    {/* Article Content */}
                                    <div className="prose prose-lg max-w-none">
                                        {/* Section 1 */}
                                        <h4 className="font-quicksand font-bold text-xl text-heading mb-4 mt-8">Welcome to AliThemes's Privacy Policy</h4>
                                        <ol className="list-decimal list-outside ml-6 space-y-4 text-gray-500 mb-8">
                                            <li>Hi there, we're AliThemes Pty Ltd (ABN 11 119 159 741) of Level 1, 121 King Street Melbourne, 3000, Australia ("<strong className="text-heading">AliThemes</strong>") and welcome to our privacy policy which also applies to our Affiliate Companies. This policy sets out how we handle your personal information if you're an AliThemes user or visitor to our Sites. It applies across AliThemes Elements, AliThemes Market, AliThemes Twenty20, AliThemes Studio, AliThemes Sites, AliThemes Tuts+ and Placeit (the "<strong className="text-heading">Sites</strong>").</li>
                                            <li>When we say 'we', 'us' or 'AliThemes' it's because that's who we are and we own and run the Sites.</li>
                                            <li>If we say 'policy' we're talking about this privacy policy. If we say 'user terms' we're talking about the rules for using each of the Sites. The rules vary by product and each product makes them separately available and seeks consent to them separately to this policy.</li>
                                        </ol>

                                        {/* Section 2 */}
                                        <h4 className="font-quicksand font-bold text-xl text-heading mb-4 mt-8">The type of personal information we collect</h4>
                                        <ol className="list-decimal list-outside ml-6 space-y-4 text-gray-500 mb-8" start="4">
                                            <li>We collect certain personal information about visitors and users of our Sites.</li>
                                            <li>The most common types of information we collect include things like: user-names, member names, email addresses, IP addresses, other contact details, survey responses, blogs, photos, payment information such as payment agent details, transactional details, tax information, support queries, forum comments (if applicable), content you direct us to make available on our Sites (such as item descriptions), your actions on our Sites (including any selections or inputs into items) and web and email analytics data. We will also collect personal information from job applications (such as, your CV, the application form itself, cover letter and interview notes).</li>
                                        </ol>

                                        {/* Section 3 */}
                                        <h4 className="font-quicksand font-bold text-xl text-heading mb-4 mt-8">How we collect personal information</h4>
                                        <ol className="list-decimal list-outside ml-6 space-y-4 text-gray-500 mb-8" start="6">
                                            <li>We collect personal information directly when you provide it to us, automatically as you navigate through the Sites, or through other people when you use services associated with the Sites.</li>
                                            <li>We collect your personal information when you provide it to us when you complete membership registration and buy or provide items or services on our Sites, subscribe to a newsletter, email list, submit feedback, enter a contest, fill out a survey, or send us a communication.</li>
                                            <li>As the operator of digital content marketplaces, we have a legitimate interest in verifying the identity of our authors. We believe that knowing who our authors are will strengthen the integrity of our marketplaces by reducing fraud, making authors more accountable for their content and giving AliThemes and customers the ability to enforce contracts for authors who break the rules.</li>
                                        </ol>

                                        {/* Section 4 */}
                                        <h4 className="font-quicksand font-bold text-xl text-heading mb-4 mt-8">Personal information we collect about you from others</h4>
                                        <ol className="list-decimal list-outside ml-6 space-y-4 text-gray-500 mb-8" start="9">
                                            <li>
                                                Although we generally collect personal information directly from you, on occasion, we also collect certain categories of personal information about you from other sources. In particular:
                                                <ul className="list-disc list-outside ml-6 mt-3 space-y-2">
                                                    <li>financial and/or transaction details from payment providers located in the US, UK, and Australia in order to process a transaction;</li>
                                                    <li>third party service providers (like Google, Facebook) who are located in the US or UK, which may provide information about you when you link, connect, or login to your account with the third party provider;</li>
                                                    <li>other third party sources/and or partners from Australia, US or UK, whereby we receive additional information about you (to the extent permitted by applicable law), such as demographic data or fraud detection information.</li>
                                                </ul>
                                            </li>
                                        </ol>

                                        {/* Section 5 */}
                                        <h4 className="font-quicksand font-bold text-xl text-heading mb-4 mt-8">How we use personal information</h4>
                                        <ol className="list-decimal list-outside ml-6 space-y-4 text-gray-500 mb-8" start="10">
                                            <li>
                                                We will use your personal information:
                                                <ul className="list-disc list-outside ml-6 mt-3 space-y-2">
                                                    <li>To fulfil a contract, or take steps linked to a contract: in particular, in facilitating and processing transactions that take place on the Sites, like where you purchase an item from our marketplace.</li>
                                                    <li>Where this is necessary for purposes which are in our, or third parties', legitimate interests.</li>
                                                    <li>Where you give us consent: providing you with marketing information about products and services which we feel may interest you.</li>
                                                    <li>For purposes which are required by law.</li>
                                                    <li>For the purpose of responding to requests by government, a court of law, or law enforcement authorities conducting an investigation.</li>
                                                </ul>
                                            </li>
                                        </ol>

                                        {/* Section 6 */}
                                        <h4 className="font-quicksand font-bold text-xl text-heading mb-4 mt-8">When we disclose your personal information</h4>
                                        <ol className="list-decimal list-outside ml-6 space-y-4 text-gray-500 mb-8" start="11">
                                            <li>
                                                We will disclose personal information to the following recipients:
                                                <ul className="list-disc list-outside ml-6 mt-3 space-y-2">
                                                    <li>companies that are in the AliThemes group which are located in Australia, Mexico and the US;</li>
                                                    <li>if applicable, authors of any items or services made available to you, so they can facilitate support and license validation;</li>
                                                    <li>subcontractors and service providers who assist us in connection with the ways we use personal information;</li>
                                                    <li>our professional advisers (lawyers, accountants, financial advisers etc.);</li>
                                                    <li>regulators and government authorities in connection with our compliance procedures and obligations;</li>
                                                    <li>a purchaser or prospective purchaser of all or part of our assets or our business, and their professional advisers, in connection with the purchase;</li>
                                                    <li>other recipients where we are authorised or required by law to do so.</li>
                                                </ul>
                                            </li>
                                        </ol>

                                        {/* Section 7 */}
                                        <h4 className="font-quicksand font-bold text-xl text-heading mb-4 mt-8">How we keep your personal information secure</h4>
                                        <ol className="list-decimal list-outside ml-6 space-y-4 text-gray-500 mb-8" start="12">
                                            <li>We store personal information on secure servers that are managed by us and our service providers, and occasionally hard copy files that are kept in a secure location. Personal information that we store or transmit is protected by security and access controls, including username and password authentication, two-factor authentication, and data encryption where appropriate.</li>
                                        </ol>

                                        {/* Section 8 */}
                                        <h4 className="font-quicksand font-bold text-xl text-heading mb-4 mt-8">How you can access your personal information</h4>
                                        <ol className="list-decimal list-outside ml-6 space-y-4 text-gray-500 mb-8" start="13">
                                            <li>You can access some of the personal information that we collect about you by logging in to your account. You also have the right to make a request to access other personal information we hold about you and to request corrections of any errors in that data. You can also close the account you have with us for any of our Sites at any time. To make an access or correction request, contact our privacy champion using the contact details at the end of this policy.</li>
                                        </ol>

                                        {/* Section 9 */}
                                        <h4 className="font-quicksand font-bold text-xl text-heading mb-4 mt-8">Marketing Choices</h4>
                                        <ol className="list-decimal list-outside ml-6 space-y-4 text-gray-500 mb-8" start="14">
                                            <li>Where we have your consent to do so (e.g. if you have subscribed to one of our email lists or have indicated that you are interested in receiving offers or information from us), we send you marketing communications by email about products and services that we feel may be of interest to you. You can 'opt-out' of such communications if you would prefer not to receive them in the future by using the "unsubscribe" facility provided in the communication itself.</li>
                                            <li>You also have choices about cookies, as described below. By modifying your browser preferences, you have the choice to accept all cookies, to be notified when a cookie is set, or to reject all cookies. If you choose to reject cookies some parts of our Sites may not work properly in your case.</li>
                                        </ol>

                                        {/* Section 10 */}
                                        <h4 className="font-quicksand font-bold text-xl text-heading mb-4 mt-8">Cookies and web analytics</h4>
                                        <ol className="list-decimal list-outside ml-6 space-y-4 text-gray-500 mb-8" start="16">
                                            <li>For more information about how we use cookies, web beacons and similar technologies see our cookie policy <a href="#" className="text-brand hover:underline">here</a> and for more general information on cookies, see <a href="#" className="text-brand hover:underline">http://www.allaboutcookies.org</a>.</li>
                                            <li>
                                                When you visit our Sites, there's certain information that's recorded which is generally anonymous information and does not reveal your identity. If you're logged into your account some of this information could be associated with your account. We're talking about the following kinds of details:
                                                <ul className="list-disc list-outside ml-6 mt-3 space-y-2">
                                                    <li>your IP address or proxy server IP address;</li>
                                                    <li>the domain name you requested;</li>
                                                    <li>the name of your internet service provider;</li>
                                                    <li>the date and time of your visit to the website;</li>
                                                    <li>the length of your session;</li>
                                                    <li>the pages which you have accessed;</li>
                                                    <li>the number of times you access our site within any month;</li>
                                                    <li>the file URL you look at and information relating to it;</li>
                                                    <li>the website which referred you to our Sites;</li>
                                                    <li>the operating system which your computer uses; and</li>
                                                    <li>the technical capabilities of your web browser.</li>
                                                </ul>
                                            </li>
                                        </ol>
                                    </div>
                                </article>
                            </div>

                            {/* Right Column - Sidebar (3/12) */}
                            <aside className="lg:w-3/12">
                                {/* Category Widget */}
                                <div className="bg-white border border-gray-200 rounded-xl p-6">
                                    <h5 className="font-quicksand font-bold text-heading text-lg mb-6 pb-4 border-b border-gray-200">Category</h5>
                                    <ul className="space-y-3">
                                        {categories.map((category, index) => (
                                            <li key={index}>
                                                <Link href="/shop" className="flex items-center justify-between group">
                                                    <div className="flex items-center gap-3">
                                                        <img src={category.icon} alt="" className="w-7" />
                                                        <span className="text-heading group-hover:text-brand transition-colors">{category.name}</span>
                                                    </div>
                                                    <span className="text-brand font-semibold">{category.count}</span>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </aside>
                        </div>
                    </div>
                </div>
            </section>
        </FrontendLayout>
    );
}
