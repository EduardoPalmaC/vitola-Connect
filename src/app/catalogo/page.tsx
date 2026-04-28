export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import { getPuros } from '@/lib/sheets';
import { filtrarPuros, paginar, getUniqueValues } from '@/lib/filters';
import type { FilterParams, Puro, PuroPublico } from '@/types';
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
    estado: sp(params['estado']) as FilterParams['estado'],
    precioMin: params['precioMin'] ? Number(params['precioMin']) : undefined,
    precioMax: params['precioMax'] ? Number(params['precioMax']) : undefined,
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
  const estados = getUniqueValues(publicPuros, 'estado') as Puro['estado'][];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-5">
        <h1 className="text-2xl font-heading font-bold text-text">Catálogo Vitola</h1>
        <p className="text-sm text-text-muted mt-0.5">Puros premium seleccionados</p>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex gap-8">
          <div className="hidden lg:block w-56 shrink-0">
            <Suspense>
              <FilterSidebar
                marcas={marcas}
                vitolas={vitolas}
                paises={paises}
                estados={estados}
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
    </div>
  );
}
