'use client';

import { useState, useMemo, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import type { Puro } from '@/types';

const OXBLOOD    = '#6B1E2A';
const SURFACE    = '#FFFFFF';
const SURFACE_BG = '#F9F6F0';
const BORDER     = '#EDE8E0';
const TEXT       = '#1C1008';
const TEXT_SEC   = '#6B5C4A';
const TEXT_MUTED = '#A8967E';

interface CartItem { puro: Puro; cantidad: number }
interface VentaModalProps { puros: Puro[]; open: boolean; onClose: () => void }

function todayISO() {
  return new Date().toISOString().split('T')[0]!;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Label({ children }: { children: string }) {
  return (
    <p style={{
      fontFamily: 'var(--font-code)', fontSize: '10px',
      letterSpacing: '0.22em', textTransform: 'uppercase',
      color: TEXT_MUTED, margin: '0 0 10px',
    }}>
      {children}
    </p>
  );
}

function ProductRow({ puro, disabled, onClick }: { puro: Puro; disabled: boolean; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        width: '100%', padding: '8px 10px', borderRadius: '6px',
        background: hovered && !disabled ? '#F5EFE8' : 'transparent',
        border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1, textAlign: 'left',
        transition: 'background 120ms',
      }}
    >
      <div>
        <span style={{ fontFamily: 'var(--font-serif)', fontSize: '14px', fontWeight: 700, color: TEXT }}>
          {puro.marca}
        </span>
        <span style={{ fontFamily: 'var(--font-serif)', fontSize: '14px', color: TEXT_SEC, marginLeft: '6px' }}>
          {puro.vitola}
        </span>
        <span style={{ fontFamily: 'var(--font-code)', fontSize: '11px', color: TEXT_MUTED, marginLeft: '8px' }}>
          {puro.nombre}
        </span>
      </div>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexShrink: 0 }}>
        <span style={{ fontFamily: 'var(--font-code)', fontSize: '10px', color: TEXT_MUTED }}>
          Stock: {puro.stock}
        </span>
        <span style={{ fontFamily: 'var(--font-code)', fontSize: '12px', fontWeight: 600, color: TEXT_SEC }}>
          ${puro.precioVenta.toLocaleString('es-MX')}
        </span>
      </div>
    </button>
  );
}

function QtyButton({ onClick, disabled, children }: { onClick: () => void; disabled?: boolean; children: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '24px', height: '24px', borderRadius: '50%',
        border: `1px solid ${hovered && !disabled ? TEXT_MUTED : BORDER}`,
        background: 'transparent', cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-code)', fontSize: '14px',
        color: disabled ? TEXT_MUTED : TEXT_SEC,
        opacity: disabled ? 0.35 : 1,
        transition: 'border-color 120ms, color 120ms',
      }}
    >
      {children}
    </button>
  );
}

function CartRow({ puro, cantidad, isLast, onUpdate }: { puro: Puro; cantidad: number; isLast: boolean; onUpdate: (n: number) => void }) {
  const [hovX, setHovX] = useState(false);
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '10px 0',
      borderBottom: isLast ? 'none' : `1px solid ${BORDER}`,
    }}>
      <div style={{ minWidth: 0, marginRight: '16px' }}>
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: '14px', fontWeight: 700, color: TEXT, margin: 0 }}>
          {puro.marca} <span style={{ fontWeight: 400, color: TEXT_SEC }}>{puro.vitola}</span>
        </p>
        <p style={{ fontFamily: 'var(--font-code)', fontSize: '11px', color: TEXT_MUTED, margin: '2px 0 0' }}>
          ${puro.precioVenta.toLocaleString('es-MX')} c/u
        </p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <QtyButton onClick={() => onUpdate(cantidad - 1)}>−</QtyButton>
          <span style={{ fontFamily: 'var(--font-code)', fontSize: '13px', fontWeight: 600, color: TEXT, minWidth: '20px', textAlign: 'center' }}>
            {cantidad}
          </span>
          <QtyButton onClick={() => onUpdate(cantidad + 1)} disabled={cantidad >= puro.stock}>+</QtyButton>
        </div>
        <span style={{ fontFamily: 'var(--font-code)', fontSize: '13px', fontWeight: 600, color: TEXT_SEC, minWidth: '72px', textAlign: 'right' }}>
          ${(puro.precioVenta * cantidad).toLocaleString('es-MX')}
        </span>
        <button
          type="button"
          onClick={() => onUpdate(0)}
          onMouseEnter={() => setHovX(true)}
          onMouseLeave={() => setHovX(false)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: 'var(--font-code)', fontSize: '11px',
            color: hovX ? '#C0202E' : TEXT_MUTED,
            transition: 'color 120ms', padding: '0 2px',
          }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}

// ─── Main modal ───────────────────────────────────────────────────────────────

export default function VentaModal({ puros, open, onClose }: VentaModalProps) {
  const router = useRouter();
  const [search, setSearch]         = useState('');
  const [cart, setCart]             = useState<CartItem[]>([]);
  const [fecha, setFecha]           = useState(todayISO());
  const [isPending, startTransition] = useTransition();
  const [error, setError]           = useState<string | null>(null);
  const [searchFocus, setSearchFocus] = useState(false);
  const [dateFocus, setDateFocus]   = useState(false);

  const disponibles = useMemo(
    () => puros.filter(
      (p) => p.stock > 0 && (
        p.nombre.toLowerCase().includes(search.toLowerCase()) ||
        p.marca.toLowerCase().includes(search.toLowerCase()) ||
        p.vitola.toLowerCase().includes(search.toLowerCase())
      )
    ),
    [puros, search],
  );

  function addToCart(puro: Puro) {
    setCart((prev) => {
      const existing = prev.find((i) => i.puro.id === puro.id);
      if (existing) {
        if (existing.cantidad >= puro.stock) return prev;
        return prev.map((i) => i.puro.id === puro.id ? { ...i, cantidad: i.cantidad + 1 } : i);
      }
      return [...prev, { puro, cantidad: 1 }];
    });
  }

  function updateCantidad(puroId: string, cantidad: number) {
    if (cantidad <= 0) { setCart((prev) => prev.filter((i) => i.puro.id !== puroId)); return; }
    const item = cart.find((i) => i.puro.id === puroId);
    if (!item || cantidad > item.puro.stock) return;
    setCart((prev) => prev.map((i) => i.puro.id === puroId ? { ...i, cantidad } : i));
  }

  const total = cart.reduce((sum, { puro, cantidad }) => sum + puro.precioVenta * cantidad, 0);

  function handleClose() {
    setCart([]); setSearch(''); setFecha(todayISO()); setError(null); onClose();
  }

  function handleConfirm() {
    if (cart.length === 0) return;
    startTransition(async () => {
      try {
        setError(null);
        const res = await fetch('/api/ventas/batch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: cart, fecha }),
        });
        if (!res.ok) throw new Error('Error al registrar la venta');
        handleClose();
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Error desconocido');
      }
    });
  }

  if (!open) return null;

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backgroundColor: 'rgba(28,16,8,0.5)',
      }}
    >
      <div style={{
        width: '100%', maxWidth: '580px',
        backgroundColor: SURFACE_BG,
        border: `1px solid ${BORDER}`,
        borderRadius: '12px',
        boxShadow: '0 24px 64px rgba(28,16,8,0.22)',
        display: 'flex', flexDirection: 'column',
        maxHeight: '90vh', overflow: 'hidden',
      }}>

        {/* ── Header ── */}
        <div style={{
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          padding: '24px 28px 18px',
          backgroundColor: SURFACE, borderBottom: `1px solid ${BORDER}`,
          flexShrink: 0,
        }}>
          <div>
            <p style={{ fontFamily: 'var(--font-code)', fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color: TEXT_MUTED, margin: '0 0 6px' }}>
              Vitola · Registro
            </p>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', fontWeight: 400, fontStyle: 'italic', color: TEXT, margin: 0, lineHeight: 1.2 }}>
              Nueva Venta
            </h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
              <label style={{ fontFamily: 'var(--font-code)', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: TEXT_MUTED }}>
                Fecha
              </label>
              <input
                type="date"
                value={fecha}
                max={todayISO()}
                onChange={(e) => setFecha(e.target.value)}
                onFocus={() => setDateFocus(true)}
                onBlur={() => setDateFocus(false)}
                style={{
                  fontFamily: 'var(--font-code)', fontSize: '12px', color: TEXT_SEC,
                  border: 'none', borderBottom: `1px solid ${dateFocus ? OXBLOOD : BORDER}`,
                  background: 'transparent', outline: 'none',
                  padding: '2px 0', cursor: 'pointer', transition: 'border-color 150ms',
                }}
              />
            </div>
            <button
              type="button" onClick={handleClose}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = TEXT; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = TEXT_MUTED; }}
              style={{ color: TEXT_MUTED, background: 'none', border: 'none', fontSize: '15px', cursor: 'pointer', marginTop: '4px', lineHeight: 1, transition: 'color 120ms' }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* ── Body ── */}
        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1 }}>

          {/* Search */}
          <div style={{ padding: '18px 28px 16px', backgroundColor: SURFACE, borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
            <Label>Agregar Productos</Label>
            <input
              type="text"
              placeholder="Buscar por nombre, marca o vitola…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setSearchFocus(true)}
              onBlur={() => setSearchFocus(false)}
              style={{
                width: '100%', boxSizing: 'border-box',
                fontFamily: 'var(--font-code)', fontSize: '13px', color: TEXT,
                border: 'none', borderBottom: `1px solid ${searchFocus ? OXBLOOD : BORDER}`,
                background: 'transparent', outline: 'none',
                padding: '6px 0', transition: 'border-color 150ms',
              }}
            />
            <div style={{ marginTop: '6px', maxHeight: '172px', overflowY: 'auto' }}>
              {disponibles.length === 0 ? (
                <p style={{ fontFamily: 'var(--font-code)', fontSize: '11px', color: TEXT_MUTED, textAlign: 'center', padding: '14px 0' }}>
                  Sin resultados
                </p>
              ) : (
                disponibles.map((puro) => {
                  const inCart = cart.find((i) => i.puro.id === puro.id);
                  return (
                    <ProductRow
                      key={puro.id}
                      puro={puro}
                      disabled={!!inCart && inCart.cantidad >= puro.stock}
                      onClick={() => addToCart(puro)}
                    />
                  );
                })
              )}
            </div>
          </div>

          {/* Cart */}
          <div style={{ padding: '18px 28px', flex: 1, overflowY: 'auto', backgroundColor: SURFACE_BG }}>
            <Label>{`Carrito${cart.length > 0 ? ` · ${cart.length}` : ''}`}</Label>
            {cart.length === 0 ? (
              <p style={{ fontFamily: 'var(--font-serif)', fontSize: '14px', fontStyle: 'italic', color: TEXT_MUTED, textAlign: 'center', padding: '28px 0' }}>
                Agrega productos para comenzar
              </p>
            ) : (
              cart.map(({ puro, cantidad }, i) => (
                <CartRow
                  key={puro.id}
                  puro={puro}
                  cantidad={cantidad}
                  isLast={i === cart.length - 1}
                  onUpdate={(n) => updateCantidad(puro.id, n)}
                />
              ))
            )}
          </div>
        </div>

        {/* ── Footer ── */}
        <div style={{ padding: '18px 28px', backgroundColor: SURFACE, borderTop: `1px solid ${BORDER}`, flexShrink: 0 }}>
          {error && (
            <p style={{ fontFamily: 'var(--font-code)', fontSize: '11px', color: '#C0202E', marginBottom: '10px' }}>
              {error}
            </p>
          )}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontFamily: 'var(--font-code)', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: TEXT_MUTED, margin: '0 0 4px' }}>
                Total
              </p>
              <p style={{ fontFamily: 'var(--font-serif)', fontSize: '30px', fontWeight: 500, color: OXBLOOD, margin: 0, fontVariantNumeric: 'tabular-nums' }}>
                ${total.toLocaleString('es-MX')}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CancelBtn onClick={handleClose} />
              <ConfirmBtn disabled={cart.length === 0 || isPending} isPending={isPending} onClick={handleConfirm} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CancelBtn({ onClick }: { onClick: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      type="button" onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        fontFamily: 'var(--font-code)', fontSize: '10px', letterSpacing: '0.16em',
        textTransform: 'uppercase', color: hov ? TEXT : TEXT_MUTED,
        background: 'none', border: 'none', cursor: 'pointer',
        padding: '12px 16px', transition: 'color 120ms',
      }}
    >
      Cancelar
    </button>
  );
}

function ConfirmBtn({ disabled, isPending, onClick }: { disabled: boolean; isPending: boolean; onClick: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      type="button" onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        fontFamily: 'var(--font-code)', fontSize: '10px', letterSpacing: '0.16em',
        textTransform: 'uppercase', color: '#F9F6F0',
        background: OXBLOOD,
        border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
        padding: '12px 20px', borderRadius: '6px',
        opacity: disabled ? 0.45 : hov ? 0.82 : 1,
        transition: 'opacity 150ms',
        display: 'flex', alignItems: 'center', gap: '8px',
      }}
    >
      {isPending && (
        <span style={{
          display: 'inline-block', width: '10px', height: '10px',
          borderRadius: '50%', border: '2px solid rgba(249,246,240,0.4)',
          borderTopColor: '#F9F6F0', animation: 'spin 0.6s linear infinite',
        }} />
      )}
      Confirmar Venta
    </button>
  );
}
