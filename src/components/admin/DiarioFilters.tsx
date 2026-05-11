'use client';

import { useState, useMemo } from 'react';
import CataGrid from '@/components/admin/CataGrid';
import type { Cata } from '@/types';

type SortOption = 'reciente' | 'antiguo' | 'mejor';

export default function DiarioFilters({ catas }: { catas: Cata[] }) {
  const [sort, setSort] = useState<SortOption>('reciente');
  const [pais, setPais] = useState<string>('');

  const paises = useMemo(() => {
    const set = new Set(catas.map((c) => c.paisOrigen).filter(Boolean));
    return Array.from(set).sort();
  }, [catas]);

  const filtered = useMemo(() => {
    let arr = [...catas];
    if (pais) arr = arr.filter((c) => c.paisOrigen === pais);
    if (sort === 'reciente') arr.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
    else if (sort === 'antiguo') arr.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
    else if (sort === 'mejor') arr.sort((a, b) => (b.calificacion ?? 0) - (a.calificacion ?? 0));
    return arr;
  }, [catas, sort, pais]);

  const selectStyle: React.CSSProperties = {
    fontFamily: 'var(--font-code)',
    fontSize: '10px',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    background: 'transparent',
    border: '1px solid #DDD5C5',
    color: '#2C1E1A',
    padding: '6px 28px 6px 10px',
    appearance: 'none',
    WebkitAppearance: 'none',
    cursor: 'pointer',
    outline: 'none',
    minWidth: '130px',
  };

  const activeStyle: React.CSSProperties = {
    ...selectStyle,
    borderColor: '#6B2737',
    color: '#6B2737',
  };

  return (
    <>
      <div
        style={{
          padding: '12px 64px',
          borderBottom: '1px solid #E2D9C8',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          background: '#F9F6F0',
        }}
        className="max-sm:px-6 max-sm:flex-wrap"
      >
        <span style={{
          fontFamily: 'var(--font-code)',
          fontSize: '9px',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: '#B0A090',
          marginRight: '4px',
        }}>
          Ordenar
        </span>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            style={sort !== 'reciente' ? activeStyle : selectStyle}
          >
            <option value="reciente">Más reciente</option>
            <option value="antiguo">Más antiguo</option>
            <option value="mejor">Mejor calificado</option>
          </select>
          <span style={{
            position: 'absolute',
            right: '9px',
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
            color: sort !== 'reciente' ? '#6B2737' : '#9B7840',
            fontSize: '8px',
          }}>▾</span>
        </div>

        <div style={{ width: '1px', height: '16px', background: '#DDD5C5' }} />

        <span style={{
          fontFamily: 'var(--font-code)',
          fontSize: '9px',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: '#B0A090',
          marginRight: '4px',
        }}>
          País
        </span>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <select
            value={pais}
            onChange={(e) => setPais(e.target.value)}
            style={pais ? activeStyle : selectStyle}
          >
            <option value="">Todos</option>
            {paises.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <span style={{
            position: 'absolute',
            right: '9px',
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
            color: pais ? '#6B2737' : '#9B7840',
            fontSize: '8px',
          }}>▾</span>
        </div>

        {(sort !== 'reciente' || pais) && (
          <button
            onClick={() => { setSort('reciente'); setPais(''); }}
            style={{
              fontFamily: 'var(--font-code)',
              fontSize: '9px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              background: 'none',
              border: 'none',
              color: '#6B2737',
              cursor: 'pointer',
              padding: '4px 0',
              marginLeft: '4px',
            }}
          >
            × Limpiar
          </button>
        )}

        <span style={{
          marginLeft: 'auto',
          fontFamily: 'var(--font-code)',
          fontSize: '9px',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: '#B0A090',
        }}>
          {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {filtered.length === 0 ? (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '120px 0',
        }}>
          <p style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.5rem',
            color: 'rgba(44,30,20,0.2)',
            fontStyle: 'italic',
          }}>
            Sin resultados
          </p>
        </div>
      ) : (
        <CataGrid catas={filtered} />
      )}
    </>
  );
}
