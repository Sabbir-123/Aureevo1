import Link from 'next/link';
import { Instagram, Facebook, Mail } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={`container ${styles.footerInner}`}>
                <div className={styles.brand}>
                    <Link href="/" className={styles.logo}>
                        AUREEVO
                    </Link>
                    <p className={styles.tagline}>
                        Premium men&apos;s fashion. Elevated essentials for the modern man.
                    </p>
                    <a href="mailto:contact@aureevo.com" className={styles.link} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
                        <Mail size={16} /> contact@aureevo.com
                    </a>
                </div>

                <div className={styles.links}>
                    <h4 className={styles.linksTitle}>Quick Links</h4>
                    <Link href="/" className={styles.link}>Home</Link>
                    <Link href="/#shop" className={styles.link}>Shop</Link>
                    <Link href="/cart" className={styles.link}>Cart</Link>
                </div>

                <div className={styles.links}>
                    <h4 className={styles.linksTitle}>Help</h4>
                    <ul className={styles.linksList}>
                        <li><Link href="/contact" className={styles.link}>Contact Us</Link></li>
                        <li><Link href="/shipping" className={styles.link}>Shipping Information</Link></li>
                        <li><Link href="/returns" className={styles.link}>Returns & Exchanges</Link></li>
                        <li><Link href="/faq" className={styles.link}>FAQ</Link></li>
                    </ul>
                </div>

                <div className={styles.social}>
                    <h4 className={styles.linksTitle}>Follow Us</h4>
                    <div className={styles.socialIcons}>
                        <a href="https://www.facebook.com/aureevo" aria-label="Facebook" className={styles.socialIcon} target="_blank" rel="noopener noreferrer">
                            <Facebook size={18} strokeWidth={1.5} />
                        </a>
                        <a href="https://www.instagram.com/aureevobd" aria-label="Instagram" className={styles.socialIcon} target="_blank" rel="noopener noreferrer">
                            <Instagram size={18} strokeWidth={1.5} />
                        </a>
                        <a href="https://tiktok.com/@aureevo" aria-label="TikTok" className={styles.socialIcon} target="_blank" rel="noopener noreferrer">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>

            <div className={styles.bottom}>
                <div className="container">
                    <p className={styles.copyright}>
                        &copy; {new Date().getFullYear()} AUREEVO. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
