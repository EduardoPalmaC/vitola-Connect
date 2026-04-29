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
    <div className="min-h-screen" style={{ background: '#0A0806' }}>
      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-10">
        <Link
          href="/catalogo"
          className="inline-flex items-center gap-2 mb-12 transition-colors duration-200"
          style={{ fontFamily: 'var(--font-body)', fontSize: '9px', letterSpacing: '0.25em', color: 'rgba(237,224,196,0.3)', textTransform: 'uppercase' }}
        >
          <svg viewBox="0 0 12 12" className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M8 2L4 6l4 4" />
          </svg>
          Catálogo
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-14">
          {/* Image */}
          <div
            className="relative aspect-[4/3] rounded-xl overflow-hidden"
            style={{ background: '#0C0906', boxShadow: 'var(--shadow-card)' }}
          >
            {puro.fotoUrl ? (
              <Image
                src={puro.fotoUrl}
                alt={puro.nombre}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <svg viewBox="0 0 64 20" className="w-24 opacity-15" fill="none" stroke="#C9A84C" strokeWidth="1">
                  <rect x="1" y="1" width="62" height="18" rx="9" />
                  <line x1="12" y1="1" x2="12" y2="19" />
                  <line x1="52" y1="1" x2="52" y2="19" />
                </svg>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col gap-7">
            <div>
              <p
                className="text-[9px] uppercase tracking-[0.3em] mb-3"
                style={{ fontFamily: 'var(--font-body)', fontWeight: 600, color: '#C9A84C' }}
              >
                {puro.marca}
              </p>
              <h1
                className="leading-tight"
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontWeight: 600,
                  fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
                  color: '#EDE0C4',
                  letterSpacing: '-0.01em',
                }}
              >
                {puro.nombre}
              </h1>
            </div>

            <div className="flex items-baseline gap-4">
              <span
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontWeight: 600,
                  fontSize: '2.4rem',
                  color: '#E2C47A',
                  letterSpacing: '0.01em',
                }}
              >
                ${puro.precioVenta.toLocaleString('es-MX')}
              </span>
              <span
                className="text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-full"
                style={{
                  fontFamily: 'var(--font-body)',
                  background: puro.stock <= 3 ? 'rgba(201,168,76,0.1)' : 'rgba(237,224,196,0.06)',
                  color: puro.stock <= 3 ? '#C9A84C' : 'rgba(237,224,196,0.4)',
                  border: puro.stock <= 3 ? '1px solid rgba(201,168,76,0.25)' : '1px solid rgba(237,224,196,0.08)',
                }}
              >
                {puro.stock} disponible{puro.stock !== 1 ? 's' : ''}
              </span>
            </div>

            <div className="h-px" style={{ background: 'rgba(237,224,196,0.07)' }} />

            <div className="grid grid-cols-2 gap-3">
              <Field label="Vitola" value={puro.vitola} />
              <Field label="País de origen" value={puro.paisOrigen} />
              <Field label="Cepo" value={`${puro.ringGauge}`} />
              <Field label="Largo" value={`${puro.largo} mm`} />
              <Field label="Añejamiento" value={`${puro.tiempoAnejamiento} meses`} />
              <Field label="Fecha llegada" value={puro.fechaLlegada} />
            </div>

            {puro.notasCata && (
              <>
                <div className="h-px" style={{ background: 'rgba(237,224,196,0.07)' }} />
                <div>
                  <p
                    className="text-[9px] uppercase tracking-[0.25em] mb-3"
                    style={{ fontFamily: 'var(--font-body)', fontWeight: 600, color: '#C9A84C' }}
                  >
                    Notas de cata
                  </p>
                  <p
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.05rem',
                      fontStyle: 'italic',
                      color: 'rgba(237,224,196,0.7)',
                      lineHeight: 1.7,
                    }}
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
    <div className="flex flex-col gap-1.5 py-3 px-0" style={{ borderBottom: '1px solid rgba(237,224,196,0.07)' }}>
      <p
        className="text-[9px] uppercase tracking-[0.2em]"
        style={{ fontFamily: 'var(--font-body)', fontWeight: 500, color: 'rgba(237,224,196,0.3)' }}
      >
        {label}
      </p>
      <p
        className="text-sm"
        style={{ fontFamily: 'var(--font-body)', fontWeight: 400, color: 'rgba(237,224,196,0.8)', letterSpacing: '0.02em' }}
      >
        {value}
      </p>
    </div>
  );
}
