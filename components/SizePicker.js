'use client';

import styles from './SizePicker.module.css';

export default function SizePicker({ sizes, selected, onChange, stock = {} }) {
    return (
        <div className={styles.wrapper}>
            {sizes.map((size) => {
                const inStock = stock[size] == null || stock[size] > 0;
                return (
                    <button
                        key={size}
                        className={`${styles.pill} ${selected === size ? styles.active : ''
                            } ${!inStock ? styles.outOfStock : ''}`}
                        onClick={() => inStock && onChange(size)}
                        disabled={!inStock}
                        aria-label={`Size ${size}${!inStock ? ' - Out of stock' : ''}`}
                    >
                        {size}
                    </button>
                );
            })}
        </div>
    );
}
