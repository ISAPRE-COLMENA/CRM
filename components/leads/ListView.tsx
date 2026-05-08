'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import type { Lead } from '@/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ListViewProps {
  leads: Lead[];
  onLeadClick: (lead: Lead) => void;
}

const STAGES = [
  { id: 'nuevo', label: 'Sin Gestión' },
  { id: 'contactado', label: 'Próximo Llamado' },
  { id: 'evaluacion', label: 'Próxima Reunión' },
  { id: 'cierre', label: 'Decisión Pendiente' },
  { id: 'no_interesado', label: 'No Interesado' }
];

export default function ListView({ leads, onLeadClick }: ListViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStage, setSelectedStage] = useState<string | null>(null);

  const filteredLeads = leads.filter(l => {
    const matchesSearch = 
      l.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.rut.includes(searchTerm);
    
    const matchesStage = selectedStage ? l.stage === selectedStage : true;
    
    return matchesSearch && matchesStage;
  });

  const getDaysSinceCreation = (dateStr?: string) => {
    if (!dateStr) return 0;
    const diffTime = Math.abs(new Date().getTime() - new Date(dateStr).getTime());
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

  const getMetricsForStage = (stageId: string) => {
    const stageLeads = leads.filter(l => l.stage === stageId);
    const total = stageLeads.length;
    // Lógica de colores: Rojo (más de 2 días), Verde (0-2 días)
    const red = stageLeads.filter(l => getDaysSinceCreation(l.created_at) > 2).length;
    const green = stageLeads.filter(l => getDaysSinceCreation(l.created_at) <= 2).length;
    return { red, green, total };
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 items-start mt-6 animate-in fade-in duration-300">
      
      {/* Sidebar: Dashboard de Estados */}
      <div className="w-full md:w-72 flex-shrink-0 space-y-4">
        
        <button 
          onClick={() => setSelectedStage(null)}
          className={`w-full py-3 rounded-xl font-bold text-sm shadow-md transition-all ${
            selectedStage === null 
            ? 'bg-[#004A8F] text-white' 
            : 'bg-white text-[#004A8F] hover:bg-blue-50 border border-blue-100'
          }`}
        >
          TODOS LOS PROSPECTOS
        </button>

        {/* Buscador */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-[#004A8F] py-2 px-4 text-center">
            <span className="text-white text-xs font-bold uppercase tracking-wider">Buscar</span>
          </div>
          <div className="p-3 relative">
            <input 
              type="text" 
              placeholder="Buscar RUT o Nombre..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-3 pr-10 py-2 border-b-2 border-gray-200 focus:border-[#004A8F] outline-none text-sm bg-transparent"
            />
            <Search size={18} className="absolute right-4 top-4 text-gray-400" />
          </div>
        </div>

        {/* Bloques de Estado */}
        {STAGES.map(stage => {
          const metrics = getMetricsForStage(stage.id);
          const isSelected = selectedStage === stage.id;
          
          return (
            <div 
              key={stage.id} 
              onClick={() => setSelectedStage(stage.id)}
              className={`bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer transition-all border-2 ${
                isSelected ? 'border-[#004A8F] scale-[1.02]' : 'border-transparent hover:border-blue-200'
              }`}
            >
              <div className="bg-[#004A8F] py-2.5 px-4 text-center">
                <span className="text-white text-xs font-bold uppercase tracking-wider">{stage.label}</span>
              </div>
              <div className="grid grid-cols-3 divide-x divide-gray-100 bg-white p-3">
                <div className="flex justify-center items-center">
                  <div className="w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center text-xs font-bold shadow-inner">
                    {metrics.red}
                  </div>
                </div>
                <div className="flex justify-center items-center">
                  <div className="w-7 h-7 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold shadow-inner">
                    {metrics.green}
                  </div>
                </div>
                <div className="flex justify-center items-center">
                  <div className="w-7 h-7 rounded-full bg-gray-500 text-white flex items-center justify-center text-xs font-bold shadow-inner">
                    {metrics.total}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabla Central */}
      <div className="flex-1 w-full bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold uppercase text-xs tracking-wider">
                <th className="px-6 py-4">RUT / ID</th>
                <th className="px-6 py-4">Nombre Completo</th>
                <th className="px-6 py-4">Estado Original</th>
                <th className="px-6 py-4 text-center">Fecha de Creación</th>
                <th className="px-6 py-4 text-center">Días</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500 font-medium">
                    No se encontraron prospectos en esta vista.
                  </td>
                </tr>
              ) : (
                filteredLeads.map(lead => {
                  const days = getDaysSinceCreation(lead.created_at);
                  const isRed = days > 2;
                  
                  return (
                    <tr 
                      key={lead.id} 
                      onClick={() => onLeadClick(lead)}
                      className="hover:bg-blue-50/50 cursor-pointer transition-colors group"
                    >
                      <td className="px-6 py-4 text-gray-500 text-xs font-mono">{lead.rut}</td>
                      <td className="px-6 py-4 font-bold text-[#004A8F] group-hover:text-blue-700">
                        {lead.nombre} {lead.apellido}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg uppercase font-semibold">
                          {lead.stage}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-gray-500">
                        {lead.created_at ? format(new Date(lead.created_at), 'dd-MM-yyyy', { locale: es }) : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className={`mx-auto w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                          isRed ? 'bg-red-500' : 'bg-gray-500'
                        }`}>
                          {days}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
}
