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
  gananciasProyectadas: number;
  gananciasReales: number;
  stockTotal: number;
  purosAcercandose1Año: Puro[];
  purosAcercandose2Anos: Puro[];
}
