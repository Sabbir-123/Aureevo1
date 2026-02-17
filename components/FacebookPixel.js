'use client';

import { useEffect, useState } from 'react';
import { getSettings } from '@/lib/api';

export default function FacebookPixel() {
    const [pixelId, setPixelId] = useState('');

    useEffect(() => {
        async function loadPixel() {
            const settings = await getSettings();
            if (settings.facebookPixelId) {
                setPixelId(settings.facebookPixelId);
            }
        }
        loadPixel();
    }, []);

    useEffect(() => {
        if (!pixelId) return;

        // Initialize Facebook Pixel
        (function (f, b, e, v, n, t, s) {
            if (f.fbq) return;
            n = f.fbq = function () {
                n.callMethod
                    ? n.callMethod.apply(n, arguments)
                    : n.queue.push(arguments);
            };
            if (!f._fbq) f._fbq = n;
            n.push = n;
            n.loaded = true;
            n.version = '2.0';
            n.queue = [];
            t = b.createElement(e);
            t.async = true;
            t.src = v;
            s = b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t, s);
        })(
            window,
            document,
            'script',
            'https://connect.facebook.net/en_US/fbevents.js'
        );

        window.fbq('init', pixelId);
        window.fbq('track', 'PageView');
    }, [pixelId]);

    if (!pixelId) return null;

    return (
        <noscript>
            <img
                height="1"
                width="1"
                style={{ display: 'none' }}
                src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
                alt=""
            />
        </noscript>
    );
}
