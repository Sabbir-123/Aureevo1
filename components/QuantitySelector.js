'use client';

import styles from './QuantitySelector.module.css';
import { Minus, Plus } from 'lucide-react';

export default function QuantitySelector({ value, onChange, min = 1, max = 99 }) {
    const decrease = () => {
        if (value > min) onChange(value - 1);
    };

    const increase = () => {
        if (value < max) onChange(value + 1);
    };

    return (
        <div className={styles.wrapper}>
            <button
                className={styles.btn}
                onClick={decrease}
                disabled={value <= min}
                aria-label="Decrease quantity"
            >
                <Minus size={14} />
            </button>
            <span className={styles.value}>{value}</span>
            <button
                className={styles.btn}
                onClick={increase}
                disabled={value >= max}
                aria-label="Increase quantity"
            >
                <Plus size={14} />
            </button>
        </div>
    );
}
