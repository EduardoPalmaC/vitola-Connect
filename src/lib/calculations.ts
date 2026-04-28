import type { Puro, Venta, DashboardKPIs } from '@/types';

export function calcularCostoTotal(puro: Puro): number {
  return puro.precioBruto + puro.costoTransporte + puro.costoAlmacenamiento;
}

export function calcularMargen(puro: Puro): number {
  const costo = calcularCostoTotal(puro);
  if (costo === 0) return 0;
  return ((puro.precioVenta - costo) / costo) * 100;
}

export function calcularGananciaProyectada(puro: Puro): number {
  return puro.precioVenta - calcularCostoTotal(puro);
}

export function calcularKPIs(puros: Puro[], ventas: Venta[]): DashboardKPIs {
  const coleccion = puros.filter((p) => p.estado === 'coleccion_personal');
  const negocio = puros.filter((p) => p.estado === 'negocio');

  const valorColeccionPersonal = coleccion.reduce(
    (sum, p) => sum + calcularCostoTotal(p),
    0
  );

  const gananciasProyectadas = negocio.reduce(
    (sum, p) => sum + calcularGananciaProyectada(p),
    0
  );

  const gananciasReales = ventas.reduce((sum, v) => sum + v.ganancia, 0);

  const stockTotal = puros.length;

  const hoy = new Date();

  const purosAcercandose1Año = puros.filter((p) => {
    const llegada = new Date(p.fechaLlegada);
    const objetivo = new Date(llegada);
    objetivo.setFullYear(objetivo.getFullYear() + 1);
    const diffMs = objetivo.getTime() - hoy.getTime();
    const diffDias = diffMs / (1000 * 60 * 60 * 24);
    return diffDias >= 0 && diffDias <= 30;
  });

  const purosAcercandose2Anos = puros.filter((p) => {
    const llegada = new Date(p.fechaLlegada);
    const objetivo = new Date(llegada);
    objetivo.setFullYear(objetivo.getFullYear() + 2);
    const diffMs = objetivo.getTime() - hoy.getTime();
    const diffDias = diffMs / (1000 * 60 * 60 * 24);
    return diffDias >= 0 && diffDias <= 30;
  });

  return {
    valorColeccionPersonal,
    gananciasProyectadas,
    gananciasReales,
    stockTotal,
    purosAcercandose1Año,
    purosAcercandose2Anos,
  };
}
