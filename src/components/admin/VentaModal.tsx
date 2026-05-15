'use client';

import { useState, useMemo, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import type { Puro } from '@/types';

interface CartItem {
  puro: Puro;
  cantidad: number;
}

interface VentaModalProps {
  puros: Puro[];
  open: boolean;
  onClose: () => void;
}

function todayISO() {
  return new Date().toISOString().split('T')[0]!;
}

export default function VentaModal({ puros, open, onClose }: VentaModalProps) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [fecha, setFecha] = useState(todayISO());
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const disponibles = useMemo(
    () =>
      puros.filter(
        (p) =>
          p.stock > 0 &&
          (p.nombre.toLowerCase().includes(search.toLowerCase()) ||
            p.marca.toLowerCase().includes(search.toLowerCase()) ||
            p.vitola.toLowerCase().includes(search.toLowerCase())),
      ),
    [puros, search],
  );

  function addToCart(puro: Puro) {
    setCart((prev) => {
      const existing = prev.find((item) => item.puro.id === puro.id);
      if (existing) {
        if (existing.cantidad >= puro.stock) return prev;
        return prev.map((item) =>
          item.puro.id === puro.id ? { ...item, cantidad: item.cantidad + 1 } : item,
        );
      }
      return [...prev, { puro, cantidad: 1 }];
    });
  }

  function updateCantidad(puroId: string, cantidad: number) {
    if (cantidad <= 0) {
      setCart((prev) => prev.filter((i) => i.puro.id !== puroId));
      return;
    }
    const item = cart.find((i) => i.puro.id === puroId);
    if (!item || cantidad > item.puro.stock) return;
    setCart((prev) => prev.map((i) => (i.puro.id === puroId ? { ...i, cantidad } : i)));
  }

  const total = cart.reduce((sum, { puro, cantidad }) => sum + puro.precioVenta * cantidad, 0);

  function handleClose() {
    setCart([]);
    setSearch('');
    setFecha(todayISO());
    setError(null);
    onClose();
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">

        {/* Header */}
        <div className="flex items-start justify-between px-8 pt-7 pb-5 border-b border-stone-100 shrink-0">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-stone-400 mb-1">Vitola</p>
            <h2
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
              className="text-2xl font-light text-stone-800 italic"
            >
              Registrar Nueva Venta
            </h2>
          </div>
          <div className="flex items-center gap-5">
            <div className="flex flex-col items-end gap-1">
              <label className="text-[10px] uppercase tracking-[0.2em] text-stone-400">Fecha</label>
              <input
                type="date"
                value={fecha}
                max={todayISO()}
                onChange={(e) => setFecha(e.target.value)}
                className="text-xs text-stone-600 border-b border-stone-200 bg-transparent pb-0.5 focus:outline-none focus:border-stone-500 transition-colors cursor-pointer"
              />
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="text-stone-300 hover:text-stone-600 transition-colors text-lg leading-none mt-1"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="flex flex-col overflow-hidden flex-1">
          {/* Buscador */}
          <div className="px-8 pt-5 pb-4 border-b border-stone-100 shrink-0">
            <p className="text-[10px] uppercase tracking-[0.2em] text-stone-400 mb-3">
              Agregar Productos
            </p>
            <input
              type="text"
              placeholder="Buscar por nombre, marca o vitola…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-sm text-stone-700 placeholder:text-stone-300 border-b border-stone-200 bg-transparent pb-2 focus:outline-none focus:border-stone-500 transition-colors"
            />
            <div className="mt-3 max-h-44 overflow-y-auto flex flex-col pr-1">
              {disponibles.length === 0 ? (
                <p className="text-xs text-stone-400 py-3 text-center italic">Sin resultados</p>
              ) : (
                disponibles.map((puro) => {
                  const inCart = cart.find((i) => i.puro.id === puro.id);
                  const agotadoEnCarrito = !!inCart && inCart.cantidad >= puro.stock;
                  return (
                    <button
                      key={puro.id}
                      type="button"
                      onClick={() => addToCart(puro)}
                      disabled={agotadoEnCarrito}
                      className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-stone-50 text-left transition-colors disabled:opacity-40 disabled:cursor-not-allowed group"
                    >
                      <div className="min-w-0">
                        <span className="text-sm text-stone-600 group-hover:text-stone-900 transition-colors">
                          {puro.marca}{' '}
                          <span className="font-medium text-stone-800">{puro.vitola}</span>
                        </span>
                        <span className="text-xs text-stone-400 ml-2 truncate">{puro.nombre}</span>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        <span className="text-xs text-stone-400">Stock: {puro.stock}</span>
                        <span className="text-sm text-stone-600 tabular-nums">
                          ${puro.precioVenta.toLocaleString('es-MX')}
                        </span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Carrito */}
          <div className="px-8 pt-5 pb-4 flex flex-col overflow-y-auto flex-1">
            <p className="text-[10px] uppercase tracking-[0.2em] text-stone-400 mb-3 shrink-0">
              Carrito{cart.length > 0 ? ` · ${cart.length}` : ''}
            </p>
            {cart.length === 0 ? (
              <p className="text-sm text-stone-400 text-center py-8 italic">
                Agrega productos para comenzar
              </p>
            ) : (
              <div className="flex flex-col divide-y divide-stone-100">
                {cart.map(({ puro, cantidad }) => (
                  <div key={puro.id} className="flex items-center justify-between py-3">
                    <div className="min-w-0 mr-4">
                      <p className="text-sm text-stone-700">
                        {puro.marca}{' '}
                        <span className="font-medium">{puro.vitola}</span>
                      </p>
                      <p className="text-xs text-stone-400">
                        ${puro.precioVenta.toLocaleString('es-MX')} c/u
                      </p>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateCantidad(puro.id, cantidad - 1)}
                          className="w-6 h-6 rounded-full border border-stone-200 flex items-center justify-center text-stone-500 hover:border-stone-400 hover:text-stone-800 transition-colors"
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-sm text-stone-700 tabular-nums">
                          {cantidad}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCantidad(puro.id, cantidad + 1)}
                          disabled={cantidad >= puro.stock}
                          className="w-6 h-6 rounded-full border border-stone-200 flex items-center justify-center text-stone-500 hover:border-stone-400 hover:text-stone-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-sm text-stone-700 w-20 text-right tabular-nums">
                        ${(puro.precioVenta * cantidad).toLocaleString('es-MX')}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateCantidad(puro.id, 0)}
                        className="text-stone-300 hover:text-red-400 transition-colors text-xs w-4"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-stone-100 bg-stone-50 shrink-0">
          {error && <p className="text-xs text-red-500 mb-3">{error}</p>}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-stone-400 mb-1">
                Total de Venta
              </p>
              <p
                style={{ color: '#722F37', fontFamily: "'Cormorant Garamond', serif" }}
                className="text-3xl font-light tabular-nums"
              >
                ${total.toLocaleString('es-MX')}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-5 py-2.5 text-stone-500 text-sm hover:text-stone-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={cart.length === 0 || isPending}
                onClick={handleConfirm}
                className="px-6 py-2.5 rounded-lg text-sm font-medium text-white transition-opacity disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                style={{ backgroundColor: '#722F37' }}
              >
                {isPending && (
                  <span className="w-3 h-3 rounded-full border-2 border-current border-t-transparent animate-spin" />
                )}
                Confirmar Venta
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
