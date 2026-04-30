import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Cek ukuran file (maks 1MB untuk Base64 agar database tidak berat)
    if (file.size > 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Max 1MB for Base64 storage.' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString('base64');
    const dataUrl = `data:${file.type};base64,${base64}`;

    return NextResponse.json({ url: dataUrl });
  } catch (err) {
    console.error('[upload POST]', err);
    return NextResponse.json({ error: 'Failed to process image' }, { status: 500 });
  }
}
