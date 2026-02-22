import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';
import crypto from 'crypto';

// Re-verify the token strictly on the server to ensure only root admins access this
async function getRootAdminPayload() {
    const cookieStore = await cookies();
    const tokenString = cookieStore.get('admin_token')?.value;

    if (!tokenString) return null;

    try {
        const [base64Payload, signature] = tokenString.split('.');
        const secret = process.env.ADMIN_JWT_SECRET || 'fallback-secret';

        // Verify signature
        const expectedSignature = crypto
            .createHmac('sha256', secret)
            .update(base64Payload)
            .digest('hex');

        if (signature !== expectedSignature) return null;

        const payload = JSON.parse(Buffer.from(base64Payload, 'base64').toString('utf8'));

        if (payload.role === 'root') return payload;
        return null;
    } catch (e) {
        return null;
    }
}

export async function GET() {
    const rootAdmin = await getRootAdminPayload();
    if (!rootAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

    try {
        const { data, error } = await supabase
            .from('admin_users')
            .select('id, email, name, role, permissions, created_at')
            .order('created_at', { ascending: false });

        if (error) throw error;

        return NextResponse.json(data);
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function POST(request) {
    const rootAdmin = await getRootAdminPayload();
    if (!rootAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

    try {
        const { name, email, password, permissions } = await request.json();

        if (!email || !password || !name) {
            return NextResponse.json({ error: 'Name, email, and password required' }, { status: 400 });
        }

        const bcrypt = (await import('bcryptjs')).default;
        const hash = await bcrypt.hash(password, 12);

        // Explicitly force role to 'employee'. Root admins cannot spawn other root admins via this easy UI.
        const { data, error } = await supabase
            .from('admin_users')
            .insert({
                name,
                email,
                password_hash: hash,
                role: 'employee',
                permissions: permissions || []
            })
            .select('id, email, name, role, permissions, created_at')
            .single();

        if (error) {
            if (error.code === '23505') {
                return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
            }
            throw error;
        }

        return NextResponse.json(data);
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
