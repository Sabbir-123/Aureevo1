import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { validateAdmin, createAdminUser } from '@/lib/admin-api';

export async function POST(request) {
    try {
        const { email, password } = await request.json();

        // Login
        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
        }

        const admin = await validateAdmin(email, password);
        if (!admin) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Create a simple signed token
        const token = Buffer.from(
            JSON.stringify({
                id: admin.id,
                email: admin.email,
                name: admin.name,
                role: admin.role,
                permissions: admin.permissions,
                exp: Date.now() + 30 * 60 * 1000, // 30 minutes
            })
        ).toString('base64');

        const secret = process.env.ADMIN_JWT_SECRET || 'fallback-secret';
        const crypto = await import('crypto');
        const signature = crypto
            .createHmac('sha256', secret)
            .update(token)
            .digest('hex');

        const signedToken = `${token}.${signature}`;

        const cookieStore = await cookies();
        cookieStore.set('admin_token', signedToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 30 * 60, // 30 minutes
            path: '/',
        });

        return NextResponse.json({ success: true, admin: { email: admin.email, name: admin.name } });
    } catch (err) {
        console.error('Login error:', err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
