'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import './admin.css';

export default function AdminLayout({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const [authenticated, setAuthenticated] = useState(false);
    const [checking, setChecking] = useState(true);
    const [user, setUser] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch('/api/auth/check');
                if (!res.ok) {
                    router.replace('/ad/login');
                    return;
                }
                const data = await res.json();
                setAuthenticated(true);
                setUser(data.admin);
            } catch {
                router.replace('/ad/login');
            } finally {
                setChecking(false);
            }
        };

        checkAuth();
    }, [pathname, router]);

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.replace('/ad/login');
    };

    if (checking) {
        return (
            <div className="adminRoot">
                <div className="loadingSpinner">Loading...</div>
            </div>
        );
    }

    if (!authenticated) return null;

    return (
        <div className="adminRoot">
            <div className="adminLayout">
                {/* Mobile Header Toggle */}
                <div className="adminMobileHeader">
                    <button className="mobileMenuBtn" onClick={() => setSidebarOpen(true)}>
                        <Menu size={24} />
                    </button>
                    <div className="mobileLogo">AUREEVO</div>
                </div>

                <AdminSidebar
                    onLogout={handleLogout}
                    user={user}
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                />

                {/* Mobile Overlay */}
                {sidebarOpen && (
                    <div className="sidebarOverlay" onClick={() => setSidebarOpen(false)} />
                )}

                <main className="adminMain">{children}</main>
            </div>
        </div>
    );
}
