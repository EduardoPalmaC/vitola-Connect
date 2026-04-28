import Link from 'next/link';
import PuroForm from '@/components/admin/PuroForm';

export default function NuevoPuroPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text">Nuevo puro</h1>
          <p className="text-sm text-text-muted mt-0.5">Agregar al inventario</p>
        </div>
        <Link
          href="/admin/inventario"
          className="text-sm text-text-muted hover:text-secondary transition-colors"
        >
          ← Inventario
        </Link>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <PuroForm mode="create" />
      </div>
    </div>
  );
}
