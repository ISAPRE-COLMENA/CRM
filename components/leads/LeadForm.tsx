'use client';
import { useState } from 'react';
import { useLeads } from '@/hooks/useLeads';
import { normalizeRUT } from '@/lib/utils';
import type { Stage } from '@/types';
import { X, Loader2 } from 'lucide-react';
export default function LeadForm({defaultStage='nuevo',onClose}:{defaultStage?:Stage;onClose:()=>void}) {
  const {createLead}=useLeads();
  const [saving,setSaving]=useState(false), [error,setError]=useState('');
  const [form,setForm]=useState({rut:'',nombre:'',apellido:'',email:'',telefono:'',sueldo_imponible:'',isapre_actual:'',stage:defaultStage});
  const set=(k:string,v:string)=>setForm(f=>({...f,[k]:v}));
  const handleSubmit=async(e:React.FormEvent)=>{
    e.preventDefault();setSaving(true);setError('');
    const{error}=await createLead({...form,rut:normalizeRUT(form.rut),sueldo_imponible:form.sueldo_imponible?parseFloat(form.sueldo_imponible.replace(/[^\d.]/g,'')):undefined});
    if(error){setError(error.message);setSaving(false);return;}
    onClose();
  };
  return (
    <><div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={onClose}/>
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6"><h2 className="font-bold text-lg">Nuevo Prospecto</h2><button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 transition-colors"><X size={16}/></button></div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Nombre *</label><input required value={form.nombre} onChange={e=>set('nombre',e.target.value)} className="input" placeholder="Juan"/></div>
            <div><label className="label">Apellido *</label><input required value={form.apellido} onChange={e=>set('apellido',e.target.value)} className="input" placeholder="Pérez"/></div>
          </div>
          <div><label className="label">RUT *</label><input required value={form.rut} onChange={e=>set('rut',e.target.value)} className="input" placeholder="12345678-9"/></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Email</label><input type="email" value={form.email} onChange={e=>set('email',e.target.value)} className="input" placeholder="juan@mail.com"/></div>
            <div><label className="label">Teléfono</label><input value={form.telefono} onChange={e=>set('telefono',e.target.value)} className="input" placeholder="+56 9..."/></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Sueldo Imponible</label><input value={form.sueldo_imponible} onChange={e=>set('sueldo_imponible',e.target.value)} className="input" placeholder="800000"/></div>
            <div><label className="label">Isapre Actual</label><input value={form.isapre_actual} onChange={e=>set('isapre_actual',e.target.value)} className="input" placeholder="Fonasa"/></div>
          </div>
          <div><label className="label">Etapa inicial</label><select value={form.stage} onChange={e=>set('stage',e.target.value)} className="input"><option value="nuevo">Nuevo / Frío</option><option value="contactado">Contactado</option><option value="evaluacion">En Evaluación</option><option value="cierre">Cierre</option><option value="no_interesado">No Interesado</option></select></div>
          {error&&<div className="p-3 rounded-xl bg-red-50 border border-red-200"><p className="text-xs text-red-600">{error}</p></div>}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancelar</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">{saving&&<Loader2 size={14} className="animate-spin"/>}{saving?'Guardando...':'Crear Prospecto'}</button>
          </div>
        </form>
      </div>
    </div></>
  );
}