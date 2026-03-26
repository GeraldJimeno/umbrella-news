import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    const supabase = await createClient();
    
    // Check if we are authenticated
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
        return NextResponse.json({ error: 'Not authenticated' });
    }

    // Try to upload a tiny file to 'avatars' bucket
    const fileBody = new Blob(['hello world'], { type: 'text/plain' });
    const { data, error } = await supabase.storage.from('avatars').upload(`${user.id}/test.txt`, fileBody, { upsert: true });

    return NextResponse.json({ uploadData: data, uploadError: error });
}
