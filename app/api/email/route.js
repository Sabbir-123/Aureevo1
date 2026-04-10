import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
    try {
        const body = await request.json();
        const { to, subject, html, replyTo } = body;

        if (!to || !subject || !html) {
            return NextResponse.json({ error: 'Missing required fields: to, subject, html' }, { status: 400 });
        }

        // Configure Nodemailer with Zoho SMTP credentials
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.zoho.com',
            port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 465,
            secure: process.env.SMTP_PORT === '465' || !process.env.SMTP_PORT, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER, // Your Zoho Email
                pass: process.env.SMTP_PASS, // Your Zoho App Password or regular password
            },
        });

        // Setup email data
        const mailOptions = {
            from: `"AUREEVO" <${process.env.SMTP_USER}>`,
            replyTo: replyTo || process.env.SMTP_USER,
            to: to,
            subject: subject,
            html: html,
        };

        // Send email
        await transporter.sendMail(mailOptions);

        return NextResponse.json({ success: true, message: 'Email dispatched successfully' });
    } catch (error) {
        console.error('Email dispatch error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
