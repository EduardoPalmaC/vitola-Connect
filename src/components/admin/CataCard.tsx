import Image from 'next/image';
import Link from 'next/link';
import type { Cata } from '@/types';

const SHADES = ['#C4956A', '#B07F52', '#D4A574', '#A06840', '#BA8A5E'];

function CigarSVG({ shade, id }: { shade: string; id: string }) {
  const gradId = `cig-${id}`;
  const grainId = `grain-${id}`;
  return (
    <svg viewBox="0 0 80 280" style={{ height: '100%', width: 'auto' }} preserveAspectRatio="xMidYMid meet">
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

export default function CataCard({ cata, idx = 0 }: { cata: Cata; idx?: number }) {
  const shade = SHADES[idx % SHADES.length] ?? '#C4956A';
  const scoreNorm = cata.calificacion / 100;

  const fechaCorta = new Date(cata.fecha).toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <Link
      href={`/admin/diario/${cata.id}`}
      className="group"
      style={{
        display: 'block',
        borderRight: '1px solid #EDE8DE',
        borderBottom: '1px solid #EDE8DE',
        padding: '36px 28px 24px',
        background: '#FFFFFF',
        transition: 'background 0.2s ease',
        textDecoration: 'none',
        position: 'relative',
      }}
    >
      <style>{`.group:hover { background: #FDFAF5 !important; }`}</style>

      {/* Index */}
      <div style={{
        position: 'absolute',
        top: '18px',
        left: '28px',
        fontFamily: 'var(--font-code)',
        fontSize: '10px',
        letterSpacing: '0.2em',
        color: '#C8BFB0',
      }}>
        № {String(idx + 1).padStart(3, '0')}
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
      }}>
        {fechaCorta}
      </div>

      {/* Image */}
      <div style={{
        height: '260px',
        margin: '20px 0 16px',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: '#F7F3EC',
        borderRadius: '4px',
      }}>
        {cata.fotoUrl ? (
          <Image
            src={cata.fotoUrl}
            alt={`${cata.marca} ${cata.vitola}`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 25vw"
            style={{ objectFit: 'contain' }}
          />
        ) : (
          <CigarSVG shade={shade} id={cata.id} />
        )}
      </div>

      {/* Marca */}
      <div style={{
        fontFamily: 'var(--font-code)',
        fontSize: '10px',
        letterSpacing: '0.32em',
        textTransform: 'uppercase',
        color: '#9B7840',
        marginBottom: '5px',
      }}>
        {cata.marca}
      </div>

      {/* Vitola */}
      <h3 style={{
        fontFamily: 'var(--font-serif)',
        fontWeight: 400,
        fontSize: '22px',
        lineHeight: 1.15,
        letterSpacing: '-0.01em',
        color: '#2C1E1A',
        margin: '0 0 14px',
      }}>
        {cata.vitola}
      </h3>

      {/* Details */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '8px 10px',
        paddingTop: '12px',
        borderTop: '1px solid #EDE8DE',
        marginBottom: '14px',
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
            {cata.cepo}
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
            {cata.paisOrigen || '—'}
          </div>
        </div>
      </div>

      {/* Score */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
        <div style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '28px',
          fontWeight: 400,
          color: '#9B7840',
          letterSpacing: '-0.02em',
          lineHeight: 1,
          flexShrink: 0,
        }}>
          {cata.calificacion}
          <span style={{
            fontFamily: 'var(--font-code)',
            fontSize: '10px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#B0A090',
            marginLeft: '4px',
          }}>pts</span>
        </div>
        <div style={{ flex: 1, height: '2px', background: '#EDE8DE', position: 'relative' }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: `${scoreNorm * 100}%`,
            background: '#9B7840',
          }} />
          <div style={{
            position: 'absolute',
            top: '50%',
            left: `${scoreNorm * 100}%`,
            transform: 'translate(-50%, -50%)',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: '#9B7840',
            border: '1px solid #F9F6F0',
          }} />
        </div>
      </div>

      {cata.lugar && (
        <div style={{
          marginTop: '10px',
          fontFamily: 'var(--font-code)',
          fontSize: '10px',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: '#B0A090',
        }}>
          {cata.lugar}
        </div>
      )}
    </Link>
  );
}
