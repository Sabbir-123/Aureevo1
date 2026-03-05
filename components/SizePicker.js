'use client';

import styles from './SizePicker.module.css';

export default function SizePicker({ sizes, selected, onChange, stock = {}, aiRecommendedSize = "" }) {
    return (
        <div className={styles.wrapper}>
            {sizes.map((size) => {
                const inStock = stock[size] == null || stock[size] > 0;
                const isRecommended = size === aiRecommendedSize;
                return (
                    <button
                        key={size}
                        className={`${styles.pill} ${selected === size ? styles.active : ''
                            } ${!inStock ? styles.outOfStock : ''} ${isRecommended ? styles.recommendedPill : ''}`}
                        onClick={() => inStock && onChange(size)}
                        disabled={!inStock}
                        title={isRecommended ? "AI Recommended Size" : ""}
                        aria-label={`Size ${size}${!inStock ? ' - Out of stock' : ''}`}
                    >
                        {size}
                        {isRecommended && <span className={styles.recommendedBadge}>★</span>}
                    </button>
                );
            })}
        </div>
    );
}
