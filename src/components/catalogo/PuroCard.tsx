import Image from 'next/image';
import Link from 'next/link';
import type { PuroPublico } from '@/types/index';

const SHADES: string[] = ['#C4956A', '#B07F52', '#D4A574', '#A06840', '#BA8A5E'];

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
          <stop offset="0%" stopColor={shade} stopOpacity="0.7" />
          <stop offset="50%" stopColor={shade} stopOpacity="0.9" />
          <stop offset="100%" stopColor={shade} stopOpacity="0.6" />
        </linearGradient>
        <pattern id={grainId} width="3" height="3" patternUnits="userSpaceOnUse">
          <rect width="3" height="3" fill="transparent" />
          <line x1="0" y1="0" x2="0" y2="3" stroke="rgba(0,0,0,0.08)" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect x="28" y="10" width="24" height="240" rx="12" fill={`url(#${gradId})`} />
      <rect x="28" y="10" width="24" height="240" rx="12" fill={`url(#${grainId})`} />
      <rect x="26" y="180" width="28" height="28" fill="#3A2A1A" />
      <rect x="26" y="184" width="28" height="1" fill="#C4A472" />
      <rect x="26" y="203" width="28" height="1" fill="#C4A472" />
      <ellipse cx="40" cy="252" rx="12" ry="3" fill="rgba(0,0,0,0.15)" />
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
  const shade = SHADES[idx % SHADES.length] ?? '#C4956A';
  const [intero, deci] = puro.precioVenta.toFixed(2).split('.');

  return (
    <Link
      href={`/catalogo/${puro.id}`}
      className="group block relative"
      style={{
        borderRight: '1px solid #EDE8DE',
        borderBottom: '1px solid #EDE8DE',
        padding: '44px 36px 32px',
        background: '#FFFFFF',
        opacity: soldOut ? 0.5 : 1,
        transition: 'background 0.2s ease',
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
                width: '300px',
                height: '200px',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%) rotate(90deg)',
              }}
            >
              <Image
                src={puro.fotoUrl}
                alt={puro.nombre}
                fill
                sizes="300px"
                style={{ objectFit: 'contain', objectPosition: 'center' }}
              />
            </div>
          </div>
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
            Stock
          </div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '17px', color: '#2C1E1A' }}>
            {puro.stock || '—'}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '20px',
            fontWeight: 600,
            color: '#BA8A5E',
            letterSpacing: '-0.02em',
          }}
        >
          ${intero}
          <span style={{ fontSize: '12px' }}>.{deci}</span>
        </div>
        <div
          style={{
            fontFamily: 'var(--font-code)',
            fontSize: '10px',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: soldOut ? '#C05040' : low ? '#C47A3D' : '#9A8572',
          }}
        >
          {soldOut ? 'Agotado' : low ? `Quedan ${puro.stock}` : 'Disponible'}
        </div>
      </div>
    </Link>
  );
}
