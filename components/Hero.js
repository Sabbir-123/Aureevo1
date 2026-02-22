'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Play, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import styles from './Hero.module.css';

// Using the generated images and placeholders for now.
// In a real app, these would be high-res assets in public/.
const SLIDES = [
    {
        id: 1,
        topLabel: 'ESSENTIAL LUXURY',
        headline: 'The Perfect',
        headlineAccent: 'T-Shirt',
        description: 'Elevated basics. Crafted from the finest Egyptian cotton for an unmatched feel and fit.',
        primaryBtn: 'SHOP TEES',
        primaryBtnStyle: 'white',
        secondaryBtn: 'WATCH FILM',
        image: '/hero_tshirt_model_1771349160711.png',
        glowColor: 'rgba(100, 100, 100, 0.2)',
        type: 'tshirt'
    },
    {
        id: 2,
        topLabel: 'NEW COLLECTION 2026',
        headline: 'Modern',
        headlineAccent: 'Polo',
        description: 'Redefining the classic polo. Signature cuts tailored for the modern gentleman.',
        primaryBtn: 'SHOP POLOS',
        primaryBtnStyle: 'gold',
        secondaryBtn: 'VIEW EDITORIAL',
        image: '/hero_polo.png',
        glowColor: 'rgba(201, 169, 110, 0.25)',
        type: 'polo'
    }
];

export default function Hero() {
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

    const goToSlide = (index) => {
        setDirection(index > current ? 1 : -1);
        setCurrent(index);
    };

    useEffect(() => {
        const timer = setInterval(() => {
            nextSlide();
        }, 6000); // 6 seconds auto-play
        return () => clearInterval(timer);
    }, [nextSlide]);

    const slide = SLIDES[current];

    // Animation Variants
    const textVariants = {
        initial: { opacity: 0, x: -30 },
        animate: { opacity: 1, x: 0, transition: { duration: 0.8, ease: 'easeOut' } },
        exit: { opacity: 0, x: 30, transition: { duration: 0.5, ease: 'easeIn' } }
    };

    const imageVariants = {
        initial: { opacity: 0, scale: 1.1 },
        animate: { opacity: 1, scale: 1, transition: { duration: 1.2, ease: 'easeOut' } },
        exit: { opacity: 0, scale: 1.05, transition: { duration: 0.8 } }
    };

    const staggerContainer = {
        animate: { transition: { staggerChildren: 0.1 } }
    };

    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
        exit: { opacity: 0, y: -20, transition: { duration: 0.4 } }
    };

    return (
        <section className={styles.hero}>
            {/* Background Ambience */}
            <div className={styles.heroBg} />

            <div className={styles.container}>
                {/* LEFT SIDE - CONTENT */}
                <div className={styles.contentWrapper}>
                    <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                            key={slide.id}
                            variants={staggerContainer}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            className={styles.contentInner}
                        >
                            {/* Top Label */}
                            <motion.div variants={fadeInUp} className={styles.topLabel}>
                                <span className={styles.labelLine} />
                                {slide.topLabel}
                            </motion.div>

                            {/* Headline */}
                            <motion.h1 variants={fadeInUp} className={styles.headline}>
                                {slide.headline} <br />
                                <span className={styles.accent}>{slide.headlineAccent}</span>
                            </motion.h1>

                            {/* Description */}
                            <motion.p variants={fadeInUp} className={styles.description}>
                                {slide.description}
                            </motion.p>

                            {/* CTA Buttons */}
                            <motion.div variants={fadeInUp} className={styles.ctaGroup}>
                                <button className={`${styles.btn} ${slide.primaryBtnStyle === 'white' ? styles.btnPrimaryWhite : styles.btnPrimaryGold}`}>
                                    {slide.primaryBtn}
                                </button>
                                <button className={`${styles.btn} ${styles.btnSecondary}`}>
                                    <Play size={14} fill="currentColor" />
                                    {slide.secondaryBtn}
                                </button>
                            </motion.div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation Controls */}
                    <div className={styles.controls}>
                        <div className={styles.dots}>
                            {SLIDES.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => goToSlide(idx)}
                                    className={`${styles.dot} ${idx === current ? styles.activeDot : ''}`}
                                    aria-label={`Go to slide ${idx + 1}`}
                                />
                            ))}
                        </div>

                        <div className={styles.arrows}>
                            <button onClick={prevSlide} className={styles.arrowBtn} aria-label="Previous Slide">
                                <ArrowLeft size={24} />
                            </button>
                            <button onClick={nextSlide} className={styles.arrowBtn} aria-label="Next Slide">
                                <ArrowRight size={24} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE - IMAGE */}
                <div className={styles.imageWrapper}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={slide.id}
                            className={styles.imageInner}
                            variants={imageVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                        >
                            {/* Glow Effect */}
                            <div className={styles.glow} style={{ '--glow-color': slide.glowColor }} />

                            <div className={styles.imageContainer}>
                                <Image
                                    src={slide.image}
                                    alt={slide.headline}
                                    fill
                                    priority={slide.id === 1}
                                    sizes="(max-width: 900px) 100vw, 50vw"
                                    className={`${styles.heroImage} ${styles.floating}`}
                                />
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                className={styles.scrollIndicator}
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            >
                <span className={styles.scrollText}>SCROLL</span>
                <div className={styles.scrollLine} />
            </motion.div>
        </section>
    );
}
