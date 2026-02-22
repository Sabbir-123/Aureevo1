import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Menu, X, Sun, Moon, User } from 'lucide-react';
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
                {/* Left: Navigation */}
                <div className={styles.leftSection}>
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
                        {/* Mobile Only Links */}
                        <Link href="/cart" className={`${styles.navLink} ${styles.navLinkMobileCart}`}>
                            Cart {isHydrated && totalItems > 0 && `(${totalItems})`}
                        </Link>
                    </nav>
                </div>

                {/* Center: Logo */}
                <Link href="/" className={styles.logo}>
                    AUREEVO
                </Link>

                {/* Right: Icons */}
                <div className={styles.actions}>
                    <Link href={user ? '/profile' : '/login'} className={styles.iconBtn} aria-label="Account">
                        <User size={20} strokeWidth={1.5} />
                    </Link>

                    <Link href="/cart" className={styles.cartBtn} aria-label="Shopping cart">
                        <ShoppingBag size={20} strokeWidth={1.5} />
                        {isHydrated && totalItems > 0 && (
                            <span className={styles.cartBadge}>{totalItems}</span>
                        )}
                    </Link>

                    {/* Theme Toggle - kept discreetly */}
                    <button
                        className={styles.themeBtn}
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                    >
                        {theme === 'dark' ? <Sun size={20} strokeWidth={1.5} /> : <Moon size={20} strokeWidth={1.5} />}
                    </button>

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
