import { NextResponse } from 'next/server';
import { getClientes, updateCliente } from '@/lib/sheets';
import { revalidatePath } from 'next/cache';

export async function GET() {
  const clientes = await getClientes();
  return NextResponse.json(clientes);
}

export async function PUT(req: Request) {
  const body: { oldNombre: string; newNombre: string; newContacto: string } = await req.json();

  if (!body.oldNombre || !body.newNombre) {
    return NextResponse.json({ error: 'oldNombre y newNombre requeridos' }, { status: 400 });
  }

  await updateCliente(body.oldNombre, body.newNombre, body.newContacto ?? '');
  revalidatePath('/admin/clientes');

  return NextResponse.json({ ok: true });
}
