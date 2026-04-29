'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import type { Puro } from '@/types';

type FormValues = Omit<Puro, 'id' | 'createdAt' | 'updatedAt'>;

const EMPTY: FormValues = {
  nombre: '',
  marca: '',
  vitola: '',
  ringGauge: 0,
  largo: 0,
  paisOrigen: '',
  precioBruto: 0,
  costoTransporte: 0,
  costoAlmacenamiento: 0,
  precioVenta: 0,
  estado: 'negocio',
  fechaLlegada: '',
  tiempoAnejamiento: 0,
  humedad: 65,
  fechaRevisionHumedad: '',
  fotoUrl: '',
  notasCata: '',
  stock: 1,
};

interface Props {
  mode: 'create' | 'edit';
  id?: string;
  initialData?: Partial<FormValues>;
}

export default function PuroForm({ mode, id, initialData }: Props) {
  const router = useRouter();
  const [values, setValues] = useState<FormValues>({ ...EMPTY, ...initialData });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  // Mazo/Pieza state
  const [costMode, setCostMode] = useState<'pieza' | 'mazo'>('pieza');
  const [costoMazo, setCostoMazo] = useState(0);
  const [purosPorMazo, setPurosPorMazo] = useState(25);
  const [transporteMazo, setTransporteMazo] = useState(0);
  const [almacenamientoMazo, setAlmacenamientoMazo] = useState(0);

  // Live cost calculations
  const costoTotal = values.precioBruto + values.costoTransporte + values.costoAlmacenamiento;
  const gananciaCalc = values.precioVenta - costoTotal;
  const margenCalc = costoTotal > 0 ? (gananciaCalc / costoTotal) * 100 : 0;

  function set<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function numericSet(key: keyof FormValues) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      set(key, Number(e.target.value) as FormValues[typeof key]);
  }

  function calcMazoPrecioBruto(mazo: number, transporte: number, almacenamiento: number, qty: number) {
    return qty > 0 ? (mazo + transporte + almacenamiento) / qty : 0;
  }

  function handleCostoMazoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const mazo = Number(e.target.value);
    setCostoMazo(mazo);
    set('precioBruto', calcMazoPrecioBruto(mazo, transporteMazo, almacenamientoMazo, purosPorMazo));
  }

  function handlePurosPorMazoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const qty = Number(e.target.value);
    setPurosPorMazo(qty);
    set('precioBruto', calcMazoPrecioBruto(costoMazo, transporteMazo, almacenamientoMazo, qty));
    set('stock', qty);
  }

  function handleTransporteMazoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const transporte = Number(e.target.value);
    setTransporteMazo(transporte);
    set('precioBruto', calcMazoPrecioBruto(costoMazo, transporte, almacenamientoMazo, purosPorMazo));
  }

  function handleAlmacenamientoMazoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const almacenamiento = Number(e.target.value);
    setAlmacenamientoMazo(almacenamiento);
    set('precioBruto', calcMazoPrecioBruto(costoMazo, transporteMazo, almacenamiento, purosPorMazo));
  }

  function handleCostModeChange(mode: 'pieza' | 'mazo') {
    setCostMode(mode);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: fd },
      );
      const data = (await res.json()) as { secure_url?: string; error?: { message: string } };

      if (!res.ok || !data.secure_url) {
        setError(data.error?.message ?? 'Error al subir imagen');
        return;
      }
      set('fotoUrl', data.secure_url);
    } catch {
      setError('Error de red al subir imagen');
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const url = mode === 'create' ? '/api/puros' : `/api/puros/${id}`;
      const method = mode === 'create' ? 'POST' : 'PUT';

      const payload =
        costMode === 'mazo'
          ? {
              ...values,
              precioBruto: calcMazoPrecioBruto(costoMazo, transporteMazo, almacenamientoMazo, purosPorMazo),
              costoTransporte: 0,
              costoAlmacenamiento: 0,
            }
          : values;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setError(data.error ?? 'Error al guardar');
        return;
      }

      router.push('/admin/inventario');
      router.refresh();
    } catch {
      setError('Error de red. Intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm('¿Eliminar este puro? Esta acción no se puede deshacer.')) return;
    setDeleting(true);
    try {
      await fetch(`/api/puros/${id}`, { method: 'DELETE' });
      router.push('/admin/inventario');
      router.refresh();
    } catch {
      setError('Error al eliminar');
      setDeleting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      {/* Identificación */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider">
          Identificación
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Nombre"
            value={values.nombre}
            onChange={(e) => set('nombre', e.target.value)}
            required
          />
          <Input
            label="Marca"
            value={values.marca}
            onChange={(e) => set('marca', e.target.value)}
            required
          />
          <Input
            label="Vitola"
            value={values.vitola}
            onChange={(e) => set('vitola', e.target.value)}
            required
          />
          <Input
            label="País de origen"
            value={values.paisOrigen}
            onChange={(e) => set('paisOrigen', e.target.value)}
            required
          />
          <Input
            label="Ring gauge"
            type="number"
            min={0}
            value={values.ringGauge}
            onChange={numericSet('ringGauge')}
            required
          />
          <Input
            label="Largo (mm)"
            type="number"
            min={0}
            value={values.largo}
            onChange={numericSet('largo')}
            required
          />
        </div>
      </section>

      {/* Costos y precio */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider">
          Costos y precio
        </h2>

        {/* Toggle mazo/pieza */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-text-muted">Ingresar costo por:</span>
          <div className="flex rounded-lg border border-border overflow-hidden text-sm">
            <button
              type="button"
              onClick={() => handleCostModeChange('pieza')}
              className={`px-4 py-1.5 transition-colors ${
                costMode === 'pieza'
                  ? 'bg-secondary text-white font-medium'
                  : 'bg-surface text-text hover:bg-surface-alt'
              }`}
            >
              Pieza
            </button>
            <button
              type="button"
              onClick={() => handleCostModeChange('mazo')}
              className={`px-4 py-1.5 transition-colors border-l border-border ${
                costMode === 'mazo'
                  ? 'bg-secondary text-white font-medium'
                  : 'bg-surface text-text hover:bg-surface-alt'
              }`}
            >
              Mazo
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {costMode === 'pieza' ? (
            <Input
              label="Costo unitario ($)"
              type="number"
              min={0}
              step="0.01"
              value={values.precioBruto}
              onChange={numericSet('precioBruto')}
              required
            />
          ) : (
            <>
              <Input
                label="Costo total del mazo ($)"
                type="number"
                min={0}
                step="0.01"
                value={costoMazo}
                onChange={handleCostoMazoChange}
                required
              />
              <Input
                label="Puros por mazo"
                type="number"
                min={1}
                value={purosPorMazo}
                onChange={handlePurosPorMazoChange}
                required
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-text-muted">Costo unitario calculado</label>
                <div className="px-3 py-2 rounded-lg border border-border bg-surface-alt text-sm text-text font-medium">
                  ${purosPorMazo > 0 ? calcMazoPrecioBruto(costoMazo, transporteMazo, almacenamientoMazo, purosPorMazo).toFixed(2) : '0.00'}
                </div>
              </div>
            </>
          )}

          <Input
            label={costMode === 'mazo' ? 'Transporte del mazo ($)' : 'Costo transporte ($)'}
            type="number"
            min={0}
            step="0.01"
            value={costMode === 'mazo' ? transporteMazo : values.costoTransporte}
            onChange={costMode === 'mazo' ? handleTransporteMazoChange : numericSet('costoTransporte')}
            required
          />
          <Input
            label={costMode === 'mazo' ? 'Almacenamiento del mazo ($)' : 'Costo almacenamiento ($)'}
            type="number"
            min={0}
            step="0.01"
            value={costMode === 'mazo' ? almacenamientoMazo : values.costoAlmacenamiento}
            onChange={costMode === 'mazo' ? handleAlmacenamientoMazoChange : numericSet('costoAlmacenamiento')}
            required
          />
          <Input
            label="Precio de venta ($)"
            type="number"
            min={0}
            step="0.01"
            value={values.precioVenta}
            onChange={numericSet('precioVenta')}
            required
          />
        </div>

        {/* Ganancia y margen calculados */}
        {costoTotal > 0 && (
          <div className="grid grid-cols-3 gap-3 rounded-lg border border-border bg-surface-alt p-4">
            <div className="flex flex-col gap-0.5">
              <p className="text-xs text-text-muted">Costo total unitario</p>
              <p className="text-sm font-bold text-text">${costoTotal.toFixed(2)}</p>
            </div>
            <div className="flex flex-col gap-0.5">
              <p className="text-xs text-text-muted">Ganancia</p>
              <p className={`text-sm font-bold ${gananciaCalc >= 0 ? 'text-secondary' : 'text-red-400'}`}>
                ${gananciaCalc.toFixed(2)}
              </p>
            </div>
            <div className="flex flex-col gap-0.5">
              <p className="text-xs text-text-muted">Margen</p>
              <p className={`text-sm font-bold ${margenCalc >= 0 ? 'text-secondary' : 'text-red-400'}`}>
                {margenCalc.toFixed(1)}%
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Estado y añejamiento */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider">
          Estado y añejamiento
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Estado"
            value={values.estado}
            onChange={(e) => set('estado', e.target.value as FormValues['estado'])}
            required
          >
            <option value="negocio">Negocio</option>
            <option value="coleccion_personal">Colección personal</option>
          </Select>
          <Input
            label="Fecha de llegada"
            type="date"
            value={values.fechaLlegada}
            onChange={(e) => set('fechaLlegada', e.target.value)}
            required
          />
          <Input
            label="Tiempo añejamiento (meses)"
            type="number"
            min={0}
            value={values.tiempoAnejamiento}
            onChange={numericSet('tiempoAnejamiento')}
            required
          />
        </div>
      </section>

      {/* Stock */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider">
          Inventario
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Stock disponible"
            type="number"
            min={0}
            value={values.stock}
            onChange={numericSet('stock')}
            required
          />
        </div>
        {costMode === 'mazo' && (
          <p className="text-xs text-text-muted -mt-2">
            Sugerido automáticamente según los puros por mazo.
          </p>
        )}
      </section>

      {/* Humedad */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider">
          Humedad
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Humedad (%)"
            type="number"
            min={0}
            max={100}
            step="0.1"
            value={values.humedad}
            onChange={numericSet('humedad')}
            required
          />
          <Input
            label="Fecha revisión humedad"
            type="date"
            value={values.fechaRevisionHumedad}
            onChange={(e) => set('fechaRevisionHumedad', e.target.value)}
            required
          />
        </div>
      </section>

      {/* Foto y notas */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider">
          Foto y notas
        </h2>
        <div className="flex flex-col gap-3">
          {values.fotoUrl && (
            <div className="relative h-48 w-48 rounded-lg overflow-hidden border border-border bg-white">
              <Image src={values.fotoUrl} alt="Foto del puro" fill className="object-contain" />
            </div>
          )}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-muted">Foto</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
              className="text-sm text-text-muted file:mr-3 file:rounded-lg file:border file:border-border file:bg-surface file:px-3 file:py-1 file:text-sm file:text-text file:cursor-pointer hover:file:border-secondary/60 disabled:opacity-50"
            />
            {uploading && <p className="text-xs text-text-muted">Subiendo imagen...</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-muted">Notas de cata</label>
            <textarea
              value={values.notasCata ?? ''}
              onChange={(e) => set('notasCata', e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-colors resize-none"
              placeholder="Notas sobre el sabor, aroma, retrogusto..."
            />
          </div>
        </div>
      </section>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex items-center justify-between pt-2 border-t border-border">
        {mode === 'edit' ? (
          <Button type="button" variant="danger" size="sm" loading={deleting} onClick={handleDelete}>
            Eliminar puro
          </Button>
        ) : (
          <span />
        )}
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={() => router.push('/admin/inventario')}
          >
            Cancelar
          </Button>
          <Button type="submit" variant="primary" size="md" loading={saving}>
            {mode === 'create' ? 'Crear puro' : 'Guardar cambios'}
          </Button>
        </div>
      </div>
    </form>
  );
}
