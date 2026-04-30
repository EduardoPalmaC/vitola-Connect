export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { Lock } from 'lucide-react';
import { getPuros } from '@/lib/sheets';
import { getUniqueValues } from '@/lib/filters';
import type { PuroPublico } from '@/types';
import CatalogoGallery from '@/components/catalogo/CatalogoGallery';

function formatDate(d: Date): string {
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yy = String(d.getFullYear()).slice(2);
  return `${dd}.${mm}.${yy}`;
}

export default async function CatalogoPage() {
  const allPuros = await getPuros();
  const publicPuros = allPuros.filter((p) => p.estado === 'negocio' && p.stock > 0);

  const publicItems: PuroPublico[] = publicPuros.map((p) => ({
    id: p.id,
    nombre: p.nombre,
    marca: p.marca,
    vitola: p.vitola,
    precioVenta: p.precioVenta,
    fotoUrl: p.fotoUrl,
    stock: p.stock,
    ringGauge: p.ringGauge,
    paisOrigen: p.paisOrigen,
    fortaleza: p.fortaleza,
  }));

  const marcas = getUniqueValues(publicPuros, 'marca') as string[];
  const vitolas = getUniqueValues(publicPuros, 'vitola') as string[];
  const paises = getUniqueValues(publicPuros, 'paisOrigen') as string[];
  const cepos = getUniqueValues(publicPuros, 'ringGauge') as number[];
  const fortalezas = getUniqueValues(publicPuros, 'fortaleza') as string[];

  const today = formatDate(new Date());

  return (
    <div style={{ background: '#F9F6F0', color: '#2C1E1A', minHeight: '100vh' }}>
      {/* Hero */}
      <header
        style={{
          padding: '20px 64px 16px',
          borderBottom: '1px solid #E2D9C8',
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          alignItems: 'end',
          gap: '20px',
          background: '#F9F6F0',
        }}
        className="max-sm:grid-cols-1 max-sm:px-6 max-sm:pt-4 max-sm:pb-3"
      >
        <div>
          <p
            style={{
              fontFamily: 'var(--font-code)',
              fontSize: '10px',
              letterSpacing: '0.32em',
              textTransform: 'uppercase',
              color: '#B0A090',
              marginBottom: '12px',
            }}
          >
            Boutique · Colección Premium
          </p>
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontWeight: 300,
              fontSize: 'clamp(3.5rem, 8vw, 5.25rem)',
              lineHeight: 0.9,
              letterSpacing: '-0.02em',
              color: '#2C1E1A',
              margin: 0,
            }}
          >
            Vitola
            <span style={{ fontStyle: 'italic', color: '#9B7840' }}>.</span>
          </h1>
        </div>
        <div
          style={{
            fontFamily: 'var(--font-code)',
            fontSize: '10px',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: '#B0A090',
            textAlign: 'right',
            lineHeight: 1.8,
          }}
          className="max-sm:text-left"
        >
          <div>{publicPuros.length} referencias activas</div>
          <div>Actualizado · {today}</div>
        </div>
      </header>

      <CatalogoGallery
        puros={publicItems}
        marcas={marcas}
        vitolas={vitolas}
        paises={paises}
        cepos={cepos}
        fortalezas={fortalezas}
      />

      <Link
        href="/admin/login"
        className="fixed bottom-5 right-5 p-2 transition-opacity duration-300"
        style={{ color: 'rgba(44,30,20,0.12)' }}
        aria-label="Admin"
      >
        <Lock size={13} />
      </Link>
    </div>
  );
}
