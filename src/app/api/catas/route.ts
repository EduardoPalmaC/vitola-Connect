import { NextResponse } from 'next/server';
import { getCatas, createCata } from '@/lib/sheets';

export async function GET() {
  const catas = await getCatas();
  return NextResponse.json(catas);
}

export async function POST(req: Request) {
  const body = await req.json();
  const cata = await createCata({ ...body, usuarioId: body.usuarioId ?? 'admin' });
  return NextResponse.json(cata, { status: 201 });
}
