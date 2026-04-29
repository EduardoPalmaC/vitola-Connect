'use client';

import { useState, useMemo, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import type { Puro } from '@/types';
import Input from '@/components/ui/Input';

interface CartItem {
  puro: Puro;
  cantidad: number;
}

interface VentaModalProps {
  puros: Puro[];
  open: boolean;
  onClose: () => void;
}

export default function VentaModal({ puros, open, onClose }: VentaModalProps) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
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
          body: JSON.stringify({ items: cart }),
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-2xl bg-background border border-border rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <h2 className="text-lg font-bold text-text">Registrar Nueva Venta</h2>
          <button
            type="button"
            onClick={handleClose}
            className="text-text-muted hover:text-text transition-colors text-xl leading-none"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col overflow-hidden flex-1">
          {/* Buscador */}
          <div className="px-6 py-4 flex flex-col gap-3 border-b border-border shrink-0">
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">
              Agregar productos
            </p>
            <Input
              placeholder="Buscar por nombre, marca o vitola..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="max-h-44 overflow-y-auto flex flex-col gap-1 pr-1">
              {disponibles.length === 0 ? (
                <p className="text-xs text-text-muted py-2 text-center">Sin resultados</p>
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
                      className="flex items-center justify-between px-3 py-2 rounded-lg border border-border bg-surface hover:border-secondary/60 text-left transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="min-w-0">
                        <span className="text-sm font-medium text-text">
                          {puro.marca} {puro.vitola}
                        </span>
                        <span className="text-xs text-text-muted ml-2 truncate">{puro.nombre}</span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs text-text-muted">Stock: {puro.stock}</span>
                        <span className="text-sm font-semibold text-secondary">
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
          <div className="px-6 py-4 flex flex-col gap-3 overflow-y-auto flex-1">
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">
              Carrito ({cart.length})
            </p>
            {cart.length === 0 ? (
              <p className="text-sm text-text-muted text-center py-6">
                Agrega productos para comenzar
              </p>
            ) : (
              cart.map(({ puro, cantidad }) => (
                <div
                  key={puro.id}
                  className="flex items-center justify-between rounded-lg border border-border bg-surface px-4 py-3"
                >
                  <div className="min-w-0 mr-4">
                    <p className="text-sm font-medium text-text">
                      {puro.marca} {puro.vitola}
                    </p>
                    <p className="text-xs text-text-muted">
                      ${puro.precioVenta.toLocaleString('es-MX')} c/u
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => updateCantidad(puro.id, cantidad - 1)}
                        className="w-7 h-7 rounded-md border border-border bg-background flex items-center justify-center text-text hover:border-secondary/60 transition-colors"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm font-semibold text-text tabular-nums">
                        {cantidad}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateCantidad(puro.id, cantidad + 1)}
                        disabled={cantidad >= puro.stock}
                        className="w-7 h-7 rounded-md border border-border bg-background flex items-center justify-center text-text hover:border-secondary/60 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-sm font-semibold text-text w-20 text-right tabular-nums">
                      ${(puro.precioVenta * cantidad).toLocaleString('es-MX')}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateCantidad(puro.id, 0)}
                      className="text-text-muted hover:text-red-400 transition-colors text-xs w-4"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border flex flex-col gap-3 shrink-0">
          {error && <p className="text-xs text-red-400">{error}</p>}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-text-muted">Total venta</p>
              <p className="text-2xl font-bold text-secondary">
                ${total.toLocaleString('es-MX')}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 rounded-lg border border-border text-text text-sm font-medium hover:border-secondary/60 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={cart.length === 0 || isPending}
                onClick={handleConfirm}
                className="px-4 py-2 rounded-lg bg-secondary text-background text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isPending && (
                  <span className="w-3 h-3 rounded-full border-2 border-current border-t-transparent animate-spin" />
                )}
                Confirmar y Descontar Inventario
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
