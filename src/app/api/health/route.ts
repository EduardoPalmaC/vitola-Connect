import { NextResponse } from 'next/server';
import { importPKCS8 } from 'jose';

export async function GET() {
  const checks: Record<string, string> = {};

  const privateKeyRaw = process.env.GOOGLE_PRIVATE_KEY ?? '';
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL ?? '';
  const sheetsId = process.env.GOOGLE_SHEETS_ID ?? '';

  checks['GOOGLE_CLIENT_EMAIL'] = clientEmail ? 'set' : 'MISSING';
  checks['GOOGLE_SHEETS_ID'] = sheetsId ? 'set' : 'MISSING';
  checks['GOOGLE_PRIVATE_KEY'] = privateKeyRaw
    ? `set (${privateKeyRaw.length} chars, starts: ${privateKeyRaw.slice(0, 20)})`
    : 'MISSING';

  let joseResult = 'not tested';
  if (privateKeyRaw) {
    try {
      const key = privateKeyRaw.replace(/^["']|["']$/g, '').replace(/\\n/g, '\n');
      await importPKCS8(key, 'RS256');
      joseResult = 'OK';
    } catch (e) {
      joseResult = `ERROR: ${e instanceof Error ? e.message : String(e)}`;
    }
  }
  checks['jose_importPKCS8'] = joseResult;

  let tokenResult = 'not tested';
  if (joseResult === 'OK') {
    try {
      const { SignJWT } = await import('jose');
      const key = privateKeyRaw.replace(/^["']|["']$/g, '').replace(/\\n/g, '\n');
      const privateKey = await importPKCS8(key, 'RS256');
      const iat = Math.floor(Date.now() / 1000);
      const jwt = await new SignJWT({ scope: 'https://www.googleapis.com/auth/spreadsheets' })
        .setProtectedHeader({ alg: 'RS256' })
        .setIssuedAt(iat)
        .setExpirationTime(iat + 3600)
        .setIssuer(clientEmail)
        .setAudience('https://oauth2.googleapis.com/token')
        .sign(privateKey);

      const res = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
          assertion: jwt,
        }),
      });
      const data = await res.json() as { access_token?: string; error?: string; error_description?: string };
      tokenResult = data.access_token ? 'OK' : `ERROR: ${data.error} - ${data.error_description}`;
    } catch (e) {
      tokenResult = `ERROR: ${e instanceof Error ? e.message : String(e)}`;
    }
  }
  checks['google_token'] = tokenResult;

  let sheetsResult = 'not tested';
  if (tokenResult === 'OK') {
    try {
      const { google } = await import('googleapis');
      const key = privateKeyRaw.replace(/^["']|["']$/g, '').replace(/\\n/g, '\n');
      const pk = await importPKCS8(key, 'RS256');
      const iat2 = Math.floor(Date.now() / 1000);
      const { SignJWT: SJ } = await import('jose');
      const jwt2 = await new SJ({ scope: 'https://www.googleapis.com/auth/spreadsheets' })
        .setProtectedHeader({ alg: 'RS256' })
        .setIssuedAt(iat2).setExpirationTime(iat2 + 3600)
        .setIssuer(clientEmail).setAudience('https://oauth2.googleapis.com/token')
        .sign(pk);
      const r2 = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: jwt2 }),
      });
      const { access_token } = await r2.json() as { access_token: string };
      const sheets = google.sheets({ version: 'v4', auth: access_token });
      const resp = await sheets.spreadsheets.values.get({
        spreadsheetId: sheetsId,
        range: 'Inventario!A1:A2',
      });
      sheetsResult = `OK - rows: ${(resp.data.values ?? []).length}`;
    } catch (e) {
      sheetsResult = `ERROR: ${e instanceof Error ? e.message : String(e)}`;
    }
  }
  checks['sheets_read'] = sheetsResult;

  return NextResponse.json(checks);
}
