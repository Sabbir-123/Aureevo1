'use client';

import { useState, useEffect } from 'react';
import { getProductAnalytics } from '@/lib/admin-api';
import { ChevronDown, ChevronUp, Eye, ShoppingCart, CreditCard, Activity, X } from 'lucide-react';
import styles from './page.module.css';

export default function ProductIntelligence() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortConfig, setSortConfig] = useState({ key: 'purchases', direction: 'desc' });
    const [searchTerm, setSearchTerm] = useState('');

    // Detailed funnel modal
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        async function load() {
            setLoading(true);
            const { data } = await getProductAnalytics();
            setProducts(data || []);
            setLoading(false);
        }
        load();
    }, []);

    const handleSort = (key) => {
        let direction = 'desc';
        if (sortConfig.key === key && sortConfig.direction === 'desc') {
            direction = 'asc';
        }
        setSortConfig({ key, direction });
    };

    const sortedProducts = [...products].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
    }).filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) return <ChevronDown size={14} style={{ opacity: 0.2 }} />;
        return sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Product Intelligence</h1>
            </div>

            <div className={styles.controls}>
                <input
                    type="text"
                    placeholder="Search products..."
                    className={styles.input}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: '300px' }}
                />
            </div>

            <div className={styles.tableContainer}>
                {loading ? (
                    <div style={{ padding: '2rem', textAlign: 'center' }}>Crunching intelligence data...</div>
                ) : (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th onClick={() => handleSort('name')}>Product {getSortIcon('name')}</th>
                                <th onClick={() => handleSort('views')}>Views {getSortIcon('views')}</th>
                                <th onClick={() => handleSort('addToCart')}>Add to Cart {getSortIcon('addToCart')}</th>
                                <th onClick={() => handleSort('purchases')}>Purchases {getSortIcon('purchases')}</th>
                                <th onClick={() => handleSort('conversionRate')}>Conv. Rate {getSortIcon('conversionRate')}</th>
                                <th onClick={() => handleSort('revenue')}>Revenue {getSortIcon('revenue')}</th>
                                <th onClick={() => handleSort('totalStock')}>Stock {getSortIcon('totalStock')}</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedProducts.map((p) => {
                                const convRate = Number(p.conversionRate);
                                const rateClass = convRate >= 5 ? styles.good : (convRate > 2 ? styles.warning : styles.bad);

                                // Basic visualization relative to max for this view
                                const maxViews = Math.max(...products.map(x => x.views), 1);
                                const viewWidth = Math.min((p.views / maxViews) * 100, 100);

                                return (
                                    <tr key={p.id}>
                                        <td>
                                            <div className={styles.productName}>{p.name}</div>
                                            <div className={styles.category}>{p.category}</div>
                                        </td>
                                        <td>
                                            <div className={styles.metric}>{p.views}</div>
                                            <div className={styles.funnelBar}>
                                                <div className={styles.funnelFill} style={{ width: `${viewWidth}%`, background: '#60a5fa' }} />
                                            </div>
                                        </td>
                                        <td>
                                            <div className={styles.metric}>{p.addToCart}</div>
                                            <div className={styles.funnelBar}>
                                                <div className={styles.funnelFill} style={{ width: `${p.views ? (p.addToCart / p.views) * 100 : 0}%`, background: '#f59e0b' }} />
                                            </div>
                                        </td>
                                        <td>
                                            <div className={styles.metric}>{p.purchases}</div>
                                            <div className={styles.funnelBar}>
                                                <div className={styles.funnelFill} style={{ width: `${p.addToCart ? (p.purchases / p.addToCart) * 100 : 0}%`, background: '#10b981' }} />
                                            </div>
                                        </td>
                                        <td className={`${styles.metric} ${rateClass}`}>
                                            {p.conversionRate}%
                                        </td>
                                        <td className={styles.metric}>
                                            ৳{p.revenue.toLocaleString()}
                                        </td>
                                        <td className={`${styles.metric} ${p.totalStock < 5 ? styles.bad : ''}`}>
                                            {p.totalStock}
                                        </td>
                                        <td>
                                            <button
                                                className={styles.input}
                                                style={{ cursor: 'pointer', padding: '0.4rem 0.8rem' }}
                                                onClick={() => setSelectedProduct(p)}
                                            >
                                                Funnel
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            {selectedProduct && (
                <div className={styles.modalOverlay} onClick={() => setSelectedProduct(null)}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <button className={styles.closeBtn} onClick={() => setSelectedProduct(null)}><X /></button>

                        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', fontFamily: 'Georgia, serif' }}>
                            {selectedProduct.name}
                        </h2>
                        <div style={{ color: 'var(--text-muted)' }}>Deep Funnel Analysis</div>

                        <div className={styles.funnelGrid}>
                            <div className={styles.funnelStep}>
                                <div className={styles.funnelLabel}><Eye size={16} style={{ display: 'inline', marginRight: '5px' }} /> Views</div>
                                <div className={styles.funnelValue}>{selectedProduct.views}</div>
                                <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.5rem' }}>100% of traffic</div>
                            </div>

                            <div className={styles.funnelStep}>
                                <div className={styles.funnelLabel}><ShoppingCart size={16} style={{ display: 'inline', marginRight: '5px' }} /> Add to Cart</div>
                                <div className={styles.funnelValue}>{selectedProduct.addToCart}</div>
                                {selectedProduct.views > 0 && (
                                    <div className={styles.dropoff}>
                                        {(((selectedProduct.views - selectedProduct.addToCart) / selectedProduct.views) * 100).toFixed(1)}% dropoff
                                    </div>
                                )}
                            </div>

                            <div className={styles.funnelStep}>
                                <div className={styles.funnelLabel}><Activity size={16} style={{ display: 'inline', marginRight: '5px' }} /> Checkout Start</div>
                                {/* Approximated from add to cart, could be direct data */}
                                <div className={styles.funnelValue}>{Math.ceil(selectedProduct.addToCart * 0.7)}</div>
                                {selectedProduct.addToCart > 0 && (
                                    <div className={styles.dropoff}>
                                        ~30.0% dropoff
                                    </div>
                                )}
                            </div>

                            <div className={styles.funnelStep}>
                                <div className={styles.funnelLabel}><CreditCard size={16} style={{ display: 'inline', marginRight: '5px' }} /> Purchased</div>
                                <div className={styles.funnelValue}>{selectedProduct.purchases}</div>
                                {Math.ceil(selectedProduct.addToCart * 0.7) > 0 && (
                                    <div className={styles.dropoff} style={{ color: '#4ade80' }}>
                                        {((selectedProduct.purchases / selectedProduct.views) * 100).toFixed(2)}% final conv
                                    </div>
                                )}
                            </div>
                        </div>

                        <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(201,169,110,0.05)', borderRadius: '8px', border: '1px solid rgba(201,169,110,0.2)' }}>
                            <h4 style={{ color: '#c9a96e', marginBottom: '0.5rem' }}>AI Insight Engine</h4>
                            <p style={{ fontSize: '0.9rem', color: '#ccc', lineHeight: '1.6' }}>
                                {Number(selectedProduct.conversionRate) < 2
                                    ? `⚠️ This product has high dropoff. Recommendation: Review the product description for clarity, add higher quality images, or slightly lower the price to test price elasticity.`
                                    : (Number(selectedProduct.totalStock) < 10
                                        ? `🔥 Hot seller. With a ${selectedProduct.conversionRate}% conversion rate, inventory will deplete quickly. Prepare restock immediately.`
                                        : `✅ This product is performing nominally. Consider increasing ad spend directed to this landing page.`
                                    )
                                }
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
