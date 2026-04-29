export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { getCatas } from '@/lib/sheets';
import CataCard from '@/components/admin/CataCard';

export default async function DiarioPage() {
  const catas = await getCatas();
  const sorted = [...catas].sort(
    (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime(),
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text">Mi Diario</h1>
          <p className="text-sm text-text-muted mt-0.5">{catas.length} catas registradas</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/dashboard"
            className="text-sm text-text-muted hover:text-secondary transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/catas/nuevo"
            className="inline-flex items-center px-4 py-2 rounded-lg bg-secondary text-background text-sm font-medium hover:opacity-90 transition-opacity"
          >
            + Nueva cata
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4 text-text-muted">
            <p className="text-lg">El diario está vacío</p>
            <Link
              href="/admin/catas/nuevo"
              className="text-sm text-secondary hover:underline"
            >
              Registrar primera cata →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
            {sorted.map((cata) => (
              <CataCard key={cata.id} cata={cata} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
