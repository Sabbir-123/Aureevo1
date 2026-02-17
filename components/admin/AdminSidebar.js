'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingCart, Settings, LogOut, ArrowLeft } from 'lucide-react';

export default function AdminSidebar({ onLogout }) {
    const pathname = usePathname();

    const links = [
        { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/admin/products', label: 'Products', icon: Package },
        { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
        { href: '/admin/settings', label: 'Settings', icon: Settings },
    ];

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
