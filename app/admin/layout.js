'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import './admin.css';

export default function AdminLayout({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const [authenticated, setAuthenticated] = useState(false);
    const [checking, setChecking] = useState(true);
    const [user, setUser] = useState(null);

    // Skip auth check for login page
    const isLoginPage = pathname === '/admin/login';

    useEffect(() => {
        if (isLoginPage) {
            setChecking(false);
            return;
        }

        const checkAuth = async () => {
            try {
                const res = await fetch('/api/auth/check');
                if (!res.ok) {
                    router.replace('/admin/login');
                    return;
                }
                const data = await res.json();
                setAuthenticated(true);
                setUser(data.admin);
            } catch {
                router.replace('/admin/login');
            } finally {
                setChecking(false);
            }
        };

        checkAuth();
    }, [pathname, isLoginPage, router]);

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.replace('/admin/login');
    };

    // Login page renders without layout chrome
    if (isLoginPage) {
        return <>{children}</>;
    }

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
                <AdminSidebar onLogout={handleLogout} user={user} />
                <main className="adminMain">{children}</main>
            </div>
        </div>
    );
}
