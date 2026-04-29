export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { getPuros, getVentas } from '@/lib/sheets';
import { calcularKPIs } from '@/lib/calculations';
import DashboardActions from '@/components/admin/DashboardActions';

export default async function DashboardPage() {
  const [puros, ventas] = await Promise.all([getPuros(), getVentas()]);
  const kpis = calcularKPIs(puros, ventas);

  const negocio = puros.filter((p) => p.estado === 'negocio');
  const coleccion = puros.filter((p) => p.estado === 'coleccion_personal');

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text">Dashboard</h1>
          <p className="text-sm text-text-muted mt-0.5">Resumen de inventario</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/inventario"
            className="text-sm text-text-muted hover:text-secondary transition-colors"
          >
            Inventario
          </Link>
          <Link
            href="/admin/coleccion"
            className="text-sm text-text-muted hover:text-secondary transition-colors"
          >
            Mi Colección
          </Link>
          <Link
            href="/admin/diario"
            className="text-sm text-text-muted hover:text-secondary transition-colors"
          >
            Mi Diario
          </Link>
          <Link
            href="/admin/settings"
            className="text-sm text-text-muted hover:text-secondary transition-colors"
          >
            Configuración
          </Link>
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="text-sm text-text-muted hover:text-secondary transition-colors"
            >
              Salir
            </button>
          </form>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">
        {/* KPI grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
          <div className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold text-text uppercase tracking-wider">
              Próximos hitos de añejamiento
            </h2>
            <div className="flex flex-col gap-2">
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
        <DashboardActions puros={puros} />
      </div>
    </div>
  );
}

function KPICard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5 flex flex-col gap-1">
      <p className="text-xs text-text-muted uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-bold text-text">{value}</p>
      <p className="text-xs text-text-muted">{sub}</p>
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
      className="flex items-center justify-between rounded-lg border border-border bg-surface px-4 py-3 hover:border-secondary/60 transition-colors"
    >
      <div>
        <p className="text-sm font-medium text-text">{nombre}</p>
        <p className="text-xs text-text-muted">{marca}</p>
      </div>
      <span className="text-xs text-secondary">{label}</span>
    </Link>
  );
}
