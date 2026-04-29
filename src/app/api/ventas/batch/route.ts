import { NextResponse } from 'next/server';
import { registrarVentaItems, actualizarStockMultiple } from '@/lib/sheets';
import type { Puro } from '@/types';

export async function POST(req: Request) {
  const body: { items: { puro: Puro; cantidad: number }[] } = await req.json();

  await Promise.all([
    actualizarStockMultiple(body.items.map(({ puro, cantidad }) => ({ id: puro.id, cantidad }))),
    registrarVentaItems(body.items),
  ]);

  return NextResponse.json({ ok: true }, { status: 201 });
}
