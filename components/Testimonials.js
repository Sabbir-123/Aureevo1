'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import styles from './Testimonials.module.css';

const TESTIMONIALS = [
    {
        quote: "The quality of the oversized tees is unmatched. You can really feel the difference in the heavyweight cotton. AUREEVO is now my go-to for essentials.",
        author: "Fahim Ahmed",
        role: "Creative Director"
    },
    {
        quote: "Minimalism done right. The fit of the hoodies is exactly what I've been looking for. International quality right here in Bangladesh.",
        author: "Sarah Kabir",
        role: "Fashion Blogger"
    },
    {
        quote: "Express delivery actually meant 48 hours for me. Impressed with both the products and the seamless service. Highly recommended.",
        author: "Tanvir Hossain",
        role: "Entrepreneur"
    }
];

export default function Testimonials() {
    const [current, setCurrent] = useState(0);

    const next = () => setCurrent((prev) => (prev + 1) % TESTIMONIALS.length);
    const prev = () => setCurrent((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);

    return (
        <section className={styles.section}>
            <div className="container">
                <div className={styles.wrapper}>
                    <div className={styles.iconWrapper}>
                        <Quote size={40} className={styles.icon} />
                    </div>

                    <div className={styles.content}>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={current}
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.02 }}
                                transition={{ duration: 0.5, ease: 'easeOut' }}
                                className={styles.testimonial}
                            >
                                <p className={styles.quote}>"{TESTIMONIALS[current].quote}"</p>
                                <div className={styles.authorGroup}>
                                    <h4 className={styles.author}>{TESTIMONIALS[current].author}</h4>
                                    <span className={styles.role}>{TESTIMONIALS[current].role}</span>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div className={styles.controls}>
                        <button onClick={prev} className={styles.controlBtn} aria-label="Previous">
                            <ChevronLeft size={20} />
                        </button>
                        <div className={styles.indicators}>
                            {TESTIMONIALS.map((_, i) => (
                                <div 
                                    key={i} 
                                    className={`${styles.indicator} ${i === current ? styles.activeIndicator : ''}`} 
                                />
                            ))}
                        </div>
                        <button onClick={next} className={styles.controlBtn} aria-label="Next">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
