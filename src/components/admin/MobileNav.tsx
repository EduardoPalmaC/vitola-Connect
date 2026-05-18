import Link from 'next/link';

const LINKS = [
  { href: '/admin/dashboard', label: 'Dashboard' },
  { href: '/admin/inventario', label: 'Inventario' },
  { href: '/admin/ventas', label: 'Ventas' },
  { href: '/admin/clientes', label: 'Clientes' },
];

export default function MobileNav() {
  return (
    <nav
      className="sm:hidden fixed bottom-0 left-0 right-0 z-50 flex"
      style={{ background: '#F9F6F0', borderTop: '1px solid #E2D9C8' }}
    >
      {LINKS.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className="flex-1 flex items-center justify-center"
          style={{
            padding: '12px 4px',
            fontFamily: 'var(--font-code)',
            fontSize: '9px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#9A8572',
            textDecoration: 'none',
          }}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
