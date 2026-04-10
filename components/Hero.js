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
        headlineHighlight: "Men's Techwear",
        description: 'Engineered for the modern man. Seamless constructs with adaptive fabrics for superior comfort and irreplaceable style.',
        primaryBtn: "Shop Men's Tees",
        secondaryBtn: 'Explore Collection',
        image: '/hero_mens_tee.png',
        productName: 'Aureevo Zero-G Tee',
    },
    {
        id: 2,
        topLabel: 'LUXURY STREETWEAR DROP',
        headline: 'Advanced',
        headlineHighlight: "Men's Hoodies",
        description: 'Weather-resistant armor. Precision stitching meets stealth silhouettes built for the bold urban explorer.',
        primaryBtn: "Shop Men's Hoodies",
        secondaryBtn: 'View New Drops',
        image: '/hero_mens_hoodie.png',
        productName: 'Aureevo Stealth Shell',
    },
    {
        id: 3,
        topLabel: 'AERO-DYNAMIC PERFORMANCE',
        headline: 'Velocity',
        headlineHighlight: "Men's Polos",
        description: 'Laser-cut ventilation and absolute mobility. The ultimate everyday performance polo built to move as fast as you do.',
        primaryBtn: "Shop Men's Polos",
        secondaryBtn: 'Browse Lab',
        image: '/hero_mens_polo.png',
        productName: 'Aureevo V-Polo',
    }
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

    const goToSlide = (index) => {
        setDirection(index > current ? 1 : -1);
        setCurrent(index);
    };

    useEffect(() => {
        const timer = setInterval(nextSlide, 6000);
        return () => clearInterval(timer);
    }, [nextSlide]);

    const scrollToShop = () => {
        document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
    };

    const slide = SLIDES[current];

    const staggerContainer = {
        animate: { transition: { staggerChildren: 0.12 } }
    };

    const fadeInUp = {
        initial: { opacity: 0, y: 24 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
        exit: { opacity: 0, y: -16, transition: { duration: 0.4 } }
    };

    const imageVariants = {
        initial: { opacity: 0, scale: 1.06, filter: 'blur(12px)' },
        animate: { opacity: 1, scale: 1, filter: 'blur(0px)', transition: { duration: 1.4, ease: [0.22, 1, 0.36, 1] } },
        exit: { opacity: 0, scale: 0.96, filter: 'blur(6px)', transition: { duration: 0.5 } }
    };

    return (
        <section className={styles.heroSection}>
            {/* ── Cinematic Video Background ── */}
            <div className={styles.videoBg}>
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    poster="/lifestyle_walking.png"
                >
                    {/* Fallback to lifestyle images; replace src with your actual video file */}
                    <source src="/hero_background.mp4" type="video/mp4" />
                </video>
            </div>
            <div className={styles.videoOverlay} />
            <div className={styles.videoShimmer} />

            <div className={styles.sceneGrid}>
                {/* ── LEFT SIDE: CONTENT ── */}
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
                            <motion.div variants={fadeInUp} className={styles.topLabel}>
                                <span className={styles.labelLine} />
                                {slide.topLabel}
                            </motion.div>

                            <motion.h1 variants={fadeInUp} className={styles.headline}>
                                {slide.headline}
                                <span className={styles.headlineHighlight}>{slide.headlineHighlight}</span>
                            </motion.h1>

                            <motion.p variants={fadeInUp} className={styles.description}>
                                {slide.description}
                            </motion.p>

                            <motion.div variants={fadeInUp} className={styles.ctaGroup}>
                                <button className={styles.btnPrimary} onClick={scrollToShop}>
                                    {slide.primaryBtn}
                                </button>
                                <button className={styles.btnSecondary} onClick={scrollToShop}>
                                    {slide.secondaryBtn}
                                </button>
                            </motion.div>

                            <motion.div variants={fadeInUp} className={styles.trustBadges}>
                                <div className={styles.trustBadge}>
                                    <div className={styles.trustIconWrapper}>
                                        <Star className={styles.trustIconStar} size={13} fill="currentColor" />
                                    </div>
                                    <span>4.8 Rating</span>
                                </div>
                                <div className={styles.trustBadge}>
                                    <div className={styles.trustIconWrapper}>
                                        <ShieldCheck className={styles.trustIcon} size={13} />
                                    </div>
                                    <span>Premium Fabric</span>
                                </div>
                                <div className={styles.trustBadge}>
                                    <div className={styles.trustIconWrapper}>
                                        <Users className={styles.trustIcon} size={13} />
                                    </div>
                                    <span>Happy Customers</span>
                                </div>
                            </motion.div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Controls */}
                    <div className={styles.controls}>
                        <div className={styles.arrows}>
                            <button onClick={prevSlide} className={styles.arrowBtn} aria-label="Previous Slide">
                                <ArrowLeft size={18} />
                            </button>
                            <button onClick={nextSlide} className={styles.arrowBtn} aria-label="Next Slide">
                                <ArrowRight size={18} />
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

                {/* ── RIGHT SIDE: IMAGE ── */}
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
                                    quality={100}
                                    priority={slide.id === 1}
                                    sizes="(max-width: 900px) 100vw, 50vw"
                                    className={styles.heroImage}
                                />
                            </div>

                            {/* Glassmorphism Floating Product Card */}
                            <motion.div
                                className={styles.floatingCard}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.8, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                            >
                                <span className={styles.floatingTag}>Best Seller</span>
                                <h4 className={styles.floatingTitle}>{slide.productName}</h4>
                                <div className={styles.floatingRating}>
                                    <div className={styles.stars}>
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={11} fill="currentColor" />
                                        ))}
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
