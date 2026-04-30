import React from 'react';

type Variant = 'horizontal' | 'wordmark' | 'icon';
type Size = 'sm' | 'md' | 'lg';

interface VitoraLogoProps {
  variant?: Variant;
  size?: Size;
  className?: string;
}

const BARS = [
  { color: '#2C1A0E', height: 0.75, label: 'Churchill' },
  { color: '#A0642A', height: 1.0, label: 'Robusto' },
  { color: '#6B4422', height: 0.58, label: 'Corona' },
];

const SIZE_MAP: Record<Size, { barWidth: number; barMaxH: number; gap: number; fontSize: number }> = {
  sm: { barWidth: 4, barMaxH: 20, gap: 3, fontSize: 18 },
  md: { barWidth: 6, barMaxH: 30, gap: 4, fontSize: 26 },
  lg: { barWidth: 8, barMaxH: 42, gap: 5, fontSize: 36 },
};

function Isotype({ size }: { size: Size }) {
  const { barWidth, barMaxH, gap } = SIZE_MAP[size];
  const totalW = BARS.length * barWidth + (BARS.length - 1) * gap;
  const svgH = barMaxH;

  return (
    <svg
      width={totalW}
      height={svgH}
      viewBox={`0 0 ${totalW} ${svgH}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {BARS.map((bar, i) => {
        const x = i * (barWidth + gap);
        const h = bar.height * barMaxH;
        const y = svgH - h;
        const ringY = y + h * 0.42;
        const ringH = barWidth * 0.55;
        return (
          <g key={bar.label}>
            <rect x={x} y={y} width={barWidth} height={h} rx={barWidth * 0.18} fill={bar.color} />
            <rect
              x={x}
              y={ringY}
              width={barWidth}
              height={ringH}
              fill="#F5F0E8"
              opacity={0.85}
            />
          </g>
        );
      })}
    </svg>
  );
}

function Wordmark({ size, className }: { size: Size; className?: string }) {
  const { fontSize } = SIZE_MAP[size];
  return (
    <span
      className={className}
      style={{
        fontFamily: "'DM Serif Display', serif",
        fontSize,
        lineHeight: 1,
        letterSpacing: '-0.01em',
        display: 'inline-flex',
        alignItems: 'baseline',
        color: '#2C1A0E',
      }}
    >
      Vitola
      <span style={{ color: '#A0642A' }}>.</span>
    </span>
  );
}

export default function VitoraLogo({
  variant = 'horizontal',
  size = 'md',
  className = '',
}: VitoraLogoProps) {
  const { gap } = SIZE_MAP[size];

  if (variant === 'icon') {
    return (
      <span className={`inline-flex items-end ${className}`}>
        <Isotype size={size} />
      </span>
    );
  }

  if (variant === 'wordmark') {
    return <Wordmark size={size} className={className} />;
  }

  return (
    <span
      className={`inline-flex items-end ${className}`}
      style={{ gap: gap * 2 }}
    >
      <Isotype size={size} />
      <Wordmark size={size} />
    </span>
  );
}
