export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { getPuros, getVentas } from '@/lib/sheets';

export default async function SettingsPage() {
  const [puros, ventas] = await Promise.all([getPuros(), getVentas()]);

  const sheetId = process.env.GOOGLE_SHEETS_ID ?? '';
  const sheetUrl = sheetId
    ? `https://docs.google.com/spreadsheets/d/${sheetId}/edit`
    : '';
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? '';

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text">Configuración</h1>
          <p className="text-sm text-text-muted mt-0.5">Integraciones y exportación</p>
        </div>
        <Link
          href="/admin/dashboard"
          className="text-sm text-text-muted hover:text-secondary transition-colors"
        >
          ← Dashboard
        </Link>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6">
        {/* Google Sheets */}
        <Section title="Google Sheets">
          <InfoRow label="Spreadsheet ID" value={sheetId || '—'} mono />
          <InfoRow label="Puros en hoja" value={String(puros.length)} />
          <InfoRow label="Ventas en hoja" value={String(ventas.length)} />
          {sheetUrl && (
            <a
              href={sheetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-secondary hover:opacity-80 transition-opacity"
            >
              Abrir en Google Sheets →
            </a>
          )}
        </Section>

        {/* Cloudinary */}
        <Section title="Cloudinary">
          <InfoRow label="Cloud name" value={cloudName || '—'} mono />
          <InfoRow
            label="Upload preset"
            value={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ? '••••••••' : '—'}
          />
        </Section>

        {/* Exportar */}
        <Section title="Exportar datos">
          <p className="text-sm text-text-muted">
            Descarga todo el inventario como archivo CSV compatible con Excel.
          </p>
          <a
            href="/api/export"
            download
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-background text-sm font-medium hover:opacity-90 transition-opacity w-fit"
          >
            Descargar CSV ({puros.length} puros)
          </a>
        </Section>

        {/* Cuenta */}
        <Section title="Cuenta">
          <p className="text-sm text-text-muted">
            La contraseña de acceso se gestiona a través de la variable de entorno{' '}
            <code className="px-1.5 py-0.5 rounded bg-surface-alt text-text text-xs font-mono">
              ADMIN_PASSWORD
            </code>
            .
          </p>
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="text-sm text-red-400 hover:text-red-300 transition-colors"
            >
              Cerrar sesión
            </button>
          </form>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5 flex flex-col gap-4">
      <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider">{title}</h2>
      {children}
    </div>
  );
}

function InfoRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-text-muted">{label}</span>
      <span
        className={`text-sm text-text truncate max-w-[260px] ${mono ? 'font-mono text-xs' : ''}`}
      >
        {value}
      </span>
    </div>
  );
}
