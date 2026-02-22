'use client';

import { useState, useEffect } from 'react';
import { Shield, UserPlus, CheckCircle, Search, Trash2, Key } from 'lucide-react';
import toast from 'react-hot-toast';

export default function EmployeesPage() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Form State
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        permsProducts: false,
        permsOrders: false
    });

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const res = await fetch('/api/admin/employees');
            if (res.ok) {
                const data = await res.json();
                setEmployees(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const permissions = [];
        if (formData.permsProducts) permissions.push('products');
        if (formData.permsOrders) permissions.push('orders');

        try {
            const res = await fetch('/api/admin/employees', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    permissions
                })
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Failed to create employee');

            toast.success('Employee created successfully');
            setEmployees([data, ...employees]);
            setShowForm(false);
            setFormData({ name: '', email: '', password: '', permsProducts: false, permsOrders: false });

        } catch (err) {
            toast.error(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="adminPage">Loading Employees...</div>;

    return (
        <div className="adminPage">
            <div className="adminHeader" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1>Employee Management</h1>
                    <p style={{ color: 'var(--color-grey-400)', marginTop: '0.5rem' }}>
                        Create staff accounts and restrict their access rights.
                    </p>
                </div>
                <button className="btn btn-gold" onClick={() => setShowForm(!showForm)}>
                    <UserPlus size={18} />
                    {showForm ? 'Cancel' : 'New Employee'}
                </button>
            </div>

            {showForm && (
                <div style={{ background: 'var(--color-black-light)', border: '1px solid var(--color-gold-muted)', borderRadius: '8px', padding: '2rem', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: 'var(--color-gold)' }}>Create New Employee</h2>
                    <form onSubmit={handleCreate}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                            <div>
                                <label className="input-label">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    className="input-field"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="input-label">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    className="input-field"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <label className="input-label">Initial Password</label>
                            <input
                                type="password"
                                required
                                minLength={6}
                                className="input-field"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                            <p style={{ fontSize: '0.8rem', color: 'var(--color-grey-500)', marginTop: '0.5rem' }}>
                                Employees cannot change their own passwords. Keep this safe and share it securely.
                            </p>
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <label className="input-label">Access Permissions</label>
                            <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={formData.permsProducts}
                                        onChange={(e) => setFormData({ ...formData, permsProducts: e.target.checked })}
                                        style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--color-gold)' }}
                                    />
                                    Products Page
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={formData.permsOrders}
                                        onChange={(e) => setFormData({ ...formData, permsOrders: e.target.checked })}
                                        style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--color-gold)' }}
                                    />
                                    Orders Page
                                </label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-gold"
                            disabled={submitting}
                            style={{ width: '100%' }}
                        >
                            {submitting ? 'Creating Account...' : 'Create Employee Account'}
                        </button>
                    </form>
                </div>
            )}

            <div className="adminSection">
                <table className="adminTable">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Access Areas</th>
                            <th>Created</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map((emp) => (
                            <tr key={emp.id}>
                                <td>{emp.name}</td>
                                <td>{emp.email}</td>
                                <td>
                                    <span className={`badge ${emp.role === 'root' ? 'success' : 'pending'}`}>
                                        <Shield size={12} style={{ marginRight: '4px', display: 'inline' }} />
                                        {emp.role.toUpperCase()}
                                    </span>
                                </td>
                                <td>
                                    {emp.role === 'root' ? (
                                        <span style={{ color: 'var(--color-gold)', fontSize: '0.85rem' }}>Full Access</span>
                                    ) : (
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            {emp.permissions?.map(p => (
                                                <span key={p} style={{ background: 'var(--color-grey-800)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem', textTransform: 'capitalize' }}>
                                                    {p}
                                                </span>
                                            ))}
                                            {(!emp.permissions || emp.permissions.length === 0) && (
                                                <span style={{ color: 'var(--color-grey-500)', fontSize: '0.85rem' }}>Dashboard Only</span>
                                            )}
                                        </div>
                                    )}
                                </td>
                                <td style={{ color: 'var(--color-grey-500)', fontSize: '0.85rem' }}>
                                    {new Date(emp.created_at).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                        {employees.length === 0 && (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-grey-500)' }}>
                                    No accounts found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
