import { Metadata } from 'next';
import styles from '../login/auth.module.css';

export const metadata = {
    title: 'Shipping Information | AUREEVO',
    description: 'Learn about AUREEVO delivery options, shipping times, and international shipping rates.',
};

export default function ShippingPage() {
    return (
        <div className={styles.page}>
            <div className={styles.card} style={{ maxWidth: '800px', width: '100%', padding: 'var(--space-3xl)' }}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Shipping Information</h1>
                    <p className={styles.subtitle}>Everything you need to know about AUREEVO deliveries.</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', color: 'var(--color-grey-300)', lineHeight: '1.8' }}>
                    <section>
                        <h2 style={{ fontSize: '1.2rem', color: 'var(--color-white)', marginBottom: '1rem', borderBottom: '1px solid var(--color-grey-800)', paddingBottom: '0.5rem' }}>Processing Times</h2>
                        <p>
                            All orders are processed within <strong>1-2 business days</strong> (excluding weekends and holidays) after receiving your order confirmation email. You will receive another notification when your order has shipped, complete with tracking details.
                        </p>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '1.2rem', color: 'var(--color-white)', marginBottom: '1rem', borderBottom: '1px solid var(--color-grey-800)', paddingBottom: '0.5rem' }}>Domestic Shipping Rates & Estimates</h2>
                        <p>We offer the following shipping options within the United States:</p>
                        <ul style={{ listStyleType: 'disc', paddingLeft: '2rem', marginTop: '1rem' }}>
                            <li style={{ marginBottom: '0.5rem' }}><strong>Standard Shipping (3-5 Business Days):</strong> Free on all orders over $200. $10 flat rate for orders under $200.</li>
                            <li style={{ marginBottom: '0.5rem' }}><strong>Expedited Shipping (2-3 Business Days):</strong> $25 flat rate.</li>
                            <li><strong>Overnight Delivery (Next Business Day):</strong> $45 flat rate (must be placed before 1 PM EST).</li>
                        </ul>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '1.2rem', color: 'var(--color-white)', marginBottom: '1rem', borderBottom: '1px solid var(--color-grey-800)', paddingBottom: '0.5rem' }}>International Shipping</h2>
                        <p>
                            We offer worldwide shipping via DHL Express. International shipping times generally range from <strong>3-7 business days</strong> depending on the destination.
                            <br /><br />
                            <em>Please Note:</em> International customers are responsible for any applicable customs duties, taxes, or import fees levied by the destination country.
                        </p>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '1.2rem', color: 'var(--color-white)', marginBottom: '1rem', borderBottom: '1px solid var(--color-grey-800)', paddingBottom: '0.5rem' }}>How do I check the status of my order?</h2>
                        <p>
                            When your order has shipped, you will receive an email notification from us which will include a tracking number you can use to check its status. Please allow 48 hours for the tracking information to become available.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
