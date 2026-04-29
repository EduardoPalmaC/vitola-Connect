export const dynamic = 'force-dynamic';

import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPuros } from '@/lib/sheets';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PuroDetailPage({ params }: PageProps) {
  const { id } = await params;
  const allPuros = await getPuros();
  const puro = allPuros.find((p) => p.id === id && p.estado === 'negocio' && p.stock > 0);

  if (!puro) notFound();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <Link
          href="/catalogo"
          className="inline-flex items-center gap-2 text-xs text-text-muted hover:text-[#D4AA6A] transition-colors duration-200 mb-10 tracking-wide uppercase"
        >
          <svg viewBox="0 0 16 16" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M10 3L5 8l5 5" />
          </svg>
          Volver al catálogo
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div
            className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#111111]
              shadow-[var(--shadow-card)]"
          >
            {puro.fotoUrl ? (
              <Image
                src={puro.fotoUrl}
                alt={puro.nombre}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  viewBox="0 0 48 48"
                  className="w-16 h-16 text-text-muted/20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <rect x="4" y="20" width="40" height="8" rx="4" />
                  <path d="M38 20c0-7-6-12-14-12" strokeLinecap="round" />
                </svg>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-6">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#B8924A] mb-2">
                {puro.marca}
              </p>
              <h1
                className="text-3xl sm:text-4xl text-text leading-tight"
                style={{ fontFamily: 'var(--font-serif)', fontWeight: 600 }}
              >
                {puro.nombre}
              </h1>
            </div>

            <div className="flex items-end gap-4">
              <span
                className="text-4xl font-semibold text-[#D4AA6A]"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                ${puro.precioVenta.toLocaleString('es-MX')}
              </span>
              <span
                className={`mb-1 text-[10px] font-medium px-2.5 py-1 rounded-full tracking-wide ${
                  puro.stock <= 3
                    ? 'bg-amber-400/10 text-amber-400 border border-amber-400/20'
                    : 'bg-[#B8924A]/10 text-[#D4AA6A] border border-[#B8924A]/20'
                }`}
              >
                {puro.stock} disponible{puro.stock !== 1 ? 's' : ''}
              </span>
            </div>

            <div className="h-px bg-border/40" />

            <div className="grid grid-cols-2 gap-4">
              <Field label="Vitola" value={puro.vitola} />
              <Field label="País de origen" value={puro.paisOrigen} />
              <Field label="Cepo" value={`${puro.ringGauge}`} />
              <Field label="Largo" value={`${puro.largo} mm`} />
              <Field label="Añejamiento" value={`${puro.tiempoAnejamiento} meses`} />
              <Field label="Fecha llegada" value={puro.fechaLlegada} />
            </div>

            {puro.notasCata && (
              <>
                <div className="h-px bg-border/40" />
                <div>
                  <p className="text-[10px] font-semibold text-[#B8924A] uppercase tracking-[0.18em] mb-3">
                    Notas de cata
                  </p>
                  <p
                    className="text-base text-text leading-relaxed"
                    style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}
                  >
                    {puro.notasCata}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 p-3 rounded-xl bg-surface border border-border/50">
      <p className="text-[9px] text-text-muted uppercase tracking-[0.18em]">{label}</p>
      <p className="text-sm font-medium text-text">{value}</p>
    </div>
  );
}
