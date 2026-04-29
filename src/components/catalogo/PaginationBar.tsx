'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';

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
    <div
      className="flex items-center justify-between pt-8 mt-8"
      style={{ borderTop: '1px solid rgba(237,224,196,0.07)' }}
    >
      <p
        className="text-[10px] uppercase tracking-widest"
        style={{ fontFamily: 'var(--font-body)', color: 'rgba(237,224,196,0.2)' }}
      >
        {total} puros
      </p>
      <div className="flex items-center gap-4">
        <button
          disabled={page <= 1}
          onClick={() => goTo(page - 1)}
          className="text-[10px] uppercase tracking-widest cursor-pointer transition-colors duration-200 disabled:opacity-20 disabled:cursor-not-allowed"
          style={{ fontFamily: 'var(--font-body)', color: 'rgba(237,224,196,0.4)' }}
        >
          ← Anterior
        </button>
        <span
          className="text-[10px] tabular-nums"
          style={{ fontFamily: 'var(--font-body)', color: 'rgba(237,224,196,0.2)' }}
        >
          {page} / {pages}
        </span>
        <button
          disabled={page >= pages}
          onClick={() => goTo(page + 1)}
          className="text-[10px] uppercase tracking-widest cursor-pointer transition-colors duration-200 disabled:opacity-20 disabled:cursor-not-allowed"
          style={{ fontFamily: 'var(--font-body)', color: 'rgba(237,224,196,0.4)' }}
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
}
