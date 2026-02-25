'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, ArrowLeft, ShoppingBag } from 'lucide-react';
import useCartStore from '@/store/cartStore';
import { getProductImageUrl } from '@/lib/api';
import { trackPageView } from '@/lib/pixelEvents';
import QuantitySelector from '@/components/QuantitySelector';
import styles from './page.module.css';

export default function CartPage() {
    const items = useCartStore((s) => s.items);
    const removeItem = useCartStore((s) => s.removeItem);
    const updateQuantity = useCartStore((s) => s.updateQuantity);
    const hydrate = useCartStore((s) => s.hydrate);
    const isHydrated = useCartStore((s) => s.isHydrated);

    const totalPrice = items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    );

    useEffect(() => {
        hydrate();
        trackPageView();
    }, [hydrate]);

    if (!isHydrated) {
        return (
            <div className={styles.page}>
                <div className="container">
                    <div className={styles.loadingWrap}>
                        <div className={styles.spinner} />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Link href="/" className={styles.backBtn}>
                        <ArrowLeft size={18} />
                        <span>Continue Shopping</span>
                    </Link>

                    <h1 className={styles.title}>Your Cart</h1>
                    <p className={styles.subtitle}>
                        {items.length === 0
                            ? 'Your cart is empty'
                            : `${items.length} item${items.length !== 1 ? 's' : ''} in your cart`}
                    </p>
                </motion.div>

                {items.length === 0 ? (
                    <motion.div
                        className={styles.empty}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className={styles.emptyIcon}>
                            <ShoppingBag size={48} strokeWidth={1} />
                        </div>
                        <h3 className={styles.emptyTitle}>Your cart is empty</h3>
                        <p className={styles.emptyText}>
                            Discover our premium collection and add something you love.
                        </p>
                        <Link href="/#shop" className="btn btn-gold">
                            Browse Collection
                        </Link>
                    </motion.div>
                ) : (
                    <div className={styles.layout}>
                        {/* Cart Items */}
                        <div className={styles.itemsList}>
                            <AnimatePresence mode="popLayout">
                                {items.map((item) => {
                                    const imageUrl = getProductImageUrl(item.product);
                                    return (
                                        <motion.div
                                            key={item.id}
                                            className={styles.item}
                                            layout
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20, height: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <div className={styles.itemImage}>
                                                <img src={imageUrl} alt={item.product.name} />
                                            </div>

                                            <div className={styles.itemDetails}>
                                                <Link href={`/product/${item.product.id}`} className={styles.itemName}>
                                                    {item.product.name}
                                                </Link>

                                                <div className={styles.itemMeta}>
                                                    <span>
                                                        Size: <strong>{item.size}</strong>
                                                    </span>
                                                    <span className={styles.itemColor}>
                                                        Color:{' '}
                                                        <span
                                                            className={styles.itemColorDot}
                                                            style={{ background: item.color.hex }}
                                                        />
                                                        <strong>{item.color.name}</strong>
                                                    </span>
                                                </div>

                                                <p className={styles.itemPrice}>
                                                    ৳ {item.product.price.toFixed(2)}
                                                </p>

                                                <div className={styles.itemActions}>
                                                    <QuantitySelector
                                                        value={item.quantity}
                                                        onChange={(qty) => updateQuantity(item.id, qty)}
                                                        max={item.product.stock[item.size] || 99}
                                                    />
                                                    <button
                                                        className={styles.removeBtn}
                                                        onClick={() => removeItem(item.id)}
                                                        aria-label="Remove item"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className={styles.itemTotal}>
                                                <span className={styles.itemTotalLabel}>Total</span>
                                                <span className={styles.itemTotalPrice}>
                                                    ৳ {(item.product.price * item.quantity).toFixed(2)}
                                                </span>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>

                        {/* Order Summary */}
                        <motion.div
                            className={styles.summary}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <h3 className={styles.summaryTitle}>Order Summary</h3>

                            <div className={styles.summaryRow}>
                                <span>Subtotal</span>
                                <span>৳ {totalPrice.toFixed(2)}</span>
                            </div>

                            <div className={styles.summaryRow}>
                                <span>Shipping</span>
                                <span className={styles.shippingFree} style={{ fontSize: '0.85rem' }}>
                                    {totalPrice >= 5000 ? 'Free' : 'Calculated at checkout'}
                                </span>
                            </div>

                            <div className={styles.summaryDivider} />

                            <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
                                <span>Total (excl. shipping)</span>
                                <span>
                                    ৳ {totalPrice.toFixed(2)}
                                </span>
                            </div>

                            <Link
                                href="/checkout"
                                className={`btn btn-gold btn-lg ${styles.checkoutBtn}`}
                            >
                                Proceed to Checkout
                            </Link>

                            <Link href="/#shop" className={styles.continueLink}>
                                Continue Shopping
                            </Link>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
}
