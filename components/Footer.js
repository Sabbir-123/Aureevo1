'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Instagram, Facebook, Mail, ArrowRight, Phone, Music } from 'lucide-react';
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
                            <Phone size={18} strokeWidth={1.5} />
                        </a>
                        <a href="https://www.tiktok.com/@aureevo" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="TikTok">
                            <Music size={18} strokeWidth={1.5} />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
