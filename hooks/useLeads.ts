'use client';
import { useState, useCallback, useEffect } from 'react';
import type { Lead } from '@/types';

const MOCK_DATA: Lead[] = [
  { id: '1', rut: '12345678-9', nombre: 'Juan', apellido: 'Pérez', email: 'juan@gmail.com', telefono: '+56912345678', sueldo_imponible: 1500000, isapre_actual: 'Consalud', stage: 'nuevo', created_at: '2024-05-01T12:00:00Z', updated_at: '2024-05-01T12:00:00Z', doc_fun3: false, doc_cedula_identidad: false, doc_liquidacion_sueldo: false, doc_formulario_afiliacion: false, doc_consentimiento: false },
  { id: '2', rut: '98765432-1', nombre: 'María', apellido: 'González', email: 'maria@outlook.com', telefono: '+56987654321', sueldo_imponible: 2200000, isapre_actual: 'Banmédica', stage: 'contactado', created_at: '2024-05-01T12:00:00Z', updated_at: '2024-05-01T12:00:00Z', doc_fun3: true, doc_cedula_identidad: false, doc_liquidacion_sueldo: false, doc_formulario_afiliacion: false, doc_consentimiento: false },
  { id: '3', rut: '15678901-2', nombre: 'Pedro', apellido: 'Soto', email: 'psoto@empresa.cl', telefono: '+56955566677', sueldo_imponible: 1800000, isapre_actual: 'Colmena', stage: 'evaluacion', created_at: '2024-05-01T12:00:00Z', updated_at: '2024-05-01T12:00:00Z', doc_fun3: true, doc_cedula_identidad: false, doc_liquidacion_sueldo: false, doc_formulario_afiliacion: false, doc_consentimiento: false },
  { id: '4', rut: '18234567-8', nombre: 'Ana', apellido: 'López', email: 'alopez@gmail.com', telefono: '+56944433322', sueldo_imponible: 3500000, isapre_actual: 'Vida Tres', stage: 'cierre', created_at: '2024-05-01T12:00:00Z', updated_at: '2024-05-01T12:00:00Z', doc_fun3: true, doc_cedula_identidad: false, doc_liquidacion_sueldo: false, doc_formulario_afiliacion: false, doc_consentimiento: false }
];

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  // Usamos useEffect para cargar los datos solo en el cliente y evitar errores de hidratación
  useEffect(() => {
    setLeads(MOCK_DATA);
    setLoading(false);
  }, []);

  const fetch = useCallback(async () => {}, []);
  
  const updateStage = async (id: string, stage: Lead['stage']) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, stage } : l));
  };
  
  const createLead = async (data: Partial<Lead>): Promise<{ data: Lead | null; error: Error | null }> => {
    const created = { id: Math.random().toString(), ...data, created_at: new Date().toISOString() } as Lead;
    setLeads(prev => [created, ...prev]);
    return { data: created, error: null };
  };
  
  const updateLead = async (id: string, data: Partial<Lead>): Promise<{ data: Lead | null; error: Error | null }> => {
    setLeads(prev => prev.map(l => l.id === id ? ({ ...l, ...data } as Lead) : l));
    return { data: null, error: null };
  };
  
  return { leads, loading, fetch, updateStage, createLead, updateLead };
}