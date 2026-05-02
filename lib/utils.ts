import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
export function formatRUT(rut: string): string {
  const clean = rut.replace(/[^0-9kK]/g, '');
  if (clean.length < 2) return rut;
  const body = clean.slice(0,-1).replace(/(\d)(?=(\d{3})+(?!\d))/g,'$1.');
  return `${body}-${clean.slice(-1).toUpperCase()}`;
}
export function formatSueldo(valor?: number|null): string {
  if (!valor) return '—';
  return new Intl.NumberFormat('es-CL',{style:'currency',currency:'CLP',maximumFractionDigits:0}).format(valor);
}
export function normalizeRUT(rut: string): string {
  return rut.replace(/[\.\s]/g,'').replace('-','').toUpperCase();
}
export const STAGE_CONFIG = {
  nuevo:         { label:'Nuevo / Frío',    dot:'bg-gray-400',   border:'border-gray-300',   badge:'bg-gray-100 text-gray-600',   bg:'bg-gray-50' },
  contactado:    { label:'Contactado',      dot:'bg-blue-500',   border:'border-blue-400',   badge:'bg-blue-100 text-blue-700',   bg:'bg-blue-50/50' },
  evaluacion:    { label:'En Evaluación',   dot:'bg-yellow-500', border:'border-yellow-400', badge:'bg-yellow-100 text-yellow-700',bg:'bg-yellow-50/50' },
  cierre:        { label:'Cierre',          dot:'bg-green-500',  border:'border-green-400',  badge:'bg-green-100 text-green-700', bg:'bg-green-50/50' },
  no_interesado: { label:'No Interesado',   dot:'bg-red-500',    border:'border-red-400',    badge:'bg-red-100 text-red-700',     bg:'bg-red-50/50' },
};