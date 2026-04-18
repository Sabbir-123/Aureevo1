// Facebook Pixel event helpers (Client & Server Side CAPI Deduplication)

// Helper to generate a unique Event ID for deduplication
function generateEventId() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return 'ev_' + Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// Sends the event down BOTH the browser pixel (if loaded) and the server API (CAPI)
function sendEvent(eventName, eventData = {}) {
    if (typeof window === 'undefined') return;

    const eventId = generateEventId();

    // 1. Client Browser Event
    if (window.fbq) {
        window.fbq('track', eventName, eventData, { eventID: eventId });
    }

    // 2. Server Side Event (CAPI)
    fetch('/api/fb-capi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            event_name: eventName,
            event_id: eventId,
            event_source_url: window.location.href,
            custom_data: eventData
        })
    }).catch((err) => {
        console.error('CAPI sending failed on frontend:', err);
    });
}

export function trackPageView() {
    sendEvent('PageView');
}

export function trackViewContent(product) {
    sendEvent('ViewContent', {
        content_name: product.name,
        content_category: product.category,
        content_ids: [product.id],
        content_type: 'product',
        value: product.price,
        currency: 'BDT',
    });
}

export function trackAddToCart(product, quantity = 1) {
    sendEvent('AddToCart', {
        content_name: product.name,
        content_ids: [product.id],
        content_type: 'product',
        value: product.price * quantity,
        currency: 'BDT',
    });
}

export function trackInitiateCheckout(items, totalPrice) {
    sendEvent('InitiateCheckout', {
        content_ids: items.map((i) => i.product.id),
        content_type: 'product',
        num_items: items.length,
        value: totalPrice,
        currency: 'BDT',
    });
}

export function trackPurchase(orderId, items, totalPrice) {
    sendEvent('Purchase', {
        content_ids: items.map((i) => i.product.id),
        content_type: 'product',
        num_items: items.length,
        value: totalPrice,
        currency: 'BDT',
        order_id: orderId,
    });
}
