import type { Puro, FilterParams } from '@/types';

const PAGE_SIZE = 24;

export function filtrarPuros(puros: Puro[], params: FilterParams): Puro[] {
  return puros.filter((p) => {
    if (params.marca && p.marca !== params.marca) return false;
    if (params.vitola && p.vitola !== params.vitola) return false;
    if (params.ringGauge !== undefined && p.ringGauge !== params.ringGauge) return false;
    if (params.paisOrigen && p.paisOrigen !== params.paisOrigen) return false;
    if (params.estado && p.estado !== params.estado) return false;
    if (params.precioMin !== undefined && p.precioVenta < params.precioMin) return false;
    if (params.precioMax !== undefined && p.precioVenta > params.precioMax) return false;
    if (
      params.tiempoAnejamientoMin !== undefined &&
      p.tiempoAnejamiento < params.tiempoAnejamientoMin
    )
      return false;
    if (params.search) {
      const q = params.search.toLowerCase();
      const haystack = `${p.nombre} ${p.marca} ${p.vitola} ${p.paisOrigen}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

export function paginar<T>(items: T[], page = 1): { items: T[]; total: number; pages: number } {
  const total = items.length;
  const pages = Math.ceil(total / PAGE_SIZE);
  const start = (page - 1) * PAGE_SIZE;
  return { items: items.slice(start, start + PAGE_SIZE), total, pages };
}

export function getUniqueValues<K extends keyof Puro>(puros: Puro[], key: K): Puro[K][] {
  return [...new Set(puros.map((p) => p[key]))].sort() as Puro[K][];
}
