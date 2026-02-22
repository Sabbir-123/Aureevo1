import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('admin_token')?.value;

        if (!token) {
            return NextResponse.json({ authenticated: false }, { status: 401 });
        }

        const [payload, signature] = token.split('.');
        if (!payload || !signature) {
            return NextResponse.json({ authenticated: false }, { status: 401 });
        }

        const secret = process.env.ADMIN_JWT_SECRET || 'fallback-secret';
        const crypto = await import('crypto');
        const expectedSig = crypto
            .createHmac('sha256', secret)
            .update(payload)
            .digest('hex');

        if (signature !== expectedSig) {
            return NextResponse.json({ authenticated: false }, { status: 401 });
        }

        const data = JSON.parse(Buffer.from(payload, 'base64').toString());

        if (data.exp < Date.now()) {
            cookieStore.delete('admin_token');
            return NextResponse.json({ authenticated: false }, { status: 401 });
        }

        return NextResponse.json({
            authenticated: true,
            admin: {
                email: data.email,
                name: data.name,
                role: data.role,
                permissions: data.permissions
            },
        });
    } catch {
        return NextResponse.json({ authenticated: false }, { status: 401 });
    }
}
