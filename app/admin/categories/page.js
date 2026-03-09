'use client';

import { useState, useEffect } from 'react';
import { getAdminCategories, createCategory, updateCategory, deleteCategory } from '@/lib/admin-api';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CategoriesAdminPage() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    const [form, setForm] = useState({
        name: '',
        slug: '',
        is_active: true
    });

    const loadData = async () => {
        setLoading(true);
        const { data } = await getAdminCategories();
        setCategories(data || []);
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleOpenModal = (category = null) => {
        if (category) {
            setEditingCategory(category);
            setForm({
                name: category.name,
                slug: category.slug,
                is_active: category.is_active
            });
        } else {
            setEditingCategory(null);
            setForm({ name: '', slug: '', is_active: true });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCategory(null);
        setForm({ name: '', slug: '', is_active: true });
    };

    // Auto-generate slug from name
    const handleNameChange = (e) => {
        const val = e.target.value;
        setForm({
            ...form,
            name: val,
            slug: val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
        });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (editingCategory) {
                const { error } = await updateCategory(editingCategory.id, form);
                if (error) throw error;
                toast.success('Category updated successfully');
            } else {
                const { error } = await createCategory(form);
                if (error) throw error;
                toast.success('Category created successfully');
            }
            handleCloseModal();
            loadData();
        } catch (err) {
            toast.error(err.message || 'Error saving category');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this category? This might affect products linked to it.')) return;
        try {
            const { error } = await deleteCategory(id);
            if (error) throw error;
            toast.success('Category deleted');
            loadData();
        } catch (err) {
            toast.error(err.message || 'Error deleting category');
        }
    };

    return (
        <div>
            <div className="adminTopBar">
                <div>
                    <h1>Categories Management</h1>
                    <p className="adminSubtitle">Manage the dynamic product categories visible on the storefront.</p>
                </div>
                <button className="btnPrimary" onClick={() => handleOpenModal()}>
                    <Plus size={16} /> Add Category
                </button>
            </div>

            <div className="adminSection" style={{ padding: 0 }}>
                {loading ? (
                    <div style={{ padding: 40, textAlign: 'center' }}>Loading categories...</div>
                ) : (
                    <table className="adminTable">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Slug</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((cat) => (
                                <tr key={cat.id}>
                                    <td style={{ fontWeight: 600 }}>{cat.name}</td>
                                    <td style={{ color: 'var(--admin-text-muted)' }}>{cat.slug}</td>
                                    <td>
                                        <span className={`badge ${cat.is_active ? 'delivered' : 'cancelled'}`}>
                                            {cat.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: 8 }}>
                                            <button className="btnIcon" onClick={() => handleOpenModal(cat)} title="Edit">
                                                <Edit2 size={16} />
                                            </button>
                                            <button className="btnIcon" onClick={() => handleDelete(cat.id)} style={{ color: '#ef4444' }} title="Delete">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {categories.length === 0 && (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: 'center', padding: 20 }}>No categories found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div style={{
                    position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }} onClick={handleCloseModal}>
                    <div style={{
                        background: 'var(--admin-bg)', width: 400, padding: 24, borderRadius: 12, border: '1px solid var(--admin-border)'
                    }} onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                            <h3>{editingCategory ? 'Edit Category' : 'New Category'}</h3>
                            <button onClick={handleCloseModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--admin-text)' }}>
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div className="formGroup">
                                <label>Category Name</label>
                                <input
                                    className="formInput"
                                    required
                                    value={form.name}
                                    onChange={handleNameChange}
                                    placeholder="e.g. Graphic Tees"
                                />
                            </div>
                            <div className="formGroup">
                                <label>Slug (URL Safe)</label>
                                <input
                                    className="formInput"
                                    required
                                    value={form.slug}
                                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                                />
                            </div>
                            <div className="formGroup" style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                                <input
                                    type="checkbox"
                                    checked={form.is_active}
                                    onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                                    style={{ width: 18, height: 18, accentColor: 'var(--admin-accent)' }}
                                />
                                <label>Active (Visible publically)</label>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 12 }}>
                                <button type="button" className="btnSecondary" onClick={handleCloseModal}>Cancel</button>
                                <button type="submit" className="btnPrimary">Save Category</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
