# Vitola — Gestor Integral de Inventario de Puros Premium

> Generado por The Architect el 2026-04-27
> Arquetipo: Internal Tool + Content Platform (Catálogo Visual)

---

## 1. Project Overview

### Vision

Vitola es una aplicación web de gestión integral para un inventario híbrido de puros premium, sincronizada con Google Sheets. Resuelve tres problemas fundamentales:

1. **Fricción logística y financiera:** Centraliza ventas, consumo personal, costos ocultos (transporte, almacenamiento) y márgenes en un solo sistema fácil de actualizar.
2. **Riesgo ambiental:** En el clima tropical de Mérida, Yucatán, el control termodinámico es vital. La app obliga el registro de humedad relativa y revisiones de mantenimiento para prevenir plagas y degradación.
3. **Experiencia de usuario:** Transforma una base de datos plana en una vitrina profesional de lujo que se puede mostrar directamente a los clientes, elevando la percepción de valor.

El usuario administra el inventario (gestión dual Colección Personal vs Negocio), calcula márgenes reales, monitorea humedad. Los clientes ven un catálogo visual elegante, presencial, donde pueden buscar por marca, vitola, ring gauge, precio y tiempo de añejamiento.

### Goals

- Gestionar 300+ puros escalables a 1,000-2,000 sin degradación de performance
- Dashboard admin con cálculos automáticos y alertas de hitos de añejamiento
- Catálogo visual de lujo con filtros dinámicos para venta asistida presencial
- Upload automático de imágenes (Cloudinary) sin fricción
- Sincronización confiable con Google Sheets (base de datos única)
- Hosting gratuito, rápido, un clic (Vercel)
- 100% construible por IA sin intervención manual

### Success Metrics

- Dashboard carga en < 2 segundos
- Catálogo filtrado retorna resultados en < 500ms
- Imágenes optimizadas, CDN global (Cloudinary)
- Gestión de 1,000+ puros sin problemas
- Admin puede subir un puro + foto en < 3 minutos

---

## 2. Tech Stack

| Layer | Tecnología | Por qué |
|-------|-----------|--------|
| Framework | Next.js 15 (App Router) | El más IA-friendly, soporta admin + public en una sola app, rutas API integradas, sin servidor separado |
| Language | TypeScript | Seguridad de tipos, mejor experiencia de construcción por IA |
| Styling | TailwindCSS v4 | Rápido, sin sobrecarga, control total del diseño luxury, IA-friendly |
| Components | Componentes custom (sin shadcn/ui completo) | Máxima simplicidad, personalización exacta del estilo de maderas oscuras |
| Database | Google Sheets API v4 | Usuario ya lo usa, gratuita, confiable, fácil de auditar, sincronización simple |
| Image Storage | Cloudinary (tier gratuito) | Upload automático sin fricción, CDN global, optimización automática, sin servidor de imágenes |
| Auth | Token/contraseña simple en `/admin` | Una sola persona, sin necesidad de Clerk o NextAuth, máxima simplicidad |
| Hosting | Vercel | Gratuito, un clic deploy, escalable, perfecto para Next.js |
| Package Manager | pnpm | Rápido, confiable, IA-friendly |

---

## 3. Directory Structure

```
vitola/
├── src/
│   ├── app/
│   │   ├── layout.tsx                    # Root layout (navbar global)
│   │   ├── page.tsx                      # Redirección a /catalogo
│   │   ├── catalogo/
│   │   │   ├── layout.tsx                # Layout del catálogo
│   │   │   ├── page.tsx                  # Catálogo público (filtros, grid, búsqueda)
│   │   │   └── [id]/
│   │   │       └── page.tsx              # Detalle del puro (público)
│   │   ├── admin/
│   │   │   ├── layout.tsx                # Layout admin (sidebar)
│   │   │   ├── page.tsx                  # Redirección a dashboard
│   │   │   ├── login/
│   │   │   │   └── page.tsx              # Login simple
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx              # Overview KPIs, alertas, gráficos
│   │   │   ├── inventario/
│   │   │   │   ├── page.tsx              # Tabla CRUD completa
│   │   │   │   ├── [id]/
│   │   │   │   │   └── page.tsx          # Detalle + edición + upload de foto
│   │   │   │   └── nuevo/
│   │   │   │       └── page.tsx          # Crear puro nuevo
│   │   │   └── settings/
│   │   │       └── page.tsx              # Configuración (contraseña, etc)
│   │   └── api/
│   │       ├── auth/
│   │       │   └── login/route.ts        # Verificar contraseña
│   │       ├── puros/
│   │       │   ├── route.ts              # GET (list), POST (create)
│   │       │   └── [id]/route.ts         # GET, PATCH, DELETE
│   │       └── sheets/
│   │           └── sync/route.ts         # Sincronizar con Google Sheets
│   ├── components/
│   │   ├── catalogo/
│   │   │   ├── FilterBar.tsx             # Filtros (marca, vitola, ring gauge, precio, añejamiento)
│   │   │   ├── SearchBar.tsx             # Búsqueda por nombre
│   │   │   ├── CigarCard.tsx             # Tarjeta individual del catálogo
│   │   │   └── CigarGrid.tsx             # Grid responsive
│   │   ├── admin/
│   │   │   ├── Sidebar.tsx               # Navegación admin
│   │   │   ├── Header.tsx                # Header admin
│   │   │   ├── CigarTable.tsx            # Tabla CRUD con TanStack Table
│   │   │   ├── CigarForm.tsx             # Formulario crear/editar + imagen
│   │   │   ├── ImageUploader.tsx         # Widget Cloudinary
│   │   │   ├── KPICard.tsx               # Tarjeta de métrica
│   │   │   ├── AlertsSection.tsx         # Alertas de hitos de añejamiento
│   │   │   └── Charts.tsx                # Gráficos financieros (Recharts)
│   │   ├── shared/
│   │   │   ├── Navbar.tsx                # Navbar global
│   │   │   ├── Footer.tsx                # Footer
│   │   │   └── Loading.tsx               # Loading spinner
│   │   └── ui/
│   │       ├── Button.tsx                # Botón custom
│   │       ├── Input.tsx                 # Input custom
│   │       ├── Select.tsx                # Select custom
│   │       ├── Modal.tsx                 # Modal/Dialog
│   │       ├── Badge.tsx                 # Badge para etiquetas
│   │       └── Tooltip.tsx               # Tooltip
│   ├── lib/
│   │   ├── sheets.ts                     # Google Sheets API client
│   │   ├── cloudinary.ts                 # Cloudinary API helper
│   │   ├── auth.ts                       # Auth utilities (validar token)
│   │   ├── calculations.ts               # Cálculos financieros (márgenes, ganancias)
│   │   ├── alerts.ts                     # Lógica de alertas (hitos de añejamiento)
│   │   ├── filters.ts                    # Lógica de filtrado (catálogo)
│   │   └── utils.ts                      # Helpers generales (formatos, dates)
│   ├── types/
│   │   └── index.ts                      # Interfaces: Puro, Venta, Usuario, etc
│   ├── middleware.ts                     # Middleware de autenticación para /admin
│   └── styles/
│       └── globals.css                   # TailwindCSS + custom CSS
├── public/
│   ├── logo.svg                          # Logo de Vitola
│   └── images/
│       └── placeholder.png               # Placeholder para puros sin foto
├── .env.local                            # Variables de entorno (local)
├── .env.example                          # Template de .env
├── next.config.ts                        # Next.js config (image optimization, etc)
├── tailwind.config.ts                    # TailwindCSS config
├── tsconfig.json                         # TypeScript config
├── package.json                          # Dependencies
├── pnpm-lock.yaml                        # Lock file
└── CLAUDE.md                             # Este archivo guiará la construcción

```

---

## 4. Data Model

### Entities

**Puro (Cigar)**

| Campo | Tipo | Notas |
|-------|------|-------|
| id | string (UUID) | Identificador único |
| nombre | string | Nombre comercial del puro |
| marca | string | Marca del fabricante |
| vitola | string | Formato del puro (ej: "Corona", "Robusto") |
| ringGauge | number | Calibre en 64avos de pulgada (ej: 50) |
| largo | number | Largo en mm |
| paisOrigen | string | País de origen del tabaco |
| precioBruto | number | Precio de compra en USD |
| costoTransporte | number | Costo de transporte distribuido |
| costoAlmacenamiento | number | Costo mensual de almacenamiento distribuido |
| precioVenta | number | Precio de venta final |
| estado | enum: "coleccion_personal" \| "negocio" | Categoría del inventario |
| fechaLlegada | date | Cuándo llegó el puro |
| tiempoAnejamiento | number | Días desde llegada (calculado automáticamente) |
| humedad | number | % HR actual en el tuppedor |
| fechaRevisionHumedad | date | Última revisión de mantenimiento |
| fotoUrl | string \| null | URL de imagen en Cloudinary |
| notasCata | string \| null | Notas de cata personal |
| createdAt | datetime | |
| updatedAt | datetime | |

**Venta (Sale)**

| Campo | Tipo | Notas |
|-------|------|-------|
| id | string (UUID) | Identificador único |
| puroId | string (FK) | Referencia a Puro |
| cantidad | number | Cantidad vendida |
| fechaVenta | date | Cuándo se vendió |
| precioVentaReal | number | Precio al que se vendió |
| ganancia | number | Precioventa - costos (calculado) |
| notas | string \| null | Notas de la transacción |
| createdAt | datetime | |

**Configuración (Settings)**

| Campo | Tipo | Notas |
|-------|------|-------|
| clave | string (PK) | Nombre de la config |
| valor | string \| number | Valor |
| descripcion | string | Qué es esta config |

### Relationships

- **Puro → Venta**: 1 puro puede tener N ventas (one-to-many)
- **Settings** es una tabla simple de clave-valor

### Database Schema (Google Sheets)

La base de datos vive en Google Sheets con 3 hojas:

**Hoja 1: Inventario**
```
id | nombre | marca | vitola | ringGauge | largo | paisOrigen | precioBruto | costoTransporte | costoAlmacenamiento | precioVenta | estado | fechaLlegada | humedad | fechaRevisionHumedad | fotoUrl | notasCata | createdAt | updatedAt
```

**Hoja 2: Ventas**
```
id | puroId | cantidad | fechaVenta | precioVentaReal | ganancia | notas | createdAt
```

**Hoja 3: Config**
```
clave | valor | descripcion
```

---

## 5. API Design

### Routes Overview

| Método | Path | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/api/auth/login` | Validar contraseña | No |
| GET | `/api/puros` | Listar todos los puros | No (público para catálogo) |
| GET | `/api/puros?filtros=marca:Davidoff&estado=negocio` | Puros filtrados | No |
| GET | `/api/puros/[id]` | Detalle de un puro | No |
| POST | `/api/puros` | Crear puro nuevo | Sí (admin) |
| PATCH | `/api/puros/[id]` | Actualizar puro | Sí (admin) |
| DELETE | `/api/puros/[id]` | Eliminar puro | Sí (admin) |
| POST | `/api/puros/[id]/venta` | Registrar venta | Sí (admin) |
| GET | `/api/sheets/sync` | Sincronizar con Google Sheets | Sí (admin) |

### Key Endpoints Detail

**POST `/api/auth/login`**
```json
// Request
{
  "password": "mi_contrasena_super_segura"
}

// Response
{
  "success": true,
  "token": "jwt_token_valido_por_24h"
}
```
Validación: contraseña contra variable de entorno `ADMIN_PASSWORD`. Retorna JWT que se guarda en cookie httpOnly.

**GET `/api/puros?marca=Davidoff&estado=negocio&precioMin=20&precioMax=100&tiempoAnejamientoMin=365`**
```json
// Response
{
  "puros": [
    {
      "id": "uuid-1",
      "nombre": "Davidoff Robusto",
      "marca": "Davidoff",
      "vitola": "Robusto",
      "ringGauge": 50,
      "precioVenta": 45,
      "fotoUrl": "https://res.cloudinary.com/...",
      "tiempoAnejamiento": 450,
      ...
    }
  ],
  "total": 12,
  "page": 1
}
```
Filtros soportados: `marca`, `vitola`, `ringGauge`, `precioMin`, `precioMax`, `paisOrigen`, `tiempoAnejamientoMin`, `estado`. Paginación: 20 por página.

**PATCH `/api/puros/[id]`**
```json
// Request (actualización parcial)
{
  "humedad": 65,
  "fechaRevisionHumedad": "2026-04-27",
  "notasCata": "Aroma a cedro, toque especiado"
}

// Response
{
  "success": true,
  "puro": { ...full puro object... }
}
```
Valida que el usuario esté autenticado (JWT en cookie). Actualiza solo los campos enviados.

**POST `/api/puros/[id]/venta`**
```json
// Request
{
  "cantidad": 1,
  "fechaVenta": "2026-04-27",
  "precioVentaReal": 50
}

// Response
{
  "success": true,
  "venta": {
    "id": "uuid-venta",
    "puroId": "uuid-puro",
    "ganancia": 12.50,
    "precioVentaReal": 50,
    ...
  },
  "puroActualizado": { ...updated puro object... }
}
```
Crea un registro en la hoja "Ventas" y actualiza el estado del puro a "vendido" si `cantidad` agota stock.

---

## 6. Frontend Architecture

### Pages / Routes

| Ruta | Página | Descripción |
|------|--------|-------------|
| `/` | Redirección | Redirige a `/catalogo` |
| `/catalogo` | CatalogPage | Catálogo público con filtros, búsqueda, grid |
| `/catalogo/[id]` | CigarDetailPage | Detalle de un puro (público) |
| `/admin/login` | LoginPage | Login con contraseña |
| `/admin/dashboard` | DashboardPage | Overview KPIs, gráficos, alertas |
| `/admin/inventario` | InventoryPage | Tabla CRUD, gestión completa |
| `/admin/inventario/nuevo` | CreateCigarPage | Formulario crear + foto |
| `/admin/inventario/[id]` | EditCigarPage | Editar puro + foto + registrar venta |
| `/admin/settings` | SettingsPage | Configuración |

### Component Hierarchy

**CatalogPage (Pública)**
```
CatalogPage
├── SearchBar (búsqueda por nombre)
├── FilterBar (marca, vitola, ring gauge, precio, añejamiento)
└── CigarGrid
    └── [CigarCard] (20 por página, con paginación)
        ├── CigarImage
        ├── CigarInfo (nombre, marca, vitola, ring gauge, precio)
        └── ViewDetailsButton → redirige a /catalogo/[id]

CigarDetailPage
├── CigarImage (grande)
├── CigarInfo (todos los detalles)
├── PriceSection
└── BackButton
```

**AdminDashboard**
```
AdminLayout
├── Sidebar (navegación)
├── Header
└── DashboardPage
    ├── KPISection
    │   ├── KPICard (Valor colección personal)
    │   ├── KPICard (Ganancias proyectadas)
    │   ├── KPICard (Ganancias reales)
    │   └── KPICard (Stock total)
    ├── AlertsSection
    │   └── [Alert] (puros con 1 año, 2 años de añejamiento)
    └── ChartsSection
        ├── Chart (Ganancias por mes)
        └── Chart (Distribución marca vs estado)
```

**InventoryPage (Tabla)**
```
AdminLayout
├── Sidebar
├── Header
└── InventoryPage
    ├── ToolBar (Crear nuevo, filtros, search)
    ├── CigarTable (TanStack Table)
    │   └── [Row]
    │       ├── Checkbox (seleccionar)
    │       ├── Nombre
    │       ├── Marca
    │       ├── Vitola
    │       ├── Precio
    │       ├── Estado
    │       └── Actions (ver, editar, eliminar)
    └── Pagination
```

### State Management

- **Server Components por defecto:** Las páginas de catálogo y dashboard son Server Components que fetcean datos directamente de Google Sheets API.
- **Client Components mínimos:** Solo filtros, búsqueda, y interacciones dinámicas usan "use client".
- **Sin estado global:** Zustand no es necesario. El estado vive en URL params (filtros) o en cookies (JWT).
- **Caché:** Next.js cacha automáticamente respuestas de `/api/puros` por 60 segundos. Admin puede forzar revalidación.

---

## 7. Design System

### Colors

| Rol | Hex | Uso |
|-----|-----|-----|
| Primary | `#2C1810` | Botones, links, acentos principales (madera oscura) |
| Secondary | `#8B6F47` | Links secundarios, botones alternativos (latón/oro oscuro) |
| Background | `#0F0F0F` | Fondo de página |
| Surface | `#1A1A1A` | Cards, panels, backgrounds elevados |
| SurfaceAlt | `#252525` | Backgrounds alternativos (tablas, inputs) |
| Text | `#F0E6D2` | Texto principal (crema/beige claro) |
| TextMuted | `#9B8B7E` | Texto secundario (gris cálido) |
| Border | `#3A3A3A` | Bordes, divisores |
| Success | `#10B981` | Confirmaciones, estado positivo |
| Destructive | `#EF4444` | Errores, delete, avisos |
| Warning | `#F59E0B` | Alertas de hitos de añejamiento |

### Typography

| Rol | Font | Tamaño | Peso |
|-----|------|--------|------|
| Headings (H1-H4) | Syne (serif, bold) | 32px, 24px, 20px, 18px | 700 |
| Body | Inter | 16px | 400 |
| Label | Inter | 14px | 500 |
| Small | Inter | 12px | 400 |
| Code | Fira Code | 13px | 400 |

**Importar en globals.css:**
```css
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=Fira+Code:wght@400;500;700&display=swap');
```

### Spacing & Layout

- **Spacing base:** 4px (4, 8, 12, 16, 24, 32, 48, 64, 80)
- **Border radius:** 6px (default), 12px (cards), 50% (avatars/badges)
- **Shadows:** 
  - Small: `0 1px 2px rgba(0,0,0,0.3)`
  - Medium: `0 4px 12px rgba(0,0,0,0.4)`
  - Large: `0 12px 32px rgba(0,0,0,0.5)`
- **Max content width:** 1280px
- **Breakpoints:** sm: 640px, md: 768px, lg: 1024px, xl: 1280px

### Component Style

- **Aesthetic:** Minimalismo de lujo, maderas oscuras, tipografía serif elegante para headings, mucho whitespace
- **Borders:** 1px solid, sin rounded corners excesivos
- **Shadows:** Sutiles, para elevar elementos sin agresividad
- **Hover states:** Cambio de color sutil (color primary +20% lighter)
- **Transitions:** 200ms ease-in-out para todos los elementos interactivos
- **Iconografía:** Feather Icons (simple, limpio)

---

## 8. Authentication & Authorization

### Auth Flow

1. Usuario intenta acceder a `/admin` → middleware intercepta
2. Si no hay JWT valido en cookie → redirige a `/admin/login`
3. En login: usuario ingresa contraseña
4. Si es correcta → POST `/api/auth/login` → retorna JWT
5. JWT se guarda en cookie httpOnly, secure, sameSite=strict
6. Cookie persiste 24 horas
7. Middleware valida JWT en cada request a `/admin/*`
8. Si JWT expira o es inválido → redirige a `/admin/login`

### Protected Routes

- `/admin/*` — Requiere JWT válido
- `/catalogo/*` — Público (sin auth)
- `/api/puros` GET — Público
- `/api/puros` POST/PATCH/DELETE — Requiere JWT
- `/api/puros/[id]/venta` — Requiere JWT

### Roles & Permissions

No hay múltiples roles. Solo:
- **Admin:** puede crear, editar, eliminar, ver dashboard
- **Público:** puede ver catálogo y detalles

### Session Management

- JWT almacenado en cookie httpOnly (no accessible desde JS)
- Validación en middleware.ts antes de cada request a `/admin`
- Refresco automático: si JWT expira, redirige a login
- No hay refresh tokens (simplificar)

---

## 9. Build Order

Este es el orden exacto para construir la aplicación de cero a producción. Cada paso debe completarse antes del siguiente.

### Step 1: Project Scaffolding

Crea un nuevo proyecto Next.js con TypeScript, TailwindCSS, configuración de path alias.

```bash
pnpm create next-app@latest vitola --typescript --tailwind --app
cd vitola
# Elige: ESLint=Yes, src/=Yes, import alias=Yes (@/), No para otros addons
```

Configura `tsconfig.json`:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },
    "strict": true,
    "noUncheckedIndexedAccess": true
  }
}
```

Configura `next.config.ts`:
```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'res.cloudinary.com' },
    ],
  },
};

export default nextConfig;
```

Instala dependencias:
```bash
pnpm add @tanstack/react-table recharts lucide-react clsx
pnpm add -D @types/node
```

**Deliverable:** Proyecto corriendo en `http://localhost:3000` con estructura limpia.

---

### Step 2: Setup TailwindCSS Custom Theme

Actualiza `tailwind.config.ts` con los colores de Vitola:

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2C1810',
        'primary-light': '#3D2417',
        secondary: '#8B6F47',
        background: '#0F0F0F',
        surface: '#1A1A1A',
        'surface-alt': '#252525',
        text: '#F0E6D2',
        'text-muted': '#9B8B7E',
        border: '#3A3A3A',
      },
      fontFamily: {
        heading: ['Syne', 'serif'],
        body: ['Inter', 'sans-serif'],
        code: ['Fira Code', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '6px',
        card: '12px',
      },
      boxShadow: {
        sm: '0 1px 2px rgba(0,0,0,0.3)',
        md: '0 4px 12px rgba(0,0,0,0.4)',
        lg: '0 12px 32px rgba(0,0,0,0.5)',
      },
    },
  },
  plugins: [],
};

export default config;
```

Actualiza `src/styles/globals.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=Fira+Code:wght@400;500;700&display=swap');

* {
  @apply m-0 p-0 box-border;
}

html {
  @apply bg-background text-text;
}

body {
  font-feature-settings: 'kern' 1;
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3, h4, h5, h6 {
  @apply font-heading font-bold;
}

h1 { @apply text-4xl; }
h2 { @apply text-3xl; }
h3 { @apply text-2xl; }
h4 { @apply text-xl; }
```

**Deliverable:** Proyecto con colores y tipografía aplicados.

---

### Step 3: Create TypeScript Types

Crea `src/types/index.ts`:

```typescript
export interface Puro {
  id: string;
  nombre: string;
  marca: string;
  vitola: string;
  ringGauge: number;
  largo: number;
  paisOrigen: string;
  precioBruto: number;
  costoTransporte: number;
  costoAlmacenamiento: number;
  precioVenta: number;
  estado: 'coleccion_personal' | 'negocio';
  fechaLlegada: string;
  tiempoAnejamiento: number;
  humedad: number;
  fechaRevisionHumedad: string;
  fotoUrl?: string;
  notasCata?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Venta {
  id: string;
  puroId: string;
  cantidad: number;
  fechaVenta: string;
  precioVentaReal: number;
  ganancia: number;
  notas?: string;
  createdAt: string;
}

export interface FilterParams {
  marca?: string;
  vitola?: string;
  ringGauge?: number;
  precioMin?: number;
  precioMax?: number;
  paisOrigen?: string;
  tiempoAnejamientoMin?: number;
  estado?: 'coleccion_personal' | 'negocio';
  search?: string;
  page?: number;
}

export interface DashboardKPIs {
  valorColeccionPersonal: number;
  gananciasproyectadas: number;
  gananciasReales: number;
  stockTotal: number;
  purosAlejandose1Año: Puro[];
  purosAlejandose2Años: Puro[];
}
```

**Deliverable:** Types definidos y compilables sin errores.

---

### Step 4: Setup Google Sheets API Client

Crea `src/lib/sheets.ts`:

```typescript
import { google } from 'googleapis';
import { Puro, Venta } from '@/types';

const auth = new google.auth.GoogleAuth({
  credentials: {
    type: 'service_account',
    project_id: process.env.GOOGLE_PROJECT_ID,
    private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    client_id: process.env.GOOGLE_CLIENT_ID,
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });
const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_ID!;

export async function getPuros(): Promise<Puro[]> {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Inventario!A2:S',
  });

  const rows = response.data.values || [];
  return rows.map((row) => ({
    id: row[0],
    nombre: row[1],
    marca: row[2],
    vitola: row[3],
    ringGauge: parseInt(row[4]),
    largo: parseFloat(row[5]),
    paisOrigen: row[6],
    precioBruto: parseFloat(row[7]),
    costoTransporte: parseFloat(row[8]),
    costoAlmacenamiento: parseFloat(row[9]),
    precioVenta: parseFloat(row[10]),
    estado: row[11],
    fechaLlegada: row[12],
    tiempoAnejamiento: row[13],
    humedad: parseFloat(row[14]),
    fechaRevisionHumedad: row[15],
    fotoUrl: row[16] || undefined,
    notasCata: row[17] || undefined,
    createdAt: row[18],
    updatedAt: row[19],
  }));
}

export async function createPuro(puro: Omit<Puro, 'id' | 'createdAt' | 'updatedAt'>): Promise<Puro> {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const row = [
    id,
    puro.nombre,
    puro.marca,
    puro.vitola,
    puro.ringGauge,
    puro.largo,
    puro.paisOrigen,
    puro.precioBruto,
    puro.costoTransporte,
    puro.costoAlmacenamiento,
    puro.precioVenta,
    puro.estado,
    puro.fechaLlegada,
    puro.tiempoAnejamiento,
    puro.humedad,
    puro.fechaRevisionHumedad,
    puro.fotoUrl || '',
    puro.notasCata || '',
    now,
    now,
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Inventario!A:S',
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [row],
    },
  });

  return { ...puro, id, createdAt: now, updatedAt: now };
}

export async function updatePuro(id: string, updates: Partial<Puro>): Promise<void> {
  const puros = await getPuros();
  const index = puros.findIndex((p) => p.id === id);
  if (index === -1) throw new Error('Puro no encontrado');

  const updated = { ...puros[index], ...updates, updatedAt: new Date().toISOString() };
  const row = [
    updated.id,
    updated.nombre,
    updated.marca,
    updated.vitola,
    updated.ringGauge,
    updated.largo,
    updated.paisOrigen,
    updated.precioBruto,
    updated.costoTransporte,
    updated.costoAlmacenamiento,
    updated.precioVenta,
    updated.estado,
    updated.fechaLlegada,
    updated.tiempoAnejamiento,
    updated.humedad,
    updated.fechaRevisionHumedad,
    updated.fotoUrl || '',
    updated.notasCata || '',
    updated.createdAt,
    updated.updatedAt,
  ];

  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `Inventario!A${index + 2}:S${index + 2}`,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [row],
    },
  });
}

export async function deletePuro(id: string): Promise<void> {
  const puros = await getPuros();
  const index = puros.findIndex((p) => p.id === id);
  if (index === -1) throw new Error('Puro no encontrado');

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    requestBody: {
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId: 0,
              dimension: 'ROWS',
              startIndex: index + 1,
              endIndex: index + 2,
            },
          },
        },
      ],
    },
  });
}

export async function getVentas(): Promise<Venta[]> {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Ventas!A2:G',
  });

  const rows = response.data.values || [];
  return rows.map((row) => ({
    id: row[0],
    puroId: row[1],
    cantidad: parseInt(row[2]),
    fechaVenta: row[3],
    precioVentaReal: parseFloat(row[4]),
    ganancia: parseFloat(row[5]),
    notas: row[6] || undefined,
    createdAt: row[7],
  }));
}
```

**Deliverable:** Google Sheets API conectado y funcional.

---

### Step 5: Setup Cloudinary Image Upload

Crea `src/lib/cloudinary.ts`:

```typescript
export function getCloudinarySignature(timestamp: number): string {
  const secret = process.env.CLOUDINARY_SECRET!;
  const toSign = `timestamp=${timestamp}${secret}`;
  const crypto = require('crypto');
  return crypto.createHash('sha1').update(toSign).digest('hex');
}

export const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;
export const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
```

**Deliverable:** Cloudinary ready to use.

---

### Step 6: Create Authentication Utilities

Crea `src/lib/auth.ts`:

```typescript
import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'dev-secret-key');

export async function generateToken(): Promise<string> {
  return new SignJWT({ admin: true })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(secret);
}

export async function verifyToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get('auth-token')?.value || null;
}

export async function setAuthToken(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 86400, // 24 horas
  });
}

export async function clearAuthToken(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('auth-token');
}
```

**Deliverable:** Auth utilities listas.

---

### Step 7: Create Calculations & Alerts Utilities

Crea `src/lib/calculations.ts`:

```typescript
import { Puro, DashboardKPIs } from '@/types';

export function calcularMargenGanancia(puro: Puro): number {
  const costoTotal = puro.precioBruto + puro.costoTransporte + puro.costoAlmacenamiento;
  return puro.precioVenta - costoTotal;
}

export function calcularDiasAnejamiento(fechaLlegada: string): number {
  const llegada = new Date(fechaLlegada);
  const hoy = new Date();
  return Math.floor((hoy.getTime() - llegada.getTime()) / (1000 * 60 * 60 * 24));
}

export function generarKPIs(puros: Puro[], ventas: any[]): DashboardKPIs {
  const purosColeccion = puros.filter((p) => p.estado === 'coleccion_personal');
  const purosNegocio = puros.filter((p) => p.estado === 'negocio');

  const valorColeccionPersonal = purosColeccion.reduce((sum, p) => {
    const costoTotal = p.precioBruto + p.costoTransporte + p.costoAlmacenamiento;
    return sum + costoTotal;
  }, 0);

  const gananciasproyectadas = purosNegocio.reduce((sum, p) => sum + calcularMargenGanancia(p), 0);

  const gananciasReales = ventas.reduce((sum, v) => sum + v.ganancia, 0);

  const purosAlejandose1Año = puros.filter((p) => calcularDiasAnejamiento(p.fechaLlegada) >= 365);
  const purosAlejandose2Años = puros.filter((p) => calcularDiasAnejamiento(p.fechaLlegada) >= 730);

  return {
    valorColeccionPersonal,
    gananciasproyectadas,
    gananciasReales,
    stockTotal: puros.length,
    purosAlejandose1Año,
    purosAlejandose2Años,
  };
}
```

**Deliverable:** Cálculos listos.

---

### Step 8: Create Filter Utilities

Crea `src/lib/filters.ts`:

```typescript
import { Puro, FilterParams } from '@/types';

export function filtrarPuros(puros: Puro[], params: FilterParams): Puro[] {
  let resultado = [...puros];

  if (params.marca) {
    resultado = resultado.filter((p) => p.marca.toLowerCase().includes(params.marca!.toLowerCase()));
  }

  if (params.vitola) {
    resultado = resultado.filter((p) => p.vitola.toLowerCase().includes(params.vitola!.toLowerCase()));
  }

  if (params.ringGauge !== undefined) {
    resultado = resultado.filter((p) => p.ringGauge === params.ringGauge);
  }

  if (params.precioMin !== undefined) {
    resultado = resultado.filter((p) => p.precioVenta >= params.precioMin!);
  }

  if (params.precioMax !== undefined) {
    resultado = resultado.filter((p) => p.precioVenta <= params.precioMax!);
  }

  if (params.tiempoAnejamientoMin !== undefined) {
    resultado = resultado.filter((p) => {
      const dias = Math.floor((new Date().getTime() - new Date(p.fechaLlegada).getTime()) / (1000 * 60 * 60 * 24));
      return dias >= params.tiempoAnejamientoMin!;
    });
  }

  if (params.search) {
    const busqueda = params.search.toLowerCase();
    resultado = resultado.filter(
      (p) => p.nombre.toLowerCase().includes(busqueda) || p.marca.toLowerCase().includes(busqueda)
    );
  }

  if (params.estado) {
    resultado = resultado.filter((p) => p.estado === params.estado);
  }

  return resultado;
}

export function paginar(items: any[], page: number, pageSize: number = 20) {
  const start = (page - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    total: items.length,
    page,
    pageSize,
    pages: Math.ceil(items.length / pageSize),
  };
}
```

**Deliverable:** Filtros y paginación listos.

---

### Step 9: Create API Routes - Auth

Crea `src/app/api/auth/login/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { generateToken, setAuthToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const { password } = await request.json();

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 });
  }

  const token = await generateToken();
  const response = NextResponse.json({ success: true, token });
  await setAuthToken(token);
  return response;
}
```

**Deliverable:** Login API route funcional.

---

### Step 10: Create API Routes - Puros CRUD

Crea `src/app/api/puros/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getPuros, createPuro } from '@/lib/sheets';
import { filtrarPuros, paginar } from '@/lib/filters';
import { verifyToken, getAuthToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const puros = await getPuros();

  const params = {
    marca: searchParams.get('marca') || undefined,
    vitola: searchParams.get('vitola') || undefined,
    ringGauge: searchParams.get('ringGauge') ? parseInt(searchParams.get('ringGauge')!) : undefined,
    precioMin: searchParams.get('precioMin') ? parseFloat(searchParams.get('precioMin')!) : undefined,
    precioMax: searchParams.get('precioMax') ? parseFloat(searchParams.get('precioMax')!) : undefined,
    tiempoAnejamientoMin: searchParams.get('tiempoAnejamientoMin') ? parseInt(searchParams.get('tiempoAnejamientoMin')!) : undefined,
    search: searchParams.get('search') || undefined,
    page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
  };

  const filtrados = filtrarPuros(puros, params);
  const paginados = paginar(filtrados, params.page!);

  return NextResponse.json(paginados);
}

export async function POST(request: NextRequest) {
  const token = await getAuthToken();
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const puro = await request.json();
  const created = await createPuro(puro);

  return NextResponse.json({ success: true, puro: created });
}
```

**Deliverable:** GET y POST de puros funcionales.

---

### Step 11: Create API Routes - Puros Detail

Crea `src/app/api/puros/[id]/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getPuros, updatePuro, deletePuro } from '@/lib/sheets';
import { verifyToken, getAuthToken } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const puros = await getPuros();
  const puro = puros.find((p) => p.id === params.id);

  if (!puro) {
    return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
  }

  return NextResponse.json(puro);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = await getAuthToken();
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const updates = await request.json();
  await updatePuro(params.id, updates);

  const puros = await getPuros();
  const updated = puros.find((p) => p.id === params.id);

  return NextResponse.json({ success: true, puro: updated });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = await getAuthToken();
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  await deletePuro(params.id);
  return NextResponse.json({ success: true });
}
```

**Deliverable:** CRUD completo para puros.

---

### Step 12: Create Middleware for Protected Routes

Crea `src/middleware.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './lib/auth';

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (request.nextUrl.pathname === '/admin/login') {
      return NextResponse.next();
    }

    const token = request.cookies.get('auth-token')?.value;

    if (!token || !(await verifyToken(token))) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
```

**Deliverable:** Middleware de autenticación funcionando.

---

### Step 13: Create UI Components - Base

Crea componentes base en `src/components/ui/`:

`Button.tsx`:
```typescript
export function Button({
  children,
  variant = 'primary',
  ...props
}: any) {
  const variants = {
    primary: 'bg-primary hover:bg-primary-light text-text',
    secondary: 'bg-secondary hover:bg-secondary text-text',
    ghost: 'bg-transparent hover:bg-surface text-text border border-border',
    destructive: 'bg-destructive text-text hover:bg-destructive',
  };

  return (
    <button
      className={`px-4 py-2 rounded transition-colors ${variants[variant]}`}
      {...props}
    >
      {children}
    </button>
  );
}
```

`Input.tsx`:
```typescript
export function Input({ ...props }: any) {
  return (
    <input
      className="w-full px-3 py-2 bg-surface-alt border border-border rounded text-text placeholder-text-muted focus:outline-none focus:border-secondary"
      {...props}
    />
  );
}
```

`Select.tsx`:
```typescript
export function Select({ options, ...props }: any) {
  return (
    <select
      className="w-full px-3 py-2 bg-surface-alt border border-border rounded text-text focus:outline-none focus:border-secondary"
      {...props}
    >
      {options.map((opt: any) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
```

**Deliverable:** Componentes UI base creados.

---

### Step 14: Create Catalog Components

Crea `src/components/catalogo/SearchBar.tsx`:

```typescript
'use client';

export function SearchBar({ onSearch }: { onSearch: (term: string) => void }) {
  return (
    <input
      type="text"
      placeholder="Buscar por nombre..."
      className="w-full px-4 py-2 bg-surface border border-border rounded text-text placeholder-text-muted focus:outline-none focus:border-secondary"
      onChange={(e) => onSearch(e.target.value)}
    />
  );
}
```

Crea `src/components/catalogo/FilterBar.tsx`:

```typescript
'use client';

export function FilterBar({ onFilter }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 bg-surface rounded">
      <input placeholder="Marca" onChange={(e) => onFilter('marca', e.target.value)} className="px-3 py-2 bg-surface-alt border border-border rounded text-text" />
      <input placeholder="Vitola" onChange={(e) => onFilter('vitola', e.target.value)} className="px-3 py-2 bg-surface-alt border border-border rounded text-text" />
      <input type="number" placeholder="Ring Gauge" onChange={(e) => onFilter('ringGauge', e.target.value)} className="px-3 py-2 bg-surface-alt border border-border rounded text-text" />
      <input type="number" placeholder="Precio Min" onChange={(e) => onFilter('precioMin', e.target.value)} className="px-3 py-2 bg-surface-alt border border-border rounded text-text" />
      <input type="number" placeholder="Precio Max" onChange={(e) => onFilter('precioMax', e.target.value)} className="px-3 py-2 bg-surface-alt border border-border rounded text-text" />
    </div>
  );
}
```

Crea `src/components/catalogo/CigarCard.tsx`:

```typescript
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Puro } from '@/types';

export function CigarCard({ puro }: { puro: Puro }) {
  return (
    <Link href={`/catalogo/${puro.id}`}>
      <div className="group bg-surface rounded-card overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
        <div className="relative h-64 bg-surface-alt">
          {puro.fotoUrl ? (
            <Image
              src={puro.fotoUrl}
              alt={puro.nombre}
              fill
              className="object-cover group-hover:scale-105 transition-transform"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-text-muted">Sin foto</div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-heading text-lg text-text mb-1">{puro.nombre}</h3>
          <p className="text-text-muted text-sm mb-2">{puro.marca}</p>
          <div className="flex justify-between items-center">
            <span className="text-secondary font-bold">${puro.precioVenta}</span>
            <span className="text-text-muted text-xs">{puro.ringGauge} RG</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
```

Crea `src/components/catalogo/CigarGrid.tsx`:

```typescript
'use client';

import { CigarCard } from './CigarCard';
import { Puro } from '@/types';

export function CigarGrid({ puros }: { puros: Puro[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {puros.map((puro) => (
        <CigarCard key={puro.id} puro={puro} />
      ))}
    </div>
  );
}
```

**Deliverable:** Componentes del catálogo creados.

---

### Step 15: Create Catalog Pages

Crea `src/app/catalogo/page.tsx`:

```typescript
'use client';

import { useState, useEffect } from 'react';
import { SearchBar } from '@/components/catalogo/SearchBar';
import { FilterBar } from '@/components/catalogo/FilterBar';
import { CigarGrid } from '@/components/catalogo/CigarGrid';
import { Puro } from '@/types';

export default function CatalogPage() {
  const [puros, setPuros] = useState<Puro[]>([]);
  const [filtros, setFiltros] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPuros();
  }, [filtros]);

  async function fetchPuros() {
    setLoading(true);
    const params = new URLSearchParams();
    Object.entries(filtros).forEach(([key, value]) => {
      if (value) params.append(key, String(value));
    });

    const res = await fetch(`/api/puros?${params}`);
    const data = await res.json();
    setPuros(data.items || []);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="font-heading text-4xl text-text mb-8">Catálogo de Puros</h1>

        <SearchBar onSearch={(term) => setFiltros({ ...filtros, search: term })} />
        <FilterBar onFilter={(key: string, value: any) => setFiltros({ ...filtros, [key]: value })} />

        {loading ? (
          <div className="text-center py-12 text-text-muted">Cargando...</div>
        ) : puros.length > 0 ? (
          <CigarGrid puros={puros} />
        ) : (
          <div className="text-center py-12 text-text-muted">No se encontraron puros.</div>
        )}
      </div>
    </div>
  );
}
```

Crea `src/app/catalogo/[id]/page.tsx`:

```typescript
import Image from 'next/image';
import Link from 'next/link';
import { getPuros } from '@/lib/sheets';

export default async function CigarDetailPage({ params }: { params: { id: string } }) {
  const puros = await getPuros();
  const puro = puros.find((p) => p.id === params.id);

  if (!puro) {
    return <div className="text-center py-12 text-text-muted">No encontrado</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/catalogo" className="text-secondary hover:text-primary mb-4 inline-block">
          ← Volver al catálogo
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div className="relative h-96 bg-surface rounded-card overflow-hidden">
            {puro.fotoUrl ? (
              <Image src={puro.fotoUrl} alt={puro.nombre} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-text-muted">Sin foto</div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="font-heading text-4xl text-text mb-2">{puro.nombre}</h1>
              <p className="text-secondary text-lg">{puro.marca}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-text-muted text-sm">Vitola</p>
                <p className="text-text">{puro.vitola}</p>
              </div>
              <div>
                <p className="text-text-muted text-sm">Ring Gauge</p>
                <p className="text-text">{puro.ringGauge}</p>
              </div>
              <div>
                <p className="text-text-muted text-sm">Largo</p>
                <p className="text-text">{puro.largo}mm</p>
              </div>
              <div>
                <p className="text-text-muted text-sm">País de Origen</p>
                <p className="text-text">{puro.paisOrigen}</p>
              </div>
            </div>

            <div>
              <p className="text-text-muted text-sm">Precio</p>
              <p className="text-secondary text-3xl font-bold">${puro.precioVenta}</p>
            </div>

            {puro.notasCata && (
              <div>
                <p className="text-text-muted text-sm">Notas de Cata</p>
                <p className="text-text">{puro.notasCata}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
```

**Deliverable:** Catálogo público navegable y funcional.

---

### Step 16: Create Login Page

Crea `src/app/admin/login/page.tsx`:

```typescript
'use client';

import { useState } from 'next';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin() {
    setLoading(true);
    setError('');

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push('/admin/dashboard');
    } else {
      setError('Contraseña incorrecta');
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-surface rounded-card">
        <h1 className="font-heading text-2xl text-text text-center mb-8">Acceso Admin</h1>

        <div className="space-y-4">
          <Input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />

          {error && <p className="text-destructive text-sm">{error}</p>}

          <Button onClick={handleLogin} disabled={loading} className="w-full">
            {loading ? 'Ingresando...' : 'Ingresar'}
          </Button>
        </div>
      </div>
    </div>
  );
}
```

**Deliverable:** Página de login funcional.

---

### Step 17: Create Admin Dashboard

Crea `src/components/admin/KPICard.tsx`:

```typescript
export function KPICard({ label, value, icon }: any) {
  return (
    <div className="bg-surface rounded-card p-6">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-text-muted text-sm mb-2">{label}</p>
          <p className="font-heading text-3xl text-text">${value.toFixed(2)}</p>
        </div>
        <div className="text-secondary text-2xl">{icon}</div>
      </div>
    </div>
  );
}
```

Crea `src/app/admin/dashboard/page.tsx`:

```typescript
import { getPuros, getVentas } from '@/lib/sheets';
import { generarKPIs } from '@/lib/calculations';
import { KPICard } from '@/components/admin/KPICard';

export default async function DashboardPage() {
  const puros = await getPuros();
  const ventas = await getVentas();
  const kpis = generarKPIs(puros, ventas);

  return (
    <div className="p-8">
      <h1 className="font-heading text-3xl text-text mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <KPICard label="Valor Colección" value={kpis.valorColeccionPersonal} icon="💎" />
        <KPICard label="Ganancias Proyectadas" value={kpis.gananciasproyectadas} icon="📈" />
        <KPICard label="Ganancias Reales" value={kpis.gananciasReales} icon="✅" />
        <KPICard label="Stock Total" value={kpis.stockTotal} icon="📦" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface rounded-card p-6">
          <h2 className="font-heading text-xl text-text mb-4">Alertas: 1 Año de Añejamiento</h2>
          <div className="space-y-2">
            {kpis.purosAlejandose1Año.map((p) => (
              <div key={p.id} className="text-text-muted text-sm">
                {p.nombre} ({p.marca})
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface rounded-card p-6">
          <h2 className="font-heading text-xl text-text mb-4">Alertas: 2 Años de Añejamiento</h2>
          <div className="space-y-2">
            {kpis.purosAlejandose2Años.map((p) => (
              <div key={p.id} className="text-text-muted text-sm">
                {p.nombre} ({p.marca})
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
```

**Deliverable:** Dashboard con KPIs y alertas.

---

### Step 18: Create Inventory Table & CRUD

Crea `src/components/admin/CigarTable.tsx` con TanStack Table.

Crea `src/app/admin/inventario/page.tsx`:

```typescript
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Puro } from '@/types';
import { Button } from '@/components/ui/Button';

export default function InventoryPage() {
  const [puros, setPuros] = useState<Puro[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPuros();
  }, []);

  async function fetchPuros() {
    const res = await fetch('/api/puros');
    const data = await res.json();
    setPuros(data.items || []);
    setLoading(false);
  }

  async function deletePuro(id: string) {
    if (!confirm('¿Eliminar puro?')) return;

    await fetch(`/api/puros/${id}`, { method: 'DELETE' });
    fetchPuros();
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-heading text-3xl text-text">Inventario</h1>
        <Link href="/admin/inventario/nuevo">
          <Button>+ Nuevo Puro</Button>
        </Link>
      </div>

      {loading ? (
        <div className="text-text-muted">Cargando...</div>
      ) : (
        <div className="bg-surface rounded-card overflow-hidden">
          <table className="w-full text-text">
            <thead className="bg-surface-alt border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left">Nombre</th>
                <th className="px-6 py-4 text-left">Marca</th>
                <th className="px-6 py-4 text-left">Vitola</th>
                <th className="px-6 py-4 text-left">Precio</th>
                <th className="px-6 py-4 text-left">Estado</th>
                <th className="px-6 py-4 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {puros.map((puro) => (
                <tr key={puro.id} className="border-b border-border hover:bg-surface-alt">
                  <td className="px-6 py-4">{puro.nombre}</td>
                  <td className="px-6 py-4">{puro.marca}</td>
                  <td className="px-6 py-4">{puro.vitola}</td>
                  <td className="px-6 py-4">${puro.precioVenta}</td>
                  <td className="px-6 py-4">
                    <span className={puro.estado === 'coleccion_personal' ? 'text-secondary' : 'text-success'}>
                      {puro.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 space-x-2">
                    <Link href={`/admin/inventario/${puro.id}`}>
                      <Button variant="secondary">Editar</Button>
                    </Link>
                    <Button variant="destructive" onClick={() => deletePuro(puro.id)}>
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
```

**Deliverable:** Tabla CRUD completa.

---

### Step 19: Create Form for Image Upload

Crea `src/components/admin/CigarForm.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Puro } from '@/types';

interface CigarFormProps {
  initialPuro?: Puro;
  onSubmit: (puro: any) => void;
}

export function CigarForm({ initialPuro, onSubmit }: CigarFormProps) {
  const [data, setData] = useState(
    initialPuro || {
      nombre: '',
      marca: '',
      vitola: '',
      ringGauge: 50,
      largo: 0,
      paisOrigen: '',
      precioBruto: 0,
      costoTransporte: 0,
      costoAlmacenamiento: 0,
      precioVenta: 0,
      estado: 'negocio',
      fechaLlegada: new Date().toISOString().split('T')[0],
      humedad: 65,
      fechaRevisionHumedad: new Date().toISOString().split('T')[0],
      fotoUrl: '',
      notasCata: '',
    }
  );

  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [uploadingFoto, setUploadingFoto] = useState(false);

  async function handleFotoUpload(file: File) {
    setUploadingFoto(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
    formData.append('cloud_name', process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    const json = await res.json();
    setData({ ...data, fotoUrl: json.secure_url });
    setUploadingFoto(false);
  }

  function handleSubmit() {
    onSubmit(data);
  }

  return (
    <div className="bg-surface rounded-card p-8 space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Input
          placeholder="Nombre"
          value={data.nombre}
          onChange={(e) => setData({ ...data, nombre: e.target.value })}
        />
        <Input
          placeholder="Marca"
          value={data.marca}
          onChange={(e) => setData({ ...data, marca: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Input
          placeholder="Vitola"
          value={data.vitola}
          onChange={(e) => setData({ ...data, vitola: e.target.value })}
        />
        <Input
          type="number"
          placeholder="Ring Gauge"
          value={data.ringGauge}
          onChange={(e) => setData({ ...data, ringGauge: parseInt(e.target.value) })}
        />
        <Input
          type="number"
          placeholder="Largo (mm)"
          value={data.largo}
          onChange={(e) => setData({ ...data, largo: parseFloat(e.target.value) })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          placeholder="País de Origen"
          value={data.paisOrigen}
          onChange={(e) => setData({ ...data, paisOrigen: e.target.value })}
        />
        <select
          value={data.estado}
          onChange={(e) => setData({ ...data, estado: e.target.value })}
          className="px-3 py-2 bg-surface-alt border border-border rounded text-text"
        >
          <option value="negocio">Negocio</option>
          <option value="coleccion_personal">Colección Personal</option>
        </select>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Input
          type="number"
          placeholder="Precio Bruto"
          value={data.precioBruto}
          onChange={(e) => setData({ ...data, precioBruto: parseFloat(e.target.value) })}
        />
        <Input
          type="number"
          placeholder="Costo Transporte"
          value={data.costoTransporte}
          onChange={(e) => setData({ ...data, costoTransporte: parseFloat(e.target.value) })}
        />
        <Input
          type="number"
          placeholder="Costo Almacenamiento"
          value={data.costoAlmacenamiento}
          onChange={(e) => setData({ ...data, costoAlmacenamiento: parseFloat(e.target.value) })}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Input
          type="number"
          placeholder="Precio Venta"
          value={data.precioVenta}
          onChange={(e) => setData({ ...data, precioVenta: parseFloat(e.target.value) })}
        />
        <Input
          type="date"
          value={data.fechaLlegada}
          onChange={(e) => setData({ ...data, fechaLlegada: e.target.value })}
        />
        <Input
          type="number"
          placeholder="Humedad %"
          value={data.humedad}
          onChange={(e) => setData({ ...data, humedad: parseFloat(e.target.value) })}
        />
      </div>

      <div>
        <label className="block text-text-muted text-sm mb-2">Foto del Puro</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files && handleFotoUpload(e.target.files[0])}
          className="w-full px-3 py-2 bg-surface-alt border border-border rounded text-text"
        />
        {uploadingFoto && <p className="text-text-muted text-sm mt-2">Subiendo...</p>}
        {data.fotoUrl && <p className="text-success text-sm mt-2">Foto subida ✓</p>}
      </div>

      <Input
        placeholder="Notas de Cata"
        value={data.notasCata}
        onChange={(e) => setData({ ...data, notasCata: e.target.value })}
      />

      <Button onClick={handleSubmit} className="w-full">
        Guardar Puro
      </Button>
    </div>
  );
}
```

Crea `src/app/admin/inventario/nuevo/page.tsx`:

```typescript
'use client';

import { useRouter } from 'next/navigation';
import { CigarForm } from '@/components/admin/CigarForm';

export default function NewCigarPage() {
  const router = useRouter();

  async function handleSubmit(puro: any) {
    const res = await fetch('/api/puros', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(puro),
    });

    if (res.ok) {
      router.push('/admin/inventario');
    }
  }

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="font-heading text-3xl text-text mb-8">Crear Puro</h1>
      <CigarForm onSubmit={handleSubmit} />
    </div>
  );
}
```

**Deliverable:** Formulario con upload de imágenes funcional.

---

### Step 20: Setup Environment Variables & Deployment

Crea `.env.example`:

```
# Google Sheets
GOOGLE_PROJECT_ID=
GOOGLE_PRIVATE_KEY_ID=
GOOGLE_PRIVATE_KEY=
GOOGLE_CLIENT_EMAIL=
GOOGLE_CLIENT_ID=
GOOGLE_SHEETS_ID=

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=
CLOUDINARY_SECRET=

# Auth
ADMIN_PASSWORD=tu_contrasena_super_segura
JWT_SECRET=tu_jwt_secret_aleatorio

# Deployment
NODE_ENV=production
```

Instrucciones de setup:

1. Crear un Google Cloud Project y Service Account
2. Descargar JSON de credenciales
3. Crear Google Sheet con hojas: "Inventario", "Ventas", "Config"
4. Crear Cloudinary account (gratuito)
5. Copiar `.env.example` a `.env.local` y llenar valores
6. Hacer push a GitHub
7. Conectar repo a Vercel
8. Agregar environment variables en Vercel
9. Deploy automático

**Deliverable:** Proyecto listo para deployment.

---

### Step 21: Deploy to Vercel & Testing

```bash
# Commit and push to GitHub
git add .
git commit -m "Initial Vitola project setup"
git push origin main

# En Vercel:
# 1. Ir a https://vercel.com/import
# 2. Conectar repositorio
# 3. Agregar environment variables
# 4. Click "Deploy"
```

**Deliverable:** App en producción en `vitola.vercel.app` (o dominio personalizado).

---

## 10. Environment Setup

### Prerequisites

- Node.js 18+ (recomendado 20 LTS)
- pnpm 9+
- GitHub account (para deployment a Vercel)
- Google Cloud account (Google Sheets API)
- Cloudinary account (free tier)
- Vercel account (free)

### Environment Variables

| Variable | Descripción | Dónde obtener |
|----------|-------------|--------------|
| `GOOGLE_PROJECT_ID` | Google Cloud Project ID | Google Cloud Console |
| `GOOGLE_PRIVATE_KEY_ID` | Service account private key ID | Google Cloud Console |
| `GOOGLE_PRIVATE_KEY` | Service account private key (multiline) | Google Cloud Console |
| `GOOGLE_CLIENT_EMAIL` | Service account email | Google Cloud Console |
| `GOOGLE_CLIENT_ID` | Service account client ID | Google Cloud Console |
| `GOOGLE_SHEETS_ID` | ID del Google Sheet (de la URL) | URL de tu sheet |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Tu Cloudinary cloud name | Dashboard de Cloudinary |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Upload preset (create unsigned) | Cloudinary Settings |
| `CLOUDINARY_SECRET` | API secret de Cloudinary | Cloudinary Account |
| `ADMIN_PASSWORD` | Contraseña para `/admin` | Crea uno fuerte |
| `JWT_SECRET` | Secret para firmar JWTs | Crea uno aleatorio |

### Initial Setup Commands

```bash
# Clonar o crear proyecto
git clone <repo> vitola
cd vitola

# Instalar dependencias
pnpm install

# Crear .env.local con las variables
cp .env.example .env.local
# Editar .env.local con tus valores

# Desarrollo local
pnpm dev

# Acceder a
# - Catálogo: http://localhost:3000/catalogo
# - Admin: http://localhost:3000/admin/login (contraseña: tu ADMIN_PASSWORD)
```

---

## 11. Dependencies

### Core

| Package | Versión | Propósito |
|---------|---------|----------|
| next | 15+ | Framework |
| react | 19+ | UI |
| typescript | 5+ | Type safety |
| tailwindcss | 4+ | Styling |
| jose | latest | JWT signing/verification |
| googleapis | latest | Google Sheets API |
| clsx | latest | Class name utils |
| lucide-react | latest | Icons |

### Dev

| Package | Versión | Propósito |
|---------|---------|----------|
| @types/node | latest | Node types |
| @types/react | latest | React types |
| eslint | latest | Linting |
| prettier | latest | Formatting |

```bash
pnpm add next react typescript @types/react @types/node jose googleapis clsx lucide-react
pnpm add -D tailwindcss autoprefixer eslint prettier
```

---

## 12. Deployment Strategy

### Hosting

**Vercel** es la opción recomendada:
- Gratuito para proyectos pequeños
- Deployment automático desde GitHub
- Preview deploys
- Environment variables seguras
- CDN global
- Escalable a 2,000+ puros sin costo

### CI/CD

- Cada commit a `main` → deploy automático a producción
- Cada PR → preview deploy
- Edge Functions para optimización de imágenes (automático)

### Domain & DNS

Opción 1 (Recomendado): Subdominio de Vercel (`vitola.vercel.app`)
Opción 2: Custom domain → Vercel maneja SSL automáticamente

### Environments

- **Development**: `localhost:3000`, `.env.local`
- **Production**: Vercel, `.env` (secrets en dashboard de Vercel)

No hay staging (simplicidad).

---

## 13. Testing Strategy

### Unit Tests

Framework: Vitest (IA-friendly)

Archivos a testear:
- `src/lib/calculations.ts` — Cálculos de márgenes, KPIs
- `src/lib/filters.ts` — Lógica de filtrado

Ejemplo test:
```typescript
import { calcularMargenGanancia } from '@/lib/calculations';

it('calcula margen correctamente', () => {
  const puro = {
    precioVenta: 100,
    precioBruto: 50,
    costoTransporte: 10,
    costoAlmacenamiento: 5,
  };
  expect(calcularMargenGanancia(puro as any)).toBe(35);
});
```

### Integration Tests

API routes que testear:
- POST `/api/auth/login` — contraseña correcta/incorrecta
- GET `/api/puros` — con filtros varios
- POST `/api/puros` — crear puro
- PATCH `/api/puros/[id]` — actualizar
- DELETE `/api/puros/[id]` — eliminar

Usar Playwright o similar.

### E2E Tests

Flujos críticos (Playwright):
1. Login → Dashboard → ver KPIs
2. Ir a catálogo → filtrar → ver puro
3. Admin: crear puro → subir foto → aparece en catálogo
4. Admin: editar humedad y fecha revisión → refrescar → cambio visible

```bash
pnpm add -D @playwright/test
pnpm test:e2e
```

---

## 14. Skills to Use During Build

| Skill | Cuándo usar | Por qué |
|-------|-------------|--------|
| `/frontend-design` | Step 13-15 (catálogo, dashboard layout) | Producir interfaz visual de lujo, maderas oscuras |
| `/ui-ux-pro-max` | Step 7 (design system refinement) | Refinar paleta, tipografía, espaciado |
| `/prettier` | Steps 1-21 (throughout build) | Mantener código consistente, bien formateado |

---

## 15. CLAUDE.md for Target Project

```markdown
# Vitola — Gestor de Inventario de Puros Premium

Aplicación web de gestión integral para un inventario híbrido de puros, con catálogo visual de lujo y sincronización con Google Sheets.

## Commands

- `pnpm dev` — Start development server (http://localhost:3000)
- `pnpm build` — Production build
- `pnpm lint` — ESLint
- `pnpm test` — Unit + integration tests
- `pnpm test:e2e` — E2E tests (Playwright)

## Tech Stack

Next.js 15 (App Router) + TypeScript + TailwindCSS + Google Sheets API + Cloudinary + Vercel

## Architecture

### Directory Structure

- `src/app/` — App Router pages (catalogo/, admin/, api/)
- `src/components/` — UI components (ui/, catalogo/, admin/)
- `src/lib/` — Business logic (sheets.ts, cloudinary.ts, auth.ts, calculations.ts, filters.ts)
- `src/types/` — Shared TypeScript interfaces (Puro, Venta, FilterParams, etc)
- `public/` — Static assets

### Data Flow

1. **Server Components by default** — Pages fetch data from Google Sheets directly via `src/lib/sheets.ts`
2. **Client Components minimal** — Only SearchBar, FilterBar, forms use "use client"
3. **API Routes** — `/api/puros`, `/api/auth/login` handle CRUD and auth
4. **Caching** — Next.js caches `/api/puros` responses 60s, admin can revalidate
5. **Images** → Cloudinary (auto-optimized, CDN, no server overhead)
6. **Auth** → JWT in httpOnly cookie, middleware protects `/admin/*`

### Key Patterns

- **Server Components**: All pages, dashboards, lists
- **Client Components**: Forms, filters, interactive features
- **API routes with auth middleware**: All mutations require JWT
- **No external state library** — URL params for filters, cookies for auth, server-side caching
- **Image uploads**: File input → Cloudinary widget → URL → Google Sheets

## Code Organization Rules

1. **One component per file**, max 300 lines. Extract sub-components if longer.
2. **Path alias:** Always use `@/` for imports (e.g., `@/lib/sheets.ts`, `@/types/index.ts`).
3. **No barrel exports** — import directly from source: `import { Puro } from '@/types/index.ts'`
4. **Server Components by default**, add "use client" ONLY for interactivity (forms, filters, client-side state).
5. **Colocate related files** — page-specific components live next to their page folder.
6. **No commented-out code** — delete or fix, don't comment.

## Design System

### Colors (Maderas Oscuras + Lujo)

- Primary: `#2C1810` (madera oscura profunda) — buttons, links, accents
- Secondary: `#8B6F47` (latón/oro oscuro) — secondary actions, highlights
- Background: `#0F0F0F` (casi negro) — page background
- Surface: `#1A1A1A` (dark surface) — cards, panels
- Text: `#F0E6D2` (crema/beige claro) — main text
- Accent (Success): `#10B981` — confirmations
- Destructive: `#EF4444` — errors, deletes
- Warning: `#F59E0B` — alerts (hitos de añejamiento)

### Typography

- **Headings (H1-H4):** Syne (serif, bold) → 32px, 24px, 20px, 18px
- **Body:** Inter → 16px, weight 400
- **Labels:** Inter → 14px, weight 500
- **Small:** Inter → 12px, weight 400

Import in `globals.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap');
```

### Style

- Border radius: 6px (default), 12px (cards)
- Shadows: subtle (0 1px 2px rgba(0,0,0,0.3)) to medium (0 4px 12px)
- Spacing base: 4px → scale 4, 8, 12, 16, 24, 32, 48, 64
- Aesthetic: minimalism de lujo, whitespace amplios, tipografía serif elegante, transiciones 200ms
- No rounded corners excesivos, bordes sutiles, hover states con color shift sutil

## Environment Variables

| Variable | Descripción |
|----------|-------------|
| `GOOGLE_PROJECT_ID` | Google Cloud project |
| `GOOGLE_PRIVATE_KEY` | Service account key |
| `GOOGLE_CLIENT_EMAIL` | Service account email |
| `GOOGLE_SHEETS_ID` | Sheet ID from URL |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary account |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Unsigned upload preset |
| `CLOUDINARY_SECRET` | Cloudinary API secret |
| `ADMIN_PASSWORD` | Admin login password (strong!) |
| `JWT_SECRET` | Random string for JWT signing |

## Reglas No Negociables

1. **TypeScript strict mode** — all files `.ts` or `.tsx`, no `any` types
2. **Google Sheets is the single source of truth** — no local database, all data syncs through sheets
3. **No external state libraries** — use Next.js Server Components + URL params + cookies only
4. **All image uploads go through Cloudinary** — never store images locally
5. **Admin routes require JWT auth** — middleware in `src/middleware.ts` enforces this
6. **Catálogo is 100% public** — no auth required for `/catalogo/*`
7. **One commit = one meaningful feature** — no half-finished implementations
8. **No commented-out code** — delete or fix, always
9. **Responsive mobile-first** — all pages work on phones, tablets, desktop
10. **Performance first** — images optimized, API responses cached, no N+1 queries

---

End of CLAUDE.md
```

---

## 16. Reglas No Negociables

1. **TypeScript strict mode** — Nunca `any`, siempre tipos explícitos.
2. **Google Sheets es la única fuente de verdad** — Sin base de datos local, todo sincroniza a través de Google Sheets.
3. **Cloudinary es obligatorio para imágenes** — Nunca guardar imágenes en el servidor.
4. **JWT auth en `/admin`** — Middleware en `middleware.ts` lo valida.
5. **Catálogo completamente público** — Sin auth requerida en `/catalogo/*`.
6. **Un commit = una feature** — Sin implementaciones a medias.
7. **Sin código comentado** — Borrar o arreglar, siempre.
8. **Mobile-first responsive** — Todos los componentes funcionan en móvil, tablet, desktop.
9. **Performance primero** — Imágenes optimizadas, respuestas en caché, sin queries N+1.
10. **Ring Gauge es un filtro principal** — Junto a Marca, Vitola, Precio, Tiempo Añejamiento.

---

## Resumen Ejecutivo

**Vitola** es una solución full-stack para gestión de inventario premium de puros con:

✅ Dashboard admin: KPIs financieros, alertas de hitos, tabla CRUD completa
✅ Catálogo público: visual de lujo, filtrable (marca, vitola, ring gauge, precio, añejamiento)
✅ Imágenes: upload automático a Cloudinary, sin fricción
✅ Base de datos: Google Sheets (sincronización simple, auditable, gratuita)
✅ Hosting: Vercel (gratuito, un clic, escalable a 2,000+ puros)
✅ Auth: simple, token-based, solo una contraseña
✅ Diseño: maderas oscuras, tipografía serif elegante, minimalismo de lujo

**Stack:** Next.js 15 + TypeScript + TailwindCSS + Google Sheets API + Cloudinary + Vercel

**Tiempo estimado de build:** 2-3 días (con Sonnet 4.6 haciendo todo el coding)

**Próximo paso:** Usar este blueprint en una nueva sesión de Claude Code con Sonnet 4.6, seguir la "Build Order" paso a paso, y desplegar a Vercel.

---

Generated on 2026-04-27 by The Architect
```