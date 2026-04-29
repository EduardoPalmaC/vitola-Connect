import Image from 'next/image';
import Link from 'next/link';
import type { Cata } from '@/types';

function Stars({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={`text-base ${s <= value ? 'text-secondary' : 'text-border'}`}>
          ★
        </span>
      ))}
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
