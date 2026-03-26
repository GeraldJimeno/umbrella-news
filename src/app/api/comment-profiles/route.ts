import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Server-side API route to fetch comment display profiles.
 * Uses the service role key to bypass RLS on profiles table.
 * Only returns id, full_name, avatar_url, role — no sensitive data.
 */
export async function POST(request: NextRequest) {
    try {
        const { userIds } = await request.json();

        if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
            return NextResponse.json({ profiles: [] });
        }

        const safeIds = userIds.slice(0, 50);

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

        if (!supabaseUrl) {
            console.error('[comment-profiles] Missing NEXT_PUBLIC_SUPABASE_URL');
            return NextResponse.json({ profiles: [] }, { status: 500 });
        }

        // Use service role key if available, otherwise fall back to publishable key
        const key = serviceRoleKey || publishableKey;
        if (!key) {
            console.error('[comment-profiles] No Supabase key available');
            return NextResponse.json({ profiles: [] }, { status: 500 });
        }

        if (!serviceRoleKey) {
            console.warn('[comment-profiles] SUPABASE_SERVICE_ROLE_KEY not set. Add it to .env.local for full profile access. Falling back to publishable key.');
        }

        const supabaseAdmin = createClient(supabaseUrl, key, {
            auth: { persistSession: false, autoRefreshToken: false }
        });

        const { data, error } = await supabaseAdmin
            .from('profiles')
            .select('id, full_name, avatar_url, role')
            .in('id', safeIds);

        if (error) {
            console.error('[comment-profiles] Supabase error:', JSON.stringify(error));
            return NextResponse.json({ profiles: [] }, { status: 500 });
        }

        console.log(`[comment-profiles] Fetched ${data?.length || 0} profiles for ${safeIds.length} IDs`);
        return NextResponse.json({ profiles: data || [] });
    } catch (err) {
        console.error('[comment-profiles] API error:', err);
        return NextResponse.json({ profiles: [] }, { status: 500 });
    }
}
