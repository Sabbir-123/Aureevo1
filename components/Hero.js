'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Star } from 'lucide-react';
import Image from 'next/image';
import { useTheme } from '@/context/ThemeContext';
import styles from './Hero.module.css';

const SLIDES = [
    {
        id: 1,
        tag: 'New Collection — 2025',
        headline: ['Redefine', 'Your'],
        headlineItalic: 'Style.',
        subtext: 'Minimal. Premium. Timeless.',
        primaryBtn: 'Shop Now',
        secondaryBtn: 'Explore Collection',
        image: '/hero_mens_polo.png',
        productName: 'Essential Tee',
        productPrice: '৳ 1,490',
    },
    {
        id: 2,
        tag: 'Premium Essentials',
        headline: ['Wear the', 'Future of'],
        headlineItalic: 'Fashion.',
        subtext: 'Crafted for those who move with intention.',
        primaryBtn: 'Shop Hoodies',
        secondaryBtn: 'View Lookbook',
        image: '/hero_mens_hoodie.png',
        productName: 'Stealth Hoodie',
        productPrice: '৳ 2,490',
    },
    {
        id: 3,
        tag: 'Elevated Streetwear',
        headline: ['Dress With', 'Quiet'],
        headlineItalic: 'Confidence.',
        subtext: 'Engineered fabrics. Unmistakable silhouettes.',
        primaryBtn: 'Shop Collection',
        secondaryBtn: 'See All Drops',
        image: '/hero_mens_tee.png',
        productName: 'Obsidian Polo',
        productPrice: '৳ 1,890',
    },
];

export default function Hero() {
    const { theme } = useTheme();
    const [current, setCurrent] = useState(0);
    const [direction, setDirection] = useState(1);

    const nextSlide = useCallback(() => {
        setDirection(1);
        setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, []);

    const prevSlide = useCallback(() => {
        setDirection(-1);
        setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
    }, []);

    const goTo = (i) => {
        setDirection(i > current ? 1 : -1);
        setCurrent(i);
    };

    useEffect(() => {
        const t = setInterval(nextSlide, 7000);
        return () => clearInterval(t);
    }, [nextSlide]);

    const scrollToShop = () =>
        document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });

    const slide = SLIDES[current];

    /* Framer variants */
    const contentVariants = {
        initial: (dir) => ({ opacity: 0, y: dir > 0 ? 28 : -28 }),
        animate: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.4, 0, 0.2, 1], staggerChildren: 0.1 } },
        exit: (dir) => ({ opacity: 0, y: dir > 0 ? -20 : 20, transition: { duration: 0.4 } }),
    };

    const childVariants = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] } },
    };

    const imageVariants = {
        initial: { scale: 1.06, opacity: 0, filter: 'blur(8px)' },
        animate: { scale: 1, opacity: 1, filter: 'blur(0px)', transition: { duration: 1.2, ease: [0.4, 0, 0.2, 1] } },
        exit: { scale: 0.97, opacity: 0, filter: 'blur(4px)', transition: { duration: 0.5 } },
    };

    return (
        <section className={styles.heroSection}>
            {/* ── LEFT: CONTENT ── */}
            <div className={styles.contentPane}>
                <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                        key={slide.id}
                        custom={direction}
                        variants={contentVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                    >
                        {/* Collection Tag */}
                        <motion.div variants={childVariants} className={styles.collectionTag}>
                            <span className={styles.tagLine} />
                            {slide.tag}
                        </motion.div>

                        {/* Headline */}
                        <motion.h1 variants={childVariants} className={styles.headline}>
                            {slide.headline.map((line, i) => (
                                <span key={i} style={{ display: 'block' }}>{line}</span>
                            ))}
                            <span className={`${styles.headlineItalic} ${styles.headline}`}>
                                {slide.headlineItalic}
                            </span>
                        </motion.h1>

                        {/* Subtext */}
                        <motion.p variants={childVariants} className={styles.subtext}>
                            {slide.subtext}
                        </motion.p>

                        {/* CTA */}
                        <motion.div variants={childVariants} className={styles.ctaGroup}>
                            <button className={styles.btnPrimary} onClick={scrollToShop}>
                                <span>{slide.primaryBtn}</span>
                            </button>
                            <button className={styles.btnSecondary} onClick={scrollToShop}>
                                {slide.secondaryBtn}
                            </button>
                        </motion.div>

                        {/* Trust Row */}
                        <motion.div variants={childVariants} className={styles.trustRow}>
                            <div className={styles.trustBadge}>
                                <div className={styles.stars}>
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={12} fill="currentColor" strokeWidth={0} />
                                    ))}
                                </div>
                                <div className={styles.trustText}>
                                    <span className={styles.trustRating}>4.8 / 5.0</span>
                                    <span className={styles.trustCount}>500+ Reviews</span>
                                </div>
                            </div>
                            <div className={styles.trustDivider} />
                            <div className={styles.trustBadge}>
                                <div className={styles.trustText}>
                                    <span className={styles.trustRating}>Free Delivery</span>
                                    <span className={styles.trustCount}>On orders over ৳2000</span>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </AnimatePresence>

                {/* Controls */}
                <div className={styles.controls}>
                    <div className={styles.arrows}>
                        <button onClick={prevSlide} className={styles.arrowBtn} aria-label="Previous">
                            <ArrowLeft size={16} strokeWidth={1.5} />
                        </button>
                        <button onClick={nextSlide} className={styles.arrowBtn} aria-label="Next">
                            <ArrowRight size={16} strokeWidth={1.5} />
                        </button>
                    </div>

                    <div className={styles.dots}>
                        {SLIDES.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => goTo(i)}
                                className={`${styles.dot} ${i === current ? styles.activeDot : ''}`}
                                aria-label={`Slide ${i + 1}`}
                            />
                        ))}
                    </div>

                    <span className={styles.slideCounter}>
                        0{current + 1} / 0{SLIDES.length}
                    </span>
                </div>
            </div>

            {/* ── RIGHT: IMAGE ── */}
            <div className={styles.imagePane}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={slide.id}
                        variants={imageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
                    >
                        <Image
                            src={slide.image}
                            alt={slide.headlineItalic}
                            fill
                            quality={100}
                            priority={slide.id === 1}
                            sizes="(max-width: 768px) 100vw, 52vw"
                            style={{ objectFit: 'cover', objectPosition: 'center top' }}
                        />
                    </motion.div>
                </AnimatePresence>

                {/* Edge fade */}
                <div className={styles.imageFade} />

                {/* Floating Product Card */}
                <motion.div
                    className={styles.floatingCard}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                    key={`card-${slide.id}`}
                >
                    <div className={styles.floatingCardImg}>
                        <Image
                            src={slide.image}
                            alt={slide.productName}
                            width={160}
                            height={160}
                            quality={90}
                            style={{ objectFit: 'cover', width: '100%', height: '100%', borderRadius: '2px' }}
                        />
                    </div>
                    <div className={styles.floatingCardTag}>Best Seller</div>
                    <div className={styles.floatingCardTitle}>{slide.productName}</div>
                    <div className={styles.floatingCardPrice}>{slide.productPrice}</div>
                </motion.div>
            </div>
        </section>
    );
}
