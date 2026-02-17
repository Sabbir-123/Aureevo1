'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, Sparkles } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { getProducts } from '@/lib/api';
import { trackPageView } from '@/lib/pixelEvents';
import styles from './page.module.css';

const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'hoodies', label: 'Hoodies' },
  { key: 'tshirts', label: 'T-Shirts' },
];

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    trackPageView();
    async function load() {
      const data = await getProducts();
      setProducts(data);
      setFilteredProducts(data);
      setLoading(false);
    }
    load();
  }, []);

  useEffect(() => {
    if (activeCategory === 'all') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter((p) => p.category === activeCategory));
    }
  }, [activeCategory, products]);

  const scrollToShop = () => {
    document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={styles.page}>
      {/* ===== HERO SECTION ===== */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroPattern} />

        <motion.div
          className={styles.heroContent}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.div
            className={styles.heroBadge}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Sparkles size={14} />
            <span>New Collection 2026</span>
          </motion.div>

          <h1 className={styles.heroTitle}>
            Redefine Your <span className={styles.heroAccent}>Style</span>
          </h1>

          <p className={styles.heroSubtitle}>
            Premium hoodies and t-shirts crafted for those who demand excellence.<br />
            Luxury fabrics. Timeless design. Uncompromising quality.
          </p>

          <motion.div
            className={styles.heroCta}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <button className="btn btn-gold btn-lg" onClick={scrollToShop}>
              Shop Now
            </button>
            <button className="btn btn-outline btn-lg" onClick={scrollToShop}>
              Explore Collection
            </button>
          </motion.div>
        </motion.div>

        <motion.button
          className={styles.scrollDown}
          onClick={scrollToShop}
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          aria-label="Scroll to shop"
        >
          <ArrowDown size={20} />
        </motion.button>
      </section>

      {/* ===== SHOP SECTION ===== */}
      <section id="shop" className={styles.shop}>
        <div className="container">
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className={styles.sectionTag}>The Collection</span>
            <h2 className={styles.sectionTitle}>Curated Essentials</h2>
            <p className={styles.sectionDesc}>
              Each piece is meticulously designed and crafted from the finest materials.
            </p>
          </motion.div>

          {/* Category Filter */}
          <div className={styles.filters}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                className={`${styles.filterBtn} ${activeCategory === cat.key ? styles.filterActive : ''
                  }`}
                onClick={() => setActiveCategory(cat.key)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className={styles.loading}>
              <div className={styles.spinner} />
              <p>Loading collection...</p>
            </div>
          ) : (
            <motion.div className={styles.grid} layout>
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      {/* ===== BRAND FEEL SECTION ===== */}
      <section className={styles.brandFeel}>
        <div className={styles.brandFeelOverlay} />
        <motion.div
          className={styles.brandFeelContent}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className={styles.brandFeelTag}>The AUREEVO Promise</span>
          <h2 className={styles.brandFeelTitle}>
            Crafted for <span className={styles.heroAccent}>Distinction</span>
          </h2>
          <p className={styles.brandFeelText}>
            Every thread tells a story of uncompromising quality. From Japanese cotton to French terry,
            we source only the finest materials to create pieces that transcend seasons and trends.
          </p>
          <div className={styles.brandStats}>
            <div className={styles.stat}>
              <span className={styles.statNumber}>100%</span>
              <span className={styles.statLabel}>Premium Cotton</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>48h</span>
              <span className={styles.statLabel}>Express Delivery</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>∞</span>
              <span className={styles.statLabel}>Timeless Style</span>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
