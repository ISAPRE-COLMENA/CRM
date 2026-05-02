'use client';
import { useState } from 'react';
import { useLeads } from '@/hooks/useLeads';
import { formatRUT, formatSueldo, STAGE_CONFIG } from '@/lib/utils';
import type { Lead, Stage } from '@/types';
import VideoMeeting from '@/components/video/VideoMeeting';
import { X, Video, Phone, Mail, DollarSign, Building2, Calendar, CheckSquare, Square, Edit2, Save, Loader2 } from 'lucide-react';
const DOCS=[{key:'doc_cedula_identidad',label:'Cédula de Identidad'},{key:'doc_liquidacion_sueldo',label:'Liquidación de Sueldo'},{key:'doc_fun3',label:'Formulario FUN 3',required:true},{key:'doc_formulario_afiliacion',label:'Formulario de Afiliación'},{key:'doc_consentimiento',label:'Consentimiento Informado'}] as const;
export default function LeadModal({lead:init,onClose,agente}:{lead:Lead;onClose:()=>void;agente?:{id?:string;nombre?:string;email?:string}}) {
  const {updateLead,updateStage}=useLeads();
  const [lead,setLead]=useState(init), [showVideo,setShowVideo]=useState(false);
  const [editing,setEditing]=useState(false), [saving,setSaving]=useState(false);
  const [firma,setFirma]=useState(lead.fecha_firma||'');
  const cfg=STAGE_CONFIG[lead.stage];
  const handleStage=async(stage:Stage)=>{
    if(stage==='cierre'&&!lead.doc_fun3){alert('⚠️ El Formulario FUN 3 es obligatorio para registrar el cierre.');return;}
    await updateStage(lead.id,stage);setLead(l=>({...l,stage}));
  };
  const toggleDoc=async(key:typeof DOCS[number]['key'])=>{const v=!lead[key];setLead(l=>({...l,[key]:v}));await updateLead(lead.id,{[key]:v});};
  const handleSaveFirma=async()=>{setSaving(true);const{data}=await updateLead(lead.id,{fecha_firma:firma||undefined});if(data)setLead(data as Lead);setSaving(false);setEditing(false);};
  const done=DOCS.filter(d=>lead[d.key]).length;
  return (
    <><div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={onClose}/>
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-white dark:bg-gray-900 shadow-2xl flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
        <div><h2 className="font-bold text-lg">{lead.nombre} {lead.apellido}</h2><p className="text-xs text-gray-400 font-mono mt-0.5">{formatRUT(lead.rut)}</p></div>
        <div className="flex items-center gap-2">
          <button onClick={()=>setShowVideo(true)} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors"><Video size={13}/>Videollamada</button>
          <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 transition-colors" aria-label="Cerrar"><X size={18}/></button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {/* Etapa */}
        <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-800">
          <p className="label mb-2">Etapa del prospecto</p>
          <div className="flex gap-1 flex-wrap">{(Object.entries(STAGE_CONFIG) as [Stage,any][]).map(([key,c])=>(<button key={key} onClick={()=>handleStage(key)} className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${lead.stage===key?`${c.badge} ring-2 ring-offset-1 ring-current`:'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}><span className={`w-1.5 h-1.5 rounded-full ${c.dot}`}/>{c.label}</button>))}</div>
        </div>
        {/* Info */}
        <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-800 grid grid-cols-2 gap-3">
          {lead.email&&<div className="flex items-center gap-2 text-sm text-gray-600"><Mail size={14} className="text-gray-400 shrink-0"/><span className="truncate">{lead.email}</span></div>}
          {lead.telefono&&<div className="flex items-center gap-2 text-sm text-gray-600"><Phone size={14} className="text-gray-400 shrink-0"/><span>{lead.telefono}</span></div>}
          <div className="flex items-center gap-2 text-sm text-gray-600"><DollarSign size={14} className="text-gray-400 shrink-0"/><span className="tabular-nums font-medium">{formatSueldo(lead.sueldo_imponible)}</span></div>
          <div className="flex items-center gap-2 text-sm text-gray-600"><Building2 size={14} className="text-gray-400 shrink-0"/><span>{lead.isapre_actual||'—'}</span></div>
        </div>
        {/* Firma / Vigencia */}
        <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-800">
          <div className="flex items-center justify-between mb-3"><p className="label">Fecha de firma</p><button onClick={()=>setEditing(v=>!v)} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"><Edit2 size={13}/></button></div>
          {editing?(<div className="flex gap-2"><input type="date" value={firma} onChange={e=>setFirma(e.target.value)} className="input flex-1"/><button onClick={handleSaveFirma} disabled={saving} className="btn-primary flex items-center gap-1">{saving?<Loader2 size={13} className="animate-spin"/>:<Save size={13}/>}Guardar</button></div>):(
            <div className="flex items-center gap-6">
              <div><p className="text-xs text-gray-400 mb-0.5">Firma</p><p className="text-sm font-medium">{lead.fecha_firma||'—'}</p></div>
              {lead.vigencia_desde&&(<div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-green-50 dark:bg-green-950/20"><Calendar size={14} className="text-green-500"/><div><p className="text-[10px] text-green-600 font-semibold uppercase tracking-wide">Vigencia desde</p><p className="text-sm font-bold text-green-700 tabular-nums">{lead.vigencia_desde}</p></div></div>)}
            </div>
          )}
        </div>
        {/* Checklist */}
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-3"><p className="label">Documentos</p><span className="text-xs font-semibold text-gray-500">{done}/{DOCS.length}</span></div>
          <div className="space-y-2">{DOCS.map(doc=>(<button key={doc.key} onClick={()=>toggleDoc(doc.key)} className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-colors text-left ${lead[doc.key]?'bg-green-50 border border-green-200':'bg-gray-50 hover:bg-gray-100'}`}>{lead[doc.key]?<CheckSquare size={16} className="text-green-500 shrink-0"/>:<Square size={16} className="text-gray-400 shrink-0"/>}<span className={`text-sm font-medium ${lead[doc.key]?'text-green-700':'text-gray-600'}`}>{doc.label}</span>{'required' in doc&&doc.required&&!lead[doc.key]&&<span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-red-600 font-semibold">Obligatorio</span>}</button>))}</div>
          <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-green-500 rounded-full transition-all duration-500" style={{width:`${(done/DOCS.length)*100}%`}}/></div>
        </div>
      </div>
    </div>
    {showVideo&&<VideoMeeting lead={lead} agente={agente} onClose={()=>setShowVideo(false)}/>}</>
  );
}