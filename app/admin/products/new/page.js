'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createProduct, uploadProductImage } from '@/lib/admin-api';
import { ArrowLeft, Upload, X, Plus } from 'lucide-react';
import Link from 'next/link';

const SIZE_OPTIONS = ['S', 'M', 'L', 'XL', 'XXL'];

export default function AddProductPage() {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    const [form, setForm] = useState({
        name: '',
        category: 'hoodies',
        price: '',
        description: '',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: [],
        stock: { S: 0, M: 0, L: 0, XL: 0 },
        images: [],
        is_visible: true,
        is_featured: false,
    });

    // Color management
    const [newColorName, setNewColorName] = useState('');
    const [newColorHex, setNewColorHex] = useState('#333333');

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

    // Size management
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

    // Image upload
    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;
        setUploading(true);

        for (const file of files) {
            try {
                const { url, error } = await uploadProductImage(file);
                if (url) {
                    setForm((prev) => ({ ...prev, images: [...prev.images, url] }));
                } else {
                    console.error('Upload error:', error);
                }
            } catch (err) {
                console.error('Upload failed:', err);
            }
        }
        setUploading(false);
    };

    const removeImage = (index) => {
        setForm((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }));
    };

    // Save
    const handleSave = async (e) => {
        e.preventDefault();
        if (!form.name || !form.price) {
            setError('Name and price are required.');
            return;
        }
        setError('');
        setSaving(true);

        const productData = {
            ...form,
            price: parseFloat(form.price),
        };

        const { error: saveError } = await createProduct(productData);

        if (saveError) {
            setError(saveError.message || 'Failed to create product');
            setSaving(false);
            return;
        }

        router.push('/admin/products');
    };

    return (
        <div>
            <div className="adminTopBar">
                <div>
                    <Link href="/admin/products" style={{ color: 'var(--admin-text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', marginBottom: 8 }}>
                        <ArrowLeft size={14} /> Back to Products
                    </Link>
                    <h1>Add New Product</h1>
                </div>
            </div>

            {error && <div className="loginError" style={{ marginBottom: 20 }}>{error}</div>}

            <form onSubmit={handleSave}>
                <div className="adminSection">
                    <h3>Basic Information</h3>
                    <div className="formGroup">
                        <label>Product Name *</label>
                        <input
                            className="formInput"
                            placeholder="e.g. Midnight Obsidian Hoodie"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            required
                        />
                    </div>

                    <div className="formRow">
                        <div className="formGroup">
                            <label>Category *</label>
                            <select
                                className="formInput"
                                value={form.category}
                                onChange={(e) => setForm({ ...form, category: e.target.value })}
                            >
                                <option value="hoodies">Hoodie</option>
                                <option value="tshirts">T-Shirt</option>
                            </select>
                        </div>
                        <div className="formGroup">
                            <label>Price (৳) *</label>
                            <input
                                className="formInput"
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={form.price}
                                onChange={(e) => setForm({ ...form, price: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="formGroup">
                        <label>Description</label>
                        <textarea
                            className="formInput"
                            placeholder="Write a compelling product description..."
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                        />
                    </div>

                    <div className="formRow">
                        <div className="formGroup">
                            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <input
                                    type="checkbox"
                                    checked={form.is_visible}
                                    onChange={(e) => setForm({ ...form, is_visible: e.target.checked })}
                                />
                                Visible on Store
                            </label>
                        </div>
                        <div className="formGroup">
                            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <input
                                    type="checkbox"
                                    checked={form.is_featured}
                                    onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                                />
                                Featured Product
                            </label>
                        </div>
                    </div>
                </div>

                {/* Images */}
                <div className="adminSection">
                    <h3>Product Images</h3>
                    <label className="imageUpload">
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageUpload}
                            style={{ display: 'none' }}
                        />
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
                                    <button
                                        type="button"
                                        className="imgRemove"
                                        onClick={() => removeImage(i)}
                                    >
                                        <X size={10} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Sizes & Stock */}
                <div className="adminSection">
                    <h3>Sizes & Stock</h3>
                    <div className="formGroup">
                        <label>Available Sizes</label>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            {SIZE_OPTIONS.map((size) => (
                                <button
                                    key={size}
                                    type="button"
                                    className={`filterPill ${form.sizes.includes(size) ? 'active' : ''}`}
                                    onClick={() => toggleSize(size)}
                                >
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
                                    <input
                                        className="formInput"
                                        type="number"
                                        min="0"
                                        value={form.stock[size] || 0}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                stock: { ...form.stock, [size]: parseInt(e.target.value) || 0 },
                                            })
                                        }
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Colors */}
                <div className="adminSection">
                    <h3>Colors</h3>
                    {form.colors.length > 0 && (
                        <div className="colorChips" style={{ marginBottom: 16 }}>
                            {form.colors.map((color, i) => (
                                <div key={i} className="colorChip">
                                    <span className="dot" style={{ background: color.hex }} />
                                    {color.name}
                                    <button
                                        type="button"
                                        onClick={() => removeColor(i)}
                                        style={{ background: 'none', border: 'none', color: 'var(--admin-text-muted)', cursor: 'pointer', padding: 0, fontSize: '0.8rem' }}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    <div style={{ display: 'flex', gap: 8, alignItems: 'end' }}>
                        <div className="formGroup" style={{ marginBottom: 0, flex: 1 }}>
                            <label>Color Name</label>
                            <input
                                className="formInput"
                                placeholder="e.g. Black"
                                value={newColorName}
                                onChange={(e) => setNewColorName(e.target.value)}
                            />
                        </div>
                        <div className="formGroup" style={{ marginBottom: 0 }}>
                            <label>Hex</label>
                            <input
                                type="color"
                                value={newColorHex}
                                onChange={(e) => setNewColorHex(e.target.value)}
                                style={{ width: 44, height: 40, border: '1px solid var(--admin-border)', borderRadius: 'var(--admin-radius)', background: 'var(--admin-bg)', cursor: 'pointer' }}
                            />
                        </div>
                        <button type="button" className="btnSecondary" onClick={addColor} style={{ height: 40 }}>
                            <Plus size={14} /> Add
                        </button>
                    </div>
                </div>

                <div className="formActions">
                    <button type="submit" className="btnPrimary" disabled={saving}>
                        {saving ? 'Saving...' : 'Create Product'}
                    </button>
                    <Link href="/admin/products" className="btnSecondary">
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
}
