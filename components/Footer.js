import Link from 'next/link';
import { Instagram } from 'lucide-react';
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
                </div>

                <div className={styles.links}>
                    <h4 className={styles.linksTitle}>Quick Links</h4>
                    <Link href="/" className={styles.link}>Home</Link>
                    <Link href="/#shop" className={styles.link}>Shop</Link>
                    <Link href="/cart" className={styles.link}>Cart</Link>
                </div>

                <div className={styles.links}>
                    <h4 className={styles.linksTitle}>Help</h4>
                    <span className={styles.link}>Shipping Info</span>
                    <span className={styles.link}>Returns</span>
                    <span className={styles.link}>Contact Us</span>
                </div>

                <div className={styles.social}>
                    <h4 className={styles.linksTitle}>Follow Us</h4>
                    <div className={styles.socialIcons}>
                        <a href="#" aria-label="Instagram" className={styles.socialIcon}>
                            <Instagram size={18} strokeWidth={1.5} />
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
