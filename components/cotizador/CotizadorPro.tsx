'use client';
import { useState, useMemo } from 'react';
import { Award, Users, MapPin, Sparkles, ChevronRight, Info, CheckCircle2, TrendingUp, Search, Filter, Shield, Activity, DollarSign } from 'lucide-react';
import { PLANES, getFactor, GES_VALUE, REGIONES, Plan } from '@/lib/planData';

export default function CotizadorPro() {
  const [titularEdad, setTitularEdad] = useState(30);
  const [cargas, setCargas] = useState<number[]>([]);
  const [region, setRegion] = useState('RM');
  const [ufValue, setUfValue] = useState(37800);
  const [search, setSearch] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState('TODOS');

  const addCarga = () => setCargas([...cargas, 25]);
  const removeCarga = (index: number) => setCargas(cargas.filter((_, i) => i !== index));
  const updateCarga = (index: number, edad: number) => {
    const newCargas = [...cargas];
    newCargas[index] = edad;
    setCargas(newCargas);
  };

  const filteredResults = useMemo(() => {
    const factorTitular = getFactor(titularEdad, true);
    const totalIntegrantes = 1 + cargas.length;
    const gesTotal = totalIntegrantes * GES_VALUE;

    return PLANES
      .filter(p => {
        const matchesSearch = p.nombre.toLowerCase().includes(search.toLowerCase());
        const matchesRegion = p.region === region;
        const matchesTipo = tipoFiltro === 'TODOS' || p.tipo.toUpperCase().includes(tipoFiltro);
        return matchesSearch && matchesRegion && matchesTipo;
      })
      .map(plan => {
        const pb = totalIntegrantes > 1 ? plan.pbGrupal : plan.pbIndividual;
        const costoTitular = factorTitular * pb;
        const costoCargas = cargas.reduce((acc, edad) => acc + (getFactor(edad, false) * pb), 0);
        
        const totalUf = costoTitular + costoCargas + gesTotal;
        const totalClp = totalUf * ufValue;

        return {
          ...plan,
          totalUf,
          totalClp,
          factorTitular,
          pbAplicado: pb
        };
      })
      .sort((a, b) => a.totalUf - b.totalUf);
  }, [titularEdad, cargas, region, ufValue, search, tipoFiltro]);

  const bestPlan = filteredResults[0];

  return (
    <div className="max-w-[1600px] mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      {/* Header Pro */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200">
              <Activity className="text-white" size={24} />
            </div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Cotizador Pro Isapre</h1>
          </div>
          <p className="text-gray-500 font-medium ml-14">Herramienta técnica de ventas - Datos actualizados Abril 2026</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 px-6 py-3 rounded-2xl border border-blue-100 dark:border-blue-800 flex items-center gap-3">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Valor UF Hoy</span>
              <input 
                type="number" 
                value={ufValue} 
                onChange={(e) => setUfValue(Number(e.target.value))}
                className="bg-transparent font-black text-blue-700 dark:text-blue-400 text-xl w-24 outline-none"
              />
            </div>
            <DollarSign className="text-blue-400" size={20} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Panel de Configuración Técnica */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-gray-900 p-8 rounded-[3rem] shadow-xl border border-gray-100 dark:border-gray-800 space-y-8 sticky top-24">
            <h2 className="text-lg font-black flex items-center gap-2">
              <Filter size={20} className="text-blue-600" /> Perfil del Prospecto
            </h2>

            {/* Region */}
            <div className="space-y-4">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Región de Residencia</label>
              <div className="grid grid-cols-1 gap-2">
                {REGIONES.map(r => (
                  <button
                    key={r.id}
                    onClick={() => setRegion(r.id)}
                    className={`flex items-center justify-between px-5 py-4 rounded-2xl text-sm font-bold border-2 transition-all ${region === r.id ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-md shadow-blue-100' : 'border-gray-50 bg-gray-50 text-gray-400 hover:border-gray-200'}`}
                  >
                    <span>{r.label}</span>
                    {region === r.id && <CheckCircle2 size={18} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Edades */}
            <div className="space-y-4 pt-4 border-t border-gray-50 dark:border-gray-800">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Composición y Edades</label>
              <div className="space-y-3">
                <div className="group bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border border-transparent hover:border-blue-200 transition-all flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-700 flex items-center justify-center shadow-sm">
                      <Shield className="text-blue-600" size={18} />
                    </div>
                    <span className="text-sm font-bold">Titular</span>
                  </div>
                  <input 
                    type="number" 
                    value={titularEdad} 
                    onChange={(e) => setTitularEdad(Number(e.target.value))}
                    className="w-16 bg-white dark:bg-gray-700 border-none rounded-xl p-2 text-center font-black text-blue-600"
                  />
                </div>

                {cargas.map((edad, idx) => (
                  <div key={idx} className="bg-indigo-50/50 dark:bg-indigo-900/10 p-4 rounded-2xl flex items-center justify-between animate-in slide-in-from-left duration-300">
                    <div className="flex items-center gap-3">
                      <button onClick={() => removeCarga(idx)} className="w-8 h-8 rounded-lg bg-white dark:bg-gray-800 text-red-500 flex items-center justify-center hover:bg-red-50 transition-colors shadow-sm">
                        <X size={14} />
                      </button>
                      <span className="text-sm font-bold text-indigo-700">Carga {idx + 1}</span>
                    </div>
                    <input 
                      type="number" 
                      value={edad} 
                      onChange={(e) => updateCarga(idx, Number(e.target.value))}
                      className="w-16 bg-white dark:bg-gray-700 border-none rounded-xl p-2 text-center font-black text-indigo-600"
                    />
                  </div>
                ))}

                <button 
                  onClick={addCarga}
                  className="w-full py-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl text-xs font-black text-gray-400 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50 transition-all uppercase tracking-widest"
                >
                  + Añadir Carga Familiar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Panel de Resultados de Venta */}
        <div className="lg:col-span-8 space-y-8">
          {/* IA Sugerencia Pro */}
          {bestPlan && (
            <div className="bg-gradient-to-br from-gray-900 to-blue-900 p-10 rounded-[3.5rem] text-white shadow-2xl shadow-blue-900/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform duration-700">
                <Sparkles size={160} />
              </div>
              <div className="relative z-10 space-y-8">
                <div className="flex items-center gap-3 px-4 py-1.5 bg-blue-500/20 border border-blue-400/30 rounded-full w-fit">
                  <Sparkles size={16} className="text-blue-400" />
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-blue-300">Análisis Comercial IA</span>
                </div>
                
                <div className="flex flex-col md:flex-row justify-between gap-8 items-end">
                  <div className="space-y-4 flex-1">
                    <h3 className="text-5xl font-black leading-tight">{bestPlan.nombre}</h3>
                    <div className="flex flex-wrap gap-3">
                      <div className="px-4 py-2 bg-white/10 rounded-xl text-xs font-bold backdrop-blur-md">Plan {bestPlan.tipo}</div>
                      <div className="px-4 py-2 bg-white/10 rounded-xl text-xs font-bold backdrop-blur-md">Factor {bestPlan.factorTitular}</div>
                      <div className="px-4 py-2 bg-white/10 rounded-xl text-xs font-bold backdrop-blur-md">PB {bestPlan.pbAplicado}</div>
                    </div>
                    <p className="text-blue-100/70 text-sm font-medium leading-relaxed max-w-xl">
                      Recomendación: Este plan es el más rentable para este perfil. Su red hospitalaria incluye <span className="text-white font-bold">{bestPlan.coberturaHosp}</span> y ofrece la mejor tasa de hospitalización/precio.
                    </p>
                  </div>
                  
                  <div className="bg-white p-8 rounded-[2.5rem] text-gray-900 shadow-xl min-w-[280px] text-center transform hover:scale-105 transition-transform">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Precio Final Sugerido</p>
                    <div className="text-5xl font-black tabular-nums">{bestPlan.totalUf.toFixed(2)}<span className="text-xl ml-1">UF</span></div>
                    <p className="text-lg font-bold text-blue-600 mt-2">
                      {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(bestPlan.totalClp)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Listado Técnico de Planes */}
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.3em]">Catálogo Isapre Colmena ({filteredResults.length})</h3>
              
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="text"
                    placeholder="Buscar plan..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-12 pr-6 py-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none w-64"
                  />
                </div>
                <select 
                  value={tipoFiltro}
                  onChange={(e) => setTipoFiltro(e.target.value)}
                  className="px-4 py-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl text-sm font-bold outline-none"
                >
                  <option value="TODOS">Todos</option>
                  <option value="STAR">Star</option>
                  <option value="SILVER">Silver</option>
                  <option value="GOLD">Gold</option>
                  <option value="MAX">Max</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {filteredResults.slice(1, 15).map((plan, idx) => (
                <div key={idx} className="group bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <Award size={28} />
                    </div>
                    <div className="space-y-1">
                      <p className="text-lg font-black text-gray-900 dark:text-white">{plan.nombre}</p>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black uppercase bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md text-gray-500">{plan.tipo}</span>
                        <span className="text-[10px] font-bold text-gray-400">{plan.coberturaHosp.slice(0, 50)}...</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-8 text-right">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase text-gray-400">Cobertura</p>
                      <div className="flex items-center gap-2 justify-end">
                        <div className="flex flex-col items-end">
                          <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Med. {plan.topeAnualMed}</span>
                          <span className="text-xs font-bold text-blue-600">Cons. {plan.consultaPref}</span>
                        </div>
                      </div>
                    </div>
                    <div className="min-w-[120px]">
                      <p className="text-2xl font-black text-gray-900 dark:text-white tabular-nums">{plan.totalUf.toFixed(2)}<span className="text-sm ml-1 text-gray-400">UF</span></p>
                      <p className="text-xs font-bold text-gray-400">
                        {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(plan.totalClp)}
                      </p>
                    </div>
                    <button className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <p className="text-center text-gray-400 text-xs font-bold py-8 uppercase tracking-widest">Se muestran los 15 planes más competitivos</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function X({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
    </svg>
  );
}
