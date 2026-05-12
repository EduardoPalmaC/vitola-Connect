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
    costoMazo: row[23] !== undefined && row[23] !== '' ? parseFloat(row[23]) : undefined,
    purosPorMazo: row[24] !== undefined && row[24] !== '' ? parseInt(row[24]) : undefined,
    transporteMazo: row[25] !== undefined && row[25] !== '' ? parseFloat(row[25]) : undefined,
    almacenamientoMazo: row[26] !== undefined && row[26] !== '' ? parseFloat(row[26]) : undefined,
    modoIngreso: (row[27] === 'mazo' || row[27] === 'pieza') ? row[27] : undefined,
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
    puro.costoMazo ?? '',
    puro.purosPorMazo ?? '',
    puro.transporteMazo ?? '',
    puro.almacenamientoMazo ?? '',
    puro.modoIngreso ?? '',
  ];
}

export async function getPuros(): Promise<Puro[]> {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Inventario!A2:AB',
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
    range: 'Inventario!A:AB',
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
    range: `Inventario!A${index + 2}:AB${index + 2}`,
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

function normalizeDate(value: string | undefined): string {
  if (!value) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  if (value.includes('T')) return value.substring(0, 10);
  const num = Number(value);
  if (!isNaN(num) && num > 30000 && num < 100000) {
    return new Date((num - 25569) * 86400 * 1000).toISOString().slice(0, 10);
  }
  const d = new Date(value);
  if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  return value;
}

// Columnas Catas (A-AD = 30 cols):
// [0]A id  [1]B fecha  [2]C lugar  [3]D fotoUrl  [4]E notas  [5]F calificacion
// [6]G marca  [7]H nombre  [8]I vitola  [9]J cepo  [10]K paisOrigen  [11]L capa
// [12]M puroId  [13]N usuarioId  [14]O createdAt  [15]P fotosAdicionales
// [16]Q cuerpo  [17]R dulzor  [18]S especia  [19]T tierra  [20]U madera
// [21]V etiquetasAroma  [22]W maridaje
// [23]X tiro  [24]Y quemado  [25]Z chocolate  [26]AA nuez  [27]AB cafe  [28]AC caramelo
// [29]AD cuero
function rowToCata(row: string[]): Cata {
  const fotosRaw = row[15] || '';
  const etiquetasRaw = row[21] || '';
  return {
    id: row[0] || '',
    fecha: normalizeDate(row[1]),
    lugar: row[2] || '',
    fotoUrl: row[3] || undefined,
    notas: row[4] || '',
    calificacion: parseInt(row[5] || '0') || 0,
    marca: row[6] || '',
    nombre: row[7] || '',
    vitola: row[8] || '',
    cepo: parseInt(row[9] || '0') || 0,
    paisOrigen: row[10] || '',
    capa: row[11] || '',
    puroId: row[12] || undefined,
    usuarioId: row[13] || 'admin',
    createdAt: row[14] || '',
    fotosAdicionales: fotosRaw ? fotosRaw.split(',').map((u) => u.trim()).filter(Boolean) : undefined,
    cuerpo: row[16] ? parseInt(row[16]) || undefined : undefined,
    dulzor: row[17] ? parseInt(row[17]) || undefined : undefined,
    especia: row[18] ? parseInt(row[18]) || undefined : undefined,
    tierra: row[19] ? parseInt(row[19]) || undefined : undefined,
    madera: row[20] ? parseInt(row[20]) || undefined : undefined,
    etiquetasAroma: etiquetasRaw ? etiquetasRaw.split(',').map((t) => t.trim()).filter(Boolean) : undefined,
    maridaje: row[22] || undefined,
    tiro: row[23] ? parseInt(row[23]) || undefined : undefined,
    quemado: row[24] ? parseInt(row[24]) || undefined : undefined,
    chocolate: row[25] ? parseInt(row[25]) || undefined : undefined,
    nuez: row[26] ? parseInt(row[26]) || undefined : undefined,
    cafe: row[27] ? parseInt(row[27]) || undefined : undefined,
    caramelo: row[28] ? parseInt(row[28]) || undefined : undefined,
    cuero: row[29] ? parseInt(row[29]) || undefined : undefined,
  };
}

function cataToRow(cata: Cata): (string | number)[] {
  return [
    cata.id,                                  // A [0]
    cata.fecha,                               // B [1]
    cata.lugar,                               // C [2]
    cata.fotoUrl ?? '',                       // D [3]
    cata.notas,                               // E [4]
    cata.calificacion,                        // F [5]
    cata.marca,                               // G [6]
    cata.nombre,                              // H [7]
    cata.vitola,                              // I [8]
    cata.cepo,                                // J [9]
    cata.paisOrigen,                          // K [10]
    cata.capa,                                // L [11]
    cata.puroId ?? '',                        // M [12]
    cata.usuarioId,                           // N [13]
    cata.createdAt,                           // O [14]
    (cata.fotosAdicionales ?? []).join(','),  // P [15]
    cata.cuerpo ?? '',                        // Q [16]
    cata.dulzor ?? '',                        // R [17]
    cata.especia ?? '',                       // S [18]
    cata.tierra ?? '',                        // T [19]
    cata.madera ?? '',                        // U [20]
    (cata.etiquetasAroma ?? []).join(','),    // V [21]
    cata.maridaje ?? '',                      // W [22]
    cata.tiro ?? '',                          // X [23]
    cata.quemado ?? '',                       // Y [24]
    cata.chocolate ?? '',                     // Z [25]
    cata.nuez ?? '',                          // AA [26]
    cata.cafe ?? '',                          // AB [27]
    cata.caramelo ?? '',                      // AC [28]
    cata.cuero ?? '',                         // AD [29]
  ];
}

export async function getCatas(): Promise<Cata[]> {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Catas!A2:AD',
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
    range: 'Catas!A1',
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS',
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
    range: `Catas!A${index + 2}:AD${index + 2}`,
    valueInputOption: 'RAW',
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
        range: `Inventario!A${index + 2}:AB${index + 2}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [puroToRow(updated)] },
      });
    })
  );
}
