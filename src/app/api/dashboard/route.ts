import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/admin';

export async function GET() {
  try {
    const supabase = createClient();

    const { data: publikasi } = await supabase
      .from('publikasi')
      .select('kategori');

    const { data: pengabdian } = await supabase
      .from('pengabdian')
      .select('status');

    const pub = publikasi ?? [];
    const pen = pengabdian ?? [];

    const result = {
      total_publikasi: pub.length,
      total_buku: pub.filter(p => p.kategori?.toLowerCase() === 'buku').length,
      total_jurnal: pub.filter(p => p.kategori?.toLowerCase() === 'jurnal').length,
      total_oped: pub.filter(p => p.kategori?.toLowerCase() === 'op-ed').length,
      total_press: pub.filter(p => p.kategori?.toLowerCase() === 'press').length,

      total_pengabdian: pen.length,
      pengabdian_selesai: pen.filter(p => p.status === 'selesai').length,
      pengabdian_ongoing: pen.filter(p => p.status === 'ongoing').length,
      pengabdian_planned: pen.filter(p => p.status === 'planned').length,
    };

    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message },
      { status: 500 }
    );
  }
}
