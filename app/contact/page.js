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
                                <svg viewBox="0 0 24 24" width="24" height="24">
                                    <path fill="#25D366" d="M12.031 2c-5.516 0-9.987 4.49-9.987 9.995 0 2.011.594 3.877 1.611 5.441l-1.071 3.91 4.026-1.054c1.516.91 3.28 1.442 5.169 1.442 5.517 0 10.007-4.49 10.007-9.995 0-5.506-4.49-9.999-10.007-9.999z" />
                                    <path fill="#FFF" d="M17.476 14.187c-.203-.102-1.203-.594-1.391-.664-.188-.063-.328-.102-.469.102-.141.203-.547.664-.672.812-.125.141-.25.156-.453.055-.203-.102-.859-.313-1.641-.992-.609-.547-1.023-1.227-1.141-1.43-.125-.203-.016-.313.086-.414.094-.094.203-.234.305-.352.094-.117.125-.195.188-.328.063-.133.031-.25-.016-.352-.047-.102-.422-1.008-.578-1.383-.156-.367-.312-.313-.422-.313-.109 0-.234-.008-.359-.008-.125 0-.328.047-.5.234s-.656.641-.656 1.562c0 .922.672 1.812.766 1.938.094.125 1.32 2.016 3.195 2.82.445.195.797.313 1.071.399.445.141.852.125 1.172.078.359-.055 1.203-.492 1.375-1.023.172-.531.172-.984.117-1.023z" />
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
                                    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12.53 0H16.44C16.51 1.53 17.06 3.09 18.18 4.17C19.3 5.28 20.88 5.79 22.42 5.96V9.99C20.98 9.8 19.57 9.25 18.48 8.27C18.47 11.24 18.48 14.2 18.47 17.17C18.4 19.3 17.32 21.4 15.37 22.55C13.37 23.7 10.74 23.7 8.74 22.57C6.74 21.43 5.6 19.2 5.69 16.94C5.75 14.62 7.19 12.37 9.42 11.62C10.48 11.26 11.62 11.18 12.71 11.39V15.69C12.12 15.55 11.47 15.56 10.9 15.78C9.9 16.19 9.27 17.26 9.4 18.31C9.45 19.37 10.24 20.31 11.28 20.53C12.39 20.76 13.65 20.24 14.13 19.2C14.28 18.9 14.34 18.57 14.34 18.24V0H12.53Z" fill="var(--text-primary)"/>
                                        <path d="M12.53 0H16.44C16.51 1.53 17.06 3.09 18.18 4.17C19.3 5.28 20.88 5.79 22.42 5.96V9.99C20.98 9.8 19.57 9.25 18.48 8.27C18.47 11.24 18.48 14.2 18.47 17.17C18.4 19.3 17.32 21.4 15.37 22.55C13.37 23.7 10.74 23.7 8.74 22.57C6.74 21.43 5.6 19.2 5.69 16.94C5.75 14.62 7.19 12.37 9.42 11.62C10.48 11.26 11.62 11.18 12.71 11.39V15.69C12.12 15.55 11.47 15.56 10.9 15.78C9.9 16.19 9.27 17.26 9.4 18.31C9.45 19.37 10.24 20.31 11.28 20.53C12.39 20.76 13.65 20.24 14.13 19.2C14.28 18.9 14.34 18.57 14.34 18.24V0H12.53Z" fill="#25F4EE" style={{ mixBlendMode: 'multiply', transform: 'translate(-1.5px, -0.5px)' }}/>
                                        <path d="M12.53 0H16.44C16.51 1.53 17.06 3.09 18.18 4.17C19.3 5.28 20.88 5.79 22.42 5.96V9.99C20.98 9.8 19.57 9.25 18.48 8.27C18.47 11.24 18.48 14.2 18.47 17.17C18.4 19.3 17.32 21.4 15.37 22.55C13.37 23.7 10.74 23.7 8.74 22.57C6.74 21.43 5.6 19.2 5.69 16.94C5.75 14.62 7.19 12.37 9.42 11.62C10.48 11.26 11.62 11.18 12.71 11.39V15.69C12.12 15.55 11.47 15.56 10.9 15.78C9.9 16.19 9.27 17.26 9.4 18.31C9.45 19.37 10.24 20.31 11.28 20.53C12.39 20.76 13.65 20.24 14.13 19.2C14.28 18.9 14.34 18.57 14.34 18.24V0H12.53Z" fill="#FE2C55" style={{ mixBlendMode: 'multiply', transform: 'translate(1.5px, 0.5px)' }}/>
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
