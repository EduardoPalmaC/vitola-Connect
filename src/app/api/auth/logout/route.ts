import { NextResponse } from 'next/server';

export async function POST() {
  const res = NextResponse.redirect(new URL('/admin/login', process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'));
  res.cookies.set('vitola_token', '', {
    httpOnly: true,
    maxAge: 0,
    path: '/',
  });
  return res;
}
