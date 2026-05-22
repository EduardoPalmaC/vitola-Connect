'use client';

import { useState } from 'react';
import type { EntradaInventario } from '@/types';

interface Props {
  puroId: string;
  puroNombre: string;
  stockActual: number;
  entradas: EntradaInventario[];
}

export default function EntradaForm({ puroId, puroNombre, stockActual, entradas }: Props) {
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10));
  const [cantidad, setCantidad] = useState('');
  const [costoUnitario, setCostoUnitario] = useState('');
  const [notas, setNotas] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [listaEntradas, setListaEntradas] = useState<EntradaInventario[]>(entradas);
  const [stockDisplay, setStockDisplay] = useState(stockActual);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!cantidad || !costoUnitario) {
      setError('Cantidad y costo son requeridos.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/entradas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ puroId, fecha, cantidad: Number(cantidad), costoUnitario: Number(costoUnitario), notas }),
      });
      if (!res.ok) {
        const data = await res.json() as { error?: string };
        throw new Error(data.error ?? 'Error al registrar entrada');
      }
      const nueva = await res.json() as EntradaInventario;
      setListaEntradas((prev) => [nueva, ...prev]);
      setStockDisplay((prev) => prev + Number(cantidad));
      setCantidad('');
      setCostoUnitario('');
      setNotas('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div
        className="rounded-xl p-6 mb-6"
        style={{ backgroundColor: '#1A1A1A', border: '1px solid #2A2A2A' }}
      >
        <div className="flex items-center justify-between mb-5">
          <h2
            className="font-bold"
            style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', color: '#F0E6D2' }}
          >
            Nueva entrada
          </h2>
          <span
            className="text-sm"
            style={{ color: '#8B6F47', fontFamily: 'var(--font-code)' }}
          >
            Stock actual: <span style={{ color: '#F0E6D2', fontWeight: 600 }}>{stockDisplay}</span>
          </span>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs mb-1.5" style={{ color: '#8B6F47', fontFamily: 'var(--font-code)', letterSpacing: '0.05em' }}>
              FECHA DE ENTRADA
            </label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              required
              className="w-full rounded-md px-3 py-2 text-sm outline-none transition-colors"
              style={{
                backgroundColor: '#111',
                border: '1px solid #333',
                color: '#F0E6D2',
                fontFamily: 'var(--font-code)',
              }}
            />
          </div>

          <div>
            <label className="block text-xs mb-1.5" style={{ color: '#8B6F47', fontFamily: 'var(--font-code)', letterSpacing: '0.05em' }}>
              CANTIDAD
            </label>
            <input
              type="number"
              min="1"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              placeholder="0"
              required
              className="w-full rounded-md px-3 py-2 text-sm outline-none transition-colors"
              style={{
                backgroundColor: '#111',
                border: '1px solid #333',
                color: '#F0E6D2',
                fontFamily: 'var(--font-code)',
              }}
            />
          </div>

          <div>
            <label className="block text-xs mb-1.5" style={{ color: '#8B6F47', fontFamily: 'var(--font-code)', letterSpacing: '0.05em' }}>
              COSTO UNITARIO ($)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={costoUnitario}
              onChange={(e) => setCostoUnitario(e.target.value)}
              placeholder="0.00"
              required
              className="w-full rounded-md px-3 py-2 text-sm outline-none transition-colors"
              style={{
                backgroundColor: '#111',
                border: '1px solid #333',
                color: '#F0E6D2',
                fontFamily: 'var(--font-code)',
              }}
            />
          </div>

          <div>
            <label className="block text-xs mb-1.5" style={{ color: '#8B6F47', fontFamily: 'var(--font-code)', letterSpacing: '0.05em' }}>
              NOTAS (opcional)
            </label>
            <input
              type="text"
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              placeholder="Proveedor, lote, etc."
              className="w-full rounded-md px-3 py-2 text-sm outline-none transition-colors"
              style={{
                backgroundColor: '#111',
                border: '1px solid #333',
                color: '#F0E6D2',
                fontFamily: 'var(--font-code)',
              }}
            />
          </div>

          <div className="sm:col-span-2 flex items-center justify-between pt-1">
            {error && (
              <p className="text-sm" style={{ color: '#EF4444', fontFamily: 'var(--font-code)' }}>
                {error}
              </p>
            )}
            {!error && <span />}
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
        <div
          className="rounded-xl p-6"
          style={{ backgroundColor: '#1A1A1A', border: '1px solid #2A2A2A' }}
        >
          <h3
            className="font-semibold mb-4"
            style={{ fontFamily: 'var(--font-serif)', fontSize: '15px', color: '#F0E6D2' }}
          >
            Historial de entradas — {puroNombre}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm" style={{ fontFamily: 'var(--font-code)' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #2A2A2A' }}>
                  {['Fecha', 'Cantidad', 'Costo unit.', 'Notas'].map((h) => (
                    <th
                      key={h}
                      className="text-left pb-2 pr-4"
                      style={{ color: '#8B6F47', fontSize: '11px', letterSpacing: '0.05em' }}
                    >
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
                    <td className="py-2.5 pr-4" style={{ color: '#F0E6D2' }}>${e.costoUnitario.toFixed(2)}</td>
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
