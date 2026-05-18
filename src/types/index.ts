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
  logoMarcaUrl?: string;
  notasCata?: string;
  stock: number;
  fortaleza?: string;
  costoMazo?: number;
  purosPorMazo?: number;
  transporteMazo?: number;
  almacenamientoMazo?: number;
  modoIngreso?: 'pieza' | 'mazo';
  createdAt: string;
  updatedAt: string;
}

export interface Venta {
  fecha: string;
  producto: string;
  cantidad: number;
  precioUnitario: number;
  totalVenta: number;
  gananciaEstimada: number;
  clienteNombre?: string;
  clienteContacto?: string;
}

export interface VentaHistorial {
  fecha: string;
  producto: string;
  cantidad: number;
  totalVenta: number;
}

export interface Cliente {
  nombre: string;
  contacto: string;
  totalPuros: number;
  totalGastado: number;
  ventas: VentaHistorial[];
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
  fortaleza?: string;
}

export interface PuroPublico {
  id: string;
  nombre: string;
  marca: string;
  vitola: string;
  precioVenta: number;
  fotoUrl?: string;
  stock: number;
  ringGauge?: number;
  paisOrigen?: string;
  fortaleza?: string;
  largo?: number;
  tiempoAnejamiento?: number;
  notasCata?: string;
  logoMarcaUrl?: string;
}

export interface Cata {
  id: string;
  fecha: string;
  lugar: string;
  fotoUrl?: string;
  fotosAdicionales?: string[];
  notas: string;
  calificacion: number;
  marca: string;
  nombre: string;
  vitola: string;
  cepo: number;
  paisOrigen: string;
  capa: string;
  puroId?: string;
  usuarioId: string;
  createdAt: string;
  cuerpo?: number;
  dulzor?: number;
  especia?: number;
  tierra?: number;
  madera?: number;
  tiro?: number;
  quemado?: number;
  chocolate?: number;
  nuez?: number;
  cafe?: number;
  caramelo?: number;
  cuero?: number;
  etiquetasAroma?: string[];
  maridaje?: string;
}

export interface VentaConIndice extends Venta {
  rowIndex: number;
}

export interface DashboardKPIs {
  valorColeccionPersonal: number;
  gananciasProyectadas: number;
  gananciasReales: number;
  stockTotal: number;
  purosAcercandose1Año: Puro[];
  purosAcercandose2Anos: Puro[];
}
