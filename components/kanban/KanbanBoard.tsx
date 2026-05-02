'use client';
import { useState } from 'react';
import { useLeads } from '@/hooks/useLeads';
import { STAGE_CONFIG, formatRUT, formatSueldo } from '@/lib/utils';
import type { Lead, Stage } from '@/types';
import { User, DollarSign, Building2, GripVertical, Plus, Loader2, LayoutGrid, List } from 'lucide-react';

const STAGES = Object.entries(STAGE_CONFIG) as [Stage, typeof STAGE_CONFIG[Stage]][];

function LeadCard({lead,cfg,onDragStart,onClick,compact}:{lead:Lead;cfg:any;onDragStart:(e:React.DragEvent,id:string)=>void;onClick:(l:Lead)=>void;compact:boolean}) {
  if (!lead) return null;
  
  if (compact) {
    return (
      <div draggable onDragStart={e=>onDragStart(e,lead.id)} onClick={()=>onClick(lead)}
        className={`group relative bg-white dark:bg-gray-900 rounded-lg shadow-sm border-l-2 ${cfg?.border || 'border-gray-200'} p-2.5 cursor-grab active:cursor-grabbing hover:shadow-md transition-all select-none flex items-center gap-3`}>
        <div className="p-1 rounded-md bg-gray-50 dark:bg-gray-800"><User size={12} className="text-gray-400"/></div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-[11px] text-gray-900 dark:text-gray-100 truncate">{lead.nombre} {lead.apellido}</p>
          <p className="text-[10px] text-gray-400 truncate">{formatSueldo(lead.sueldo_imponible)}</p>
        </div>
      </div>
    );
  }

  return (
    <div draggable onDragStart={e=>onDragStart(e,lead.id)} onClick={()=>onClick(lead)}
      className={`group relative bg-white dark:bg-gray-900 rounded-xl shadow-sm border-l-4 ${cfg?.border || 'border-gray-200'} p-4 cursor-grab active:cursor-grabbing hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 select-none`}>
      <GripVertical size={13} className="absolute top-3 right-3 text-gray-300 group-hover:text-gray-400"/>
      <div className="flex items-start gap-2 mb-3 pr-5">
        <div className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 mt-0.5"><User size={13} className="text-gray-500"/></div>
        <div><p className="font-semibold text-sm text-gray-900 dark:text-gray-100 leading-tight">{lead.nombre} {lead.apellido}</p><p className="text-xs text-gray-400 font-mono mt-0.5">{formatRUT(lead.rut || '')}</p></div>
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 text-xs text-gray-500"><DollarSign size={11}/><span className="tabular-nums">{formatSueldo(lead.sueldo_imponible)}</span></div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500"><Building2 size={11}/><span className="truncate">{lead.isapre_actual||'Sin Isapre'}</span></div>
      </div>
    </div>
  );
}

export default function KanbanBoard({onLeadClick,onAddLead}:{onLeadClick:(l:Lead)=>void;onAddLead:(s:Stage)=>void}) {
  const {leads,loading,updateStage}=useLeads();
  const [dragging,setDragging]=useState<string|null>(null);
  const [dragOver,setDragOver]=useState<Stage|null>(null);
  const [compact, setCompact] = useState(false);

  const handleDrop=async(e:React.DragEvent,stage:Stage)=>{
    e.preventDefault();setDragOver(null);
    if(!dragging)return;
    await updateStage(dragging,stage);setDragging(null);
  };

  if(loading) return <div className="flex items-center justify-center h-64 text-gray-400"><Loader2 size={22} className="animate-spin mr-2"/><span className="text-sm">Cargando...</span></div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-end px-1">
        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <button onClick={() => setCompact(false)} className={`p-1.5 rounded-lg transition-all ${!compact ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`} title="Vista de tarjetas"><LayoutGrid size={16}/></button>
          <button onClick={() => setCompact(true)} className={`p-1.5 rounded-lg transition-all ${compact ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`} title="Vista compacta"><List size={16}/></button>
        </div>
      </div>
      <div className="overflow-x-auto pb-6">
        <div className="flex gap-4 min-w-max px-1 py-1">
          {STAGES.map(([stage,cfg])=>{
            const sl=leads?.filter(l=>l && l.stage===stage) || [];
            return (
              <div key={stage} className={`flex flex-col rounded-2xl p-3 w-72 shrink-0 min-h-[600px] transition-colors ${dragOver===stage?'bg-blue-50 ring-2 ring-blue-200':(cfg?.bg || 'bg-gray-50')}`}
                onDrop={e=>handleDrop(e,stage)} onDragOver={e=>{e.preventDefault();setDragOver(stage);}} onDragLeave={()=>setDragOver(null)}>
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-2"><span className={`w-2.5 h-2.5 rounded-full ${cfg?.dot || 'bg-gray-400'}`}/><span className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">{cfg?.label || stage}</span></div>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${cfg?.badge || 'bg-gray-100'}`}>{sl.length}</span>
                    <button onClick={()=>onAddLead(stage)} className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-white/80 transition-all" aria-label="Agregar"><Plus size={14}/></button>
                  </div>
                </div>
                <div className="flex flex-col gap-2.5 flex-1">
                  {sl.length===0&&<div className="flex flex-1 items-center justify-center py-12"><p className="text-xs text-gray-300">Sin prospectos</p></div>}
                  {sl.map(lead=><LeadCard key={lead.id} lead={lead} cfg={cfg} compact={compact} onDragStart={(e,id)=>{setDragging(id);e.dataTransfer.effectAllowed='move';}} onClick={onLeadClick}/>)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}