'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { getAdminOrders, updateOrderStatus } from '@/lib/admin-api';
import { Search, ShoppingCart, Eye } from 'lucide-react';

const STATUS_OPTIONS = ['all', 'pending', 'confirmed', 'delivered', 'cancelled'];
const DATE_OPTIONS = [
    { value: '', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
];

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('');
    const [updatingId, setUpdatingId] = useState(null);

    const load = useCallback(async () => {
        setLoading(true);
        const { data } = await getAdminOrders({ search, status: statusFilter, dateFilter });
        setOrders(data || []);
        setLoading(false);
    }, [search, statusFilter, dateFilter]);

    useEffect(() => {
        const debounce = setTimeout(() => load(), 300);
        return () => clearTimeout(debounce);
    }, [load]);

    const handleStatusChange = async (orderId, newStatus) => {
        setUpdatingId(orderId);
        await updateOrderStatus(orderId, newStatus);
        setOrders((prev) =>
            prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
        setUpdatingId(null);
    };

    return (
        <div>
            <div className="adminTopBar">
                <div>
                    <h1>Orders</h1>
                    <p className="adminSubtitle">{orders.length} orders found</p>
                </div>
            </div>

            {/* Search & Filters */}
            <div className="filterBar">
                <div className="searchWrapper">
                    <Search size={16} />
                    <input
                        className="searchInput"
                        placeholder="Search by name, phone, order ID, or product..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <select
                    className="formInput"
                    style={{ width: 'auto', minWidth: 140 }}
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                >
                    {DATE_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
            </div>

            {/* Status Tabs */}
            <div className="filterPills" style={{ marginBottom: 20 }}>
                {STATUS_OPTIONS.map((s) => (
                    <button
                        key={s}
                        className={`filterPill ${statusFilter === s ? 'active' : ''}`}
                        onClick={() => setStatusFilter(s)}
                    >
                        {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="loadingSpinner">Loading orders...</div>
            ) : orders.length === 0 ? (
                <div className="emptyState">
                    <ShoppingCart size={48} />
                    <h3>No orders found</h3>
                    <p>Orders will appear here when customers place them.</p>
                </div>
            ) : (
                <div className="adminSection" style={{ padding: 0 }}>
                    <table className="adminTable">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Phone</th>
                                <th>Items</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.id}>
                                    <td>
                                        <Link
                                            href={`/admin/orders/${order.id}`}
                                            style={{ color: 'var(--admin-accent)', textDecoration: 'none', fontWeight: 500 }}
                                        >
                                            {order.order_id}
                                        </Link>
                                    </td>
                                    <td>{order.customer_name}</td>
                                    <td style={{ color: 'var(--admin-text-muted)' }}>{order.customer_phone}</td>
                                    <td>
                                        {order.order_items?.length || 0} item{(order.order_items?.length || 0) !== 1 ? 's' : ''}
                                    </td>
                                    <td style={{ fontWeight: 600 }}>৳ {Number(order.total_price).toFixed(2)}</td>
                                    <td>
                                        <select
                                            className="statusSelect"
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                            disabled={updatingId === order.id}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="confirmed">Confirmed</option>
                                            <option value="delivered">Delivered</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                    <td style={{ color: 'var(--admin-text-muted)', fontSize: '0.8rem' }}>
                                        {new Date(order.created_at).toLocaleDateString('en-GB', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric',
                                        })}
                                    </td>
                                    <td>
                                        <Link href={`/admin/orders/${order.id}`} className="btnIcon" title="View Details">
                                            <Eye size={14} />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
