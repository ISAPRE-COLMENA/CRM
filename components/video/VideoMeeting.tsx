'use client';
import { useState, useCallback } from 'react';
import { JitsiMeeting } from '@jitsi/react-sdk';
import { supabase } from '@/lib/supabase';
import type { Lead } from '@/types';
import { X, Maximize2, Minimize2, VideoOff, FileText, Clock } from 'lucide-react';
interface Props{lead:Lead;agente?:{id?:string;nombre?:string;email?:string};onClose:()=>void;}
export default function VideoMeeting({lead,agente,onClose}:Props) {
  const [expanded,setExpanded]=useState(false), [connected,setConnected]=useState(false);
  const [notes,setNotes]=useState(''), [startTime]=useState(Date.now()), [elapsed,setElapsed]=useState('00:00');
  const roomName=`crm-colmena-${lead.id.replace(/-/g,'')}`;
  const startTimer=useCallback(()=>{
    const iv=setInterval(()=>{const s=Math.floor((Date.now()-startTime)/1000);setElapsed(`${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`);},1000);
    return()=>clearInterval(iv);
  },[startTime]);
  const handleHangUp=useCallback(async()=>{
    const min=Math.ceil((Date.now()-startTime)/60000);
    await supabase.from('interacciones').insert({lead_id:lead.id,agente_id:agente?.id,tipo:'videollamada',notas:notes||null,duracion_min:min,sala_jitsi:roomName});
    onClose();
  },[lead.id,agente?.id,notes,roomName,startTime,onClose]);
  return (
    <div className={`fixed z-50 bg-gray-950 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${expanded?'inset-4':'bottom-6 right-6 w-[520px] h-[440px]'}`}>
      <div className="flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <span className={`w-2 h-2 rounded-full ${connected?'bg-green-400 animate-pulse':'bg-gray-500'}`}/>
          <span className="text-sm font-semibold text-gray-100">{lead.nombre} {lead.apellido}</span>
          {connected&&<span className="flex items-center gap-1 text-xs text-gray-400 bg-gray-800 px-2 py-0.5 rounded-full"><Clock size={10}/>{elapsed}</span>}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={()=>setExpanded(v=>!v)} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-100 hover:bg-gray-700 transition-all" aria-label="Expandir">{expanded?<Minimize2 size={15}/>:<Maximize2 size={15}/>}</button>
          <button onClick={handleHangUp} className="p-1.5 rounded-lg text-red-400 hover:bg-red-900/40 transition-all" aria-label="Colgar"><X size={15}/></button>
        </div>
      </div>
      <div className={`flex h-[calc(100%-52px)] ${expanded?'flex-row':'flex-col'}`}>
        <div className={`relative bg-black ${expanded?'flex-1':'h-60'}`}>
          <JitsiMeeting domain="meet.jit.si" roomName={roomName}
            configOverwrite={{startWithAudioMuted:true,prejoinPageEnabled:false,disableModeratorIndicator:true}}
            interfaceConfigOverwrite={{SHOW_JITSI_WATERMARK:false,SHOW_BRAND_WATERMARK:false,MOBILE_APP_PROMO:false}}
            userInfo={{displayName:agente?.nombre||'Agente Colmena',email:agente?.email||''}}
            onApiReady={api=>{setConnected(true);const stop=startTimer();api.addEventListeners({readyToClose:()=>{stop();handleHangUp();},videoConferenceLeft:handleHangUp});}}
            getIFrameRef={iframe=>{iframe.style.width='100%';iframe.style.height='100%';iframe.style.border='none';}}/>
          <div className="absolute top-3 left-3 bg-black/60 text-white text-[10px] px-2 py-1 rounded-full font-mono">{roomName}</div>
        </div>
        <div className={`flex flex-col bg-gray-900 ${expanded?'w-72 border-l border-gray-800':'flex-1'}`}>
          <div className="flex items-center gap-2 px-3 pt-3 pb-2 border-b border-gray-800"><FileText size={13} className="text-gray-400"/><span className="text-xs font-semibold text-gray-300">Notas</span></div>
          <textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Escribe notas durante la llamada..." className="flex-1 resize-none bg-transparent text-xs text-gray-300 placeholder-gray-600 p-3 focus:outline-none leading-relaxed"/>
          <div className="p-2 border-t border-gray-800">
            <button onClick={handleHangUp} className="w-full py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2"><VideoOff size={13}/>Colgar y guardar notas</button>
          </div>
        </div>
      </div>
    </div>
  );
}