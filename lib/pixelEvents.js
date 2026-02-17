// Facebook Pixel event helpers
// These check if fbq is loaded before firing

export function trackPageView() {
    if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'PageView');
    }
}

export function trackViewContent(product) {
    if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'ViewContent', {
            content_name: product.name,
            content_category: product.category,
            content_ids: [product.id],
            content_type: 'product',
            value: product.price,
            currency: 'BDT',
        });
    }
}

export function trackAddToCart(product, quantity = 1) {
    if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'AddToCart', {
            content_name: product.name,
            content_ids: [product.id],
            content_type: 'product',
            value: product.price * quantity,
            currency: 'BDT',
        });
    }
}

export function trackInitiateCheckout(items, totalPrice) {
    if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'InitiateCheckout', {
            content_ids: items.map((i) => i.product.id),
            content_type: 'product',
            num_items: items.length,
            value: totalPrice,
            currency: 'BDT',
        });
    }
}

export function trackPurchase(orderId, items, totalPrice) {
    if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'Purchase', {
            content_ids: items.map((i) => i.product.id),
            content_type: 'product',
            num_items: items.length,
            value: totalPrice,
            currency: 'BDT',
            order_id: orderId,
        });
    }
}
