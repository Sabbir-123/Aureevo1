'use client';

import { useEffect, Suspense } from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AddToCartModal from '@/components/AddToCartModal';
import { Toaster } from 'react-hot-toast';
import useAuthStore from '@/store/authStore';
import useSiteAnalytics from '@/hooks/useSiteAnalytics';

function AnalyticsWrapper() {
    useSiteAnalytics();
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
        return <>{children}</>;
    }

    return (
        <>
            <Suspense fallback={null}>
                <AnalyticsWrapper />
            </Suspense>
            <Header />
            <main style={{ minHeight: '100vh' }}>{children}</main>
            <Footer />
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
