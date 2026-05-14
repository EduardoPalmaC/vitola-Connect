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
import { calcularCostoTotal, calcularMargen, calcularGananciaProyectada } from '@/lib/calculations';

// ─── Brand tokens ────────────────────────────────────────────────────────────
const OXBLOOD = '#6B1E2A';
const OXBLOOD_DIM = '#8B3040';
const AMBER = '#C07A28';
const AMBER_BG = '#FEF3E2';
const ROSE_BG = '#FDF0F1';
const EMERALD = '#0F7B5A';
const EMERALD_BG = '#EDFAF4';
const SURFACE = '#FFFFFF';
const SURFACE_ALT = '#FAFAF8';
const BORDER = '#EDE8E0';
const TEXT_PRIMARY = '#1C1008';
const TEXT_SECONDARY = '#6B5C4A';
const TEXT_MUTED = '#A8967E';

const col = createColumnHelper<Puro>();

// ─── Helpers ─────────────────────────────────────────────────────────────────
function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) {
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: '4px',
        padding: '2px 8px', borderRadius: '99px',
        backgroundColor: ROSE_BG, border: `1px solid #F9C5CB`,
        fontFamily: 'var(--font-code)', fontSize: '11px', fontWeight: 700,
        color: '#C0202E', letterSpacing: '0.04em',
      }}>
        ✕ AGOTADO
      </span>
    );
  }
  if (stock <= 2) {
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: '4px',
        padding: '2px 8px', borderRadius: '99px',
        backgroundColor: AMBER_BG, border: `1px solid #F0C87A`,
        fontFamily: 'var(--font-code)', fontSize: '11px', fontWeight: 700,
        color: AMBER, letterSpacing: '0.04em',
      }}>
        ▲ {stock}
      </span>
    );
  }
  return (
    <span style={{
      fontFamily: 'var(--font-code)', fontSize: '13px',
      fontWeight: 600, color: TEXT_SECONDARY,
    }}>
      {stock}
    </span>
  );
}

function MargenBadge({ puro }: { puro: Puro }) {
  const margen = calcularMargen(puro);
  const isTop = margen >= 60;
  const isMid = margen >= 35;

  if (isTop) {
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: '4px',
        padding: '2px 8px', borderRadius: '99px',
        backgroundColor: EMERALD_BG, border: `1px solid #A8E8D0`,
        fontFamily: 'var(--font-code)', fontSize: '11px', fontWeight: 700,
        color: EMERALD, letterSpacing: '0.04em',
      }}>
        ★ {margen.toFixed(1)}%
      </span>
    );
  }
  if (isMid) {
    return (
      <span style={{
        fontFamily: 'var(--font-code)', fontSize: '12px',
        fontWeight: 600, color: OXBLOOD_DIM,
      }}>
        {margen.toFixed(1)}%
      </span>
    );
  }
  return (
    <span style={{
      fontFamily: 'var(--font-code)', fontSize: '12px',
      fontWeight: 400, color: TEXT_MUTED,
    }}>
      {margen.toFixed(1)}%
    </span>
  );
}

function PrecioVentaCell({ value, puros, allData }: { value: number; puros: Puro[]; allData: Puro[] }) {
  const max = Math.max(...allData.map((p) => p.precioVenta));
  const isHighValue = value >= max * 0.75;
  return (
    <span style={{
      fontFamily: 'var(--font-code)', fontSize: '13px',
      fontWeight: isHighValue ? 700 : 500,
      color: isHighValue ? OXBLOOD : TEXT_SECONDARY,
    }}>
      ${value.toLocaleString('es-MX')}
      {isHighValue && (
        <span style={{ marginLeft: '4px', fontSize: '10px', color: OXBLOOD_DIM }}>●</span>
      )}
    </span>
  );
}

// ─── Column factories ─────────────────────────────────────────────────────────
function buildBaseColumns(allData: Puro[]): ColumnDef<Puro, unknown>[] {
  return [
    col.accessor('nombre', {
      header: 'Nombre',
      cell: (info) => {
        const stock = info.row.original.stock;
        const isLow = stock <= 2;
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
            <Link
              href={`/admin/inventario/${info.row.original.id}`}
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '14px',
                fontWeight: 700,
                color: isLow ? AMBER : TEXT_PRIMARY,
                textDecoration: 'none',
                lineHeight: 1.3,
              }}
              className="hover:opacity-70 transition-opacity"
            >
              {info.getValue() as string}
            </Link>
            <span style={{ fontFamily: 'var(--font-code)', fontSize: '11px', color: TEXT_MUTED }}>
              {info.row.original.vitola}
            </span>
          </div>
        );
      },
    }) as ColumnDef<Puro, unknown>,
    col.accessor('marca', {
      header: 'Marca',
      cell: (info) => (
        <span style={{ fontFamily: 'var(--font-serif)', fontSize: '13px', fontWeight: 500, color: TEXT_SECONDARY }}>
          {info.getValue() as string}
        </span>
      ),
    }) as ColumnDef<Puro, unknown>,
    col.accessor('paisOrigen', {
      header: 'País',
      cell: (info) => (
        <span style={{ fontFamily: 'var(--font-code)', fontSize: '11px', color: TEXT_MUTED, letterSpacing: '0.04em' }}>
          {info.getValue() as string}
        </span>
      ),
    }) as ColumnDef<Puro, unknown>,
    col.display({
      id: 'costoTotal',
      header: 'Costo total',
      cell: (info) => (
        <span style={{ fontFamily: 'var(--font-code)', fontSize: '12px', color: TEXT_MUTED }}>
          ${calcularCostoTotal(info.row.original).toLocaleString('es-MX')}
        </span>
      ),
    }) as ColumnDef<Puro, unknown>,
    col.accessor('stock', {
      header: 'Stock',
      cell: (info) => <StockBadge stock={info.getValue() as number} />,
    }) as ColumnDef<Puro, unknown>,
    col.accessor('fechaLlegada', {
      header: 'Llegada',
      cell: (info) => (
        <span style={{ fontFamily: 'var(--font-code)', fontSize: '11px', color: TEXT_MUTED }}>
          {info.getValue() as string}
        </span>
      ),
    }) as ColumnDef<Puro, unknown>,
    col.display({
      id: 'acciones',
      header: '',
      cell: (info) => (
        <Link
          href={`/admin/inventario/${info.row.original.id}`}
          style={{
            fontFamily: 'var(--font-code)', fontSize: '11px',
            color: OXBLOOD, letterSpacing: '0.06em',
            textDecoration: 'none', fontWeight: 500,
          }}
          className="hover:opacity-70 transition-opacity"
        >
          Editar →
        </Link>
      ),
    }) as ColumnDef<Puro, unknown>,
  ];
}

function buildNegocioColumns(allData: Puro[]): ColumnDef<Puro, unknown>[] {
  return [
    col.accessor('nombre', {
      header: 'Nombre',
      cell: (info) => {
        const stock = info.row.original.stock;
        const isLow = stock <= 2;
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
            <Link
              href={`/admin/inventario/${info.row.original.id}`}
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '14px',
                fontWeight: 700,
                color: isLow ? AMBER : TEXT_PRIMARY,
                textDecoration: 'none',
                lineHeight: 1.3,
              }}
              className="hover:opacity-70 transition-opacity"
            >
              {info.getValue() as string}
            </Link>
            <span style={{ fontFamily: 'var(--font-code)', fontSize: '11px', color: TEXT_MUTED }}>
              {info.row.original.vitola}
            </span>
          </div>
        );
      },
    }) as ColumnDef<Puro, unknown>,
    col.accessor('marca', {
      header: 'Marca',
      cell: (info) => (
        <span style={{ fontFamily: 'var(--font-serif)', fontSize: '13px', fontWeight: 500, color: TEXT_SECONDARY }}>
          {info.getValue() as string}
        </span>
      ),
    }) as ColumnDef<Puro, unknown>,
    col.accessor('paisOrigen', {
      header: 'País',
      cell: (info) => (
        <span style={{ fontFamily: 'var(--font-code)', fontSize: '11px', color: TEXT_MUTED, letterSpacing: '0.04em' }}>
          {info.getValue() as string}
        </span>
      ),
    }) as ColumnDef<Puro, unknown>,
    col.accessor('precioVenta', {
      header: 'Precio venta',
      cell: (info) => (
        <PrecioVentaCell
          value={info.getValue() as number}
          puros={[info.row.original]}
          allData={allData}
        />
      ),
    }) as ColumnDef<Puro, unknown>,
    col.display({
      id: 'costoTotal',
      header: 'Costo total',
      cell: (info) => (
        <span style={{ fontFamily: 'var(--font-code)', fontSize: '12px', color: TEXT_MUTED }}>
          ${calcularCostoTotal(info.row.original).toLocaleString('es-MX')}
        </span>
      ),
    }) as ColumnDef<Puro, unknown>,
    col.display({
      id: 'gananciaPieza',
      header: 'Ganancia / pza',
      cell: (info) => {
        const ganancia = calcularGananciaProyectada(info.row.original);
        const isPositive = ganancia > 0;
        return (
          <span style={{
            fontFamily: 'var(--font-code)', fontSize: '13px',
            fontWeight: 600,
            color: isPositive ? EMERALD : '#C0202E',
          }}>
            {isPositive ? '+' : ''}${ganancia.toLocaleString('es-MX')}
          </span>
        );
      },
    }) as ColumnDef<Puro, unknown>,
    col.display({
      id: 'margen',
      header: 'Margen',
      cell: (info) => <MargenBadge puro={info.row.original} />,
    }) as ColumnDef<Puro, unknown>,
    col.accessor('stock', {
      header: 'Stock',
      cell: (info) => <StockBadge stock={info.getValue() as number} />,
    }) as ColumnDef<Puro, unknown>,
    col.accessor('fechaLlegada', {
      header: 'Llegada',
      cell: (info) => (
        <span style={{ fontFamily: 'var(--font-code)', fontSize: '11px', color: TEXT_MUTED }}>
          {info.getValue() as string}
        </span>
      ),
    }) as ColumnDef<Puro, unknown>,
    col.display({
      id: 'acciones',
      header: '',
      cell: (info) => (
        <Link
          href={`/admin/inventario/${info.row.original.id}`}
          style={{
            fontFamily: 'var(--font-code)', fontSize: '11px',
            color: OXBLOOD, letterSpacing: '0.06em',
            textDecoration: 'none', fontWeight: 500,
          }}
          className="hover:opacity-70 transition-opacity"
        >
          Editar →
        </Link>
      ),
    }) as ColumnDef<Puro, unknown>,
  ];
}

// ─── Alert bar ────────────────────────────────────────────────────────────────
function AlertBar({ puros }: { puros: Puro[] }) {
  const negocio = puros.filter((p) => p.estado === 'negocio');
  const lowStock = negocio.filter((p) => p.stock > 0 && p.stock <= 2);
  const outOfStock = negocio.filter((p) => p.stock === 0);
  if (lowStock.length === 0 && outOfStock.length === 0) return null;

  return (
    <div style={{
      display: 'flex', gap: '12px', flexWrap: 'wrap',
      padding: '10px 16px', borderRadius: '6px',
      backgroundColor: AMBER_BG, border: `1px solid #F0C87A`,
    }}>
      {outOfStock.length > 0 && (
        <span style={{ fontFamily: 'var(--font-code)', fontSize: '11px', color: '#C0202E', fontWeight: 700, letterSpacing: '0.04em' }}>
          ✕ AGOTADOS: {outOfStock.map((p) => p.nombre).join(', ')}
        </span>
      )}
      {lowStock.length > 0 && (
        <span style={{ fontFamily: 'var(--font-code)', fontSize: '11px', color: AMBER, fontWeight: 600, letterSpacing: '0.04em' }}>
          ▲ STOCK BAJO: {lowStock.map((p) => `${p.nombre} (${p.stock})`).join(', ')}
        </span>
      )}
    </div>
  );
}

// ─── Table component ──────────────────────────────────────────────────────────
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{
        backgroundColor: SURFACE,
        border: `1px solid ${BORDER}`,
        borderRadius: '8px',
        overflowX: 'auto',
        boxShadow: '0 1px 4px rgba(28,16,8,0.06)',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} style={{ borderBottom: `2px solid ${BORDER}` }}>
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    style={{
                      padding: '10px 16px',
                      textAlign: 'left',
                      whiteSpace: 'nowrap',
                      fontFamily: 'var(--font-code)',
                      fontSize: '10px',
                      fontWeight: 700,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: TEXT_MUTED,
                      cursor: header.column.getCanSort() ? 'pointer' : 'default',
                      userSelect: 'none',
                      backgroundColor: '#FDFCFA',
                    }}
                    onClick={header.column.getToggleSortingHandler()}
                    onMouseEnter={(e) => {
                      if (header.column.getCanSort())
                        (e.currentTarget as HTMLElement).style.color = OXBLOOD;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.color = TEXT_MUTED;
                    }}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getIsSorted() === 'asc' && (
                      <span style={{ marginLeft: '4px', color: OXBLOOD }}> ↑</span>
                    )}
                    {header.column.getIsSorted() === 'desc' && (
                      <span style={{ marginLeft: '4px', color: OXBLOOD }}> ↓</span>
                    )}
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
                  style={{
                    padding: '40px 16px',
                    textAlign: 'center',
                    fontFamily: 'var(--font-code)',
                    fontSize: '12px',
                    color: TEXT_MUTED,
                  }}
                >
                  {emptyText}
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row, idx) => {
                const stock = row.original.stock;
                const isLowStock = stock <= 2;
                const baseColor = isLowStock
                  ? (stock === 0 ? '#FFF8F8' : '#FFFBF3')
                  : idx % 2 === 1
                  ? SURFACE_ALT
                  : SURFACE;

                return (
                  <tr
                    key={row.id}
                    style={{
                      borderBottom: `1px solid ${BORDER}`,
                      backgroundColor: baseColor,
                      transition: 'background-color 120ms ease',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor = '#F5EFE8';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor = baseColor;
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        style={{ padding: '11px 16px', whiteSpace: 'nowrap' }}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <p style={{
        fontFamily: 'var(--font-code)', fontSize: '10px',
        color: TEXT_MUTED, letterSpacing: '0.12em',
      }}>
        {table.getFilteredRowModel().rows.length} DE {data.length} PUROS
      </p>
    </div>
  );
}

// ─── Section header ───────────────────────────────────────────────────────────
function SectionHeader({ title, count, accent }: { title: string; count: number; accent?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      {accent && (
        <div style={{
          width: '3px', height: '20px', borderRadius: '2px',
          backgroundColor: OXBLOOD, flexShrink: 0,
        }} />
      )}
      <h2 style={{
        fontFamily: 'var(--font-serif)',
        fontSize: '18px',
        fontWeight: 700,
        color: accent ? TEXT_PRIMARY : '#4A3728',
        letterSpacing: '-0.01em',
        margin: 0,
      }}>
        {title}
      </h2>
      <span style={{
        fontFamily: 'var(--font-code)',
        fontSize: '10px',
        fontWeight: 600,
        color: accent ? OXBLOOD : TEXT_MUTED,
        letterSpacing: '0.16em',
        backgroundColor: accent ? ROSE_BG : '#F3EDE5',
        border: `1px solid ${accent ? '#F9C5CB' : BORDER}`,
        borderRadius: '99px',
        padding: '2px 8px',
      }}>
        {count}
      </span>
    </div>
  );
}

// ─── Legend ───────────────────────────────────────────────────────────────────
function Legend() {
  return (
    <div style={{
      display: 'flex', gap: '20px', flexWrap: 'wrap',
      padding: '8px 0',
    }}>
      {[
        { color: '#C0202E', bg: ROSE_BG, label: 'Agotado' },
        { color: AMBER, bg: AMBER_BG, label: 'Stock bajo (≤ 2)' },
        { color: EMERALD, bg: EMERALD_BG, label: 'Margen alto (≥ 60%)' },
        { color: OXBLOOD, bg: 'transparent', label: 'Precio top (≥ 75% del máximo)' },
      ].map(({ color, bg, label }) => (
        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{
            display: 'inline-block', width: '8px', height: '8px',
            borderRadius: '50%', backgroundColor: color,
            flexShrink: 0,
          }} />
          <span style={{
            fontFamily: 'var(--font-code)', fontSize: '10px',
            color: TEXT_MUTED, letterSpacing: '0.06em',
          }}>
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Root export ──────────────────────────────────────────────────────────────
export default function InventarioTable({ puros: initialPuros }: { puros: Puro[] }) {
  const [puros] = useState<Puro[]>(initialPuros);
  const [globalFilter, setGlobalFilter] = useState('');

  const negocio = useMemo(() => puros.filter((p) => p.estado === 'negocio'), [puros]);
  const coleccion = useMemo(() => puros.filter((p) => p.estado === 'coleccion_personal'), [puros]);

  const negocioColumns = useMemo(() => buildNegocioColumns(negocio), [negocio]);
  const baseColumns = useMemo(() => buildBaseColumns(coleccion), [coleccion]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>

      {/* Search + alerts row */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ maxWidth: '280px' }}>
          <input
            placeholder="Buscar puro, marca, país…"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '6px',
              border: `1px solid ${BORDER}`,
              backgroundColor: SURFACE,
              color: TEXT_PRIMARY,
              fontFamily: 'var(--font-code)',
              fontSize: '13px',
              outline: 'none',
              transition: 'border-color 150ms',
            }}
            onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = OXBLOOD; }}
            onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = BORDER; }}
          />
        </div>
        <AlertBar puros={puros} />
        <Legend />
      </div>

      {/* Negocio section */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <SectionHeader title="Inventario de Negocio" count={negocio.length} accent />
        <PurosTable
          data={negocio}
          columns={negocioColumns}
          globalFilter={globalFilter}
          emptyText="No hay puros de negocio"
        />
      </section>

      {/* Divider */}
      <div style={{ borderTop: `1px solid ${BORDER}` }} />

      {/* Colección section */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <SectionHeader title="Colección Personal" count={coleccion.length} />
        <PurosTable
          data={coleccion}
          columns={baseColumns}
          globalFilter={globalFilter}
          emptyText="No hay puros en colección personal"
        />
      </section>
    </div>
  );
}
