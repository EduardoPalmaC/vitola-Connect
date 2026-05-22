import { NextResponse } from 'next/server';
import { updateEntradaInventario, deleteEntradaInventario } from '@/lib/sheets';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { fecha, cantidad, costoUnitario, notas } = body;
    if (!fecha || !cantidad || costoUnitario === undefined) {
      return NextResponse.json({ error: 'Campos requeridos: fecha, cantidad, costoUnitario' }, { status: 400 });
    }
    const entrada = await updateEntradaInventario(id, { fecha, cantidad: Number(cantidad), costoUnitario: Number(costoUnitario), notas });
    return NextResponse.json(entrada);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error interno';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await deleteEntradaInventario(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error interno';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
