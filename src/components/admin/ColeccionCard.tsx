import Image from 'next/image';
import Link from 'next/link';
import type { Puro } from '@/types';

function formatAnejamiento(fechaLlegada: string): string {
  const llegada = new Date(fechaLlegada);
  const hoy = new Date();
  const totalMeses =
    (hoy.getFullYear() - llegada.getFullYear()) * 12 +
    (hoy.getMonth() - llegada.getMonth());
  if (totalMeses < 1) return 'Recién llegado';
  if (totalMeses < 12) return `${totalMeses} mes${totalMeses !== 1 ? 'es' : ''}`;
  const años = Math.floor(totalMeses / 12);
  const meses = totalMeses % 12;
  if (meses === 0) return `${años} año${años !== 1 ? 's' : ''}`;
  return `${años}a ${meses}m`;
}

function anejamientoColor(fechaLlegada: string): string {
  const llegada = new Date(fechaLlegada);
  const hoy = new Date();
  const meses =
    (hoy.getFullYear() - llegada.getFullYear()) * 12 +
    (hoy.getMonth() - llegada.getMonth());
  if (meses >= 24) return 'bg-secondary/20 text-secondary';
  if (meses >= 12) return 'bg-amber-400/15 text-amber-400';
  return 'bg-surface text-text-muted border border-border';
}

interface ColeccionCardProps {
  puro: Puro;
}

export default function ColeccionCard({ puro }: ColeccionCardProps) {
  return (
    <Link
      href={`/admin/inventario/${puro.id}`}
      className="group flex flex-col rounded-xl border border-border bg-surface overflow-hidden hover:border-secondary/60 transition-colors"
    >
      <div className="relative aspect-[3/4] bg-white overflow-hidden">
        {puro.fotoUrl ? (
          <Image
            src={puro.fotoUrl}
            alt={puro.nombre}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-contain group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-text-muted text-4xl select-none">
            🚬
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1 p-4">
        <p className="text-xs text-text-muted uppercase tracking-wide">{puro.marca}</p>
        <h3 className="font-semibold text-text leading-tight line-clamp-2">{puro.nombre}</h3>
        <p className="text-xs text-text-muted">
          {puro.vitola}
          {puro.ringGauge ? ` · Cepo ${puro.ringGauge}` : ''}
        </p>
        <div className="mt-3 flex items-end justify-between gap-2">
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${anejamientoColor(puro.fechaLlegada)}`}
          >
            {formatAnejamiento(puro.fechaLlegada)}
          </span>
          <span className="text-xs text-text-muted">{puro.paisOrigen}</span>
        </div>
      </div>
    </Link>
  );
}
