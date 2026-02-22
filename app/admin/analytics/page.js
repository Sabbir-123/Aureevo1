'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Users, Clock, MousePointerClick, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function AnalyticsDashboard() {
    const [loading, setLoading] = useState(true);
    const [events, setEvents] = useState([]);
    const [productsCache, setProductsCache] = useState({});
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const { data, error: fetchError } = await supabase
                .from('analytics_events')
                .select('*')
                .order('created_at', { ascending: false });

            if (fetchError) {
                if (fetchError.code === '42P01') {
                    throw new Error("The 'analytics_events' table has not been created in Supabase yet.");
                }
                throw fetchError;
            }

            setEvents(data || []);

            // Identify unique product IDs to fetch names
            const productIds = [...new Set(data.map(e => e.product_id).filter(Boolean))];

            if (productIds.length > 0) {
                const { data: productsData } = await supabase
                    .from('products')
                    .select('id, name')
                    .in('id', productIds);

                const cache = {};
                productsData?.forEach(p => { cache[p.id] = p.name; });
                setProductsCache(cache);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="adminPage"><p>Loading analytics data...</p></div>;

    if (error) {
        return (
            <div className="adminPage">
                <div className="adminHeader">
                    <h1>Analytics Dashboard</h1>
                </div>
                <div style={{ padding: '2rem', background: 'rgba(239, 83, 80, 0.1)', border: '1px solid rgba(239, 83, 80, 0.3)', borderRadius: '8px', display: 'flex', gap: '1rem' }}>
                    <AlertCircle color="var(--color-error)" />
                    <div>
                        <h3 style={{ color: 'var(--color-error)', marginBottom: '0.5rem' }}>Database Setup Required</h3>
                        <p>{error}</p>
                        <p style={{ marginTop: '0.5rem', color: 'var(--color-grey-400)', fontSize: '0.9rem' }}>
                            Please run the provided SQL script in your Supabase SQL Editor to create the `analytics_events` table before viewing this page.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Calculate aggregated metrics
    const totalVisits = events.length;
    const uniqueSessions = new Set(events.map(e => e.session_id)).size;

    // Average time spent (filter out 0s if they bounced immediately)
    const validDurations = events.map(e => e.duration_seconds).filter(d => d > 0);
    const avgDurationSeconds = validDurations.length > 0
        ? Math.round(validDurations.reduce((a, b) => a + b, 0) / validDurations.length)
        : 0;

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}m ${s}s`;
    };

    // Calculate Top Products by Views
    const productViews = {};
    events.filter(e => e.product_id).forEach(e => {
        productViews[e.product_id] = (productViews[e.product_id] || 0) + 1;
    });

    const topProducts = Object.entries(productViews)
        .map(([id, views]) => ({ id, views, name: productsCache[id] || 'Unknown Product' }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 5); // top 5

    return (
        <div className="adminPage">
            <div className="adminHeader">
                <div>
                    <h1>Analytics Dashboard</h1>
                    <p style={{ color: 'var(--color-grey-400)', marginTop: '0.5rem' }}>Track customer behavior and most visited products.</p>
                </div>
            </div>

            <div className="adminGrid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', marginBottom: '2rem' }}>
                <div className="statCard">
                    <div className="statIcon" style={{ background: 'var(--color-grey-800)' }}><MousePointerClick color="var(--color-white)" /></div>
                    <div className="statLabel" style={{ color: 'var(--color-grey-400)' }}>Total Page Views</div>
                    <div className="statValue" style={{ color: 'var(--color-white)' }}>{totalVisits}</div>
                </div>
                <div className="statCard">
                    <div className="statIcon" style={{ background: 'var(--color-grey-800)' }}><Users color="var(--color-white)" /></div>
                    <div className="statLabel" style={{ color: 'var(--color-grey-400)' }}>Unique Sessions</div>
                    <div className="statValue" style={{ color: 'var(--color-white)' }}>{uniqueSessions}</div>
                </div>
                <div className="statCard">
                    <div className="statIcon" style={{ background: 'var(--color-grey-800)' }}><Clock color="var(--color-white)" /></div>
                    <div className="statLabel" style={{ color: 'var(--color-grey-400)' }}>Avg. Time on Page</div>
                    <div className="statValue" style={{ color: 'var(--color-white)' }}>{formatTime(avgDurationSeconds)}</div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                {/* Most Visited Products */}
                <div style={{ background: 'var(--color-black-light)', border: '1px solid var(--color-grey-800)', borderRadius: '8px', padding: '1.5rem', color: 'var(--color-white)' }}>
                    <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--color-grey-800)', color: 'var(--color-white)' }}>Most Visited Products</h2>
                    {topProducts.length === 0 ? (
                        <p style={{ color: 'var(--color-grey-500)' }}>No product views recorded yet.</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {topProducts.map((p, index) => (
                                <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--color-black)', padding: '1rem', borderRadius: '4px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ color: 'var(--color-gold)', fontWeight: 'bold' }}>#{index + 1}</div>
                                        <div>
                                            <Link href={`/admin/products/${p.id}/edit`} style={{ color: 'var(--color-white)', textDecoration: 'none', fontWeight: '500' }}>
                                                {p.name}
                                            </Link>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--color-grey-500)', marginTop: '4px' }}>ID: {p.id.substring(0, 8)}...</div>
                                        </div>
                                    </div>
                                    <div style={{ fontWeight: 'bold', color: 'var(--color-white)' }}>{p.views} views</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recent Activity Feed */}
                <div style={{ background: 'var(--color-black-light)', border: '1px solid var(--color-grey-800)', borderRadius: '8px', padding: '1.5rem', color: 'var(--color-white)' }}>
                    <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--color-grey-800)', color: 'var(--color-white)' }}>Live Activity Stream</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '400px', overflowY: 'auto' }}>
                        {events.slice(0, 10).map((event) => (
                            <div key={event.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', borderBottom: '1px solid var(--color-grey-800)', fontSize: '0.9rem' }}>
                                <div>
                                    <span style={{ color: 'var(--color-gold)' }}>Viewed: </span>
                                    <span style={{ fontFamily: 'monospace', background: 'var(--color-grey-800)', padding: '2px 6px', borderRadius: '4px', color: 'var(--color-white)' }}>{event.path}</span>
                                </div>
                                <div style={{ color: 'var(--color-grey-500)' }}>
                                    {event.duration_seconds}s
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
