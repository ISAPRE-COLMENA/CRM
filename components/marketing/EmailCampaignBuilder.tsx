'use client';

import { useState } from 'react';
import { Send, Users, FileText, Image as ImageIcon, Eye, Loader2, CheckCircle2 } from 'lucide-react';
import { useLeads } from '@/hooks/useLeads';

import { sendCampaignAction } from '@/lib/actions/marketing';

export default function EmailCampaignBuilder() {
  const { leads } = useLeads();
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [audience, setAudience] = useState('all');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const filteredLeads = audience === 'all' 
    ? leads 
    : leads.filter(l => l.stage === audience);

  const handleSend = async () => {
    if (!subject || !content || filteredLeads.length === 0) return;
    setStatus('sending');
    
    try {
      const result = await sendCampaignAction({
        subject,
        content,
        leads: filteredLeads.map(l => ({ 
          email: l.email || '', 
          name: `${l.nombre} ${l.apellido}`.trim() 
        }))
      });

      if (result.success) {
        setStatus('sent');
        setTimeout(() => setStatus('idle'), 3000);
      } else {
        alert('Error al enviar: ' + result.error);
        setStatus('idle');
      }
    } catch (error) {
      alert('Error inesperado al enviar la campaña');
      setStatus('idle');
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8 items-start">
      {/* Columna Izquierda: Editor */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-gray-800 space-y-8">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Nueva Campaña de Mail</h2>
          <p className="text-sm text-gray-500">Diseña y envía correos masivos a tus prospectos.</p>
        </div>

        <div className="space-y-5">
          {/* Audiencia */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Users size={16} className="text-blue-500" /> Destinatarios
            </label>
            <select 
              value={audience} 
              onChange={e => setAudience(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            >
              <option value="all">Todos los leads ({leads.length})</option>
              <option value="nuevo">Nuevos</option>
              <option value="contactado">Contactados</option>
              <option value="evaluacion">En Evaluación</option>
            </select>
            <p className="text-xs text-blue-600 font-medium ml-1">
              Se enviará a {filteredLeads.length} contacto(s).
            </p>
          </div>

          {/* Asunto */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <FileText size={16} className="text-blue-500" /> Asunto del Correo
            </label>
            <input 
              type="text" 
              placeholder="Ej: Descubre tu nuevo plan Colmena..."
              value={subject}
              onChange={e => setSubject(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>

          {/* Contenido */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <ImageIcon size={16} className="text-blue-500" /> Mensaje Principal
            </label>
            <textarea 
              rows={6}
              placeholder="Escribe el cuerpo del correo aquí. Puedes usar variables como {{nombre}} pronto..."
              value={content}
              onChange={e => setContent(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white resize-none"
            />
          </div>
        </div>

        <button 
          onClick={handleSend}
          disabled={status !== 'idle' || !subject || !content || filteredLeads.length === 0}
          className="w-full bg-[#0076B8] hover:bg-blue-700 text-white font-bold rounded-2xl py-4 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-200 dark:shadow-none"
        >
          {status === 'idle' && <><Send size={20} /> Enviar Campaña</>}
          {status === 'sending' && <><Loader2 size={20} className="animate-spin" /> Enviando a {filteredLeads.length} leads...</>}
          {status === 'sent' && <><CheckCircle2 size={20} /> ¡Campaña Enviada!</>}
        </button>
      </div>

      {/* Columna Derecha: Previsualización en Vivo */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-3xl p-6 md:p-8 border border-gray-200/50 dark:border-gray-700/50 flex flex-col items-center justify-center min-h-[600px] relative">
        <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-full border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-500">
          <Eye size={14} /> Vista Previa
        </div>

        {/* Simulación de Cliente de Correo */}
        <div className="w-full max-w-sm bg-white border border-gray-100 shadow-2xl rounded-t-xl rounded-b-3xl overflow-hidden flex flex-col transition-all">
          <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
            <p className="text-[10px] font-bold text-gray-400 uppercase">De: Isapre Colmena &lt;ventas@colmena.cl&gt;</p>
            <p className="text-sm font-semibold text-gray-800 truncate mt-0.5">{subject || 'Asunto del correo...'}</p>
          </div>
          
          <div className="p-6 bg-white space-y-6">
            {/* Header Isapre Colmena */}
            <div className="flex justify-center">
              <div className="w-12 h-12 rounded-xl bg-[#0076B8] flex items-center justify-center">
                <div className="relative w-6 h-6">
                    <div className="absolute inset-0 border-2 border-white rounded-md rotate-45" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-white rounded-full" />
                    </div>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 text-center">¡Hola!</h3>
              <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed text-center">
                {content || 'Aquí se mostrará el cuerpo de tu mensaje. Se adapta automáticamente al formato profesional corporativo.'}
              </p>
            </div>

            {/* CTA Button */}
            <div className="pt-4 flex justify-center">
              <div className="bg-[#0076B8] text-white text-sm font-bold px-6 py-3 rounded-xl shadow-md">
                Conoce tus beneficios
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 mt-6 text-center">
              <p className="text-[10px] text-gray-400">
                © {new Date().getFullYear()} Isapre Colmena.<br/>Todos los derechos reservados.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
