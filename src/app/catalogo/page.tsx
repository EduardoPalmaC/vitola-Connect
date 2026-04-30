export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import Link from 'next/link';
import { Lock } from 'lucide-react';
import { getPuros } from '@/lib/sheets';
import { filtrarPuros, paginar, getUniqueValues } from '@/lib/filters';
import type { FilterParams, PuroPublico } from '@/types';
import PuroCard from '@/components/catalogo/PuroCard';
import FilterToolbar from '@/components/catalogo/FilterToolbar';
import PaginationBar from '@/components/catalogo/PaginationBar';

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function sp(val: string | string[] | undefined): string | undefined {
  return Array.isArray(val) ? val[0] : val;
}

function formatDate(d: Date): string {
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yy = String(d.getFullYear()).slice(2);
  return `${dd}.${mm}.${yy}`;
}

export default async function CatalogoPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const filterParams: FilterParams = {
    marca: sp(params['marca']),
    vitola: sp(params['vitola']),
    paisOrigen: sp(params['paisOrigen']),
    search: sp(params['search']),
    precioMin: params['precioMin'] ? Number(params['precioMin']) : undefined,
    precioMax: params['precioMax'] ? Number(params['precioMax']) : undefined,
    ringGauge: params['ringGauge'] ? Number(params['ringGauge']) : undefined,
    tiempoAnejamientoMin: params['tiempoAnejamientoMin']
      ? Number(params['tiempoAnejamientoMin'])
      : undefined,
    page: params['page'] ? Number(params['page']) : 1,
  };

  const allPuros = await getPuros();
  const publicPuros = allPuros.filter((p) => p.estado === 'negocio' && p.stock > 0);

  const filtered = filtrarPuros(publicPuros, filterParams);
  const { items, total, pages } = paginar(filtered, filterParams.page);

  const publicItems: PuroPublico[] = items.map((p) => ({
    id: p.id,
    nombre: p.nombre,
    marca: p.marca,
    vitola: p.vitola,
    precioVenta: p.precioVenta,
    fotoUrl: p.fotoUrl,
    stock: p.stock,
    ringGauge: p.ringGauge,
    paisOrigen: p.paisOrigen,
  }));

  const marcas = getUniqueValues(publicPuros, 'marca') as string[];
  const vitolas = getUniqueValues(publicPuros, 'vitola') as string[];
  const paises = getUniqueValues(publicPuros, 'paisOrigen') as string[];
  const cepos = getUniqueValues(publicPuros, 'ringGauge') as number[];

  const today = formatDate(new Date());

  return (
    <div style={{ background: '#0e0c0a', color: '#e8dfd1', minHeight: '100vh' }}>
      {/* Hero */}
      <header
        style={{
          padding: '56px 64px 40px',
          borderBottom: '1px solid #2a241c',
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          alignItems: 'end',
          gap: '40px',
        }}
        className="max-sm:grid-cols-1 max-sm:px-6 max-sm:pt-10 max-sm:pb-8"
      >
        <div>
          <p
            style={{
              fontFamily: 'var(--font-code)',
              fontSize: '10px',
              letterSpacing: '0.32em',
              textTransform: 'uppercase',
              color: '#7a6f5e',
              marginBottom: '12px',
            }}
          >
            Boutique · Colección Premium
          </p>
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontWeight: 300,
              fontSize: 'clamp(3.5rem, 8vw, 5.25rem)',
              lineHeight: 0.9,
              letterSpacing: '-0.02em',
              color: '#e8dfd1',
              margin: 0,
            }}
          >
            Vitola
            <span style={{ fontStyle: 'italic', color: '#c9a961' }}>.</span>
          </h1>
        </div>
        <div
          style={{
            fontFamily: 'var(--font-code)',
            fontSize: '10px',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: '#7a6f5e',
            textAlign: 'right',
            lineHeight: 1.8,
          }}
          className="max-sm:text-left"
        >
          <div>{publicPuros.length} referencias activas</div>
          <div>Actualizado · {today}</div>
        </div>
      </header>

      {/* Filter toolbar */}
      <Suspense>
        <FilterToolbar marcas={marcas} vitolas={vitolas} paises={paises} cepos={cepos} />
      </Suspense>

      {/* Grid */}
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-40">
          <p
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '2rem',
              color: 'rgba(232,223,209,0.3)',
              fontStyle: 'italic',
              marginBottom: '8px',
            }}
          >
            Sin resultados
          </p>
          <p
            style={{
              fontFamily: 'var(--font-code)',
              fontSize: '10px',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'rgba(232,223,209,0.15)',
            }}
          >
            Ajusta los filtros
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {publicItems.map((puro, idx) => (
              <PuroCard key={puro.id} puro={puro} idx={idx} />
            ))}
          </div>
          <div className="px-6 sm:px-10 py-8">
            <Suspense>
              <PaginationBar page={filterParams.page ?? 1} pages={pages} total={total} />
            </Suspense>
          </div>
        </>
      )}

      <Link
        href="/admin/login"
        className="fixed bottom-5 right-5 p-2 transition-opacity duration-300"
        style={{ color: 'rgba(232,223,209,0.1)' }}
        aria-label="Admin"
      >
        <Lock size={13} />
      </Link>
    </div>
  );
}
