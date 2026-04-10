'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Truck, RefreshCw, Smartphone } from 'lucide-react';
import styles from './ValueProps.module.css';

const PROPS = [
    {
        icon: <ShieldCheck size={28} strokeWidth={1.2} />,
        title: 'Premium Quality',
        desc: 'Sourced from the finest organic long-staple cotton.'
    },
    {
        icon: <Truck size={28} strokeWidth={1.2} />,
        title: 'Fast Delivery',
        desc: 'Express 48h shipping across all major cities in Bangladesh.'
    },
    {
        icon: <RefreshCw size={28} strokeWidth={1.2} />,
        title: 'Easy Returns',
        desc: 'Simple 7-day exchange and return policy, no questions asked.'
    },
    {
        icon: <Smartphone size={28} strokeWidth={1.2} />,
        title: 'Mobile First',
        desc: 'Designed for a seamless shopping experience on any device.'
    }
];

export default function ValueProps() {
    return (
        <section className={styles.section}>
            <div className="container">
                <div className={styles.grid}>
                    {PROPS.map((prop, i) => (
                        <motion.div 
                            key={i}
                            className={styles.item}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: i * 0.1 }}
                        >
                            <div className={styles.iconWrapper}>
                                {prop.icon}
                            </div>
                            <h3 className={styles.title}>{prop.title}</h3>
                            <p className={styles.desc}>{prop.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
