'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ShoppingBag, ArrowLeft, Check, Package, Truck, ChevronLeft, ChevronRight } from 'lucide-react';
import { getProduct, getProductImageUrl, getProducts } from '@/lib/api';
import { trackViewContent, trackAddToCart } from '@/lib/pixelEvents';
import useCartStore from '@/store/cartStore';
import toast from 'react-hot-toast';
import ColorSwatch from '@/components/ColorSwatch';
import SizePicker from '@/components/SizePicker';
import QuantitySelector from '@/components/QuantitySelector';
import ProductCard from '@/components/ProductCard';
import AISizeRecommender from '@/components/AISizeRecommender';
import FitVisualizer from '@/components/FitVisualizer';
import styles from './page.module.css';

export default function ProductPage() {
    const { id } = useParams();
    const router = useRouter();
    const addItem = useCartStore((s) => s.addItem);

    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [sizeUnit, setSizeUnit] = useState('INCH');
    const [recommendedSize, setRecommendedSize] = useState("");

    const handleApplyRecommendation = (size) => {
        setRecommendedSize(size);
        setSelectedSize(size);
    };

    useEffect(() => {
        async function load() {
            setLoading(true);
            const data = await getProduct(id);
            if (data) {
                setProduct(data);
                setSelectedColor(data.colors?.[0] || null);
                setSelectedSize(data.sizes?.[0] || null);
                trackViewContent(data);

                try {
                    const allProducts = await getProducts();
                    const related = allProducts
                        .filter(p => p.category === data.category && p.id !== data.id)
                        .slice(0, 4);
                    setRelatedProducts(related);
                } catch (e) { }
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
        toast.success(`Added ${quantity} ${product.name} to cart`);
        setTimeout(() => setAdded(false), 2000);
    };

    const getStockForSize = () => {
        if (!product || !selectedSize) return 0;
        return product.stock?.[selectedSize] || 0;
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

    let parsedImages = product.images;
    if (typeof parsedImages === 'string') {
        try {
            parsedImages = JSON.parse(parsedImages);
        } catch (e) { /* ignore */ }
    }

    const images = Array.isArray(parsedImages) && parsedImages.length > 0
        ? parsedImages
        : [getProductImageUrl(product)];

    const imageUrl = images[currentImageIndex] || images[0];
    const stockCount = getStockForSize();
    const oldPrice = parseFloat((product.price * 1.3).toFixed(2));
    const discountPercentage = Math.round(((oldPrice - product.price) / oldPrice) * 100);

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
                    <ArrowLeft size={16} />
                    <span>Back</span>
                </motion.button>

                <div className={styles.layout}>
                    {/* Left: Images */}
                    <motion.div
                        className={styles.imageSection}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {images.length > 1 && (
                            <div className={styles.thumbnailSidebar}>
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        className={`${styles.thumbnailBtn} ${idx === currentImageIndex ? styles.thumbnailActive : ''}`}
                                        onClick={() => setCurrentImageIndex(idx)}
                                        aria-label={`View image ${idx + 1}`}
                                    >
                                        <img src={img} alt={`Thumbnail ${idx + 1}`} className={styles.thumbnailImg} />
                                    </button>
                                ))}
                            </div>
                        )}

                        <div className={styles.imageContainer}>
                            {discountPercentage > 0 && (
                                <span className={styles.saleBadge}>SALE</span>
                            )}
                            <div className={styles.mainImageWrapper}>
                                <img src={imageUrl} alt={product.name} className={styles.image} />
                            </div>
                        </div>
                    </motion.div>

                    {/* Right: Info */}
                    <motion.div
                        className={styles.details}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <span className={styles.category}>
                            {product.category || 'Apparel'}
                        </span>

                        <h1 className={styles.name}>{product.name}</h1>

                        <div className={styles.priceContainer}>
                            <span className={styles.price}>৳ {product.price.toFixed(2)}</span>
                            {oldPrice > product.price && (
                                <>
                                    <span className={styles.oldPrice}>৳ {oldPrice.toFixed(2)}</span>
                                    <span className={styles.discountBadge}>{discountPercentage}% OFF</span>
                                </>
                            )}
                        </div>

                        {product.sizes && product.sizes.length > 0 && (
                            <>
                                <AISizeRecommender onApplyRecommendation={handleApplyRecommendation} />
                                <div className={styles.optionGroup}>
                                    <label className={styles.optionLabel}>
                                        Size <span className={styles.optionValue}>— {selectedSize}</span>
                                    </label>
                                    <SizePicker
                                        sizes={product.sizes}
                                        selected={selectedSize}
                                        onChange={setSelectedSize}
                                        stock={product.stock}
                                        aiRecommendedSize={recommendedSize}
                                    />
                                </div>
                            </>
                        )}

                        {product.colors && product.colors.length > 0 && (
                            <div className={styles.optionGroup}>
                                <label className={styles.optionLabel}>
                                    Color <span className={styles.optionValue}>— {selectedColor?.name}</span>
                                </label>
                                <ColorSwatch
                                    colors={product.colors}
                                    selected={selectedColor}
                                    onChange={setSelectedColor}
                                />
                            </div>
                        )}

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <div className={styles.optionGroup} style={{ marginBottom: 0 }}>
                                <QuantitySelector
                                    value={quantity}
                                    onChange={setQuantity}
                                    max={stockCount || 10}
                                />
                            </div>
                            <div className={styles.stock} style={{ marginBottom: 0 }}>
                                {stockCount > 0 ? (
                                    <span className={styles.inStock}>
                                        <Check size={14} /> {stockCount} left
                                    </span>
                                ) : (
                                    <span className={styles.outOfStock}>Out of stock</span>
                                )}
                            </div>
                        </div>

                        <button
                            className={styles.addToCart}
                            onClick={handleAddToCart}
                            disabled={stockCount === 0 || added}
                        >
                            {added ? (
                                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                    <Check size={18} /> ADDED TO CART
                                </span>
                            ) : (
                                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                    <ShoppingBag size={18} /> ADD TO CART
                                </span>
                            )}
                        </button>

                        <div className={styles.trust}>
                            <div className={styles.trustItem}>
                                <Check size={16} />
                                <span>Easy Returns & Exchange</span>
                            </div>
                            <div className={styles.trustItem}>
                                <Check size={16} />
                                <span>Tell us within 7 days</span>
                            </div>
                            <div className={styles.trustItem}>
                                <Check size={16} />
                                <span>Free return shipping</span>
                            </div>
                            <div className={styles.trustItem}>
                                <Check size={16} />
                                <span>Instant refund on receipt</span>
                            </div>
                        </div>

                        <FitVisualizer defaultRecommendedSize={recommendedSize || "L"} />

                        <p className={styles.description}>
                            {product.description || "Premium men's apparel made with high-quality combed compact cotton. Designed for a smooth feel, breathable comfort, and long-lasting durability. The mid-weight fabric offers a structured fit perfect for everyday wear."}
                        </p>

                        <div className={styles.divider} />

                        <div className={styles.specifications}>
                            <h3 className={styles.specTitle}>Detailed Specification</h3>
                            <ul className={styles.specList}>
                                <li>Organic Ringspun Combed Compact Cotton</li>
                                <li>100% Cotton</li>
                                <li>Regular Fit</li>
                                <li>Crew Neck</li>
                                <li>Mid-weight (~175 GSM)</li>
                                <li>Reactive Dye</li>
                                <li>Enzyme & Silicon Washed</li>
                                <li>Preshrunk to Minimize Shrinkage</li>
                            </ul>
                        </div>

                        <div className={styles.divider} />

                        <div className={styles.sizeChartSection}>
                            <div className={styles.sizeChartHeader}>
                                <h3 className={styles.sizeChartTitle}>Size Chart</h3>
                                <div className={styles.unitToggle}>
                                    <button
                                        className={`${styles.unitBtn} ${sizeUnit === 'INCH' ? styles.unitBtnActive : ''}`}
                                        onClick={() => setSizeUnit('INCH')}
                                    >
                                        INCH
                                    </button>
                                    <button
                                        className={`${styles.unitBtn} ${sizeUnit === 'CM' ? styles.unitBtnActive : ''}`}
                                        onClick={() => setSizeUnit('CM')}
                                    >
                                        CM
                                    </button>
                                </div>
                            </div>
                            <div className={styles.tableWrapper}>
                                <table className={styles.sizeTable}>
                                    <thead>
                                        <tr>
                                            <th>Size</th>
                                            <th>Chest</th>
                                            <th>Length</th>
                                            <th>Sleeve</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>M</td>
                                            <td>{sizeUnit === 'INCH' ? '39' : '99'}</td>
                                            <td>{sizeUnit === 'INCH' ? '27.5' : '70'}</td>
                                            <td>{sizeUnit === 'INCH' ? '8.5' : '21.5'}</td>
                                        </tr>
                                        <tr>
                                            <td>L</td>
                                            <td>{sizeUnit === 'INCH' ? '40.5' : '103'}</td>
                                            <td>{sizeUnit === 'INCH' ? '28' : '71'}</td>
                                            <td>{sizeUnit === 'INCH' ? '8.75' : '22'}</td>
                                        </tr>
                                        <tr>
                                            <td>XL</td>
                                            <td>{sizeUnit === 'INCH' ? '43' : '109'}</td>
                                            <td>{sizeUnit === 'INCH' ? '29' : '74'}</td>
                                            <td>{sizeUnit === 'INCH' ? '9' : '23'}</td>
                                        </tr>
                                        <tr>
                                            <td>XXL</td>
                                            <td>{sizeUnit === 'INCH' ? '45' : '114'}</td>
                                            <td>{sizeUnit === 'INCH' ? '30' : '76'}</td>
                                            <td>{sizeUnit === 'INCH' ? '9.25' : '23.5'}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {relatedProducts.length > 0 && (
                    <div className={styles.relatedProducts}>
                        <h2 className={styles.relatedTitle}>Frequently Bought Together</h2>
                        <div className={styles.relatedGrid}>
                            {relatedProducts.map(relProduct => (
                                <ProductCard key={relProduct.id} product={relProduct} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
