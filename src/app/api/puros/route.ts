import { NextResponse } from 'next/server';
import { getPuros, createPuro } from '@/lib/sheets';
import { filtrarPuros, paginar } from '@/lib/filters';
import type { FilterParams } from '@/types';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const params: FilterParams = {
    marca: searchParams.get('marca') ?? undefined,
    vitola: searchParams.get('vitola') ?? undefined,
    paisOrigen: searchParams.get('paisOrigen') ?? undefined,
    search: searchParams.get('search') ?? undefined,
    estado: (searchParams.get('estado') as FilterParams['estado']) ?? undefined,
    ringGauge: searchParams.get('ringGauge') ? Number(searchParams.get('ringGauge')) : undefined,
    precioMin: searchParams.get('precioMin') ? Number(searchParams.get('precioMin')) : undefined,
    precioMax: searchParams.get('precioMax') ? Number(searchParams.get('precioMax')) : undefined,
    tiempoAnejamientoMin: searchParams.get('tiempoAnejamientoMin')
      ? Number(searchParams.get('tiempoAnejamientoMin'))
      : undefined,
    page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
  };

  const puros = await getPuros();
  const filtered = filtrarPuros(puros, params);
  const result = paginar(filtered, params.page);

  return NextResponse.json(result);
}

export async function POST(req: Request) {
  const body = await req.json();
  const puro = await createPuro(body);
  return NextResponse.json(puro, { status: 201 });
}
