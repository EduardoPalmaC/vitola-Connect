'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Cata } from '@/types/index';

const s = {
  page: {
    background: '#FDFAF5',
    color: '#2C1E1A',
    fontFamily: 'var(--font-serif)',
    width: '100%',
    minHeight: '100vh',
  } as React.CSSProperties,
  topbar: {
    padding: '18px 56px',
    borderBottom: '1px solid #EDE8DE',
    display: 'grid',
    gridTemplateColumns: '1fr auto 1fr',
    alignItems: 'center',
    fontFamily: 'var(--font-code)',
    fontSize: '10px',
    letterSpacing: '0.24em',
    textTransform: 'uppercase',
    color: '#B0A090',
    background: '#FFFFFF',
  } as React.CSSProperties,
  back: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    color: '#9B7840',
    cursor: 'pointer',
    justifySelf: 'start',
    textDecoration: 'none',
    fontFamily: 'var(--font-code)',
    fontSize: '10px',
    letterSpacing: '0.24em',
    textTransform: 'uppercase',
  } as React.CSSProperties,
  topbarBrand: {
    fontFamily: 'var(--font-serif)',
    fontStyle: 'italic',
    fontSize: '20px',
    color: '#2C1E1A',
    fontWeight: 400,
    textTransform: 'none',
    letterSpacing: '-0.01em',
  } as React.CSSProperties,
  topbarBrandDot: { color: '#9B7840' } as React.CSSProperties,
  topbarRight: { justifySelf: 'end' } as React.CSSProperties,
  crumb: {
    padding: '14px 56px',
    fontFamily: 'var(--font-code)',
    fontSize: '10px',
    letterSpacing: '0.22em',
    textTransform: 'uppercase',
    color: '#C8BFB0',
    borderBottom: '1px solid #EDE8DE',
    display: 'flex',
    gap: '10px',
    background: '#FFFFFF',
  } as React.CSSProperties,
  crumbActive: { color: '#9B7840' } as React.CSSProperties,
  main: {
    display: 'grid',
    gridTemplateColumns: '420px 1fr',
    gap: '0',
    borderBottom: '1px solid #EDE8DE',
  } as React.CSSProperties,
  gallery: {
    background: '#F2EDE4',
    borderRight: '1px solid #EDE8DE',
    padding: '48px 32px 32px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    position: 'relative',
  } as React.CSSProperties,
  galleryMeta: {
    position: 'absolute',
    top: '20px',
    left: '32px',
    fontFamily: 'var(--font-code)',
    fontSize: '10px',
    letterSpacing: '0.24em',
    textTransform: 'uppercase',
    color: '#C8BFB0',
  } as React.CSSProperties,
  galleryOrigin: {
    position: 'absolute',
    top: '20px',
    right: '32px',
    fontFamily: 'var(--font-code)',
    fontSize: '10px',
    letterSpacing: '0.24em',
    textTransform: 'uppercase',
    color: '#C8BFB0',
  } as React.CSSProperties,
  hero: {
    flex: 1,
    minHeight: '460px',
    background: '#F7F3EC',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    border: '1px solid #EDE8DE',
    borderRadius: '4px',
    overflow: 'hidden',
  } as React.CSSProperties,
  heroCaption: {
    position: 'absolute',
    bottom: '14px',
    left: '18px',
    fontFamily: 'var(--font-serif)',
    fontStyle: 'italic',
    fontSize: '13px',
    color: '#B0A090',
  } as React.CSSProperties,
  thumbs: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '6px',
  } as React.CSSProperties,
  thumb: {
    aspectRatio: '1 / 1',
    background: '#F7F3EC',
    border: '1px solid #EDE8DE',
    borderRadius: '3px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
  } as React.CSSProperties,
  thumbActive: { border: '1px solid #9B7840' } as React.CSSProperties,
  thumbLabel: {
    position: 'absolute',
    bottom: '5px',
    left: '7px',
    fontFamily: 'var(--font-code)',
    fontSize: '8px',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: '#B0A090',
  } as React.CSSProperties,
  info: {
    padding: '48px 56px 56px',
    background: '#FFFFFF',
  } as React.CSSProperties,
  marca: {
    fontFamily: 'var(--font-code)',
    fontSize: '11px',
    letterSpacing: '0.36em',
    textTransform: 'uppercase',
    color: '#9B7840',
    marginBottom: '14px',
  } as React.CSSProperties,
  name: {
    fontFamily: 'var(--font-serif)',
    fontWeight: 400,
    fontSize: '56px',
    lineHeight: 0.95,
    letterSpacing: '-0.025em',
    color: '#2C1E1A',
    margin: '0 0 16px',
  } as React.CSSProperties,
  nameItalic: {
    fontStyle: 'italic',
    fontSize: '38px',
    color: '#9B7840',
    display: 'block',
    marginTop: '4px',
  } as React.CSSProperties,
  origenLine: {
    fontFamily: 'var(--font-code)',
    fontSize: '10px',
    letterSpacing: '0.22em',
    textTransform: 'uppercase',
    color: '#B0A090',
    marginBottom: '28px',
  } as React.CSSProperties,
  description: {
    fontFamily: 'var(--font-serif)',
    fontStyle: 'italic',
    fontSize: '16px',
    lineHeight: 1.65,
    color: '#5C4A30',
    marginBottom: '32px',
    maxWidth: '600px',
  } as React.CSSProperties,
  scoreRow: {
    display: 'grid',
    gridTemplateColumns: 'auto 1fr 1fr 1fr',
    gap: '0',
    border: '1px solid #EDE8DE',
    marginBottom: '0',
  } as React.CSSProperties,
  scoreCell: {
    padding: '18px 22px',
    borderRight: '1px solid #EDE8DE',
  } as React.CSSProperties,
  scoreCellLast: { borderRight: 'none' } as React.CSSProperties,
  scoreLabel: {
    fontFamily: 'var(--font-code)',
    fontSize: '9px',
    letterSpacing: '0.32em',
    textTransform: 'uppercase',
    color: '#B0A090',
    marginBottom: '10px',
  } as React.CSSProperties,
  scoreBox: {
    background: '#9B7840',
    color: '#FFFFFF',
    width: '80px',
    padding: '10px 0',
    textAlign: 'center',
    fontFamily: 'var(--font-serif)',
    fontWeight: 400,
  } as React.CSSProperties,
  scoreValue: {
    fontSize: '34px',
    lineHeight: 1,
    letterSpacing: '-0.02em',
  } as React.CSSProperties,
  scorePoints: {
    fontFamily: 'var(--font-code)',
    fontSize: '8px',
    letterSpacing: '0.24em',
    textTransform: 'uppercase',
    marginTop: '2px',
  } as React.CSSProperties,
  bar: {
    width: '100%',
    height: '2px',
    background: '#EDE8DE',
    position: 'relative',
    marginTop: '10px',
    marginBottom: '8px',
  } as React.CSSProperties,
  barFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    background: '#9B7840',
  } as React.CSSProperties,
  barDot: {
    position: 'absolute',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#9B7840',
    border: '1px solid #F9F6F0',
  } as React.CSSProperties,
  barCaption: {
    fontFamily: 'var(--font-serif)',
    fontStyle: 'italic',
    fontSize: '14px',
    color: '#9A8572',
    marginTop: '10px',
  } as React.CSSProperties,
  gauge: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    border: '1px solid #EDE8DE',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  } as React.CSSProperties,
  gaugeInner: {
    position: 'absolute',
    inset: '8px',
    borderRadius: '50%',
    border: '1px solid #DDD5C5',
  } as React.CSSProperties,
  gaugeNum: {
    fontFamily: 'var(--font-serif)',
    fontSize: '22px',
    fontWeight: 400,
    color: '#2C1E1A',
    letterSpacing: '-0.02em',
    position: 'relative',
    zIndex: 1,
  } as React.CSSProperties,
  splitRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0',
    borderTop: '1px solid #EDE8DE',
  } as React.CSSProperties,
  splitCol: {
    padding: '40px 56px',
    borderRight: '1px solid #EDE8DE',
    background: '#FFFFFF',
  } as React.CSSProperties,
  splitColLast: {
    borderRight: 'none',
    background: '#FDFAF5',
  } as React.CSSProperties,
  splitTitle: {
    fontFamily: 'var(--font-code)',
    fontSize: '9px',
    letterSpacing: '0.32em',
    textTransform: 'uppercase',
    color: '#B0A090',
    marginBottom: '6px',
  } as React.CSSProperties,
  splitHeading: {
    fontFamily: 'var(--font-serif)',
    fontWeight: 400,
    fontStyle: 'italic',
    fontSize: '28px',
    color: '#2C1E1A',
    margin: '0 0 24px',
    letterSpacing: '-0.01em',
  } as React.CSSProperties,
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    padding: '11px 0',
    borderBottom: '1px solid #EDE8DE',
  } as React.CSSProperties,
  detailKey: {
    fontFamily: 'var(--font-code)',
    fontSize: '9px',
    letterSpacing: '0.28em',
    textTransform: 'uppercase',
    color: '#B0A090',
  } as React.CSSProperties,
  detailVal: {
    fontFamily: 'var(--font-serif)',
    fontSize: '16px',
    color: '#2C1E1A',
    letterSpacing: '-0.01em',
  } as React.CSSProperties,
  detailValAccent: { color: '#9B7840' } as React.CSSProperties,
  actionsStrip: {
    padding: '36px 56px',
    borderTop: '1px solid #EDE8DE',
    background: '#F2EDE4',
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    gap: '32px',
    alignItems: 'center',
  } as React.CSSProperties,
  contextWrap: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '40px',
  } as React.CSSProperties,
  contextLabel: {
    fontFamily: 'var(--font-code)',
    fontSize: '9px',
    letterSpacing: '0.32em',
    textTransform: 'uppercase',
    color: '#B0A090',
    marginBottom: '6px',
  } as React.CSSProperties,
  contextValue: {
    fontFamily: 'var(--font-serif)',
    fontWeight: 400,
    fontSize: '36px',
    color: '#9B7840',
    lineHeight: 0.95,
    letterSpacing: '-0.02em',
  } as React.CSSProperties,
  contextValueSuffix: {
    fontSize: '16px',
    color: '#B0A090',
  } as React.CSSProperties,
  contextMeta: {
    fontFamily: 'var(--font-serif)',
    fontStyle: 'italic',
    fontSize: '14px',
    color: '#9A8572',
    marginTop: '8px',
  } as React.CSSProperties,
  contextDivider: {
    borderLeft: '1px solid #DDD5C5',
    paddingLeft: '40px',
  } as React.CSSProperties,
  contextValueSm: {
    fontFamily: 'var(--font-code)',
    fontSize: '10px',
    letterSpacing: '0.24em',
    textTransform: 'uppercase',
    color: '#9A8572',
  } as React.CSSProperties,
  btnGroup: {
    display: 'flex',
    gap: '0',
    alignItems: 'stretch',
  } as React.CSSProperties,
  btnEdit: {
    background: 'transparent',
    color: '#2C1E1A',
    border: '1px solid #DDD5C5',
    padding: '0 28px',
    height: '52px',
    fontFamily: 'var(--font-code)',
    fontSize: '10px',
    letterSpacing: '0.28em',
    textTransform: 'uppercase',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
  } as React.CSSProperties,
};

function CigarHero({ shade = '#C4956A' }: { shade?: string }) {
  return (
    <svg
      viewBox="0 0 80 280"
      style={{ height: '88%', width: 'auto', maxHeight: '380px' }}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="cataHeroGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={shade} stopOpacity="0.7" />
          <stop offset="50%" stopColor={shade} stopOpacity="0.9" />
          <stop offset="100%" stopColor={shade} stopOpacity="0.6" />
        </linearGradient>
        <pattern id="cataHeroGrain" width="3" height="3" patternUnits="userSpaceOnUse">
          <rect width="3" height="3" fill="transparent" />
          <line x1="0" y1="0" x2="0" y2="3" stroke="rgba(0,0,0,0.08)" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect x="28" y="10" width="24" height="240" rx="12" fill="url(#cataHeroGrad)" />
      <rect x="28" y="10" width="24" height="240" rx="12" fill="url(#cataHeroGrain)" />
      <rect x="26" y="180" width="28" height="28" fill="#3A2A1A" />
      <rect x="26" y="184" width="28" height="1" fill="#C4A472" />
      <rect x="26" y="203" width="28" height="1" fill="#C4A472" />
      <ellipse cx="40" cy="252" rx="12" ry="3" fill="rgba(0,0,0,0.15)" />
    </svg>
  );
}

function scoreLabel(score: number): string {
  if (score >= 95) return 'Clásico';
  if (score >= 90) return 'Excepcional';
  if (score >= 85) return 'Muy bueno';
  if (score >= 80) return 'Bueno';
  if (score >= 70) return 'Satisfactorio';
  return 'Regular';
}

export default function CataDetailView({ cata }: { cata: Cata }) {
  const [activeThumb, setActiveThumb] = useState(0);
  const shade = '#C4956A';

  const fechaFormateada = new Date(cata.fecha).toLocaleDateString('es-MX', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const allImages: Array<{ url: string; label: string }> = [];
  if (cata.fotoUrl) allImages.push({ url: cata.fotoUrl, label: 'Principal' });
  (cata.fotosAdicionales ?? []).forEach((url, i) =>
    allImages.push({ url, label: `Foto ${i + 2}` }),
  );

  const vitolaParts = cata.vitola.trim().split(' ');
  const vitolaHead = vitolaParts.length > 1 ? vitolaParts.slice(0, -1).join(' ') : '';
  const vitolaItalic = vitolaParts.length > 1 ? vitolaParts.slice(-1)[0] : cata.vitola;

  const scoreNorm = cata.calificacion / 100;

  return (
    <div style={s.page}>
      {/* Topbar */}
      <div style={s.topbar}>
        <Link href="/admin/diario" style={s.back}>
          <span>←</span>
          <span>Mi Diario</span>
        </Link>
        <div style={s.topbarBrand}>
          Vitola<span style={s.topbarBrandDot}>.</span>
        </div>
        <div style={s.topbarRight}>{new Date(cata.fecha).getFullYear()}</div>
      </div>

      {/* Breadcrumb */}
      <div style={s.crumb}>
        <span>Diario</span>
        <span>/</span>
        <span>{cata.paisOrigen}</span>
        <span>/</span>
        <span>{cata.marca}</span>
        <span>/</span>
        <span style={s.crumbActive}>{cata.vitola}</span>
      </div>

      {/* Main grid */}
      <div style={s.main}>
        {/* Gallery */}
        <div style={s.gallery}>
          <div style={s.galleryMeta}>
            {new Date(cata.fecha).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })}
          </div>
          <div style={s.galleryOrigin}>{cata.paisOrigen}</div>

          <div style={s.hero}>
            {allImages.length > 0 ? (
              <Image
                src={allImages[activeThumb]?.url ?? allImages[0]!.url}
                alt={`${cata.marca} ${cata.vitola}`}
                fill
                className="object-contain"
                sizes="420px"
              />
            ) : (
              <CigarHero shade={shade} />
            )}
            <div style={s.heroCaption}>
              <em>fig. {String(activeThumb + 1).padStart(2, '0')}</em>
              {' — '}
              {allImages[activeThumb]?.label ?? 'Ilustración'}
            </div>
          </div>

          {allImages.length > 1 && (
            <div style={{ ...s.thumbs, gridTemplateColumns: `repeat(${Math.min(4, allImages.length)}, 1fr)` }}>
              {allImages.slice(0, 4).map((img, i) => (
                <div
                  key={i}
                  style={{ ...s.thumb, ...(activeThumb === i ? s.thumbActive : {}) }}
                  onClick={() => setActiveThumb(i)}
                >
                  <Image src={img.url} alt={img.label} fill className="object-cover" sizes="100px" />
                  <div style={s.thumbLabel}>{img.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div style={s.info}>
          <h1 style={s.name}>
            {cata.marca} <span style={s.nameItalic}>{cata.vitola}</span>
          </h1>
          <div style={s.origenLine}>
            {fechaFormateada} · Cepo {cata.cepo} · {cata.paisOrigen}
          </div>

          {cata.notas && (
            <p style={s.description}>{cata.notas}</p>
          )}

          {/* Score row */}
          <div style={s.scoreRow}>
            <div style={s.scoreCell}>
              <div style={s.scoreLabel}>Score</div>
              <div style={s.scoreBox}>
                <div style={s.scoreValue}>{cata.calificacion}</div>
                <div style={s.scorePoints}>Puntos</div>
              </div>
            </div>

            <div style={s.scoreCell}>
              <div style={s.scoreLabel}>Calificación</div>
              <div style={s.bar}>
                <div style={{ ...s.barFill, width: `${scoreNorm * 100}%` }} />
                <div style={{ ...s.barDot, left: `${scoreNorm * 100}%` }} />
              </div>
              <div style={s.barCaption}>{scoreLabel(cata.calificacion)}</div>
            </div>

            <div style={s.scoreCell}>
              <div style={s.scoreLabel}>Cepo</div>
              <div style={{ marginTop: '6px' }}>
                <div style={s.gauge}>
                  <div style={s.gaugeInner} />
                  <span style={s.gaugeNum}>{cata.cepo}</span>
                </div>
              </div>
            </div>

            <div style={{ ...s.scoreCell, ...s.scoreCellLast }}>
              <div style={s.scoreLabel}>Lugar</div>
              <div style={{
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontSize: '16px',
                color: '#9B7840',
                marginTop: '8px',
                lineHeight: 1.4,
              }}>
                {cata.lugar || '—'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Split row */}
      <div style={s.splitRow}>
        {/* Ficha técnica */}
        <div style={s.splitCol}>
          <div style={s.splitTitle}>Ficha técnica</div>
          <h2 style={s.splitHeading}>Detalles</h2>

          <div style={s.detailRow}>
            <div style={s.detailKey}>Marca</div>
            <div style={{ ...s.detailVal, ...s.detailValAccent }}>{cata.marca}</div>
          </div>
          <div style={s.detailRow}>
            <div style={s.detailKey}>Vitola</div>
            <div style={s.detailVal}>{cata.vitola}</div>
          </div>
          <div style={s.detailRow}>
            <div style={s.detailKey}>Cepo</div>
            <div style={s.detailVal}>{cata.cepo}</div>
          </div>
          <div style={s.detailRow}>
            <div style={s.detailKey}>País</div>
            <div style={{ ...s.detailVal, ...s.detailValAccent }}>{cata.paisOrigen}</div>
          </div>
          <div style={{ ...s.detailRow, borderBottom: 'none' }}>
            <div style={s.detailKey}>Capa</div>
            <div style={s.detailVal}>{cata.capa || '—'}</div>
          </div>
        </div>

        {/* Notas */}
        <div style={{ ...s.splitCol, ...s.splitColLast }}>
          <div style={s.splitTitle}>Cata</div>
          <h2 style={s.splitHeading}>Notas</h2>

          {cata.notas ? (
            <p style={{ ...s.description, marginBottom: '0' }}>{cata.notas}</p>
          ) : (
            <p style={{ ...s.description, color: '#C8BFB0', fontStyle: 'italic', marginBottom: '0' }}>
              Sin notas registradas.
            </p>
          )}

          <div style={{ marginTop: '28px', paddingTop: '22px', borderTop: '1px solid #EDE8DE' }}>
            <div style={s.splitTitle}>Fecha y lugar</div>
            <p style={{ ...s.description, marginBottom: 0, fontSize: '15px' }}>
              <em>{fechaFormateada}</em>
              {cata.lugar && <> · {cata.lugar}</>}
            </p>
          </div>
        </div>
      </div>

      {/* Actions strip */}
      <div style={s.actionsStrip}>
        <div style={s.contextWrap}>
          <div>
            <div style={s.contextLabel}>Calificación</div>
            <div style={s.contextValue}>
              {cata.calificacion}
              <span style={s.contextValueSuffix}> pts</span>
            </div>
            <div style={s.contextMeta}>
              {scoreLabel(cata.calificacion)} · {new Date(cata.fecha).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          </div>
          {cata.lugar && (
            <div style={s.contextDivider}>
              <div style={s.contextLabel}>Lugar</div>
              <div style={s.contextValueSm}>{cata.lugar}</div>
            </div>
          )}
        </div>

        <div style={s.btnGroup}>
          <Link href={`/admin/diario/${cata.id}/editar`} style={s.btnEdit}>
            Editar
          </Link>
          <DeleteInline id={cata.id} />
        </div>
      </div>
    </div>
  );
}

function DeleteInline({ id }: { id: string }) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm('¿Eliminar esta cata? Esta acción no se puede deshacer.')) return;
    setDeleting(true);
    try {
      await fetch(`/api/catas/${id}`, { method: 'DELETE' });
      window.location.href = '/admin/diario';
    } catch {
      setDeleting(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      style={{
        background: 'transparent',
        color: '#C05040',
        border: '1px solid #DDD5C5',
        borderLeft: 'none',
        padding: '0 28px',
        height: '52px',
        fontFamily: 'var(--font-code)',
        fontSize: '10px',
        letterSpacing: '0.28em',
        textTransform: 'uppercase',
        cursor: deleting ? 'not-allowed' : 'pointer',
        opacity: deleting ? 0.5 : 1,
      }}
    >
      {deleting ? '...' : 'Eliminar'}
    </button>
  );
}
