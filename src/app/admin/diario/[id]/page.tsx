import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getCatas } from '@/lib/sheets';
import DeleteCataButton from '@/components/admin/DeleteCataButton';

function Stars({ value }: { value: number }) {
  const stars = value / 20;
  return (
    <div className="flex items-center gap-3">
      <span className="text-4xl font-heading font-bold text-secondary leading-none">{value}</span>
      <div className="flex flex-col gap-1">
        <span className="text-xs text-text-muted uppercase tracking-wider">pts / 100</span>
        <div className="flex items-center gap-0.5">
          {[0, 1, 2, 3, 4].map((i) => {
            const fill = Math.min(1, Math.max(0, stars - i));
            return (
              <span key={i} style={{ position: 'relative', display: 'inline-block' }}>
                <span className="text-border text-xl">★</span>
                {fill > 0 && (
                  <span
                    style={{
                      position: 'absolute', left: 0, top: 0,
                      overflow: 'hidden', width: `${fill * 100}%`, whiteSpace: 'nowrap',
                    }}
                    className="text-secondary text-xl"
                  >
                    ★
                  </span>
                )}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col gap-0.5">
      <p className="text-xs text-text-muted uppercase tracking-wider">{label}</p>
      <p className="text-sm text-text font-medium">{value || '—'}</p>
    </div>
  );
}

export default async function CataDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const catas = await getCatas();
  const cata = catas.find((c) => c.id === id);
  if (!cata) notFound();

  const fechaFormateada = new Date(cata.fecha).toLocaleDateString('es-MX', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text">
            {cata.marca} — {cata.vitola}
          </h1>
          <p className="text-sm text-text-muted mt-0.5 capitalize">{fechaFormateada}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/diario"
            className="text-sm text-text-muted hover:text-secondary transition-colors"
          >
            ← Mi Diario
          </Link>
          <DeleteCataButton id={cata.id} />
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Foto */}
          {cata.fotoUrl && (
            <div className="relative w-full lg:w-72 shrink-0 aspect-[3/4] rounded-xl overflow-hidden border border-border bg-white">
              <Image
                src={cata.fotoUrl}
                alt={`${cata.marca} ${cata.vitola}`}
                fill
                className="object-contain"
              />
            </div>
          )}

          <div className="flex flex-col gap-6 flex-1">
            {/* Calificación */}
            <div className="flex flex-col gap-2">
              <p className="text-xs text-text-muted uppercase tracking-wider">Calificación</p>
              <Stars value={cata.calificacion} />
            </div>

            {/* Ficha técnica */}
            <div className="rounded-xl border border-border bg-surface p-5">
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-4">
                Ficha técnica
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <Field label="Marca" value={cata.marca} />
                <Field label="Vitola" value={cata.vitola} />
                <Field label="Cepo" value={cata.cepo} />
                <Field label="País de origen" value={cata.paisOrigen} />
                <Field label="Capa" value={cata.capa} />
              </div>
            </div>

            {/* Lugar y fecha */}
            <div className="rounded-xl border border-border bg-surface p-5">
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-4">
                Contexto
              </p>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Fecha" value={fechaFormateada} />
                <Field label="Lugar" value={cata.lugar} />
              </div>
            </div>

            {/* Notas */}
            {cata.notas && (
              <div className="rounded-xl border border-border bg-surface p-5">
                <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
                  Notas de cata
                </p>
                <p className="text-sm text-text leading-relaxed whitespace-pre-wrap">{cata.notas}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
