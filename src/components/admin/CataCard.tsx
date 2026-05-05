'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Cata } from '@/types';

const SHADES = ['#C4956A', '#B07F52', '#D4A574', '#A06840', '#BA8A5E'];

function Stars({ value }: { value: number }) {
  const stars = (value ?? 0) / 20;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <div style={{ display: 'flex', gap: '2px' }}>
        {[0, 1, 2, 3, 4].map((i) => {
          const fill = Math.min(1, Math.max(0, stars - i));
          return (
            <span key={i} style={{ position: 'relative', display: 'inline-block', fontSize: '14px', lineHeight: 1 }}>
              <span style={{ color: '#DDD5C5' }}>★</span>
              {fill > 0 && (
                <span style={{
                  position: 'absolute', left: 0, top: 0,
                  overflow: 'hidden', width: `${fill * 100}%`, whiteSpace: 'nowrap',
                  color: '#9B7840',
                }}>★</span>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function formatFecha(fecha: string | undefined): string {
  if (!fecha) return 'Fecha pendiente';
  const d = new Date(fecha);
  if (isNaN(d.getTime())) return 'Fecha pendiente';
  return d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });
}

interface Props {
  cata: Cata;
  idx?: number;
  onEdit?: (cata: Cata) => void;
}

export default function CataCard({ cata, idx = 0, onEdit }: Props) {
  const router = useRouter();
  const [isLandscape, setIsLandscape] = useState(false);
  const shade = SHADES[idx % SHADES.length] ?? '#C4956A';
  const fechaCorta = formatFecha(cata?.fecha);

  function handleClick() {
    if (onEdit) {
      onEdit(cata);
    } else {
      router.push(`/admin/diario/${cata?.id}`);
    }
  }

  return (
    <div
      onClick={handleClick}
      style={{
        display: 'block',
        borderRight: '1px solid #EDE8DE',
        borderBottom: '1px solid #EDE8DE',
        padding: '36px 28px 24px',
        background: '#FFFFFF',
        transition: 'background 0.2s ease',
        position: 'relative',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = '#FDFAF5'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = '#FFFFFF'; }}
    >
      {/* Index */}
      <div style={{
        position: 'absolute',
        top: '18px',
        left: '28px',
        fontFamily: 'var(--font-code)',
        fontSize: '10px',
        letterSpacing: '0.2em',
        color: '#C8BFB0',
        pointerEvents: 'none',
      }}>
        № {String((idx ?? 0) + 1).padStart(3, '0')}
      </div>

      {/* Date */}
      <div style={{
        position: 'absolute',
        top: '18px',
        right: '28px',
        fontFamily: 'var(--font-code)',
        fontSize: '10px',
        letterSpacing: '0.16em',
        color: '#C8BFB0',
        textTransform: 'uppercase',
        pointerEvents: 'none',
      }}>
        {fechaCorta}
      </div>

      {/* Image */}
      <div
        className="relative aspect-[2/3] overflow-hidden my-5 rounded"
        style={{ background: '#F7F3EC', pointerEvents: 'none' }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          {cata?.fotoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={cata.fotoUrl}
              alt={`${cata?.marca ?? ''} ${cata?.vitola ?? ''}`}
              className={`max-w-full max-h-full object-contain transition-transform duration-300 ${isLandscape ? 'rotate-90 scale-[1.35]' : ''}`}
              onLoad={(e) => setIsLandscape(e.currentTarget.naturalWidth > e.currentTarget.naturalHeight)}
            />
          ) : (
            <div style={{
              width: '100%',
              height: '100%',
              background: '#F0ECE6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-code)',
              fontSize: '10px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#C8BFB0',
            }}>
              Sin imagen
            </div>
          )}
        </div>
      </div>

      {/* Marca */}
      <h3 style={{
        fontFamily: 'var(--font-serif)',
        fontWeight: 400,
        fontSize: '26px',
        lineHeight: 1.1,
        letterSpacing: '-0.015em',
        color: '#2C1E1A',
        margin: '0 0 6px',
        pointerEvents: 'none',
      }}>
        {cata?.marca ?? 'Sin marca'}
      </h3>

      {/* Vitola */}
      <div style={{
        fontFamily: 'var(--font-code)',
        fontSize: '10px',
        letterSpacing: '0.24em',
        textTransform: 'uppercase',
        color: '#B0A090',
        marginBottom: '12px',
        pointerEvents: 'none',
      }}>
        {cata?.vitola ?? '—'}
      </div>

      {/* Details */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '8px 10px',
        paddingTop: '12px',
        borderTop: '1px solid #EDE8DE',
        marginBottom: '14px',
        pointerEvents: 'none',
      }}>
        <div>
          <div style={{
            fontFamily: 'var(--font-code)',
            fontSize: '10px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#B0A090',
            marginBottom: '2px',
          }}>Cepo</div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '16px', color: '#2C1E1A' }}>
            {cata?.cepo ?? 0}
          </div>
        </div>
        <div>
          <div style={{
            fontFamily: 'var(--font-code)',
            fontSize: '10px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#B0A090',
            marginBottom: '2px',
          }}>Origen</div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '16px', color: '#2C1E1A' }}>
            {cata?.paisOrigen ?? '—'}
          </div>
        </div>
      </div>

      {/* Score */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', pointerEvents: 'none' }}>
        <div style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '28px',
          fontWeight: 400,
          color: '#9B7840',
          letterSpacing: '-0.02em',
          lineHeight: 1,
          flexShrink: 0,
        }}>
          {cata?.calificacion ?? 0}
          <span style={{
            fontFamily: 'var(--font-code)',
            fontSize: '10px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#B0A090',
            marginLeft: '4px',
          }}>pts</span>
        </div>
        <Stars value={cata?.calificacion ?? 0} />
      </div>

      {cata?.lugar && (
        <div style={{
          marginTop: '10px',
          fontFamily: 'var(--font-code)',
          fontSize: '10px',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: '#B0A090',
          pointerEvents: 'none',
        }}>
          {cata.lugar}
        </div>
      )}
    </div>
  );
}
