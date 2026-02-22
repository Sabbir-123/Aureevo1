import { NextResponse } from 'next/server';

export async function middleware(request) {
    const path = request.nextUrl.pathname;

    // Only run on /admin routes but skip /admin/login
    const isAdminRoute = path.startsWith('/admin');
    const isLoginRoute = path === '/admin/login';

    if (isAdminRoute && !isLoginRoute) {
        const tokenString = request.cookies.get('admin_token')?.value;

        if (!tokenString) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }

        try {
            // Extract the payload (token format is base64(payload).signature)
            const base64Payload = tokenString.split('.')[0];
            const payload = JSON.parse(Buffer.from(base64Payload, 'base64').toString('utf8'));

            // If token expired
            if (payload.exp < Date.now()) {
                return NextResponse.redirect(new URL('/admin/login', request.url));
            }

            // Role-based access control inside /admin
            const role = payload.role || 'employee';
            const permissions = payload.permissions || [];

            // Root admin has full access
            if (role === 'root') {
                return NextResponse.next();
            }

            // Employee Restrictions
            // 1. Employees can never access Settings or Analytics
            if (path.startsWith('/admin/settings') || path.startsWith('/admin/analytics') || path.startsWith('/admin/employees')) {
                return NextResponse.redirect(new URL('/admin', request.url));
            }

            // 2. Check if trying to access Products but doesn't have permission
            if (path.startsWith('/admin/products') && !permissions.includes('products')) {
                return NextResponse.redirect(new URL('/admin', request.url));
            }

            // 3. Check if trying to access Orders but doesn't have permission
            if (path.startsWith('/admin/orders') && !permissions.includes('orders')) {
                return NextResponse.redirect(new URL('/admin', request.url));
            }

        } catch (e) {
            // Invalid token format
            console.error("Middleware token parse error:", e);
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
