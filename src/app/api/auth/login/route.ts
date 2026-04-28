import { NextResponse } from 'next/server';
import { signToken } from '@/lib/auth';

export async function POST(req: Request) {
  const { password } = (await req.json()) as { password?: string };

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
  }

  const token = await signToken({ role: 'admin' });

  const res = NextResponse.json({ ok: true });
  res.cookies.set('vitola_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 8,
    path: '/',
  });

  return res;
}
