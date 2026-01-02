import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { deletePublikasi } from '@/lib/admin-supabase';


type Params = {
  params: Promise<{ id: string }>
}

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export async function PUT(req: Request, { params }: Params) {
  const { id } = await params // ✅ WAJIB

  if (!UUID_REGEX.test(id)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
  }

  const body = await req.json()

  const { error } = await supabaseAdmin
    .from('publikasi')
    .update({
      judul: body.judul,
      kategori: body.kategori,
      penulis: body.penulis,
      tahun: body.tahun,
      deskripsi: body.deskripsi ?? null,
      url: body.url ?? null,
      keywords: body.keywords ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params 

  if (!UUID_REGEX.test(id)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
  }

  const { error } = await supabaseAdmin
    .from('publikasi')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Delete error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true })
}
