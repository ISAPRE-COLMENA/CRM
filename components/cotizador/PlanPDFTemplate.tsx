'use client';
import { ShieldCheck, CheckCircle2, Zap, HeartPulse, Activity, Star, Info, X } from 'lucide-react';

interface PDFMockupProps {
  planName: string;
  totalUf: number;
  totalClp: number;
  members: any[];
  selectedBenefits: string[];
  benefitsTotal: number;
  onClose: () => void;
}

const BENEFICIOS_INFO = [
  { id: 'telemed', label: 'Doctor Online Pro', cost: 0.19 },
  { id: 'farma', label: 'Pharma Max', cost: 0.17 },
  { id: 'dental', label: 'Dental Plus', cost: 0.19 },
  { id: 'urgencia', label: 'Urgencia Ambulatoria', cost: 0.17 },
  { id: 'catastrofico', label: 'Catastrófico LE', cost: 0.14 }
];

export default function PlanPDFTemplate({ 
  planName, 
  totalUf, 
  totalClp, 
  members, 
  selectedBenefits, 
  benefitsTotal, 
  onClose 
}: PDFMockupProps) {
  return (
    <div className="fixed inset-0 z-[200] bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 lg:p-8 overflow-y-auto">
      <div className="bg-white w-full max-w-[850px] min-h-[1100px] my-auto p-12 shadow-2xl rounded-[3rem] border border-gray-100 font-sans text-gray-900 overflow-hidden relative animate-in zoom-in-95 duration-300">
        
        {/* Botón Cerrar */}
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 p-3 bg-gray-100 hover:bg-red-50 hover:text-red-500 rounded-2xl transition-all z-[210]"
        >
          <X size={20} />
        </button>

        {/* Marca de Agua / Decoración */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-50 rounded-full blur-3xl opacity-50" />
        <div className="absolute top-40 -left-20 w-60 h-60 bg-indigo-50 rounded-full blur-3xl opacity-30" />

        {/* Header */}
        <div className="flex justify-between items-start relative z-10 border-b-2 border-gray-50 pb-10 mb-10">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
                <ShieldCheck className="text-white" size={24} />
              </div>
              <h1 className="text-3xl font-black tracking-tighter text-blue-900 uppercase">Propuesta Colmena</h1>
            </div>
            <p className="text-sm font-bold text-gray-400">Generado el {new Date().toLocaleDateString('es-CL')}</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-black text-blue-600 uppercase tracking-widest">Ejecutivo de Ventas</p>
            <p className="text-lg font-black text-gray-900">Mauricio Becerra</p>
            <p className="text-sm text-gray-400">Ventas Isapre Colmena</p>
          </div>
        </div>

        {/* Cuerpo Principal */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 relative z-10">
          
          {/* Lado Izquierdo: Resumen y Valores */}
          <div className="md:col-span-7 space-y-8">
            <div className="space-y-4">
              <span className="px-4 py-1.5 bg-blue-600 text-white text-[10px] font-black rounded-full uppercase tracking-widest">Plan Recomendado</span>
              <h2 className="text-5xl font-black tracking-tighter leading-none text-gray-900 uppercase">{planName}</h2>
            </div>

            {/* Tarjeta de Precio */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[2.5rem] text-white shadow-xl shadow-blue-200">
              <p className="text-xs font-black text-white/60 uppercase tracking-widest mb-2">Inversión Mensual Final</p>
              <div className="flex items-end gap-3 mb-1">
                <span className="text-6xl font-black tracking-tighter leading-none">{totalUf.toFixed(2)}</span>
                <span className="text-2xl font-bold mb-1">UF</span>
              </div>
              <p className="text-2xl font-bold text-white/80">
                {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(totalClp)}
              </p>
            </div>

            {/* Desglose de Grupo */}
            <div className="space-y-4">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <CheckCircle2 size={14} className="text-blue-500" /> Cobertura Grupo Familiar
              </h3>
              <div className="bg-gray-50 rounded-3xl p-6 space-y-3">
                {members.map((m, i) => (
                  <div key={i} className="flex justify-between items-center text-sm">
                    <div className="flex flex-col">
                      <span className="font-bold capitalize">{m.type}</span>
                      <span className="text-[10px] text-gray-400">{m.age} años • {m.gender}</span>
                    </div>
                    <span className="font-black text-gray-700">{m.costUf.toFixed(3)} UF</span>
                  </div>
                ))}
                {selectedBenefits.length > 0 && (
                  <div className="pt-3 border-t border-gray-100 space-y-2">
                    <p className="text-[10px] font-black text-blue-600 uppercase">Productos Adicionales</p>
                    {selectedBenefits.map(id => {
                      const b = BENEFICIOS_INFO.find(x => x.id === id);
                      const totalBeneficio = (b?.cost || 0) * members.length;
                      return (
                        <div key={id} className="flex justify-between items-center text-xs text-gray-500">
                          <span>{b?.label} ({members.length} pers.)</span>
                          <span className="font-bold">{totalBeneficio.toFixed(2)} UF</span>
                        </div>
                      );
                    })}
                  </div>
                )}
                <div className="pt-3 border-t border-gray-200 flex justify-between font-black text-blue-900 text-lg">
                  <span>Total Final</span>
                  <span>{totalUf.toFixed(3)} UF</span>
                </div>
              </div>
            </div>
          </div>

          {/* Lado Derecho: Beneficios y Promos */}
          <div className="md:col-span-5 space-y-6">
              {selectedBenefits.length > 0 ? (
                <div className="bg-indigo-50 p-6 rounded-[2rem] border border-indigo-100 space-y-4">
                  <h3 className="text-sm font-black text-indigo-900 uppercase tracking-tight flex items-center gap-2">
                    <Star size={16} className="fill-indigo-600 text-indigo-600" /> Beneficios Incluidos
                  </h3>
                  <ul className="space-y-4">
                    {selectedBenefits.map(id => {
                      const b = BENEFICIOS_INFO.find(x => x.id === id);
                      return (
                        <li key={id} className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm shrink-0">
                            <CheckCircle2 size={14} className="text-indigo-600" />
                          </div>
                          <span className="text-xs font-bold text-indigo-900">{b?.label}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : (
                <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100 text-center">
                  <p className="text-xs font-bold text-gray-400 italic">No se incluyeron productos adicionales en esta propuesta.</p>
                </div>
              )}

              <div className="bg-blue-600 p-6 rounded-[2rem] text-white space-y-4 shadow-xl shadow-blue-200">
              <h3 className="text-sm font-black uppercase tracking-tight">Promoción del Mes</h3>
              <p className="text-xs font-medium leading-relaxed opacity-95">
                Contrata este mes y obtén un **20% de descuento** en Farmacias Ahumada por 6 meses y limpieza dental gratis.
              </p>
              <div className="pt-2">
                <span className="px-3 py-1.5 bg-white/20 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/30">¡Válido Hoy!</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-5 bg-gray-50 rounded-[1.5rem] border border-gray-100">
              <Info size={18} className="text-blue-500 shrink-0" />
              <p className="text-[9px] text-gray-500 leading-relaxed italic">
                *Esta propuesta es de carácter informativo, válida por 5 días hábiles y sujeta a evaluación de antecedentes y declaración de salud.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-gray-100 flex justify-between items-center relative z-10">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                <ShieldCheck size={16} />
             </div>
             <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">Isapre Colmena - Documento Oficial</p>
          </div>
          <p className="text-[10px] font-bold text-blue-600 underline">colmena.cl</p>
        </div>
      </div>
    </div>
  );
}
