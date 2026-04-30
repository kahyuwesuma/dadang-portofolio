import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';
    
    let dataUrl = '';
    
    if (contentType.includes('application/json')) {
      const body = await req.json();
      dataUrl = body.base64;
      
      if (!dataUrl) {
        return NextResponse.json({ error: 'No data provided' }, { status: 400 });
      }
    } else {
      const formData = await req.formData();
      const file = formData.get('file') as File;

      if (!file) {
        return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
      }

      // Cek ukuran file (maks 4MB untuk Base64)
      if (file.size > 4 * 1024 * 1024) {
        return NextResponse.json({ error: 'File too large. Max 4MB.' }, { status: 400 });
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const base64 = buffer.toString('base64');
      dataUrl = `data:${file.type};base64,${base64}`;
    }

    return NextResponse.json({ url: dataUrl });
  } catch (err) {
    console.error('[upload POST]', err);
    return NextResponse.json({ error: 'Failed to process image' }, { status: 500 });
  }
}
