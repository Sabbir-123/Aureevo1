'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FacebookPixel from '@/components/FacebookPixel';
import AddToCartModal from '@/components/AddToCartModal';

export default function ClientLayout({ children }) {
    const pathname = usePathname();
    const isAdmin = pathname.startsWith('/admin');

    if (isAdmin) {
        return <>{children}</>;
    }

    return (
        <>
            <FacebookPixel />
            <Header />
            <main style={{ minHeight: '100vh' }}>{children}</main>
            <Footer />
            <AddToCartModal />
        </>
    );
}
