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
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '24px 48px',
        borderTop: '1px solid #E2D9C8',
        background: '#F9F6F0',
      }}
      className="max-sm:px-6"
    >
      <p
        style={{
          fontFamily: 'var(--font-code)',
          fontSize: '11px',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: '#B0A090',
        }}
      >
        {total} puros · pág. {page} de {pages}
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          disabled={page <= 1}
          onClick={() => goTo(page - 1)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '10px 20px',
            border: '1px solid #C8B99A',
            borderRadius: '6px',
            background: page <= 1 ? '#F0EBE3' : '#FFFFFF',
            color: page <= 1 ? '#C8B99A' : '#2C1E1A',
            fontFamily: 'var(--font-code)',
            fontSize: '11px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            cursor: page <= 1 ? 'not-allowed' : 'pointer',
            transition: 'all 150ms',
          }}
          onMouseEnter={(e) => {
            if (page > 1) (e.currentTarget as HTMLButtonElement).style.background = '#F5F0E8';
          }}
          onMouseLeave={(e) => {
            if (page > 1) (e.currentTarget as HTMLButtonElement).style.background = '#FFFFFF';
          }}
        >
          ← Anterior
        </button>

        <div style={{ display: 'flex', gap: '4px' }}>
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => goTo(p)}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '6px',
                border: p === page ? '1px solid #2C1E1A' : '1px solid #E2D9C8',
                background: p === page ? '#2C1E1A' : '#FFFFFF',
                color: p === page ? '#F0E6D2' : '#2C1E1A',
                fontFamily: 'var(--font-code)',
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'all 150ms',
              }}
              onMouseEnter={(e) => {
                if (p !== page) (e.currentTarget as HTMLButtonElement).style.background = '#F5F0E8';
              }}
              onMouseLeave={(e) => {
                if (p !== page) (e.currentTarget as HTMLButtonElement).style.background = '#FFFFFF';
              }}
            >
              {p}
            </button>
          ))}
        </div>

        <button
          disabled={page >= pages}
          onClick={() => goTo(page + 1)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '10px 20px',
            border: '1px solid #C8B99A',
            borderRadius: '6px',
            background: page >= pages ? '#F0EBE3' : '#FFFFFF',
            color: page >= pages ? '#C8B99A' : '#2C1E1A',
            fontFamily: 'var(--font-code)',
            fontSize: '11px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            cursor: page >= pages ? 'not-allowed' : 'pointer',
            transition: 'all 150ms',
          }}
          onMouseEnter={(e) => {
            if (page < pages) (e.currentTarget as HTMLButtonElement).style.background = '#F5F0E8';
          }}
          onMouseLeave={(e) => {
            if (page < pages) (e.currentTarget as HTMLButtonElement).style.background = '#FFFFFF';
          }}
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
}
