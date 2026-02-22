import { Metadata } from 'next';
import styles from '../login/auth.module.css';

export const metadata = {
    title: 'Returns & Exchanges | AUREEVO',
    description: 'AUREEVO return policy, exchange procedures, and refund information.',
};

export default function ReturnsPage() {
    return (
        <div className={styles.page}>
            <div className={styles.card} style={{ maxWidth: '800px', width: '100%', padding: 'var(--space-3xl)' }}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Returns & Exchanges</h1>
                    <p className={styles.subtitle}>Our commitment to your satisfaction.</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', color: 'var(--color-grey-300)', lineHeight: '1.8' }}>
                    <section>
                        <h2 style={{ fontSize: '1.2rem', color: 'var(--color-white)', marginBottom: '1rem', borderBottom: '1px solid var(--color-grey-800)', paddingBottom: '0.5rem' }}>Return Policy</h2>
                        <p>
                            We accept returns up to <strong>30 days after delivery</strong>. To be eligible for a return, your item must be unused, unwashed, and in the same condition that you received it. It must also be in the original packaging with all designer tags still attached.
                        </p>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '1.2rem', color: 'var(--color-white)', marginBottom: '1rem', borderBottom: '1px solid var(--color-grey-800)', paddingBottom: '0.5rem' }}>How to Initiate a Return</h2>
                        <ol style={{ listStyleType: 'decimal', paddingLeft: '2rem', marginTop: '1rem' }}>
                            <li style={{ marginBottom: '0.5rem' }}>Email our concierge team at <strong>returns@aureevo.com</strong> with your order number.</li>
                            <li style={{ marginBottom: '0.5rem' }}>We will provide you with a pre-paid printable shipping label (for domestic orders).</li>
                            <li style={{ marginBottom: '0.5rem' }}>Pack the items securely in their original packaging.</li>
                            <li>Drop off the package at your nearest designated courier location.</li>
                        </ol>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '1.2rem', color: 'var(--color-white)', marginBottom: '1rem', borderBottom: '1px solid var(--color-grey-800)', paddingBottom: '0.5rem' }}>Refunds</h2>
                        <p>
                            Once your return is received and inspected, we will send you an email to notify you that we have received your returned item. If approved, your refund will be processed, and a credit will automatically be applied to your credit card or original method of payment within 5-7 business days.
                        </p>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '1.2rem', color: 'var(--color-white)', marginBottom: '1rem', borderBottom: '1px solid var(--color-grey-800)', paddingBottom: '0.5rem' }}>Exchanges</h2>
                        <p>
                            If you need to exchange an item for a different size or color, please follow the return process for a refund and place a new order for the desired item. We only replace items directly if they are defective or damaged upon arrival.
                        </p>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '1.2rem', color: 'var(--color-white)', marginBottom: '1rem', borderBottom: '1px solid var(--color-grey-800)', paddingBottom: '0.5rem' }}>Non-returnable Items</h2>
                        <p>
                            Certain types of items cannot be returned:
                        </p>
                        <ul style={{ listStyleType: 'disc', paddingLeft: '2rem', marginTop: '0.5rem' }}>
                            <li>Gift cards.</li>
                            <li>Custom-tailored or personalized garments.</li>
                            <li>Intimate items (for hygiene reasons) unless the seal is completely intact.</li>
                        </ul>
                    </section>
                </div>
            </div>
        </div>
    );
}
