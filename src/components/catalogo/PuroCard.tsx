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
      className="group relative block overflow-hidden rounded-xl cursor-pointer
        shadow-[var(--shadow-card)]
        hover:shadow-[var(--shadow-card-hover)]
        transition-all duration-500 ease-out"
    >
      {/* Image layer — landscape-first, object-cover fills any photo ratio */}
      <div className="relative aspect-[4/3] bg-[#0C0906]">
        {puro.fotoUrl ? (
          <Image
            src={puro.fotoUrl}
            alt={puro.nombre}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <svg viewBox="0 0 64 20" className="w-20 opacity-20" fill="none" stroke="#C9A84C" strokeWidth="1">
              <rect x="1" y="1" width="62" height="18" rx="9" />
              <line x1="12" y1="1" x2="12" y2="19" />
              <line x1="52" y1="1" x2="52" y2="19" />
            </svg>
          </div>
        )}

        {/* Gradient — always on, heavier at bottom for legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080604]/96 via-[#080604]/25 to-transparent" />

        {/* Low stock badge */}
        {puro.stock <= 3 && (
          <div className="absolute top-3 right-3">
            <span
              className="text-[9px] uppercase tracking-[0.18em] px-2 py-0.5 rounded-full"
              style={{
                background: 'rgba(201,168,76,0.12)',
                color: '#C9A84C',
                border: '1px solid rgba(201,168,76,0.3)',
                fontFamily: 'var(--font-body)',
              }}
            >
              Últimas
            </span>
          </div>
        )}

        {/* Text overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col gap-1">
          <p
            className="text-[9px] uppercase tracking-[0.22em]"
            style={{ color: '#C9A84C', fontFamily: 'var(--font-body)', fontWeight: 500 }}
          >
            {puro.marca}
          </p>

          <h3
            className="leading-tight line-clamp-2"
            style={{
              fontFamily: 'var(--font-serif)',
              fontWeight: 600,
              fontSize: '1.05rem',
              color: '#EDE0C4',
              letterSpacing: '0.01em',
            }}
          >
            {puro.nombre}
          </h3>

          <div className="flex items-end justify-between gap-2 mt-1.5">
            <span
              className="text-xs"
              style={{ color: 'rgba(237,224,196,0.45)', fontFamily: 'var(--font-body)', fontWeight: 300 }}
            >
              {puro.vitola}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-serif)',
                fontWeight: 600,
                fontSize: '1.1rem',
                color: '#E2C47A',
                letterSpacing: '0.02em',
              }}
            >
              ${puro.precioVenta.toLocaleString('es-MX')}
            </span>
          </div>
        </div>

        {/* Hover: inset gold ring */}
        <div
          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ boxShadow: 'inset 0 0 0 1px rgba(201,168,76,0.4)' }}
        />
      </div>
    </Link>
  );
}
