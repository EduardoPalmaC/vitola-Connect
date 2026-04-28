import Image from 'next/image';
import Link from 'next/link';
import type { PuroPublico } from '@/types';

interface PuroCardProps {
  puro: PuroPublico;
}

export default function PuroCard({ puro }: PuroCardProps) {
  return (
    <Link
      href={`/catalogo/${puro.id}`}
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
        <p className="text-xs text-text-muted">{puro.vitola}</p>
        <div className="mt-3 flex items-end justify-between gap-2">
          <span className="text-lg font-bold text-secondary">
            ${puro.precioVenta.toLocaleString('es-MX')}
          </span>
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              puro.stock <= 3
                ? 'bg-amber-400/15 text-amber-400'
                : 'bg-secondary/10 text-secondary'
            }`}
          >
            {puro.stock} disponible{puro.stock !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </Link>
  );
}
