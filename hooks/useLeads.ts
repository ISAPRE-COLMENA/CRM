'use client';
import { useState, useCallback, useEffect } from 'react';
import type { Lead } from '@/types';
import { supabase } from '@/lib/supabase';

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      setLeads(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);
  
  const updateStage = async (id: string, stage: Lead['stage']) => {
    const { error } = await supabase.from('leads').update({ stage }).eq('id', id);
    if (!error) {
      setLeads(prev => prev.map(l => l.id === id ? { ...l, stage } : l));
    }
  };
  
  const createLead = async (data: Partial<Lead>): Promise<{ data: Lead | null; error: Error | null }> => {
    const { data: created, error } = await supabase.from('leads').insert([data]).select().single();
    if (!error && created) {
      setLeads(prev => [created, ...prev]);
    }
    return { data: created, error };
  };
  
  const updateLead = async (id: string, data: Partial<Lead>): Promise<{ data: Lead | null; error: Error | null }> => {
    const { data: updated, error } = await supabase.from('leads').update(data).eq('id', id).select().single();
    if (!error && updated) {
      setLeads(prev => prev.map(l => l.id === id ? updated : l));
    }
    return { data: updated, error };
  };
  
  return { leads, loading, fetch, updateStage, createLead, updateLead };
}