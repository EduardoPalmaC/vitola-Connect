import { google } from 'googleapis';
import { NextResponse } from 'next/server';

const auth = new google.auth.GoogleAuth({
  credentials: {
    type: 'service_account',
    project_id: process.env.GOOGLE_PROJECT_ID,
    private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
    private_key: JSON.parse(process.env.GOOGLE_PRIVATE_KEY ?? '""'),
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    client_id: process.env.GOOGLE_CLIENT_ID,
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });
const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_ID!;

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

export async function GET() {
  const meta = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
  const existingSheets = meta.data.sheets ?? [];

  const sheetTitles = existingSheets.map((s) => s.properties?.title ?? '');
  const requests: object[] = [];

  const firstSheetId = existingSheets[0]?.properties?.sheetId ?? 0;

  // Rename first sheet to "Inventario" if needed
  if (!sheetTitles.includes('Inventario')) {
    requests.push({
      updateSheetProperties: {
        properties: { sheetId: firstSheetId, title: 'Inventario' },
        fields: 'title',
      },
    });
  }

  // Add "Ventas" tab if missing
  if (!sheetTitles.includes('Ventas')) {
    requests.push({
      addSheet: { properties: { title: 'Ventas' } },
    });
  }

  if (requests.length > 0) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: { requests },
    });
  }

  // Write headers to Inventario!A1
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Inventario!A1',
    valueInputOption: 'RAW',
    requestBody: { values: [INVENTARIO_HEADERS] },
  });

  // Write headers to Ventas!A1
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Ventas!A1',
    valueInputOption: 'RAW',
    requestBody: { values: [VENTAS_HEADERS] },
  });

  return NextResponse.json({ ok: true, message: 'Sheet configurado correctamente' });
}
