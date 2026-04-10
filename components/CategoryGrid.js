'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import styles from './CategoryGrid.module.css';

const CATEGORIES = [
    {
        title: 'Premium Shirts',
        slug: 'shirts',
        image: '/cat_shirts.png',
        span: 'col-2 row-2',
    },
    {
        title: 'Essential Tees',
        slug: 't-shirts',
        image: '/cat_tees.png',
        span: 'col-1 row-1',
    },
    {
        title: 'Modern Pants',
        slug: 'pants',
        image: '/cat_pants.png',
        span: 'col-1 row-2',
    },
    {
        title: 'Luxury Hoodies',
        slug: 'hoodies',
        image: '/cat_hoodies.png',
        span: 'col-1 row-1',
    },
    {
        title: 'Accessories',
        slug: 'accessories',
        image: '/cat_accessories.png',
        span: 'col-2 row-1',
    },
];

export default function CategoryGrid() {
    return (
        <section className={styles.section}>
            <div className="container">
                <motion.div 
                    className={styles.grid}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                >
                    {CATEGORIES.map((cat, i) => (
                        <Link 
                            key={cat.slug} 
                            href={`/#shop`} 
                            className={`${styles.card} ${styles[cat.span.replace(' ', '-')]}`}
                        >
                            <div className={styles.imageWrapper}>
                                <Image
                                    src={cat.image}
                                    alt={cat.title}
                                    fill
                                    quality={100}
                                    className={styles.image}
                                />
                                <div className={styles.overlay} />
                                <div className={styles.content}>
                                    <h3 className={styles.title}>{cat.title}</h3>
                                    <span className={styles.link}>Explore Collection</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
