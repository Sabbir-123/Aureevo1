import { NextResponse } from 'next/server';

// 1. In-memory Rate Limiting Store
const rateLimitMap = new Map();
const RATE_LIMIT_MAX = 60; // 60 requests per minute
const RATE_LIMIT_WINDOW = 60 * 1000;

// Helper: Sign HMAC-SHA256 in Edge
async function signJWT(payloadBase64, secret) {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    );
    const signatureBuffer = await crypto.subtle.sign(
        'HMAC',
        key,
        encoder.encode(payloadBase64)
    );
    const signatureArray = Array.from(new Uint8Array(signatureBuffer));
    return signatureArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Helper: Verify HMAC-SHA256 in Edge
async function verifyJWT(payloadBase64, signatureHex, secret) {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['verify']
    );
    const signatureBytes = new Uint8Array(
        signatureHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16))
    );
    return await crypto.subtle.verify(
        'HMAC',
        key,
        signatureBytes,
        encoder.encode(payloadBase64)
    );
}

export async function proxy(request) {
    const path = request.nextUrl.pathname;

    // --- 1. Rate Limiting ---
    const ip = request.headers.get('x-forwarded-for') || request.ip || '127.0.0.1';
    if (!rateLimitMap.has(ip)) {
        rateLimitMap.set(ip, { count: 1, lastReset: Date.now() });
    } else {
        const data = rateLimitMap.get(ip);
        if (Date.now() - data.lastReset > RATE_LIMIT_WINDOW) {
            data.count = 1;
            data.lastReset = Date.now();
        } else {
            data.count++;
            if (data.count > RATE_LIMIT_MAX) {
                return new NextResponse('Too Many Requests', { status: 429 });
            }
        }
    }

    // --- 2. Admin Auth Protection ---
    const isAdminRoute = path.startsWith('/admin');
    
    // Base response
    let response = NextResponse.next();

    if (isAdminRoute) {
        const tokenString = request.cookies.get('admin_token')?.value;

        if (!tokenString) {
            return NextResponse.redirect(new URL('/ad/login', request.url));
        }

        try {
            // Token format: payload.signature
            const parts = tokenString.split('.');
            if (parts.length !== 2) throw new Error('Invalid token structure');
            const [base64Payload, signatureHex] = parts;

            const secret = process.env.ADMIN_JWT_SECRET || 'fallback-secret';

            // Cryptographically Verify Signature
            const isValid = await verifyJWT(base64Payload, signatureHex, secret);
            if (!isValid) throw new Error('Signature tampering detected');

            // Verify Expiration safely
            const payloadStr = typeof Buffer !== 'undefined' 
                ? Buffer.from(base64Payload, 'base64').toString('utf8') 
                : atob(base64Payload);
                
            const payload = JSON.parse(payloadStr);

            if (payload.exp < Date.now()) {
                return NextResponse.redirect(new URL('/ad/login', request.url));
            }

            // Role-based access control inside /admin
            const role = payload.role || 'employee';
            const permissions = payload.permissions || [];

            let enforceRedirect = null;

            // Employee Restrictions
            if (role !== 'root') {
                if (path.startsWith('/admin/settings') || path.startsWith('/admin/analytics') || path.startsWith('/admin/employees')) {
                    enforceRedirect = '/admin';
                }
                else if (path.startsWith('/admin/products') && !permissions.includes('products')) {
                    enforceRedirect = '/admin';
                }
                else if (path.startsWith('/admin/orders') && !permissions.includes('orders')) {
                    enforceRedirect = '/admin';
                }
            }

            if (enforceRedirect && path !== enforceRedirect) {
                return NextResponse.redirect(new URL(enforceRedirect, request.url));
            }

            // --- 3. Sliding Session ---
            // If valid, re-sign a fresh token sliding by 30 mins
            payload.exp = Date.now() + 30 * 60 * 1000;
            const newBase64Payload = typeof Buffer !== 'undefined' 
                ? Buffer.from(JSON.stringify(payload)).toString('base64')
                : btoa(JSON.stringify(payload));
                
            const newSignatureHex = await signJWT(newBase64Payload, secret);
            const newSignedToken = `${newBase64Payload}.${newSignatureHex}`;

            response = NextResponse.next();
            response.cookies.set('admin_token', newSignedToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 30 * 60,
                path: '/',
            });

        } catch (e) {
            console.error("Middleware token parse error:", e.message);
            return NextResponse.redirect(new URL('/ad/login', request.url));
        }
    }

    return response;
}

export const config = {
    matcher: ['/admin/:path*', '/api/:path*', '/login', '/signup', '/ad/login'],
};
