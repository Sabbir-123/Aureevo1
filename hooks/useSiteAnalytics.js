'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

// Generate a simple session ID if one doesn't exist
const getSessionId = () => {
    if (typeof window === 'undefined') return null;
    let sid = sessionStorage.getItem('aureevo_session_id');
    if (!sid) {
        sid = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        sessionStorage.setItem('aureevo_session_id', sid);
    }
    return sid;
};

export default function useSiteAnalytics() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Store the ID of the current analytics event row in the DB
    const currentEventIdRef = useRef(null);
    const stopIntervalRef = useRef(null);

    useEffect(() => {
        if (!pathname) return;

        // Cleanup previous interval if running
        if (stopIntervalRef.current) {
            stopIntervalRef.current();
            stopIntervalRef.current = null;
        }

        let isMounted = true;
        let eventId = null;
        const startTime = Date.now();
        const sessionId = getSessionId();

        // Extract product ID if it's a product page
        let productId = null;
        if (pathname.startsWith('/product/')) {
            productId = pathname.replace('/product/', '');
        }

        // 1. Initial page view log
        const logPageView = async () => {
            try {
                const { data, error } = await supabase
                    .from('analytics_events')
                    .insert([{
                        path: pathname,
                        product_id: productId || null,
                        session_id: sessionId,
                        duration_seconds: 0
                    }])
                    .select('id');

                if (error) {
                    console.error("Supabase Analytics Error:", error.message || JSON.stringify(error));
                    return;
                }

                if (isMounted && data && data.length > 0) {
                    eventId = data[0].id;
                    currentEventIdRef.current = eventId;
                }
            } catch (err) {
                console.error("Failed to log analytics event:", err.message || err);
            }
        };

        logPageView();

        // 2. Pulse tracking every 10 seconds to update time spent
        const intervalId = setInterval(async () => {
            if (!eventId) return; // Wait until initial inserts returns an ID

            const currentDuration = Math.floor((Date.now() - startTime) / 1000);

            try {
                await supabase
                    .from('analytics_events')
                    .update({ duration_seconds: currentDuration })
                    .eq('id', eventId);
            } catch (err) {
                // Silently fail intervals to prevent console spam
            }
        }, 10000);

        // Store a cleanup function
        stopIntervalRef.current = () => {
            clearInterval(intervalId);

            // Final update attempt on unmount
            if (eventId) {
                const finalDuration = Math.floor((Date.now() - startTime) / 1000);
                supabase
                    .from('analytics_events')
                    .update({ duration_seconds: finalDuration })
                    .eq('id', eventId)
                    .then(() => { })
                    .catch(() => { });
            }
        };

        return () => {
            isMounted = false;
            if (stopIntervalRef.current) {
                stopIntervalRef.current();
                stopIntervalRef.current = null;
            }
        };

    }, [pathname, searchParams]); // Re-run when URL changes
}
