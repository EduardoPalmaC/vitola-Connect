'use client';

import { useState } from 'react';
import type { Cliente } from '@/types';

const SURFACE    = '#FFFFFF';
const SURFACE_BG = '#F9F6F0';
const BORDER     = '#EDE8E0';
const TEXT       = '#2C1E1A';
const TEXT_SEC   = '#6B5C4A';
const TEXT_MUTED = '#A8967E';
const OXBLOOD    = '#6B1E2A';
const GOLD       = '#9B7840';

function formatDate(raw: string): string {
  if (!raw) return '—';
  const parts = raw.split('/');
  if (parts.length === 3) {
    const [d, m, y] = parts;
    return `${d}/${m}/${y}`;
  }
  return raw;
}

export default function ClientesTable({ clientes }: { clientes: Cliente[] }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  if (clientes.length === 0) {
    return (
      <div style={{
        background: SURFACE, border: `1px solid ${BORDER}`,
        padding: '64px 32px', textAlign: 'center',
      }}>
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', fontStyle: 'italic', color: TEXT_MUTED, margin: 0 }}>
          Aún no hay clientes registrados
        </p>
        <p style={{ fontFamily: 'var(--font-code)', fontSize: '10px', letterSpacing: '0.18em', color: TEXT_MUTED, margin: '10px 0 0', textTransform: 'uppercase' }}>
          Los clientes aparecerán al registrar ventas con nombre de cliente
        </p>
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
    <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, minWidth: '560px' }}>
      {/* Header row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 180px 120px 140px 40px',
        padding: '10px 24px',
        borderBottom: `1px solid ${BORDER}`,
        background: SURFACE_BG,
      }}>
        {['Cliente', 'Contacto', 'Puros comprados', 'Total gastado', ''].map((h) => (
          <span key={h} style={{
            fontFamily: 'var(--font-code)', fontSize: '9px',
            letterSpacing: '0.2em', textTransform: 'uppercase', color: TEXT_MUTED,
          }}>
            {h}
          </span>
        ))}
      </div>

      {clientes.map((c, i) => {
        const isOpen = expanded === c.nombre;
        const isLast = i === clientes.length - 1;

        return (
          <div key={c.nombre} style={{ borderBottom: isLast ? 'none' : `1px solid ${BORDER}` }}>
            {/* Main row */}
            <button
              type="button"
              onClick={() => setExpanded(isOpen ? null : c.nombre)}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 180px 120px 140px 40px',
                alignItems: 'center',
                width: '100%', padding: '14px 24px',
                background: isOpen ? '#FDFAF5' : 'transparent',
                border: 'none', cursor: 'pointer', textAlign: 'left',
                transition: 'background 120ms',
              }}
              onMouseEnter={(e) => { if (!isOpen) (e.currentTarget as HTMLButtonElement).style.background = '#FDFAF5'; }}
              onMouseLeave={(e) => { if (!isOpen) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
            >
              <div>
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: '15px', fontWeight: 600, color: TEXT }}>
                  {c.nombre}
                </span>
                <span style={{
                  display: 'inline-block', marginLeft: '10px',
                  fontFamily: 'var(--font-code)', fontSize: '9px',
                  letterSpacing: '0.16em', textTransform: 'uppercase',
                  color: GOLD, background: '#F5EDD8',
                  border: `1px solid #D4B87A`, padding: '2px 7px',
                  verticalAlign: 'middle',
                }}>
                  {c.ventas.length} {c.ventas.length === 1 ? 'compra' : 'compras'}
                </span>
              </div>
              <span style={{ fontFamily: 'var(--font-code)', fontSize: '11px', color: TEXT_SEC }}>
                {c.contacto || <span style={{ color: TEXT_MUTED }}>—</span>}
              </span>
              <span style={{ fontFamily: 'var(--font-code)', fontSize: '13px', fontWeight: 600, color: TEXT_SEC }}>
                {c.totalPuros}
              </span>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '16px', fontWeight: 600, color: OXBLOOD }}>
                ${c.totalGastado.toLocaleString('es-MX')}
              </span>
              <span style={{
                fontFamily: 'var(--font-code)', fontSize: '10px', color: TEXT_MUTED,
                transform: isOpen ? 'rotate(180deg)' : 'none',
                transition: 'transform 200ms', display: 'inline-block',
              }}>
                ▾
              </span>
            </button>

            {/* Expanded history */}
            {isOpen && (
              <div style={{
                background: SURFACE_BG,
                borderTop: `1px solid ${BORDER}`,
                padding: '16px 32px 20px',
              }}>
                <p style={{
                  fontFamily: 'var(--font-code)', fontSize: '9px',
                  letterSpacing: '0.22em', textTransform: 'uppercase',
                  color: TEXT_MUTED, margin: '0 0 12px',
                }}>
                  Historial de compras
                </p>
                <div>
                  {c.ventas.map((v, vi) => (
                    <div
                      key={vi}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '120px 1fr 80px 120px',
                        alignItems: 'center',
                        padding: '8px 0',
                        borderBottom: vi === c.ventas.length - 1 ? 'none' : `1px solid ${BORDER}`,
                      }}
                    >
                      <span style={{ fontFamily: 'var(--font-code)', fontSize: '10px', color: TEXT_MUTED }}>
                        {formatDate(v.fecha)}
                      </span>
                      <span style={{ fontFamily: 'var(--font-serif)', fontSize: '13px', color: TEXT }}>
                        {v.producto}
                      </span>
                      <span style={{ fontFamily: 'var(--font-code)', fontSize: '11px', color: TEXT_SEC }}>
                        ×{v.cantidad}
                      </span>
                      <span style={{ fontFamily: 'var(--font-code)', fontSize: '12px', fontWeight: 600, color: TEXT_SEC, textAlign: 'right' }}>
                        ${v.totalVenta.toLocaleString('es-MX')}
                      </span>
                    </div>
                  ))}
                </div>
                <div style={{
                  display: 'flex', justifyContent: 'flex-end',
                  marginTop: '12px', paddingTop: '12px',
                  borderTop: `1px solid ${BORDER}`,
                }}>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontFamily: 'var(--font-code)', fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: TEXT_MUTED, margin: '0 0 4px' }}>
                      Total invertido
                    </p>
                    <p style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', fontWeight: 600, color: OXBLOOD, margin: 0 }}>
                      ${c.totalGastado.toLocaleString('es-MX')}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
    </div>
  );
}
