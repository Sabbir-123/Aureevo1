'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Menu, X, Sun, Moon } from 'lucide-react';
import useCartStore from '@/store/cartStore';
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

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const isHome = pathname === '/';

    useEffect(() => {
        hydrate();
    }, [hydrate]);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
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
                <Link href="/" className={styles.logo}>
                    AUREEVO
                </Link>

                <nav className={`${styles.nav} ${mobileMenuOpen ? styles.navOpen : ''}`}>
                    <button
                        className={styles.closeBtn}
                        onClick={() => setMobileMenuOpen(false)}
                        aria-label="Close menu"
                    >
                        <X size={24} />
                    </button>
                    <Link href="/" className={`${styles.navLink} ${pathname === '/' ? styles.active : ''}`}>
                        Home
                    </Link>
                    <Link href="/#shop" className={styles.navLink}>
                        Shop
                    </Link>
                    <Link href="/cart" className={`${styles.navLink} ${styles.navLinkMobileCart}`}>
                        Cart {isHydrated && totalItems > 0 && `(${totalItems})`}
                    </Link>
                </nav>

                <div className={styles.actions}>
                    <button
                        className={styles.themeBtn}
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                        style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    >
                        {theme === 'dark' ? <Sun size={20} strokeWidth={1.5} /> : <Moon size={20} strokeWidth={1.5} />}
                    </button>

                    <Link href="/cart" className={styles.cartBtn} aria-label="Shopping cart">
                        <ShoppingBag size={20} strokeWidth={1.5} />
                        {isHydrated && totalItems > 0 && (
                            <span className={styles.cartBadge}>{totalItems}</span>
                        )}
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
