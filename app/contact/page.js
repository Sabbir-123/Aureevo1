'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Mail, Phone, MapPin } from 'lucide-react';
import styles from '../login/auth.module.css';

export default function ContactPage() {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            toast.success('Your message has been sent. We will get back to you shortly.');
            setFormData({ name: '', email: '', subject: '', message: '' });
        }, 1500);
    };

    return (
        <div className={styles.page}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1000px', width: '100%' }}>
                <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                    <h1 className={styles.title}>Contact Us</h1>
                    <p className={styles.subtitle}>We are here to assist you with any inquiries.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    {/* Contact Form */}
                    <motion.div
                        className={styles.card}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        style={{ maxWidth: '100%' }}
                    >
                        <h2 style={{ fontSize: '1.2rem', color: 'var(--color-white)', marginBottom: '1.5rem' }}>Send a Message</h2>
                        <form className={styles.form} onSubmit={handleSubmit}>
                            <div className={styles.field}>
                                <label className="input-label" htmlFor="name">Name</label>
                                <input
                                    id="name"
                                    type="text"
                                    className="input-field"
                                    placeholder="Your Name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className={styles.field}>
                                <label className="input-label" htmlFor="email">Email</label>
                                <input
                                    id="email"
                                    type="email"
                                    className="input-field"
                                    placeholder="your@email.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div className={styles.field}>
                                <label className="input-label" htmlFor="subject">Subject</label>
                                <input
                                    id="subject"
                                    type="text"
                                    className="input-field"
                                    placeholder="Order # or Inquiry Topic"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    required
                                />
                            </div>
                            <div className={styles.field}>
                                <label className="input-label" htmlFor="message">Message</label>
                                <textarea
                                    id="message"
                                    className="input-field"
                                    placeholder="How can we help?"
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    required
                                    rows={5}
                                />
                            </div>
                            <button
                                type="submit"
                                className="btn btn-gold btn-lg"
                                disabled={loading || !formData.name || !formData.email || !formData.message}
                            >
                                {loading ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    </motion.div>

                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: 'var(--space-xl)' }}
                    >
                        <div>
                            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-white)', marginBottom: '1rem' }}>Get in Touch</h2>
                            <p style={{ color: 'var(--color-grey-400)', lineHeight: '1.6' }}>
                                Our concierge team is available Monday through Friday, from 9:00 AM to 6:00 PM EST. We strive to respond to all inquiries within 24 business hours.
                            </p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-grey-900)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-gold)' }}>
                                    <Mail size={20} />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '0.9rem', color: 'var(--color-grey-300)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email Support</h3>
                                    <a href="mailto:support@aureevo.com" style={{ color: 'var(--color-white)', fontSize: '1.1rem', transition: 'color 0.2s' }}>support@aureevo.com</a>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-grey-900)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-gold)' }}>
                                    <Phone size={20} />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '0.9rem', color: 'var(--color-grey-300)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Phone Support</h3>
                                    <a href="tel:+18005550199" style={{ color: 'var(--color-white)', fontSize: '1.1rem', transition: 'color 0.2s' }}>+1 (800) 555-0199</a>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-grey-900)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-gold)' }}>
                                    <MapPin size={20} />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '0.9rem', color: 'var(--color-grey-300)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Headquarters</h3>
                                    <p style={{ color: 'var(--color-white)', fontSize: '1.1rem', lineHeight: '1.4' }}>
                                        AUREEVO Studios<br />
                                        123 Fashion Avenue<br />
                                        New York, NY 10001
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
