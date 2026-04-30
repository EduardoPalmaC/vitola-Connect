import Image from 'next/image';
import Link from 'next/link';
import type { PuroPublico } from '@/types';

const SHADES: string[] = ['#a87a4a', '#946640', '#b88555', '#8a5a36', '#a06f44'];

function CigarSVG({ shade, id }: { shade: string; id: string | number }) {
  const gradId = `cig-${id}`;
  const grainId = `grain-${id}`;
  return (
    <svg
      viewBox="0 0 80 280"
      style={{ height: '100%', width: 'auto' }}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id={gradId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={shade} stopOpacity="0.85" />
          <stop offset="50%" stopColor={shade} stopOpacity="1" />
          <stop offset="100%" stopColor={shade} stopOpacity="0.7" />
        </linearGradient>
        <pattern id={grainId} width="3" height="3" patternUnits="userSpaceOnUse">
          <rect width="3" height="3" fill="transparent" />
          <line x1="0" y1="0" x2="0" y2="3" stroke="rgba(0,0,0,0.12)" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect x="28" y="10" width="24" height="240" rx="12" fill={`url(#${gradId})`} />
      <rect x="28" y="10" width="24" height="240" rx="12" fill={`url(#${grainId})`} />
      <rect x="26" y="180" width="28" height="28" fill="#1a1410" />
      <rect x="26" y="184" width="28" height="1" fill="#c9a961" />
      <rect x="26" y="203" width="28" height="1" fill="#c9a961" />
      <ellipse cx="40" cy="252" rx="12" ry="3" fill="rgba(0,0,0,0.5)" />
    </svg>
  );
}

interface PuroCardProps {
  puro: PuroPublico;
  idx: number;
}

export default function PuroCard({ puro, idx }: PuroCardProps) {
  const soldOut = puro.stock === 0;
  const low = puro.stock > 0 && puro.stock < 15;
  const shade = SHADES[idx % SHADES.length] ?? '#a87a4a';
  const [intero, deci] = puro.precioVenta.toFixed(2).split('.');

  return (
    <Link
      href={`/catalogo/${puro.id}`}
      className="group block relative"
      style={{
        borderRight: '1px solid #1f1a14',
        borderBottom: '1px solid #1f1a14',
        padding: '44px 36px 32px',
        background: '#0e0c0a',
        opacity: soldOut ? 0.45 : 1,
        transition: 'background 0.4s ease',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '36px',
          fontFamily: 'var(--font-code)',
          fontSize: '10px',
          letterSpacing: '0.2em',
          color: '#5a4f3e',
        }}
      >
        № {String(idx + 1).padStart(3, '0')}
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
            color: '#5a4f3e',
            textTransform: 'uppercase',
          }}
        >
          {puro.paisOrigen}
        </div>
      )}

      <div
        style={{
          height: '260px',
          margin: '24px 0 32px',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {puro.fotoUrl ? (
          <Image
            src={puro.fotoUrl}
            alt={puro.nombre}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
        ) : (
          <CigarSVG shade={shade} id={`${idx}-${puro.id ?? idx}`} />
        )}
      </div>

      <div
        style={{
          fontFamily: 'var(--font-code)',
          fontSize: '10px',
          letterSpacing: '0.32em',
          textTransform: 'uppercase',
          color: '#c9a961',
          marginBottom: '10px',
        }}
      >
        {puro.marca}
      </div>

      <h3
        style={{
          fontFamily: 'var(--font-serif)',
          fontWeight: 400,
          fontSize: '28px',
          lineHeight: 1.1,
          letterSpacing: '-0.01em',
          color: '#f0e8d8',
          margin: '0 0 24px',
          minHeight: '62px',
        }}
      >
        {puro.nombre}
      </h3>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '16px',
          paddingTop: '20px',
          borderTop: '1px solid #2a241c',
          marginBottom: '24px',
        }}
      >
        <div>
          <div
            style={{
              fontFamily: 'var(--font-code)',
              fontSize: '9px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#6a5f4e',
              marginBottom: '4px',
            }}
          >
            Vitola
          </div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '16px', color: '#e8dfd1' }}>
            {puro.vitola}
          </div>
        </div>
        <div>
          <div
            style={{
              fontFamily: 'var(--font-code)',
              fontSize: '9px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#6a5f4e',
              marginBottom: '4px',
            }}
          >
            Cepo
          </div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '16px', color: '#e8dfd1' }}>
            {puro.ringGauge ?? '—'}
          </div>
        </div>
        <div>
          <div
            style={{
              fontFamily: 'var(--font-code)',
              fontSize: '9px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#6a5f4e',
              marginBottom: '4px',
            }}
          >
            Stock
          </div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '16px', color: '#e8dfd1' }}>
            {puro.stock || '—'}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '32px',
            fontWeight: 300,
            color: '#c9a961',
            letterSpacing: '-0.01em',
          }}
        >
          ${intero}
          <span style={{ fontSize: '18px' }}>.{deci}</span>
        </div>
        <div
          style={{
            fontFamily: 'var(--font-code)',
            fontSize: '10px',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: soldOut ? '#8b3a2a' : low ? '#c47a3d' : '#7a6f5e',
          }}
        >
          {soldOut ? 'Agotado' : low ? `Quedan ${puro.stock}` : 'Disponible'}
        </div>
      </div>
    </Link>
  );
}
