import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { createEntradaInventario, getEntradasByPuro } from '@/lib/sheets';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const puroId = searchParams.get('puroId');
  if (!puroId) return NextResponse.json({ error: 'puroId requerido' }, { status: 400 });
  const entradas = await getEntradasByPuro(puroId);
  return NextResponse.json(entradas);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { puroId, fecha, cantidad, costoUnitario, notas } = body;
    if (!puroId || !fecha || !cantidad || costoUnitario === undefined) {
      return NextResponse.json({ error: 'Campos requeridos: puroId, fecha, cantidad, costoUnitario' }, { status: 400 });
    }
    const entrada = await createEntradaInventario({ puroId, fecha, cantidad: Number(cantidad), costoUnitario: Number(costoUnitario), notas });
    revalidatePath('/admin');
    revalidatePath('/catalogo');
    return NextResponse.json(entrada, { status: 201 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error interno';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
