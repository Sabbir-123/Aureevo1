'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingCart, Settings, LogOut, ArrowLeft, BarChart3, Users as UsersIcon } from 'lucide-react';

export default function AdminSidebar({ onLogout, user }) {
    const pathname = usePathname();

    const allLinks = [
        { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, req: null },
        { href: '/admin/analytics', label: 'Analytics', icon: BarChart3, req: 'root' },
        { href: '/admin/products', label: 'Products', icon: Package, req: 'products' },
        { href: '/admin/orders', label: 'Orders', icon: ShoppingCart, req: 'orders' },
        { href: '/admin/settings/employees', label: 'Employees', icon: UsersIcon, req: 'root' },
        { href: '/admin/settings', label: 'Settings', icon: Settings, req: 'root' },
    ];

    const links = allLinks.filter(link => {
        if (!link.req) return true; // Dashboard is always visible
        if (!user) return false;
        if (user.role === 'root') return true; // Root sees everything

        // If the link requires 'root' but user is 'employee', hide it.
        if (link.req === 'root') return false;

        // If the link requires a specific permission, check the array
        return user.permissions?.includes(link.req);
    });

    return (
        <aside className="sidebar">
            <div className="sidebarLogo">
                <h2>AUREEVO</h2>
                <span>Admin Panel</span>
            </div>

            <nav className="sidebarNav">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive =
                        link.href === '/admin'
                            ? pathname === '/admin'
                            : pathname.startsWith(link.href);

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`sidebarLink ${isActive ? 'active' : ''}`}
                        >
                            <Icon />
                            {link.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="sidebarFooter">
                <Link href="/" className="sidebarLink" target="_blank">
                    <ArrowLeft />
                    View Store
                </Link>
                <button onClick={onLogout} className="sidebarLink" style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left' }}>
                    <LogOut />
                    Logout
                </button>
            </div>
        </aside>
    );
}
