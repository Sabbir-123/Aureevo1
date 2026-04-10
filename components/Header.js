'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Menu, X, Search, User, Sun, Moon } from 'lucide-react';
import useCartStore from '@/store/cartStore';
import useAuthStore from '@/store/authStore';
import { useTheme } from '@/context/ThemeContext';
import styles from './Header.module.css';

export default function Header() {
    const { theme, toggleTheme } = useTheme();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const items = useCartStore((s) => s.items);
    const hydrate = useCartStore((s) => s.hydrate);
    const isHydrated = useCartStore((s) => s.isHydrated);
    const user = useAuthStore((s) => s.user);

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const isHome = pathname === '/';

    useEffect(() => {
        hydrate();
    }, [hydrate]);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setMobileMenuOpen(false);
    }, [pathname]);

    return (
        <header
            className={`${styles.header} ${scrolled ? styles.scrolled : ''} ${isHome && !scrolled ? styles.transparent : ''
                }`}
        >
            <div className={`container ${styles.headerInner}`}>
                {/* LEFT: LOGO */}
                <Link href="/" className={styles.logo}>
                    AUREEVO
                </Link>

                {/* CENTER: MENU */}
                <nav className={`${styles.nav} ${mobileMenuOpen ? styles.navOpen : ''}`}>
                    <button
                        className={styles.closeBtn}
                        onClick={() => setMobileMenuOpen(false)}
                        aria-label="Close menu"
                    >
                        <X size={20} />
                    </button>
                    <Link href="/" className={`${styles.navLink} ${pathname === '/' ? styles.active : ''}`}>
                        Home
                    </Link>
                    <Link href="/#shop" className={styles.navLink}>
                        New Arrival
                    </Link>
                    <Link href="/#shop" className={styles.navLink}>
                        Shop
                    </Link>
                    <Link href="/contact" className={styles.navLink}>
                        Contact
                    </Link>
                    <Link href="/" className={styles.navLink}>
                        About Us
                    </Link>
                </nav>

                {/* RIGHT: ACTIONS */}
                <div className={styles.actions}>
                    {/* Theme Toggle */}
                    <button 
                        className={styles.themeBtn} 
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                    >
                        {theme === 'dark' ? <Sun size={19} strokeWidth={1.5} /> : <Moon size={19} strokeWidth={1.5} />}
                    </button>

                    <button className={styles.iconBtn} aria-label="Search">
                        <Search size={19} strokeWidth={1.5} />
                    </button>

                    <Link href="/cart" className={styles.cartBtn} aria-label="Shopping cart">
                        <ShoppingBag size={19} strokeWidth={1.5} />
                        {isHydrated && totalItems > 0 && (
                            <span className={styles.cartBadge}>{totalItems}</span>
                        )}
                    </Link>

                    <Link href={user ? '/profile' : '/login'} className={styles.signInBtn}>
                        {user ? 'Account' : 'Sign In'}
                    </Link>

                    <button
                        className={styles.menuBtn}
                        onClick={() => setMobileMenuOpen(true)}
                        aria-label="Open menu"
                    >
                        <Menu size={22} strokeWidth={1.5} />
                    </button>
                </div>
            </div>

            {mobileMenuOpen && (
                <div className={styles.overlay} onClick={() => setMobileMenuOpen(false)} />
            )}
        </header>
    );
}
