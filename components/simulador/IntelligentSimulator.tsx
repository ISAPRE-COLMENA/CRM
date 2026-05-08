'use client';
import { useState, useMemo } from 'react';
import { Award, Users, MapPin, Sparkles, ChevronRight, Info, CheckCircle2, TrendingDown, X } from 'lucide-react';
import { PLANES, getFactor, GES_VALUE, REGIONES } from '@/lib/planData';

export default function IntelligentSimulator({ onClose }: { onClose: () => void }) {
  const [titularEdad, setTitularEdad] = useState(30);
  const [cargas, setCargas] = useState<number[]>([]);
  const [region, setRegion] = useState('RM');
  const [ufValue, setUfValue] = useState(37000);

  const addCarga = () => setCargas([...cargas, 25]);
  const removeCarga = (index: number) => setCargas(cargas.filter((_, i) => i !== index));
  const updateCarga = (index: number, edad: number) => {
    const newCargas = [...cargas];
    newCargas[index] = edad;
    setCargas(newCargas);
  };

  const results = useMemo(() => {
    const factorTitular = getFactor(titularEdad, true);
    const totalIntegrantes = 1 + cargas.length;
    const gesTotal = totalIntegrantes * GES_VALUE;

    return PLANES
      .filter(p => p.region === region)
      .map(plan => {
        const pb = totalIntegrantes > 1 ? plan.pbGrupal : plan.pbIndividual;
        const costoTitular = factorTitular * pb;
        const costoCargas = cargas.reduce((acc, edad) => acc + (getFactor(edad, false) * pb), 0);
        
        const totalUf = costoTitular + costoCargas + gesTotal;
        const totalClp = totalUf * ufValue;

        return {
          ...plan,
          totalUf,
          totalClp
        };
      })
      .sort((a, b) => a.totalUf - b.totalUf);
  }, [titularEdad, cargas, region, ufValue]);

  const bestPlan = results[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto border border-white/20 relative">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-gray-100 hover:bg-red-50 text-gray-500 hover:text-red-500 transition-all z-10"
        >
          <X size={24} />
        </button>

        <div className="p-8 space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                <Sparkles className="text-blue-600" /> Simulador Inteligente
              </h1>
              <p className="text-gray-500 font-medium">Encuentra el plan ideal para tu cliente usando IA comercial</p>
            </div>
            <div className="flex items-center gap-3 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-2xl border border-blue-100 dark:border-blue-800">
              <span className="text-xs font-bold text-blue-600 uppercase">Valor UF</span>
              <input 
                type="number" 
                value={ufValue} 
                onChange={(e) => setUfValue(Number(e.target.value))}
                className="bg-transparent font-bold text-blue-700 dark:text-blue-400 w-20 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white dark:bg-gray-900 p-6 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 space-y-6">
                <div className="space-y-4">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300">
                    <MapPin size={18} className="text-blue-500" /> Ubicación
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {REGIONES.map(r => (
                      <button
                        key={r.id}
                        onClick={() => setRegion(r.id)}
                        className={`px-4 py-3 rounded-xl text-sm font-bold border-2 transition-all ${region === r.id ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-50 bg-gray-50 text-gray-400'}`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-gray-50 dark:border-gray-800">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300">
                    <Users size={18} className="text-blue-500" /> Cargas Familiares
                  </label>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                      <span className="text-xs font-bold">Titular (Edad)</span>
                      <input 
                        type="number" 
                        value={titularEdad} 
                        onChange={(e) => setTitularEdad(Number(e.target.value))}
                        className="w-16 bg-white dark:bg-gray-700 border-none rounded-lg p-1 text-center font-bold"
                      />
                    </div>

                    {cargas.map((edad, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-blue-50/50 dark:bg-blue-900/10 rounded-xl">
                        <div className="flex items-center gap-2">
                          <button onClick={() => removeCarga(idx)} className="text-red-500 hover:bg-red-50 p-1 rounded-md"><X size={14} /></button>
                          <span className="text-xs font-bold">Carga {idx + 1}</span>
                        </div>
                        <input 
                          type="number" 
                          value={edad} 
                          onChange={(e) => updateCarga(idx, Number(e.target.value))}
                          className="w-16 bg-white dark:bg-gray-700 border-none rounded-lg p-1 text-center font-bold"
                        />
                      </div>
                    ))}

                    <button 
                      onClick={addCarga}
                      className="w-full py-3 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-all"
                    >
                      + Agregar Carga
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-6">
              {bestPlan && (
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-[2px] rounded-[2.5rem] shadow-xl shadow-blue-500/20 animate-in slide-in-from-bottom-4 duration-500">
                  <div className="bg-white dark:bg-gray-900 rounded-[2.45rem] p-8">
                    <div className="flex flex-col md:flex-row justify-between gap-6">
                      <div className="space-y-4 flex-1">
                        <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full w-fit">
                          <Sparkles size={14} />
                          <span className="text-[10px] font-black uppercase tracking-wider">Sugerencia del Agente</span>
                        </div>
                        <h2 className="text-4xl font-black text-gray-900 dark:text-white leading-tight">{bestPlan.nombre}</h2>
                        <p className="text-gray-500 text-sm leading-relaxed">{bestPlan.cobertura}</p>
                      </div>
                      <div className="md:w-64 space-y-4 text-center">
                        <div className="bg-blue-600 text-white p-6 rounded-3xl shadow-lg">
                          <p className="text-xs font-bold uppercase opacity-80 mb-1">Costo Estimado</p>
                          <h3 className="text-3xl font-black">{bestPlan.totalUf.toFixed(2)} UF</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="space-y-3">
                {results.slice(1).map((plan, idx) => (
                  <div key={idx} className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">{plan.nombre}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">{plan.tipo}</p>
                    </div>
                    <p className="font-black text-gray-900 dark:text-white">{plan.totalUf.toFixed(2)} UF</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
