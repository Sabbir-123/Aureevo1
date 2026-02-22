'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';
import styles from '../login/auth.module.css';

export default function ForgotPasswordPage() {
    const [authMode, setAuthMode] = useState('email');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    const handleEmailReset = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });
            if (error) throw error;
            setSuccess(true);
            toast.success('Password reset link sent to your email.');
        } catch (err) {
            setError(err.message);
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePhoneReset = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            // Note: Supabase doesn't natively have a clean distinct "forgot password" flow via SMS without custom backend logic. 
            // In a standard setup, you usually verify an OTP first then `updateUser`.
            // Here, we'll try sending standard OTP and instruct user to use it to login and then reset from profile.
            const { error } = await supabase.auth.signInWithOtp({ phone });
            if (error) throw error;
            toast.success('OTP sent. Please Login with this OTP, then update your password in Profile.');
            window.location.href = '/login';
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
                    <h1 className={styles.title}>Reset Password</h1>
                    <p className={styles.subtitle}>Enter your details to receive a reset link</p>
                </div>

                {error && <div className={styles.globalError}>{error}</div>}
                {success && (
                    <div className={styles.globalError} style={{ background: 'rgba(76, 175, 80, 0.1)', borderColor: 'rgba(76, 175, 80, 0.2)', color: 'var(--color-success)' }}>
                        Check your email inbox to proceed.
                    </div>
                )}

                <div className={styles.authToggle}>
                    <button
                        className={`${styles.toggleBtn} ${authMode === 'email' ? styles.active : ''}`}
                        onClick={() => { setAuthMode('email'); setError(null); setSuccess(false); }}
                    >
                        Email
                    </button>
                    <button
                        className={`${styles.toggleBtn} ${authMode === 'phone' ? styles.active : ''}`}
                        onClick={() => { setAuthMode('phone'); setError(null); setSuccess(false); }}
                    >
                        Phone
                    </button>
                </div>

                {authMode === 'email' ? (
                    <form className={styles.form} onSubmit={handleEmailReset}>
                        <div className={styles.field}>
                            <label className="input-label" htmlFor="email">Email Address</label>
                            <input
                                id="email"
                                type="email"
                                className="input-field"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={success}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-gold btn-lg"
                            disabled={loading || !email || success}
                        >
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </button>
                    </form>
                ) : (
                    <form className={styles.form} onSubmit={handlePhoneReset}>
                        <div className={styles.field}>
                            <label className="input-label" htmlFor="phone">Phone Number</label>
                            <input
                                id="phone"
                                type="tel"
                                className="input-field"
                                placeholder="e.g. +1234567890"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-gold btn-lg"
                            disabled={loading || !phone}
                        >
                            {loading ? 'Sending...' : 'Send OTP & Login'}
                        </button>
                    </form>
                )}

                <div className={styles.footer}>
                    Remembered your password?
                    <Link href="/login" className={styles.link}>Sign In</Link>
                </div>
            </motion.div>
        </div>
    );
}
