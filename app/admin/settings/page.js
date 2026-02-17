'use client';

import { useEffect, useState } from 'react';
import { getAdminSettings, updateSettings } from '@/lib/admin-api';
import { Settings, Save, CheckCircle } from 'lucide-react';

export default function AdminSettingsPage() {
    const [form, setForm] = useState({
        facebook_pixel_id: '',
        whatsapp_number: '',
        store_name: 'AUREEVO',
        currency: 'BDT',
        currency_symbol: '৳',
        shipping_cost: 120,
        low_stock_threshold: 3,
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const load = async () => {
            const { data } = await getAdminSettings();
            if (data) {
                setForm({
                    facebook_pixel_id: data.facebook_pixel_id || '',
                    whatsapp_number: data.whatsapp_number || '',
                    store_name: data.store_name || 'AUREEVO',
                    currency: data.currency || 'BDT',
                    currency_symbol: data.currency_symbol || '৳',
                    shipping_cost: data.shipping_cost || 120,
                    low_stock_threshold: data.low_stock_threshold || 3,
                });
            }
            setLoading(false);
        };
        load();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSaved(false);

        const { error: saveError } = await updateSettings({
            ...form,
            shipping_cost: parseFloat(form.shipping_cost),
            low_stock_threshold: parseInt(form.low_stock_threshold),
        });

        if (saveError) {
            setError(saveError.message || 'Failed to save');
        } else {
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        }
        setSaving(false);
    };

    if (loading) return <div className="loadingSpinner">Loading settings...</div>;

    return (
        <div>
            <div className="adminTopBar">
                <div>
                    <h1>Settings</h1>
                    <p className="adminSubtitle">Manage your store configuration</p>
                </div>
            </div>

            {error && <div className="loginError" style={{ marginBottom: 20 }}>{error}</div>}
            {saved && (
                <div style={{ background: 'rgba(34,197,94,0.1)', color: 'var(--admin-success)', padding: '10px 14px', borderRadius: 'var(--admin-radius)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <CheckCircle size={16} /> Settings saved successfully!
                </div>
            )}

            <form onSubmit={handleSave}>
                {/* Facebook Pixel */}
                <div className="adminSection">
                    <h3>📊 Facebook Pixel</h3>
                    <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.85rem', marginBottom: 16 }}>
                        Enter your Facebook Pixel ID to enable conversion tracking on the storefront.
                        Tracked events: PageView, ViewContent, AddToCart, InitiateCheckout, Purchase.
                    </p>
                    <div className="formGroup">
                        <label>Facebook Pixel ID</label>
                        <input
                            className="formInput"
                            placeholder="e.g. 1234567890123456"
                            value={form.facebook_pixel_id}
                            onChange={(e) => setForm({ ...form, facebook_pixel_id: e.target.value })}
                        />
                    </div>
                </div>

                {/* WhatsApp */}
                <div className="adminSection">
                    <h3>📲 WhatsApp Notifications</h3>
                    <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.85rem', marginBottom: 16 }}>
                        New orders will generate a WhatsApp message link for instant notification.
                    </p>
                    <div className="formGroup">
                        <label>WhatsApp Number (with country code)</label>
                        <input
                            className="formInput"
                            placeholder="e.g. 8801712345678"
                            value={form.whatsapp_number}
                            onChange={(e) => setForm({ ...form, whatsapp_number: e.target.value })}
                        />
                    </div>
                </div>

                {/* Store Config */}
                <div className="adminSection">
                    <h3>⚙️ Store Configuration</h3>
                    <div className="formRow">
                        <div className="formGroup">
                            <label>Store Name</label>
                            <input
                                className="formInput"
                                value={form.store_name}
                                onChange={(e) => setForm({ ...form, store_name: e.target.value })}
                            />
                        </div>
                        <div className="formGroup">
                            <label>Currency Symbol</label>
                            <input
                                className="formInput"
                                value={form.currency_symbol}
                                onChange={(e) => setForm({ ...form, currency_symbol: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="formRow">
                        <div className="formGroup">
                            <label>Shipping Cost (৳)</label>
                            <input
                                className="formInput"
                                type="number"
                                step="0.01"
                                value={form.shipping_cost}
                                onChange={(e) => setForm({ ...form, shipping_cost: e.target.value })}
                            />
                        </div>
                        <div className="formGroup">
                            <label>Low Stock Threshold</label>
                            <input
                                className="formInput"
                                type="number"
                                min="1"
                                value={form.low_stock_threshold}
                                onChange={(e) => setForm({ ...form, low_stock_threshold: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                <div className="formActions">
                    <button type="submit" className="btnPrimary" disabled={saving}>
                        <Save size={16} />
                        {saving ? 'Saving...' : 'Save Settings'}
                    </button>
                </div>
            </form>
        </div>
    );
}
