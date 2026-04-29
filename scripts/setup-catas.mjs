#!/usr/bin/env node
import { google } from 'googleapis';

async function setup() {
  let privateKey = process.env.GOOGLE_PRIVATE_KEY;
  const sheetId = process.env.GOOGLE_SHEETS_ID || process.env.GOOGLE_SHEET_ID;

  if (!sheetId) {
    console.error('Error: GOOGLE_SHEETS_ID or GOOGLE_SHEET_ID not set');
    process.exit(1);
  }

  // Handle private key: if it contains literal \n, convert to actual newlines
  if (privateKey && privateKey.includes('\\n')) {
    privateKey = privateKey.replace(/\\n/g, '\n');
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      type: 'service_account',
      project_id: process.env.GOOGLE_PROJECT_ID,
      private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
      private_key: privateKey,
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || process.env.GOOGLE_CLIENT_EMAIL,
      client_id: process.env.GOOGLE_CLIENT_ID,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });

  console.log('Obteniendo información del sheet...');
  const meta = await sheets.spreadsheets.get({ spreadsheetId: sheetId });
  const existingSheets = meta.data.sheets ?? [];
  const sheetTitles = existingSheets.map((s) => s.properties?.title ?? '');

  console.log('Sheets existentes:', sheetTitles);

  const requests = [];

  if (!sheetTitles.includes('Catas')) {
    console.log('Creando sheet "Catas"...');
    requests.push({
      addSheet: { properties: { title: 'Catas' } },
    });
  } else {
    console.log('Sheet "Catas" ya existe');
  }

  if (requests.length > 0) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: sheetId,
      requestBody: { requests },
    });
  }

  console.log('Escribiendo headers...');
  const CATAS_HEADERS = [
    'id', 'fecha', 'lugar', 'fotoUrl', 'notas', 'calificacion',
    'marca', 'vitola', 'cepo', 'paisOrigen', 'capa', 'puroId',
    'usuarioId', 'createdAt',
  ];

  await sheets.spreadsheets.values.update({
    spreadsheetId: sheetId,
    range: 'Catas!A1',
    valueInputOption: 'RAW',
    requestBody: { values: [CATAS_HEADERS] },
  });

  console.log('✓ Catas sheet creado exitosamente');
}

setup().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
