'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';
import styles from '../login/auth.module.css';

export default function ResetPasswordPage() {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleReset = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.updateUser({
                password: password
            });

            if (error) throw error;

            toast.success('Password updated successfully! You can now log in.');
            router.push('/login');

        } catch (err) {
            setError(err.message);
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!mounted) return <div className={styles.page} />;

    return (
        <div className={styles.page}>
            <motion.div
                className={styles.card}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className={styles.header}>
                    <h1 className={styles.title}>New Password</h1>
                    <p className={styles.subtitle}>Enter a strong new password for your account</p>
                </div>

                {error && <div className={styles.globalError}>{error}</div>}

                <form className={styles.form} onSubmit={handleReset}>
                    <div className={styles.field}>
                        <label className="input-label" htmlFor="password">New Password</label>
                        <input
                            id="password"
                            type="password"
                            className="input-field"
                            placeholder="Enter new password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className={styles.field}>
                        <label className="input-label" htmlFor="confirm">Confirm Password</label>
                        <input
                            id="confirm"
                            type="password"
                            className="input-field"
                            placeholder="Re-enter new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-gold btn-lg"
                        style={{ marginTop: '1rem' }}
                        disabled={loading || !password || !confirmPassword}
                    >
                        {loading ? 'Updating...' : 'Update Password'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
}
