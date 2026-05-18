export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { getPuros, getVentas } from '@/lib/sheets';
import { calcularKPIs } from '@/lib/calculations';
import DashboardActions from '@/components/admin/DashboardActions';
import MobileNav from '@/components/admin/MobileNav';

export default async function DashboardPage() {
  const [puros, ventas] = await Promise.all([getPuros(), getVentas()]);
  const kpis = calcularKPIs(puros, ventas);

  const negocio = puros.filter((p) => p.estado === 'negocio');
  const coleccion = puros.filter((p) => p.estado === 'coleccion_personal');

  return (
    <div style={{ background: '#F9F6F0', color: '#2C1E1A', minHeight: '100vh' }}>
      <MobileNav />
      <header
        style={{
          borderBottom: '1px solid #E2D9C8',
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          alignItems: 'end',
          gap: '20px',
          background: '#F9F6F0',
        }}
        className="grid-cols-1 md:grid-cols-[1fr_auto] px-4 md:px-16 pt-4 md:pt-5 pb-3 md:pb-4"
      >
        <div>
          <p
            style={{
              fontFamily: 'var(--font-code)',
              fontSize: '10px',
              letterSpacing: '0.32em',
              textTransform: 'uppercase',
              color: '#B0A090',
              margin: '0 0 10px',
            }}
          >
            Vitola · Panel de Control
          </p>
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '32px',
              fontWeight: 700,
              color: '#2C1E1A',
              margin: 0,
              lineHeight: 1,
            }}
          >
            Dashboard
          </h1>
        </div>
        <nav className="flex items-center gap-4 md:gap-7 overflow-x-auto whitespace-nowrap scrollbar-hide pb-1 md:pb-0">
          {[
            { href: '/admin/inventario', label: 'Inventario' },
            { href: '/admin/ventas', label: 'Ventas' },
            { href: '/admin/coleccion', label: 'Mi Colección' },
            { href: '/admin/diario', label: 'Mi Diario' },
            { href: '/admin/clientes', label: 'Clientes' },
            { href: '/admin/settings', label: 'Configuración' },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              style={{
                fontFamily: 'var(--font-code)',
                fontSize: '10px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#9A8572',
                textDecoration: 'none',
                transition: 'color 0.15s',
              }}
              className="hover:!text-[#5C3D1E] shrink-0"
            >
              {label}
            </Link>
          ))}
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              style={{
                fontFamily: 'var(--font-code)',
                fontSize: '10px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#9A8572',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                transition: 'color 0.15s',
                whiteSpace: 'nowrap',
              }}
              className="hover:!text-[#5C3D1E]"
            >
              Salir
            </button>
          </form>
        </nav>
      </header>

      <div
        style={{ maxWidth: '1100px', margin: '0 auto' }}
        className="px-4 md:px-16 pt-8 md:pt-14 pb-24 md:pb-20"
      >
        {/* KPI grid */}
        <div
          className="grid grid-cols-2 lg:grid-cols-4"
          style={{ background: '#E2D9C8', gap: '1px', marginBottom: '56px' }}
        >
          <KPICard
            label="Stock total"
            value={String(kpis.stockTotal)}
            sub={`${negocio.length} negocio · ${coleccion.length} colección`}
          />
          <KPICard
            label="Ganancias proyectadas"
            value={`$${kpis.gananciasProyectadas.toLocaleString('es-MX')}`}
            sub="de puros en negocio"
          />
          <KPICard
            label="Ganancias reales"
            value={`$${kpis.gananciasReales.toLocaleString('es-MX')}`}
            sub={`${ventas.length} ventas`}
          />
          <KPICard
            label="Valor colección"
            value={`$${kpis.valorColeccionPersonal.toLocaleString('es-MX')}`}
            sub="costo total"
          />
        </div>

        {/* Alerts */}
        {(kpis.purosAcercandose1Año.length > 0 || kpis.purosAcercandose2Anos.length > 0) && (
          <div style={{ marginBottom: '56px' }}>
            <p
              style={{
                fontFamily: 'var(--font-code)',
                fontSize: '9px',
                letterSpacing: '0.32em',
                textTransform: 'uppercase',
                color: '#B0A090',
                margin: '0 0 20px',
              }}
            >
              Próximos hitos de añejamiento
            </p>
            <div style={{ border: '1px solid #E2D9C8' }}>
              {kpis.purosAcercandose1Año.map((p) => (
                <AlertRow
                  key={p.id}
                  id={p.id}
                  nombre={p.nombre}
                  marca={p.marca}
                  label="Cumple 1 año en ≤30 días"
                />
              ))}
              {kpis.purosAcercandose2Anos.map((p) => (
                <AlertRow
                  key={p.id}
                  id={p.id}
                  nombre={p.nombre}
                  marca={p.marca}
                  label="Cumple 2 años en ≤30 días"
                />
              ))}
            </div>
          </div>
        )}

        {/* Quick actions */}
        <div>
          <p
            style={{
              fontFamily: 'var(--font-code)',
              fontSize: '9px',
              letterSpacing: '0.32em',
              textTransform: 'uppercase',
              color: '#B0A090',
              margin: '0 0 20px',
            }}
          >
            Acciones rápidas
          </p>
          <DashboardActions puros={puros} />
        </div>
      </div>
    </div>
  );
}

function KPICard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div
      style={{
        background: '#FFFFFF',
        padding: '20px 16px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
      className="md:!p-[32px_28px_28px]"
    >
      <p
        style={{
          fontFamily: 'var(--font-code)',
          fontSize: '9px',
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          color: '#B0A090',
          margin: 0,
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '28px',
          fontWeight: 700,
          color: '#2C1E1A',
          margin: 0,
          lineHeight: 1,
        }}
        className="md:!text-[34px]"
      >
        {value}
      </p>
      <p
        style={{
          fontFamily: 'var(--font-code)',
          fontSize: '10px',
          letterSpacing: '0.1em',
          color: '#9A8572',
          margin: 0,
        }}
      >
        {sub}
      </p>
    </div>
  );
}

function AlertRow({
  id,
  nombre,
  marca,
  label,
}: {
  id: string;
  nombre: string;
  marca: string;
  label: string;
}) {
  return (
    <Link
      href={`/admin/inventario/${id}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 16px',
        borderBottom: '1px solid #EDE8DE',
        background: '#FFFFFF',
        textDecoration: 'none',
        transition: 'background 0.15s',
        gap: '12px',
      }}
      className="md:!p-[18px_24px] hover:!bg-[#FDFAF5]"
    >
      <div style={{ minWidth: 0 }}>
        <p
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '15px',
            color: '#2C1E1A',
            margin: '0 0 3px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {nombre}
        </p>
        <p
          style={{
            fontFamily: 'var(--font-code)',
            fontSize: '10px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#9A8572',
            margin: 0,
          }}
        >
          {marca}
        </p>
      </div>
      <span
        style={{
          fontFamily: 'var(--font-code)',
          fontSize: '9px',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: '#9B7840',
          border: '1px solid #C4A472',
          padding: '5px 10px',
          background: '#F5EDD8',
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}
      >
        {label}
      </span>
    </Link>
  );
}
