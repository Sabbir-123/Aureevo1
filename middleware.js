import { NextResponse } from 'next/server';

export async function middleware(request) {
    const path = request.nextUrl.pathname;

    // Only run on /admin routes but skip /admin/login
    const isAdminRoute = path.startsWith('/admin');
    const isLoginRoute = path === '/admin/login';

    if (isAdminRoute && !isLoginRoute) {
        const token = request.cookies.get('admin_token')?.value;

        // Basic check for token presence. 
        // Full signature validation happens via API calls or Server Components.
        if (!token) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
