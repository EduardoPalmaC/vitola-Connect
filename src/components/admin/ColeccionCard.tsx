'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import type { Puro } from '@/types';

function formatAnejamiento(fechaLlegada: string): string {
  const llegada = new Date(fechaLlegada);
  const hoy = new Date();
  const totalMeses =
    (hoy.getFullYear() - llegada.getFullYear()) * 12 +
    (hoy.getMonth() - llegada.getMonth());
  if (totalMeses < 1) return 'Recién llegado';
  if (totalMeses < 12) return `${totalMeses} mes${totalMeses !== 1 ? 'es' : ''}`;
  const años = Math.floor(totalMeses / 12);
  const meses = totalMeses % 12;
  if (meses === 0) return `${años} año${años !== 1 ? 's' : ''}`;
  return `${años}a ${meses}m`;
}

function anejamientoColor(fechaLlegada: string): string {
  const llegada = new Date(fechaLlegada);
  const hoy = new Date();
  const meses =
    (hoy.getFullYear() - llegada.getFullYear()) * 12 +
    (hoy.getMonth() - llegada.getMonth());
  if (meses >= 24) return '#8B6F47';
  if (meses >= 12) return '#F59E0B';
  return '#9A8572';
}

interface ColeccionCardProps {
  puro: Puro;
}

export default function ColeccionCard({ puro }: ColeccionCardProps) {
  const [isLandscape, setIsLandscape] = useState(false);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setIsLandscape(img.naturalWidth > img.naturalHeight);
  };

  return (
    <Link
      href={`/admin/inventario/${puro.id}`}
      className="group block relative text-left w-full"
      style={{
        borderRight: '1px solid #EDE8DE',
        borderBottom: '1px solid #EDE8DE',
        padding: '44px 36px 32px',
        background: '#FFFFFF',
        transition: 'background 0.2s ease',
        cursor: 'pointer',
      }}
    >
      <style>{`
        a.group:hover { background: #FDFAF5 !important; }
      `}</style>

      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '36px',
          fontFamily: 'var(--font-code)',
          fontSize: '10px',
          letterSpacing: '0.2em',
          color: '#C8BFB0',
        }}
      >
        {puro.id}
      </div>

      {puro.paisOrigen && (
        <div
          style={{
            position: 'absolute',
            top: '20px',
            right: '36px',
            fontFamily: 'var(--font-code)',
            fontSize: '10px',
            letterSpacing: '0.2em',
            color: '#C8BFB0',
            textTransform: 'uppercase',
          }}
        >
          {puro.paisOrigen}
        </div>
      )}

      <div
        style={{
          height: '320px',
          margin: '8px 0 14px',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          background: '#F7F3EC',
          borderRadius: '4px',
        }}
      >
        {puro.fotoUrl ? (
          <div
            style={{
              width: '200px',
              height: '300px',
              position: 'relative',
              overflow: 'hidden',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                position: 'absolute',
                width: isLandscape ? '300px' : '200px',
                height: isLandscape ? '200px' : '300px',
                top: '50%',
                left: '50%',
                transform: isLandscape ? 'translate(-50%, -50%) rotate(90deg) scale(1.5)' : 'translate(-50%, -50%)',
              }}
            >
              <Image
                src={puro.fotoUrl}
                alt={puro.nombre}
                fill
                sizes="300px"
                onLoad={handleImageLoad}
                style={{ objectFit: 'contain', objectPosition: 'center' }}
              />
            </div>
          </div>
        ) : (
          <div style={{ fontSize: '48px' }}>🚬</div>
        )}
      </div>

      <div
        style={{
          fontFamily: 'var(--font-code)',
          fontSize: '10px',
          letterSpacing: '0.32em',
          textTransform: 'uppercase',
          color: '#9B7840',
          marginBottom: '6px',
        }}
      >
        {puro.marca}
      </div>

      <h3
        style={{
          fontFamily: 'var(--font-serif)',
          fontWeight: 400,
          fontSize: '26px',
          lineHeight: 1.15,
          letterSpacing: '-0.01em',
          color: '#2C1E1A',
          margin: '0',
        }}
      >
        {puro.nombre}
      </h3>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '10px',
          marginTop: '12px',
          paddingTop: '12px',
          borderTop: '1px solid #EDE8DE',
          marginBottom: '2px',
        }}
      >
        <div>
          <div
            style={{
              fontFamily: 'var(--font-code)',
              fontSize: '11px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#B0A090',
              marginBottom: '3px',
            }}
          >
            Vitola
          </div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '17px', color: '#2C1E1A' }}>
            {puro.vitola}
          </div>
        </div>
        <div>
          <div
            style={{
              fontFamily: 'var(--font-code)',
              fontSize: '11px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#B0A090',
              marginBottom: '3px',
            }}
          >
            Cepo
          </div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '17px', color: '#2C1E1A' }}>
            {puro.ringGauge ?? '—'}
          </div>
        </div>
        <div>
          <div
            style={{
              fontFamily: 'var(--font-code)',
              fontSize: '11px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#B0A090',
              marginBottom: '3px',
            }}
          >
            Anejamiento
          </div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '17px', color: '#2C1E1A' }}>
            {formatAnejamiento(puro.fechaLlegada)}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'baseline' }}>
        <span
          style={{
            fontFamily: 'var(--font-code)',
            fontSize: '10px',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: anejamientoColor(puro.fechaLlegada),
          }}
        >
          {formatAnejamiento(puro.fechaLlegada).toUpperCase()}
        </span>
      </div>
    </Link>
  );
}
