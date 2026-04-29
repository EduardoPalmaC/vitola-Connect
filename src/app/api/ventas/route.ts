import { NextResponse } from 'next/server';
import { getVentas } from '@/lib/sheets';

export async function GET() {
  const ventas = await getVentas();
  return NextResponse.json(ventas);
}
