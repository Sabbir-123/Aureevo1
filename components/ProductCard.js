'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { getProductImageUrl } from '@/lib/api';
import useCartStore from '@/store/cartStore';
import useQuickViewStore from '@/store/quickViewStore';
import { trackAddToCart } from '@/lib/pixelEvents';
import styles from './ProductCard.module.css';

export default function ProductCard({ product, index = 0 }) {
    const openModal = useQuickViewStore((s) => s.openModal);
    const imageUrl = getProductImageUrl(product);

    const handleQuickAdd = (e) => {
        e.preventDefault();
        e.stopPropagation();
        openModal(product);
        // trackAddToCart(product, 1); // Track when actually added from modal
    };

    return (
        <motion.div
            className={styles.card}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
            layout
        >
            <Link href={`/product/${product.id}`} className={styles.imageWrap}>
                <div className={styles.imageContainer}>
                    <img src={imageUrl} alt={product.name} className={styles.image} loading="lazy" />
                    <div className={styles.imageOverlay}>
                        <span className={styles.viewDetails}>View Details</span>
                    </div>
                </div>
            </Link>

            <div className={styles.info}>
                <div className={styles.meta}>
                    <span className={styles.category}>
                        {product.category === 'hoodies' ? 'Hoodie' : 'T-Shirt'}
                    </span>
                </div>

                <Link href={`/product/${product.id}`}>
                    <h3 className={styles.name}>{product.name}</h3>
                </Link>

                <p className={styles.price}>৳ {product.price.toFixed(2)}</p>

                <div className={styles.colors}>
                    {product.colors.map((color) => (
                        <span
                            key={color.name}
                            className={styles.colorDot}
                            style={{ background: color.hex }}
                            title={color.name}
                        />
                    ))}
                </div>

                <button className={`${styles.addBtn} btn btn-gold btn-sm`} onClick={handleQuickAdd}>
                    <ShoppingBag size={14} />
                    Add to Cart
                </button>
            </div>
        </motion.div>
    );
}
