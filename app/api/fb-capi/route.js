import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase'; // We'll query settings directly securely server-side.

export async function POST(req) {
    try {
        const body = await req.json();
        const { event_name, event_id, event_source_url, custom_data } = body;

        // Securely fetch Pixel info from the database on the server
        const { data: settings, error } = await supabase
            .from('settings')
            .select('facebook_pixel_id, facebook_pixel_token, facebook_test_event_code')
            .eq('id', 1)
            .single();

        if (error || !settings?.facebook_pixel_token || !settings?.facebook_pixel_id) {
            // Pixel not fully configured
            return NextResponse.json({ success: false, reason: 'Pixel or token not fully configured' }, { status: 400 });
        }

        const ip_address = req.headers.get('x-forwarded-for') || req.headers.get('cf-connecting-ip') || '0.0.0.0';
        const user_agent = req.headers.get('user-agent') || '';
        const fbp = req.cookies?.get('_fbp')?.value;
        const fbc = req.cookies?.get('_fbc')?.value;

        const payload = {
            data: [
                {
                    event_name: event_name,
                    event_time: Math.floor(Date.now() / 1000),
                    action_source: "website",
                    event_source_url: event_source_url || "",
                    event_id: event_id, // Vital for deduplication mapping
                    user_data: {
                        client_ip_address: ip_address.split(',')[0].trim(),
                        client_user_agent: user_agent,
                        // Append browser identifier cookies if available
                        ...(fbp && { fbp }),
                        ...(fbc && { fbc })
                    },
                    custom_data: custom_data || {}
                }
            ],
            // Include exactly if provided so it shows in the client's Test Events Tab automatically
            ...(settings.facebook_test_event_code?.trim() && { test_event_code: settings.facebook_test_event_code.trim() })
        };

        const FB_API_VERSION = 'v19.0';
        const response = await fetch(`https://graph.facebook.com/${FB_API_VERSION}/${settings.facebook_pixel_id}/events?access_token=${settings.facebook_pixel_token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const fbResponse = await response.json();

        return NextResponse.json({ success: true, fbResponse });

    } catch (err) {
        console.error('FB CAPI Server Error:', err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
