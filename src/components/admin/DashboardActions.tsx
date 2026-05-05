'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Puro } from '@/types';
import VentaModal from './VentaModal';

export default function DashboardActions({ puros }: { puros: Puro[] }) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          style={{
            fontFamily: 'var(--font-code)',
            fontSize: '10px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            background: '#2C1E1A',
            color: '#F2EDE4',
            border: 'none',
            padding: '14px 24px',
            cursor: 'pointer',
            transition: 'opacity 0.15s',
          }}
          className="hover:opacity-75"
        >
          + Registrar venta
        </button>
        <Link
          href="/admin/inventario/nuevo"
          style={{
            fontFamily: 'var(--font-code)',
            fontSize: '10px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#5C3D1E',
            border: '1px solid #C4A472',
            padding: '14px 24px',
            textDecoration: 'none',
            transition: 'background 0.15s',
          }}
          className="hover:bg-[#F5EDD8]"
        >
          + Nuevo puro
        </Link>
        <Link
          href="/admin/inventario"
          style={{
            fontFamily: 'var(--font-code)',
            fontSize: '10px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#9A8572',
            border: '1px solid #DDD5C5',
            padding: '14px 24px',
            textDecoration: 'none',
            transition: 'background 0.15s',
          }}
          className="hover:bg-[#F2EDE4]"
        >
          Ver inventario
        </Link>
      </div>
      <VentaModal puros={puros} open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
