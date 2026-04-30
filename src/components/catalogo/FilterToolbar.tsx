'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback, useState, useRef, useEffect, Suspense } from 'react';

interface FilterToolbarProps {
  marcas: string[];
  vitolas: string[];
  paises: string[];
  cepos: number[];
}

interface FilterCellProps {
  label: string;
  paramKey: string;
  options: string[];
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

function FilterCellInner({ label, paramKey, options, isOpen, onToggle, onClose }: FilterCellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get(paramKey) ?? '';
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen, onClose]);

  const select = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === '' || current === value) {
        params.delete(paramKey);
      } else {
        params.set(paramKey, value);
      }
      params.delete('page');
      router.push(`${pathname}?${params.toString()}`);
      onClose();
    },
    [router, pathname, searchParams, current, paramKey, onClose],
  );

  const active = !!current;

  const cellStyle: React.CSSProperties = {
    padding: '18px 28px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    cursor: 'pointer',
    background: 'transparent',
    textAlign: 'left',
    minWidth: '130px',
    borderTop: 'none',
    borderLeft: 'none',
    borderBottom: 'none',
    borderRight: '1px solid #1f1a14',
    outline: 'none',
  };

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={onToggle} style={cellStyle} type="button">
        <span
          style={{
            fontFamily: 'var(--font-code)',
            fontSize: '9px',
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            color: '#5a4f3e',
          }}
        >
          {label}
        </span>
        <span
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
            fontFamily: 'var(--font-serif)',
            fontSize: '16px',
            color: active ? '#c9a961' : '#e8dfd1',
          }}
        >
          <span>{current || 'Todas'}</span>
          <span style={{ fontFamily: 'var(--font-code)', fontSize: '10px', color: '#c9a961' }}>
            ▾
          </span>
        </span>
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            background: '#0a0907',
            border: '1px solid #2a241c',
            minWidth: '160px',
            zIndex: 100,
            maxHeight: '280px',
            overflowY: 'auto',
          }}
        >
          <button
            type="button"
            onClick={() => select('')}
            style={{
              display: 'block',
              width: '100%',
              textAlign: 'left',
              padding: '10px 16px',
              fontFamily: 'var(--font-code)',
              fontSize: '10px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: !current ? '#c9a961' : '#7a6f5e',
              background: 'transparent',
              border: 'none',
              borderBottom: '1px solid #1f1a14',
              cursor: 'pointer',
            }}
          >
            Todas
          </button>
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => select(opt)}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                padding: '10px 16px',
                fontFamily: 'var(--font-code)',
                fontSize: '10px',
                letterSpacing: '0.2em',
                color: current === opt ? '#c9a961' : '#9a8d77',
                background: 'transparent',
                border: 'none',
                borderBottom: '1px solid #1f1a14',
                cursor: 'pointer',
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function FilterCell(props: FilterCellProps) {
  return (
    <Suspense fallback={<div style={{ padding: '18px 28px', minWidth: '130px', borderRight: '1px solid #1f1a14' }} />}>
      <FilterCellInner {...props} />
    </Suspense>
  );
}

function SearchInputInner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

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
    <input
      type="search"
      placeholder="Buscar..."
      defaultValue={searchParams.get('search') ?? ''}
      onChange={(e) => onSearch(e.target.value)}
      style={{
        padding: '0 20px',
        background: 'transparent',
        border: 'none',
        borderRight: '1px solid #1f1a14',
        outline: 'none',
        fontFamily: 'var(--font-code)',
        fontSize: '10px',
        letterSpacing: '0.2em',
        color: '#e8dfd1',
        caretColor: '#c9a961',
        minWidth: '160px',
      }}
    />
  );
}

function ActiveChipsInner({
  filterDefs,
  onRemove,
  onClearAll,
}: {
  filterDefs: { label: string; key: string }[];
  onRemove: (key: string) => void;
  onClearAll: () => void;
}) {
  const searchParams = useSearchParams();
  const active: { label: string; key: string; value: string }[] = [];
  for (const { label, key } of filterDefs) {
    const v = searchParams.get(key);
    if (v) active.push({ label, key, value: v });
  }
  if (active.length === 0) return null;
  return (
    <div
      style={{
        display: 'flex',
        gap: '10px',
        padding: '14px 28px',
        flexWrap: 'wrap',
        alignItems: 'center',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-code)',
          fontSize: '9px',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: '#5a4f3e',
        }}
      >
        Activos
      </span>
      {active.map((f) => (
        <button
          key={f.key}
          type="button"
          onClick={() => onRemove(f.key)}
          style={{
            fontFamily: 'var(--font-code)',
            fontSize: '10px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#c9a961',
            border: '1px solid #c9a961',
            padding: '5px 10px 5px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            background: 'transparent',
          }}
        >
          <span style={{ opacity: 0.7 }}>{f.label}:</span>
          <span>{f.value}</span>
          <span style={{ color: '#c9a961', opacity: 0.7 }}>×</span>
        </button>
      ))}
      <button
        type="button"
        onClick={onClearAll}
        style={{
          fontFamily: 'var(--font-code)',
          fontSize: '10px',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: '#7a6f5e',
          cursor: 'pointer',
          marginLeft: '8px',
          textDecoration: 'underline',
          textUnderlineOffset: '3px',
          background: 'transparent',
          border: 'none',
        }}
      >
        Limpiar todo
      </button>
    </div>
  );
}

export default function FilterToolbar({ marcas, vitolas, paises, cepos }: FilterToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [openCell, setOpenCell] = useState<string | null>(null);

  const clearAll = useCallback(() => router.push(pathname), [router, pathname]);

  const removeFilter = useCallback(
    (key: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete(key);
      params.delete('page');
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  const toggle = useCallback(
    (key: string) => setOpenCell((prev) => (prev === key ? null : key)),
    [],
  );
  const close = useCallback(() => setOpenCell(null), []);

  const filterDefs = [
    { label: 'Marca', key: 'marca' },
    { label: 'Cepo', key: 'ringGauge' },
    { label: 'País', key: 'paisOrigen' },
    { label: 'Vitola', key: 'vitola' },
  ];

  return (
    <div style={{ borderBottom: '1px solid #2a241c', background: '#0a0907' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'stretch',
          borderBottom: '1px solid #1f1a14',
          overflowX: 'auto',
        }}
      >
        <div
          style={{
            padding: '18px 28px',
            fontFamily: 'var(--font-code)',
            fontSize: '10px',
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            color: '#7a6f5e',
            display: 'flex',
            alignItems: 'center',
            background: '#0a0907',
            whiteSpace: 'nowrap',
            borderRight: '1px solid #1f1a14',
          }}
        >
          Filtrar
        </div>
        <FilterCell
          label="Marca"
          paramKey="marca"
          options={marcas}
          isOpen={openCell === 'marca'}
          onToggle={() => toggle('marca')}
          onClose={close}
        />
        <FilterCell
          label="Cepo"
          paramKey="ringGauge"
          options={cepos.map(String)}
          isOpen={openCell === 'ringGauge'}
          onToggle={() => toggle('ringGauge')}
          onClose={close}
        />
        <FilterCell
          label="Vitola"
          paramKey="vitola"
          options={vitolas}
          isOpen={openCell === 'vitola'}
          onToggle={() => toggle('vitola')}
          onClose={close}
        />
        <FilterCell
          label="País"
          paramKey="paisOrigen"
          options={paises}
          isOpen={openCell === 'paisOrigen'}
          onToggle={() => toggle('paisOrigen')}
          onClose={close}
        />
        <Suspense fallback={null}>
          <SearchInputInner />
        </Suspense>
      </div>

      <Suspense fallback={null}>
        <ActiveChipsInner filterDefs={filterDefs} onRemove={removeFilter} onClearAll={clearAll} />
      </Suspense>
    </div>
  );
}
