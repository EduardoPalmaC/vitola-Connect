export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import Link from 'next/link';
import { getPuros } from '@/lib/sheets';
import { filtrarPuros, paginar, getUniqueValues } from '@/lib/filters';
import type { FilterParams } from '@/types';
import ColeccionCard from '@/components/admin/ColeccionCard';
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
  const coleccionPuros = allPuros
    .filter((p) => p.estado === 'coleccion_personal')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const filtered = filtrarPuros(coleccionPuros, filterParams);
  const { items, total, pages } = paginar(filtered, filterParams.page);

  const today = formatDate(new Date());

  return (
    <div style={{ background: '#F9F6F0', color: '#2C1E1A', minHeight: '100vh' }}>
      <header
        style={{
          padding: '20px 64px 16px',
          borderBottom: '1px solid #E2D9C8',
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          alignItems: 'end',
          gap: '20px',
          background: '#F9F6F0',
        }}
        className="max-sm:grid-cols-1 max-sm:px-6 max-sm:pt-4 max-sm:pb-3"
      >
        <div>
          <p
            style={{
              fontFamily: 'var(--font-code)',
              fontSize: '10px',
              letterSpacing: '0.32em',
              textTransform: 'uppercase',
              color: '#B0A090',
              margin: '0 0 12px',
            }}
          >
            Admin · Colección Personal
          </p>
          <h1
            style={{
              margin: 0,
              fontFamily: 'var(--font-serif)',
              fontSize: '32px',
              fontWeight: 400,
              color: '#2C1E1A',
              lineHeight: 1,
            }}
          >
            Mi Colección
          </h1>
        </div>
        <div
          style={{
            fontFamily: 'var(--font-code)',
            fontSize: '10px',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: '#B0A090',
            textAlign: 'right',
            lineHeight: 1.8,
          }}
          className="max-sm:text-left"
        >
          <div>{total} puros · {today}</div>
          <div
            style={{
              display: 'flex',
              gap: '16px',
              justifyContent: 'flex-end',
              marginTop: '4px',
            }}
            className="max-sm:justify-start"
          >
            <Link
              href="/admin/dashboard"
              style={{ color: '#B0A090', textDecoration: 'none' }}
            >
              Dashboard
            </Link>
            <Link
              href="/admin/inventario"
              style={{ color: '#B0A090', textDecoration: 'none' }}
            >
              Inventario
            </Link>
            <Link
              href="/admin/diario"
              style={{ color: '#B0A090', textDecoration: 'none' }}
            >
              Diario
            </Link>
            <form action="/api/auth/logout" method="POST" style={{ display: 'inline' }}>
              <button
                type="submit"
                style={{
                  fontFamily: 'var(--font-code)',
                  fontSize: '10px',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: '#B0A090',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                Salir
              </button>
            </form>
          </div>
        </div>
      </header>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-40">
          <p
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '2rem',
              color: 'rgba(44,30,20,0.2)',
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
              color: 'rgba(44,30,20,0.15)',
            }}
          >
            No hay puros en la colección
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            {items.map((puro, idx) => (
              <ColeccionCard key={puro.id} puro={puro} idx={idx} />
            ))}
          </div>
          <Suspense>
            <div style={{ borderTop: '1px solid #E2D9C8' }}>
              <PaginationBar page={filterParams.page ?? 1} pages={pages} total={total} />
            </div>
          </Suspense>
        </>
      )}
    </div>
  );
}
