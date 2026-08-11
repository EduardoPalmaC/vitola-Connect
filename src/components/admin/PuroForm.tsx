'use client';

import { useState, useEffect } from 'react';
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
  logoMarcaUrl: '',
  notasCata: '',
  stock: 1,
  fortaleza: '',
  humidor: '',
  costoMazo: 0,
  purosPorMazo: 25,
  transporteMazo: 0,
  almacenamientoMazo: 0,
  modoIngreso: 'pieza',
};

interface Props {
  mode: 'create' | 'edit';
  id?: string;
  initialData?: Partial<FormValues>;
}

export default function PuroForm({ mode, id, initialData }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [error, setError] = useState('');

  const initMode = initialData?.modoIngreso ?? 'pieza';
  const [costMode, setCostMode] = useState<'pieza' | 'mazo'>(initMode);

  // Pieza-level costs
  const [precioBruto, setPrecioBruto] = useState(initialData?.precioBruto ?? 0);
  const [costoTransporte, setCostoTransporte] = useState(initialData?.costoTransporte ?? 0);
  const [costoAlmacenamiento, setCostoAlmacenamiento] = useState(initialData?.costoAlmacenamiento ?? 0);

  // Mazo-level costs
  const [costoMazo, setCostoMazo] = useState(() => {
    if (initialData?.costoMazo) return initialData.costoMazo;
    const qty = initialData?.purosPorMazo ?? 25;
    return parseFloat(((initialData?.precioBruto ?? 0) * qty).toFixed(2));
  });
  const [purosPorMazo, setPurosPorMazo] = useState(initialData?.purosPorMazo ?? 25);
  const [transporteMazo, setTransporteMazo] = useState(() => {
    if (initialData?.transporteMazo) return initialData.transporteMazo;
    const qty = initialData?.purosPorMazo ?? 25;
    return parseFloat(((initialData?.costoTransporte ?? 0) * qty).toFixed(2));
  });
  const [almacenamientoMazo, setAlmacenamientoMazo] = useState(() => {
    if (initialData?.almacenamientoMazo) return initialData.almacenamientoMazo;
    const qty = initialData?.purosPorMazo ?? 25;
    return parseFloat(((initialData?.costoAlmacenamiento ?? 0) * qty).toFixed(2));
  });

  // Rest of form values
  const [values, setValues] = useState<Omit<FormValues, 'precioBruto' | 'costoTransporte' | 'costoAlmacenamiento' | 'costoMazo' | 'purosPorMazo' | 'transporteMazo' | 'almacenamientoMazo' | 'modoIngreso'>>({
    nombre: initialData?.nombre ?? EMPTY.nombre,
    marca: initialData?.marca ?? EMPTY.marca,
    vitola: initialData?.vitola ?? EMPTY.vitola,
    ringGauge: initialData?.ringGauge ?? EMPTY.ringGauge,
    largo: initialData?.largo ?? EMPTY.largo,
    paisOrigen: initialData?.paisOrigen ?? EMPTY.paisOrigen,
    precioVenta: initialData?.precioVenta ?? EMPTY.precioVenta,
    estado: initialData?.estado ?? EMPTY.estado,
    fechaLlegada: initialData?.fechaLlegada ?? EMPTY.fechaLlegada,
    tiempoAnejamiento: initialData?.tiempoAnejamiento ?? EMPTY.tiempoAnejamiento,
    humedad: initialData?.humedad ?? EMPTY.humedad,
    fechaRevisionHumedad: initialData?.fechaRevisionHumedad ?? EMPTY.fechaRevisionHumedad,
    fotoUrl: initialData?.fotoUrl ?? EMPTY.fotoUrl,
    logoMarcaUrl: initialData?.logoMarcaUrl ?? EMPTY.logoMarcaUrl,
    notasCata: initialData?.notasCata ?? EMPTY.notasCata,
    stock: initialData?.stock ?? EMPTY.stock,
    fortaleza: initialData?.fortaleza ?? EMPTY.fortaleza,
    humidor: initialData?.humidor ?? EMPTY.humidor,
  });

  const isColeccion = values.estado === 'coleccion_personal';

  // Derived: costo unitario (always from pieza fields for display)
  const costoTotalUnitario = precioBruto + costoTransporte + costoAlmacenamiento;
  const costoTotalMazo = costoMazo + transporteMazo + almacenamientoMazo;
  const costoUnitarioFromMazo = purosPorMazo > 0 ? costoTotalMazo / purosPorMazo : 0;
  const ganancia = values.precioVenta - costoTotalUnitario;
  const margen = costoTotalUnitario > 0 ? (ganancia / costoTotalUnitario) * 100 : 0;

  useEffect(() => {
    if (!values.fechaLlegada) return;
    const llegada = new Date(values.fechaLlegada);
    if (isNaN(llegada.getTime())) return;
    const hoy = new Date();
    const meses =
      (hoy.getFullYear() - llegada.getFullYear()) * 12 +
      (hoy.getMonth() - llegada.getMonth());
    setValues((prev) => ({ ...prev, tiempoAnejamiento: Math.max(0, meses) }));
  }, [values.fechaLlegada]);

  function set<K extends keyof typeof values>(key: K, value: typeof values[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  // Pieza field handlers — update mazo in sync
  function handlePrecioBrutoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = Number(e.target.value);
    setPrecioBruto(v);
    setCostoMazo(parseFloat((v * purosPorMazo).toFixed(2)));
  }

  function handleCostoTransporteChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = Number(e.target.value);
    setCostoTransporte(v);
    setTransporteMazo(parseFloat((v * purosPorMazo).toFixed(2)));
  }

  function handleCostoAlmacenamientoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = Number(e.target.value);
    setCostoAlmacenamiento(v);
    setAlmacenamientoMazo(parseFloat((v * purosPorMazo).toFixed(2)));
  }

  // Mazo field handlers — update pieza in sync
  function handleCostoMazoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = Number(e.target.value);
    setCostoMazo(v);
    setPrecioBruto(parseFloat((purosPorMazo > 0 ? v / purosPorMazo : 0).toFixed(4)));
  }

  function handleTransporteMazoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = Number(e.target.value);
    setTransporteMazo(v);
    setCostoTransporte(parseFloat((purosPorMazo > 0 ? v / purosPorMazo : 0).toFixed(4)));
  }

  function handleAlmacenamientoMazoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = Number(e.target.value);
    setAlmacenamientoMazo(v);
    setCostoAlmacenamiento(parseFloat((purosPorMazo > 0 ? v / purosPorMazo : 0).toFixed(4)));
  }

  function handlePurosPorMazoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const qty = Number(e.target.value);
    setPurosPorMazo(qty);
    // Derive pieza from mazo when changing qty in mazo mode, else derive mazo from pieza
    if (costMode === 'mazo') {
      setPrecioBruto(parseFloat((qty > 0 ? costoMazo / qty : 0).toFixed(4)));
      setCostoTransporte(parseFloat((qty > 0 ? transporteMazo / qty : 0).toFixed(4)));
      setCostoAlmacenamiento(parseFloat((qty > 0 ? almacenamientoMazo / qty : 0).toFixed(4)));
    } else {
      setCostoMazo(parseFloat((precioBruto * qty).toFixed(2)));
      setTransporteMazo(parseFloat((costoTransporte * qty).toFixed(2)));
      setAlmacenamientoMazo(parseFloat((costoAlmacenamiento * qty).toFixed(2)));
    }
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
      if (!res.ok || !data.secure_url) { setError(data.error?.message ?? 'Error al subir imagen'); return; }
      set('fotoUrl', data.secure_url);
    } catch { setError('Error de red al subir imagen'); }
    finally { setUploading(false); }
  }

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLogo(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: fd },
      );
      const data = (await res.json()) as { secure_url?: string; error?: { message: string } };
      if (!res.ok || !data.secure_url) { setError(data.error?.message ?? 'Error al subir logo'); return; }
      set('logoMarcaUrl', data.secure_url);
    } catch { setError('Error de red al subir logo'); }
    finally { setUploadingLogo(false); }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const url = mode === 'create' ? '/api/puros' : `/api/puros/${id}`;
      const method = mode === 'create' ? 'POST' : 'PUT';

      const payload = {
        ...values,
        precioBruto,
        costoTransporte,
        costoAlmacenamiento,
        costoMazo,
        purosPorMazo,
        transporteMazo,
        almacenamientoMazo,
        modoIngreso: costMode,
      };

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
    } catch { setError('Error de red. Intenta de nuevo.'); }
    finally { setSaving(false); }
  }

  async function handleDelete() {
    if (!confirm('¿Eliminar este puro? Esta acción no se puede deshacer.')) return;
    setDeleting(true);
    try {
      await fetch(`/api/puros/${id}`, { method: 'DELETE' });
      router.push('/admin/inventario');
      router.refresh();
    } catch { setError('Error al eliminar'); setDeleting(false); }
  }

  const summaryDisplay = (
    <div className={`grid gap-3 rounded-lg border border-border bg-surface-alt p-4 ${isColeccion ? 'grid-cols-1' : 'grid-cols-3'}`}>
      <div className="flex flex-col gap-0.5">
        <p className="text-xs text-text-muted">Costo total unitario</p>
        <p className="text-sm font-bold text-text">${costoTotalUnitario.toFixed(2)}</p>
      </div>
      {!isColeccion && (
        <>
          <div className="flex flex-col gap-0.5">
            <p className="text-xs text-text-muted">Ganancia</p>
            <p className={`text-sm font-bold ${ganancia >= 0 ? 'text-secondary' : 'text-red-400'}`}>
              ${ganancia.toFixed(2)}
            </p>
          </div>
          <div className="flex flex-col gap-0.5">
            <p className="text-xs text-text-muted">Margen</p>
            <p className={`text-sm font-bold ${margen >= 0 ? 'text-secondary' : 'text-red-400'}`}>
              {margen.toFixed(1)}%
            </p>
          </div>
        </>
      )}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      {/* Identificación */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider">Identificación</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Nombre" value={values.nombre} onChange={(e) => set('nombre', e.target.value)} required />
          <Input label="Marca" value={values.marca} onChange={(e) => set('marca', e.target.value)} required />
          <Input label="Vitola" value={values.vitola} onChange={(e) => set('vitola', e.target.value)} required />
          <Input label="País de origen" value={values.paisOrigen} onChange={(e) => set('paisOrigen', e.target.value)} required />
          <Input label="Ring gauge" type="number" min={0} value={values.ringGauge} onChange={(e) => set('ringGauge', Number(e.target.value))} required />
          <Input label="Largo (mm)" type="number" min={0} value={values.largo} onChange={(e) => set('largo', Number(e.target.value))} required />
          <Select label="Fortaleza" value={values.fortaleza ?? ''} onChange={(e) => set('fortaleza', e.target.value)}>
            <option value="">Sin especificar</option>
            <option value="Suave">Suave</option>
            <option value="Media">Media</option>
            <option value="Fuerte">Fuerte</option>
          </Select>
        </div>
      </section>

      {/* Costos y precio */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider">Costos y precio</h2>

        {/* Tab toggle */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-text-muted">Ingresar costo por:</span>
          <div className="flex rounded-lg border border-border overflow-hidden text-sm">
            <button
              type="button"
              onClick={() => setCostMode('pieza')}
              className={`px-4 py-1.5 transition-colors ${
                costMode === 'pieza' ? 'bg-secondary text-white font-medium' : 'bg-surface text-text hover:bg-surface-alt'
              }`}
            >
              Pieza
            </button>
            <button
              type="button"
              onClick={() => setCostMode('mazo')}
              className={`px-4 py-1.5 transition-colors border-l border-border ${
                costMode === 'mazo' ? 'bg-secondary text-white font-medium' : 'bg-surface text-text hover:bg-surface-alt'
              }`}
            >
              Mazo
            </button>
          </div>
        </div>

        {costMode === 'pieza' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Costo unitario ($)"
              type="number" min={0} step="0.01"
              value={precioBruto}
              onChange={handlePrecioBrutoChange}
              required
            />
            <Input
              label="Costo transporte ($)"
              type="number" min={0} step="0.01"
              value={costoTransporte}
              onChange={handleCostoTransporteChange}
              required
            />
            <Input
              label="Costo almacenamiento ($)"
              type="number" min={0} step="0.01"
              value={costoAlmacenamiento}
              onChange={handleCostoAlmacenamientoChange}
              required
            />
            {!isColeccion && (
              <Input
                label="Precio de venta ($)"
                type="number" min={0} step="0.01"
                value={values.precioVenta}
                onChange={(e) => set('precioVenta', Number(e.target.value))}
                required
              />
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Costo total del mazo ($)"
              type="number" min={0} step="0.01"
              value={costoMazo}
              onChange={handleCostoMazoChange}
              required
            />
            <Input
              label="Puros por mazo"
              type="number" min={1}
              value={purosPorMazo}
              onChange={handlePurosPorMazoChange}
              required
            />
            <Input
              label="Transporte del mazo ($)"
              type="number" min={0} step="0.01"
              value={transporteMazo}
              onChange={handleTransporteMazoChange}
              required
            />
            <Input
              label="Almacenamiento del mazo ($)"
              type="number" min={0} step="0.01"
              value={almacenamientoMazo}
              onChange={handleAlmacenamientoMazoChange}
              required
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-muted">Costo unitario calculado</label>
              <div className="px-3 py-2 rounded-lg border border-border bg-surface-alt text-sm text-text font-medium">
                ${costoUnitarioFromMazo.toFixed(4)}
              </div>
            </div>
            {!isColeccion && (
              <Input
                label="Precio de venta ($)"
                type="number" min={0} step="0.01"
                value={values.precioVenta}
                onChange={(e) => set('precioVenta', Number(e.target.value))}
                required
              />
            )}
          </div>
        )}

        {costoTotalUnitario > 0 && summaryDisplay}
      </section>

      {/* Estado y añejamiento */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider">Estado y añejamiento</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select label="Estado" value={values.estado} onChange={(e) => set('estado', e.target.value as typeof values.estado)} required>
            <option value="negocio">Negocio</option>
            <option value="coleccion_personal">Colección personal</option>
          </Select>
          <Input label="Fecha de llegada" type="date" value={values.fechaLlegada} onChange={(e) => set('fechaLlegada', e.target.value)} required />
          <Input
            label={`Añejamiento (meses)${values.fechaLlegada ? ' — calculado' : ''}`}
            type="number" min={0}
            value={values.tiempoAnejamiento}
            onChange={(e) => set('tiempoAnejamiento', Number(e.target.value))}
            readOnly={!!values.fechaLlegada}
            required
          />
        </div>
      </section>

      {/* Inventario */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider">Inventario</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Stock disponible"
            type="number" min={0}
            value={values.stock}
            onChange={(e) => set('stock', Number(e.target.value))}
            required
          />
          <Input
            label="Humidor"
            value={values.humidor ?? ''}
            onChange={(e) => set('humidor', e.target.value)}
            placeholder="Número o nombre del humidor"
          />
        </div>
        {costMode === 'mazo' && purosPorMazo > 0 && (
          <div className="flex items-center gap-2 -mt-2">
            <p className="text-xs text-text-muted">
              Recomendado basado en puros por mazo: <span className="font-medium text-text">{purosPorMazo}</span>
            </p>
            <button
              type="button"
              onClick={() => set('stock', purosPorMazo)}
              className="text-xs px-2 py-0.5 rounded border border-secondary/60 text-secondary hover:bg-secondary/10 transition-colors"
            >
              Usar
            </button>
          </div>
        )}
      </section>

      {/* Humedad */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider">Humedad</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Humedad (%)" type="number" min={0} max={100} step="0.1" value={values.humedad} onChange={(e) => set('humedad', Number(e.target.value))} required />
          <Input label="Fecha revisión humedad" type="date" value={values.fechaRevisionHumedad} onChange={(e) => set('fechaRevisionHumedad', e.target.value)} required />
        </div>
      </section>

      {/* Foto y notas */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider">Foto y notas</h2>
        <div className="flex flex-col gap-3">
          {values.fotoUrl && (
            <div className="relative h-48 w-48 rounded-lg overflow-hidden border border-border bg-white">
              <Image src={values.fotoUrl} alt="Foto del puro" fill className="object-contain" />
            </div>
          )}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-muted">Foto</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading}
              className="text-sm text-text-muted file:mr-3 file:rounded-lg file:border file:border-border file:bg-surface file:px-3 file:py-1 file:text-sm file:text-text file:cursor-pointer hover:file:border-secondary/60 disabled:opacity-50" />
            {uploading && <p className="text-xs text-text-muted">Subiendo imagen...</p>}
          </div>

          {values.logoMarcaUrl && (
            <div className="relative h-24 w-24 rounded-lg overflow-hidden border border-border bg-white">
              <Image src={values.logoMarcaUrl} alt="Logo de marca" fill className="object-contain" />
            </div>
          )}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-muted">Logo de marca</label>
            <input type="file" accept="image/*" onChange={handleLogoUpload} disabled={uploadingLogo}
              className="text-sm text-text-muted file:mr-3 file:rounded-lg file:border file:border-border file:bg-surface file:px-3 file:py-1 file:text-sm file:text-text file:cursor-pointer hover:file:border-secondary/60 disabled:opacity-50" />
            {uploadingLogo && <p className="text-xs text-text-muted">Subiendo logo...</p>}
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
          <Button type="button" variant="secondary" size="md" onClick={() => router.push('/admin/inventario')}>
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
