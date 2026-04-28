import Image from 'next/image';
import Link from 'next/link';
import type { Puro } from '@/types';
import Badge from '@/components/ui/Badge';
import { calcularMargen } from '@/lib/calculations';

interface PuroCardProps {
  puro: Puro;
}

const ESTADO_VARIANT: Record<Puro['estado'], 'success' | 'info'> = {
  negocio: 'success',
  coleccion_personal: 'info',
};

export default function PuroCard({ puro }: PuroCardProps) {
  const margen = calcularMargen(puro);

  return (
    <Link
      href={`/catalogo/${puro.id}`}
      className="group flex flex-col rounded-xl border border-border bg-surface overflow-hidden hover:border-secondary/60 transition-colors"
    >
      <div className="relative aspect-[3/4] bg-surface-alt overflow-hidden">
        {puro.fotoUrl ? (
          <Image
            src={puro.fotoUrl}
            alt={puro.nombre}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-text-muted text-4xl select-none">
            🚬
          </div>
        )}
        <div className="absolute top-2 right-2">
          <Badge variant={ESTADO_VARIANT[puro.estado] ?? 'default'}>
            {puro.estado.replace('_', ' ')}
          </Badge>
        </div>
      </div>

      <div className="flex flex-col gap-1 p-4">
        <p className="text-xs text-text-muted uppercase tracking-wide">{puro.marca}</p>
        <h3 className="font-semibold text-text leading-tight line-clamp-2">{puro.nombre}</h3>
        <p className="text-xs text-text-muted">{puro.vitola} · {puro.paisOrigen}</p>

        <div className="flex items-end justify-between mt-3">
          <span className="text-lg font-bold text-secondary">
            ${puro.precioVenta.toLocaleString('es-MX')}
          </span>
          {puro.estado === 'negocio' && (
            <span className="text-xs text-text-muted">{margen.toFixed(1)}% margen</span>
          )}
        </div>
      </div>
    </Link>
  );
}
