import { useState, useEffect } from 'react';
import Header from '@/Components/Frontend/Header';
import Footer from '@/Components/Frontend/Footer';
import MobileMenu from '@/Components/Frontend/MobileMenu';

export default function FrontendLayout({ children }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isSticky, setIsSticky] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsSticky(window.scrollY > 200);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen">
            <Header
                isSticky={isSticky}
                onMobileMenuToggle={() => setMobileMenuOpen(true)}
            />

            <MobileMenu
                isOpen={mobileMenuOpen}
                onClose={() => setMobileMenuOpen(false)}
            />

            <main>
                {children}
            </main>

            <Footer />
        </div>
    );
}
