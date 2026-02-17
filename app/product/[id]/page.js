'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ShoppingBag, ArrowLeft, Check, Package, Truck } from 'lucide-react';
import { getProduct, getProductImageUrl } from '@/lib/api';
import { trackViewContent, trackAddToCart } from '@/lib/pixelEvents';
import useCartStore from '@/store/cartStore';
import ColorSwatch from '@/components/ColorSwatch';
import SizePicker from '@/components/SizePicker';
import QuantitySelector from '@/components/QuantitySelector';
import styles from './page.module.css';

export default function ProductPage() {
    const { id } = useParams();
    const router = useRouter();
    const addItem = useCartStore((s) => s.addItem);

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);

    useEffect(() => {
        async function load() {
            const data = await getProduct(id);
            if (data) {
                setProduct(data);
                setSelectedColor(data.colors[0]);
                setSelectedSize(data.sizes[0]);
                trackViewContent(data);
            }
            setLoading(false);
        }
        load();
    }, [id]);

    const handleAddToCart = () => {
        if (!product || !selectedSize) return;
        if (product.colors && product.colors.length > 0 && !selectedColor) return;
        addItem(product, selectedSize, selectedColor, quantity);
        trackAddToCart(product, quantity);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    const getStockForSize = () => {
        if (!product || !selectedSize) return 0;
        return product.stock[selectedSize] || 0;
    };

    if (loading) {
        return (
            <div className={styles.loadingWrap}>
                <div className={styles.spinner} />
            </div>
        );
    }

    if (!product) {
        return (
            <div className={styles.notFound}>
                <h2>Product Not Found</h2>
                <p>The product you&apos;re looking for doesn&apos;t exist.</p>
                <Link href="/" className="btn btn-gold">
                    Back to Shop
                </Link>
            </div>
        );
    }

    const imageUrl = getProductImageUrl(product);
    const stockCount = getStockForSize();

    return (
        <div className={styles.page}>
            <div className="container">
                <motion.button
                    className={styles.backBtn}
                    onClick={() => router.back()}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <ArrowLeft size={18} />
                    <span>Back</span>
                </motion.button>

                <div className={styles.layout}>
                    {/* Image Section */}
                    <motion.div
                        className={styles.imageSection}
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className={styles.imageContainer}>
                            <img src={imageUrl} alt={product.name} className={styles.image} />
                            <div className={styles.imageZoom} />
                        </div>
                    </motion.div>

                    {/* Details Section */}
                    <motion.div
                        className={styles.details}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        <span className={styles.category}>
                            {product.category === 'hoodies' ? 'Hoodie' : 'T-Shirt'}
                        </span>

                        <h1 className={styles.name}>{product.name}</h1>

                        <p className={styles.price}>৳ {product.price.toFixed(2)}</p>

                        <p className={styles.description}>{product.description}</p>

                        <div className={styles.divider} />

                        {/* Color Selector */}
                        <div className={styles.optionGroup}>
                            <label className={styles.optionLabel}>
                                Color — <span className={styles.optionValue}>{selectedColor?.name}</span>
                            </label>
                            <ColorSwatch
                                colors={product.colors}
                                selected={selectedColor}
                                onChange={setSelectedColor}
                            />
                        </div>

                        {/* Size Selector */}
                        <div className={styles.optionGroup}>
                            <label className={styles.optionLabel}>
                                Size — <span className={styles.optionValue}>{selectedSize}</span>
                            </label>
                            <SizePicker
                                sizes={product.sizes}
                                selected={selectedSize}
                                onChange={setSelectedSize}
                                stock={product.stock}
                            />
                        </div>

                        {/* Stock */}
                        <div className={styles.stock}>
                            {stockCount > 0 ? (
                                <span className={styles.inStock}>
                                    <Check size={14} /> {stockCount} in stock
                                </span>
                            ) : (
                                <span className={styles.outOfStock}>Out of stock</span>
                            )}
                        </div>

                        {/* Quantity */}
                        <div className={styles.optionGroup}>
                            <label className={styles.optionLabel}>Quantity</label>
                            <QuantitySelector
                                value={quantity}
                                onChange={setQuantity}
                                max={stockCount}
                            />
                        </div>

                        {/* Add to Cart */}
                        <button
                            className={`btn btn-gold btn-lg ${styles.addToCart}`}
                            onClick={handleAddToCart}
                            disabled={stockCount === 0 || added}
                        >
                            {added ? (
                                <>
                                    <Check size={18} />
                                    Added to Cart
                                </>
                            ) : (
                                <>
                                    <ShoppingBag size={18} />
                                    Add to Cart — ৳ {(product.price * quantity).toFixed(2)}
                                </>
                            )}
                        </button>

                        {/* Trust Badges */}
                        <div className={styles.trust}>
                            <div className={styles.trustItem}>
                                <Truck size={16} />
                                <span>Free delivery over ৳ 5000</span>
                            </div>
                            <div className={styles.trustItem}>
                                <Package size={16} />
                                <span>Premium packaging</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
