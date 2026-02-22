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
                            <br />
                            <a href="tel:01633028000" className={styles.contactValue}>01633-028000</a>
                        </div>

                        {/* Email */}
                        <div className={styles.contactCard}>
                            <div className={styles.iconWrapper}>
                                <Mail size={24} />
                            </div>
                            <span className={styles.contactLabel}>Client Services</span>
                            <a href="mailto:aureevo.3@gmail.com" className={styles.contactValue}>aureevo.3@gmail.com</a>
                        </div>

                        {/* Social */}
                        <div className={styles.contactCard}>
                            <div className={styles.iconWrapper}>
                                <Instagram size={24} />
                            </div>
                            <span className={styles.contactLabel}>Social Media</span>
                            <a href="https://www.instagram.com/aureevobd" target="_blank" rel="noopener noreferrer" className={styles.contactValue}>IG: @aureevobd</a>
                            <br />
                            <a href="https://www.facebook.com/aureevo" target="_blank" rel="noopener noreferrer" className={styles.contactValue} style={{ marginTop: '0.5rem', display: 'inline-block' }}>FB: aureevo</a>
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
