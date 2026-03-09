import { supabase } from './supabase';

export async function trackEvent(eventType, payload = {}) {
    try {
        // Simple session management - in a real app you might use cookies
        let sessionId = typeof window !== 'undefined' ? sessionStorage.getItem('aureevo_session_id') : null;
        if (!sessionId) {
            sessionId = 'sess_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
            if (typeof window !== 'undefined') {
                sessionStorage.setItem('aureevo_session_id', sessionId);
            }
        }

        const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

        // Capture device basic info
        let deviceType = 'desktop';
        if (typeof window !== 'undefined') {
            const ua = navigator.userAgent.toLowerCase();
            if (/mobile|android|iphone|ipad|phone/i.test(ua)) {
                deviceType = 'mobile';
            } else if (/tablet/i.test(ua)) {
                deviceType = 'tablet';
            }
        }

        const { error } = await supabase.from('analytics_events').insert([{
            session_id: sessionId,
            path: currentPath,
            event_type: eventType,
            product_id: payload.productId || null,
            device_type: deviceType,
            location_country: 'BD', // Hardcoded or use GeoIP depending on setup
            metadata: payload
        }]);

        if (error) {
            console.error('Analytics tracking error:', error);
        }
    } catch (err) {
        console.error('Analytics err', err);
    }
}
