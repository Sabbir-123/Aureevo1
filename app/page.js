'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, Sparkles } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import Hero from '@/components/Hero';
import { getProducts, getCategories } from '@/lib/api';
import { trackPageView } from '@/lib/pixelEvents';
import styles from './page.module.css';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    trackPageView();
    async function load() {
      const [data, cats] = await Promise.all([
        getProducts(),
        getCategories()
      ]);
      setProducts(data);
      setFilteredProducts(data);
      setFeaturedProducts(data.filter(p => p.is_featured));
      setCategories(cats);
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
      <Hero />

      {/* ===== FEATURED SECTION ===== */}
      {!loading && featuredProducts.length > 0 && (
        <section className={styles.shop} style={{ paddingBottom: '2rem' }}>
          <div className="container">
            <motion.div
              className={styles.sectionHeader}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className={styles.sectionTag}>Highlighted</span>
              <h2 className={styles.sectionTitle}>Featured Products</h2>
              <p className={styles.sectionDesc}>
                Handpicked premium quality essentials that define the Aureevo style.
              </p>
            </motion.div>

            <motion.div className={styles.grid} layout>
              <AnimatePresence mode="popLayout">
                {featuredProducts.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </section>
      )}

      {/* ===== SHOP SECTION ===== */}
      <section id="shop" className={styles.shop} style={{ paddingTop: (!loading && featuredProducts.length > 0) ? '2rem' : undefined }}>
        <div className="container">
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className={styles.sectionTag}>The Collection</span>
            <h2 className={styles.sectionTitle}>All Products</h2>
            <p className={styles.sectionDesc}>
              Explore our full range of masterfully crafted apparel.
            </p>
          </motion.div>

          {/* Category Filter */}
          <div className={styles.filters}>
            {categories.map((cat) => (
              <button
                key={cat.slug}
                className={`${styles.filterBtn} ${activeCategory === cat.slug ? styles.filterActive : ''
                  }`}
                onClick={() => setActiveCategory(cat.slug)}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {loading ? (
            <motion.div
              className={styles.loading}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className={styles.loaderBrand}
                animate={{
                  opacity: [0.4, 1, 0.4],
                  scale: [0.98, 1, 0.98],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                AUREEVO
              </motion.div>
              <p className={styles.loaderText}>Curating the collection...</p>
            </motion.div>
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
