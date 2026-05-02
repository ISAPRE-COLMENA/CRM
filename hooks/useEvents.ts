'use client';
import { useState, useCallback, useEffect } from 'react';

export type EventType = 'reunion' | 'visita_terreno' | 'videollamada' | 'seguimiento' | 'otro';

export interface Evento {
  id: string;
  titulo: string;
  tipo: EventType;
  inicio: string;
  fin: string;
  descripcion?: string;
  lead_id?: string;
  lead_nombre?: string;
  location?: string;
  meeting_url?: string;
}

const MOCK_EVENTS: Evento[] = [
  {
    id: 'e1',
    titulo: 'Visita Terreno: Juan Pérez',
    tipo: 'visita_terreno',
    inicio: new Date().toISOString().split('T')[0] + 'T10:00:00',
    fin: new Date().toISOString().split('T')[0] + 'T11:30:00',
    descripcion: 'Firma de FUN 3 y entrega de cédula.',
    lead_id: '1',
    lead_nombre: 'Juan Pérez',
    location: 'Av. Providencia 1234, Santiago'
  },
  {
    id: 'e2',
    titulo: 'Videollamada: María González',
    tipo: 'videollamada',
    inicio: new Date().toISOString().split('T')[0] + 'T15:00:00',
    fin: new Date().toISOString().split('T')[0] + 'T15:45:00',
    descripcion: 'Evaluación de plan 7% + excedentes.',
    lead_id: '2',
    lead_nombre: 'María González',
    meeting_url: 'https://meet.jit.si/Colmena-Maria-G'
  },
  {
    id: 'e3',
    titulo: 'Seguimiento: Pedro Soto',
    tipo: 'seguimiento',
    inicio: new Date(Date.now() + 86400000).toISOString().split('T')[0] + 'T09:00:00',
    fin: new Date(Date.now() + 86400000).toISOString().split('T')[0] + 'T09:30:00',
    descripcion: 'Llamar para confirmar recepción de documentos.',
    lead_id: '3',
    lead_nombre: 'Pedro Soto'
  }
];

export function useEvents() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setEventos(MOCK_EVENTS);
    setLoading(false);
  }, []);

  const createEvent = async (data: Partial<Evento>) => {
    const created = { id: Math.random().toString(), ...data } as Evento;
    setEventos(prev => [...prev, created]);
    return { data: created, error: null };
  };

  const updateEvent = async (id: string, data: Partial<Evento>) => {
    setEventos(prev => prev.map(e => e.id === id ? ({ ...e, ...data } as Evento) : e));
    return { data: null, error: null };
  };

  const deleteEvent = async (id: string) => {
    setEventos(prev => prev.filter(e => e.id !== id));
    return { error: null };
  };

  return { eventos, loading, createEvent, updateEvent, deleteEvent };
}
