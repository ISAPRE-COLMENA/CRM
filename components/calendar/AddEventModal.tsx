'use client';
import { useState, useEffect } from 'react';
import { Loader2, X, Video, MapPin, Calendar, Clock, FileText, Send, User } from 'lucide-react';
import { useEvents } from '@/hooks/useEvents';
import { useLeads } from '@/hooks/useLeads';

export default function AddEventModal({ onClose, selectedDate }: { onClose: () => void, selectedDate?: string }) {
  const { createEvent } = useEvents();
  const { leads } = useLeads();
  const [loading, setLoading] = useState(false);
  const [sendNotification, setSendNotification] = useState(true);
  
  const [formData, setFormData] = useState({
    titulo: '',
    tipo: 'reunion' as 'reunion' | 'visita_terreno' | 'videollamada' | 'seguimiento',
    inicio: selectedDate ? selectedDate.split('T')[0] + 'T09:00' : new Date().toISOString().split('T')[0] + 'T09:00',
    fin: selectedDate ? selectedDate.split('T')[0] + 'T10:00' : new Date().toISOString().split('T')[0] + 'T10:00',
    descripcion: '',
    lead_id: '',
    sala_jitsi: '',
    ubicacion: ''
  });

  // Generar link de Jitsi automáticamente si es videollamada
  useEffect(() => {
    if (formData.tipo === 'videollamada' && !formData.sala_jitsi) {
      const roomName = `colmena-${Math.random().toString(36).substring(7)}`;
      setFormData(prev => ({ ...prev, sala_jitsi: `https://meet.jit.si/${roomName}` }));
    }
  }, [formData.tipo, formData.sala_jitsi]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const lead = leads.find(l => l.id === formData.lead_id);
    
    // Si es visita y el lead tiene ubicación, podríamos sugerirla (futura mejora)
    
    await createEvent({
      ...formData,
      lead_nombre: lead ? `${lead.nombre} ${lead.apellido}` : undefined
    } as any);
    
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md">
      <div className="bg-white dark:bg-gray-900 rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden border border-white/20">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
          <div>
            <h2 className="font-extrabold text-2xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Agendar Actividad
            </h2>
            <p className="text-sm text-gray-500">Planifica tu próxima interacción de venta</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">
            <X size={20}/>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Título */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              <FileText size={16} className="text-blue-500"/> Asunto de la cita
            </label>
            <input 
              type="text" 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
              placeholder="Ej: Presentación de planes Isapre" 
              required 
              value={formData.titulo}
              onChange={e => setFormData({...formData, titulo: e.target.value})}
            />
          </div>

          {/* Selector de Tipo Visual */}
          <div className="grid grid-cols-2 gap-3">
            <button 
              type="button"
              onClick={() => setFormData({...formData, tipo: 'videollamada'})}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${formData.tipo === 'videollamada' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'border-gray-100 dark:border-gray-800 hover:border-gray-300'}`}
            >
              <Video size={24}/>
              <span className="text-xs font-bold">Videollamada</span>
            </button>
            <button 
              type="button"
              onClick={() => setFormData({...formData, tipo: 'visita_terreno'})}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${formData.tipo === 'visita_terreno' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600' : 'border-gray-100 dark:border-gray-800 hover:border-gray-300'}`}
            >
              <MapPin size={24}/>
              <span className="text-xs font-bold">Visita Terreno</span>
            </button>
          </div>

          {/* Prospecto */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              <User size={16} className="text-blue-500"/> Cliente / Prospecto
            </label>
            <select 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.lead_id}
              onChange={e => setFormData({...formData, lead_id: e.target.value})}
            >
              <option value="">Seleccionar prospecto...</option>
              {leads.map(l => (
                <option key={l.id} value={l.id}>{l.nombre} {l.apellido} - {l.rut}</option>
              ))}
            </select>
          </div>

          {/* Fechas */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                <Calendar size={16}/> Inicio
              </label>
              <input 
                type="datetime-local" 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 text-sm" 
                required 
                value={formData.inicio}
                onChange={e => setFormData({...formData, inicio: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                <Clock size={16}/> Fin
              </label>
              <input 
                type="datetime-local" 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 text-sm" 
                required 
                value={formData.fin}
                onChange={e => setFormData({...formData, fin: e.target.value})}
              />
            </div>
          </div>

          {/* Campos condicionales */}
          {formData.tipo === 'videollamada' && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800 animate-in fade-in slide-in-from-top-2">
              <label className="text-xs font-bold text-blue-600 uppercase mb-2 block">Link de Videollamada (Jitsi)</label>
              <input 
                type="text" 
                readOnly
                className="w-full bg-transparent text-sm font-mono text-blue-700 dark:text-blue-300 outline-none"
                value={formData.sala_jitsi}
              />
            </div>
          )}

          {formData.tipo === 'visita_terreno' && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                <MapPin size={16} className="text-indigo-500"/> Dirección de la Visita
              </label>
              <input 
                type="text" 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800" 
                placeholder="Ej: Av. Vitacura 123, Oficina 402"
                value={formData.ubicacion}
                onChange={e => setFormData({...formData, ubicacion: e.target.value})}
              />
            </div>
          )}

          {/* Notificación */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <Send size={18} className="text-gray-400"/>
              <div>
                <p className="text-sm font-bold">Enviar Notificación</p>
                <p className="text-xs text-gray-500">Se enviará invitación por email al cliente</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={sendNotification} onChange={() => setSendNotification(!sendNotification)}/>
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/30 flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? <Loader2 size={20} className="animate-spin"/> : <><Calendar size={20}/> Guardar en Agenda</>}
          </button>
        </form>
      </div>
    </div>
  );
}
