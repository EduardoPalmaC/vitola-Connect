import { getPuros } from '@/lib/sheets';
import type { Puro } from '@/types';

const HEADERS = [
  'id', 'nombre', 'marca', 'vitola', 'ringGauge', 'largo', 'paisOrigen',
  'precioBruto', 'costoTransporte', 'costoAlmacenamiento', 'precioVenta',
  'estado', 'fechaLlegada', 'tiempoAnejamiento', 'humedad', 'fechaRevisionHumedad',
  'fotoUrl', 'notasCata', 'createdAt', 'updatedAt',
];

function toCsv(puros: Puro[]): string {
  const escape = (v: string | number | undefined) => {
    const s = String(v ?? '');
    return s.includes(',') || s.includes('"') || s.includes('\n')
      ? `"${s.replace(/"/g, '""')}"`
      : s;
  };

  const rows = puros.map((p) =>
    [
      p.id, p.nombre, p.marca, p.vitola, p.ringGauge, p.largo, p.paisOrigen,
      p.precioBruto, p.costoTransporte, p.costoAlmacenamiento, p.precioVenta,
      p.estado, p.fechaLlegada, p.tiempoAnejamiento, p.humedad, p.fechaRevisionHumedad,
      p.fotoUrl ?? '', p.notasCata ?? '', p.createdAt, p.updatedAt,
    ]
      .map(escape)
      .join(','),
  );

  return [HEADERS.join(','), ...rows].join('\n');
}

export async function GET() {
  const puros = await getPuros();
  const csv = toCsv(puros);
  const filename = `vitola-inventario-${new Date().toISOString().slice(0, 10)}.csv`;

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}
