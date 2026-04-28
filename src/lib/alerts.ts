import type { Puro } from '@/types';

export type AlertLevel = 'warning' | 'critical';

export interface HumedadAlert {
  puro: Puro;
  level: AlertLevel;
  diasSinRevision: number;
}

export interface AnejamientoAlert {
  puro: Puro;
  diasRestantes: number;
  objetivoAnos: 1 | 2;
}

const HUMEDAD_IDEAL_MIN = 65;
const HUMEDAD_IDEAL_MAX = 72;
const DIAS_REVISION_WARNING = 14;
const DIAS_REVISION_CRITICAL = 30;

export function getHumedadAlerts(puros: Puro[]): HumedadAlert[] {
  const hoy = new Date();
  const alerts: HumedadAlert[] = [];

  for (const puro of puros) {
    const fuera =
      puro.humedad < HUMEDAD_IDEAL_MIN || puro.humedad > HUMEDAD_IDEAL_MAX;
    const ultimaRevision = new Date(puro.fechaRevisionHumedad);
    const diasSinRevision = Math.floor(
      (hoy.getTime() - ultimaRevision.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (fuera || diasSinRevision >= DIAS_REVISION_CRITICAL) {
      alerts.push({ puro, level: 'critical', diasSinRevision });
    } else if (diasSinRevision >= DIAS_REVISION_WARNING) {
      alerts.push({ puro, level: 'warning', diasSinRevision });
    }
  }

  return alerts;
}

export function getAnejamientoAlerts(puros: Puro[]): AnejamientoAlert[] {
  const hoy = new Date();
  const alerts: AnejamientoAlert[] = [];

  for (const puro of puros) {
    const llegada = new Date(puro.fechaLlegada);

    for (const anos of [1, 2] as const) {
      const objetivo = new Date(llegada);
      objetivo.setFullYear(objetivo.getFullYear() + anos);
      const diffMs = objetivo.getTime() - hoy.getTime();
      const diasRestantes = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diasRestantes >= 0 && diasRestantes <= 30) {
        alerts.push({ puro, diasRestantes, objetivoAnos: anos });
      }
    }
  }

  return alerts;
}
