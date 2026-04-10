'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Hero from '@/components/Hero';
import CategoryGrid from '@/components/CategoryGrid';
import EditorialStory from '@/components/EditorialStory';
import ValueProps from '@/components/ValueProps';
import Testimonials from '@/components/Testimonials';
import InstaGrid from '@/components/InstaGrid';
import ProductCard from '@/components/ProductCard';
import { getProducts, getCategories } from '@/lib/api';
import { trackPageView } from '@/lib/pixelEvents';
import Image from 'next/image';
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
      // Filter for featured products or just take first 4 for display
      setFeaturedProducts(data.filter(p => p.is_featured).slice(0, 4));
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

  return (
    <div className={styles.page}>
      {/* 1. HERO */}
      <Hero />

      {/* 2. CATEGORY GRID */}
      <CategoryGrid />

      {/* 3. FEATURED DROPS */}
      {!loading && featuredProducts.length > 0 && (
        <section className={styles.featuredSection}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionTag}>Trending Now</span>
              <h2 className={styles.sectionTitle}>Featured Drops</h2>
            </div>
            <div className={styles.featuredGrid}>
              {featuredProducts.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
            <div className={styles.viewAllWrapper}>
              <a href="#shop" className={styles.viewAllBtn}>View All Drops</a>
            </div>
          </div>
        </section>
      )}

      {/* 4. EDITORIAL STORY */}
      <EditorialStory />

      {/* 5. SHOP SECTION */}
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
            <h2 className={styles.sectionTitle}>All Products</h2>
          </motion.div>

          {/* Category Filter */}
          <div className={styles.filters}>
            <button
              className={`${styles.filterBtn} ${activeCategory === 'all' ? styles.filterActive : ''}`}
              onClick={() => setActiveCategory('all')}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.slug}
                className={`${styles.filterBtn} ${activeCategory === cat.slug ? styles.filterActive : ''}`}
                onClick={() => setActiveCategory(cat.slug)}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {loading ? (
            <div className={styles.loading}>
               <div className={styles.loaderBrand}>AUREEVO</div>
               <p className={styles.loaderText}>Curating...</p>
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

      {/* 6. VALUE PROPS */}
      <ValueProps />

      {/* 7. TESTIMONIALS */}
      <Testimonials />

      {/* 8. INSTAGRAM GRID */}
      <InstaGrid />

      {/* 9. FINAL CTA */}
      <section className={styles.finalCta}>
          <div className={styles.ctaBg}>
              <Image 
                src="/cta_final.png" 
                alt="Join the wave" 
                fill 
                className={styles.ctaImg}
              />
              <div className={styles.ctaOverlay} />
          </div>
          <motion.div 
            className={styles.ctaContent}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
              <h2 className={styles.ctaTitle}>Join the New Wave</h2>
              <p className={styles.ctaDesc}>Elevate your wardrobe with intentional design. Experience AUREEVO.</p>
              <div className={styles.ctaButtons}>
                  <a href="#shop" className={styles.ctaBtnPrimary}>Shop Collection</a>
                  <a href="https://instagram.com/aureevobd" className={styles.ctaBtnSecondary}>Follow Us</a>
              </div>
          </motion.div>
      </section>
    </div>
  );
}
