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
      className="group flex flex-col rounded-2xl border border-border bg-surface overflow-hidden cursor-pointer
        shadow-[var(--shadow-card)]
        hover:shadow-[var(--shadow-card-hover)]
        hover:-translate-y-1
        hover:border-[#B8924A]/40
        transition-all duration-300 ease-out"
    >
      <div className="relative aspect-[3/4] bg-[#111111] overflow-hidden">
        {puro.fotoUrl ? (
          <Image
            src={puro.fotoUrl}
            alt={puro.nombre}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain group-hover:scale-[1.04] transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              viewBox="0 0 48 48"
              className="w-12 h-12 text-text-muted/30"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <rect x="4" y="20" width="40" height="8" rx="4" />
              <path d="M38 20c0-7-6-12-14-12" strokeLinecap="round" />
            </svg>
          </div>
        )}

        {puro.stock <= 3 && (
          <div className="absolute top-3 left-3">
            <span className="text-[10px] font-medium tracking-wider uppercase bg-[#1A1A1A]/90 text-amber-400 border border-amber-400/30 px-2 py-0.5 rounded-full">
              Últimas unidades
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1.5 p-4">
        <p className="text-[10px] text-[#B8924A] uppercase tracking-[0.15em] font-medium">
          {puro.marca}
        </p>

        <h3
          className="text-base leading-snug line-clamp-2 text-text"
          style={{ fontFamily: 'var(--font-serif)', fontWeight: 600 }}
        >
          {puro.nombre}
        </h3>

        <p className="text-[11px] text-text-muted font-light tracking-wide">
          {puro.vitola}
        </p>

        <div className="mt-3 pt-3 border-t border-border/60 flex items-end justify-between gap-2">
          <span
            className="text-xl font-semibold text-[#D4AA6A]"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            ${puro.precioVenta.toLocaleString('es-MX')}
          </span>
          <span className="text-[10px] text-text-muted tabular-nums">
            {puro.stock} uds.
          </span>
        </div>
      </div>
    </Link>
  );
}
