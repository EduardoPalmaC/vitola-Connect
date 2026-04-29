export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import Link from 'next/link';
import { Lock } from 'lucide-react';
import { getPuros } from '@/lib/sheets';
import { filtrarPuros, paginar, getUniqueValues } from '@/lib/filters';
import type { FilterParams, PuroPublico } from '@/types';
import PuroCard from '@/components/catalogo/PuroCard';
import FilterSidebar from '@/components/catalogo/FilterSidebar';
import PaginationBar from '@/components/catalogo/PaginationBar';

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function sp(val: string | string[] | undefined): string | undefined {
  return Array.isArray(val) ? val[0] : val;
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
  }));

  const marcas = getUniqueValues(publicPuros, 'marca') as string[];
  const vitolas = getUniqueValues(publicPuros, 'vitola') as string[];
  const paises = getUniqueValues(publicPuros, 'paisOrigen') as string[];
  const cepos = getUniqueValues(publicPuros, 'ringGauge') as number[];

  return (
    <div className="min-h-screen relative" style={{ background: '#0A0806' }}>
      {/* Editorial header */}
      <header className="px-6 pt-14 pb-10 text-center" style={{ borderBottom: '1px solid rgba(237,224,196,0.06)' }}>
        <p
          className="text-[9px] uppercase tracking-[0.4em] mb-4"
          style={{ fontFamily: 'var(--font-body)', fontWeight: 600, color: '#C9A84C', letterSpacing: '0.4em' }}
        >
          Boutique · Colección Premium
        </p>

        <h1
          className="leading-none"
          style={{
            fontFamily: 'var(--font-serif)',
            fontWeight: 600,
            fontSize: 'clamp(3rem, 8vw, 6rem)',
            color: '#EDE0C4',
            letterSpacing: '-0.01em',
          }}
        >
          Vitola
        </h1>

        <div className="flex items-center justify-center gap-4 mt-6">
          <span className="h-px w-16" style={{ background: 'rgba(201,168,76,0.3)' }} />
          <p
            className="text-[10px] uppercase tracking-[0.3em]"
            style={{ fontFamily: 'var(--font-body)', fontWeight: 300, color: 'rgba(237,224,196,0.35)' }}
          >
            {publicPuros.length} referencias
          </p>
          <span className="h-px w-16" style={{ background: 'rgba(201,168,76,0.3)' }} />
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10">
        <div className="flex gap-12">
          {/* Filter sidebar */}
          <div className="hidden lg:block w-44 shrink-0 pt-0.5">
            <Suspense>
              <FilterSidebar
                marcas={marcas}
                vitolas={vitolas}
                paises={paises}
                cepos={cepos}
              />
            </Suspense>
          </div>

          {/* Grid */}
          <div className="flex-1 min-w-0">
            {total > 0 && (
              <p
                className="text-[10px] uppercase tracking-widest mb-6"
                style={{ fontFamily: 'var(--font-body)', color: 'rgba(237,224,196,0.25)' }}
              >
                {total} {total === 1 ? 'puro' : 'puros'}
              </p>
            )}

            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-40">
                <p
                  className="text-2xl mb-2"
                  style={{ fontFamily: 'var(--font-serif)', color: 'rgba(237,224,196,0.3)', fontStyle: 'italic' }}
                >
                  Sin resultados
                </p>
                <p
                  className="text-xs uppercase tracking-widest"
                  style={{ fontFamily: 'var(--font-body)', color: 'rgba(237,224,196,0.15)' }}
                >
                  Ajusta los filtros
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {publicItems.map((puro) => (
                    <PuroCard key={puro.id} puro={puro} />
                  ))}
                </div>
                <Suspense>
                  <PaginationBar page={filterParams.page ?? 1} pages={pages} total={total} />
                </Suspense>
              </>
            )}
          </div>
        </div>
      </div>

      <Link
        href="/admin/login"
        className="fixed bottom-5 right-5 p-2 transition-opacity duration-300"
        style={{ color: 'rgba(237,224,196,0.1)' }}
        aria-label="Admin"
      >
        <Lock size={13} />
      </Link>
    </div>
  );
}
