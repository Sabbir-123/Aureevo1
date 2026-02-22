'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import useAuthStore from '@/store/authStore';
import styles from '../login/auth.module.css';

export default function ProfilePage() {
    const router = useRouter();
    const { user, loading, signOut } = useAuthStore();

    useEffect(() => {
        // Redirect to login if not authenticated and not loading
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    const handleSignOut = async () => {
        await signOut();
        router.push('/');
    };

    if (loading) {
        return (
            <div className={styles.page}>
                <div style={{ color: 'var(--color-gold)' }}>Loading profile...</div>
            </div>
        );
    }

    if (!user) return null; // Wait for redirect

    return (
        <div className={styles.page}>
            <motion.div
                className={styles.card}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{ maxWidth: '600px' }}
            >
                <div className={styles.header}>
                    <h1 className={styles.title}>My Account</h1>
                    <p className={styles.subtitle}>Manage your profile and preferences</p>
                </div>

                <div style={{ background: 'var(--color-black)', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
                    <div style={{ marginBottom: '1rem' }}>
                        <span style={{ color: 'var(--color-grey-500)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Email</span>
                        <div style={{ color: 'var(--color-white)', fontSize: '1.1rem', marginTop: '4px' }}>
                            {user.email || 'N/A'}
                        </div>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <span style={{ color: 'var(--color-grey-500)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Phone</span>
                        <div style={{ color: 'var(--color-white)', fontSize: '1.1rem', marginTop: '4px' }}>
                            {user.phone || 'N/A'}
                        </div>
                    </div>

                    <div>
                        <span style={{ color: 'var(--color-grey-500)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>User ID</span>
                        <div style={{ color: 'var(--color-grey-400)', fontSize: '0.85rem', marginTop: '4px', wordBreak: 'break-all' }}>
                            {user.id}
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleSignOut}
                    className="btn btn-outline"
                    style={{ width: '100%', borderColor: 'var(--color-error)', color: 'var(--color-error)' }}
                >
                    Sign Out
                </button>

            </motion.div>
        </div>
    );
}
