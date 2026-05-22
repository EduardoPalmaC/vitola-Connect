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

const labelStyle = {
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

export default function EntradaForm({ puroId, puroNombre, stockActual, entradas }: Props) {
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10));
  const [cantidad, setCantidad] = useState('');
  const [notas, setNotas] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [listaEntradas, setListaEntradas] = useState<EntradaInventario[]>(entradas);
  const [stockDisplay, setStockDisplay] = useState(stockActual);

  const [costMode, setCostMode] = useState<'pieza' | 'mazo'>('pieza');

  // Pieza
  const [precioBruto, setPrecioBruto] = useState('');
  const [costoTransporte, setCostoTransporte] = useState('');
  const [costoAlmacenamiento, setCostoAlmacenamiento] = useState('');

  // Mazo
  const [costoMazo, setCostoMazo] = useState('');
  const [purosPorMazo, setPurosPorMazo] = useState('25');
  const [transporteMazo, setTransporteMazo] = useState('');
  const [almacenamientoMazo, setAlmacenamientoMazo] = useState('');

  // Derived unit cost
  const qty = Number(purosPorMazo) || 1;
  const costoUnitario = costMode === 'pieza'
    ? (Number(precioBruto) || 0) + (Number(costoTransporte) || 0) + (Number(costoAlmacenamiento) || 0)
    : qty > 0
      ? ((Number(costoMazo) || 0) + (Number(transporteMazo) || 0) + (Number(almacenamientoMazo) || 0)) / qty
      : 0;

  // Sync pieza → mazo
  function handlePrecioBruto(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    setPrecioBruto(v);
    setCostoMazo(String(parseFloat(((Number(v) || 0) * qty).toFixed(2))));
  }
  function handleCostoTransporte(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    setCostoTransporte(v);
    setTransporteMazo(String(parseFloat(((Number(v) || 0) * qty).toFixed(2))));
  }
  function handleCostoAlmacenamiento(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    setCostoAlmacenamiento(v);
    setAlmacenamientoMazo(String(parseFloat(((Number(v) || 0) * qty).toFixed(2))));
  }

  // Sync mazo → pieza
  function handleCostoMazo(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    setCostoMazo(v);
    setPrecioBruto(String(parseFloat((qty > 0 ? (Number(v) || 0) / qty : 0).toFixed(4))));
  }
  function handleTransporteMazo(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    setTransporteMazo(v);
    setCostoTransporte(String(parseFloat((qty > 0 ? (Number(v) || 0) / qty : 0).toFixed(4))));
  }
  function handleAlmacenamientoMazo(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    setAlmacenamientoMazo(v);
    setCostoAlmacenamiento(String(parseFloat((qty > 0 ? (Number(v) || 0) / qty : 0).toFixed(4))));
  }
  function handlePurosPorMazo(e: React.ChangeEvent<HTMLInputElement>) {
    const newQty = Number(e.target.value) || 1;
    setPurosPorMazo(e.target.value);
    if (costMode === 'mazo') {
      setPrecioBruto(String(parseFloat(((Number(costoMazo) || 0) / newQty).toFixed(4))));
      setCostoTransporte(String(parseFloat(((Number(transporteMazo) || 0) / newQty).toFixed(4))));
      setCostoAlmacenamiento(String(parseFloat(((Number(almacenamientoMazo) || 0) / newQty).toFixed(4))));
    } else {
      setCostoMazo(String(parseFloat(((Number(precioBruto) || 0) * newQty).toFixed(2))));
      setTransporteMazo(String(parseFloat(((Number(costoTransporte) || 0) * newQty).toFixed(2))));
      setAlmacenamientoMazo(String(parseFloat(((Number(costoAlmacenamiento) || 0) * newQty).toFixed(2))));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!cantidad || costoUnitario <= 0) {
      setError('Cantidad y costo son requeridos.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/entradas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          puroId,
          fecha,
          cantidad: Number(cantidad),
          costoUnitario: parseFloat(costoUnitario.toFixed(4)),
          notas,
        }),
      });
      if (!res.ok) {
        const data = await res.json() as { error?: string };
        throw new Error(data.error ?? 'Error al registrar entrada');
      }
      const nueva = await res.json() as EntradaInventario;
      setListaEntradas((prev) => [nueva, ...prev]);
      setStockDisplay((prev) => prev + Number(cantidad));
      setCantidad('');
      setPrecioBruto('');
      setCostoTransporte('');
      setCostoAlmacenamiento('');
      setCostoMazo('');
      setTransporteMazo('');
      setAlmacenamientoMazo('');
      setNotas('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }

  const tabBase: React.CSSProperties = {
    padding: '6px 16px',
    fontSize: '13px',
    fontFamily: 'var(--font-code)',
    cursor: 'pointer',
    transition: 'all 150ms',
    border: 'none',
  };

  return (
    <div>
      <div className="rounded-xl p-6 mb-6" style={{ backgroundColor: '#1A1A1A', border: '1px solid #2A2A2A' }}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold" style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', color: '#F0E6D2' }}>
            Nueva entrada
          </h2>
          <span className="text-sm" style={{ color: '#8B6F47', fontFamily: 'var(--font-code)' }}>
            Stock actual: <span style={{ color: '#F0E6D2', fontWeight: 600 }}>{stockDisplay}</span>
          </span>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Fecha + Cantidad */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Fecha de entrada">
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                required
                className="w-full rounded-md px-3 py-2 text-sm outline-none"
                style={inputStyle}
              />
            </Field>
            <Field label="Cantidad">
              <NumInput value={cantidad} onChange={(e) => setCantidad(e.target.value)} placeholder="0" step="1" min="1" />
            </Field>
          </div>

          {/* Costo — toggle pieza/mazo */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span style={{ color: '#8B6F47', fontFamily: 'var(--font-code)', fontSize: '12px' }}>
                INGRESAR COSTO POR:
              </span>
              <div className="flex rounded-md overflow-hidden" style={{ border: '1px solid #333' }}>
                <button
                  type="button"
                  onClick={() => setCostMode('pieza')}
                  style={{
                    ...tabBase,
                    backgroundColor: costMode === 'pieza' ? '#8B6F47' : '#111',
                    color: costMode === 'pieza' ? '#F0E6D2' : '#9A8572',
                  }}
                >
                  Pieza
                </button>
                <button
                  type="button"
                  onClick={() => setCostMode('mazo')}
                  style={{
                    ...tabBase,
                    backgroundColor: costMode === 'mazo' ? '#8B6F47' : '#111',
                    color: costMode === 'mazo' ? '#F0E6D2' : '#9A8572',
                    borderLeft: '1px solid #333',
                  }}
                >
                  Mazo
                </button>
              </div>
            </div>

            {costMode === 'pieza' ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Field label="Costo unitario ($)">
                  <NumInput value={precioBruto} onChange={handlePrecioBruto} />
                </Field>
                <Field label="Transporte ($)">
                  <NumInput value={costoTransporte} onChange={handleCostoTransporte} />
                </Field>
                <Field label="Almacenamiento ($)">
                  <NumInput value={costoAlmacenamiento} onChange={handleCostoAlmacenamiento} />
                </Field>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Costo total del mazo ($)">
                  <NumInput value={costoMazo} onChange={handleCostoMazo} />
                </Field>
                <Field label="Puros por mazo">
                  <NumInput value={purosPorMazo} onChange={handlePurosPorMazo} step="1" min="1" />
                </Field>
                <Field label="Transporte del mazo ($)">
                  <NumInput value={transporteMazo} onChange={handleTransporteMazo} />
                </Field>
                <Field label="Almacenamiento del mazo ($)">
                  <NumInput value={almacenamientoMazo} onChange={handleAlmacenamientoMazo} />
                </Field>
              </div>
            )}

            {costoUnitario > 0 && (
              <div className="rounded-lg p-3" style={{ backgroundColor: '#111', border: '1px solid #2A2A2A' }}>
                <span style={{ color: '#8B6F47', fontFamily: 'var(--font-code)', fontSize: '11px' }}>
                  COSTO TOTAL UNITARIO:{' '}
                </span>
                <span style={{ color: '#F0E6D2', fontFamily: 'var(--font-code)', fontWeight: 600 }}>
                  ${costoUnitario.toFixed(4)}
                </span>
              </div>
            )}
          </div>

          {/* Notas + submit */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Notas (opcional)">
              <input
                type="text"
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                placeholder="Proveedor, lote, etc."
                className="w-full rounded-md px-3 py-2 text-sm outline-none"
                style={inputStyle}
              />
            </Field>
          </div>

          <div className="flex items-center justify-between pt-1">
            {error
              ? <p className="text-sm" style={{ color: '#EF4444', fontFamily: 'var(--font-code)' }}>{error}</p>
              : <span />
            }
            <button
              type="submit"
              disabled={loading}
              className="transition-opacity hover:opacity-85 disabled:opacity-50"
              style={{
                padding: '8px 20px',
                borderRadius: '6px',
                backgroundColor: '#2C1810',
                border: '1px solid #8B6F47',
                color: '#F0E6D2',
                fontSize: '13px',
                fontFamily: 'var(--font-code)',
                fontWeight: 500,
                letterSpacing: '0.04em',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Guardando…' : '+ Registrar entrada'}
            </button>
          </div>
        </form>
      </div>

      {listaEntradas.length > 0 && (
        <div className="rounded-xl p-6" style={{ backgroundColor: '#1A1A1A', border: '1px solid #2A2A2A' }}>
          <h3 className="font-semibold mb-4" style={{ fontFamily: 'var(--font-serif)', fontSize: '15px', color: '#F0E6D2' }}>
            Historial de entradas — {puroNombre}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm" style={{ fontFamily: 'var(--font-code)' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #2A2A2A' }}>
                  {['Fecha', 'Cantidad', 'Costo unit.', 'Notas'].map((h) => (
                    <th key={h} className="text-left pb-2 pr-4" style={{ color: '#8B6F47', fontSize: '11px', letterSpacing: '0.05em' }}>
                      {h.toUpperCase()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {listaEntradas.map((e) => (
                  <tr key={e.id} style={{ borderBottom: '1px solid #222' }}>
                    <td className="py-2.5 pr-4" style={{ color: '#F0E6D2' }}>{e.fecha}</td>
                    <td className="py-2.5 pr-4" style={{ color: '#10B981', fontWeight: 600 }}>+{e.cantidad}</td>
                    <td className="py-2.5 pr-4" style={{ color: '#F0E6D2' }}>${e.costoUnitario.toFixed(4)}</td>
                    <td className="py-2.5" style={{ color: '#9A8572' }}>{e.notas ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
