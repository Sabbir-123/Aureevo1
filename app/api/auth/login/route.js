import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { validateAdmin, createAdminUser } from '@/lib/admin-api';

export async function POST(request) {
    try {
        const { email, password, action } = await request.json();

        // Setup: create default admin if action is 'setup'
        if (action === 'setup') {
            const result = await createAdminUser(email, password);
            if (result.error) {
                return NextResponse.json({ error: result.error.message }, { status: 500 });
            }
            return NextResponse.json({ success: true, message: 'Admin user created' });
        }

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
                exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
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
            maxAge: 7 * 24 * 60 * 60, // 7 days
            path: '/',
        });

        return NextResponse.json({ success: true, admin: { email: admin.email, name: admin.name } });
    } catch (err) {
        console.error('Login error:', err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
