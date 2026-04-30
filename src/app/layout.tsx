import type { Metadata } from 'next';
import { DM_Serif_Display } from 'next/font/google';
import './globals.css';

const dmSerif = DM_Serif_Display({ weight: '400', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Vitola — Catálogo de Puros Premium',
  description: 'Catálogo visual de puros premium con filtros por marca, vitola, ring gauge, precio y añejamiento.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`h-full ${dmSerif.className}`}>
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
