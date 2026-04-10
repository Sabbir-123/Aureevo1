'use client';

import { useState, useEffect } from 'react';
import { getEmployeeSalaries, addEmployeeSalary } from '@/lib/admin-api';
import { Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import styles from '../finance/page.module.css';

export default function SalaryManagementPage() {
    const [salaries, setSalaries] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        employee_id: '',
        employee_name: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        notes: ''
    });

    const loadData = async () => {
        setLoading(true);
        // Load salaries
        const resSalaries = await getEmployeeSalaries();
        if (resSalaries.error) {
            toast.error('Failed to load salaries');
        } else {
            setSalaries(resSalaries.data || []);
        }

        // Load employees
        try {
            const resEmp = await fetch('/api/admin/employees');
            if (resEmp.ok) {
                const empData = await resEmp.json();
                setEmployees(empData || []);
            }
        } catch (e) {}

        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleEmployeeChange = (e) => {
        const empId = e.target.value;
        const emp = employees.find(x => x.id === empId);
        setForm({ ...form, employee_id: empId, employee_name: emp ? emp.name : '' });
    };

    const handleSave = async () => {
        if (!form.employee_id || !form.amount) {
            toast.error('Employee and amount are required.');
            return;
        }

        setSaving(true);
        const { error } = await addEmployeeSalary({
            employee_id: form.employee_id,
            employee_name: form.employee_name,
            amount: Number(form.amount),
            date: form.date,
            notes: form.notes
        });

        if (error) {
            toast.error('Failed to add salary record.');
        } else {
            toast.success('Salary added and pushed to Finance Ledger!');
            setIsModalOpen(false);
            setForm({ employee_id: '', employee_name: '', amount: '', date: new Date().toISOString().split('T')[0], notes: '' });
            loadData();
        }
        setSaving(false);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Salary Management</h1>
                <button className={styles.actionBtn} onClick={() => setIsModalOpen(true)}>
                    <Plus size={18} /> Give Salary
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
                                <th>Employee Name</th>
                                <th>Amount Drawn</th>
                                <th>Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {salaries.length === 0 ? (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: 'center' }}>No salary records found.</td>
                                </tr>
                            ) : (
                                salaries.map(s => (
                                    <tr key={s.id}>
                                        <td>{s.date}</td>
                                        <td>{s.employee_name}</td>
                                        <td style={{ color: '#ef4444', fontWeight: 600 }}>-৳ {Number(s.amount).toLocaleString()}</td>
                                        <td>{s.notes || '-'}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {isModalOpen && (
                <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>Give Salary</h2>
                            <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}><X /></button>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Employee *</label>
                            <select className={styles.select} value={form.employee_id} onChange={handleEmployeeChange}>
                                <option value="">Select Employee</option>
                                {employees.map(emp => (
                                    <option key={emp.id} value={emp.id}>{emp.name} ({emp.email})</option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Amount (৳) *</label>
                            <input
                                type="number"
                                className={styles.input}
                                value={form.amount}
                                onChange={e => setForm({ ...form, amount: e.target.value })}
                                placeholder="0.00"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Date</label>
                            <input
                                type="date"
                                className={styles.input}
                                value={form.date}
                                onChange={e => setForm({ ...form, date: e.target.value })}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Notes</label>
                            <input
                                type="text"
                                className={styles.input}
                                value={form.notes}
                                onChange={e => setForm({ ...form, notes: e.target.value })}
                                placeholder="e.g. June Bonus Included"
                            />
                        </div>

                        <div className={styles.modalActions}>
                            <button className={styles.btnCancel} onClick={() => setIsModalOpen(false)}>Cancel</button>
                            <button className={styles.btnSave} onClick={handleSave} disabled={saving}>
                                {saving ? 'Saving...' : 'Add Salary'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
