'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback, useState, useRef, useEffect } from 'react';

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

function FilterCell({ label, paramKey, options, isOpen, onToggle, onClose }: FilterCellProps) {
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
      if (current === value || value === '') {
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

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={onToggle}
        style={{
          padding: '18px 28px',
          borderRight: '1px solid #1f1a14',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          cursor: 'pointer',
          background: 'transparent',
          border: 'none',
          outline: 'none',
          textAlign: 'left',
          minWidth: '130px',
          boxShadow: 'inset -1px 0 0 #1f1a14',
        }}
      >
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
          <span
            style={{
              fontFamily: 'var(--font-code)',
              fontSize: '10px',
              color: '#c9a961',
            }}
          >
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
            zIndex: 50,
            maxHeight: '280px',
            overflowY: 'auto',
          }}
        >
          <button
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

export default function FilterToolbar({ marcas, vitolas, paises, cepos }: FilterToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [openCell, setOpenCell] = useState<string | null>(null);

  const clearAll = () => router.push(pathname);

  const activeFilters: { label: string; key: string; value: string }[] = [];
  const filterDefs = [
    { label: 'Marca', key: 'marca' },
    { label: 'Cepo', key: 'ringGauge' },
    { label: 'País', key: 'paisOrigen' },
    { label: 'Vitola', key: 'vitola' },
  ];
  for (const { label, key } of filterDefs) {
    const v = searchParams.get(key);
    if (v) activeFilters.push({ label, key, value: v });
  }

  const removeFilter = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`);
  };

  const toggle = (key: string) => setOpenCell((prev) => (prev === key ? null : key));
  const close = () => setOpenCell(null);

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
            boxShadow: 'inset -1px 0 0 #1f1a14',
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
      </div>

      {activeFilters.length > 0 && (
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
          {activeFilters.map((f, i) => (
            <button
              key={i}
              onClick={() => removeFilter(f.key)}
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
            onClick={clearAll}
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
      )}
    </div>
  );
}
