'use client';

import { useRouter } from 'next/navigation';
import CataCard from '@/components/admin/CataCard';
import type { Cata } from '@/types';

export default function CataGrid({ catas }: { catas: Cata[] }) {
  const router = useRouter();

  function handleEdit(cata: Cata) {
    if (!cata?.id) {
      console.log('Error: Cata sin ID', cata);
      return;
    }
    router.push(`/admin/diario/${cata.id}`);
  }

  if (catas.length === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4">
      {catas.map((cata, idx) => (
        <CataCard
          key={cata.id ?? idx}
          cata={cata}
          idx={idx}
          onEdit={handleEdit}
        />
      ))}
    </div>
  );
}
