'use client';

import Image from 'next/image';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import type { PuroPublico } from '@/types/index';

const SHADES: string[] = ['#C4956A', '#B07F52', '#D4A574', '#A06840', '#BA8A5E'];

function CigarSVG({ shade, id }: { shade: string; id: string }) {
  const gradId = `modal-cig-${id}`;
  const grainId = `modal-grain-${id}`;
  return (
    <svg
      viewBox="0 0 80 280"
      style={{ height: '100%', width: 'auto', maxHeight: '340px' }}
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

function GaugeIndicator({ value }: { value: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
      <div
        style={{
          position: 'relative',
          width: '52px',
          height: '52px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '1px solid #C8BFB0',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: '8px',
            borderRadius: '50%',
            border: '1px solid #DDD5C5',
          }}
        />
        <span
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '16px',
            fontWeight: 400,
            color: '#2C1E1A',
            letterSpacing: '-0.02em',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {value}
        </span>
      </div>
      <span
        style={{
          fontFamily: 'var(--font-code)',
          fontSize: '9px',
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          color: '#B0A090',
        }}
      >
        Cepo
      </span>
    </div>
  );
}

function LengthIndicator({ value }: { value: number }) {
  const pct = Math.min(100, Math.max(5, ((value - 80) / (200 - 80)) * 100));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
      <span
        style={{
          fontFamily: 'var(--font-code)',
          fontSize: '9px',
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          color: '#B0A090',
        }}
      >
        Largo
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div
          style={{
            flex: 1,
            height: '1px',
            background: '#EDE8DE',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              width: `${pct}%`,
              height: '1px',
              background: '#9B7840',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: `${pct}%`,
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: '5px',
              height: '5px',
              borderRadius: '50%',
              background: '#9B7840',
              border: '1px solid #F9F6F0',
            }}
          />
        </div>
        <span
          style={{
            fontFamily: 'var(--font-code)',
            fontSize: '10px',
            color: '#6B5540',
            whiteSpace: 'nowrap',
            letterSpacing: '0.06em',
          }}
        >
          {value} mm
        </span>
      </div>
    </div>
  );
}

const FORTALEZA_LEVELS: Record<string, number> = {
  ligero: 1,
  medio: 2,
  fuerte: 3,
  'muy fuerte': 4,
  full: 4,
};

function StrengthIndicator({ value }: { value: string }) {
  const normalized = value.toLowerCase().trim();
  const active = FORTALEZA_LEVELS[normalized] ?? 2;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
      <span
        style={{
          fontFamily: 'var(--font-code)',
          fontSize: '9px',
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          color: '#B0A090',
        }}
      >
        Fortaleza
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {[1, 2, 3, 4].map((lvl) => (
          <div
            key={lvl}
            style={{
              flex: 1,
              height: '3px',
              background: lvl <= active ? '#9B7840' : '#EDE8DE',
              transition: 'background 0.15s',
            }}
          />
        ))}
        <span
          style={{
            fontFamily: 'var(--font-code)',
            fontSize: '10px',
            color: '#6B5540',
            whiteSpace: 'nowrap',
            marginLeft: '4px',
            letterSpacing: '0.06em',
            textTransform: 'capitalize',
          }}
        >
          {value}
        </span>
      </div>
    </div>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        padding: '11px 0',
        borderBottom: '1px solid #EDE8DE',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-code)',
          fontSize: '9px',
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          color: '#B0A090',
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '15px',
          color: '#2C1E1A',
          letterSpacing: '-0.01em',
        }}
      >
        {value}
      </span>
    </div>
  );
}

interface Props {
  puro: PuroPublico | null;
  idx: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PuroDetailModal({ puro, idx, open, onOpenChange }: Props) {
  if (!puro) return null;

  const shade = SHADES[idx % SHADES.length] ?? '#C4956A';
  const soldOut = puro.stock === 0;
  const low = puro.stock > 0 && puro.stock < 15;
  const [intero, deci] = puro.precioVenta.toFixed(2).split('.');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-sm:max-w-[calc(100%-2rem)] max-sm:mx-auto max-sm:rounded-2xl">
        {/* ── DESKTOP ── */}
        <div className="hidden md:block">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '280px 1fr',
            }}
          >
            {/* Left: image */}
            <div
              style={{
                background: '#F2EDE4',
                borderRight: '1px solid #EDE8DE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '48px 24px',
                minHeight: '460px',
              }}
            >
              {puro.fotoUrl ? (
                <div
                  style={{
                    width: '300px',
                    height: '700px',
                    position: 'relative',
                    flexShrink: 0,
                  }}
                  className="rotate-90"
                >
                  <Image
                    src={puro.fotoUrl}
                    alt={puro.nombre}
                    fill
                    sizes="300px"
                    className="h-full scale-200"
                    style={{ objectFit: 'contain', objectPosition: 'center' }}
                  />
                </div>
              ) : (
                <div style={{ height: '340px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CigarSVG shade={shade} id={puro.id} />
                </div>
              )}
            </div>

            {/* Right: details */}
            <div style={{ padding: '36px 44px 40px 40px', position: 'relative' }}>
              {puro.logoMarcaUrl && (
                <div
                  style={{
                    position: 'absolute',
                    top: '36px',
                    right: '44px',
                    width: '160px',
                    height: '160px',
                  }}
                >
                  <Image
                    src={puro.logoMarcaUrl}
                    alt={`Logo ${puro.marca}`}
                    fill
                    sizes="160px"
                    style={{ objectFit: 'contain', objectPosition: 'center' }}
                  />
                </div>
              )}

              <div style={{ marginBottom: '28px', paddingRight: puro.logoMarcaUrl ? '180px' : '0' }}>
                <h2
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontWeight: 400,
                    fontSize: '30px',
                    lineHeight: 1.1,
                    letterSpacing: '-0.01em',
                    color: '#2C1E1A',
                    margin: '0 0 8px 0',
                  }}
                >
                  {puro.nombre}
                </h2>
                <div
                  style={{
                    fontFamily: 'var(--font-code)',
                    fontSize: '9px',
                    letterSpacing: '0.36em',
                    textTransform: 'uppercase',
                    color: '#9B7840',
                  }}
                >
                  {puro.marca}
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '14px',
                  marginBottom: '20px',
                  paddingBottom: '20px',
                  borderBottom: '1px solid #EDE8DE',
                }}
              >
                <span
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '28px',
                    fontWeight: 700,
                    color: '#B28F69',
                    letterSpacing: '-0.02em',
                  }}
                >
                  ${intero}
                  <span style={{ fontSize: '16px' }}>.{deci}</span>
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-code)',
                    fontSize: '9px',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: soldOut ? '#C05040' : low ? '#C47A3D' : '#9A8572',
                  }}
                >
                  {soldOut ? 'Agotado' : low ? `Quedan ${puro.stock}` : 'Disponible'}
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                  marginBottom: '20px',
                  paddingBottom: '20px',
                  borderBottom: '1px solid #EDE8DE',
                }}
              >
                {puro.ringGauge && <GaugeIndicator value={puro.ringGauge} />}
                {(puro.largo || puro.fortaleza) && (
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {puro.largo && <LengthIndicator value={puro.largo} />}
                    {puro.fortaleza && <StrengthIndicator value={puro.fortaleza} />}
                  </div>
                )}
              </div>

              <div>
                <SpecRow label="Vitola" value={puro.vitola} />
                {puro.ringGauge && <SpecRow label="Cepo" value={String(puro.ringGauge)} />}
                {puro.paisOrigen && <SpecRow label="País de Origen" value={puro.paisOrigen} />}
                {puro.largo && <SpecRow label="Largo" value={`${puro.largo} mm`} />}
                {puro.tiempoAnejamiento != null && (
                  <SpecRow label="Añejamiento" value={`${puro.tiempoAnejamiento} meses`} />
                )}
                <SpecRow label="Stock" value={String(puro.stock)} />
              </div>

              {puro.notasCata && (
                <div style={{ marginTop: '24px' }}>
                  <div
                    style={{
                      fontFamily: 'var(--font-code)',
                      fontSize: '9px',
                      letterSpacing: '0.28em',
                      textTransform: 'uppercase',
                      color: '#B0A090',
                      marginBottom: '10px',
                    }}
                  >
                    Notas de Cata
                  </div>
                  <p
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '15px',
                      fontStyle: 'italic',
                      color: '#5C3D1E',
                      lineHeight: 1.65,
                      margin: 0,
                    }}
                  >
                    {puro.notasCata}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── MÓVIL ── */}
        <div className="block md:hidden" style={{ maxHeight: '85vh', overflowY: 'auto', background: '#F9F6F0', borderRadius: 16 }}>

          {/* Hero */}
          <div style={{
            height: 240,
            background: '#F2EDE4',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderTopLeftRadius: 16, borderTopRightRadius: 16,
            overflow: 'hidden', position: 'relative', flexShrink: 0,
          }}>
            <div style={{ position: 'absolute', top: 14, left: 16, fontFamily: 'var(--font-code)', fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase', lineHeight: 1, color: '#9A8572' }}>
              {puro.paisOrigen ?? 'Habano'}
            </div>
            <div style={{ position: 'absolute', top: 14, right: 52, fontFamily: 'var(--font-code)', fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase', lineHeight: 1, color: '#9A8572' }}>
              {puro.vitola}
            </div>
            <div style={{ position: 'absolute', bottom: 14, left: 16, right: 16, height: 1, background: '#DDD5C5', opacity: 0.7 }} />

            {puro.fotoUrl ? (
              <div style={{ width: '100%', height: 200, position: 'relative' }}>
                <Image
                  src={puro.fotoUrl} alt={puro.nombre} fill sizes="360px"
                  style={{ objectFit: 'contain', objectPosition: 'center' }}
                />
              </div>
            ) : (
              <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CigarSVG shade={shade} id={`${puro.id}-mobile`} />
              </div>
            )}
          </div>

          {/* Contenido */}
          <div style={{ padding: '24px 24px 32px', display: 'flex', flexDirection: 'column', gap: 22 }}>

            {/* Cabecera: nombre+marca izda · logo 48px dcha */}
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h2 style={{
                  fontFamily: 'var(--font-serif)',
                  fontWeight: 400, fontSize: 30, lineHeight: 1.05,
                  letterSpacing: '-0.015em', color: '#2C1E1A', margin: 0,
                }}>
                  {puro.nombre}
                </h2>
                <div style={{ fontFamily: 'var(--font-code)', fontSize: 9, letterSpacing: '0.32em', textTransform: 'uppercase', lineHeight: 1, color: '#9B7840', marginTop: 8 }}>
                  {puro.marca}
                </div>
              </div>
              {puro.logoMarcaUrl && (
                <div style={{ flexShrink: 0, position: 'relative', width: 48, height: 48 }}>
                  <Image
                    src={puro.logoMarcaUrl} alt={`Logo ${puro.marca}`} fill sizes="48px"
                    style={{ objectFit: 'contain', objectPosition: 'right' }}
                  />
                </div>
              )}
            </header>

            {/* Precio + stock entre filetes */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
              padding: '12px 0',
              borderTop: '1px solid #EDE8DE',
              borderBottom: '1px solid #EDE8DE',
            }}>
              <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 24, color: '#B28F69', letterSpacing: '-0.02em', lineHeight: 1 }}>
                ${intero}<span style={{ fontSize: 14, fontWeight: 500 }}>.{deci}</span>
              </span>
              <span style={{ fontFamily: 'var(--font-code)', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', lineHeight: 1, color: soldOut ? '#C05040' : low ? '#C47A3D' : '#9A8572' }}>
                {soldOut ? 'Agotado' : low ? `Quedan ${puro.stock}` : 'Disponible'}
              </span>
            </div>

            {/* Indicadores técnicos */}
            {(puro.ringGauge || puro.largo || puro.fortaleza) && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                {puro.ringGauge && <GaugeIndicator value={puro.ringGauge} />}
                {(puro.largo || puro.fortaleza) && (
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {puro.largo     && <LengthIndicator   value={puro.largo} />}
                    {puro.fortaleza && <StrengthIndicator value={puro.fortaleza} />}
                  </div>
                )}
              </div>
            )}

            {/* Specs con hairlines */}
            <div>
              <SpecRow label="Vitola" value={puro.vitola} />
              {puro.paisOrigen            && <SpecRow label="País"         value={puro.paisOrigen} />}
              {puro.largo                 && <SpecRow label="Largo"        value={`${puro.largo} mm`} />}
              {puro.tiempoAnejamiento != null && <SpecRow label="Añejamiento" value={`${puro.tiempoAnejamiento} meses`} />}
              <SpecRow label="Stock" value={`${puro.stock} unidades`} />
            </div>

            {/* Notas de cata */}
            {puro.notasCata && (
              <div>
                <div style={{ fontFamily: 'var(--font-code)', fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase', lineHeight: 1, color: '#B0A090', marginBottom: 10 }}>
                  Notas de Cata
                </div>
                <p style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 16, fontStyle: 'italic',
                  color: '#57463B', lineHeight: 1.65,
                  margin: 0,
                }}>
                  {puro.notasCata}
                </p>
              </div>
            )}

            {/* CTA */}
            <button
              style={{
                width: '100%', padding: '14px 18px',
                background: '#2C1E1A', color: '#F9F6F0',
                border: 'none', borderRadius: 8, cursor: 'pointer',
                fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 13,
                letterSpacing: '0.18em', textTransform: 'uppercase',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
              }}
              disabled={soldOut}
            >
              <span>{soldOut ? 'Sin inventario' : 'Añadir al humidor'}</span>
              {!soldOut && (
                <>
                  <span style={{ color: '#C9A961', fontFamily: 'var(--font-serif)', fontSize: 16, fontStyle: 'italic', textTransform: 'none', letterSpacing: 0 }}>·</span>
                  <span>${intero}.{deci}</span>
                </>
              )}
            </button>

          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
