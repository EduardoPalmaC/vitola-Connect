'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Button from '@/components/ui/Button';

interface PaginationBarProps {
  page: number;
  pages: number;
  total: number;
}

export default function PaginationBar({ page, pages, total }: PaginationBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const goTo = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(p));
    router.push(`${pathname}?${params.toString()}`);
  };

  if (pages <= 1) return null;

  return (
    <div className="flex items-center justify-between py-4">
      <p className="text-sm text-text-muted">{total} puros encontrados</p>
      <div className="flex items-center gap-2">
        <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => goTo(page - 1)}>
          ← Anterior
        </Button>
        <span className="text-sm text-text-muted px-2">
          {page} / {pages}
        </span>
        <Button variant="secondary" size="sm" disabled={page >= pages} onClick={() => goTo(page + 1)}>
          Siguiente →
        </Button>
      </div>
    </div>
  );
}
