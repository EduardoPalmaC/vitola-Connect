import { NextResponse } from 'next/server';
import { deleteCata } from '@/lib/sheets';

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await deleteCata(id);
  return NextResponse.json({ ok: true });
}
