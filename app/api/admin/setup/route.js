import { NextResponse } from 'next/server';
import { createAdminUser } from '@/lib/admin-api';

export async function POST() {
    try {
        // Create default admin user
        const result = await createAdminUser(
            'ahmedsabbir2013@gmail.com',
            'Sab01757@',
            'Sabbir Ahmed'
        );

        if (result.error) {
            return NextResponse.json({
                success: false,
                error: result.error.message,
            }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: 'Admin user created successfully',
        });
    } catch (err) {
        return NextResponse.json({
            success: false,
            error: err.message,
        }, { status: 500 });
    }
}
