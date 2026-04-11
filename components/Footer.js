'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Instagram, Facebook, Mail, ArrowRight } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const currentYear = mounted ? new Date().getFullYear() : "2026";

    return (
        <footer className={styles.footer}>
            <div className={`container ${styles.footerInner}`}>
                <div className={styles.brand}>
                    <Link href="/" className={styles.logo}>
                        AUREEVO
                    </Link>
                    <p className={styles.tagline}>
                        Premium men&apos;s fashion. Elevated essentials for the modern lifestyle. 
                        Engineered in Bangladesh, inspired by the world.
                    </p>
                    <div className={styles.newsletter}>
                        <h4 className={styles.sectionTitle}>Join the Newsletter</h4>
                        {mounted ? (
                            <div className={styles.inputGroup}>
                                <input 
                                    type="email" 
                                    placeholder="Email Address" 
                                    className={styles.input} 
                                />
                                <button className={styles.inputBtn} aria-label="Subscribe">
                                    <ArrowRight size={18} />
                                </button>
                            </div>
                        ) : (
                            <div className={styles.inputPlaceholder} />
                        )}
                    </div>
                </div>

                <div className={styles.linksGrid}>
                    <div className={styles.linkGroup}>
                        <h4 className={styles.sectionTitle}>Shop</h4>
                        <Link href="/#shop" className={styles.link}>New Arrivals</Link>
                        <Link href="/#shop" className={styles.link}>Best Sellers</Link>
                        <Link href="/#shop" className={styles.link}>Collections</Link>
                        <Link href="/#shop" className={styles.link}>All Items</Link>
                    </div>

                    <div className={styles.linkGroup}>
                        <h4 className={styles.sectionTitle}>Company</h4>
                        <Link href="/" className={styles.link}>Our Story</Link>
                        <Link href="/" className={styles.link}>Lookbook</Link>
                        <Link href="/" className={styles.link}>Ethical Practice</Link>
                        <Link href="/contact" className={styles.link}>Contact</Link>
                    </div>

                    <div className={styles.linkGroup}>
                        <h4 className={styles.sectionTitle}>Support</h4>
                        <Link href="/shipping" className={styles.link}>Shipping</Link>
                        <Link href="/returns" className={styles.link}>Returns</Link>
                        <Link href="/faq" className={styles.link}>Help Center</Link>
                        <Link href="/sizing" className={styles.link}>Size Guide</Link>
                    </div>
                </div>
            </div>

            <div className={styles.bottom}>
                <div className={`container ${styles.bottomInner}`}>
                    <p className={styles.copyright}>
                        &copy; {currentYear} AUREEVO. All rights reserved.
                    </p>
                    <div className={styles.socials}>
                        <a href="https://instagram.com/aureevobd" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                            <Instagram size={18} strokeWidth={1.5} />
                        </a>
                        <a href="https://facebook.com/aureevo" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                            <Facebook size={18} strokeWidth={1.5} />
                        </a>
                        <a href="mailto:contact@aureevo.com" className={styles.socialLink} aria-label="Email">
                            <Mail size={18} strokeWidth={1.5} />
                        </a>
                        <a href="https://wa.me/8801633028000" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="WhatsApp">
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                                <path d="M12.031 2c-5.516 0-9.987 4.49-9.987 9.995 0 2.011.594 3.877 1.611 5.441l-1.071 3.91 4.026-1.054c1.516.91 3.28 1.442 5.169 1.442 5.517 0 10.007-4.49 10.007-9.995 0-5.506-4.49-9.999-10.007-9.999zM17.476 14.187c-.203-.102-1.203-.594-1.391-.664-.188-.063-.328-.102-.469.102-.141.203-.547.664-.672.812-.125.141-.25.156-.453.055-.203-.102-.859-.313-1.641-.992-.609-.547-1.023-1.227-1.141-1.43-.125-.203-.016-.313.086-.414.094-.094.203-.234.305-.352.094-.117.125-.195.188-.328.063-.133.031-.25-.016-.352-.047-.102-.422-1.008-.578-1.383-.156-.367-.312-.313-.422-.313-.109 0-.234-.008-.359-.008-.125 0-.328.047-.5.234s-.656.641-.656 1.562c0 .922.672 1.812.766 1.938.094.125 1.32 2.016 3.195 2.82.445.195.797.313 1.071.399.445.141.852.125 1.172.078.359-.055 1.203-.492 1.375-1.023.172-.531.172-.984.117-1.023z" />
                            </svg>
                        </a>
                        <a href="https://www.tiktok.com/@aureevo" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="TikTok">
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.19-2.85-.74-3.94-1.72-.01 2.97 0 5.93-.01 8.9-.07 2.13-1.15 4.23-3.1 5.38-2 1.15-4.63 1.15-6.63.02-2-1.14-3.14-3.37-3.05-5.63.06-2.32 1.5-4.57 3.73-5.32 1.06-.36 2.2-.44 3.29-.23v4.3c-.59-.14-1.24-.13-1.81.09-1 .41-1.63 1.48-1.5 2.53.05 1.06.84 2 1.88 2.22 1.11.23 2.37-.29 2.85-1.33.15-.3.21-.63.21-.96V.02z" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
