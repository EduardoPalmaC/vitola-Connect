import { google } from 'googleapis';
import type { Puro, Venta } from '@/types';

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

function rowToPuro(row: string[]): Puro {
  return {
    id: row[0]!,
    nombre: row[1]!,
    marca: row[2]!,
    vitola: row[3]!,
    ringGauge: parseInt(row[4]!),
    largo: parseFloat(row[5]!),
    paisOrigen: row[6]!,
    precioBruto: parseFloat(row[7]!),
    costoTransporte: parseFloat(row[8]!),
    costoAlmacenamiento: parseFloat(row[9]!),
    precioVenta: parseFloat(row[10]!),
    estado: row[11] as Puro['estado'],
    fechaLlegada: row[12]!,
    tiempoAnejamiento: parseFloat(row[13]!),
    humedad: parseFloat(row[14]!),
    fechaRevisionHumedad: row[15]!,
    fotoUrl: row[16] || undefined,
    notasCata: row[17] || undefined,
    stock: row[20] !== undefined && row[20] !== '' ? parseInt(row[20]) : 0,
    createdAt: row[18]!,
    updatedAt: row[19]!,
  };
}

function puroToRow(puro: Puro): (string | number)[] {
  return [
    puro.id,
    puro.nombre,
    puro.marca,
    puro.vitola,
    puro.ringGauge,
    puro.largo,
    puro.paisOrigen,
    puro.precioBruto,
    puro.costoTransporte,
    puro.costoAlmacenamiento,
    puro.precioVenta,
    puro.estado,
    puro.fechaLlegada,
    puro.tiempoAnejamiento,
    puro.humedad,
    puro.fechaRevisionHumedad,
    puro.fotoUrl ?? '',
    puro.notasCata ?? '',
    puro.createdAt,
    puro.updatedAt,
    puro.stock ?? 0,
  ];
}

export async function getPuros(): Promise<Puro[]> {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Inventario!A2:U',
  });

  const rows = (response.data.values ?? []) as string[][];
  return rows.map(rowToPuro);
}

export async function createPuro(
  puro: Omit<Puro, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Puro> {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const full: Puro = { ...puro, id, createdAt: now, updatedAt: now };

  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Inventario!A:U',
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [puroToRow(full)] },
  });

  return full;
}

export async function updatePuro(id: string, updates: Partial<Puro>): Promise<void> {
  const puros = await getPuros();
  const index = puros.findIndex((p) => p.id === id);
  if (index === -1) throw new Error('Puro no encontrado');

  const updated: Puro = {
    ...puros[index]!,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `Inventario!A${index + 2}:U${index + 2}`,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [puroToRow(updated)] },
  });
}

export async function deletePuro(id: string): Promise<void> {
  const puros = await getPuros();
  const index = puros.findIndex((p) => p.id === id);
  if (index === -1) throw new Error('Puro no encontrado');

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    requestBody: {
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId: 0,
              dimension: 'ROWS',
              startIndex: index + 1,
              endIndex: index + 2,
            },
          },
        },
      ],
    },
  });
}

export async function getVentas(): Promise<Venta[]> {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Ventas!A2:H',
  });

  const rows = (response.data.values ?? []) as string[][];
  return rows.map((row) => ({
    id: row[0]!,
    puroId: row[1]!,
    cantidad: parseInt(row[2]!),
    fechaVenta: row[3]!,
    precioVentaReal: parseFloat(row[4]!),
    ganancia: parseFloat(row[5]!),
    notas: row[6] || undefined,
    createdAt: row[7]!,
  }));
}

export async function createVenta(
  venta: Omit<Venta, 'id' | 'createdAt'>
): Promise<Venta> {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const full: Venta = { ...venta, id, createdAt: now };

  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Ventas!A:H',
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[
        full.id,
        full.puroId,
        full.cantidad,
        full.fechaVenta,
        full.precioVentaReal,
        full.ganancia,
        full.notas ?? '',
        full.createdAt,
      ]],
    },
  });

  return full;
}
