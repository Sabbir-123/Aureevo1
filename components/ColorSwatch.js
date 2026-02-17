'use client';

import styles from './ColorSwatch.module.css';

export default function ColorSwatch({ colors, selected, onChange }) {
    return (
        <div className={styles.wrapper}>
            {colors.map((color) => (
                <button
                    key={color.name}
                    className={`${styles.swatch} ${selected?.name === color.name ? styles.active : ''
                        }`}
                    style={{ '--swatch-color': color.hex }}
                    onClick={() => onChange(color)}
                    title={color.name}
                    aria-label={`Select ${color.name}`}
                >
                    <span className={styles.inner} />
                </button>
            ))}
        </div>
    );
}
