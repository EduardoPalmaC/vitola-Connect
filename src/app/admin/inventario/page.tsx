export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { getPuros } from '@/lib/sheets';
import InventarioTable from '@/components/admin/InventarioTable';

export default async function InventarioPage() {
  const puros = await getPuros();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text">Inventario</h1>
          <p className="text-sm text-text-muted mt-0.5">{puros.length} puros en total</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/dashboard"
            className="text-sm text-text-muted hover:text-secondary transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/inventario/nuevo"
            className="inline-flex items-center px-4 py-2 rounded-lg bg-secondary text-background text-sm font-medium hover:opacity-90 transition-opacity"
          >
            + Nuevo puro
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <InventarioTable puros={puros} />
      </div>
    </div>
  );
}
