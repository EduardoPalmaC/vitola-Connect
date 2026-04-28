'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from '@tanstack/react-table';
import Link from 'next/link';
import type { Puro } from '@/types';
import { calcularCostoTotal, calcularMargen } from '@/lib/calculations';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';

const col = createColumnHelper<Puro>();

export default function InventarioTable({ puros: initialPuros }: { puros: Puro[] }) {
  const [puros, setPuros] = useState<Puro[]>(initialPuros);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [selling, setSelling] = useState<string | null>(null);

  const handleVentaRapida = useCallback(async (puro: Puro) => {
    if (puro.stock <= 0 || selling === puro.id) return;
    const newStock = puro.stock - 1;

    setSelling(puro.id);
    setPuros((prev) => prev.map((p) => (p.id === puro.id ? { ...p, stock: newStock } : p)));

    try {
      const res = await fetch(`/api/puros/${puro.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: newStock }),
      });
      if (!res.ok) throw new Error();
    } catch {
      setPuros((prev) => prev.map((p) => (p.id === puro.id ? { ...p, stock: puro.stock } : p)));
    } finally {
      setSelling(null);
    }
  }, [selling]);

  const columns = useMemo(
    () => [
      col.accessor('nombre', {
        header: 'Nombre',
        cell: (info) => (
          <Link
            href={`/admin/inventario/${info.row.original.id}`}
            className="font-medium text-text hover:text-secondary transition-colors"
          >
            {info.getValue()}
          </Link>
        ),
      }),
      col.accessor('marca', { header: 'Marca' }),
      col.accessor('vitola', { header: 'Vitola' }),
      col.accessor('paisOrigen', { header: 'País' }),
      col.accessor('estado', {
        header: 'Estado',
        cell: (info) => {
          const v = info.getValue();
          return (
            <Badge variant={v === 'negocio' ? 'success' : 'info'}>
              {v.replace('_', ' ')}
            </Badge>
          );
        },
      }),
      col.accessor('precioVenta', {
        header: 'Precio venta',
        cell: (info) => `$${info.getValue().toLocaleString('es-MX')}`,
      }),
      col.display({
        id: 'costoTotal',
        header: 'Costo total',
        cell: (info) => `$${calcularCostoTotal(info.row.original).toLocaleString('es-MX')}`,
      }),
      col.display({
        id: 'margen',
        header: 'Margen',
        cell: (info) => `${calcularMargen(info.row.original).toFixed(1)}%`,
      }),
      col.accessor('stock', {
        header: 'Stock',
        cell: (info) => {
          const stock = info.getValue();
          return (
            <span
              className={`font-semibold tabular-nums ${
                stock === 0 ? 'text-red-400' : stock <= 3 ? 'text-amber-400' : 'text-secondary'
              }`}
            >
              {stock}
            </span>
          );
        },
      }),
      col.accessor('fechaLlegada', { header: 'Llegada' }),
      col.display({
        id: 'acciones',
        header: 'Acciones',
        cell: (info) => {
          const puro = info.row.original;
          const agotado = puro.stock <= 0;
          const isSelling = selling === puro.id;

          return (
            <div className="flex items-center gap-2">
              {agotado ? (
                <span className="text-xs text-red-400 font-medium px-2 py-1 rounded-md border border-red-400/30 bg-red-400/10 whitespace-nowrap">
                  Agotado
                </span>
              ) : (
                <button
                  type="button"
                  disabled={isSelling}
                  onClick={() => handleVentaRapida(puro)}
                  title="Registrar venta (-1 stock)"
                  className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md border border-border bg-surface hover:border-secondary/60 hover:text-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {isSelling ? (
                    <span className="w-3 h-3 rounded-full border-2 border-current border-t-transparent animate-spin" />
                  ) : (
                    <span className="text-base leading-none">−</span>
                  )}
                  Vender
                </button>
              )}
              <Link
                href={`/admin/inventario/${puro.id}`}
                className="text-xs text-text-muted hover:text-secondary transition-colors"
              >
                Editar →
              </Link>
            </div>
          );
        },
      }),
    ],
    [selling, handleVentaRapida],
  );

  const data = useMemo(() => puros, [puros]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="max-w-xs">
        <Input
          placeholder="Buscar..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
        />
      </div>

      <div className="rounded-xl border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} className="border-b border-border bg-surface">
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider whitespace-nowrap"
                    onClick={header.column.getToggleSortingHandler()}
                    style={{ cursor: header.column.getCanSort() ? 'pointer' : 'default' }}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getIsSorted() === 'asc' && ' ↑'}
                    {header.column.getIsSorted() === 'desc' && ' ↓'}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-12 text-center text-text-muted"
                >
                  No se encontraron puros
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-border last:border-0 hover:bg-surface transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 text-text whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-text-muted">
        {table.getFilteredRowModel().rows.length} de {puros.length} puros
      </p>
    </div>
  );
}
