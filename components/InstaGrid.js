'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Instagram } from 'lucide-react';
import styles from './InstaGrid.module.css';

const IMAGES = [
    '/insta_1.png',
    '/insta_2.png',
    '/cat_shirts.png',
    '/cat_hoodies.png',
];

export default function InstaGrid() {
    return (
        <section className={styles.section}>
            <div className="container">
                <div className={styles.header}>
                    <div className={styles.titleGroup}>
                        <span className={styles.tag}>Community</span>
                        <h2 className={styles.title}>Worn by the Wave</h2>
                    </div>
                    <a 
                        href="https://instagram.com/aureevobd" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={styles.followBtn}
                    >
                        Follow @aureevo
                    </a>
                </div>

                <div className={styles.grid}>
                    {IMAGES.map((src, i) => (
                        <motion.div 
                            key={i}
                            className={styles.item}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: i * 0.1 }}
                        >
                            <Image 
                                src={src} 
                                alt={`Instagram ${i + 1}`} 
                                width={400} 
                                height={400} 
                                className={styles.image}
                            />
                            <div className={styles.overlay}>
                                <Instagram size={24} color="white" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
