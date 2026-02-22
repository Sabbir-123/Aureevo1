import styles from '../info.module.css';

export const metadata = {
    title: 'FAQ | Aureevo Premium Men\'s Fashion',
    description: 'Frequently Asked Questions about Aureevo.',
};

export default function FaqPage() {
    return (
        <main className={styles.page}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>FAQ</h1>
                    <p className={styles.subtitle}>Frequently Asked Questions</p>
                </div>

                <div className={styles.content}>
                    <section className={styles.section}>
                        <h2 className={styles.heading}>Do you offer Cash on Delivery (COD)?</h2>
                        <p className={styles.text}>
                            Yes, we offer Cash on Delivery across all major districts within Bangladesh. Enjoy the luxury of inspecting your package before completing payment at your doorstep.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.heading}>Where is your physical store located?</h2>
                        <p className={styles.text}>
                            Aureevo is currently a highly curated, online-exclusive premium brand based in Dhaka. Operating online allows us to source the finest materials globally without the retail markup, delivering true value directly to our clients.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.heading}>How do I determine my size?</h2>
                        <p className={styles.text}>
                            Every product page features a detailed, item-specific Size Guide. Our garments are true to modern tailored fits. If you are between sizes, we recommend sizing up for a relaxed fit, or contacting our styling team on WhatsApp/Social Media for personalized sizing advice.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.heading}>Can I modify my order after placing it?</h2>
                        <p className={styles.text}>
                            Orders are processed extremely quickly to ensure rapid delivery. If you need to make changes to your size or address, please call our hotline <strong>+880 1633-028000</strong> within 2 hours of placing the order.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.heading}>How should I care for my Aureevo garments?</h2>
                        <p className={styles.text}>
                            To maintain the premium quality of our Egyptian cottons and blends, we recommend a cold machine wash with similar colors. Do not bleach. Tumble dry on low or line dry in the shade to preserve color intensity and fabric integrity.
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
}
