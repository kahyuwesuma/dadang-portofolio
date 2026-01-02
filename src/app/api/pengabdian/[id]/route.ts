import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

type Params = {
  params: Promise<{ id: string }>
}

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

/* =========================
   GET — detail pengabdian
========================= */
export async function GET(
  req: Request,
  { params }: Params
) {
  const { id } = await params

  if (!UUID_REGEX.test(id)) {
    return NextResponse.json(
      { error: 'Invalid ID' },
      { status: 400 }
    )
  }

  const { data, error } = await supabaseAdmin
    .from('pengabdian')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 404 }
    )
  }

  return NextResponse.json(data)
}

/* =========================
   PUT — update pengabdian
========================= */
export async function PUT(
  req: Request,
  { params }: Params
) {
  const { id } = await params

  if (!UUID_REGEX.test(id)) {
    return NextResponse.json(
      { error: 'Invalid ID' },
      { status: 400 }
    )
  }

  const body = await req.json()

  const { error } = await supabaseAdmin
    .from('pengabdian')
    .update({
      judul: body.judul,
      tanggal: body.tanggal,
      bulan_tahun: body.bulan_tahun,
      status: body.status,
      deskripsi: body.deskripsi,
      lokasi: body.lokasi,
      jumlah_peserta: body.jumlah_peserta ?? null,
      keywords: body.keywords ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    )
  }

  return NextResponse.json({ success: true })
}

/* =========================
   DELETE — hapus pengabdian
========================= */
export async function DELETE(
  req: Request,
  { params }: Params
) {
  const { id } = await params

  if (!UUID_REGEX.test(id)) {
    return NextResponse.json(
      { error: 'Invalid ID' },
      { status: 400 }
    )
  }

  const { error } = await supabaseAdmin
    .from('pengabdian')
    .delete()
    .eq('id', id)

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    )
  }

  return NextResponse.json({ success: true })
}
