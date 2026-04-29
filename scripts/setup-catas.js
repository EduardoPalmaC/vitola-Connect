#!/usr/bin/env node
const { google } = require('googleapis');
require('dotenv').config({ path: '.env.local' });

async function setup() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      type: 'service_account',
      project_id: process.env.GOOGLE_PROJECT_ID,
      private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
      private_key: JSON.parse(process.env.GOOGLE_PRIVATE_KEY || '""'),
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      client_id: process.env.GOOGLE_CLIENT_ID,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });
  const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_ID;

  console.log('Obteniendo información del sheet...');
  const meta = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
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
      spreadsheetId: SPREADSHEET_ID,
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
    spreadsheetId: SPREADSHEET_ID,
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
