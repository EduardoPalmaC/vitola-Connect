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
  vitola: string;
  cepo: number;
  paisOrigen: string;
  capa: string;
  fecha: string;
  lugar: string;
  notas: string;
  fotoUrl: string;
  calificacion: number;
}

const EMPTY: FormValues = {
  puroId: '',
  marca: '',
  vitola: '',
  cepo: 0,
  paisOrigen: '',
  capa: '',
  fecha: new Date().toISOString().slice(0, 10),
  lugar: '',
  notas: '',
  fotoUrl: '',
  calificacion: 0,
};

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
    if (values.calificacion === 0) {
      setError('Selecciona una calificación');
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
          notas: values.notas,
          calificacion: values.calificacion,
          marca: values.marca,
          vitola: values.vitola,
          cepo: values.cepo,
          paisOrigen: values.paisOrigen,
          capa: values.capa,
          puroId: values.puroId || undefined,
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
          <label className="text-sm font-medium text-text-muted">Calificación</label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => set('calificacion', star)}
                className="text-2xl transition-transform hover:scale-110 focus:outline-none"
              >
                <span className={star <= values.calificacion ? 'text-secondary' : 'text-border'}>
                  ★
                </span>
              </button>
            ))}
            {values.calificacion > 0 && (
              <span className="ml-2 text-sm text-text-muted">{values.calificacion}/5</span>
            )}
          </div>
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

        {/* Foto */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-text-muted">Foto</label>
          {values.fotoUrl && (
            <div className="relative h-48 w-48 rounded-lg overflow-hidden border border-border bg-white">
              <Image src={values.fotoUrl} alt="Foto de la cata" fill className="object-contain" />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading}
            className="text-sm text-text-muted file:mr-3 file:rounded-lg file:border file:border-border file:bg-surface file:px-3 file:py-1 file:text-sm file:text-text file:cursor-pointer hover:file:border-secondary/60 disabled:opacity-50"
          />
          {uploading && <p className="text-xs text-text-muted">Subiendo imagen...</p>}
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
