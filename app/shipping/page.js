import styles from '../info.module.css';

export const metadata = {
    title: 'Shipping Information | Aureevo Premium Men\'s Fashion',
    description: 'Learn about Aureevo\'s nationwide shipping policies in Bangladesh.',
};

export default function ShippingPage() {
    return (
        <main className={styles.page}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Shipping Information</h1>
                    <p className={styles.subtitle}>Fast & Reliable Nationwide Delivery</p>
                </div>

                <div className={styles.content}>
                    <section className={styles.section}>
                        <h2 className={styles.heading}>Delivery Timeline</h2>
                        <p className={styles.text}>
                            Aureevo partners with premium courier services to ensure your orders reach you securely and swiftly across Bangladesh.
                        </p>
                        <ul className={styles.list}>
                            <li className={styles.listItem}><strong>Inside Dhaka:</strong> Delivery within 24 to 48 hours from the time of order confirmation.</li>
                            <li className={styles.listItem}><strong>Outside Dhaka:</strong> Delivery within 3 to 5 business days, depending on the district.</li>
                        </ul>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.heading}>Shipping Charges</h2>
                        <ul className={styles.list}>
                            <li className={styles.listItem}><strong>Inside Dhaka:</strong> Standard shipping charge of BDT 80 applies.</li>
                            <li className={styles.listItem}><strong>Outside Dhaka:</strong> Standard shipping charge of BDT 150 applies.</li>
                        </ul>
                        <p className={styles.text}>
                            <em>*Shipping fees may be waived during exclusive promotional periods or for VIP customers.</em>
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.heading}>Order Tracking</h2>
                        <p className={styles.text}>
                            Once your luxurious piece has been dispatched, you will receive a confirmation email and SMS containing your courier tracking number. You can monitor the progress of your shipment directly through the provider's portal.
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
}
