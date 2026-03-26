export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
    const supabase = await createClient();
    const { data: authorData, error: authorError } = await supabase.from('author_profiles').select('*').limit(1);
    const { data: profileData, error: profileError } = await supabase.from('profiles').select('*').limit(1);
    return NextResponse.json({ authorData, authorError, profileData, profileError });
}
