export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import { getCatas } from '@/lib/sheets';
import CataDetailView from '@/components/admin/CataDetailView';

export default async function CataDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const catas = await getCatas();
  const cata = catas.find((c) => c.id === id);
  if (!cata) notFound();

  return <CataDetailView cata={cata} />;
}
