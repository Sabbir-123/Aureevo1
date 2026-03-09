'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getAdminProduct, updateProduct, uploadProductImage, getAdminCategories } from '@/lib/admin-api';
import { ArrowLeft, Upload, X, Plus } from 'lucide-react';
import Link from 'next/link';

const SIZE_OPTIONS = ['S', 'M', 'L', 'XL', 'XXL'];

export default function EditProductPage() {
    const router = useRouter();
    const params = useParams();
    const productId = params.id;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        getAdminCategories().then(({ data }) => setCategories(data || []));
    }, []);

    const [form, setForm] = useState({
        name: '',
        category: 'hoodies',
        price: '',
        cost_price: '',
        description: '',
        sizes: [],
        colors: [],
        stock: {},
        images: [],
        is_visible: true,
        is_featured: false,
        seo_title: '',
        seo_description: '',
        seo_keywords: '',
        target_country: 'Bangladesh',
        target_region: ''
    });

    const [newColorName, setNewColorName] = useState('');
    const [newColorHex, setNewColorHex] = useState('#333333');

    useEffect(() => {
        const load = async () => {
            const { data, error } = await getAdminProduct(productId);
            if (error || !data) {
                setError('Product not found');
                setLoading(false);
                return;
            }
            setForm({
                name: data.name || '',
                category: data.category || 'hoodies',
                price: data.price?.toString() || '',
                cost_price: data.cost_price?.toString() || '',
                description: data.description || '',
                sizes: data.sizes || [],
                colors: data.colors || [],
                stock: data.stock || {},
                images: data.images || [],
                is_visible: data.is_visible ?? true,
                is_featured: data.is_featured ?? false,
                seo_title: data.seo_title || '',
                seo_description: data.seo_description || '',
                seo_keywords: data.seo_keywords || '',
                target_country: data.target_country || 'Bangladesh',
                target_region: data.target_region || ''
            });
            setLoading(false);
        };
        load();
    }, [productId]);

    const addColor = () => {
        if (!newColorName.trim()) return;
        setForm((prev) => ({
            ...prev,
            colors: [...prev.colors, { name: newColorName.trim(), hex: newColorHex }],
        }));
        setNewColorName('');
        setNewColorHex('#333333');
    };

    const removeColor = (index) => {
        setForm((prev) => ({
            ...prev,
            colors: prev.colors.filter((_, i) => i !== index),
        }));
    };

    const toggleSize = (size) => {
        setForm((prev) => {
            const sizes = prev.sizes.includes(size)
                ? prev.sizes.filter((s) => s !== size)
                : [...prev.sizes, size];
            const stock = { ...prev.stock };
            if (!sizes.includes(size)) delete stock[size];
            else if (!(size in stock)) stock[size] = 0;
            return { ...prev, sizes, stock };
        });
    };

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;
        setUploading(true);
        for (const file of files) {
            try {
                const { url } = await uploadProductImage(file);
                if (url) setForm((prev) => ({ ...prev, images: [...prev.images, url] }));
            } catch (err) {
                console.error('Upload failed:', err);
            }
        }
        setUploading(false);
    };

    const removeImage = (index) => {
        setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!form.name || !form.price) {
            setError('Name and price are required.');
            return;
        }
        setError('');
        setSaving(true);

        const { error: saveError } = await updateProduct(productId, {
            ...form,
            price: parseFloat(form.price),
            cost_price: parseFloat(form.cost_price) || 0,
        });

        if (saveError) {
            setError(saveError.message || 'Failed to update');
            setSaving(false);
            return;
        }

        router.push('/admin/products');
    };

    if (loading) return <div className="loadingSpinner">Loading product...</div>;

    return (
        <div>
            <div className="adminTopBar">
                <div>
                    <Link href="/admin/products" style={{ color: 'var(--admin-text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', marginBottom: 8 }}>
                        <ArrowLeft size={14} /> Back to Products
                    </Link>
                    <h1>Edit Product</h1>
                    <p className="adminSubtitle">{form.name}</p>
                </div>
            </div>

            {error && <div className="loginError" style={{ marginBottom: 20 }}>{error}</div>}

            <form onSubmit={handleSave}>
                <div className="adminSection">
                    <h3>Basic Information</h3>
                    <div className="formGroup">
                        <label>Product Name *</label>
                        <input className="formInput" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                    </div>
                    <div className="formRow">
                        <div className="formGroup">
                            <label>Category *</label>
                            <select className="formInput" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                                {categories.filter(c => c.slug !== 'all').map(cat => (
                                    <option key={cat.id} value={cat.slug}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="formGroup" style={{ flex: 1 }}>
                            <label>Selling Price (৳) *</label>
                            <input className="formInput" type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
                        </div>
                        <div className="formGroup" style={{ flex: 1 }}>
                            <label>Cost Price (৳)</label>
                            <input className="formInput" type="number" step="0.01" value={form.cost_price} onChange={(e) => setForm({ ...form, cost_price: e.target.value })} />
                        </div>
                    </div>
                    <div className="formGroup">
                        <label>Description</label>
                        <textarea className="formInput" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                    </div>
                    <div className="formRow">
                        <div className="formGroup">
                            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <input type="checkbox" checked={form.is_visible} onChange={(e) => setForm({ ...form, is_visible: e.target.checked })} />
                                Visible on Store
                            </label>
                        </div>
                        <div className="formGroup">
                            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} />
                                Featured Product
                            </label>
                        </div>
                    </div>
                </div>

                <div className="adminSection">
                    <h3>Product Images</h3>
                    <label className="imageUpload">
                        <input type="file" accept="image/*" multiple onChange={handleImageUpload} style={{ display: 'none' }} />
                        <Upload size={24} style={{ color: 'var(--admin-text-muted)', marginBottom: 8 }} />
                        <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>
                            {uploading ? 'Uploading...' : 'Click to upload images'}
                        </p>
                    </label>
                    {form.images.length > 0 && (
                        <div className="imagePreview">
                            {form.images.map((url, i) => (
                                <div key={i} style={{ position: 'relative', display: 'inline-block' }}>
                                    <img src={url} alt="" className="imgThumb" />
                                    <button type="button" className="imgRemove" onClick={() => removeImage(i)}>
                                        <X size={10} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="adminSection">
                    <h3>Sizes & Stock</h3>
                    <div className="formGroup">
                        <label>Available Sizes</label>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            {SIZE_OPTIONS.map((size) => (
                                <button key={size} type="button" className={`filterPill ${form.sizes.includes(size) ? 'active' : ''}`} onClick={() => toggleSize(size)}>
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="formGroup">
                        <label>Stock per Size</label>
                        <div className="stockGrid">
                            {form.sizes.map((size) => (
                                <div key={size} className="stockItem">
                                    <label>{size}</label>
                                    <input className="formInput" type="number" min="0" value={form.stock[size] || 0} onChange={(e) => setForm({ ...form, stock: { ...form.stock, [size]: parseInt(e.target.value) || 0 } })} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="adminSection">
                    <h3>Colors</h3>
                    {form.colors.length > 0 && (
                        <div className="colorChips" style={{ marginBottom: 16 }}>
                            {form.colors.map((color, i) => (
                                <div key={i} className="colorChip">
                                    <span className="dot" style={{ background: color.hex }} />
                                    {color.name}
                                    <button type="button" onClick={() => removeColor(i)} style={{ background: 'none', border: 'none', color: 'var(--admin-text-muted)', cursor: 'pointer', padding: 0, fontSize: '0.8rem' }}>×</button>
                                </div>
                            ))}
                        </div>
                    )}
                    <div style={{ display: 'flex', gap: 8, alignItems: 'end' }}>
                        <div className="formGroup" style={{ marginBottom: 0, flex: 1 }}>
                            <label>Color Name</label>
                            <input className="formInput" placeholder="e.g. Black" value={newColorName} onChange={(e) => setNewColorName(e.target.value)} />
                        </div>
                        <div className="formGroup" style={{ marginBottom: 0 }}>
                            <label>Hex</label>
                            <input type="color" value={newColorHex} onChange={(e) => setNewColorHex(e.target.value)} style={{ width: 44, height: 40, border: '1px solid var(--admin-border)', borderRadius: 'var(--admin-radius)', background: 'var(--admin-bg)', cursor: 'pointer' }} />
                        </div>
                        <button type="button" className="btnSecondary" onClick={addColor} style={{ height: 40 }}><Plus size={14} /> Add</button>
                    </div>
                </div>

                <div className="adminSection">
                    <h3>SEO & GEO Intelligence</h3>
                    <div className="formGroup">
                        <label>Meta Title</label>
                        <input className="formInput" placeholder="AI-optimized title..." value={form.seo_title} onChange={(e) => setForm({ ...form, seo_title: e.target.value })} />
                    </div>
                    <div className="formGroup">
                        <label>Meta Description</label>
                        <textarea className="formInput" placeholder="AI-friendly product narrative..." value={form.seo_description} onChange={(e) => setForm({ ...form, seo_description: e.target.value })} />
                    </div>
                    <div className="formGroup">
                        <label>Target Keywords (comma separated)</label>
                        <input className="formInput" placeholder="hypebeast, luxury streetwear, dhaka" value={form.seo_keywords} onChange={(e) => setForm({ ...form, seo_keywords: e.target.value })} />
                    </div>
                    <div className="formRow">
                        <div className="formGroup">
                            <label>Target Country</label>
                            <input className="formInput" value={form.target_country} onChange={(e) => setForm({ ...form, target_country: e.target.value })} />
                        </div>
                        <div className="formGroup">
                            <label>Target Region (Optional)</label>
                            <input className="formInput" placeholder="e.g., Dhaka, New York" value={form.target_region} onChange={(e) => setForm({ ...form, target_region: e.target.value })} />
                        </div>
                    </div>
                </div>

                <div className="formActions">
                    <button type="submit" className="btnPrimary" disabled={saving}>
                        {saving ? 'Saving...' : 'Update Product'}
                    </button>
                    <Link href="/admin/products" className="btnSecondary">Cancel</Link>
                </div>
            </form>
        </div>
    );
}
