'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import Image from 'next/image';
import styles from './Hero.module.css';

const HERO_IMAGES = [
    { id: 1, src: '/public/cat_hoodies.png', color: '#ff7d45', size: 'sm', offset: '20px' }, // Orange
    { id: 2, src: '/public/editorial_campaign.png', color: '#45a049', size: 'lg', offset: '0px' }, // Green
    { id: 3, src: '/public/hero_model_orange_1775842718205.png', color: '#ffca28', size: 'xl', isCenter: true }, // Yellow (using the generated one)
    { id: 4, src: '/public/cat_shirts.png', color: '#31b8e6', size: 'lg', offset: '0px' }, // Blue
    { id: 5, src: '/public/cat_tees.png', color: '#008080', size: 'sm', offset: '20px' }, // Teal
];

export default function Hero() {
    return (
        <section className={styles.hero}>
            <div className={`container ${styles.container}`}>
                
                {/* ── TOP: DECORATIVE BADGE (Left) ── */}
                <motion.div 
                    className={styles.badgeWrapper}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <div className={styles.rotatingBadge}>
                        <svg viewBox="0 0 100 100" width="100" height="100">
                            <path id="circlePath" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="none" />
                            <text className={styles.badgeText}>
                                <textPath href="#circlePath">Learn about us through this video •</textPath>
                            </text>
                        </svg>
                        <div className={styles.playIcon}>
                            <Play size={14} fill="black" />
                        </div>
                    </div>
                </motion.div>

                {/* ── CENTER: HEADLINE ── */}
                <div className={styles.content}>
                    <motion.h1 
                        className={styles.headline}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                    >
                        Elevate Your Style With <br />
                        <span className={styles.bold}>Bold Fashion</span>
                    </motion.h1>
                </div>

                {/* ── CENTER: IMAGE GRID ── */}
                <div className={styles.gridContainer}>
                    {/* Decorative loading animation above middle card */}
                    <div className={styles.loadingDot} />

                    <div className={styles.grid}>
                        {HERO_IMAGES.map((img, i) => (
                            <motion.div 
                                key={img.id}
                                className={`${styles.card} ${styles[img.size]} ${img.isCenter ? styles.centerCard : ''}`}
                                style={{ 
                                    backgroundColor: img.color,
                                    marginTop: img.offset || '0px'
                                }}
                                initial={{ opacity: 0, y: 60 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.3 + i * 0.1, ease: [0.4, 0, 0.2, 1] }}
                                whileHover={{ scale: 1.03, y: -5 }}
                            >
                                <div className={styles.cardImageInner}>
                                   <Image 
                                        src={img.src} 
                                        alt="Fashion Model" 
                                        fill 
                                        className={styles.image} 
                                        quality={100}
                                        priority
                                    />
                                </div>
                                
                                {img.isCenter && (
                                    <button className={styles.ctaButton}>
                                        Explore Collections ↗
                                    </button>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* ── BOTTOM: TESTIMONIAL & FEATURE ── */}
                <div className={styles.footer}>
                    {/* Testimonial (Left) */}
                    <motion.div 
                        className={styles.testimonial}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 1 }}
                    >
                        <div className={styles.quoteIcon}>“</div>
                        <div className={styles.testimonialText}>
                            <p>“Aureevo styles are bold, clean, and exactly what I needed.”</p>
                            <span className={styles.signature}>Rafi H.</span>
                        </div>
                    </motion.div>

                    {/* Feature Block (Right) */}
                    <motion.div 
                        className={styles.featureBlock}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 1 }}
                    >
                        <div className={styles.featureHeader}>
                            <span className={styles.featureNum}>01</span>
                            <span className={styles.featureTag}>Lifestyle</span>
                            <ArrowRight size={20} className={styles.featureArrow} />
                        </div>
                        <h3 className={styles.featureTitle}>
                            Set Up Your Fashion With <br />
                            The Latest Trends
                        </h3>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
