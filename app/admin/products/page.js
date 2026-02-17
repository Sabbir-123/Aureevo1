'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    getAdminProducts,
    deleteProduct,
    toggleProductVisibility,
} from '@/lib/admin-api';
import { Plus, Pencil, Trash2, Package, Eye, EyeOff } from 'lucide-react';

export default function AdminProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(null);

    const load = async () => {
        setLoading(true);
        const { data } = await getAdminProducts();
        setProducts(data);
        setLoading(false);
    };

    useEffect(() => {
        load();
    }, []);

    const handleDelete = async (id, name) => {
        if (!confirm(`Are you sure you want to delete "${name}"? This cannot be undone.`)) return;
        setDeleting(id);
        await deleteProduct(id);
        setProducts((prev) => prev.filter((p) => p.id !== id));
        setDeleting(null);
    };

    const handleToggleVisibility = async (id, currentVisibility) => {
        await toggleProductVisibility(id, !currentVisibility);
        setProducts((prev) =>
            prev.map((p) => (p.id === id ? { ...p, is_visible: !currentVisibility } : p))
        );
    };

    return (
        <div>
            <div className="adminTopBar">
                <div>
                    <h1>Products</h1>
                    <p className="adminSubtitle">{products.length} products total</p>
                </div>
                <Link href="/admin/products/new" className="btnPrimary">
                    <Plus size={16} />
                    Add Product
                </Link>
            </div>

            {loading ? (
                <div className="loadingSpinner">Loading products...</div>
            ) : products.length === 0 ? (
                <div className="emptyState">
                    <Package size={48} />
                    <h3>No products yet</h3>
                    <p>Add your first product to get started.</p>
                    <Link href="/admin/products/new" className="btnPrimary" style={{ marginTop: 16, display: 'inline-flex' }}>
                        <Plus size={16} />
                        Add Product
                    </Link>
                </div>
            ) : (
                <div className="adminSection" style={{ padding: 0 }}>
                    <table className="adminTable">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Product Name</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Sizes</th>
                                <th>Stock</th>
                                <th>Visible</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => {
                                const totalStock = product.stock
                                    ? Object.values(product.stock).reduce((a, b) => a + Number(b), 0)
                                    : 0;
                                const isLowStock = totalStock <= 5;

                                return (
                                    <tr key={product.id} style={{ opacity: deleting === product.id ? 0.4 : 1 }}>
                                        <td>
                                            {product.images?.[0] ? (
                                                <img src={product.images[0]} alt={product.name} />
                                            ) : (
                                                <div style={{ width: 40, height: 40, borderRadius: 6, background: '#333' }} />
                                            )}
                                        </td>
                                        <td style={{ fontWeight: 500 }}>{product.name}</td>
                                        <td>
                                            <span className={`badge ${product.category === 'hoodies' ? 'confirmed' : 'active'}`}>
                                                {product.category === 'hoodies' ? 'Hoodie' : 'T-Shirt'}
                                            </span>
                                        </td>
                                        <td>৳ {Number(product.price).toFixed(2)}</td>
                                        <td>
                                            <div className="colorChips" style={{ gap: 3 }}>
                                                {(product.sizes || []).map((s) => (
                                                    <span key={s} style={{ fontSize: '0.7rem', padding: '2px 6px', border: '1px solid var(--admin-border)', borderRadius: 4 }}>
                                                        {s}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td>
                                            <span style={{ color: isLowStock ? 'var(--admin-warning)' : 'var(--admin-text)', fontWeight: isLowStock ? 600 : 400 }}>
                                                {totalStock} {isLowStock && '⚠️'}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                className={`toggle ${product.is_visible ? 'on' : ''}`}
                                                onClick={() => handleToggleVisibility(product.id, product.is_visible)}
                                                title={product.is_visible ? 'Visible on store' : 'Hidden from store'}
                                            />
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: 6 }}>
                                                <Link href={`/admin/products/${product.id}/edit`} className="btnIcon" title="Edit">
                                                    <Pencil size={14} />
                                                </Link>
                                                <button
                                                    className="btnIcon danger"
                                                    onClick={() => handleDelete(product.id, product.name)}
                                                    disabled={deleting === product.id}
                                                    title="Delete"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
