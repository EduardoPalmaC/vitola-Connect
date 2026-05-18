import { NextResponse } from 'next/server';
import { getClientes } from '@/lib/sheets';

export async function GET() {
  const clientes = await getClientes();
  return NextResponse.json(clientes);
}
