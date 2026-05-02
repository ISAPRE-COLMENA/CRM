'use client';
import { useState } from 'react';
import { Loader2, X } from 'lucide-react';
import { useEvents } from '@/hooks/useEvents';
import { useLeads } from '@/hooks/useLeads';

export default function AddEventModal({ onClose, selectedDate }: { onClose: () => void, selectedDate?: string }) {
  const { createEvent } = useEvents();
  const { leads } = useLeads();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    titulo: '',
    tipo: 'reunion',
    inicio: selectedDate ? selectedDate.split('T')[0] + 'T09:00' : new Date().toISOString().split('T')[0] + 'T09:00',
    fin: selectedDate ? selectedDate.split('T')[0] + 'T10:00' : new Date().toISOString().split('T')[0] + 'T10:00',
    descripcion: '',
    lead_id: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const lead = leads.find(l => l.id === formData.lead_id);
    await createEvent({
      ...formData,
      lead_nombre: lead ? `${lead.nombre} ${lead.apellido}` : undefined
    } as any);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="font-bold text-lg">Nueva Cita</h2>
          <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 transition-colors"><X size={18}/></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="label">Título de la cita</label>
            <input 
              type="text" 
              className="input" 
              placeholder="Ej: Firma de contrato" 
              required 
              value={formData.titulo}
              onChange={e => setFormData({...formData, titulo: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Tipo</label>
              <select 
                className="input"
                value={formData.tipo}
                onChange={e => setFormData({...formData, tipo: e.target.value as any})}
              >
                <option value="reunion">Reunión</option>
                <option value="visita_terreno">Visita Terreno</option>
                <option value="videollamada">Videollamada</option>
                <option value="seguimiento">Seguimiento</option>
              </select>
            </div>
            <div>
              <label className="label">Prospecto (Opcional)</label>
              <select 
                className="input"
                value={formData.lead_id}
                onChange={e => setFormData({...formData, lead_id: e.target.value})}
              >
                <option value="">Ninguno</option>
                {leads.map(l => (
                  <option key={l.id} value={l.id}>{l.nombre} {l.apellido}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Inicio</label>
              <input 
                type="datetime-local" 
                className="input" 
                required 
                value={formData.inicio}
                onChange={e => setFormData({...formData, inicio: e.target.value})}
              />
            </div>
            <div>
              <label className="label">Fin</label>
              <input 
                type="datetime-local" 
                className="input" 
                required 
                value={formData.fin}
                onChange={e => setFormData({...formData, fin: e.target.value})}
              />
            </div>
          </div>
          <div>
            <label className="label">Descripción</label>
            <textarea 
              className="input min-h-[100px]" 
              placeholder="Notas adicionales..."
              value={formData.descripcion}
              onChange={e => setFormData({...formData, descripcion: e.target.value})}
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
            {loading ? <Loader2 size={18} className="animate-spin"/> : 'Guardar Cita'}
          </button>
        </form>
      </div>
    </div>
  );
}
