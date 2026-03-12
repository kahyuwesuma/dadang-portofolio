import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!   // service role — bisa write
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('desc_content')
      .select('groups')
      .eq('id', 1)
      .single();

    if (error) throw error;
    return NextResponse.json({ groups: data?.groups ?? [] });
  } catch (err) {
    console.error('[desc-content GET]', err);
    return NextResponse.json({ groups: [] }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { groups } = await req.json();
    if (!Array.isArray(groups)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const { error } = await supabase
      .from('desc_content')
      .upsert({ id: 1, groups, updated_at: new Date().toISOString() });

    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[desc-content POST]', err);
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}