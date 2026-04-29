'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';

export default function DeleteCataButton({ id }: { id: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm('¿Eliminar esta cata? Esta acción no se puede deshacer.')) return;
    setDeleting(true);
    try {
      await fetch(`/api/catas/${id}`, { method: 'DELETE' });
      router.push('/admin/diario');
      router.refresh();
    } catch {
      setDeleting(false);
    }
  }

  return (
    <Button type="button" variant="danger" size="sm" loading={deleting} onClick={handleDelete}>
      Eliminar
    </Button>
  );
}
