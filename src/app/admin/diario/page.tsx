export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { getCatas } from '@/lib/sheets';
import DiarioFilters from '@/components/admin/DiarioFilters';

export default async function DiarioPage() {
  const catas = await getCatas();

  return (
    <div style={{ background: '#F9F6F0', color: '#2C1E1A', minHeight: '100vh' }}>
      <header
        style={{
          padding: '20px 64px 16px',
          borderBottom: '1px solid #E2D9C8',
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          alignItems: 'end',
          gap: '20px',
          background: '#F9F6F0',
        }}
        className="max-sm:grid-cols-1 max-sm:px-6 max-sm:pt-4 max-sm:pb-3"
      >
        <div>
          <p style={{
            fontFamily: 'var(--font-code)',
            fontSize: '10px',
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            color: '#B0A090',
            marginBottom: '10px',
          }}>
            Admin · Diario de Catas
          </p>
          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontWeight: 400,
            fontSize: '40px',
            lineHeight: 0.9,
            letterSpacing: '-0.02em',
            color: '#2C1E1A',
            margin: 0,
          }}>
            Mi Diario<span style={{ color: '#9B7840' }}>.</span>
          </h1>
        </div>
        <div
          style={{
            fontFamily: 'var(--font-code)',
            fontSize: '10px',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: '#B0A090',
            textAlign: 'right',
            lineHeight: 1.8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '10px',
          }}
          className="max-sm:text-left max-sm:items-start"
        >
          <div>{catas.length} catas registradas</div>
          <div style={{ display: 'flex', gap: '0', alignItems: 'stretch' }}>
            <Link
              href="/admin/dashboard"
              style={{
                fontFamily: 'var(--font-code)',
                fontSize: '10px',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: '#9B7840',
                textDecoration: 'none',
                border: '1px solid #DDD5C5',
                padding: '8px 20px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              Dashboard
            </Link>
            <Link
              href="/admin/catas/nuevo"
              style={{
                fontFamily: 'var(--font-code)',
                fontSize: '10px',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                background: '#9B7840',
                color: '#FFFFFF',
                textDecoration: 'none',
                padding: '8px 20px',
                display: 'flex',
                alignItems: 'center',
                borderLeft: 'none',
              }}
            >
              + Nueva cata
            </Link>
          </div>
        </div>
      </header>

      {catas.length === 0 ? (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '160px 0',
          gap: '16px',
        }}>
          <p style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '2rem',
            color: 'rgba(44,30,20,0.2)',
            fontStyle: 'italic',
          }}>
            El diario está vacío
          </p>
          <Link
            href="/admin/catas/nuevo"
            style={{
              fontFamily: 'var(--font-code)',
              fontSize: '10px',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: '#9B7840',
              textDecoration: 'none',
            }}
          >
            Registrar primera cata →
          </Link>
        </div>
      ) : (
        <DiarioFilters catas={catas} />
      )}
    </div>
  );
}
