'use client';
import { useState, useCallback, useEffect } from 'react';
import type { Evento } from '@/types';
import { supabase } from '@/lib/supabase';

export function useEvents() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('eventos').select('*, leads(nombre, apellido)').order('inicio', { ascending: true });
    if (!error && data) {
      setEventos(data.map((e: any) => ({
        ...e,
        lead_nombre: e.leads ? `${e.leads.nombre} ${e.leads.apellido}` : undefined
      })));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const createEvent = async (data: Partial<Evento>) => {
    const { data: created, error } = await supabase.from('eventos').insert([data]).select().single();
    if (!error && created) {
      setEventos(prev => [...prev, created]);
    }
    return { data: created, error };
  };

  const updateEvent = async (id: string, data: Partial<Evento>) => {
    const { data: updated, error } = await supabase.from('eventos').update(data).eq('id', id).select().single();
    if (!error && updated) {
      setEventos(prev => prev.map(e => e.id === id ? updated : e));
    }
    return { data: updated, error };
  };

  const deleteEvent = async (id: string) => {
    const { error } = await supabase.from('eventos').delete().eq('id', id);
    if (!error) {
      setEventos(prev => prev.filter(e => e.id !== id));
    }
    return { error };
  };

  return { eventos, loading, createEvent, updateEvent, deleteEvent, fetchEvents };
}
