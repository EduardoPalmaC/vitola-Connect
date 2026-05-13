export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import { getCatas } from '@/lib/sheets';
import CataEditForm from '@/components/admin/CataEditForm';

export default async function EditarCataPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const catas = await getCatas();
  const cata = catas.find((c) => c.id === id);
  if (!cata) notFound();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-5">
        <h1 className="text-2xl font-heading font-bold text-text">Editar cata</h1>
        <p className="text-sm text-text-muted mt-0.5">
          {cata.marca} — {cata.vitola}
        </p>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <CataEditForm cata={cata} />
      </div>
    </div>
  );
}
