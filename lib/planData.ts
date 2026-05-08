import fullPlanes from './fullPlanData.json';

export const GES_VALUE = 1.036;

export interface Plan {
  tipo: string;
  nombre: string;
  pbIndividual: number;
  pbGrupal: number;
  coberturaHosp: string;
  dcPref: string;
  topeAnualMed: string;
  consultaPref: string;
  region: 'RM' | 'REGIONES';
}

export const PLANES: Plan[] = fullPlanes as Plan[];

export const getFactor = (edad: number, esCotizante: boolean): number => {
  if (edad < 2) return 0; // Menores de 2 años no pagan factor en la tabla Isapre
  if (edad < 20) return 0.6;
  if (edad < 25) return esCotizante ? 0.9 : 0.7;
  if (edad < 35) return esCotizante ? 1.0 : 0.7;
  if (edad < 45) return esCotizante ? 1.2 : 0.9;
  if (edad < 55) return esCotizante ? 1.5 : 1.1;
  return esCotizante ? 2.0 : 1.5;
};

export const REGIONES = [
  { id: 'RM', label: 'Región Metropolitana (Santiago)' },
  { id: 'REGIONES', label: 'Regiones (Norte / Sur)' }
];
