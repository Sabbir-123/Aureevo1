'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getAdminOrder, updateOrderStatus } from '@/lib/admin-api';
import { ArrowLeft, Phone, MapPin, User, Package } from 'lucide-react';

export default function OrderDetailPage() {
    const params = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updatingStatus, setUpdatingStatus] = useState(false);

    useEffect(() => {
        const load = async () => {
            const { data } = await getAdminOrder(params.id);
            setOrder(data);
            setLoading(false);
        };
        load();
    }, [params.id]);

    const handleStatusChange = async (newStatus) => {
        setUpdatingStatus(true);
        await updateOrderStatus(order.id, newStatus);
        setOrder((prev) => ({ ...prev, status: newStatus }));
        setUpdatingStatus(false);
    };

    // Generate WhatsApp message
    const generateWhatsAppMessage = () => {
        if (!order) return '';
        const items = order.order_items
            ?.map(
                (item) =>
                    `• ${item.product_name} (${item.size}, ${item.color}) × ${item.quantity} — ৳${Number(item.price * item.quantity).toFixed(2)}`
            )
            .join('\n');

        return encodeURIComponent(
            `🛒 *New Order - ${order.order_id}*\n\n` +
            `👤 *Customer:* ${order.customer_name}\n` +
            `📱 *Phone:* ${order.customer_phone}\n` +
            `📍 *Address:* ${order.customer_address}\n\n` +
            `📦 *Items:*\n${items}\n\n` +
            `💰 *Total:* ৳${Number(order.total_price).toFixed(2)}\n` +
            `📅 *Date:* ${new Date(order.created_at).toLocaleString()}`
        );
    };

    if (loading) return <div className="loadingSpinner">Loading order...</div>;
    if (!order) return <div className="emptyState"><h3>Order not found</h3></div>;

    return (
        <div>
            <div className="adminTopBar">
                <div>
                    <Link href="/admin/orders" style={{ color: 'var(--admin-text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', marginBottom: 8 }}>
                        <ArrowLeft size={14} /> Back to Orders
                    </Link>
                    <h1>Order {order.order_id}</h1>
                    <p className="adminSubtitle">
                        Placed on {new Date(order.created_at).toLocaleString()}
                    </p>
                </div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <span className={`badge ${order.status}`} style={{ fontSize: '0.85rem', padding: '6px 14px' }}>
                        {order.status}
                    </span>
                    <select
                        className="statusSelect"
                        value={order.status}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        disabled={updatingStatus}
                        style={{ padding: '8px 12px' }}
                    >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
                {/* Customer Info */}
                <div className="adminSection">
                    <h3><User size={18} /> Customer Information</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <div>
                            <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Full Name</p>
                            <p style={{ fontWeight: 500 }}>{order.customer_name}</p>
                        </div>
                        <div>
                            <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>
                                <Phone size={12} style={{ display: 'inline', marginRight: 4 }} />Phone
                            </p>
                            <p style={{ fontWeight: 500 }}>{order.customer_phone}</p>
                        </div>
                        <div>
                            <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>
                                <MapPin size={12} style={{ display: 'inline', marginRight: 4 }} />Delivery Address
                            </p>
                            <p style={{ fontWeight: 500 }}>{order.customer_address}</p>
                        </div>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="adminSection">
                    <h3><Package size={18} /> Order Summary</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--admin-text-muted)' }}>Order ID</span>
                            <span style={{ fontWeight: 600 }}>{order.order_id}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--admin-text-muted)' }}>Items</span>
                            <span>{order.order_items?.length || 0}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--admin-border)', paddingTop: 12 }}>
                            <span style={{ fontWeight: 600 }}>Total</span>
                            <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--admin-accent)' }}>৳ {Number(order.total_price).toFixed(2)}</span>
                        </div>
                    </div>
                    <a
                        href={`https://wa.me/?text=${generateWhatsAppMessage()}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btnPrimary"
                        style={{ marginTop: 16, width: '100%', justifyContent: 'center', textDecoration: 'none' }}
                    >
                        📲 Send WhatsApp Notification
                    </a>
                </div>
            </div>

            {/* Order Items */}
            <div className="adminSection">
                <h3>Order Items</h3>
                <table className="adminTable">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Product</th>
                            <th>Size</th>
                            <th>Color</th>
                            <th>Qty</th>
                            <th>Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.order_items?.map((item) => (
                            <tr key={item.id}>
                                <td>
                                    {item.product_image ? (
                                        <img src={item.product_image} alt={item.product_name} />
                                    ) : (
                                        <div style={{ width: 40, height: 40, borderRadius: 6, background: '#333' }} />
                                    )}
                                </td>
                                <td style={{ fontWeight: 500 }}>{item.product_name}</td>
                                <td>{item.size}</td>
                                <td>{item.color}</td>
                                <td>{item.quantity}</td>
                                <td>৳ {Number(item.price).toFixed(2)}</td>
                                <td style={{ fontWeight: 600 }}>৳ {Number(item.price * item.quantity).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
