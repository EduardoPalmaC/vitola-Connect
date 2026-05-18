import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { SignJWT, importPKCS8 } from 'jose';
import type { Puro, Venta, VentaConIndice, Cata, Cliente } from '@/types';

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_ID!;

let cachedToken: { value: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  const now = Date.now();
  if (cachedToken && cachedToken.expiresAt > now + 60_000) return cachedToken.value;

  const rawKey = (process.env.GOOGLE_PRIVATE_KEY ?? '')
    .replace(/^["']|["']$/g, '')
    .replace(/\\n/g, '\n');
  const privateKey = await importPKCS8(rawKey, 'RS256');
  const iat = Math.floor(now / 1000);

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

  const data = await res.json() as { access_token: string; expires_in: number };
  cachedToken = { value: data.access_token, expiresAt: now + data.expires_in * 1000 };
  return cachedToken.value;
}

async function getSheets() {
  const oauth2 = new OAuth2Client();
  oauth2.setCredentials({ access_token: await getAccessToken() });
  return google.sheets({ version: 'v4', auth: oauth2 });
}

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
  const sheets = await getSheets();
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
  const sheets = await getSheets();
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
  const sheets = await getSheets();
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
  const sheets = await getSheets();
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
  const sheets = await getSheets();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Ventas!A2:H',
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
      clienteNombre: row[6] && row[6] !== '#ERROR!' ? row[6] : undefined,
      clienteContacto: row[7] && row[7] !== '#ERROR!' ? row[7] : undefined,
    }));
}

export async function getVentasConIndice(): Promise<VentaConIndice[]> {
  const sheets = await getSheets();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Ventas!A2:H',
  });
  const rows = (response.data.values ?? []) as string[][];
  return rows
    .map((row, i) => ({ row, sheetRow: i + 2 }))
    .filter(({ row }) => row.length >= 6)
    .map(({ row, sheetRow }) => ({
      rowIndex: sheetRow,
      fecha: row[0]!,
      producto: row[1]!,
      cantidad: parseInt(row[2]!),
      precioUnitario: parseFloat(row[3]!),
      totalVenta: parseFloat(row[4]!),
      gananciaEstimada: parseFloat(row[5]!),
      clienteNombre: row[6] && row[6] !== '#ERROR!' ? row[6] : undefined,
      clienteContacto: row[7] && row[7] !== '#ERROR!' ? row[7] : undefined,
    }));
}

export async function updateVenta(rowIndex: number, data: Partial<Venta>): Promise<void> {
  const sheets = await getSheets();
  const ventas = await getVentasConIndice();
  const venta = ventas.find(v => v.rowIndex === rowIndex);
  if (!venta) throw new Error('Venta no encontrada');

  const updated = { ...venta, ...data };
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `Ventas!A${rowIndex}:H${rowIndex}`,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[
        updated.fecha,
        updated.producto,
        updated.cantidad,
        updated.precioUnitario,
        updated.totalVenta,
        updated.gananciaEstimada,
        updated.clienteNombre ?? '',
        updated.clienteContacto ?? '',
      ]],
    },
  });
}

export async function getClientes(): Promise<Cliente[]> {
  const ventas = await getVentas();
  const map = new Map<string, Cliente>();

  for (const v of ventas) {
    if (!v.clienteNombre) continue;
    const key = v.clienteNombre.toLowerCase().trim();
    if (!map.has(key)) {
      map.set(key, {
        nombre: v.clienteNombre,
        contacto: v.clienteContacto ?? '',
        totalPuros: 0,
        totalGastado: 0,
        ventas: [],
      });
    }
    const c = map.get(key)!;
    c.totalPuros += v.cantidad;
    c.totalGastado += v.totalVenta;
    c.ventas.push({ fecha: v.fecha, producto: v.producto, cantidad: v.cantidad, totalVenta: v.totalVenta });
  }

  return Array.from(map.values()).sort((a, b) => b.totalGastado - a.totalGastado);
}

export async function registrarVentaItems(
  items: { puro: Puro; cantidad: number }[],
  fechaOverride?: string,
  clienteNombre?: string,
  clienteContacto?: string,
): Promise<void> {
  const sheets = await getSheets();
  const fecha = fechaOverride
    ? new Date(`${fechaOverride}T12:00:00`).toLocaleDateString('es-MX')
    : new Date().toLocaleDateString('es-MX');
  const rows = items.map(({ puro, cantidad }) => {
    const costoUnitario = puro.precioBruto + puro.costoTransporte + puro.costoAlmacenamiento;
    const totalVenta = puro.precioVenta * cantidad;
    const gananciaEstimada = (puro.precioVenta - costoUnitario) * cantidad;
    return [fecha, `${puro.marca} ${puro.vitola}`, cantidad, puro.precioVenta, totalVenta, gananciaEstimada, clienteNombre ?? '', clienteContacto ?? ''];
  });

  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Ventas!A:H',
    valueInputOption: 'RAW',
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
    cata.id,
    cata.fecha,
    cata.lugar,
    cata.fotoUrl ?? '',
    cata.notas,
    cata.calificacion,
    cata.marca,
    cata.nombre,
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
    cata.tiro ?? '',
    cata.quemado ?? '',
    cata.chocolate ?? '',
    cata.nuez ?? '',
    cata.cafe ?? '',
    cata.caramelo ?? '',
    cata.cuero ?? '',
  ];
}

export async function getCatas(): Promise<Cata[]> {
  const sheets = await getSheets();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Catas!A2:AD',
  });
  const rows = (response.data.values ?? []) as string[][];
  return rows.filter((r) => r.length >= 5).map(rowToCata);
}

export async function createCata(cata: Omit<Cata, 'id' | 'createdAt'>): Promise<Cata> {
  const sheets = await getSheets();
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
  const sheets = await getSheets();
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
  const sheets = await getSheets();
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
  const sheets = await getSheets();
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
