'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle, ShoppingBag, Sparkles } from 'lucide-react';
import useCartStore from '@/store/cartStore';
import { getProductImageUrl, placeOrder } from '@/lib/api';
import { trackInitiateCheckout, trackPurchase, trackPageView } from '@/lib/pixelEvents';
import styles from './page.module.css';

export default function CheckoutPage() {
    const items = useCartStore((s) => s.items);
    const clearCart = useCartStore((s) => s.clearCart);
    const hydrate = useCartStore((s) => s.hydrate);
    const isHydrated = useCartStore((s) => s.isHydrated);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
    });
    const [shippingLocation, setShippingLocation] = useState('inside_dhaka'); // inside_dhaka | outside_dhaka
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [orderResult, setOrderResult] = useState(null);

    const totalPrice = items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    );
    const shipping = totalPrice >= 5000 ? 0 : (shippingLocation === 'inside_dhaka' ? 70 : 150);
    const grandTotal = totalPrice + shipping;

    useEffect(() => {
        hydrate();
        trackPageView();
    }, [hydrate]);

    useEffect(() => {
        if (isHydrated && items.length > 0) {
            trackInitiateCheckout(items, grandTotal);
        }
    }, [isHydrated]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.fullName.trim()) newErrors.fullName = 'Name is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            newErrors.email = 'Invalid email address';
        }
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        if (!formData.address.trim()) newErrors.address = 'Address is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setSubmitting(true);

        const orderData = {
            name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            address: `[${shippingLocation === 'inside_dhaka' ? 'Inside Dhaka' : 'Outside Dhaka'}] ${formData.address}`,
            items: items.map((item) => ({
                productId: item.product.id,
                name: item.product.name,
                image: item.product.images?.[0] || '',
                size: item.size,
                color: item.color.name,
                quantity: item.quantity,
                price: item.product.price,
            })),
            totalPrice: grandTotal,
            deliveryCharge: shipping,
        };

        try {
            const result = await placeOrder(orderData);
            if (result.success) {
                trackPurchase(result.orderId, items, grandTotal);
                setOrderResult(result);
                clearCart();
            }
        } catch (err) {
            console.error('Order failed:', err);
        } finally {
            setSubmitting(false);
        }
    };

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

    // ===== SUCCESS STATE =====
    if (orderResult) {
        return (
            <div className={styles.page}>
                <div className="container">
                    <motion.div
                        className={styles.success}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <motion.div
                            className={styles.successIcon}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                        >
                            <CheckCircle size={64} />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                        >
                            <h1 className={styles.successTitle}>Order Confirmed!</h1>
                            <p className={styles.successText}>
                                Thank you for your purchase. Your order has been placed successfully.
                            </p>
                            <div className={styles.orderId}>
                                <span>Order ID</span>
                                <strong>{orderResult.orderId}</strong>
                            </div>
                            <Link href="/" className="btn btn-gold btn-lg">
                                <Sparkles size={16} />
                                Continue Shopping
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        );
    }

    // ===== EMPTY CART =====
    if (items.length === 0) {
        return (
            <div className={styles.page}>
                <div className="container">
                    <div className={styles.empty}>
                        <ShoppingBag size={48} strokeWidth={1} />
                        <h3>Your cart is empty</h3>
                        <p>Add some items before checking out.</p>
                        <Link href="/#shop" className="btn btn-gold">
                            Browse Collection
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // ===== CHECKOUT FORM =====
    return (
        <div className={styles.page}>
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Link href="/cart" className={styles.backBtn}>
                        <ArrowLeft size={18} />
                        <span>Back to Cart</span>
                    </Link>

                    <h1 className={styles.title}>Checkout</h1>
                    <p className={styles.subtitle}>Complete your order</p>
                </motion.div>

                <div className={styles.layout}>
                    {/* Form */}
                    <motion.form
                        className={styles.form}
                        onSubmit={handleSubmit}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <h3 className={styles.formTitle}>Delivery Information</h3>

                        <div className={styles.field}>
                            <label className="input-label" htmlFor="fullName">
                                Full Name
                            </label>
                            <input
                                id="fullName"
                                name="fullName"
                                type="text"
                                className={`input-field ${errors.fullName ? styles.inputError : ''}`}
                                placeholder="Enter your full name"
                                value={formData.fullName}
                                onChange={handleChange}
                            />
                            {errors.fullName && (
                                <span className={styles.error}>{errors.fullName}</span>
                            )}
                        </div>

                        <div className={styles.field}>
                            <label className="input-label" htmlFor="email">
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                className={`input-field ${errors.email ? styles.inputError : ''}`}
                                placeholder="Enter your email address"
                                value={formData.email}
                                onChange={handleChange}
                            />
                            {errors.email && (
                                <span className={styles.error}>{errors.email}</span>
                            )}
                        </div>

                        <div className={styles.field}>
                            <label className="input-label" htmlFor="phone">
                                Phone Number
                            </label>
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                className={`input-field ${errors.phone ? styles.inputError : ''}`}
                                placeholder="Enter your phone number"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                            {errors.phone && (
                                <span className={styles.error}>{errors.phone}</span>
                            )}
                        </div>

                        <div className={styles.field}>
                            <label className="input-label" htmlFor="address">
                                Delivery Address
                            </label>
                            <textarea
                                id="address"
                                name="address"
                                className={`input-field ${errors.address ? styles.inputError : ''}`}
                                placeholder="Enter your full delivery address"
                                value={formData.address}
                                onChange={handleChange}
                                rows={4}
                            />
                            {errors.address && (
                                <span className={styles.error}>{errors.address}</span>
                            )}
                        </div>

                        <div className={styles.field}>
                            <label className="input-label">Shipping Location</label>
                            <div className={styles.shippingOptions}>
                                <label className={styles.radioLabel}>
                                    <input
                                        type="radio"
                                        name="shippingLocation"
                                        value="inside_dhaka"
                                        checked={shippingLocation === 'inside_dhaka'}
                                        onChange={(e) => setShippingLocation(e.target.value)}
                                    />
                                    <span>Inside Dhaka (৳ 70)</span>
                                </label>
                                <label className={styles.radioLabel}>
                                    <input
                                        type="radio"
                                        name="shippingLocation"
                                        value="outside_dhaka"
                                        checked={shippingLocation === 'outside_dhaka'}
                                        onChange={(e) => setShippingLocation(e.target.value)}
                                    />
                                    <span>Outside Dhaka (৳ 150)</span>
                                </label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className={`btn btn-gold btn-lg ${styles.submitBtn}`}
                            disabled={submitting}
                        >
                            {submitting ? (
                                <>
                                    <span className={styles.btnSpinner} />
                                    Processing...
                                </>
                            ) : (
                                `Place Order — ৳ ${grandTotal.toFixed(2)}`
                            )}
                        </button>
                    </motion.form>

                    {/* Order Summary */}
                    <motion.div
                        className={styles.orderSummary}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <h3 className={styles.summaryTitle}>Order Summary</h3>

                        <div className={styles.summaryItems}>
                            {items.map((item) => {
                                const imageUrl = getProductImageUrl(item.product);
                                return (
                                    <div key={item.id} className={styles.summaryItem}>
                                        <div className={styles.summaryItemImage}>
                                            <img src={imageUrl} alt={item.product.name} />
                                            <span className={styles.summaryItemQty}>{item.quantity}</span>
                                        </div>
                                        <div className={styles.summaryItemInfo}>
                                            <p className={styles.summaryItemName}>{item.product.name}</p>
                                            <p className={styles.summaryItemMeta}>
                                                {item.size} / {item.color.name}
                                            </p>
                                        </div>
                                        <p className={styles.summaryItemPrice}>
                                            ৳ {(item.product.price * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>

                        <div className={styles.summaryDivider} />

                        <div className={styles.summaryRow}>
                            <span>Subtotal</span>
                            <span>৳ {totalPrice.toFixed(2)}</span>
                        </div>

                        <div className={styles.summaryRow}>
                            <span>Shipping</span>
                            <span>{shipping === 0 ? 'Free' : `৳ ${shipping.toFixed(2)}`}</span>
                        </div>

                        <div className={styles.summaryDivider} />

                        <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
                            <span>Total</span>
                            <span>৳ {grandTotal.toFixed(2)}</span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
