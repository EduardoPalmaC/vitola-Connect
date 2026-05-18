export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { getClientes } from '@/lib/sheets';
import ClientesTable from '@/components/admin/ClientesTable';
import MobileNav from '@/components/admin/MobileNav';

export default async function ClientesPage() {
  const clientes = await getClientes();

  const totalPuros = clientes.reduce((s, c) => s + c.totalPuros, 0);
  const totalGastado = clientes.reduce((s, c) => s + c.totalGastado, 0);

  return (
    <div style={{ background: '#F9F6F0', color: '#2C1E1A', minHeight: '100vh' }}>
      <MobileNav />
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
          <p style={{
            fontFamily: 'var(--font-code)', fontSize: '10px',
            letterSpacing: '0.32em', textTransform: 'uppercase',
            color: '#B0A090', margin: '0 0 10px',
          }}>
            Vitola · Clientes
          </p>
          <h1 style={{
            fontFamily: 'var(--font-serif)', fontSize: '32px',
            fontWeight: 700, color: '#2C1E1A', margin: 0, lineHeight: 1,
          }}>
            Clientes
          </h1>
        </div>
        <nav style={{ display: 'flex', alignItems: 'center', gap: '28px' }} className="max-sm:hidden">
          {[
            { href: '/admin/dashboard', label: 'Dashboard' },
            { href: '/admin/inventario', label: 'Inventario' },
            { href: '/admin/ventas', label: 'Ventas' },
            { href: '/admin/coleccion', label: 'Mi Colección' },
            { href: '/admin/diario', label: 'Mi Diario' },
            { href: '/admin/settings', label: 'Configuración' },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              style={{
                fontFamily: 'var(--font-code)', fontSize: '10px',
                letterSpacing: '0.2em', textTransform: 'uppercase',
                color: '#9A8572', textDecoration: 'none', transition: 'color 0.15s',
              }}
              className="hover:!text-[#5C3D1E]"
            >
              {label}
            </Link>
          ))}
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              style={{
                fontFamily: 'var(--font-code)', fontSize: '10px',
                letterSpacing: '0.2em', textTransform: 'uppercase',
                color: '#9A8572', background: 'transparent',
                border: 'none', cursor: 'pointer', padding: 0, transition: 'color 0.15s',
              }}
              className="hover:!text-[#5C3D1E]"
            >
              Salir
            </button>
          </form>
        </nav>
      </header>

      <div
        style={{ maxWidth: '1100px', margin: '0 auto', padding: '56px 64px 80px' }}
        className="max-sm:px-6 max-sm:py-8 max-sm:pb-20"
      >
        {/* KPI strip */}
        <div
          className="grid grid-cols-1 sm:grid-cols-3"
          style={{ background: '#E2D9C8', gap: '1px', marginBottom: '48px' }}
        >
          <KPICard label="Clientes registrados" value={String(clientes.length)} />
          <KPICard label="Puros vendidos" value={String(totalPuros)} />
          <KPICard label="Facturación total" value={`$${totalGastado.toLocaleString('es-MX')}`} />
        </div>

        {/* Section header */}
        <div style={{ marginBottom: '20px' }}>
          <p style={{
            fontFamily: 'var(--font-code)', fontSize: '9px',
            letterSpacing: '0.32em', textTransform: 'uppercase',
            color: '#B0A090', margin: 0,
          }}>
            Directorio · {clientes.length} {clientes.length === 1 ? 'cliente' : 'clientes'}
          </p>
        </div>

        <ClientesTable clientes={clientes} />
      </div>
    </div>
  );
}

function KPICard({ label, value }: { label: string; value: string }) {
  return (
    <div style={{
      background: '#FFFFFF', padding: '28px 28px 24px',
      display: 'flex', flexDirection: 'column', gap: '8px',
    }}>
      <p style={{
        fontFamily: 'var(--font-code)', fontSize: '9px',
        letterSpacing: '0.28em', textTransform: 'uppercase',
        color: '#B0A090', margin: 0,
      }}>
        {label}
      </p>
      <p style={{
        fontFamily: 'var(--font-serif)', fontSize: '30px',
        fontWeight: 700, color: '#2C1E1A', margin: 0, lineHeight: 1,
      }}>
        {value}
      </p>
    </div>
  );
}
