import Image from 'next/image';
import Link from 'next/link';
import type { Cata } from '@/types';

function Stars({ value }: { value: number }) {
  const stars = value / 20;
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-sm font-semibold text-secondary">{value} pts</span>
      <div className="flex items-center gap-0.5">
        {[0, 1, 2, 3, 4].map((i) => {
          const fill = Math.min(1, Math.max(0, stars - i));
          return (
            <span key={i} style={{ position: 'relative', display: 'inline-block' }}>
              <span className="text-border text-sm">★</span>
              {fill > 0 && (
                <span
                  style={{
                    position: 'absolute', left: 0, top: 0,
                    overflow: 'hidden', width: `${fill * 100}%`, whiteSpace: 'nowrap',
                  }}
                  className="text-secondary text-sm"
                >
                  ★
                </span>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default function CataCard({ cata }: { cata: Cata }) {
  return (
    <Link
      href={`/admin/diario/${cata.id}`}
      className="group flex flex-col rounded-xl border border-border bg-surface overflow-hidden hover:border-secondary/60 transition-colors"
    >
      <div className="relative aspect-[3/4] bg-white overflow-hidden">
        {cata.fotoUrl ? (
          <Image
            src={cata.fotoUrl}
            alt={`${cata.marca} ${cata.vitola}`}
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

      <div className="flex flex-col gap-2 p-4">
        <p className="text-xs text-text-muted uppercase tracking-wide">{cata.marca}</p>
        <h3 className="font-semibold text-text leading-tight line-clamp-1">{cata.vitola}</h3>
        <p className="text-xs text-text-muted">
          Cepo {cata.cepo}
          {cata.paisOrigen ? ` · ${cata.paisOrigen}` : ''}
        </p>
        <Stars value={cata.calificacion} />
        <p className="text-xs text-text-muted mt-1">
          {new Date(cata.fecha).toLocaleDateString('es-MX', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
          {cata.lugar ? ` · ${cata.lugar}` : ''}
        </p>
      </div>
    </Link>
  );
}
