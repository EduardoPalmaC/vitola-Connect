'use client';

import { createPortal } from 'react-dom';
import PuroCard from '@/components/catalogo/PuroCard';
import type { PuroPublico } from '@/types/index';
import { usePuros, LABEL, type Filters } from '@/hooks/usePuros';

interface Props {
  puros: PuroPublico[];
  marcas: string[];
  vitolas: string[];
  paises: string[];
  cepos: number[];
  fortalezas: string[];
}

export default function CatalogoGallery({ puros, marcas, vitolas, paises, cepos, fortalezas }: Props) {
  const { filters, openKey, dropdownPos, btnRefs, dropdownRef, handleToggle, set, clear, visible, hasActive, filterDefs } =
    usePuros({ puros, marcas, vitolas, paises, cepos, fortalezas });

  return (
    <>
      {/* Filter bar */}
      <div style={{ background: '#F2EDE4', borderBottom: '1px solid #E2D9C8' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'stretch',
            overflowX: 'auto',
            borderBottom: hasActive ? '1px solid #E2D9C8' : 'none',
          }}
        >
          <div
            style={{
              padding: '16px 24px',
              fontFamily: 'var(--font-code)',
              fontSize: '9px',
              letterSpacing: '0.32em',
              textTransform: 'uppercase',
              color: '#9A8572',
              display: 'flex',
              alignItems: 'center',
              whiteSpace: 'nowrap',
              borderRight: '1px solid #DDD5C5',
            }}
          >
            Filtrar
          </div>

          {filterDefs.map(({ key }) => {
            const active = !!filters[key];
            const isOpen = openKey === key;
            return (
              <button
                key={key}
                ref={(el) => { btnRefs.current[key] = el ?? undefined; }}
                type="button"
                onClick={() => handleToggle(key)}
                style={{
                  padding: '16px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '3px',
                  cursor: 'pointer',
                  background: active ? '#EDE5D5' : 'transparent',
                  border: 'none',
                  borderRight: '1px solid #DDD5C5',
                  outline: 'none',
                  minWidth: '130px',
                  textAlign: 'left',
                  transition: 'background 0.15s',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-code)',
                    fontSize: '12px',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: '#A0642A',
                    fontWeight: 900,
                  }}
                >
                  {LABEL[key]}
                </span>
                <span
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '12px',
                    fontFamily: 'var(--font-serif)',
                    fontSize: '15px',
                    color: active ? '#5C3D1E' : '#4A3728',
                  }}
                >
                  <span>{filters[key] || 'Todas'}</span>
                  <span
                    style={{
                      fontFamily: 'var(--font-code)',
                      fontSize: '10px',
                      color: active ? '#9B7840' : '#B0A090',
                      transform: isOpen ? 'scaleY(-1)' : 'none',
                      display: 'inline-block',
                      transition: 'transform 0.15s',
                    }}
                  >
                    ▾
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {hasActive && (
          <div
            style={{
              display: 'flex',
              gap: '8px',
              padding: '12px 24px',
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
                color: '#B0A090',
              }}
            >
              Activos
            </span>
            {Object.entries(filters)
              .filter(([, v]) => v)
              .map(([k, v]) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => set(k as keyof Filters, v)}
                  style={{
                    fontFamily: 'var(--font-code)',
                    fontSize: '10px',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: '#7A6040',
                    border: '1px solid #C4A472',
                    background: '#F5EDD8',
                    padding: '5px 10px 5px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                  }}
                >
                  <span style={{ opacity: 0.7 }}>{LABEL[k as keyof Filters]}:</span>
                  <span>{v}</span>
                  <span style={{ color: '#9B7840' }}>×</span>
                </button>
              ))}
            <button
              type="button"
              onClick={clear}
              style={{
                fontFamily: 'var(--font-code)',
                fontSize: '10px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#B0A090',
                cursor: 'pointer',
                marginLeft: '4px',
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

      {/* Dropdown — portal to body so overflow-x:auto doesn't clip it */}
      {openKey &&
        createPortal(
          <div
            ref={dropdownRef}
            style={{
              position: 'fixed',
              top: dropdownPos.top,
              left: dropdownPos.left,
              minWidth: dropdownPos.width,
              background: '#FFFDF8',
              border: '1px solid #E2D9C8',
              zIndex: 1000,
              maxHeight: '280px',
              overflowY: 'auto',
              boxShadow: '0 8px 24px rgba(44,30,20,0.12)',
            }}
          >
            <button
              type="button"
              onClick={() => set(openKey, '')}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                padding: '10px 16px',
                fontFamily: 'var(--font-code)',
                fontSize: '10px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: !filters[openKey] ? '#9B7840' : '#9A8572',
                background: !filters[openKey] ? '#F5EDD8' : 'transparent',
                border: 'none',
                borderBottom: '1px solid #EDE8DE',
                cursor: 'pointer',
              }}
            >
              Todas
            </button>
            {filterDefs
              .find((f) => f.key === openKey)
              ?.opts.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => set(openKey, opt)}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    padding: '10px 16px',
                    fontFamily: 'var(--font-code)',
                    fontSize: '10px',
                    letterSpacing: '0.2em',
                    color: filters[openKey] === opt ? '#9B7840' : '#4A3728',
                    background: filters[openKey] === opt ? '#F5EDD8' : 'transparent',
                    border: 'none',
                    borderBottom: '1px solid #EDE8DE',
                    cursor: 'pointer',
                    transition: 'background 0.1s',
                  }}
                >
                  {opt}
                </button>
              ))}
          </div>,
          document.body,
        )}

      {/* Grid */}
      {visible.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-40">
          <p
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '2rem',
              color: 'rgba(44,30,20,0.2)',
              fontStyle: 'italic',
              marginBottom: '8px',
            }}
          >
            Sin resultados
          </p>
          <p
            style={{
              fontFamily: 'var(--font-code)',
              fontSize: '10px',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'rgba(44,30,20,0.15)',
            }}
          >
            Ajusta los filtros
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((puro, idx) => (
            <PuroCard key={puro.id} puro={puro} idx={idx} />
          ))}
        </div>
      )}
    </>
  );
}
