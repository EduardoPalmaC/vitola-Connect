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
    <div className="min-h-screen bg-background relative">
      <header className="border-b border-border/50 px-6 py-8 text-center">
        <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#B8924A] mb-3">
          Colección Premium
        </p>
        <h1
          className="text-4xl sm:text-5xl text-text"
          style={{ fontFamily: 'var(--font-serif)', fontWeight: 600 }}
        >
          Catálogo Vitola
        </h1>
        <p className="text-sm text-text-muted mt-2 font-light tracking-wide">
          Puros de colección, seleccionados con criterio
        </p>
        <div className="mt-5 flex items-center justify-center gap-3">
          <span className="h-px w-12 bg-[#B8924A]/40" />
          <span className="text-[#B8924A]/60">
            <svg viewBox="0 0 16 16" className="w-3 h-3" fill="currentColor">
              <circle cx="8" cy="8" r="3" />
            </svg>
          </span>
          <span className="h-px w-12 bg-[#B8924A]/40" />
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex gap-10">
          <div className="hidden lg:block w-52 shrink-0 pt-1">
            <Suspense>
              <FilterSidebar
                marcas={marcas}
                vitolas={vitolas}
                paises={paises}
                cepos={cepos}
              />
            </Suspense>
          </div>

          <div className="flex-1 min-w-0">
            {total > 0 && (
              <p className="text-xs text-text-muted mb-5">
                {total} {total === 1 ? 'puro encontrado' : 'puros encontrados'}
              </p>
            )}

            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 text-text-muted">
                <svg viewBox="0 0 48 48" className="w-10 h-10 mb-4 opacity-30" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="24" cy="24" r="20" />
                  <path d="M16 24h16M24 16v16" strokeLinecap="round" />
                </svg>
                <p className="text-base" style={{ fontFamily: 'var(--font-serif)' }}>
                  Sin resultados
                </p>
                <p className="text-sm mt-1 font-light">Ajusta los filtros para continuar</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-5">
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
        className="fixed bottom-4 right-4 p-2 rounded-md text-text opacity-10 hover:opacity-60 transition-opacity duration-300"
        aria-label="Admin"
      >
        <Lock size={14} />
      </Link>
    </div>
  );
}
