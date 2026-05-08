export const GES_VALUE = 1.036;

export interface Plan {
  nombre: string;
  codigo: string;
  pbIndividual: number;
  pbGrupal: number;
  tipo: 'STAR' | 'SILVER' | 'GOLD' | 'MAX';
  cobertura: string;
  region: 'RM' | 'REGIONES' | 'NACIONAL';
}

// Factores de riesgo basados en la hoja "RANGO EDAD"
export const getFactor = (edad: number, esCotizante: boolean): number => {
  if (edad < 2) return 0; // 0 a menos de 2 años según Excel (aunque suele ser carga)
  if (edad < 20) return 0.6;
  if (edad < 25) return esCotizante ? 0.9 : 0.7;
  return esCotizante ? 1.0 : 0.7;
};

// Muestra representativa de los planes extraídos del Excel RM
export const PLANES: Plan[] = [
  {
    nombre: 'COLMENA STAR 2268080',
    codigo: '12966',
    pbIndividual: 1.49,
    pbGrupal: 1.34,
    tipo: 'STAR',
    region: 'RM',
    cobertura: '90% Hospital del Profesor, 80% Clínica Dávila Vespucio, RedSalud Santiago.'
  },
  {
    nombre: 'COLMENA STAR 2269060',
    codigo: '12967',
    pbIndividual: 1.47,
    pbGrupal: 1.32,
    tipo: 'STAR',
    region: 'RM',
    cobertura: '100% Hospital del Profesor, 90% Clínica Dávila Vespucio, Bupa Santiago.'
  },
  {
    nombre: 'COLMENA SILVER 2264040',
    codigo: '12510',
    pbIndividual: 1.20,
    pbGrupal: 1.08,
    tipo: 'SILVER',
    region: 'REGIONES',
    cobertura: '60% Hospital del Profesor, Clínica Cordillera, 40% RedSalud Santiago.'
  },
  {
    nombre: 'COLMENA SILVER 2264540',
    codigo: '12513',
    pbIndividual: 1.22,
    pbGrupal: 1.10,
    tipo: 'SILVER',
    region: 'REGIONES',
    cobertura: '65% Hospital del Profesor, Clínica Cordillera, 45% RedSalud Providencia.'
  },
  {
    nombre: 'COLMENA MAX SUR 226100',
    codigo: '13001',
    pbIndividual: 1.55,
    pbGrupal: 1.40,
    tipo: 'MAX',
    region: 'REGIONES',
    cobertura: '100% Clínicas del Sur, Puerto Varas, Puerto Montt.'
  }
];

export const REGIONES = [
  { id: 'RM', label: 'Región Metropolitana' },
  { id: 'REGIONES', label: 'Otras Regiones (Sur/Norte)' }
];
