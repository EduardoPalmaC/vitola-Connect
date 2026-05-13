'use client';

import { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
  type ColumnDef,
} from '@tanstack/react-table';
import Link from 'next/link';
import type { Puro } from '@/types';
import { calcularCostoTotal, calcularMargen } from '@/lib/calculations';

const col = createColumnHelper<Puro>();

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-code)',
  fontSize: '10px',
  fontWeight: 600,
  letterSpacing: '0.12em',
  textTransform: 'uppercase' as const,
  color: '#6B7280',
};

const cellStyle: React.CSSProperties = {
  fontFamily: 'var(--font-code)',
  fontSize: '13px',
  color: '#1F2937',
};

const baseColumns = [
  col.accessor('nombre', {
    header: 'Nombre',
    cell: (info) => (
      <Link
        href={`/admin/inventario/${info.row.original.id}`}
        style={{ fontFamily: 'var(--font-serif)', fontSize: '14px', color: '#2C1E1A', fontWeight: 500 }}
        className="hover:opacity-70 transition-opacity"
      >
        {info.getValue()}
      </Link>
    ),
  }),
  col.accessor('marca', { header: 'Marca' }),
  col.accessor('vitola', { header: 'Vitola' }),
  col.accessor('paisOrigen', { header: 'País' }),
  col.display({
    id: 'costoTotal',
    header: 'Costo total',
    cell: (info) => `$${calcularCostoTotal(info.row.original).toLocaleString('es-MX')}`,
  }),
  col.accessor('stock', {
    header: 'Stock',
    cell: (info) => {
      const stock = info.getValue();
      const color =
        stock === 0 ? '#DC2626' : stock <= 3 ? '#B45309' : '#374151';
      return (
        <span style={{ fontFamily: 'var(--font-code)', fontSize: '13px', fontWeight: 600, color } as React.CSSProperties}>
          {stock}
        </span>
      );
    },
  }),
  col.accessor('fechaLlegada', { header: 'Llegada' }),
  col.display({
    id: 'acciones',
    header: '',
    cell: (info) => (
      <Link
        href={`/admin/inventario/${info.row.original.id}`}
        style={{ fontFamily: 'var(--font-code)', fontSize: '11px', color: '#5C3D1E', letterSpacing: '0.06em' }}
        className="hover:opacity-70 transition-opacity"
      >
        Editar →
      </Link>
    ),
  }),
];

const negocioColumns = [
  col.accessor('nombre', {
    header: 'Nombre',
    cell: (info) => (
      <Link
        href={`/admin/inventario/${info.row.original.id}`}
        style={{ fontFamily: 'var(--font-serif)', fontSize: '14px', color: '#2C1E1A', fontWeight: 500 }}
        className="hover:opacity-70 transition-opacity"
      >
        {info.getValue()}
      </Link>
    ),
  }),
  col.accessor('marca', { header: 'Marca' }),
  col.accessor('vitola', { header: 'Vitola' }),
  col.accessor('paisOrigen', { header: 'País' }),
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
      const color =
        stock === 0 ? '#DC2626' : stock <= 3 ? '#B45309' : '#374151';
      return (
        <span style={{ fontFamily: 'var(--font-code)', fontSize: '13px', fontWeight: 600, color } as React.CSSProperties}>
          {stock}
        </span>
      );
    },
  }),
  col.accessor('fechaLlegada', { header: 'Llegada' }),
  col.display({
    id: 'acciones',
    header: '',
    cell: (info) => (
      <Link
        href={`/admin/inventario/${info.row.original.id}`}
        style={{ fontFamily: 'var(--font-code)', fontSize: '11px', color: '#5C3D1E', letterSpacing: '0.06em' }}
        className="hover:opacity-70 transition-opacity"
      >
        Editar →
      </Link>
    ),
  }),
];

function PurosTable({
  data,
  columns,
  globalFilter,
  emptyText,
}: {
  data: Puro[];
  columns: ColumnDef<Puro, unknown>[];
  globalFilter: string;
  emptyText: string;
}) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="flex flex-col gap-2">
      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '4px', overflowX: 'auto' }}>
        <table className="w-full text-sm">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} style={{ borderBottom: '1px solid #E5E7EB', backgroundColor: '#FFFFFF' }}>
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-2 text-left whitespace-nowrap"
                    style={{ ...labelStyle, cursor: header.column.getCanSort() ? 'pointer' : 'default' }}
                    onClick={header.column.getToggleSortingHandler()}
                    onMouseEnter={(e) => { if (header.column.getCanSort()) (e.currentTarget as HTMLElement).style.color = '#374151'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = '#6B7280'; }}
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
                  className="px-4 py-10 text-center"
                  style={{ fontFamily: 'var(--font-code)', fontSize: '12px', color: '#9CA3AF' }}
                >
                  {emptyText}
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row, idx) => (
                <tr
                  key={row.id}
                  className="transition-colors"
                  style={{ borderBottom: '1px solid #F3F4F6', backgroundColor: idx % 2 === 1 ? '#FAFAFA' : '#FFFFFF' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = '#F3F4F6'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = idx % 2 === 1 ? '#FAFAFA' : '#FFFFFF'; }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-2 whitespace-nowrap" style={cellStyle}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <p style={{ fontFamily: 'var(--font-code)', fontSize: '10px', color: '#9CA3AF', letterSpacing: '0.12em' }}>
        {table.getFilteredRowModel().rows.length} DE {data.length} PUROS
      </p>
    </div>
  );
}

export default function InventarioTable({ puros: initialPuros }: { puros: Puro[] }) {
  const [puros] = useState<Puro[]>(initialPuros);
  const [globalFilter, setGlobalFilter] = useState('');

  const negocio = useMemo(() => puros.filter((p) => p.estado === 'negocio'), [puros]);
  const coleccion = useMemo(() => puros.filter((p) => p.estado === 'coleccion_personal'), [puros]);

  return (
    <div className="flex flex-col gap-10">
      <div className="max-w-xs">
        <input
          placeholder="Buscar..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          style={{
            width: '100%',
            padding: '7px 12px',
            borderRadius: '4px',
            border: '1px solid #D1D5DB',
            backgroundColor: '#FFFFFF',
            color: '#111827',
            fontFamily: 'var(--font-code)',
            fontSize: '13px',
            outline: 'none',
          }}
          onFocus={(e) => { (e.target as HTMLElement).style.borderColor = '#5C3D1E'; }}
          onBlur={(e) => { (e.target as HTMLElement).style.borderColor = '#D1D5DB'; }}
        />
      </div>

      <section className="flex flex-col gap-4">
        <h2
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '20px',
            fontWeight: 600,
            color: '#4A3728',
            letterSpacing: '-0.01em',
          }}
        >
          Inventario de Negocio
          <span
            style={{
              marginLeft: '8px',
              fontFamily: 'var(--font-code)',
              fontSize: '11px',
              fontWeight: 400,
              color: '#9A8572',
              letterSpacing: '0.16em',
            }}
          >
            ({negocio.length})
          </span>
        </h2>
        <PurosTable
          data={negocio}
          columns={negocioColumns as ColumnDef<Puro, unknown>[]}
          globalFilter={globalFilter}
          emptyText="No hay puros de negocio"
        />
      </section>

      <section className="flex flex-col gap-4">
        <h2
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '20px',
            fontWeight: 600,
            color: '#4A3728',
            letterSpacing: '-0.01em',
          }}
        >
          Colección Personal
          <span
            style={{
              marginLeft: '8px',
              fontFamily: 'var(--font-code)',
              fontSize: '11px',
              fontWeight: 400,
              color: '#9A8572',
              letterSpacing: '0.16em',
            }}
          >
            ({coleccion.length})
          </span>
        </h2>
        <PurosTable
          data={coleccion}
          columns={baseColumns as ColumnDef<Puro, unknown>[]}
          globalFilter={globalFilter}
          emptyText="No hay puros en colección personal"
        />
      </section>
    </div>
  );
}
