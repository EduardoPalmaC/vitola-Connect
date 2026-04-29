'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback } from 'react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';

interface FilterSidebarProps {
  marcas: string[];
  vitolas: string[];
  paises: string[];
}

export default function FilterSidebar({ marcas, vitolas, paises }: FilterSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete('page');
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  const clearAll = () => router.push(pathname);

  const hasFilters = searchParams.toString().length > 0;

  return (
    <aside className="flex flex-col gap-5 w-full">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-text uppercase tracking-wider">Filtros</h2>
        {hasFilters && (
          <button onClick={clearAll} className="text-xs text-text-muted hover:text-secondary transition-colors">
            Limpiar
          </button>
        )}
      </div>

      <Input
        placeholder="Buscar..."
        defaultValue={searchParams.get('search') ?? ''}
        onChange={(e) => setParam('search', e.target.value)}
      />

      <Select
        label="Marca"
        value={searchParams.get('marca') ?? ''}
        onChange={(e) => setParam('marca', e.target.value)}
        placeholder="Todas"
      >
        {marcas.map((m) => (
          <option key={m} value={m}>{m}</option>
        ))}
      </Select>

      <Select
        label="Vitola"
        value={searchParams.get('vitola') ?? ''}
        onChange={(e) => setParam('vitola', e.target.value)}
        placeholder="Todas"
      >
        {vitolas.map((v) => (
          <option key={v} value={v}>{v}</option>
        ))}
      </Select>

      <Select
        label="País de origen"
        value={searchParams.get('paisOrigen') ?? ''}
        onChange={(e) => setParam('paisOrigen', e.target.value)}
        placeholder="Todos"
      >
        {paises.map((p) => (
          <option key={p} value={p}>{p}</option>
        ))}
      </Select>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-text-muted">Precio</p>
        <div className="flex gap-2">
          <Input
            placeholder="Mín"
            type="number"
            min={0}
            defaultValue={searchParams.get('precioMin') ?? ''}
            onBlur={(e) => setParam('precioMin', e.target.value)}
          />
          <Input
            placeholder="Máx"
            type="number"
            min={0}
            defaultValue={searchParams.get('precioMax') ?? ''}
            onBlur={(e) => setParam('precioMax', e.target.value)}
          />
        </div>
      </div>

      <Button variant="secondary" size="sm" onClick={clearAll} className="w-full mt-1">
        Resetear filtros
      </Button>
    </aside>
  );
}
