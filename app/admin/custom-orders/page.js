'use client';

import { useState, useEffect } from 'react';
import { getAdminCustomOrders, updateCustomOrderStatus } from '@/lib/admin-api';
import { X, ExternalLink, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import styles from './page.module.css';

export default function AdminCustomOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);

    // Modal state
    const [statusEdit, setStatusEdit] = useState('');
    const [notesEdit, setNotesEdit] = useState('');
    const [saving, setSaving] = useState(false);

    const loadOrders = async () => {
        setLoading(true);
        const { data, error } = await getAdminCustomOrders();
        if (error) {
            toast.error('Failed to load custom orders');
        } else {
            setOrders(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadOrders();
    }, []);

    const openModal = (order) => {
        setSelectedOrder(order);
        setStatusEdit(order.status);
        setNotesEdit(order.admin_notes || '');
    };

    const closeModal = () => {
        setSelectedOrder(null);
    };

    const handleSave = async () => {
        setSaving(true);
        const { error } = await updateCustomOrderStatus(selectedOrder.id, statusEdit, notesEdit);
        if (error) {
            toast.error('Failed to update order');
        } else {
            toast.success('Order updated globally');
            // Mock email sending
            toast('Customer email notification dispatched (mock)', { icon: '📧' });
            await loadOrders();
            closeModal();
        }
        setSaving(false);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Custom Orders</h1>
                <button onClick={loadOrders} className={styles.actionBtn}>
                    <RefreshCw size={18} style={{ display: 'inline', marginRight: '5px' }} /> Refresh
                </button>
            </div>

            <div className={styles.tableContainer}>
                {loading ? (
                    <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
                ) : (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Customer</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center' }}>No custom orders found.</td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order.id}>
                                        <td>{new Date(order.created_at).toLocaleDateString()}</td>
                                        <td>{order.customer_name}</td>
                                        <td>{order.customer_email}</td>
                                        <td>{order.customer_phone}</td>
                                        <td>
                                            <span className={`${styles.statusBadge} ${styles['status-' + order.status]}`}>
                                                {order.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                className={styles.actionBtn}
                                                onClick={() => openModal(order)}
                                            >
                                                Manage
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {selectedOrder && (
                <div className={styles.modalOverlay} onClick={closeModal}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>Order Details</h2>
                            <button className={styles.closeBtn} onClick={closeModal}><X size={24} /></button>
                        </div>

                        <div className={styles.detailRow}>
                            <span className={styles.detailLabel}>Customer</span>
                            <div className={styles.detailValue}>{selectedOrder.customer_name}</div>
                            <div className={styles.detailValue}>{selectedOrder.customer_email} | {selectedOrder.customer_phone}</div>
                        </div>

                        <div className={styles.detailRow}>
                            <span className={styles.detailLabel}>Vision & Requirements</span>
                            <div className={styles.detailValue} style={{ whiteSpace: 'pre-wrap', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '4px' }}>
                                {selectedOrder.design_description}
                            </div>
                        </div>

                        {selectedOrder.design_url && (
                            <div className={styles.detailRow}>
                                <span className={styles.detailLabel}>Design Attachment</span>
                                <a href={selectedOrder.design_url} target="_blank" rel="noopener noreferrer" className={styles.designLink}>
                                    View / Download <ExternalLink size={16} />
                                </a>
                            </div>
                        )}

                        <div className={styles.detailRow} style={{ marginTop: '2rem' }}>
                            <span className={styles.detailLabel}>Update Status</span>
                            <select
                                value={statusEdit}
                                onChange={(e) => setStatusEdit(e.target.value)}
                                style={{ width: '100%', padding: '0.8rem', background: '#222', color: 'white', borderRadius: '4px', border: '1px solid #444' }}
                            >
                                <option value="pending">Pending</option>
                                <option value="reviewed">Reviewed</option>
                                <option value="accepted">Accepted (Quoted)</option>
                                <option value="rejected">Rejected</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>

                        <div className={styles.detailRow}>
                            <span className={styles.detailLabel}>Admin Notes (Sent in email update)</span>
                            <textarea
                                className={styles.textarea}
                                value={notesEdit}
                                onChange={(e) => setNotesEdit(e.target.value)}
                                placeholder="Enter quotation or notes for the customer..."
                            />
                        </div>

                        <div className={styles.modalActions}>
                            <button className={styles.btnCancel} onClick={closeModal}>Cancel</button>
                            <button className={styles.btnSave} onClick={handleSave} disabled={saving}>
                                {saving ? 'Saving...' : 'Save & Notify'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
