'use client';

import { useState, useEffect } from 'react';
import { getFinanceRecords, addFinanceRecord, deleteFinanceRecord } from '@/lib/admin-api';
import { Plus, Trash2, X, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import styles from './page.module.css';

export default function FinanceLedgerPage() {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [filterMonth, setFilterMonth] = useState('');
    const [filterYear, setFilterYear] = useState('');

    // Summary states
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalExpense, setTotalExpense] = useState(0);
    const [netBalance, setNetBalance] = useState(0);
    const [totalProfit, setTotalProfit] = useState(0);

    const [form, setForm] = useState({
        type: 'income',
        amount: '',
        description: '',
        category: '',
        date: new Date().toISOString().split('T')[0]
    });

    const loadRecords = async () => {
        setLoading(true);
        const { data, error } = await getFinanceRecords(null, filterMonth, filterYear);
        if (error) {
            toast.error('Failed to load finance records');
        } else {
            setRecords(data);
            calculateTotals(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadRecords();
    }, [filterMonth, filterYear]);

    const calculateTotals = (data) => {
        let income = 0;
        let expense = 0;
        let profit = 0;
        data.forEach(r => {
            if (r.type === 'income') income += Number(r.amount);
            if (r.type === 'expense') expense += Number(r.amount);
            if (r.profit) profit += Number(r.profit);
        });
        setTotalIncome(income);
        setTotalExpense(expense);
        setNetBalance(income - expense);
        setTotalProfit(profit);
    };

    const handleSave = async () => {
        if (!form.amount || !form.description) {
            toast.error('Please fill all required fields');
            return;
        }

        const { error } = await addFinanceRecord({
            ...form,
            amount: Number(form.amount)
        });

        if (error) {
            toast.error('Failed to add record');
        } else {
            toast.success('Record added successfully');
            setIsModalOpen(false);
            setForm({ ...form, amount: '', description: '', category: '' });
            loadRecords();
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this record?')) {
            const { error } = await deleteFinanceRecord(id);
            if (error) toast.error('Failed to delete');
            else {
                toast.success('Deleted');
                loadRecords();
            }
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Finance Ledger</h1>
                <button className={styles.actionBtn} onClick={() => setIsModalOpen(true)}>
                    <Plus size={18} /> Add Record
                </button>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', alignItems: 'center' }}>
                <Filter size={20} style={{ color: 'var(--text-muted)' }} />
                <select className={styles.select} style={{ width: '150px' }} value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)}>
                    <option value="">All Months</option>
                    {[...Array(12)].map((_, i) => (
                        <option key={i} value={i + 1}>{new Date(0, i).toLocaleString('en-US', { month: 'long' })}</option>
                    ))}
                </select>
                <select className={styles.select} style={{ width: '150px' }} value={filterYear} onChange={(e) => setFilterYear(e.target.value)}>
                    <option value="">All Years</option>
                    {[2024, 2025, 2026, 2027, 2028].map(y => (
                        <option key={y} value={y}>{y}</option>
                    ))}
                </select>
            </div>

            <div className={styles.summaryCards}>
                <div className={styles.card}>
                    <div className={styles.cardTitle}>Total Income</div>
                    <div className={`${styles.cardValue} ${styles.income}`}>৳ {totalIncome.toLocaleString()}</div>
                </div>
                <div className={styles.card}>
                    <div className={styles.cardTitle}>Total Expenses</div>
                    <div className={`${styles.cardValue} ${styles.expense}`}>৳ {totalExpense.toLocaleString()}</div>
                </div>
                <div className={styles.card}>
                    <div className={styles.cardTitle}>Net Balance</div>
                    <div className={styles.cardValue} style={{ color: netBalance >= 0 ? '#4ade80' : '#ef4444' }}>
                        ৳ {netBalance.toLocaleString()}
                    </div>
                </div>
                <div className={styles.card}>
                    <div className={styles.cardTitle}>Sales Profit</div>
                    <div className={styles.cardValue} style={{ color: 'var(--color-gold)' }}>
                        ৳ {totalProfit.toLocaleString()}
                    </div>
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
                                <th>Type</th>
                                <th>Category / Desc</th>
                                <th>Qty</th>
                                <th>Revenue/Amt</th>
                                <th>Cost</th>
                                <th>Profit (Net)</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center' }}>No finance records found.</td>
                                </tr>
                            ) : (
                                records.map(r => (
                                    <tr key={r.id}>
                                        <td>{r.date}</td>
                                        <td>
                                            <span className={`${styles.typeBadge} ${styles[r.type]}`}>{r.type}</span>
                                        </td>
                                        <td>
                                            <div style={{ fontWeight: 600 }}>{r.category || '-'}</div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{r.description}</div>
                                            {r.order_id && <div style={{ fontSize: '0.75rem', color: 'var(--color-gold)' }}>Ref: {r.order_id}</div>}
                                        </td>
                                        <td style={{ color: 'var(--text-muted)' }}>
                                            {r.quantity || 1}
                                        </td>
                                        <td style={{ fontWeight: 600, color: r.type === 'income' ? '#4ade80' : '#ef4444' }}>
                                            {r.type === 'income' ? '+' : '-'}৳ {Number(r.amount).toLocaleString()}
                                        </td>
                                        <td style={{ color: '#ef4444' }}>
                                            {r.type === 'income' && r.profit !== undefined ? `৳ ${(Number(r.amount) - Number(r.profit)).toLocaleString()}` : (r.type === 'expense' ? `৳ ${Number(r.amount).toLocaleString()}` : '-')}
                                        </td>
                                        <td style={{ fontWeight: 500, color: (r.profit || 0) >= 0 ? 'var(--color-gold)' : '#ef4444' }}>
                                            {r.type === 'income' && r.profit !== undefined ? `+৳ ${Number(r.profit).toLocaleString()}` : (r.type === 'expense' ? `-৳ ${Number(r.amount).toLocaleString()}` : '-')}
                                        </td>
                                        <td>
                                            <button className={styles.deleteBtn} onClick={() => handleDelete(r.id)}>
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
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
                            <h2>New Finance Record</h2>
                            <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}><X /></button>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Record Type</label>
                            <select
                                className={styles.select}
                                value={form.type}
                                onChange={e => setForm({ ...form, type: e.target.value })}
                            >
                                <option value="income">Income</option>
                                <option value="expense">Expense</option>
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Amount (BDT)</label>
                            <input
                                type="number"
                                className={styles.input}
                                value={form.amount}
                                onChange={e => setForm({ ...form, amount: e.target.value })}
                                placeholder="0.00"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Category</label>
                            <input
                                type="text"
                                className={styles.input}
                                value={form.category}
                                onChange={e => setForm({ ...form, category: e.target.value })}
                                placeholder="e.g. Salary, Marketing, Material"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Description</label>
                            <input
                                type="text"
                                className={styles.input}
                                value={form.description}
                                onChange={e => setForm({ ...form, description: e.target.value })}
                                placeholder="Details..."
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

                        <div className={styles.modalActions}>
                            <button className={styles.btnCancel} onClick={() => setIsModalOpen(false)}>Cancel</button>
                            <button className={styles.btnSave} onClick={handleSave}>Save Record</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
