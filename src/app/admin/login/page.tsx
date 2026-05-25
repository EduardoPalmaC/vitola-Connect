'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setError(data.error ?? 'Contraseña incorrecta');
        return;
      }

      router.push('/admin/dashboard');
    } catch {
      setError('Error de red. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className="min-h-screen w-full flex flex-col items-center justify-center px-6 py-16 relative text-[#1a1410]"
      style={{
        backgroundColor: '#EFE6D2',
        backgroundImage:
          "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(255,250,240,0.55) 0%, rgba(239,230,210,0) 70%), url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.1 0 0 0 0 0.08 0 0 0 0 0.05 0 0 0 0 0.05 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        fontFamily: '"EB Garamond", Georgia, serif',
      }}
    >
      {/* hairline mark superior */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 flex items-center gap-3 text-[#9a8d77]">
        <span className="h-px w-8 bg-[#cdbfa1]" />
        <span
          className="text-[10px] tracking-[0.42em] uppercase"
          style={{ fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}
        >
          Casa · Vitola
        </span>
        <span className="h-px w-8 bg-[#cdbfa1]" />
      </div>

      {/* composición central */}
      <section className="w-full max-w-[420px] flex flex-col items-center">
        {/* monograma */}
        <div className="relative mb-9 flex items-center justify-center">
          <div className="w-14 h-14 border border-[#cdbfa1] flex items-center justify-center relative">
            <span
              className="italic font-normal text-[40px] leading-none translate-y-[1px]"
              style={{ fontFamily: '"Cormorant Garamond", serif' }}
            >
              V
            </span>
            <span
              className="italic font-normal text-[40px] leading-none text-[#a8884a] translate-y-[1px]"
              style={{ fontFamily: '"Cormorant Garamond", serif' }}
            >
              .
            </span>
            <span className="absolute -top-px -left-px w-2 h-2 border-t border-l border-[#a8884a]" />
            <span className="absolute -top-px -right-px w-2 h-2 border-t border-r border-[#a8884a]" />
            <span className="absolute -bottom-px -left-px w-2 h-2 border-b border-l border-[#a8884a]" />
            <span className="absolute -bottom-px -right-px w-2 h-2 border-b border-r border-[#a8884a]" />
          </div>
        </div>

        {/* wordmark */}
        <h1
          className="font-light leading-none tracking-[-0.025em] text-[88px] mb-5"
          style={{ fontFamily: '"Cormorant Garamond", serif' }}
        >
          Vitola
          <span
            className="italic font-normal text-[#a8884a]"
            style={{ fontFamily: '"Cormorant Garamond", serif' }}
          >
            .
          </span>
        </h1>

        {/* subtítulo */}
        <div className="flex items-center gap-3 mb-14">
          <span className="h-px w-6 bg-[#a8884a]/70" />
          <span
            className="text-[10px] tracking-[0.42em] uppercase text-[#7a6f5e]"
            style={{ fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}
          >
            Acceso administrativo
          </span>
          <span className="h-px w-6 bg-[#a8884a]/70" />
        </div>

        {/* formulario */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-10">
          <label className="block">
            <span
              className="text-[10px] tracking-[0.32em] uppercase text-[#7a6f5e]"
              style={{ fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}
            >
              Contraseña
            </span>
            <div className="relative mt-3">
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="·  ·  ·  ·  ·  ·  ·  ·"
                autoFocus
                required
                className="w-full bg-transparent border-0 border-b border-[#cdbfa1] focus:border-[#1a1410] outline-none
                           text-[22px] tracking-[0.08em] text-[#1a1410]
                           placeholder:text-[#9a8d77] placeholder:tracking-[0.6em] placeholder:font-light
                           py-3 pr-10 transition-colors duration-300"
                style={{ fontFamily: '"EB Garamond", Georgia, serif' }}
              />
              <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[#9a8d77]">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="8" cy="15" r="4" />
                  <path d="M10.85 12.15L19 4" />
                  <path d="M18 5l3 3" />
                  <path d="M15 8l3 3" />
                </svg>
              </span>
            </div>
          </label>

          {error && (
            <p
              className="-mt-6 italic text-[14px] text-[#8a3a2a]"
              style={{ fontFamily: '"EB Garamond", Georgia, serif' }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full bg-[#1a1410] hover:bg-[#3a322a] disabled:opacity-60
                       transition-colors duration-300
                       py-[18px] text-[#EFE6D2] text-[11px] tracking-[0.42em] uppercase
                       flex items-center justify-center gap-4"
            style={{ fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}
          >
            <span className="h-px w-6 bg-[#a8884a]/60 group-hover:w-10 transition-all duration-300" />
            <span>{loading ? 'Verificando' : 'Entrar'}</span>
            <span className="h-px w-6 bg-[#a8884a]/60 group-hover:w-10 transition-all duration-300" />
          </button>
        </form>
      </section>

      {/* mark inferior */}
      <footer className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#9a8d77]">
        <span
          className="text-[9px] tracking-[0.42em] uppercase"
          style={{ fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}
        >
          Est · MMXXVI
        </span>
        <span
          className="italic text-[12px] text-[#7a6f5e]"
          style={{ fontFamily: '"EB Garamond", Georgia, serif' }}
        >
          Catálogo & Humidor
        </span>
      </footer>
    </main>
  );
}
