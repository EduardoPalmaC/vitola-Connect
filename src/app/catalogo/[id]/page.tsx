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
  const puro = allPuros.find((p) => p.id === id && p.estado === 'negocio');

  if (!puro) notFound();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <Link
          href="/catalogo"
          className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-secondary transition-colors mb-6"
        >
          ← Volver al catálogo
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image */}
          <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-white">
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
              <div className="absolute inset-0 flex items-center justify-center text-6xl select-none text-text-muted">
                🚬
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col gap-5">
            <div>
              <p className="text-xs text-text-muted uppercase tracking-wider mb-1">{puro.marca}</p>
              <h1 className="text-2xl font-heading font-bold text-text">{puro.nombre}</h1>
            </div>

            <div className="text-3xl font-bold text-secondary">
              ${puro.precioVenta.toLocaleString('es-MX')}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Vitola" value={puro.vitola} />
              <Field label="País de origen" value={puro.paisOrigen} />
              <Field label="Ring Gauge" value={`${puro.ringGauge}`} />
              <Field label="Largo" value={`${puro.largo} mm`} />
              <Field label="Añejamiento" value={`${puro.tiempoAnejamiento} meses`} />
              <Field label="Fecha llegada" value={puro.fechaLlegada} />
            </div>

            {puro.notasCata && (
              <div>
                <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                  Notas de cata
                </p>
                <p className="text-sm text-text leading-relaxed">{puro.notasCata}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <p className="text-xs text-text-muted">{label}</p>
      <p className="text-sm font-medium text-text">{value}</p>
    </div>
  );
}
