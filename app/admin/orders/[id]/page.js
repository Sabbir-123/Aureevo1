'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getAdminOrder, updateOrderStatus } from '@/lib/admin-api';
import { ArrowLeft, Phone, MapPin, User, Package, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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

    // Generate Formal PDF Invoice
    const handleDownloadPDF = async () => {
        const doc = new jsPDF('p', 'pt', 'a4');
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 40;
        let yPos = margin;

        // Header
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text('AUREEVO', margin, yPos);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100);
        doc.text('Premium Fashion Apparel', margin, yPos + 15);
        doc.text('Dhaka, Bangladesh', margin, yPos + 30);

        // Settings
        doc.setTextColor(0);

        // Invoice Title
        yPos += 70;
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text('INVOICE', pageWidth - margin - 80, margin + 20);

        // Order Details
        doc.setFontSize(12);
        doc.text(`Order ID: ${order.order_id}`, pageWidth - margin - 150, margin + 40);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Date: ${new Date(order.created_at).toLocaleDateString()}`, pageWidth - margin - 150, margin + 55);
        doc.text(`Status: ${order.status.toUpperCase()}`, pageWidth - margin - 150, margin + 70);

        // Bill To
        yPos += 20;
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('BILL TO:', margin, yPos);

        yPos += 20;
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.text(order.customer_name, margin, yPos);
        yPos += 15;
        doc.text(`Phone: ${order.customer_phone}`, margin, yPos);
        yPos += 15;

        // Handle address wrapping
        const splitAddress = doc.splitTextToSize(order.customer_address, 250);
        doc.text(splitAddress, margin, yPos);
        yPos += (splitAddress.length * 15) + 30;

        // Table Header
        doc.setFillColor(240, 240, 240);
        doc.rect(margin, yPos, pageWidth - (margin * 2), 25, 'F');

        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('Item Description', margin + 10, yPos + 17);
        doc.text('Qty', margin + 270, yPos + 17);
        doc.text('Unit Price', margin + 330, yPos + 17);
        doc.text('Total', margin + 430, yPos + 17);

        yPos += 40;

        // Table Rows
        doc.setFont('helvetica', 'normal');
        order.order_items.forEach((item, index) => {
            const description = `${item.product_name} (Size: ${item.size}, Color: ${item.color})`;
            const splitDesc = doc.splitTextToSize(description, 240);

            doc.text(splitDesc, margin + 10, yPos);
            doc.text(item.quantity.toString(), margin + 275, yPos);
            doc.text(`BDT ${Number(item.price).toFixed(2)}`, margin + 330, yPos);
            doc.text(`BDT ${Number(item.price * item.quantity).toFixed(2)}`, margin + 430, yPos);

            yPos += (splitDesc.length * 15) + 15;

            // Add a subtle line between items
            doc.setDrawColor(230, 230, 230);
            doc.line(margin, yPos - 10, pageWidth - margin, yPos - 10);
        });

        // Totals
        yPos += 20;
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Total Amount:', margin + 330, yPos);
        doc.setTextColor(201, 169, 110); // Aureevo Gold
        doc.text(`BDT ${Number(order.total_price).toFixed(2)}`, margin + 420, yPos);

        // Footer message
        yPos += 60;
        doc.setTextColor(150);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'italic');
        doc.text('Thank you for shopping with Aureevo. For any inquiries, please contact our support.', pageWidth / 2, yPos, { align: 'center' });

        doc.save(`Aureevo_Invoice_${order.order_id}.pdf`);
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
                    <button
                        onClick={handleDownloadPDF}
                        className="btnSecondary"
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}
                    >
                        <Download size={14} /> Download PDF
                    </button>
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
