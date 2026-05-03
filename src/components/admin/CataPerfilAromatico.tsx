import type { Cata } from '@/types/index';

const s = {
  section: {
    borderTop: '1px solid #EDE8DE',
    background: '#FDFAF5',
    padding: '40px 56px',
  } as React.CSSProperties,
  label: {
    fontFamily: 'var(--font-code)',
    fontSize: '9px',
    letterSpacing: '0.36em',
    textTransform: 'uppercase' as const,
    color: '#B0A090',
    marginBottom: '6px',
  } as React.CSSProperties,
  heading: {
    fontFamily: 'var(--font-serif)',
    fontStyle: 'italic',
    fontWeight: 400,
    fontSize: '28px',
    color: '#2C1E1A',
    margin: '0 0 28px',
    letterSpacing: '-0.01em',
  } as React.CSSProperties,
  atributoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '10px 0',
    borderBottom: '1px solid #EDE8DE',
  } as React.CSSProperties,
  atributoNombre: {
    fontFamily: 'var(--font-serif)',
    fontStyle: 'italic',
    fontSize: '15px',
    color: '#2C1E1A',
    width: '72px',
    flexShrink: 0,
  } as React.CSSProperties,
  dotsRow: {
    display: 'flex',
    gap: '6px',
    flex: 1,
  } as React.CSSProperties,
  dotFilled: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    background: '#9B7840',
    flexShrink: 0,
  } as React.CSSProperties,
  dotEmpty: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    background: 'transparent',
    border: '1px solid #C8BFB0',
    flexShrink: 0,
  } as React.CSSProperties,
  atributoValor: {
    fontFamily: 'var(--font-code)',
    fontSize: '9px',
    letterSpacing: '0.2em',
    color: '#B0A090',
    width: '36px',
    textAlign: 'right' as const,
    flexShrink: 0,
  } as React.CSSProperties,
  divider: {
    borderBottom: '1px solid #EDE8DE',
    margin: '24px 0',
  } as React.CSSProperties,
  tagsWrap: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '8px',
  } as React.CSSProperties,
  tag: {
    border: '1px solid #C8BFB0',
    borderRadius: '999px',
    padding: '4px 14px',
    fontFamily: 'var(--font-serif)',
    fontStyle: 'italic',
    fontSize: '13px',
    color: '#5C4A30',
    background: 'transparent',
  } as React.CSSProperties,
  maridajeParagraph: {
    fontFamily: 'var(--font-serif)',
    fontSize: '15px',
    lineHeight: 1.7,
    color: '#5C4A30',
    margin: 0,
    maxWidth: '680px',
  } as React.CSSProperties,
};

function DotScore({ value, max = 5 }: { value: number; max?: number }) {
  return (
    <div style={s.dotsRow}>
      {Array.from({ length: max }).map((_, i) => (
        <div key={i} style={i < value ? s.dotFilled : s.dotEmpty} />
      ))}
    </div>
  );
}

const ATRIBUTOS: { key: keyof Cata; label: string }[] = [
  { key: 'cuerpo', label: 'Cuerpo' },
  { key: 'dulzor', label: 'Dulzor' },
  { key: 'especia', label: 'Especia' },
  { key: 'tierra', label: 'Tierra' },
  { key: 'madera', label: 'Madera' },
];

export default function CataPerfilAromatico({ cata }: { cata: Cata }) {
  const tieneAtributos = ATRIBUTOS.some((a) => cata[a.key] != null);
  const tieneEtiquetas = (cata.etiquetasAroma ?? []).length > 0;

  if (!tieneAtributos && !tieneEtiquetas && !cata.maridaje) return null;

  return (
    <div style={s.section}>
      <div style={s.label}>Cata</div>
      <h2 style={s.heading}>Perfil aromático</h2>

      {tieneAtributos && (
        <div style={{ marginBottom: '0' }}>
          {ATRIBUTOS.map(({ key, label }) => {
            const val = cata[key] as number | undefined;
            if (val == null) return null;
            return (
              <div key={key} style={s.atributoRow}>
                <div style={s.atributoNombre}>{label}</div>
                <DotScore value={val} />
                <div style={s.atributoValor}>{val} / 5</div>
              </div>
            );
          })}
        </div>
      )}

      {tieneEtiquetas && (
        <>
          <div style={s.divider} />
          <div style={s.tagsWrap}>
            {(cata.etiquetasAroma ?? []).map((tag, i) => (
              <span key={i} style={s.tag}>
                {tag}
              </span>
            ))}
          </div>
        </>
      )}

      {cata.maridaje && (
        <>
          <div style={s.divider} />
          <div style={{ ...s.label, marginBottom: '12px' }}>Maridaje sugerido</div>
          <p style={s.maridajeParagraph}>{cata.maridaje}</p>
        </>
      )}
    </div>
  );
}
