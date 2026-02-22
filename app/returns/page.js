import styles from '../info.module.css';

export const metadata = {
    title: 'Returns & Exchanges | Aureevo Premium Men\'s Fashion',
    description: 'Aureevo Return and Exchange policy for Bangladesh.',
};

export default function ReturnsPage() {
    return (
        <main className={styles.page}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Returns & Exchanges</h1>
                    <p className={styles.subtitle}>Our Promise of Perfection</p>
                </div>

                <div className={styles.content}>
                    <section className={styles.section}>
                        <h2 className={styles.heading}>Exchange Policy</h2>
                        <p className={styles.text}>
                            At Aureevo, we hold our craftsmanship to the highest standards. We gladly accept exchanges within <strong>3 days</strong> of the delivery date, provided the items remain in their original, unwashed, and unworn condition with all premium tags intact.
                        </p>
                        <p className={styles.text}>
                            Exchanges are applicable only for sizing issues or if an incorrect/defective item was delivered by our team.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.heading}>How to Request an Exchange</h2>
                        <ul className={styles.list}>
                            <li className={styles.listItem}>Contact our Client Services team via our Facebook, Instagram page (@aureevobd), or call us directly at <strong>+880 1633-028000</strong> within 3 days of receiving your package.</li>
                            <li className={styles.listItem}>Provide your Order ID and an image of the received product showing the tags.</li>
                            <li className={styles.listItem}>Once verified, our courier partner will collect the original item and deliver the newly requested size/piece to your doorstep.</li>
                        </ul>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.heading}>Terms & Conditions</h2>
                        <ul className={styles.list}>
                            <li className={styles.listItem}>To be eligible for an exchange, items must not smell of perfume, smoke, or show any signs of body wear.</li>
                            <li className={styles.listItem}>If the exchange is due to a customer's sizing error, the customer will bear the delivery charge for the exchanged item.</li>
                            <li className={styles.listItem}>If Aureevo sent an incorrect or defective item, we will cover the full return and replacement shipping costs.</li>
                            <li className={styles.listItem}>We currently do not offer cash refunds. All approved requests will be compensated via direct exchange or store credit.</li>
                        </ul>
                    </section>
                </div>
            </div>
        </main>
    );
}
