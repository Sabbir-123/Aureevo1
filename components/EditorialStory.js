'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import styles from './EditorialStory.module.css';

export default function EditorialStory() {
    return (
        <section className={styles.section}>
            <div className="container">
                <div className={styles.layout}>
                    <motion.div 
                        className={styles.contentPane}
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                    >
                        <span className={styles.tag}>Modern Identity</span>
                        <h2 className={styles.headline}>
                            Elevate Your <br />
                            <span className={styles.italic}>Everyday Look</span>
                        </h2>
                        <div className={styles.textBlock}>
                            <p>
                                At AUREEVO, we believe is the power of intentional design. Every silhouette 
                                is a dialogue between craftsmanship and modern utility, curated for 
                                individuals who value distinction over decoration.
                            </p>
                            <p>
                                Our pieces are engineered from premium textiles sourced globally, 
                                ensuring a tactile experience that matches the visual sophistication. 
                                This is more than apparel; it is the uniform for the modern wave.
                            </p>
                        </div>
                        <div className={styles.stats}>
                            <div className={styles.statItem}>
                                <span className={styles.statNum}>100%</span>
                                <span className={styles.statLabel}>Organic Cotton</span>
                            </div>
                            <div className={styles.statItem}>
                                <span className={styles.statNum}>Ethical</span>
                                <span className={styles.statLabel}>Production</span>
                            </div>
                        </div>
                    </motion.div>

                    <div className={styles.imagePane}>
                        <motion.div 
                            className={styles.mainImageWrapper}
                            initial={{ opacity: 0, scale: 1.05 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
                        >
                            <Image 
                                src="/editorial_campaign.png" 
                                alt="Aureevo Campaign" 
                                width={600} 
                                height={800} 
                                className={styles.mainImg}
                            />
                        </motion.div>
                        
                        <motion.div 
                            className={styles.detailCard}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                        >
                            <div className={styles.detailImgWrapper}>
                                <Image 
                                    src="/editorial_detail.png" 
                                    alt="Fabric Detail" 
                                    width={240} 
                                    height={240} 
                                    className={styles.detailImg}
                                />
                            </div>
                            <h4 className={styles.detailTitle}>Premium Textures</h4>
                            <p className={styles.detailText}>Engineered for durability and a superior handfeel.</p>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
