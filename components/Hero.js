'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Star, ShieldCheck, Users } from 'lucide-react';
import Image from 'next/image';
import { useTheme } from '@/context/ThemeContext';
import styles from './Hero.module.css';

const SLIDES = [
    {
        id: 1,
        topLabel: 'PREMIUM MENSWEAR ESSENTIALS',
        headline: 'Next-Gen',
        headlineHighlight: 'Men\'s Techwear',
        description: 'Engineered for the modern man. Seamless constructs with adaptive fabrics for superior comfort.',
        primaryBtn: 'Shop Men\'s Tees',
        secondaryBtn: 'Explore Collection',
        image: '/mens_collection.png',
        productName: 'Aureevo Zero-G Tee',
        glowColor: 'rgba(0, 255, 204, 0.2)'
    },
    {
        id: 2,
        topLabel: 'LUXURY STREETWEAR DROP',
        headline: 'Advanced',
        headlineHighlight: 'Men\'s Hoodies',
        description: 'Weather-resistant armor. Matte black finish with stealth reflective hits for urban explorers.',
        primaryBtn: 'Shop Men\'s Hoodies',
        secondaryBtn: 'View New Drops',
        image: '/luxury_streetwear_model.png',
        productName: 'Aureevo Stealth Shell',
        glowColor: 'rgba(204, 255, 0, 0.2)'
    },
    {
        id: 3,
        topLabel: 'AERO-DYNAMIC PERFORMANCE',
        headline: 'Velocity',
        headlineHighlight: 'Men\'s Polos',
        description: 'Laser-cut ventilation and absolute mobility. The ultimate everyday performance polo.',
        primaryBtn: 'Shop Men\'s Polos',
        secondaryBtn: 'Browse Lab',
        image: '/hero_tshirt_model_1771349160711.png',
        productName: 'Aureevo V-Polo',
        glowColor: 'rgba(255, 0, 255, 0.2)'
    }
];

export default function Hero() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

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
        }, 5000); // 5 seconds auto-play
        return () => clearInterval(timer);
    }, [nextSlide]);

    const scrollToShop = () => {
        document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
    };

    const slide = SLIDES[current];

    // Animation Variants
    const staggerContainer = {
        animate: { transition: { staggerChildren: 0.1 } }
    };

    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
        exit: { opacity: 0, y: -20, transition: { duration: 0.4 } }
    };

    const imageVariants = {
        initial: { opacity: 0, scale: 1.05, filter: 'blur(10px) hue-rotate(90deg)' },
        animate: { opacity: 1, scale: 1, filter: 'blur(0px) hue-rotate(0deg)', transition: { duration: 1.2, ease: 'easeOut' } },
        exit: { opacity: 0, scale: 0.95, filter: 'blur(5px)', transition: { duration: 0.6 } }
    };

    return (
        <section className={`${styles.heroSection} ${isDark ? styles.darkTheme : styles.lightTheme}`}>
            <div className={styles.carouselContainer}>

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
                                <span className={styles.headlineHighlight}>{slide.headlineHighlight}</span>
                            </motion.h1>

                            {/* Subheadline / Description */}
                            <motion.p variants={fadeInUp} className={styles.description}>
                                {slide.description}
                            </motion.p>

                            {/* CTA Buttons */}
                            <motion.div variants={fadeInUp} className={styles.ctaGroup}>
                                <button className={styles.btnPrimary} onClick={scrollToShop}>
                                    {slide.primaryBtn}
                                </button>
                                <button className={styles.btnSecondary} onClick={scrollToShop}>
                                    {slide.secondaryBtn}
                                </button>
                            </motion.div>

                            {/* Trust Indicators */}
                            <motion.div variants={fadeInUp} className={styles.trustBadges}>
                                <div className={styles.trustBadge}>
                                    <div className={styles.trustIconWrapper}>
                                        <Star className={styles.trustIconStar} size={14} fill="currentColor" />
                                    </div>
                                    <span>4.8 Rating</span>
                                </div>
                                <div className={styles.trustBadge}>
                                    <div className={styles.trustIconWrapper}>
                                        <ShieldCheck className={styles.trustIcon} size={14} />
                                    </div>
                                    <span>Premium Fabric</span>
                                </div>
                                <div className={styles.trustBadge}>
                                    <div className={styles.trustIconWrapper}>
                                        <Users className={styles.trustIcon} size={14} />
                                    </div>
                                    <span>Happy Customers</span>
                                </div>
                            </motion.div>

                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation Controls */}
                    <div className={styles.controls}>
                        <div className={styles.arrows}>
                            <button onClick={prevSlide} className={styles.arrowBtn} aria-label="Previous Slide">
                                <ArrowLeft size={20} />
                            </button>
                            <button onClick={nextSlide} className={styles.arrowBtn} aria-label="Next Slide">
                                <ArrowRight size={20} />
                            </button>
                        </div>

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
                            <div className={styles.imageContainer}>
                                <Image
                                    src={slide.image}
                                    alt={slide.headline}
                                    fill
                                    priority={slide.id === 1}
                                    sizes="(max-width: 900px) 100vw, 50vw"
                                    className={styles.heroImage}
                                />
                            </div>

                            {/* Floating Product Card */}
                            <motion.div
                                className={styles.floatingCard}
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6, duration: 0.8, ease: 'easeOut' }}
                            >
                                <span className={styles.floatingTag}>Best Seller</span>
                                <h4 className={styles.floatingTitle}>{slide.productName}</h4>
                                <div className={styles.floatingRating}>
                                    <div className={styles.stars}>
                                        <Star size={12} fill="currentColor" />
                                        <Star size={12} fill="currentColor" />
                                        <Star size={12} fill="currentColor" />
                                        <Star size={12} fill="currentColor" />
                                        <Star size={12} fill="currentColor" />
                                    </div>
                                    <span className={styles.ratingScore}>4.8 Rating</span>
                                </div>
                            </motion.div>

                        </motion.div>
                    </AnimatePresence>
                </div>

            </div>
        </section>
    );
}
