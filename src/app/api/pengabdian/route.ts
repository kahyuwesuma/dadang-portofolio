import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/admin';

export async function POST(req: Request) {
  const supabaseAdmin = createClient();
  try {
    const body = await req.json();

    const { error, data } = await supabaseAdmin
      .from('pengabdian')
      .insert(body)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
