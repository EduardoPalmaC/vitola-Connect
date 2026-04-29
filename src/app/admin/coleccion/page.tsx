export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import Link from 'next/link';
import { getPuros } from '@/lib/sheets';
import { filtrarPuros, paginar, getUniqueValues } from '@/lib/filters';
import type { FilterParams } from '@/types';
import ColeccionCard from '@/components/admin/ColeccionCard';
import FilterSidebar from '@/components/catalogo/FilterSidebar';
import PaginationBar from '@/components/catalogo/PaginationBar';

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function sp(val: string | string[] | undefined): string | undefined {
  return Array.isArray(val) ? val[0] : val;
}

export default async function ColeccionPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const filterParams: FilterParams = {
    marca: sp(params['marca']),
    vitola: sp(params['vitola']),
    paisOrigen: sp(params['paisOrigen']),
    search: sp(params['search']),
    ringGauge: params['ringGauge'] ? Number(params['ringGauge']) : undefined,
    tiempoAnejamientoMin: params['tiempoAnejamientoMin']
      ? Number(params['tiempoAnejamientoMin'])
      : undefined,
    page: params['page'] ? Number(params['page']) : 1,
  };

  const allPuros = await getPuros();
  const coleccionPuros = allPuros.filter((p) => p.estado === 'coleccion_personal');

  const filtered = filtrarPuros(coleccionPuros, filterParams);
  const { items, total, pages } = paginar(filtered, filterParams.page);

  const marcas = getUniqueValues(coleccionPuros, 'marca') as string[];
  const vitolas = getUniqueValues(coleccionPuros, 'vitola') as string[];
  const paises = getUniqueValues(coleccionPuros, 'paisOrigen') as string[];
  const cepos = getUniqueValues(coleccionPuros, 'ringGauge') as number[];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text">Mi Colección</h1>
          <p className="text-sm text-text-muted mt-0.5">{total} puros en colección personal</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/dashboard"
            className="text-sm text-text-muted hover:text-secondary transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/inventario"
            className="text-sm text-text-muted hover:text-secondary transition-colors"
          >
            Inventario
          </Link>
          <Link
            href="/admin/settings"
            className="text-sm text-text-muted hover:text-secondary transition-colors"
          >
            Configuración
          </Link>
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="text-sm text-text-muted hover:text-secondary transition-colors"
            >
              Salir
            </button>
          </form>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex gap-8">
          <div className="hidden lg:block w-56 shrink-0">
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
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-text-muted">
                <p className="text-lg">No se encontraron puros</p>
                <p className="text-sm mt-1">Intenta ajustar los filtros</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                  {items.map((puro) => (
                    <ColeccionCard key={puro.id} puro={puro} />
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
    </div>
  );
}
