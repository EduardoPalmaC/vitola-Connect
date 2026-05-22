import { NextResponse } from 'next/server';
import { getPuros, updatePuro, deletePuro } from '@/lib/sheets';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const puros = await getPuros();
  const puro = puros.find((p) => p.id === id);
  if (!puro) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
  return NextResponse.json(puro);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { stock: _stock, ...body } = await req.json();
  await updatePuro(id, body);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await deletePuro(id);
  return NextResponse.json({ ok: true });
}
