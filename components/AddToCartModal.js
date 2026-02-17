'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag } from 'lucide-react';
import useQuickViewStore from '@/store/quickViewStore';
import useCartStore from '@/store/cartStore';
import { getProductImageUrl } from '@/lib/api';
import ColorSwatch from './ColorSwatch';
import SizePicker from './SizePicker';
import QuantitySelector from './QuantitySelector';
import styles from './AddToCartModal.module.css';

export default function AddToCartModal() {
    const { isOpen, selectedProduct, closeModal } = useQuickViewStore();
    const addItem = useCartStore((s) => s.addItem);

    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [quantity, setQuantity] = useState(1);

    // Reset state when product changes
    useEffect(() => {
        if (selectedProduct) {
            setSelectedColor(selectedProduct.colors?.[0] || null);
            setSelectedSize(selectedProduct.sizes?.[0] || null);
            setQuantity(1);
        }
    }, [selectedProduct]);

    const handleAddToCart = () => {
        if (!selectedProduct || !selectedSize) return;

        // If product has colors but none selected, don't add
        if (selectedProduct.colors?.length > 0 && !selectedColor) return;

        addItem(selectedProduct, selectedSize, selectedColor, quantity);
        closeModal();
    };

    if (!isOpen || !selectedProduct) return null;

    const imageUrl = getProductImageUrl(selectedProduct);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className={styles.overlay}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={closeModal}
                >
                    <motion.div
                        className={styles.modal}
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button className={styles.closeBtn} onClick={closeModal}>
                            <X size={20} />
                        </button>

                        <div className={styles.header}>
                            <img src={imageUrl} alt={selectedProduct.name} className={styles.image} />
                            <div className={styles.productInfo}>
                                <h3 className={styles.name}>{selectedProduct.name}</h3>
                                <p className={styles.price}>৳ {selectedProduct.price.toFixed(2)}</p>
                            </div>
                        </div>

                        {selectedProduct.colors?.length > 0 && (
                            <div className={styles.section}>
                                <span className={styles.label}>Color: {selectedColor?.name}</span>
                                <ColorSwatch
                                    colors={selectedProduct.colors}
                                    selected={selectedColor}
                                    onChange={setSelectedColor}
                                />
                            </div>
                        )}

                        <div className={styles.section}>
                            <span className={styles.label}>Size: {selectedSize}</span>
                            <SizePicker
                                sizes={selectedProduct.sizes}
                                selected={selectedSize}
                                onChange={setSelectedSize}
                                stock={selectedProduct.stock}
                            />
                        </div>

                        <div className={styles.section}>
                            <span className={styles.label}>Quantity</span>
                            <QuantitySelector
                                value={quantity}
                                onChange={setQuantity}
                                max={selectedProduct.stock?.[selectedSize] || 99}
                            />
                        </div>

                        <button
                            className={`btn btn-gold ${styles.addToCart}`}
                            onClick={handleAddToCart}
                            disabled={!selectedSize || (selectedProduct.stock?.[selectedSize] === 0)}
                        >
                            <ShoppingBag size={18} />
                            Add to Cart - ৳ {(selectedProduct.price * quantity).toFixed(2)}
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
