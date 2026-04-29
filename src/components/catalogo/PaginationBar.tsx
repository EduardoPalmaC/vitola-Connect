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
    <div className="flex items-center justify-between pt-8 mt-4 border-t border-border/40">
      <p className="text-xs text-text-muted">{total} puros encontrados</p>
      <div className="flex items-center gap-3">
        <button
          disabled={page <= 1}
          onClick={() => goTo(page - 1)}
          className="text-xs px-4 py-2 rounded-lg border border-border text-text-muted
            hover:border-[#B8924A]/50 hover:text-[#D4AA6A]
            disabled:opacity-30 disabled:cursor-not-allowed
            transition-all duration-200 cursor-pointer"
        >
          ← Anterior
        </button>
        <span className="text-xs text-text-muted tabular-nums min-w-[3rem] text-center">
          {page} / {pages}
        </span>
        <button
          disabled={page >= pages}
          onClick={() => goTo(page + 1)}
          className="text-xs px-4 py-2 rounded-lg border border-border text-text-muted
            hover:border-[#B8924A]/50 hover:text-[#D4AA6A]
            disabled:opacity-30 disabled:cursor-not-allowed
            transition-all duration-200 cursor-pointer"
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
}
