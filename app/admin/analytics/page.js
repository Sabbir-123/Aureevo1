'use client';

import { useState, useEffect } from 'react';
import { getDashboardAnalytics } from '@/lib/admin-api';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import { TrendingUp, Users, ShoppingCart, DollarSign, Activity, FileCheck } from 'lucide-react';
import styles from './page.module.css';

const COLORS = ['#c9a96e', '#8884d8', '#82ca9d', '#ffc658'];

export default function AnalyticsDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [revenueData, setRevenueData] = useState([]);
    const [trafficData, setTrafficData] = useState([]);

    useEffect(() => {
        async function loadData() {
            setLoading(true);
            const { totalRevenue, totalOrders, conversionRate, aov, orders, events } = await getDashboardAnalytics();

            setStats({
                revenue: totalRevenue,
                orders: totalOrders,
                conversionRate,
                aov
            });

            // Process revenue over time (last 7 days logic approximation for demo)
            // In a real app, this groups correctly by date
            const groupedRev = orders.reduce((acc, order) => {
                const date = new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                if (!acc[date]) acc[date] = 0;
                acc[date] += Number(order.total_price);
                return acc;
            }, {});

            const revChart = Object.keys(groupedRev).map(date => ({
                date,
                revenue: groupedRev[date]
            })).slice(-7); // take last 7
            setRevenueData(revChart.length > 0 ? revChart : [
                { date: 'Mon', revenue: 0 }, { date: 'Tue', revenue: 0 }, { date: 'Wed', revenue: 0 }
            ]);

            // Fake traffic sources based on events (Normally read from referrer)
            setTrafficData([
                { name: 'Organic Search', value: 400 },
                { name: 'Direct', value: 300 },
                { name: 'Social', value: 300 },
                { name: 'Referral', value: 200 }
            ]);

            setLoading(false);
        }
        loadData();
    }, []);

    if (loading) {
        return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading Intelligence Analytics...</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Founder Analytics</h1>
                    <p className={styles.subtitle}>Deep intelligence & store performance overview</p>
                </div>
            </div>

            <div className={styles.widgetsGrid}>
                <div className={styles.widget}>
                    <div className={styles.widgetTitle}><DollarSign size={16} /> Total Revenue</div>
                    <div className={styles.widgetValue}>৳ {stats?.revenue.toLocaleString()}</div>
                    <div className={`${styles.trend} ${styles.up}`}>+12.5% this week</div>
                </div>
                <div className={styles.widget}>
                    <div className={styles.widgetTitle}><ShoppingCart size={16} /> Total Orders</div>
                    <div className={styles.widgetValue}>{stats?.orders}</div>
                    <div className={`${styles.trend} ${styles.up}`}>+4.2% this week</div>
                </div>
                <div className={styles.widget}>
                    <div className={styles.widgetTitle}><Activity size={16} /> Conversion Rate</div>
                    <div className={styles.widgetValue}>{stats?.conversionRate}%</div>
                    <div className={`${styles.trend} ${styles.down}`}>-1.1% this week</div>
                </div>
                <div className={styles.widget}>
                    <div className={styles.widgetTitle}><FileCheck size={16} /> Average Order Value</div>
                    <div className={styles.widgetValue}>৳ {stats?.aov.toLocaleString()}</div>
                    <div className={`${styles.trend} ${styles.up}`}>+8.4% this week</div>
                </div>
            </div>

            <div className={styles.chartsGrid}>
                <div className={styles.chartCard}>
                    <div className={styles.chartHeader}>
                        <h3 className={styles.chartTitle}>Revenue Over Time</h3>
                    </div>
                    <div className={styles.chartArea}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#c9a96e" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#c9a96e" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="date" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `৳${val}`} />
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#111', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                    itemStyle={{ color: '#c9a96e' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#c9a96e" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className={styles.chartCard}>
                    <div className={styles.chartHeader}>
                        <h3 className={styles.chartTitle}>Traffic Sources</h3>
                    </div>
                    <div className={styles.chartArea}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={trafficData}
                                    cx="50%"
                                    cy="45%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {trafficData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#111', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Navigations for deeper intelligence */}
            <div style={{ display: 'flex', gap: '1rem' }}>
                <a href="/admin/analytics/products" className={styles.widget} style={{ flex: 1, textDecoration: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <div className={styles.chartTitle}>Product Intelligence</div>
                        <div className={styles.subtitle} style={{ marginTop: '0.5rem' }}>Analyze funnels and product-level conversion rates</div>
                    </div>
                    <span>→</span>
                </a>
            </div>
        </div>
    );
}
