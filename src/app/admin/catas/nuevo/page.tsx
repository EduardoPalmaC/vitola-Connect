import Link from 'next/link';
import { getPuros } from '@/lib/sheets';
import CataForm from '@/components/admin/CataForm';

export default async function NuevaCataPage() {
  const puros = await getPuros();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text">Nueva cata</h1>
          <p className="text-sm text-text-muted mt-0.5">Registrar en el diario</p>
        </div>
        <Link
          href="/admin/diario"
          className="text-sm text-text-muted hover:text-secondary transition-colors"
        >
          ← Mi Diario
        </Link>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <CataForm puros={puros} />
      </div>
    </div>
  );
}
