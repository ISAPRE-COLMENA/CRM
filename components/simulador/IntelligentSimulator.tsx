'use client';
import { useState, useMemo, useEffect } from 'react';
import { 
  Award, 
  Users, 
  MapPin, 
  Sparkles, 
  CheckCircle2, 
  X, 
  ChevronRight, 
  Info, 
  ArrowRight,
  ShieldCheck,
  Calculator,
  Stethoscope,
  Building2,
  Table as TableIcon,
  HeartPulse,
  Truck,
  Plus,
  BookmarkCheck,
  Zap,
  Building,
  FileText,
  ExternalLink,
  Download
} from 'lucide-react';
import { PLANES, getFactor, GES_VALUE, REGIONES, Plan } from '@/lib/planData';

interface DetailedCost {
  label: string;
  age: number;
  factor: number;
  pb: number;
  totalUf: number;
}

const BENEFICIOS_ADICIONALES = [
  { id: 'seguro-cesantia', label: 'Seguro de Cesantía (1 año)', icon: <ShieldCheck size={14} />, description: 'Cubre el pago del plan por hasta 4 meses en caso de desempleo.' },
  { id: 'orientacion-medica', label: 'Telemedicina 24/7 Gratis', icon: <HeartPulse size={14} />, description: 'Consultas médicas ilimitadas por videollamada sin costo.' },
  { id: 'asistencia-viaje', label: 'Asistencia en Viajes Nac/Int', icon: <Truck size={14} />, description: 'Cobertura de urgencias médicas fuera de tu región o país.' },
  { id: 'dental-preventivo', label: 'Dental Preventivo Premium', icon: <Stethoscope size={14} />, description: 'Limpiezas y chequeos anuales gratuitos para todo el grupo.' }
];

export default function IntelligentSimulator({ onClose }: { onClose: () => void }) {
  const [titularEdad, setTitularEdad] = useState(30);
  const [cargas, setCargas] = useState<number[]>([]);
  const [region, setRegion] = useState('RM');
  const [ufValue, setUfValue] = useState(37800);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [selectedBenefits, setSelectedBenefits] = useState<string[]>([]);
  const [isLoadingUf, setIsLoadingUf] = useState(false);

  // Fetch UF al día
  useEffect(() => {
    const fetchUF = async () => {
      setIsLoadingUf(true);
      try {
        const res = await fetch('https://mindicador.cl/api/uf');
        const data = await res.json();
        if (data.serie && data.serie[0]) {
          setUfValue(data.serie[0].valor);
        }
      } catch (err) {
        console.error("Error fetching UF:", err);
      } finally {
        setIsLoadingUf(false);
      }
    };
    fetchUF();
  }, []);

  const toggleBenefit = (id: string) => {
    setSelectedBenefits(prev => 
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    );
  };

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
        
        const cargasDetalle: DetailedCost[] = cargas.map((edad, i) => {
          const f = getFactor(edad, false);
          return {
            label: `Carga ${i + 1}`,
            age: edad,
            factor: f,
            pb: pb,
            totalUf: f * pb
          };
        });

        const costoCargas = cargasDetalle.reduce((acc, c) => acc + c.totalUf, 0);
        const totalUf = costoTitular + costoCargas + gesTotal;
        const totalClp = totalUf * ufValue;

        // IA Insight Logic
        let insight = "Plan equilibrado para este perfil.";
        if (plan.tipo === 'STAR' && totalUf < 3) insight = "Máximo ahorro manteniendo cobertura esencial.";
        if (plan.tipo === 'GOLD' || plan.tipo === 'MAX') insight = "Cobertura premium recomendada para alta frecuencia médica.";
        if (plan.coberturaHosp.includes('100%')) insight = "Seguridad total: 100% Cobertura Hospitalaria detectada.";
        if (cargas.length > 2 && plan.pbGrupal < plan.pbIndividual) insight = "Optimizado para familias grandes (Tasa Grupal aplicada).";

        return {
          ...plan,
          totalUf,
          totalClp,
          gesTotal,
          costoTitular,
          cargasDetalle,
          pb,
          factorTitular,
          insight
        };
      })
      .sort((a, b) => a.totalUf - b.totalUf);
  }, [titularEdad, cargas, region, ufValue]);

  const bestPlan = results[0];
  const activePlan = selectedPlanId ? results.find(r => r.nombre === selectedPlanId) : bestPlan;

  // Función para parsear los grupos de clínicas (G1, G2...)
  const parseClinicGroups = (text: string) => {
    if (!text) return [];
    const matches = text.match(/G\d+=?\d+%/g);
    return matches || [];
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/80 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-gray-50 dark:bg-gray-900 rounded-[3rem] shadow-2xl w-full max-w-[1400px] max-h-[95vh] overflow-hidden border border-white/10 relative flex flex-col">
        
        {/* Header Bar */}
        <div className="p-8 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-gray-950">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/20">
              <Calculator className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                Tarificador Inteligente <span className="text-blue-600">Pro</span>
              </h1>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Herramienta Técnica Profesional</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-gray-400 uppercase">Valor UF Hoy</span>
                {isLoadingUf && <Zap size={10} className="text-yellow-500 animate-pulse" />}
              </div>
              <input 
                type="number" 
                value={ufValue} 
                onChange={(e) => setUfValue(Number(e.target.value))}
                className="bg-transparent font-black text-blue-600 text-xl w-32 text-right outline-none border-b-2 border-transparent focus:border-blue-500"
              />
            </div>
            <button 
              onClick={onClose}
              className="p-3 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-red-500 transition-all"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Panel Izquierdo: Configuración y Beneficios */}
            <div className="lg:col-span-3 space-y-6">
              <div className="bg-white dark:bg-gray-950 p-6 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 space-y-6">
                <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                  <Users size={16} /> Perfil Grupo
                </h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase ml-2">Región de Venta</label>
                    <div className="grid grid-cols-1 gap-2">
                      {REGIONES.map(r => (
                        <button
                          key={r.id}
                          onClick={() => setRegion(r.id)}
                          className={`px-4 py-3 rounded-xl text-xs font-bold border-2 transition-all ${region === r.id ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-50 bg-gray-50 text-gray-400'}`}
                        >
                          {r.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                      <span className="text-[10px] font-black uppercase text-gray-400">Edad Titular</span>
                      <input 
                        type="number" 
                        value={titularEdad} 
                        onChange={(e) => setTitularEdad(Number(e.target.value))}
                        className="w-12 bg-white dark:bg-gray-700 rounded-lg p-1 text-center font-black text-blue-600"
                      />
                    </div>

                    {cargas.map((edad, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-blue-50/50 dark:bg-blue-900/10 rounded-xl border border-blue-100/30">
                        <div className="flex items-center gap-2">
                          <button onClick={() => removeCarga(idx)} className="text-red-500 hover:bg-red-50 p-1 rounded-md"><X size={12} /></button>
                          <span className="text-[10px] font-black uppercase text-blue-600">Carga {idx + 1}</span>
                        </div>
                        <input 
                          type="number" 
                          value={edad} 
                          onChange={(e) => updateCarga(idx, Number(e.target.value))}
                          className="w-12 bg-white dark:bg-gray-700 rounded-lg p-1 text-center font-black text-blue-600"
                        />
                      </div>
                    ))}

                    <button 
                      onClick={addCarga}
                      className="w-full py-3 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl text-[10px] font-black text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-all uppercase"
                    >
                      + Añadir Beneficiario
                    </button>
                  </div>
                </div>
              </div>

              {/* Beneficios Adicionales */}
              <div className="bg-white dark:bg-gray-950 p-6 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 space-y-4">
                <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                  <BookmarkCheck size={16} className="text-green-500" /> Beneficios Pro
                </h3>
                
                <div className="space-y-2">
                  {BENEFICIOS_ADICIONALES.map(benefit => (
                    <button
                      key={benefit.id}
                      onClick={() => toggleBenefit(benefit.id)}
                      className={`w-full p-3 rounded-2xl border-2 transition-all text-left flex items-start gap-3 ${selectedBenefits.includes(benefit.id) ? 'border-green-500 bg-green-50/50' : 'border-gray-50 bg-gray-50/50'}`}
                    >
                      <div className={`p-2 rounded-lg ${selectedBenefits.includes(benefit.id) ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                        {benefit.icon}
                      </div>
                      <div>
                        <p className={`text-[10px] font-black uppercase ${selectedBenefits.includes(benefit.id) ? 'text-green-700' : 'text-gray-500'}`}>{benefit.label}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Panel Central */}
            <div className="lg:col-span-9 space-y-8">
              
              {/* Card de Plan Activo - FOCO ABSOLUTO */}
              {activePlan && (
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                  <div className="xl:col-span-7 bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 rounded-[3rem] p-8 text-white shadow-2xl shadow-blue-900/30 relative overflow-hidden group transition-all duration-500">
                    <Sparkles className="absolute top-[-20px] right-[-20px] text-white/5" size={250} />
                    <div className="relative z-10 space-y-8">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 px-4 py-1.5 bg-white/10 border border-white/20 rounded-full w-fit">
                          <CheckCircle2 size={14} className="text-green-400" />
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-100">Plan Seleccionado</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <span className="px-3 py-1 bg-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest">{activePlan.tipo}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-6xl font-black leading-tight tracking-tighter uppercase mb-2">{activePlan.nombre}</h2>
                          <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2 text-blue-200 text-xs font-black uppercase tracking-widest">
                              <MapPin size={14} /> Región: {activePlan.region}
                            </div>
                            <div className="flex items-center gap-2 text-blue-200 text-xs font-black uppercase tracking-widest">
                              <ShieldCheck size={14} /> PB: {activePlan.pb} UF
                            </div>
                          </div>
                        </div>

                        {/* Detalle G - Seccion Técnica */}
                        <div className="space-y-3">
                           <p className="text-[10px] font-black uppercase tracking-widest text-blue-300">Detalle de Cobertura Preferente (G)</p>
                           <div className="grid grid-cols-5 gap-3">
                              {parseClinicGroups(activePlan.dcPreferente).map((g, i) => (
                                <div key={i} className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 text-center hover:bg-white/20 transition-all">
                                  <p className="text-[9px] font-black text-blue-200 uppercase mb-1">{g.split('=')[0]}</p>
                                  <p className="text-lg font-black">{g.split('=')[1]}</p>
                                </div>
                              ))}
                           </div>
                        </div>

                        <div className="bg-white/5 backdrop-blur-md rounded-[2rem] p-6 border border-white/10 space-y-4">
                           <div className="grid grid-cols-2 gap-4">
                              <div>
                                 <p className="text-[10px] font-black uppercase text-blue-300 mb-1">Hosp. Cobertura</p>
                                 <p className="text-sm font-bold text-white leading-tight">{activePlan.coberturaHosp}</p>
                              </div>
                              <div>
                                 <p className="text-[10px] font-black uppercase text-blue-300 mb-1">Tope Anual</p>
                                 <p className="text-sm font-bold text-white leading-tight">{activePlan.topeAnualMed} UF</p>
                              </div>
                           </div>
                           <p className="text-xs font-medium text-blue-100/80 leading-relaxed italic border-t border-white/5 pt-4">
                             &quot;{activePlan.insight}&quot;
                           </p>
                        </div>
                      </div>

                      {/* Botones de Cartilla y PDF (Reemplazo de FUN) */}
                      <div className="flex items-center gap-4 pt-4">
                        <button className="flex-1 bg-white text-blue-900 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-50 transition-all">
                          <FileText size={18} /> Ver Cartilla
                        </button>
                        <button className="flex-1 bg-blue-600 text-white px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-500 transition-all border border-white/20">
                          <Download size={18} /> Descargar PDF
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Desglose Técnico Premium */}
                  <div className="xl:col-span-5 bg-white dark:bg-gray-950 rounded-[3rem] p-8 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col justify-between">
                    <div className="space-y-6">
                      <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                        <Calculator size={18} className="text-blue-600" /> Liquidación Mensual
                      </h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl group transition-all">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-black text-xs">TIT</div>
                            <p className="text-xs font-black text-gray-500 uppercase">Titular ({activePlan.factorTitular}x)</p>
                          </div>
                          <p className="font-black text-sm">{activePlan.costoTitular.toFixed(3)} UF</p>
                        </div>

                        {activePlan.cargasDetalle.map((c, i) => (
                          <div key={i} className="flex items-center justify-between p-4 bg-indigo-50/30 dark:bg-indigo-900/10 rounded-2xl group">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-black text-xs">C{i+1}</div>
                              <p className="text-xs font-black text-gray-500 uppercase">{c.age < 2 ? 'Exento' : `Carga (${c.factor}x)`}</p>
                            </div>
                            <p className="font-black text-sm">{c.totalUf.toFixed(3)} UF</p>
                          </div>
                        ))}

                        <div className="flex items-center justify-between p-4 bg-purple-50/30 dark:bg-purple-900/10 rounded-2xl">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-black text-xs">GES</div>
                            <p className="text-xs font-black text-gray-500 uppercase">GES ({activePlan.gesTotal.toFixed(2)}x)</p>
                          </div>
                          <p className="font-black text-sm">{activePlan.gesTotal.toFixed(3)} UF</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-8 border-t border-gray-100 dark:border-gray-800 space-y-1">
                        <div className="flex justify-between items-end">
                           <p className="text-[10px] font-black text-gray-400 uppercase">Total UF</p>
                           <p className="text-4xl font-black text-blue-600">{activePlan.totalUf.toFixed(2)}</p>
                        </div>
                        <div className="flex justify-between items-end">
                           <p className="text-[10px] font-black text-gray-400 uppercase">Valor CLP</p>
                           <p className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">
                              {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(activePlan.totalClp)}
                           </p>
                        </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tabla Comparativa Lineal Profesional */}
              <div className="bg-white dark:bg-gray-950 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between bg-gray-50/50">
                  <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                    <TableIcon size={18} className="text-blue-600" /> Inventario de Planes Disponibles
                  </h3>
                  <div className="flex items-center gap-4 text-[10px] font-black text-gray-400 uppercase">
                     Total: {results.length} Opciones
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-800/50">
                        <th className="p-5 text-[10px] font-black uppercase text-gray-400 border-b border-gray-100 dark:border-gray-800">Plan Isapre</th>
                        <th className="p-5 text-[10px] font-black uppercase text-gray-400 border-b border-gray-100 dark:border-gray-800">Costo (UF)</th>
                        <th className="p-5 text-[10px] font-black uppercase text-gray-400 border-b border-gray-100 dark:border-gray-800">Convenios Clínicos</th>
                        <th className="p-5 text-[10px] font-black uppercase text-gray-400 border-b border-gray-100 dark:border-gray-800">Hosp. Cobertura</th>
                        <th className="p-5 text-[10px] font-black uppercase text-gray-400 border-b border-gray-100 dark:border-gray-800">Tope Anual</th>
                        <th className="p-5 text-[10px] font-black uppercase text-gray-400 border-b border-gray-100 dark:border-gray-800">Selección</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.slice(0, 40).map((plan, idx) => (
                        <tr 
                          key={idx} 
                          onClick={() => {
                            setSelectedPlanId(plan.nombre);
                            const element = document.querySelector('.overflow-y-auto');
                            if (element) element.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className={`group hover:bg-blue-600/5 transition-all cursor-pointer ${activePlan?.nombre === plan.nombre ? 'bg-blue-600/10' : ''}`}
                        >
                          <td className="p-5 border-b border-gray-50 dark:border-gray-800">
                             <p className={`text-xs font-black uppercase ${activePlan?.nombre === plan.nombre ? 'text-blue-600' : 'text-gray-900 dark:text-white'}`}>{plan.nombre}</p>
                             <p className="text-[9px] font-bold text-gray-400 uppercase">{plan.tipo}</p>
                          </td>
                          <td className="p-5 border-b border-gray-50 dark:border-gray-800">
                            <p className="text-sm font-black text-blue-600">{plan.totalUf.toFixed(2)}</p>
                          </td>
                          <td className="p-5 border-b border-gray-50 dark:border-gray-800">
                            <div className="flex flex-wrap gap-1 max-w-[150px]">
                              {parseClinicGroups(plan.dcPreferente).slice(0, 2).map((g, i) => (
                                <span key={i} className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-[8px] font-black text-gray-500 uppercase">{g}</span>
                              ))}
                              {parseClinicGroups(plan.dcPreferente).length > 2 && <span className="text-[8px] font-black text-blue-500">+{parseClinicGroups(plan.dcPreferente).length - 2} más</span>}
                            </div>
                          </td>
                          <td className="p-5 border-b border-gray-50 dark:border-gray-800 max-w-xs">
                            <p className="text-[10px] font-bold text-gray-600 dark:text-gray-400 line-clamp-1">{plan.coberturaHosp}</p>
                          </td>
                          <td className="p-5 border-b border-gray-50 dark:border-gray-800">
                            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-[9px] font-black text-gray-500">{plan.topeAnualMed} UF</span>
                          </td>
                          <td className="p-5 border-b border-gray-50 dark:border-gray-800 text-center">
                            <div className={`w-6 h-6 rounded-full inline-flex items-center justify-center border-2 transition-all ${activePlan?.nombre === plan.nombre ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-200 text-gray-300'}`}>
                              <CheckCircle2 size={12} />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
