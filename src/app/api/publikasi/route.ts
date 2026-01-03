import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/admin';

export async function POST(req: Request) {
  const supabaseAdmin = createClient();
  try {
    const body = await req.json()

    const cleanData = {
      judul: body.judul,
      kategori: body.kategori,
      penulis: body.penulis,
      tahun: body.tahun,
      deskripsi: body.deskripsi ?? null,
      url: body.url ?? null,
      keywords: body.keywords ?? null,
    }

    const { error } = await supabaseAdmin
      .from('publikasi')
      .insert(cleanData)

    if (error) {
      console.error('CREATE ERROR:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('SERVER ERROR:', err)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
