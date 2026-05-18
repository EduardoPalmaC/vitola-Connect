'use client';

import { useState, useMemo, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Pencil, X, Search, Check, Loader2 } from 'lucide-react';
import type { VentaConIndice, Puro } from '@/types';

const OXBLOOD = '#6B1E2A';
const BORDER = '#E2D9C8';
const TEXT = '#2C1E1A';
const TEXT_SEC = '#6B5C4A';
const TEXT_MUTED = '#9A8572';
const FONT_CODE = 'var(--font-code)';
const FONT_SERIF = 'var(--font-serif)';

type DateFilter = 'all' | 'thisMonth' | 'lastMonth' | 'thisWeek';

interface EditForm {
  fecha: string;
  producto: string;
  cantidad: number;
  precioUnitario: number;
  totalVenta: number;
  gananciaEstimada: number;
  clienteNombre: string;
  clienteContacto: string;
}

function parseFechaMX(fecha: string): Date {
  const parts = fecha.split('/');
  if (parts.length !== 3) return new Date(0);
  const [d, m, y] = parts;
  return new Date(parseInt(y!), parseInt(m!) - 1, parseInt(d!));
}

function fechaToISO(fecha: string): string {
  const parts = fecha.split('/');
  if (parts.length !== 3) return '';
  const [d, m, y] = parts;
  return `${y}-${m!.padStart(2, '0')}-${d!.padStart(2, '0')}`;
}

function isoToFechaMX(iso: string): string {
  const parts = iso.split('-');
  if (parts.length !== 3) return iso;
  const [y, m, d] = parts;
  return `${parseInt(d!)}/${parseInt(m!)}/${y}`;
}

function getDateRange(filter: DateFilter): { start: Date; end: Date } | null {
  const now = new Date();
  if (filter === 'thisWeek') {
    const day = now.getDay();
    const mon = new Date(now);
    mon.setDate(now.getDate() - ((day + 6) % 7));
    mon.setHours(0, 0, 0, 0);
    const sun = new Date(mon);
    sun.setDate(mon.getDate() + 6);
    sun.setHours(23, 59, 59, 999);
    return { start: mon, end: sun };
  }
  if (filter === 'thisMonth') {
    return {
      start: new Date(now.getFullYear(), now.getMonth(), 1),
      end: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59),
    };
  }
  if (filter === 'lastMonth') {
    const m = now.getMonth() - 1;
    const y = m < 0 ? now.getFullYear() - 1 : now.getFullYear();
    const mo = ((m + 12) % 12);
    return {
      start: new Date(y, mo, 1),
      end: new Date(y, mo + 1, 0, 23, 59),
    };
  }
  return null;
}

const DATE_FILTER_LABELS: Record<DateFilter, string> = {
  all: 'Todo',
  thisWeek: 'Esta semana',
  thisMonth: 'Este mes',
  lastMonth: 'Mes pasado',
};

interface Props {
  ventas: VentaConIndice[];
  puros: Puro[];
}

export default function VentasHistorialClient({ ventas, puros }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [editing, setEditing] = useState<VentaConIndice | null>(null);
  const [form, setForm] = useState<EditForm | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const filtered = useMemo(() => {
    let list = [...ventas].sort((a, b) =>
      parseFechaMX(b.fecha).getTime() - parseFechaMX(a.fecha).getTime()
    );

    const range = getDateRange(dateFilter);
    if (range) {
      list = list.filter((v) => {
        const d = parseFechaMX(v.fecha);
        return d >= range.start && d <= range.end;
      });
    }

    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (v) =>
          v.producto.toLowerCase().includes(q) ||
          (v.clienteNombre ?? '').toLowerCase().includes(q)
      );
    }

    return list;
  }, [ventas, search, dateFilter]);

  function openEdit(v: VentaConIndice) {
    setEditing(v);
    setSaveError('');
    setForm({
      fecha: fechaToISO(v.fecha),
      producto: v.producto,
      cantidad: v.cantidad,
      precioUnitario: v.precioUnitario,
      totalVenta: v.totalVenta,
      gananciaEstimada: v.gananciaEstimada,
      clienteNombre: v.clienteNombre ?? '',
      clienteContacto: v.clienteContacto ?? '',
    });
  }

  function closeEdit() {
    setEditing(null);
    setForm(null);
    setSaveError('');
  }

  function updateField<K extends keyof EditForm>(key: K, value: EditForm[K]) {
    setForm((prev) => {
      if (!prev) return prev;
      const next = { ...prev, [key]: value };
      if (key === 'cantidad' || key === 'precioUnitario') {
        const qty = key === 'cantidad' ? (value as number) : next.cantidad;
        const price = key === 'precioUnitario' ? (value as number) : next.precioUnitario;
        next.totalVenta = parseFloat((qty * price).toFixed(2));
      }
      return next;
    });
  }

  async function handleSave() {
    if (!editing || !form) return;
    setSaving(true);
    setSaveError('');

    try {
      const res = await fetch(`/api/ventas/${editing.rowIndex}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          venta: {
            fecha: isoToFechaMX(form.fecha),
            producto: form.producto,
            cantidad: form.cantidad,
            precioUnitario: form.precioUnitario,
            totalVenta: form.totalVenta,
            gananciaEstimada: form.gananciaEstimada,
            clienteNombre: form.clienteNombre || undefined,
            clienteContacto: form.clienteContacto || undefined,
          },
          oldCantidad: editing.cantidad,
          oldProducto: editing.producto,
        }),
      });

      if (!res.ok) throw new Error('Error al guardar');

      closeEdit();
      startTransition(() => router.refresh());
    } catch {
      setSaveError('No se pudo guardar. Intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  }

  const filteredRevenue = filtered.reduce((s, v) => s + v.totalVenta, 0);

  return (
    <>
      {/* Filters bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        marginBottom: '20px', flexWrap: 'wrap',
      }}>
        <div style={{
          position: 'relative', flex: '1 1 260px', maxWidth: '360px',
        }}>
          <Search
            size={13}
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: TEXT_MUTED }}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por cliente o producto…"
            style={{
              width: '100%', padding: '8px 12px 8px 34px',
              fontFamily: FONT_CODE, fontSize: '11px', letterSpacing: '0.04em',
              color: TEXT, background: '#FFFFFF',
              border: `1px solid ${BORDER}`, outline: 'none',
              transition: 'border-color 0.15s',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {(Object.keys(DATE_FILTER_LABELS) as DateFilter[]).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setDateFilter(f)}
              style={{
                padding: '7px 14px',
                fontFamily: FONT_CODE, fontSize: '10px',
                letterSpacing: '0.12em', textTransform: 'uppercase',
                border: `1px solid ${dateFilter === f ? OXBLOOD : BORDER}`,
                background: dateFilter === f ? OXBLOOD : '#FFFFFF',
                color: dateFilter === f ? '#F9F2EC' : TEXT_MUTED,
                cursor: 'pointer', transition: 'all 0.15s',
              }}
            >
              {DATE_FILTER_LABELS[f]}
            </button>
          ))}
        </div>
      </div>

      {/* Results line */}
      <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{
          fontFamily: FONT_CODE, fontSize: '9px',
          letterSpacing: '0.28em', textTransform: 'uppercase',
          color: '#B0A090', margin: 0,
        }}>
          {filtered.length} {filtered.length === 1 ? 'venta' : 'ventas'}
          {dateFilter !== 'all' && ` · ${DATE_FILTER_LABELS[dateFilter]}`}
        </p>
        {filtered.length > 0 && (
          <p style={{
            fontFamily: FONT_CODE, fontSize: '10px',
            color: OXBLOOD, margin: 0, fontWeight: 600,
          }}>
            Total: ${filteredRevenue.toLocaleString('es-MX', { minimumFractionDigits: 0 })}
          </p>
        )}
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto" style={{ border: `1px solid ${BORDER}`, background: '#FFFFFF' }}>
        <table className="min-w-[580px] md:w-full" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
              {['Fecha', 'Cliente', 'Producto', 'Cantidad', 'P. Unitario', 'Total', ''].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: '10px 16px',
                    fontFamily: FONT_CODE, fontSize: '9px',
                    letterSpacing: '0.28em', textTransform: 'uppercase',
                    color: '#B0A090', fontWeight: 400,
                    textAlign: h === 'Total' ? 'right' : 'left',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  style={{
                    padding: '48px 16px', textAlign: 'center',
                    fontFamily: FONT_CODE, fontSize: '11px',
                    color: TEXT_MUTED, letterSpacing: '0.08em',
                  }}
                >
                  No se encontraron ventas
                </td>
              </tr>
            ) : (
              filtered.map((v) => (
                <VentaRow
                  key={v.rowIndex}
                  venta={v}
                  onEdit={openEdit}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editing && form && (
        <div
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(20,12,8,0.55)',
            backdropFilter: 'blur(2px)',
            zIndex: 50,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '24px',
          }}
          onClick={(e) => { if (e.target === e.currentTarget) closeEdit(); }}
        >
          <div style={{
            background: '#F9F6F0',
            border: `1px solid #DDD5C5`,
            boxShadow: '0 24px 60px rgba(20,12,8,0.25)',
            width: 'min(90vw, 620px)',
            maxHeight: '90vh',
            overflowY: 'auto',
            position: 'relative',
          }}>
            {/* Modal header */}
            <div style={{
              padding: '28px 32px 20px',
              borderBottom: `1px solid ${BORDER}`,
              display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
            }}>
              <div>
                <p style={{
                  fontFamily: FONT_CODE, fontSize: '9px',
                  letterSpacing: '0.28em', textTransform: 'uppercase',
                  color: '#B0A090', margin: '0 0 8px',
                }}>
                  Editar Venta · fila {editing.rowIndex}
                </p>
                <h2 style={{
                  fontFamily: FONT_SERIF, fontSize: '22px',
                  fontWeight: 700, color: TEXT, margin: 0, lineHeight: 1,
                }}>
                  {editing.producto}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeEdit}
                style={{
                  background: 'transparent', border: 'none',
                  cursor: 'pointer', color: TEXT_MUTED,
                  padding: '4px', display: 'flex',
                }}
              >
                <X size={16} strokeWidth={1.5} />
              </button>
            </div>

            {/* Modal body */}
            <div style={{ padding: '28px 32px' }}>
              <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: '20px' }}>
                <FieldGroup label="Fecha">
                  <input
                    type="date"
                    value={form.fecha}
                    max={new Date().toISOString().split('T')[0]}
                    onChange={(e) => updateField('fecha', e.target.value)}
                    style={inputStyle}
                  />
                </FieldGroup>

                <FieldGroup label="Producto">
                  <input
                    type="text"
                    value={form.producto}
                    onChange={(e) => updateField('producto', e.target.value)}
                    style={inputStyle}
                  />
                </FieldGroup>

                <FieldGroup label="Cantidad">
                  <input
                    type="number"
                    min={1}
                    value={form.cantidad}
                    onChange={(e) => updateField('cantidad', parseInt(e.target.value) || 1)}
                    style={inputStyle}
                  />
                </FieldGroup>

                <FieldGroup label="Precio unitario ($)">
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    value={form.precioUnitario}
                    onChange={(e) => updateField('precioUnitario', parseFloat(e.target.value) || 0)}
                    style={inputStyle}
                  />
                </FieldGroup>

                <FieldGroup label="Total venta ($)">
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    value={form.totalVenta}
                    onChange={(e) => updateField('totalVenta', parseFloat(e.target.value) || 0)}
                    style={inputStyle}
                  />
                </FieldGroup>

                <FieldGroup label="Ganancia estimada ($)">
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    value={form.gananciaEstimada}
                    onChange={(e) => updateField('gananciaEstimada', parseFloat(e.target.value) || 0)}
                    style={inputStyle}
                  />
                </FieldGroup>

                <FieldGroup label="Cliente">
                  <input
                    type="text"
                    value={form.clienteNombre}
                    onChange={(e) => updateField('clienteNombre', e.target.value)}
                    placeholder="Sin cliente"
                    style={inputStyle}
                  />
                </FieldGroup>

                <FieldGroup label="Contacto">
                  <input
                    type="text"
                    value={form.clienteContacto}
                    onChange={(e) => updateField('clienteContacto', e.target.value)}
                    placeholder="WhatsApp / email"
                    style={inputStyle}
                  />
                </FieldGroup>
              </div>

              {editing.cantidad !== form.cantidad && (
                <div style={{
                  marginTop: '20px', padding: '12px 16px',
                  background: '#FFF8F0',
                  border: `1px solid #E8CDA0`,
                  fontFamily: FONT_CODE, fontSize: '10px',
                  color: '#7A5020', letterSpacing: '0.04em',
                }}>
                  Cantidad cambiada de {editing.cantidad} a {form.cantidad}. El inventario
                  se ajustará automáticamente si el producto coincide con un puro registrado.
                </div>
              )}

              {saveError && (
                <p style={{
                  marginTop: '16px', padding: '10px 14px',
                  background: '#FFF0F0', border: '1px solid #F5C5C5',
                  fontFamily: FONT_CODE, fontSize: '10px',
                  color: '#8B1A1A', letterSpacing: '0.04em',
                }}>
                  {saveError}
                </p>
              )}

              <div style={{
                marginTop: '28px', paddingTop: '20px',
                borderTop: `1px solid ${BORDER}`,
                display: 'flex', gap: '10px', justifyContent: 'flex-end',
              }}>
                <button
                  type="button"
                  onClick={closeEdit}
                  style={{
                    padding: '9px 20px',
                    fontFamily: FONT_CODE, fontSize: '10px',
                    letterSpacing: '0.14em', textTransform: 'uppercase',
                    background: 'transparent',
                    border: `1px solid ${BORDER}`,
                    color: TEXT_MUTED, cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  style={{
                    padding: '9px 24px',
                    fontFamily: FONT_CODE, fontSize: '10px',
                    letterSpacing: '0.14em', textTransform: 'uppercase',
                    background: saving ? '#9A6070' : OXBLOOD,
                    border: 'none', color: '#F9F2EC',
                    cursor: saving ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', gap: '8px',
                    transition: 'background 0.15s',
                  }}
                >
                  {saving ? (
                    <><Loader2 size={12} style={{ animation: 'spin 0.8s linear infinite' }} /> Guardando</>
                  ) : (
                    <><Check size={12} /> Guardar Cambios</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
    </>
  );
}

function VentaRow({ venta, onEdit }: { venta: VentaConIndice; onEdit: (v: VentaConIndice) => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <tr
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderBottom: `1px solid ${BORDER}`,
        background: hovered ? '#FAF7F3' : '#FFFFFF',
        transition: 'background 0.1s',
      }}
    >
      <td style={{ padding: '10px 16px', whiteSpace: 'nowrap' }}>
        <span style={{ fontFamily: FONT_CODE, fontSize: '11px', color: TEXT_SEC }}>
          {venta.fecha}
        </span>
      </td>
      <td style={{ padding: '10px 16px' }}>
        {venta.clienteNombre ? (
          <span style={{ fontFamily: FONT_SERIF, fontSize: '13px', fontWeight: 600, color: TEXT }}>
            {venta.clienteNombre}
          </span>
        ) : (
          <span style={{ fontFamily: FONT_CODE, fontSize: '10px', color: '#C0B0A0', letterSpacing: '0.08em' }}>
            Sin cliente
          </span>
        )}
      </td>
      <td style={{ padding: '10px 16px', maxWidth: '220px' }}>
        <span style={{ fontFamily: FONT_SERIF, fontSize: '13px', color: TEXT }}>
          {venta.producto}
        </span>
      </td>
      <td style={{ padding: '10px 16px' }}>
        <span style={{
          fontFamily: FONT_CODE, fontSize: '12px',
          color: TEXT_SEC, fontWeight: 600,
        }}>
          ×{venta.cantidad}
        </span>
      </td>
      <td style={{ padding: '10px 16px' }}>
        <span style={{ fontFamily: FONT_CODE, fontSize: '11px', color: TEXT_MUTED }}>
          ${venta.precioUnitario.toLocaleString('es-MX')}
        </span>
      </td>
      <td style={{ padding: '10px 16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
        <span style={{
          fontFamily: FONT_SERIF, fontSize: '14px',
          fontWeight: 700, color: OXBLOOD,
        }}>
          ${venta.totalVenta.toLocaleString('es-MX', { minimumFractionDigits: 0 })}
        </span>
      </td>
      <td style={{ padding: '10px 12px', textAlign: 'right' }}>
        <button
          type="button"
          onClick={() => onEdit(venta)}
          title="Editar venta"
          style={{
            background: 'transparent', border: 'none',
            cursor: 'pointer', padding: '4px',
            color: hovered ? TEXT_SEC : '#C8BBAD',
            display: 'flex', alignItems: 'center',
            transition: 'color 0.15s',
          }}
        >
          <Pencil size={13} strokeWidth={1.5} />
        </button>
      </td>
    </tr>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '9px 12px',
  fontFamily: FONT_CODE,
  fontSize: '12px',
  color: TEXT,
  background: '#FFFFFF',
  border: `1px solid ${BORDER}`,
  outline: 'none',
  transition: 'border-color 0.15s',
  boxSizing: 'border-box',
};

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <label style={{
        fontFamily: FONT_CODE, fontSize: '9px',
        letterSpacing: '0.24em', textTransform: 'uppercase',
        color: '#B0A090',
      }}>
        {label}
      </label>
      {children}
    </div>
  );
}
