'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getDashboardStats, getAdminProducts } from '@/lib/admin-api';
import {
    Package, ShoppingCart, Clock, CheckCircle, AlertTriangle, TrendingUp,
    Plus
} from 'lucide-react';

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [recentProducts, setRecentProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const [statsData, productsData] = await Promise.all([
                    getDashboardStats(),
                    getAdminProducts(),
                ]);
                setStats(statsData);
                setRecentProducts((productsData.data || []).slice(0, 5));
            } catch (err) {
                console.error('Dashboard load error:', err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (loading) {
        return <div className="loadingSpinner">Loading dashboard...</div>;
    }

    if (!stats) {
        return (
            <div className="emptyState">
                <AlertTriangle />
                <h3>Unable to load dashboard</h3>
                <p>Make sure you have run the database setup SQL in Supabase.</p>
                <p style={{ marginTop: 12, fontSize: '0.85rem' }}>
                    Copy the SQL from <code>lib/db-setup.sql</code> and run it in your
                    Supabase Dashboard → SQL Editor.
                </p>
            </div>
        );
    }

    return (
        <div>
            <div className="adminTopBar">
                <div>
                    <h1>Dashboard</h1>
                    <p className="adminSubtitle">Welcome back — here&apos;s your store overview</p>
                </div>
                <Link href="/admin/products/new" className="btnPrimary">
                    <Plus size={16} />
                    Add Product
                </Link>
            </div>

            {/* Stat Cards */}
            <div className="statCards">
                <div className="statCard">
                    <p className="statLabel">Total Products</p>
                    <p className="statValue accent">{stats.totalProducts}</p>
                </div>
                <div className="statCard">
                    <p className="statLabel">Total Orders</p>
                    <p className="statValue">{stats.totalOrders}</p>
                </div>
                <div className="statCard">
                    <p className="statLabel">Pending Orders</p>
                    <p className="statValue warning">{stats.pendingOrders}</p>
                </div>
                <div className="statCard">
                    <p className="statLabel">Delivered</p>
                    <p className="statValue success">{stats.deliveredOrders}</p>
                </div>
                <div className="statCard">
                    <p className="statLabel">Low Stock Items</p>
                    <p className="statValue danger">{stats.lowStockProducts}</p>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="adminSection">
                <h3>
                    <ShoppingCart size={18} />
                    Recent Orders
                </h3>
                {stats.recentOrders.length === 0 ? (
                    <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.875rem' }}>No orders yet</p>
                ) : (
                    <table className="adminTable">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.recentOrders.map((order) => (
                                <tr key={order.id}>
                                    <td>
                                        <Link href={`/admin/orders/${order.id}`} style={{ color: 'var(--admin-accent)', textDecoration: 'none' }}>
                                            {order.order_id}
                                        </Link>
                                    </td>
                                    <td>{order.customer_name}</td>
                                    <td>৳ {Number(order.total_price).toFixed(2)}</td>
                                    <td><span className={`badge ${order.status}`}>{order.status}</span></td>
                                    <td style={{ color: 'var(--admin-text-muted)', fontSize: '0.8rem' }}>
                                        {new Date(order.created_at).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Recent Products */}
            <div className="adminSection">
                <h3>
                    <Package size={18} />
                    Recently Added Products
                </h3>
                {recentProducts.length === 0 ? (
                    <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.875rem' }}>No products yet</p>
                ) : (
                    <table className="adminTable">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentProducts.map((p) => {
                                const totalStock = p.stock
                                    ? Object.values(p.stock).reduce((a, b) => a + Number(b), 0)
                                    : 0;
                                return (
                                    <tr key={p.id}>
                                        <td style={{ fontWeight: 500 }}>{p.name}</td>
                                        <td style={{ textTransform: 'capitalize' }}>{p.category}</td>
                                        <td>৳ {Number(p.price).toFixed(2)}</td>
                                        <td>
                                            <span style={{ color: totalStock <= 5 ? 'var(--admin-warning)' : 'var(--admin-text)' }}>
                                                {totalStock}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`badge ${p.is_visible ? 'active' : 'hidden'}`}>
                                                {p.is_visible ? 'Active' : 'Hidden'}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
