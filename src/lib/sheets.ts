import { google } from 'googleapis';
import type { Puro, Venta, Cata } from '@/types';

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
    fortaleza: row[21] || undefined,
    logoMarcaUrl: row[22] || undefined,
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
    puro.fortaleza ?? '',
    puro.logoMarcaUrl ?? '',
  ];
}

export async function getPuros(): Promise<Puro[]> {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Inventario!A2:W',
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
    range: 'Inventario!A:W',
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
    range: `Inventario!A${index + 2}:W${index + 2}`,
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
    range: 'Ventas!A2:F',
  });

  const rows = (response.data.values ?? []) as string[][];
  return rows
    .filter((row) => row.length >= 6)
    .map((row) => ({
      fecha: row[0]!,
      producto: row[1]!,
      cantidad: parseInt(row[2]!),
      precioUnitario: parseFloat(row[3]!),
      totalVenta: parseFloat(row[4]!),
      gananciaEstimada: parseFloat(row[5]!),
    }));
}

export async function registrarVentaItems(
  items: { puro: Puro; cantidad: number }[]
): Promise<void> {
  const fecha = new Date().toLocaleDateString('es-MX');
  const rows = items.map(({ puro, cantidad }) => {
    const costoUnitario = puro.precioBruto + puro.costoTransporte + puro.costoAlmacenamiento;
    const totalVenta = puro.precioVenta * cantidad;
    const gananciaEstimada = (puro.precioVenta - costoUnitario) * cantidad;
    return [fecha, `${puro.marca} ${puro.vitola}`, cantidad, puro.precioVenta, totalVenta, gananciaEstimada];
  });

  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Ventas!A:F',
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: rows },
  });
}

function rowToCata(row: string[]): Cata {
  const fotosRaw = row[14] ?? '';
  const etiquetasRaw = row[20] ?? '';
  return {
    id: row[0]!,
    fecha: row[1]!,
    lugar: row[2]!,
    fotoUrl: row[3] || undefined,
    notas: row[4]!,
    calificacion: parseInt(row[5]!) || 0,
    marca: row[6]!,
    vitola: row[7]!,
    cepo: parseInt(row[8]!) || 0,
    paisOrigen: row[9]!,
    capa: row[10]!,
    puroId: row[11] || undefined,
    usuarioId: row[12] || 'admin',
    createdAt: row[13]!,
    fotosAdicionales: fotosRaw ? fotosRaw.split(',').map((u) => u.trim()).filter(Boolean) : undefined,
    cuerpo: row[15] ? parseInt(row[15]) || undefined : undefined,
    dulzor: row[16] ? parseInt(row[16]) || undefined : undefined,
    especia: row[17] ? parseInt(row[17]) || undefined : undefined,
    tierra: row[18] ? parseInt(row[18]) || undefined : undefined,
    madera: row[19] ? parseInt(row[19]) || undefined : undefined,
    etiquetasAroma: etiquetasRaw ? etiquetasRaw.split(',').map((t) => t.trim()).filter(Boolean) : undefined,
    maridaje: row[21] || undefined,
  };
}

function cataToRow(cata: Cata): (string | number)[] {
  return [
    cata.id,
    cata.fecha,
    cata.lugar,
    cata.fotoUrl ?? '',
    cata.notas,
    cata.calificacion,
    cata.marca,
    cata.vitola,
    cata.cepo,
    cata.paisOrigen,
    cata.capa,
    cata.puroId ?? '',
    cata.usuarioId,
    cata.createdAt,
    (cata.fotosAdicionales ?? []).join(','),
    cata.cuerpo ?? '',
    cata.dulzor ?? '',
    cata.especia ?? '',
    cata.tierra ?? '',
    cata.madera ?? '',
    (cata.etiquetasAroma ?? []).join(','),
    cata.maridaje ?? '',
  ];
}

export async function getCatas(): Promise<Cata[]> {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Catas!A2:V',
  });
  const rows = (response.data.values ?? []) as string[][];
  return rows.filter((r) => r.length >= 5).map(rowToCata);
}

export async function createCata(cata: Omit<Cata, 'id' | 'createdAt'>): Promise<Cata> {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const full: Cata = { ...cata, id, createdAt: now };

  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Catas!A:V',
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [cataToRow(full)] },
  });

  return full;
}

export async function updateCata(id: string, data: Partial<Omit<Cata, 'id' | 'createdAt'>>): Promise<Cata> {
  const catas = await getCatas();
  const index = catas.findIndex((c) => c.id === id);
  if (index === -1) throw new Error('Cata no encontrada');

  const updated: Cata = { ...catas[index]!, ...data };

  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `Catas!A${index + 2}:V${index + 2}`,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [cataToRow(updated)] },
  });

  return updated;
}

export async function deleteCata(id: string): Promise<void> {
  const catas = await getCatas();
  const index = catas.findIndex((c) => c.id === id);
  if (index === -1) throw new Error('Cata no encontrada');

  const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
  const sheet = spreadsheet.data.sheets?.find((s) => s.properties?.title === 'Catas');
  const sheetId = sheet?.properties?.sheetId ?? 2;

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    requestBody: {
      requests: [
        {
          deleteDimension: {
            range: { sheetId, dimension: 'ROWS', startIndex: index + 1, endIndex: index + 2 },
          },
        },
      ],
    },
  });
}

export async function actualizarStockMultiple(
  updates: { id: string; cantidad: number }[]
): Promise<void> {
  const puros = await getPuros();

  await Promise.all(
    updates.map(({ id, cantidad }) => {
      const index = puros.findIndex((p) => p.id === id);
      if (index === -1) return Promise.resolve();

      const updated: Puro = {
        ...puros[index]!,
        stock: Math.max(0, puros[index]!.stock - cantidad),
        updatedAt: new Date().toISOString(),
      };

      return sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `Inventario!A${index + 2}:U${index + 2}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [puroToRow(updated)] },
      });
    })
  );
}
