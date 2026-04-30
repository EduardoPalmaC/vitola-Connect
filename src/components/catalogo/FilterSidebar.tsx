'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback, useState } from 'react';

interface FilterSidebarProps {
  marcas: string[];
  vitolas: string[];
  paises: string[];
  cepos: number[];
}

function FilterSection({
  label,
  paramKey,
  options,
  format,
}: {
  label: string;
  paramKey: string;
  options: string[];
  format?: (v: string) => string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(true);
  const current = searchParams.get(paramKey) ?? '';

  const toggle = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (current === value) {
        params.delete(paramKey);
      } else {
        params.set(paramKey, value);
      }
      params.delete('page');
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams, current, paramKey],
  );

  if (options.length === 0) return null;

  return (
    <div className="flex flex-col">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between py-2.5 cursor-pointer"
      >
        <span
          className="text-[11px] uppercase tracking-[0.25em] transition-colors duration-200"
          style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 700,
            color: current ? '#C9A84C' : 'rgba(237,224,196,0.35)',
          }}
        >
          {label}{current && ' ·'}
        </span>
        <svg
          viewBox="0 0 12 12"
          className="w-2.5 h-2.5 transition-transform duration-200"
          style={{
            color: 'rgba(237,224,196,0.2)',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M2 4l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="flex flex-col mb-2">
          {options.map((opt) => {
            const active = current === opt;
            return (
              <button
                key={opt}
                onClick={() => toggle(opt)}
                className="flex items-center gap-2.5 py-1.5 text-left cursor-pointer transition-all duration-150"
              >
                <span
                  className="flex-shrink-0 w-1 h-1 rounded-full transition-all duration-200"
                  style={{
                    background: active ? '#C9A84C' : 'transparent',
                    border: active ? 'none' : '1px solid rgba(237,224,196,0.12)',
                  }}
                />
                <span
                  className="text-[13px] transition-colors duration-150"
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontWeight: active ? 600 : 400,
                    color: active ? '#C9A84C' : 'rgba(237,224,196,0.45)',
                    letterSpacing: '0.04em',
                  }}
                >
                  {format ? format(opt) : opt}
                </span>
              </button>
            );
          })}
        </div>
      )}

      <div className="h-px mb-1" style={{ background: 'rgba(237,224,196,0.05)' }} />
    </div>
  );
}

export default function FilterSidebar({ marcas, vitolas, paises, cepos }: FilterSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const clearAll = () => router.push(pathname);
  const hasFilters = !!searchParams.toString();

  const onSearch = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set('search', value);
      else params.delete('search');
      params.delete('page');
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  return (
    <aside className="flex flex-col w-full">
      <div className="flex items-center justify-between mb-5">
        <p
          className="text-[9px] uppercase tracking-[0.3em]"
          style={{ fontFamily: 'var(--font-body)', fontWeight: 600, color: 'rgba(237,224,196,0.2)' }}
        >
          Filtrar
        </p>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="text-[9px] uppercase tracking-widest cursor-pointer transition-colors duration-200"
            style={{ color: '#C9A84C', fontFamily: 'var(--font-body)' }}
          >
            Limpiar
          </button>
        )}
      </div>

      <input
        type="search"
        placeholder="Buscar..."
        defaultValue={searchParams.get('search') ?? ''}
        onChange={(e) => onSearch(e.target.value)}
        className="w-full bg-transparent text-[11px] py-2 mb-5 focus:outline-none placeholder:opacity-25 transition-colors duration-200"
        style={{
          fontFamily: 'var(--font-body)',
          color: '#EDE0C4',
          borderBottom: '1px solid rgba(237,224,196,0.1)',
          caretColor: '#C9A84C',
        }}
      />

      <FilterSection label="Marca" paramKey="marca" options={marcas} />
      <FilterSection label="Cepo" paramKey="ringGauge" options={cepos.map(String)} />
      <FilterSection label="País" paramKey="paisOrigen" options={paises} />
      <FilterSection label="Vitola" paramKey="vitola" options={vitolas} />
    </aside>
  );
}
