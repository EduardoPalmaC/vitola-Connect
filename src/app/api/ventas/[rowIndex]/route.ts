import { NextResponse } from 'next/server';
import { updateVenta, getPuros, updatePuro } from '@/lib/sheets';
import type { Venta } from '@/types';

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ rowIndex: string }> }
) {
  const { rowIndex: rowIndexStr } = await params;
  const rowIndex = parseInt(rowIndexStr);
  if (isNaN(rowIndex)) return NextResponse.json({ error: 'rowIndex inválido' }, { status: 400 });

  const body: {
    venta: Partial<Venta>;
    oldCantidad?: number;
    oldProducto?: string;
  } = await req.json();

  await updateVenta(rowIndex, body.venta);

  if (
    body.oldCantidad !== undefined &&
    body.venta.cantidad !== undefined &&
    body.oldCantidad !== body.venta.cantidad &&
    body.oldProducto
  ) {
    const diff = body.oldCantidad - body.venta.cantidad;
    const puros = await getPuros();
    const puro = puros.find(
      (p) =>
        `${p.marca} ${p.vitola}`.toLowerCase() === body.oldProducto!.toLowerCase()
    );
    if (puro) {
      await updatePuro(puro.id, { stock: Math.max(0, puro.stock + diff) });
    }
  }

  return NextResponse.json({ ok: true });
}
