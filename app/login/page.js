'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, Phone } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';
import styles from './auth.module.css';

export default function LoginPage() {
    const router = useRouter();
    const [authMode, setAuthMode] = useState('email'); // 'email' or 'phone'
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);

    const handleGoogleLogin = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/`,
                },
            });
            if (error) throw error;
        } catch (err) {
            setError(err.message);
            toast.error(err.message);
        }
    };

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) throw error;
            toast.success('Welcome back!');
            router.push('/');
        } catch (err) {
            setError(err.message);
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePhoneLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            if (!otpSent) {
                // Send OTP
                const { error } = await supabase.auth.signInWithOtp({
                    phone,
                });
                if (error) throw error;
                setOtpSent(true);
                toast.success('OTP sent to your phone');
            } else {
                // Verify OTP
                const { data, error } = await supabase.auth.verifyOtp({
                    phone,
                    token: otp,
                    type: 'sms',
                });
                if (error) throw error;
                toast.success('Welcome back!');
                router.push('/');
            }
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
                    <h1 className={styles.title}>Welcome Back</h1>
                    <p className={styles.subtitle}>Sign in to access your account</p>
                </div>

                {error && <div className={styles.globalError}>{error}</div>}

                {/* Google Auth */}
                <button className={styles.socialBtn} onClick={handleGoogleLogin}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84A10.999 10.999 0 0012 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16A10.991 10.991 0 001 12c0 1.61.35 3.14.99 4.5l3.85-2.41z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Continue with Google
                </button>

                <div className={styles.divider}>or</div>

                {/* Auth Mode Toggle */}
                <div className={styles.authToggle}>
                    <button
                        className={`${styles.toggleBtn} ${authMode === 'email' ? styles.active : ''}`}
                        onClick={() => { setAuthMode('email'); setError(null); }}
                    >
                        Email
                    </button>
                    <button
                        className={`${styles.toggleBtn} ${authMode === 'phone' ? styles.active : ''}`}
                        onClick={() => { setAuthMode('phone'); setError(null); }}
                    >
                        Phone
                    </button>
                </div>

                {/* Forms */}
                {authMode === 'email' ? (
                    <form className={styles.form} onSubmit={handleEmailLogin}>
                        <div className={styles.field}>
                            <label className="input-label" htmlFor="email">Email Address</label>
                            <input
                                id="email"
                                type="email"
                                className="input-field"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className={styles.field}>
                            <label className="input-label" htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                className="input-field"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <Link href="/forgot-password" className={styles.forgotLink}>
                            Forgot password?
                        </Link>

                        <button
                            type="submit"
                            className="btn btn-gold btn-lg"
                            disabled={loading || !email || !password}
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>
                ) : (
                    <form className={styles.form} onSubmit={handlePhoneLogin}>
                        <div className={styles.field}>
                            <label className="input-label" htmlFor="phone">Phone Number</label>
                            <input
                                id="phone"
                                type="tel"
                                className="input-field"
                                placeholder="e.g. +1234567890"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                disabled={otpSent}
                                required
                            />
                        </div>

                        {otpSent && (
                            <motion.div
                                className={styles.field}
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                            >
                                <label className="input-label" htmlFor="otp">Enter OTP</label>
                                <input
                                    id="otp"
                                    type="text"
                                    className="input-field"
                                    placeholder="6-digit code"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    required
                                />
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            className="btn btn-gold btn-lg"
                            disabled={loading || !phone || (otpSent && !otp)}
                        >
                            {loading ? 'Processing...' : otpSent ? 'Verify & Sign In' : 'Send OTP'}
                        </button>
                    </form>
                )}

                <div className={styles.footer}>
                    Don&apos;t have an account?
                    <Link href="/signup" className={styles.link}>Sign Up</Link>
                </div>
            </motion.div>
        </div>
    );
}
