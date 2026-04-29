'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Puro } from '@/types';
import VentaModal from './VentaModal';

export default function DashboardActions({ puros }: { puros: Puro[] }) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-background text-sm font-medium hover:opacity-90 transition-opacity"
        >
          + Registrar Nueva Venta
        </button>
        <Link
          href="/admin/inventario/nuevo"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-text text-sm font-medium hover:border-secondary/60 transition-colors"
        >
          + Nuevo puro
        </Link>
        <Link
          href="/admin/inventario"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-text text-sm font-medium hover:border-secondary/60 transition-colors"
        >
          Ver inventario
        </Link>
      </div>
      <VentaModal puros={puros} open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
