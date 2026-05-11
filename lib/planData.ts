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

const CLINIC_MAP: Record<string, string> = {
  'G41': 'Hosp. Profesor / Cl. Cordillera',
  'G42': 'Cl. Dávila / Bupa Santiago',
  'G43': 'RedSalud / Hosp. Clínico U. de Chile',
  'G44': 'Cl. Indisa / Santa María',
  'G45': 'Cl. Alemana / Las Condes',
  'G46': 'Red Vidaintegra',
  'ST': 'Sin Tope / Libre Elección'
};

export const translateDescription = (text: string): string => {
  if (!text) return '';
  if (text === 'ST') return CLINIC_MAP['ST'];
  
  // Si el texto contiene códigos de grupo como G41, G42...
  if (text.includes('G4')) {
    let parts = text.split(/\s+/).filter(p => p.includes('G4'));
    let result = parts.map(p => {
      const codeMatch = p.match(/G4\d/);
      const percentMatch = p.match(/(\d+)%/);
      if (codeMatch) {
        const code = codeMatch[0];
        const percent = percentMatch ? percentMatch[1] : '0';
        return `${percent}% ${CLINIC_MAP[code] || code}`;
      }
      return p;
    }).join(' • ');
    
    return result || text;
  }
  
  return text.trim();
};
