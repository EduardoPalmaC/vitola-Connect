import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPuros } from '@/lib/sheets';
import PuroForm from '@/components/admin/PuroForm';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditarPuroPage({ params }: PageProps) {
  const { id } = await params;
  const puros = await getPuros();
  const puro = puros.find((p) => p.id === id);

  if (!puro) notFound();

  const { id: _id, createdAt: _c, updatedAt: _u, ...initialData } = puro;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text">{puro.nombre}</h1>
          <p className="text-sm text-text-muted mt-0.5">{puro.marca} · Editar</p>
        </div>
        <Link
          href="/admin/inventario"
          className="text-sm text-text-muted hover:text-secondary transition-colors"
        >
          ← Inventario
        </Link>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <PuroForm mode="edit" id={id} initialData={initialData} />
      </div>
    </div>
  );
}
