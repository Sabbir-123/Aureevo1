'use client';

import { useState, useEffect } from 'react';
import { getAdminCustomOrders, updateCustomOrderStatus, createManualCustomOrder } from '@/lib/admin-api';
import { X, ExternalLink, RefreshCw, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import styles from './page.module.css';

export default function AdminCustomOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);

    // Manual Entry Modal flag
    const [isManualModalOpen, setIsManualModalOpen] = useState(false);
    const [manualForm, setManualForm] = useState({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        design_description: '',
        quantity: 1,
        cost_price: '',
        sale_price: '',
        delivery_charge: '',
        status: 'pending',
        admin_notes: ''
    });

    // Update Modal state
    const [statusEdit, setStatusEdit] = useState('');
    const [notesEdit, setNotesEdit] = useState('');
    const [salePrice, setSalePrice] = useState(''); // These will now act as UNIT prices
    const [costPrice, setCostPrice] = useState(''); // These will now act as UNIT prices
    const [deliveryChargeEdit, setDeliveryChargeEdit] = useState('');
    const [quantityEdit, setQuantityEdit] = useState(1);
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
        setSalePrice(order.sale_price || '');
        setCostPrice(order.cost_price || '');
        setDeliveryChargeEdit(order.delivery_charge || '');
        setQuantityEdit(order.quantity || 1);
    };

    const closeModal = () => {
        setSelectedOrder(null);
    };

    const dispatchEmail = async (orderData, totalQuoted, qty, notes, isEditMode = false) => {
        try {
            const htmlBody = `
                <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <br>
                    <h2 style="color: #c9a96e; margin-bottom: 20px;">Your Custom Order Has Been Accepted!</h2>
                    <p>Hi <b>${orderData.customer_name}</b>,</p>
                    <p>We are thrilled to let you know that our bespoke team has reviewed your design requests and accepted your order.</p>
                    
                    <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #c9a96e; margin: 20px 0;">
                        <p style="margin: 0 0 10px 0;"><b>Total Quoted Price (inc. Delivery):</b> ৳ ${totalQuoted.toLocaleString()}</p>
                        <p style="margin: 0 0 10px 0;"><b>Quantity:</b> ${qty} pcs</p>
                        ${notes ? `<p style="margin: 0; color: #555;"><b>Our Designer Notes:</b><br>${notes.replace(/\n/g, '<br>')}</p>` : ''}
                    </div>

                    <p>To proceed with production, please reply to this email with your confirmation directly. AUREEVO support will handle the rest.</p>
                    
                    <br>
                    <p>Warm regards,<br><b>The AUREEVO Bespoke Team</b></p>
                </div>
            `;

            await fetch('/api/email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to: orderData.customer_email,
                    subject: 'AUREEVO Bespoke: Custom Order Quotation',
                    html: htmlBody
                })
            });

            if (isEditMode) {
                toast.success('System processed quotation email.');
            }
        } catch (error) {
            console.error('Email dispatch error', error);
            if (isEditMode) toast.error('Email failed, but data saved.');
        }
    };

    const handleSave = async () => {
        if (statusEdit === 'completed' && (!salePrice || !costPrice)) {
            toast.error('Unit Sale Price and Unit Cost Price are required to complete an order.');
            return;
        }

        setSaving(true);
        const updates = {};
        if (salePrice !== '') updates.sale_price = Number(salePrice);
        if (costPrice !== '') updates.cost_price = Number(costPrice);
        if (quantityEdit !== '') updates.quantity = Number(quantityEdit);
        if (deliveryChargeEdit !== '') updates.delivery_charge = Number(deliveryChargeEdit);

        const { error, data } = await updateCustomOrderStatus(selectedOrder.id, statusEdit, notesEdit, updates);
        
        if (error) {
            toast.error('Failed to update order');
        } else {
            toast.success('Order updated');
            
            if (statusEdit === 'accepted' && selectedOrder.status !== 'accepted') {
                toast('Dispatching Email Quote via Zoho...', { icon: '📧' });
                const finalSalePrice = (Number(salePrice) * Number(quantityEdit)) + Number(deliveryChargeEdit);
                await dispatchEmail(selectedOrder, finalSalePrice, quantityEdit, notesEdit, true);
            }

            await loadOrders();
            closeModal();
        }
        setSaving(false);
    };

    const handleManualSubmit = async () => {
        if (!manualForm.customer_name || !manualForm.customer_email) {
            toast.error("Name and Email are required");
            return;
        }

        setSaving(true);
        const submitData = {
            ...manualForm,
            quantity: Number(manualForm.quantity),
            cost_price: Number(manualForm.cost_price || 0),
            sale_price: Number(manualForm.sale_price || 0),
            delivery_charge: Number(manualForm.delivery_charge || 0)
        };

        const { error, data } = await createManualCustomOrder(submitData);
        
        if (error) {
            toast.error('Failed to create manual order');
        } else {
            toast.success('Manual order injected securely');
            
            if (manualForm.status === 'accepted') {
                toast('Dispatching Email Quote...', { icon: '📧' });
                const finalSalePrice = (submitData.sale_price * submitData.quantity) + submitData.delivery_charge;
                await dispatchEmail(submitData, finalSalePrice, submitData.quantity, submitData.admin_notes, false);
            }

            setIsManualModalOpen(false);
            setManualForm({
                customer_name: '', customer_email: '', customer_phone: '', design_description: '',
                quantity: 1, cost_price: '', sale_price: '', delivery_charge: '', status: 'pending', admin_notes: ''
            });

            await loadOrders();
        }
        setSaving(false);
    };

    // Calculate dynamic totals for the forms visually
    const manualTotalSale = (Number(manualForm.sale_price) * Number(manualForm.quantity)) + Number(manualForm.delivery_charge);
    const manualTotalCost = Number(manualForm.cost_price) * Number(manualForm.quantity);
    const manualTotalProfit = manualTotalSale - manualTotalCost - Number(manualForm.delivery_charge);
    
    // Safety check for NaN values when fields are empty
    const displayManualSale = isNaN(manualTotalSale) ? 0 : manualTotalSale;
    const displayManualProfit = isNaN(manualTotalProfit) ? 0 : manualTotalProfit;

    const editTotalSale = (Number(salePrice) * Number(quantityEdit)) + Number(deliveryChargeEdit);
    const editTotalCost = Number(costPrice) * Number(quantityEdit);
    const editTotalProfit = editTotalSale - editTotalCost - Number(deliveryChargeEdit);

    const displayEditSale = isNaN(editTotalSale) ? 0 : editTotalSale;
    const displayEditProfit = isNaN(editTotalProfit) ? 0 : editTotalProfit;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Custom Orders</h1>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={() => setIsManualModalOpen(true)} className={styles.actionBtn} style={{ background: '#c9a96e', color: 'black', border: 'none' }}>
                        <Plus size={18} style={{ display: 'inline', marginRight: '5px' }} /> Manual Entry
                    </button>
                    <button onClick={loadOrders} className={styles.actionBtn}>
                        <RefreshCw size={18} style={{ display: 'inline', marginRight: '5px' }} /> Refresh
                    </button>
                </div>
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
                                <th>Qty</th>
                                <th>Price Set?</th>
                                <th>Email</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: 'center' }}>No custom orders found.</td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order.id}>
                                        <td>{new Date(order.created_at).toLocaleDateString()}</td>
                                        <td>{order.customer_name}</td>
                                        <td>{order.quantity || 1}</td>
                                        <td>{order.sale_price ? 'Yes' : 'No'}</td>
                                        <td>{order.customer_email}</td>
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

            {/* MANUAL ENTRY MODAL */}
            {isManualModalOpen && (
                <div className={styles.modalOverlay} onClick={() => setIsManualModalOpen(false)}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()} style={{ maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>Create Manual Order</h2>
                            <button className={styles.closeBtn} onClick={() => setIsManualModalOpen(false)}><X size={24} /></button>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                            <div style={{ flex: 1, minWidth: '200px' }}>
                                <label style={{ display: 'block', marginBottom: '4px', color: 'var(--text-muted)' }}>Customer Name</label>
                                <input type="text" value={manualForm.customer_name} onChange={e => setManualForm({...manualForm, customer_name: e.target.value})} style={{ width: '100%', padding: '0.8rem', background: '#111', color: 'white', borderRadius: '4px', border: '1px solid #333' }} />
                            </div>
                            <div style={{ flex: 1, minWidth: '200px' }}>
                                <label style={{ display: 'block', marginBottom: '4px', color: 'var(--text-muted)' }}>Email (Zoho Dispatch)</label>
                                <input type="email" value={manualForm.customer_email} onChange={e => setManualForm({...manualForm, customer_email: e.target.value})} style={{ width: '100%', padding: '0.8rem', background: '#111', color: 'white', borderRadius: '4px', border: '1px solid #333' }} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                            <div style={{ flex: 1, minWidth: '200px' }}>
                                <label style={{ display: 'block', marginBottom: '4px', color: 'var(--text-muted)' }}>Phone Number</label>
                                <input type="text" value={manualForm.customer_phone} onChange={e => setManualForm({...manualForm, customer_phone: e.target.value})} style={{ width: '100%', padding: '0.8rem', background: '#111', color: 'white', borderRadius: '4px', border: '1px solid #333' }} />
                            </div>
                            <div style={{ flex: 1, minWidth: '200px' }}>
                                <label style={{ display: 'block', marginBottom: '4px', color: 'var(--text-muted)' }}>Target Initial Status</label>
                                <select value={manualForm.status} onChange={e => setManualForm({...manualForm, status: e.target.value})} style={{ width: '100%', padding: '0.8rem', background: '#111', color: 'white', borderRadius: '4px', border: '1px solid #333' }}>
                                    <option value="pending">Pending</option>
                                    <option value="reviewed">Reviewed</option>
                                    <option value="accepted">Accepted (Triggers Quote Email)</option>
                                    <option value="completed">Completed (Triggers Finance Sync)</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem', background: 'rgba(255, 255, 255, 0.05)', padding: '1.5rem', borderRadius: '8px' }}>
                            <div style={{ flex: 1, minWidth: '100px' }}>
                                <label style={{ display: 'block', marginBottom: '4px', color: 'var(--text-muted)' }}>Quantity</label>
                                <input type="number" min="1" value={manualForm.quantity} onChange={e => setManualForm({...manualForm, quantity: e.target.value})} style={{ width: '100%', padding: '0.8rem', background: '#222', color: 'white', borderRadius: '4px', border: '1px solid #444' }} />
                            </div>
                            <div style={{ flex: 1, minWidth: '120px' }}>
                                <label style={{ display: 'block', marginBottom: '4px', color: '#f87171' }}>UNIT Cost (৳)</label>
                                <input type="number" placeholder="Cost per unit" value={manualForm.cost_price} onChange={e => setManualForm({...manualForm, cost_price: e.target.value})} style={{ width: '100%', padding: '0.8rem', background: '#222', color: 'white', borderRadius: '4px', border: '1px solid #444' }} />
                            </div>
                            <div style={{ flex: 1, minWidth: '120px' }}>
                                <label style={{ display: 'block', marginBottom: '4px', color: '#4ade80' }}>UNIT Sale (৳)</label>
                                <input type="number" placeholder="Sale per unit" value={manualForm.sale_price} onChange={e => setManualForm({...manualForm, sale_price: e.target.value})} style={{ width: '100%', padding: '0.8rem', background: '#222', color: 'white', borderRadius: '4px', border: '1px solid #444' }} />
                            </div>
                            <div style={{ flex: 1, minWidth: '130px' }}>
                                <label style={{ display: 'block', marginBottom: '4px', color: '#60a5fa' }}>Delivery Charge (৳)</label>
                                <input type="number" placeholder="Shipping cost" value={manualForm.delivery_charge} onChange={e => setManualForm({...manualForm, delivery_charge: e.target.value})} style={{ width: '100%', padding: '0.8rem', background: '#222', color: 'white', borderRadius: '4px', border: '1px solid #444' }} />
                            </div>
                            
                            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', marginTop: '1rem', borderTop: '1px solid #444', paddingTop: '1rem' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Calculated Total Quoted: <b style={{ color: 'white', fontSize: '1.1rem' }}>৳ {displayManualSale}</b></span>
                                <span style={{ color: 'var(--text-muted)' }}>Est. Net Profit: <b style={{ color: displayManualProfit >= 0 ? '#4ade80' : '#ef4444', fontSize: '1.1rem' }}>৳ {displayManualProfit}</b></span>
                            </div>
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '4px', color: 'var(--text-muted)' }}>Custom Design & Detailed Vision</label>
                            <textarea value={manualForm.design_description} onChange={e => setManualForm({...manualForm, design_description: e.target.value})} style={{ width: '100%', padding: '0.8rem', background: '#111', color: 'white', borderRadius: '4px', border: '1px solid #333', minHeight: '80px' }} />
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '4px', color: 'var(--text-muted)' }}>Admin Quotation Notes (Included in Emails)</label>
                            <textarea value={manualForm.admin_notes} onChange={e => setManualForm({...manualForm, admin_notes: e.target.value})} style={{ width: '100%', padding: '0.8rem', background: '#111', color: 'white', borderRadius: '4px', border: '1px solid #333', minHeight: '60px' }} />
                        </div>

                        <div className={styles.modalActions}>
                            <button className={styles.btnCancel} onClick={() => setIsManualModalOpen(false)}>Cancel</button>
                            <button className={styles.btnSave} onClick={handleManualSubmit} disabled={saving}>
                                {saving ? 'Processing...' : 'Create & Save'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MANAGE EXISTING ORDER MODAL */}
            {selectedOrder && !isManualModalOpen && (
                <div className={styles.modalOverlay} onClick={closeModal}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()} style={{ maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' }}>
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
                                style={{ width: '100%', padding: '0.8rem', background: '#222', color: 'white', borderRadius: '4px', border: '1px solid #444', marginBottom: '1rem' }}
                            >
                                <option value="pending">Pending</option>
                                <option value="reviewed">Reviewed</option>
                                <option value="accepted">Accepted (Sends Quotation Email)</option>
                                <option value="rejected">Rejected</option>
                                <option value="completed">Completed (Triggers Finance Ledger Sync)</option>
                            </select>
                        </div>

                        <div className={styles.detailRow} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', background: 'rgba(255, 255, 255, 0.05)', padding: '1.5rem', borderRadius: '8px' }}>
                            <div style={{ flex: 1, minWidth: '100px' }}>
                                <span className={styles.detailLabel} style={{ color: 'white' }}>Quantity</span>
                                <input 
                                    type="number" 
                                    value={quantityEdit}
                                    onChange={(e) => setQuantityEdit(e.target.value)}
                                    style={{ width: '100%', padding: '0.8rem', background: '#111', color: 'white', borderRadius: '4px', border: '1px solid #333' }}
                                />
                            </div>
                            <div style={{ flex: 1, minWidth: '120px' }}>
                                <span className={styles.detailLabel} style={{ color: '#f87171' }}>UNIT Cost (৳)</span>
                                <input 
                                    type="number" 
                                    value={costPrice}
                                    onChange={(e) => setCostPrice(e.target.value)}
                                    style={{ width: '100%', padding: '0.8rem', background: '#111', color: 'white', borderRadius: '4px', border: '1px solid #333' }}
                                />
                            </div>
                            <div style={{ flex: 1, minWidth: '120px' }}>
                                <span className={styles.detailLabel} style={{ color: '#4ade80' }}>UNIT Sale (৳)</span>
                                <input 
                                    type="number" 
                                    value={salePrice}
                                    onChange={(e) => setSalePrice(e.target.value)}
                                    style={{ width: '100%', padding: '0.8rem', background: '#111', color: 'white', borderRadius: '4px', border: '1px solid #333' }}
                                />
                            </div>
                            <div style={{ flex: 1, minWidth: '130px' }}>
                                <span className={styles.detailLabel} style={{ color: '#60a5fa' }}>Delivery Charge (৳)</span>
                                <input 
                                    type="number" 
                                    value={deliveryChargeEdit}
                                    onChange={(e) => setDeliveryChargeEdit(e.target.value)}
                                    style={{ width: '100%', padding: '0.8rem', background: '#111', color: 'white', borderRadius: '4px', border: '1px solid #333' }}
                                />
                            </div>
                            
                            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', marginTop: '1rem', borderTop: '1px solid #444', paddingTop: '1rem' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Calculated Total Quoted: <b style={{ color: 'white', fontSize: '1.1rem' }}>৳ {displayEditSale}</b></span>
                                <span style={{ color: 'var(--text-muted)' }}>Est. Net Profit: <b style={{ color: displayEditProfit >= 0 ? '#4ade80' : '#ef4444', fontSize: '1.1rem' }}>৳ {displayEditProfit}</b></span>
                            </div>
                        </div>

                        <div className={styles.detailRow} style={{ marginTop: '1rem' }}>
                            <span className={styles.detailLabel}>Admin Notes (Sent in email update)</span>
                            <textarea
                                className={styles.textarea}
                                value={notesEdit}
                                onChange={(e) => setNotesEdit(e.target.value)}
                                placeholder="Enter quotation or notes for the customer..."
                                style={{ minHeight: '60px' }}
                            />
                        </div>

                        <div className={styles.modalActions}>
                            <button className={styles.btnCancel} onClick={closeModal}>Cancel</button>
                            <button className={styles.btnSave} onClick={handleSave} disabled={saving}>
                                {saving ? 'Saving...' : 'Save Updates'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
