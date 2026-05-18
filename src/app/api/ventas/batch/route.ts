import { NextResponse } from 'next/server';
import { registrarVentaItems, actualizarStockMultiple } from '@/lib/sheets';
import type { Puro } from '@/types';

function todayISO() {
  return new Date().toISOString().split('T')[0]!;
}

export async function POST(req: Request) {
  const body: { items: { puro: Puro; cantidad: number }[]; fecha?: string; clienteNombre?: string; clienteContacto?: string } = await req.json();

  const isToday = !body.fecha || body.fecha >= todayISO();

  if (isToday) {
    await Promise.all([
      actualizarStockMultiple(body.items.map(({ puro, cantidad }) => ({ id: puro.id, cantidad }))),
      registrarVentaItems(body.items, body.fecha, body.clienteNombre, body.clienteContacto),
    ]);
  } else {
    await registrarVentaItems(body.items, body.fecha, body.clienteNombre, body.clienteContacto);
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
