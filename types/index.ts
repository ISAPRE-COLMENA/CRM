export type Stage = 'nuevo'|'contactado'|'evaluacion'|'cierre'|'no_interesado';
export interface Lead {
  id:string; rut:string; nombre:string; apellido:string;
  email?:string; telefono?:string; sueldo_imponible?:number; isapre_actual?:string;
  stage:Stage; fecha_firma?:string; vigencia_desde?:string;
  doc_cedula_identidad:boolean; doc_liquidacion_sueldo:boolean; doc_fun3:boolean;
  doc_formulario_afiliacion:boolean; doc_consentimiento:boolean;
  lat?:number; lng?:number; agente_id?:string; created_at:string; updated_at:string;
}
export interface Interaccion {
  id:string; lead_id:string; agente_id?:string;
  tipo:'llamada'|'videollamada'|'visita'|'email'|'whatsapp'|'nota';
  notas?:string; duracion_min?:number; sala_jitsi?:string; created_at:string;
}
export type EventType = 'reunion'|'visita_terreno'|'videollamada'|'seguimiento'|'otro';
export interface Evento {
  id:string; lead_id?:string; agente_id?:string; titulo:string;
  tipo: EventType;
  inicio:string; fin:string; sala_jitsi?:string; ubicacion?:string; created_at:string;
  lead_nombre?:string;
}