import styles from '../info.module.css';
import { Phone, Mail, MapPin, Instagram, Facebook } from 'lucide-react';

export const metadata = {
    title: 'Contact Us | Aureevo Premium Men\'s Fashion',
    description: 'Get in touch with the Aureevo customer service team.',
};

export default function ContactPage() {
    return (
        <main className={styles.page}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Contact Us</h1>
                    <p className={styles.subtitle}>We Are Here To Help</p>
                </div>

                <div className={styles.content}>
                    <div className={styles.section}>
                        <h2 className={styles.heading}>Get In Touch</h2>
                        <p className={styles.text}>
                            For inquiries regarding our luxurious collections, sizing, or order support, our dedicated team is at your service.
                            Please reach out to us using the information below, or connect with us on our social platforms.
                        </p>
                    </div>

                    <div className={styles.contactGrid}>
                        {/* Phone */}
                        <div className={styles.contactCard}>
                            <div className={styles.iconWrapper}>
                                <Phone size={24} />
                            </div>
                            <span className={styles.contactLabel}>Phone Support</span>
                            <a href="tel:+8801633028000" className={styles.contactValue}>+880 1633-028000</a>
                        </div>

                        {/* WhatsApp */}
                        <div className={styles.contactCard}>
                            <div className={styles.iconWrapper}>
                                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                                    <path d="M12.031 2c-5.516 0-9.987 4.49-9.987 9.995 0 2.011.594 3.877 1.611 5.441l-1.071 3.91 4.026-1.054c1.516.91 3.28 1.442 5.169 1.442 5.517 0 10.007-4.49 10.007-9.995 0-5.506-4.49-9.999-10.007-9.999zM17.476 14.187c-.203-.102-1.203-.594-1.391-.664-.188-.063-.328-.102-.469.102-.141.203-.547.664-.672.812-.125.141-.25.156-.453.055-.203-.102-.859-.313-1.641-.992-.609-.547-1.023-1.227-1.141-1.43-.125-.203-.016-.313.086-.414.094-.094.203-.234.305-.352.094-.117.125-.195.188-.328.063-.133.031-.25-.016-.352-.047-.102-.422-1.008-.578-1.383-.156-.367-.312-.313-.422-.313-.109 0-.234-.008-.359-.008-.125 0-.328.047-.5.234s-.656.641-.656 1.562c0 .922.672 1.812.766 1.938.094.125 1.32 2.016 3.195 2.82.445.195.797.313 1.071.399.445.141.852.125 1.172.078.359-.055 1.203-.492 1.375-1.023.172-.531.172-.984.117-1.023z" />
                                </svg>
                            </div>
                            <span className={styles.contactLabel}>WhatsApp</span>
                            <a href="https://wa.me/8801633028000" target="_blank" rel="noopener noreferrer" className={styles.contactValue}>+880 1633-028000</a>
                        </div>

                        {/* Email */}
                        <div className={styles.contactCard}>
                            <div className={styles.iconWrapper}>
                                <Mail size={24} />
                            </div>
                            <span className={styles.contactLabel}>Client Services</span>
                            <a href="mailto:contact@aureevo.com" className={styles.contactValue}>contact@aureevo.com</a>
                        </div>

                        {/* Social */}
                        <div className={styles.contactCard}>
                            <div className={styles.iconWrapper}>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <Instagram size={24} />
                                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                                        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.19-2.85-.74-3.94-1.72-.01 2.97 0 5.93-.01 8.9-.07 2.13-1.15 4.23-3.1 5.38-2 1.15-4.63 1.15-6.63.02-2-1.14-3.14-3.37-3.05-5.63.06-2.32 1.5-4.57 3.73-5.32 1.06-.36 2.2-.44 3.29-.23v4.3c-.59-.14-1.24-.13-1.81.09-1 .41-1.63 1.48-1.5 2.53.05 1.06.84 2 1.88 2.22 1.11.23 2.37-.29 2.85-1.33.15-.3.21-.63.21-.96V.02z" />
                                    </svg>
                                </div>
                            </div>
                            <span className={styles.contactLabel}>Social Media</span>
                            <a href="https://www.instagram.com/aureevobd" target="_blank" rel="noopener noreferrer" className={styles.contactValue}>IG: @aureevobd</a>
                            <br />
                            <a href="https://www.facebook.com/aureevo" target="_blank" rel="noopener noreferrer" className={styles.contactValue} style={{ marginTop: '0.2rem', display: 'inline-block' }}>FB: aureevo</a>
                            <br />
                            <a href="https://www.tiktok.com/@aureevo" target="_blank" rel="noopener noreferrer" className={styles.contactValue} style={{ marginTop: '0.2rem', display: 'inline-block' }}>TT: @aureevo</a>
                        </div>

                        {/* Address Placeholder */}
                        <div className={styles.contactCard}>
                            <div className={styles.iconWrapper}>
                                <MapPin size={24} />
                            </div>
                            <span className={styles.contactLabel}>Headquarters</span>
                            <span className={styles.contactValue}>Aureevo<br />Dhaka, Bangladesh</span>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
