'use client';

import { useState } from 'react';
import type { EntradaInventario } from '@/types';

interface Props {
  puroId: string;
  puroNombre: string;
  stockActual: number;
  entradas: EntradaInventario[];
}

const inputStyle = {
  backgroundColor: '#111',
  border: '1px solid #333',
  color: '#F0E6D2',
  fontFamily: 'var(--font-code)',
};

const labelStyle: React.CSSProperties = {
  color: '#8B6F47',
  fontFamily: 'var(--font-code)',
  letterSpacing: '0.05em',
  fontSize: '11px',
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block mb-1.5 uppercase" style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

function NumInput({ value, onChange, placeholder, step = '0.01', min = '0' }: {
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  step?: string;
  min?: string;
}) {
  return (
    <input
      type="number"
      min={min}
      step={step}
      value={value}
      onChange={onChange}
      placeholder={placeholder ?? '0.00'}
      className="w-full rounded-md px-3 py-2 text-sm outline-none"
      style={inputStyle}
    />
  );
}

interface EditState {
  fecha: string;
  cantidad: string;
  costoUnitario: string;
  notas: string;
  costMode: 'pieza' | 'mazo';
  precioBruto: string;
  costoTransporte: string;
  costoAlmacenamiento: string;
  costoMazo: string;
  purosPorMazo: string;
  transporteMazo: string;
  almacenamientoMazo: string;
}

function buildEditState(e: EntradaInventario): EditState {
  return {
    fecha: e.fecha,
    cantidad: String(e.cantidad),
    costoUnitario: String(e.costoUnitario),
    notas: e.notas ?? '',
    costMode: 'pieza',
    precioBruto: String(e.costoUnitario),
    costoTransporte: '0',
    costoAlmacenamiento: '0',
    costoMazo: String(e.costoUnitario * e.cantidad),
    purosPorMazo: String(e.cantidad),
    transporteMazo: '0',
    almacenamientoMazo: '0',
  };
}

export default function EntradaForm({ puroId, puroNombre, stockActual, entradas }: Props) {
  // ── New entry form state ──
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10));
  const [cantidad, setCantidad] = useState('');
  const [notas, setNotas] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [listaEntradas, setListaEntradas] = useState<EntradaInventario[]>(entradas);
  const [stockDisplay, setStockDisplay] = useState(stockActual);

  const [costMode, setCostMode] = useState<'pieza' | 'mazo'>('pieza');
  const [precioBruto, setPrecioBruto] = useState('');
  const [costoTransporte, setCostoTransporte] = useState('');
  const [costoAlmacenamiento, setCostoAlmacenamiento] = useState('');
  const [costoMazo, setCostoMazo] = useState('');
  const [purosPorMazo, setPurosPorMazo] = useState('25');
  const [transporteMazo, setTransporteMazo] = useState('');
  const [almacenamientoMazo, setAlmacenamientoMazo] = useState('');

  // ── Edit state ──
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editState, setEditState] = useState<EditState | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // ── Derived cost ──
  const qty = Number(purosPorMazo) || 1;
  const costoUnitario = costMode === 'pieza'
    ? (Number(precioBruto) || 0) + (Number(costoTransporte) || 0) + (Number(costoAlmacenamiento) || 0)
    : qty > 0
      ? ((Number(costoMazo) || 0) + (Number(transporteMazo) || 0) + (Number(almacenamientoMazo) || 0)) / qty
      : 0;

  const editQty = Number(editState?.purosPorMazo) || 1;
  const editCostoUnitario = editState
    ? editState.costMode === 'pieza'
      ? (Number(editState.precioBruto) || 0) + (Number(editState.costoTransporte) || 0) + (Number(editState.costoAlmacenamiento) || 0)
      : editQty > 0
        ? ((Number(editState.costoMazo) || 0) + (Number(editState.transporteMazo) || 0) + (Number(editState.almacenamientoMazo) || 0)) / editQty
        : 0
    : 0;

  // ── New entry cost sync ──
  function handlePrecioBruto(e: React.ChangeEvent<HTMLInputElement>) { const v = e.target.value; setPrecioBruto(v); setCostoMazo(String(parseFloat(((Number(v)||0)*qty).toFixed(2)))); }
  function handleCostoTransporte(e: React.ChangeEvent<HTMLInputElement>) { const v = e.target.value; setCostoTransporte(v); setTransporteMazo(String(parseFloat(((Number(v)||0)*qty).toFixed(2)))); }
  function handleCostoAlmacenamiento(e: React.ChangeEvent<HTMLInputElement>) { const v = e.target.value; setCostoAlmacenamiento(v); setAlmacenamientoMazo(String(parseFloat(((Number(v)||0)*qty).toFixed(2)))); }
  function handleCostoMazo(e: React.ChangeEvent<HTMLInputElement>) { const v = e.target.value; setCostoMazo(v); setPrecioBruto(String(parseFloat((qty>0?(Number(v)||0)/qty:0).toFixed(4)))); }
  function handleTransporteMazo(e: React.ChangeEvent<HTMLInputElement>) { const v = e.target.value; setTransporteMazo(v); setCostoTransporte(String(parseFloat((qty>0?(Number(v)||0)/qty:0).toFixed(4)))); }
  function handleAlmacenamientoMazo(e: React.ChangeEvent<HTMLInputElement>) { const v = e.target.value; setAlmacenamientoMazo(v); setCostoAlmacenamiento(String(parseFloat((qty>0?(Number(v)||0)/qty:0).toFixed(4)))); }
  function handlePurosPorMazo(e: React.ChangeEvent<HTMLInputElement>) {
    const newQty = Number(e.target.value) || 1; setPurosPorMazo(e.target.value);
    if (costMode === 'mazo') { setPrecioBruto(String(parseFloat(((Number(costoMazo)||0)/newQty).toFixed(4)))); setCostoTransporte(String(parseFloat(((Number(transporteMazo)||0)/newQty).toFixed(4)))); setCostoAlmacenamiento(String(parseFloat(((Number(almacenamientoMazo)||0)/newQty).toFixed(4)))); }
    else { setCostoMazo(String(parseFloat(((Number(precioBruto)||0)*newQty).toFixed(2)))); setTransporteMazo(String(parseFloat(((Number(costoTransporte)||0)*newQty).toFixed(2)))); setAlmacenamientoMazo(String(parseFloat(((Number(costoAlmacenamiento)||0)*newQty).toFixed(2)))); }
  }

  // ── Edit cost sync ──
  function setEdit(patch: Partial<EditState>) { setEditState((prev) => prev ? { ...prev, ...patch } : prev); }
  function handleEditPrecioBruto(e: React.ChangeEvent<HTMLInputElement>) { const v = e.target.value; setEdit({ precioBruto: v, costoMazo: String(parseFloat(((Number(v)||0)*editQty).toFixed(2))) }); }
  function handleEditCostoTransporte(e: React.ChangeEvent<HTMLInputElement>) { const v = e.target.value; setEdit({ costoTransporte: v, transporteMazo: String(parseFloat(((Number(v)||0)*editQty).toFixed(2))) }); }
  function handleEditCostoAlmacenamiento(e: React.ChangeEvent<HTMLInputElement>) { const v = e.target.value; setEdit({ costoAlmacenamiento: v, almacenamientoMazo: String(parseFloat(((Number(v)||0)*editQty).toFixed(2))) }); }
  function handleEditCostoMazo(e: React.ChangeEvent<HTMLInputElement>) { const v = e.target.value; setEdit({ costoMazo: v, precioBruto: String(parseFloat((editQty>0?(Number(v)||0)/editQty:0).toFixed(4))) }); }
  function handleEditTransporteMazo(e: React.ChangeEvent<HTMLInputElement>) { const v = e.target.value; setEdit({ transporteMazo: v, costoTransporte: String(parseFloat((editQty>0?(Number(v)||0)/editQty:0).toFixed(4))) }); }
  function handleEditAlmacenamientoMazo(e: React.ChangeEvent<HTMLInputElement>) { const v = e.target.value; setEdit({ almacenamientoMazo: v, costoAlmacenamiento: String(parseFloat((editQty>0?(Number(v)||0)/editQty:0).toFixed(4))) }); }
  function handleEditPurosPorMazo(e: React.ChangeEvent<HTMLInputElement>) {
    const newQty = Number(e.target.value) || 1;
    if (!editState) return;
    if (editState.costMode === 'mazo') { setEdit({ purosPorMazo: e.target.value, precioBruto: String(parseFloat(((Number(editState.costoMazo)||0)/newQty).toFixed(4))), costoTransporte: String(parseFloat(((Number(editState.transporteMazo)||0)/newQty).toFixed(4))), costoAlmacenamiento: String(parseFloat(((Number(editState.almacenamientoMazo)||0)/newQty).toFixed(4))) }); }
    else { setEdit({ purosPorMazo: e.target.value, costoMazo: String(parseFloat(((Number(editState.precioBruto)||0)*newQty).toFixed(2))), transporteMazo: String(parseFloat(((Number(editState.costoTransporte)||0)*newQty).toFixed(2))), almacenamientoMazo: String(parseFloat(((Number(editState.costoAlmacenamiento)||0)*newQty).toFixed(2))) }); }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!cantidad || costoUnitario <= 0) { setError('Cantidad y costo son requeridos.'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/entradas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ puroId, fecha, cantidad: Number(cantidad), costoUnitario: parseFloat(costoUnitario.toFixed(4)), notas }),
      });
      if (!res.ok) { const d = await res.json() as { error?: string }; throw new Error(d.error ?? 'Error al registrar entrada'); }
      const nueva = await res.json() as EntradaInventario;
      setListaEntradas((prev) => [nueva, ...prev]);
      setStockDisplay((prev) => prev + Number(cantidad));
      setCantidad(''); setPrecioBruto(''); setCostoTransporte(''); setCostoAlmacenamiento(''); setCostoMazo(''); setTransporteMazo(''); setAlmacenamientoMazo(''); setNotas('');
    } catch (err) { setError(err instanceof Error ? err.message : 'Error desconocido'); }
    finally { setLoading(false); }
  }

  async function handleEditSave(entradaId: string) {
    if (!editState) return;
    setEditError('');
    if (!editState.cantidad || editCostoUnitario <= 0) { setEditError('Cantidad y costo son requeridos.'); return; }
    setEditLoading(true);
    try {
      const res = await fetch(`/api/entradas/${entradaId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fecha: editState.fecha, cantidad: Number(editState.cantidad), costoUnitario: parseFloat(editCostoUnitario.toFixed(4)), notas: editState.notas }),
      });
      if (!res.ok) { const d = await res.json() as { error?: string }; throw new Error(d.error ?? 'Error al guardar'); }
      const updated = await res.json() as EntradaInventario;
      const oldEntry = listaEntradas.find((e) => e.id === entradaId);
      const delta = updated.cantidad - (oldEntry?.cantidad ?? 0);
      setStockDisplay((prev) => prev + delta);
      setListaEntradas((prev) => prev.map((e) => e.id === entradaId ? updated : e));
      setEditingId(null);
      setEditState(null);
    } catch (err) { setEditError(err instanceof Error ? err.message : 'Error desconocido'); }
    finally { setEditLoading(false); }
  }

  async function handleDelete(entradaId: string, cantidadEntrada: number) {
    if (!confirm('¿Eliminar esta entrada? El stock se reducirá automáticamente.')) return;
    setDeletingId(entradaId);
    try {
      const res = await fetch(`/api/entradas/${entradaId}`, { method: 'DELETE' });
      if (!res.ok) { const d = await res.json() as { error?: string }; throw new Error(d.error ?? 'Error al eliminar'); }
      setListaEntradas((prev) => prev.filter((e) => e.id !== entradaId));
      setStockDisplay((prev) => Math.max(0, prev - cantidadEntrada));
    } catch (err) { alert(err instanceof Error ? err.message : 'Error al eliminar'); }
    finally { setDeletingId(null); }
  }

  const tabBase: React.CSSProperties = { padding: '6px 16px', fontSize: '13px', fontFamily: 'var(--font-code)', cursor: 'pointer', transition: 'all 150ms', border: 'none' };

  function CostFields({ mode, onModeChange, pb, ct, ca, cm, ppm, tm, am, onPb, onCt, onCa, onCm, onPpm, onTm, onAm, costoTotal }: {
    mode: 'pieza' | 'mazo'; onModeChange: (m: 'pieza' | 'mazo') => void;
    pb: string; ct: string; ca: string; cm: string; ppm: string; tm: string; am: string;
    onPb: (e: React.ChangeEvent<HTMLInputElement>) => void; onCt: (e: React.ChangeEvent<HTMLInputElement>) => void; onCa: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onCm: (e: React.ChangeEvent<HTMLInputElement>) => void; onPpm: (e: React.ChangeEvent<HTMLInputElement>) => void; onTm: (e: React.ChangeEvent<HTMLInputElement>) => void; onAm: (e: React.ChangeEvent<HTMLInputElement>) => void;
    costoTotal: number;
  }) {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <span style={{ color: '#8B6F47', fontFamily: 'var(--font-code)', fontSize: '12px' }}>INGRESAR COSTO POR:</span>
          <div className="flex rounded-md overflow-hidden" style={{ border: '1px solid #333' }}>
            {(['pieza', 'mazo'] as const).map((m, i) => (
              <button key={m} type="button" onClick={() => onModeChange(m)}
                style={{ ...tabBase, backgroundColor: mode === m ? '#8B6F47' : '#111', color: mode === m ? '#F0E6D2' : '#9A8572', borderLeft: i === 1 ? '1px solid #333' : 'none' }}>
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </button>
            ))}
          </div>
        </div>
        {mode === 'pieza' ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Costo unitario ($)"><NumInput value={pb} onChange={onPb} /></Field>
            <Field label="Transporte ($)"><NumInput value={ct} onChange={onCt} /></Field>
            <Field label="Almacenamiento ($)"><NumInput value={ca} onChange={onCa} /></Field>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Costo total del mazo ($)"><NumInput value={cm} onChange={onCm} /></Field>
            <Field label="Puros por mazo"><NumInput value={ppm} onChange={onPpm} step="1" min="1" /></Field>
            <Field label="Transporte del mazo ($)"><NumInput value={tm} onChange={onTm} /></Field>
            <Field label="Almacenamiento del mazo ($)"><NumInput value={am} onChange={onAm} /></Field>
          </div>
        )}
        {costoTotal > 0 && (
          <div className="rounded-lg p-3" style={{ backgroundColor: '#111', border: '1px solid #2A2A2A' }}>
            <span style={{ color: '#8B6F47', fontFamily: 'var(--font-code)', fontSize: '11px' }}>COSTO TOTAL UNITARIO: </span>
            <span style={{ color: '#F0E6D2', fontFamily: 'var(--font-code)', fontWeight: 600 }}>${costoTotal.toFixed(4)}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      {/* ── Nueva entrada ── */}
      <div className="rounded-xl p-6 mb-6" style={{ backgroundColor: '#1A1A1A', border: '1px solid #2A2A2A' }}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold" style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', color: '#F0E6D2' }}>Nueva entrada</h2>
          <span className="text-sm" style={{ color: '#8B6F47', fontFamily: 'var(--font-code)' }}>
            Stock actual: <span style={{ color: '#F0E6D2', fontWeight: 600 }}>{stockDisplay}</span>
          </span>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Fecha de entrada">
              <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} required className="w-full rounded-md px-3 py-2 text-sm outline-none" style={inputStyle} />
            </Field>
            <Field label="Cantidad">
              <NumInput value={cantidad} onChange={(e) => setCantidad(e.target.value)} placeholder="0" step="1" min="1" />
            </Field>
          </div>
          <CostFields
            mode={costMode} onModeChange={setCostMode}
            pb={precioBruto} ct={costoTransporte} ca={costoAlmacenamiento}
            cm={costoMazo} ppm={purosPorMazo} tm={transporteMazo} am={almacenamientoMazo}
            onPb={handlePrecioBruto} onCt={handleCostoTransporte} onCa={handleCostoAlmacenamiento}
            onCm={handleCostoMazo} onPpm={handlePurosPorMazo} onTm={handleTransporteMazo} onAm={handleAlmacenamientoMazo}
            costoTotal={costoUnitario}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Notas (opcional)">
              <input type="text" value={notas} onChange={(e) => setNotas(e.target.value)} placeholder="Proveedor, lote, etc." className="w-full rounded-md px-3 py-2 text-sm outline-none" style={inputStyle} />
            </Field>
          </div>
          <div className="flex items-center justify-between pt-1">
            {error ? <p className="text-sm" style={{ color: '#EF4444', fontFamily: 'var(--font-code)' }}>{error}</p> : <span />}
            <button type="submit" disabled={loading} className="transition-opacity hover:opacity-85 disabled:opacity-50"
              style={{ padding: '8px 20px', borderRadius: '6px', backgroundColor: '#2C1810', border: '1px solid #8B6F47', color: '#F0E6D2', fontSize: '13px', fontFamily: 'var(--font-code)', fontWeight: 500, letterSpacing: '0.04em', cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Guardando…' : '+ Registrar entrada'}
            </button>
          </div>
        </form>
      </div>

      {/* ── Historial ── */}
      {listaEntradas.length > 0 && (
        <div className="rounded-xl p-6" style={{ backgroundColor: '#1A1A1A', border: '1px solid #2A2A2A' }}>
          <h3 className="font-semibold mb-4" style={{ fontFamily: 'var(--font-serif)', fontSize: '15px', color: '#F0E6D2' }}>
            Historial de entradas — {puroNombre}
          </h3>
          <div className="flex flex-col gap-4">
            {listaEntradas.map((e) => {
              const isEditing = editingId === e.id;
              return (
                <div key={e.id} className="rounded-lg p-4" style={{ backgroundColor: '#111', border: `1px solid ${isEditing ? '#8B6F47' : '#222'}` }}>
                  {!isEditing ? (
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-6 flex-wrap">
                        <span style={{ color: '#9A8572', fontFamily: 'var(--font-code)', fontSize: '13px' }}>{e.fecha}</span>
                        <span style={{ color: '#10B981', fontFamily: 'var(--font-code)', fontSize: '13px', fontWeight: 600 }}>+{e.cantidad} uds</span>
                        <span style={{ color: '#F0E6D2', fontFamily: 'var(--font-code)', fontSize: '13px' }}>${e.costoUnitario.toFixed(4)}/ud</span>
                        {e.notas && <span style={{ color: '#9A8572', fontFamily: 'var(--font-code)', fontSize: '12px' }}>{e.notas}</span>}
                      </div>
                      <div className="flex items-center gap-3">
                        <button type="button" onClick={() => { setEditingId(e.id); setEditState(buildEditState(e)); setEditError(''); }}
                          style={{ color: '#8B6F47', fontFamily: 'var(--font-code)', fontSize: '12px', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.04em' }}>
                          Editar
                        </button>
                        <button type="button" disabled={deletingId === e.id} onClick={() => handleDelete(e.id, e.cantidad)}
                          style={{ color: '#EF4444', fontFamily: 'var(--font-code)', fontSize: '12px', background: 'none', border: 'none', cursor: deletingId === e.id ? 'not-allowed' : 'pointer', opacity: deletingId === e.id ? 0.5 : 1 }}>
                          {deletingId === e.id ? '…' : 'Eliminar'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="Fecha">
                          <input type="date" value={editState!.fecha} onChange={(ev) => setEdit({ fecha: ev.target.value })} className="w-full rounded-md px-3 py-2 text-sm outline-none" style={inputStyle} />
                        </Field>
                        <Field label="Cantidad">
                          <NumInput value={editState!.cantidad} onChange={(ev) => setEdit({ cantidad: ev.target.value })} step="1" min="1" />
                        </Field>
                      </div>
                      <CostFields
                        mode={editState!.costMode}
                        onModeChange={(m) => setEdit({ costMode: m })}
                        pb={editState!.precioBruto} ct={editState!.costoTransporte} ca={editState!.costoAlmacenamiento}
                        cm={editState!.costoMazo} ppm={editState!.purosPorMazo} tm={editState!.transporteMazo} am={editState!.almacenamientoMazo}
                        onPb={handleEditPrecioBruto} onCt={handleEditCostoTransporte} onCa={handleEditCostoAlmacenamiento}
                        onCm={handleEditCostoMazo} onPpm={handleEditPurosPorMazo} onTm={handleEditTransporteMazo} onAm={handleEditAlmacenamientoMazo}
                        costoTotal={editCostoUnitario}
                      />
                      <Field label="Notas (opcional)">
                        <input type="text" value={editState!.notas} onChange={(ev) => setEdit({ notas: ev.target.value })} className="w-full rounded-md px-3 py-2 text-sm outline-none" style={inputStyle} />
                      </Field>
                      {editError && <p style={{ color: '#EF4444', fontFamily: 'var(--font-code)', fontSize: '12px' }}>{editError}</p>}
                      <div className="flex items-center gap-3 justify-end">
                        <button type="button" onClick={() => { setEditingId(null); setEditState(null); }}
                          style={{ color: '#9A8572', fontFamily: 'var(--font-code)', fontSize: '12px', background: 'none', border: 'none', cursor: 'pointer' }}>
                          Cancelar
                        </button>
                        <button type="button" disabled={editLoading} onClick={() => handleEditSave(e.id)}
                          style={{ padding: '6px 16px', borderRadius: '6px', backgroundColor: '#2C1810', border: '1px solid #8B6F47', color: '#F0E6D2', fontSize: '12px', fontFamily: 'var(--font-code)', cursor: editLoading ? 'not-allowed' : 'pointer', opacity: editLoading ? 0.5 : 1 }}>
                          {editLoading ? 'Guardando…' : 'Guardar cambios'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
