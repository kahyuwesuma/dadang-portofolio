import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('hero_content')
      .select('*')
      .eq('id', 1)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
       throw error;
    }
    
    return NextResponse.json(data || {
        id: 1,
        image_url: '/images/profile4.jpeg',
        title: 'Dr. Dadang I K Mujiono',
        subtitle: 'Academic | Conservationist'
    });
  } catch (err) {
    console.error('[hero-content GET]', err);
    return NextResponse.json({ error: 'Failed to fetch hero content' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { image_url, title, subtitle } = body;

    const { error } = await supabase
      .from('hero_content')
      .upsert({ 
        id: 1, 
        image_url, 
        title, 
        subtitle, 
        updated_at: new Date().toISOString() 
      });

    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[hero-content POST]', err);
    return NextResponse.json({ error: 'Failed to save hero content' }, { status: 500 });
  }
}
