export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { getPuros } from '@/lib/sheets';
import InventarioTable from '@/components/admin/InventarioTable';
import MobileNav from '@/components/admin/MobileNav';

export default async function InventarioPage() {
  const puros = await getPuros();

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F9F6F0' }}>
      <MobileNav />
      <header
        className="px-4 sm:px-6 py-4 sm:py-5 flex flex-wrap items-center justify-between gap-2"
        style={{ borderBottom: '1px solid #E2D9C8', backgroundColor: '#F9F6F0' }}
      >
        <div>
          <h1
            className="font-bold"
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '24px',
              color: '#4A3728',
              letterSpacing: '-0.01em',
            }}
          >
            Inventario
          </h1>
          <p
            className="mt-0.5"
            style={{ fontSize: '12px', color: '#9A8572', fontFamily: 'var(--font-code)' }}
          >
            {puros.length} puros en total
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <Link
            href="/admin/dashboard"
            className="transition-colors hover:opacity-70 shrink-0"
            style={{ fontSize: '13px', color: '#9A8572', fontFamily: 'var(--font-code)' }}
          >
            Dashboard
          </Link>
          <Link
            href="/admin/ventas"
            className="transition-colors shrink-0"
            style={{ fontSize: '13px', color: '#9A8572', fontFamily: 'var(--font-code)' }}
          >
            Ventas
          </Link>
          <Link
            href="/admin/diario"
            className="transition-colors shrink-0"
            style={{ fontSize: '13px', color: '#9A8572', fontFamily: 'var(--font-code)' }}
          >
            Mi Diario
          </Link>
          <Link
            href="/admin/inventario/nuevo"
            className="inline-flex items-center transition-opacity hover:opacity-85 shrink-0"
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              backgroundColor: '#5C3D1E',
              color: '#F2EDE4',
              fontSize: '13px',
              fontFamily: 'var(--font-code)',
              fontWeight: 500,
              letterSpacing: '0.04em',
            }}
          >
            + Nuevo puro
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-24 sm:pb-8">
        <InventarioTable puros={puros} />
      </div>
    </div>
  );
}
