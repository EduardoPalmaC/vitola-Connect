'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CataCard from '@/components/admin/CataCard';
import type { Cata } from '@/types';

export default function CataGrid({ catas: initial }: { catas: Cata[] }) {
  const router = useRouter();
  const [catas, setCatas] = useState<Cata[]>(initial);

  function handleEdit(cata: Cata) {
    if (!cata?.id) {
      console.log('Error: Cata sin ID', cata);
      return;
    }
    router.push(`/admin/diario/${cata.id}`);
  }

  async function handleDelete(id: string) {
    if (!id) {
      console.log('Error: Intento de borrar cata sin ID');
      return;
    }
    setCatas((prev) => prev.filter((c) => c.id !== id));
    try {
      await fetch(`/api/catas/${id}`, { method: 'DELETE' });
      router.refresh();
    } catch {
      setCatas(initial);
    }
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
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}
