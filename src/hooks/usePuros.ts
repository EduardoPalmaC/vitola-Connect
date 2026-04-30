import { useState, useMemo, useRef, useEffect } from 'react';
import type { PuroPublico } from '@/types/index';

export type Filters = { marca: string; vitola: string; pais: string; cepo: string };

const EMPTY: Filters = { marca: '', vitola: '', pais: '', cepo: '' };

export const LABEL: Record<keyof Filters, string> = {
  marca: 'Marca',
  cepo: 'Cepo',
  vitola: 'Vitola',
  pais: 'País',
};

interface Props {
  puros: PuroPublico[];
  marcas: string[];
  vitolas: string[];
  paises: string[];
  cepos: number[];
}

export function usePuros({ puros, marcas, vitolas, paises, cepos }: Props) {
  const [filters, setFilters] = useState<Filters>(EMPTY);
  const [openKey, setOpenKey] = useState<keyof Filters | null>(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });
  const btnRefs = useRef<Partial<Record<keyof Filters, HTMLButtonElement>>>({});

  const handleToggle = (key: keyof Filters) => {
    if (openKey === key) {
      setOpenKey(null);
      return;
    }
    const el = btnRefs.current[key];
    if (el) {
      const rect = el.getBoundingClientRect();
      setDropdownPos({ top: rect.bottom, left: rect.left, width: Math.max(rect.width, 180) });
    }
    setOpenKey(key);
  };

  useEffect(() => {
    if (!openKey) return;
    const close = (e: MouseEvent) => {
      const el = btnRefs.current[openKey];
      if (!el || !el.contains(e.target as Node)) setOpenKey(null);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [openKey]);

  const set = (key: keyof Filters, val: string) => {
    setFilters((prev) => ({ ...prev, [key]: prev[key] === val ? '' : val }));
    setOpenKey(null);
  };

  const clear = () => {
    setFilters(EMPTY);
    setOpenKey(null);
  };

  const visible = useMemo(() => {
    return puros.filter((p) => {
      if (filters.marca && p.marca !== filters.marca) return false;
      if (filters.cepo && String(p.ringGauge) !== filters.cepo) return false;
      if (filters.vitola && p.vitola !== filters.vitola) return false;
      if (filters.pais && p.paisOrigen !== filters.pais) return false;
      return true;
    });
  }, [puros, filters]);

  const hasActive = Object.values(filters).some(Boolean);

  const filterDefs: { key: keyof Filters; opts: string[] }[] = [
    { key: 'marca', opts: marcas },
    { key: 'cepo', opts: cepos.map(String) },
    { key: 'vitola', opts: vitolas },
    { key: 'pais', opts: paises },
  ];

  return { filters, openKey, dropdownPos, btnRefs, handleToggle, set, clear, visible, hasActive, filterDefs };
}
