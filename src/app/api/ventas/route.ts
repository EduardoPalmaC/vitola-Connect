import { NextResponse } from 'next/server';
import { getVentas, createVenta } from '@/lib/sheets';

export async function GET() {
  const ventas = await getVentas();
  return NextResponse.json(ventas);
}

export async function POST(req: Request) {
  const body = await req.json();
  const venta = await createVenta(body);
  return NextResponse.json(venta, { status: 201 });
}
