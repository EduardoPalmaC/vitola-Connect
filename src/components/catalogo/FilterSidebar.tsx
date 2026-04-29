'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback } from 'react';

interface FilterSidebarProps {
  marcas: string[];
  vitolas: string[];
  paises: string[];
  cepos: number[];
}

function FilterGroup({
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

  return (
    <div className="flex flex-col gap-2">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#B8924A]">
        {label}
      </p>
      <div className="flex flex-col gap-1">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => toggle(opt)}
            className={`text-left text-xs px-2 py-1.5 rounded-md transition-all duration-200 cursor-pointer ${
              current === opt
                ? 'bg-[#B8924A]/15 text-[#D4AA6A] font-medium'
                : 'text-text-muted hover:text-text hover:bg-surface-alt'
            }`}
          >
            {format ? format(opt) : opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function SearchInput() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const onChange = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set('search', value);
      } else {
        params.delete('search');
      }
      params.delete('page');
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  return (
    <input
      type="search"
      placeholder="Buscar puro..."
      defaultValue={searchParams.get('search') ?? ''}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-transparent border border-border rounded-lg px-3 py-2 text-xs text-text placeholder:text-text-muted/50 focus:outline-none focus:border-[#B8924A]/50 transition-colors duration-200"
    />
  );
}

export default function FilterSidebar({ marcas, vitolas, paises, cepos }: FilterSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const clearAll = () => router.push(pathname);
  const hasFilters = searchParams.toString().length > 0;

  return (
    <aside className="flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-text-muted">
          Filtros
        </p>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="text-[10px] text-text-muted/60 hover:text-[#B8924A] transition-colors duration-200 cursor-pointer"
          >
            Limpiar todo
          </button>
        )}
      </div>

      <SearchInput />

      <div className="w-full h-px bg-border/40" />

      {marcas.length > 0 && (
        <FilterGroup label="Marca" paramKey="marca" options={marcas} />
      )}

      {cepos.length > 0 && (
        <FilterGroup
          label="Cepo"
          paramKey="ringGauge"
          options={cepos.map(String)}
          format={(v) => `Cepo ${v}`}
        />
      )}

      {paises.length > 0 && (
        <FilterGroup label="País de origen" paramKey="paisOrigen" options={paises} />
      )}

      {vitolas.length > 0 && (
        <FilterGroup label="Vitola" paramKey="vitola" options={vitolas} />
      )}
    </aside>
  );
}
