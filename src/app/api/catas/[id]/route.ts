import { NextResponse } from 'next/server';
import { deleteCata, updateCata } from '@/lib/sheets';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const cata = await updateCata(id, body);
  return NextResponse.json(cata);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await deleteCata(id);
  return NextResponse.json({ ok: true });
}
