'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import type { Puro } from '@/types';

interface Props {
  puros: Puro[];
}

interface FormValues {
  puroId: string;
  marca: string;
  nombre: string;
  vitola: string;
  cepo: number;
  paisOrigen: string;
  capa: string;
  fecha: string;
  lugar: string;
  notas: string;
  fotoUrl: string;
  fotosAdicionales: string[];
  calificacion: number;
  cuerpo: number;
  dulzor: number;
  especia: number;
  tierra: number;
  madera: number;
  etiquetasAromaRaw: string;
  maridaje: string;
}

const EMPTY: FormValues = {
  puroId: '',
  marca: '',
  nombre: '',
  vitola: '',
  cepo: 0,
  paisOrigen: '',
  capa: '',
  fecha: new Date().toISOString().slice(0, 10),
  lugar: '',
  notas: '',
  fotoUrl: '',
  fotosAdicionales: [],
  calificacion: 0,
  cuerpo: 0,
  dulzor: 0,
  especia: 0,
  tierra: 0,
  madera: 0,
  etiquetasAromaRaw: '',
  maridaje: '',
};

async function uploadToCloudinary(file: File): Promise<string> {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: 'POST', body: fd },
  );
  const data = (await res.json()) as { secure_url?: string; error?: { message: string } };
  if (!res.ok || !data.secure_url) throw new Error(data.error?.message ?? 'Error al subir imagen');
  return data.secure_url;
}

export default function CataForm({ puros }: Props) {
  const router = useRouter();
  const [mode, setMode] = useState<'inventario' | 'manual'>('inventario');
  const [values, setValues] = useState<FormValues>(EMPTY);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function set<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function handlePuroSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    const puroId = e.target.value;
    if (!puroId) {
      set('puroId', '');
      return;
    }
    const puro = puros.find((p) => p.id === puroId);
    if (!puro) return;
    setValues((prev) => ({
      ...prev,
      puroId,
      marca: puro.marca,
      vitola: puro.vitola,
      cepo: puro.ringGauge,
      paisOrigen: puro.paisOrigen,
    }));
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    setError('');
    try {
      const urls = await Promise.all(files.map(uploadToCloudinary));
      setValues((prev) => {
        if (!prev.fotoUrl) {
          const [portada, ...rest] = urls;
          return { ...prev, fotoUrl: portada ?? '', fotosAdicionales: [...prev.fotosAdicionales, ...rest] };
        }
        return { ...prev, fotosAdicionales: [...prev.fotosAdicionales, ...urls] };
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al subir imágenes');
    } finally {
      setUploading(false);
    }
  }

  function removePortada() {
    setValues((prev) => {
      const [next, ...rest] = prev.fotosAdicionales;
      return { ...prev, fotoUrl: next ?? '', fotosAdicionales: rest };
    });
  }

  function removeAdicional(index: number) {
    setValues((prev) => ({
      ...prev,
      fotosAdicionales: prev.fotosAdicionales.filter((_, i) => i !== index),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (values.calificacion < 1 || values.calificacion > 100) {
      setError('La puntuación debe estar entre 1 y 100');
      return;
    }
    setError('');
    setSaving(true);
    try {
      const res = await fetch('/api/catas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fecha: values.fecha,
          lugar: values.lugar,
          fotoUrl: values.fotoUrl || undefined,
          fotosAdicionales: values.fotosAdicionales.length ? values.fotosAdicionales : undefined,
          notas: values.notas,
          calificacion: values.calificacion,
          marca: values.marca,
          nombre: values.nombre,
          vitola: values.vitola,
          cepo: values.cepo,
          paisOrigen: values.paisOrigen,
          capa: values.capa,
          puroId: values.puroId || undefined,
          cuerpo: values.cuerpo || undefined,
          dulzor: values.dulzor || undefined,
          especia: values.especia || undefined,
          tierra: values.tierra || undefined,
          madera: values.madera || undefined,
          etiquetasAroma: values.etiquetasAromaRaw
            ? values.etiquetasAromaRaw.split(',').map((t) => t.trim()).filter(Boolean)
            : undefined,
          maridaje: values.maridaje || undefined,
        }),
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setError(data.error ?? 'Error al guardar');
        return;
      }
      router.push('/admin/diario');
      router.refresh();
    } catch {
      setError('Error de red. Intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      {/* Modo */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider">
          Origen del puro
        </h2>
        <div className="flex rounded-lg border border-border overflow-hidden text-sm w-fit">
          <button
            type="button"
            onClick={() => setMode('inventario')}
            className={`px-5 py-2 transition-colors ${
              mode === 'inventario'
                ? 'bg-secondary text-white font-medium'
                : 'bg-surface text-text hover:bg-surface-alt'
            }`}
          >
            Del inventario
          </button>
          <button
            type="button"
            onClick={() => setMode('manual')}
            className={`px-5 py-2 transition-colors border-l border-border ${
              mode === 'manual'
                ? 'bg-secondary text-white font-medium'
                : 'bg-surface text-text hover:bg-surface-alt'
            }`}
          >
            Manual
          </button>
        </div>

        {mode === 'inventario' ? (
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-muted">Puro</label>
            <select
              value={values.puroId}
              onChange={handlePuroSelect}
              required
              className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-colors"
            >
              <option value="">Selecciona un puro...</option>
              {puros.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.marca} — {p.vitola} (Cepo {p.ringGauge})
                </option>
              ))}
            </select>
          </div>
        ) : null}

        {(mode === 'manual' || values.puroId) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Marca"
              value={values.marca}
              onChange={(e) => set('marca', e.target.value)}
              required
              readOnly={mode === 'inventario'}
            />
            <Input
              label="Nombre"
              value={values.nombre}
              onChange={(e) => set('nombre', e.target.value)}
              required
              readOnly={mode === 'inventario'}
            />
            <Input
              label="Vitola"
              value={values.vitola}
              onChange={(e) => set('vitola', e.target.value)}
              required
              readOnly={mode === 'inventario'}
            />
            <Input
              label="Cepo (ring gauge)"
              type="number"
              min={0}
              value={values.cepo}
              onChange={(e) => set('cepo', Number(e.target.value))}
              required
              readOnly={mode === 'inventario'}
            />
            <Input
              label="País de origen"
              value={values.paisOrigen}
              onChange={(e) => set('paisOrigen', e.target.value)}
              required
              readOnly={mode === 'inventario'}
            />
            <Input
              label="Capa"
              value={values.capa}
              onChange={(e) => set('capa', e.target.value)}
              placeholder="Ej: Colorado, Maduro, Claro..."
            />
          </div>
        )}
      </section>

      {/* Datos de cata */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider">
          Datos de cata
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Fecha"
            type="date"
            value={values.fecha}
            onChange={(e) => set('fecha', e.target.value)}
            required
          />
          <Input
            label="Lugar"
            value={values.lugar}
            onChange={(e) => set('lugar', e.target.value)}
            placeholder="Ej: Casa, Terraza, Lounge..."
          />
        </div>

        {/* Calificación */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-text-muted">Puntuación</label>
          <Input
            type="number"
            min={1}
            max={100}
            value={values.calificacion || ''}
            onChange={(e) => set('calificacion', Math.min(100, Math.max(0, Number(e.target.value))))}
            placeholder="1 – 100"
          />
          {values.calificacion > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-text-muted">{(values.calificacion / 20).toFixed(2)} / 5 estrellas</span>
              <div className="flex items-center gap-0.5">
                {[0, 1, 2, 3, 4].map((i) => {
                  const fill = Math.min(1, Math.max(0, values.calificacion / 20 - i));
                  return (
                    <span key={i} style={{ position: 'relative', display: 'inline-block' }}>
                      <span className="text-border text-lg">★</span>
                      {fill > 0 && (
                        <span
                          style={{
                            position: 'absolute', left: 0, top: 0,
                            overflow: 'hidden', width: `${fill * 100}%`, whiteSpace: 'nowrap',
                          }}
                          className="text-secondary text-lg"
                        >
                          ★
                        </span>
                      )}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Notas */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-text-muted">Notas de cata</label>
          <textarea
            value={values.notas}
            onChange={(e) => set('notas', e.target.value)}
            rows={5}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-colors resize-none"
            placeholder="Describe los sabores, aromas, retrogusto, construcción, combustión..."
          />
        </div>

        {/* Fotos */}
        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium text-text-muted">Fotos</label>

          {/* Portada */}
          {values.fotoUrl && (
            <div className="flex flex-col gap-1.5">
              <span className="text-xs text-text-muted uppercase tracking-wider">Portada</span>
              <div className="relative w-48 h-48 rounded-lg overflow-hidden border border-border bg-white group">
                <Image src={values.fotoUrl} alt="Portada" fill className="object-contain" />
                <button
                  type="button"
                  onClick={removePortada}
                  className="absolute top-1.5 right-1.5 rounded-full bg-black/60 text-white text-xs w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          {/* Adicionales */}
          {values.fotosAdicionales.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <span className="text-xs text-text-muted uppercase tracking-wider">Adicionales</span>
              <div className="flex flex-wrap gap-3">
                {values.fotosAdicionales.map((url, i) => (
                  <div key={url} className="relative w-24 h-24 rounded-lg overflow-hidden border border-border bg-white group">
                    <Image src={url} alt={`Foto ${i + 2}`} fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => removeAdicional(i)}
                      className="absolute top-1 right-1 rounded-full bg-black/60 text-white text-xs w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            disabled={uploading}
            className="text-sm text-text-muted file:mr-3 file:rounded-lg file:border file:border-border file:bg-surface file:px-3 file:py-1 file:text-sm file:text-text file:cursor-pointer hover:file:border-secondary/60 disabled:opacity-50"
          />
          <p className="text-xs text-text-muted">
            {values.fotoUrl ? 'Selecciona más para agregar fotos adicionales.' : 'La primera imagen será la portada.'}
          </p>
          {uploading && <p className="text-xs text-text-muted">Subiendo imágenes...</p>}
        </div>
      </section>

      {/* Perfil aromático */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider">
          Perfil aromático
        </h2>

        <div className="flex flex-col gap-3">
          {(['cuerpo', 'dulzor', 'especia', 'tierra', 'madera'] as const).map((attr) => (
            <div key={attr} className="flex items-center gap-4">
              <span className="text-sm text-text-muted capitalize w-20 shrink-0">{attr.charAt(0).toUpperCase() + attr.slice(1)}</span>
              <div className="flex gap-2">
                {[0, 1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => set(attr, n)}
                    className={`w-8 h-8 rounded-lg border text-sm font-medium transition-colors ${
                      values[attr] === n
                        ? 'bg-secondary text-white border-secondary'
                        : 'bg-surface border-border text-text-muted hover:border-secondary/60'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <span className="text-xs text-text-muted">{values[attr]} / 5</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-text-muted">
            Notas de aroma <span className="font-normal">(separadas por coma)</span>
          </label>
          <Input
            value={values.etiquetasAromaRaw}
            onChange={(e) => set('etiquetasAromaRaw', e.target.value)}
            placeholder="Ej: Cedro tostado, Cacao, Tierra húmeda, Cuero..."
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-text-muted">Maridaje sugerido</label>
          <textarea
            value={values.maridaje}
            onChange={(e) => set('maridaje', e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-colors resize-none"
            placeholder="Ej: Ron añejo dominicano, whisky ahumado o café de origen..."
          />
        </div>
      </section>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
        <Button type="button" variant="secondary" size="md" onClick={() => router.push('/admin/diario')}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" size="md" loading={saving}>
          Registrar cata
        </Button>
      </div>
    </form>
  );
}
