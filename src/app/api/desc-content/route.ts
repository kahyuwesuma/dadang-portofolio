// src/app/api/desc-content/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'public', 'data', 'desc-content.json');

export async function GET() {
  try {
    const raw = readFileSync(DATA_PATH, 'utf-8');
    return NextResponse.json(JSON.parse(raw));
  } catch {
    return NextResponse.json({ error: 'Failed to read content' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.groups || !Array.isArray(body.groups)) {
      return NextResponse.json({ error: 'Invalid data shape' }, { status: 400 });
    }
    writeFileSync(DATA_PATH, JSON.stringify(body, null, 2), 'utf-8');
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Failed to save content' }, { status: 500 });
  }
}