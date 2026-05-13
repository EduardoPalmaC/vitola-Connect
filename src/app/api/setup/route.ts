import { google } from 'googleapis';
import { SignJWT, importPKCS8 } from 'jose';
import { NextResponse } from 'next/server';

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_ID!;

async function getAccessToken(): Promise<string> {
  const rawKey = (process.env.GOOGLE_PRIVATE_KEY ?? '').replace(/\\n/g, '\n');
  const privateKey = await importPKCS8(rawKey, 'RS256');
  const iat = Math.floor(Date.now() / 1000);

  const jwt = await new SignJWT({ scope: 'https://www.googleapis.com/auth/spreadsheets' })
    .setProtectedHeader({ alg: 'RS256' })
    .setIssuedAt(iat)
    .setExpirationTime(iat + 3600)
    .setIssuer(process.env.GOOGLE_CLIENT_EMAIL ?? '')
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

  const data = await res.json() as { access_token: string };
  return data.access_token;
}

const INVENTARIO_HEADERS = [
  'id', 'nombre', 'marca', 'vitola', 'ringGauge', 'largo', 'paisOrigen',
  'precioBruto', 'costoTransporte', 'costoAlmacenamiento', 'precioVenta',
  'estado', 'fechaLlegada', 'tiempoAnejamiento', 'humedad',
  'fechaRevisionHumedad', 'fotoUrl', 'notasCata', 'createdAt', 'updatedAt',
];

const VENTAS_HEADERS = [
  'id', 'puroId', 'cantidad', 'fechaVenta', 'precioVentaReal',
  'ganancia', 'notas', 'createdAt',
];

const CATAS_HEADERS = [
  'id', 'fecha', 'lugar', 'fotoUrl', 'notas', 'calificacion',
  'marca', 'vitola', 'cepo', 'paisOrigen', 'capa', 'puroId',
  'usuarioId', 'createdAt',
];

export async function GET() {
  const token = await getAccessToken();
  const sheets = google.sheets({ version: 'v4', auth: token });

  const meta = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
  const existingSheets = meta.data.sheets ?? [];

  const sheetTitles = existingSheets.map((s) => s.properties?.title ?? '');
  const requests: object[] = [];

  const firstSheetId = existingSheets[0]?.properties?.sheetId ?? 0;

  if (!sheetTitles.includes('Inventario')) {
    requests.push({
      updateSheetProperties: {
        properties: { sheetId: firstSheetId, title: 'Inventario' },
        fields: 'title',
      },
    });
  }

  if (!sheetTitles.includes('Ventas')) {
    requests.push({ addSheet: { properties: { title: 'Ventas' } } });
  }

  if (!sheetTitles.includes('Catas')) {
    requests.push({ addSheet: { properties: { title: 'Catas' } } });
  }

  if (requests.length > 0) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: { requests },
    });
  }

  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Inventario!A1',
    valueInputOption: 'RAW',
    requestBody: { values: [INVENTARIO_HEADERS] },
  });

  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Ventas!A1',
    valueInputOption: 'RAW',
    requestBody: { values: [VENTAS_HEADERS] },
  });

  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Catas!A1',
    valueInputOption: 'RAW',
    requestBody: { values: [CATAS_HEADERS] },
  });

  return NextResponse.json({ ok: true, message: 'Sheet configurado correctamente' });
}
