'use client';

import { useEffect, Suspense } from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AddToCartModal from '@/components/AddToCartModal';
import { Toaster } from 'react-hot-toast';
import useAuthStore from '@/store/authStore';
import useSiteAnalytics from '@/hooks/useSiteAnalytics';
import WhatsAppFloating from '@/components/WhatsAppFloating';

import { useRouter } from 'next/navigation';

function AnalyticsWrapper() {
    useSiteAnalytics();
    return null;
}

function SessionTracker() {
    const router = useRouter();
    const signOut = useAuthStore((s) => s.signOut);

    useEffect(() => {
        const AUTO_LOGOUT_TIME = 30 * 60 * 1000; // 30 mins

        const updateActivity = () => {
            localStorage.setItem('lastActivity', Date.now().toString());
        };

        const events = ['mousedown', 'keypress', 'scroll', 'touchstart'];
        events.forEach(e => window.addEventListener(e, updateActivity, { passive: true }));

        const checkInactivity = async () => {
            const lastActivity = localStorage.getItem('lastActivity');
            if (lastActivity && Date.now() - parseInt(lastActivity) > AUTO_LOGOUT_TIME) {
                localStorage.removeItem('lastActivity');
                
                await signOut();
                await fetch('/api/auth/logout', { method: 'POST' });
                
                if (window.location.pathname.startsWith('/admin')) {
                    router.replace('/ad/login');
                } else if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/ad/login')) {
                    router.replace('/login');
                }
            }
        };

        // Check initially
        checkInactivity();
        updateActivity();

        const interval = setInterval(checkInactivity, 60 * 1000);

        return () => {
            events.forEach(e => window.removeEventListener(e, updateActivity));
            clearInterval(interval);
        };
    }, [router, signOut]);

    return null;
}

export default function ClientLayout({ children }) {
    const pathname = usePathname();
    const isAdmin = pathname.startsWith('/admin');

    const initializeAuth = useAuthStore((s) => s.initialize);

    useEffect(() => {
        initializeAuth();
    }, [initializeAuth]);

    if (isAdmin) {
        return (
            <>
                <SessionTracker />
                {children}
            </>
        );
    }

    return (
        <>
            <Suspense fallback={null}>
                <AnalyticsWrapper />
            </Suspense>
            <SessionTracker />
            <Header />
            <main style={{ minHeight: '100vh' }}>{children}</main>
            <Footer />
            <WhatsAppFloating />
            <AddToCartModal />
            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        background: '#111',
                        color: '#fff',
                        border: '1px solid #333',
                    },
                    success: {
                        iconTheme: {
                            primary: '#c9a96e',
                            secondary: '#111',
                        },
                    },
                }}
            />
        </>
    );
}
