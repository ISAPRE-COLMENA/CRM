'use client';
import { useState, useMemo, useEffect } from 'react';
import { 
  Users, 
  MapPin, 
  Sparkles, 
  CheckCircle2, 
  X, 
  ShieldCheck,
  Calculator,
  Stethoscope,
  Table as TableIcon,
  HeartPulse,
  Truck,
  Plus,
  BookmarkCheck,
  Zap,
  FileText,
  Download,
  Minus,
  ChevronDown,
  Info,
  ArrowRight
} from 'lucide-react';
import { PLANES, getFactor, GES_VALUE, REGIONES, translateDescription } from '@/lib/planData';

interface FamilyMember {
  id: string;
  type: 'titular' | 'pareja' | 'carga';
  age: number;
  gender: 'hombre' | 'mujer';
}

const BENEFICIOS_PRO = [
  { id: 'telemed', label: 'Doctor Online Pro', priceUf: 0.19, detail: 'Consultas médicas ilimitadas copago $0', icon: <HeartPulse size={14} /> },
  { id: 'farma', label: 'Pharma Max', priceUf: 0.17, detail: '90% bonificación en medicamentos', icon: <ShieldCheck size={14} /> },
  { id: 'dental', label: 'Dental Plus', priceUf: 0.19, detail: '80% dcto en RedSalud / 70% Uno Salud', icon: <Plus size={14} /> },
  { id: 'urgencia', label: 'Urgencia Ambulatoria', priceUf: 0.17, detail: '80% financiamiento copagos urgencia', icon: <Zap size={14} /> },
  { id: 'catastrofico', label: 'Catastrófico LE', priceUf: 0.14, detail: '100% reembolso enfermedades alto costo', icon: <BookmarkCheck size={14} /> },
];

export default function IntelligentSimulator({ onClose }: { onClose: () => void }) {
  // Estado de Miembros del Grupo
  const [members, setMembers] = useState<FamilyMember[]>([
    { id: 'tit-1', type: 'titular', age: 30, gender: 'hombre' }
  ]);
  
  const [region, setRegion] = useState('RM');
  const [ufValue, setUfValue] = useState(37800);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [selectedBenefits, setSelectedBenefits] = useState<string[]>([]);
  const [isAddingMember, setIsAddingMember] = useState(false);
  
  // Nuevo Miembro (Modal State)
  const [newMemberAge, setNewMemberAge] = useState(25);
  const [newMemberGender, setNewMemberGender] = useState<'hombre' | 'mujer'>('mujer');
  const [newMemberType, setNewMemberType] = useState<'pareja' | 'carga'>('carga');

  useEffect(() => {
    const fetchUF = async () => {
      try {
        const res = await fetch('https://mindicador.cl/api/uf');
        const data = await res.json();
        if (data.serie && data.serie[0]) setUfValue(data.serie[0].valor);
      } catch (err) { console.error("UF fetch error", err); }
    };
    fetchUF();
  }, []);

  const addMemberToGroup = () => {
    const id = `${newMemberType}-${Math.random().toString(36).substr(2, 9)}`;
    setMembers([...members, { id, type: newMemberType, age: newMemberAge, gender: newMemberGender }]);
    setIsAddingMember(false);
  };

  const removeMember = (id: string) => {
    if (members.find(m => m.id === id)?.type === 'titular') return;
    setMembers(members.filter(m => m.id !== id));
  };

  const results = useMemo(() => {
    return PLANES
      .filter(p => p.region === region)
      .map(plan => {
        const pb = members.length > 1 ? plan.pbGrupal : plan.pbIndividual;
        
        let totalUf = 0;
        const membersDetail = members.map(m => {
          const factor = getFactor(m.age, m.type === 'titular');
          const costUf = factor * pb;
          totalUf += costUf;
          return { ...m, factor, costUf };
        });

        const gesTotal = members.length * GES_VALUE;
        totalUf += gesTotal;

        // Add Selected Benefits (calculated per member)
        const benefitsUfTotal = selectedBenefits.reduce((acc, bId) => {
          const benefit = BENEFICIOS_PRO.find(b => b.id === bId);
          return acc + (benefit?.priceUf || 0) * members.length;
        }, 0);
        
        totalUf += benefitsUfTotal;
        const totalClp = totalUf * ufValue;

        return {
          ...plan,
          totalUf,
          totalClp,
          gesTotal,
          benefitsUfTotal,
          membersDetail,
          pb
        };
      })
      .sort((a, b) => a.totalUf - b.totalUf);
  }, [members, region, ufValue, selectedBenefits]);

  const activePlan = selectedPlanId ? results.find(r => r.nombre === selectedPlanId) : results[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4 bg-gray-950/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white dark:bg-gray-900 w-full max-w-[1500px] h-full md:h-[95vh] md:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border border-white/5">
        
        {/* Header QuePlan Style */}
        <div className="px-8 py-6 bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
               <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black">C</div>
               <span className="text-xl font-black text-gray-900 dark:text-white">Colmena <span className="text-blue-600">Simulador</span></span>
            </div>
            <div className="hidden md:flex items-center gap-4 border-l border-gray-200 dark:border-gray-800 pl-6">
               <div className="flex flex-col">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Valor UF Hoy</span>
                  <div className="flex items-center gap-2">
                    <Zap size={14} className="text-yellow-500 fill-yellow-500" />
                    <span className="text-lg font-black text-blue-600 tracking-tighter">
                      {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(ufValue)}
                    </span>
                  </div>
               </div>
            </div>
          </div>
          <button onClick={onClose} className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-500 hover:text-red-500 transition-all"><X size={20} /></button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          
          {/* Sidebar: Grupo Familiar */}
          <div className="w-full md:w-[350px] bg-gray-50/50 dark:bg-gray-900/50 border-r border-gray-100 dark:border-gray-800 overflow-y-auto p-6 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-gray-500 uppercase tracking-widest">Tu Grupo Familiar</h3>
                <button 
                  onClick={() => setIsAddingMember(true)}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
                >
                  <Plus size={16} />
                </button>
              </div>

              <div className="space-y-3">
                {members.map(m => (
                  <div key={m.id} className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-[10px] ${m.type === 'titular' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                        {m.type.substring(0, 3).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-xs font-black text-gray-900 dark:text-white capitalize">{m.type}</p>
                        <p className="text-[10px] font-bold text-gray-400">{m.age} años • {m.gender}</p>
                      </div>
                    </div>
                    {m.type !== 'titular' && (
                      <button onClick={() => removeMember(m.id)} className="p-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><X size={14} /></button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-800">
               <h3 className="text-sm font-black text-gray-500 uppercase tracking-widest">Productos Adicionales</h3>
               <div className="grid grid-cols-1 gap-2">
                  {BENEFICIOS_PRO.map(b => (
                    <button 
                      key={b.id} 
                      onClick={() => {
                        setSelectedBenefits(prev => 
                          prev.includes(b.id) ? prev.filter(x => x !== b.id) : [...prev, b.id]
                        );
                      }}
                      className={`flex items-center gap-3 p-3 rounded-xl transition-all border-2 ${selectedBenefits.includes(b.id) ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-transparent bg-white text-gray-400 shadow-sm hover:border-gray-100'}`}
                    >
                      <div className={`p-2 rounded-lg ${selectedBenefits.includes(b.id) ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                        {b.icon}
                      </div>
                      <div className="text-left">
                        <p className="text-[10px] font-black leading-tight">{b.label}</p>
                        <p className="text-[9px] font-bold opacity-60 leading-tight">{b.priceUf} UF/pers.</p>
                      </div>
                    </button>
                  ))}
               </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-800">
               <h3 className="text-sm font-black text-gray-500 uppercase tracking-widest">Ubicación</h3>
               <div className="grid grid-cols-1 gap-2">
                  {REGIONES.map(r => (
                    <button 
                      key={r.id} 
                      onClick={() => setRegion(r.id)}
                      className={`px-4 py-3 rounded-xl text-xs font-black text-left transition-all border-2 ${region === r.id ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-transparent bg-white text-gray-400 shadow-sm'}`}
                    >
                      {r.label}
                    </button>
                  ))}
               </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 bg-white dark:bg-gray-950 overflow-y-auto p-8 relative">
            
            {/* Modal "Agregar Asegurados" (Inspirado en Imagen) */}
            {isAddingMember && (
              <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-sm flex items-center justify-center p-6 animate-in zoom-in-95 duration-200">
                <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-800 p-10 space-y-8 relative">
                   <button onClick={() => setIsAddingMember(false)} className="absolute top-8 right-8 text-gray-400 hover:text-gray-600"><X size={20} /></button>
                   
                   <h2 className="text-2xl font-black text-gray-900 dark:text-white">Agregar asegurados</h2>
                   
                   <div className="space-y-8">
                      <div className="flex items-center justify-between">
                         <span className="text-lg font-bold text-gray-700 dark:text-gray-300">Pareja / Cónyuge</span>
                         <button 
                          onClick={() => setNewMemberType(newMemberType === 'pareja' ? 'carga' : 'pareja')}
                          className={`w-14 h-8 rounded-full transition-all relative ${newMemberType === 'pareja' ? 'bg-blue-600' : 'bg-gray-200'}`}
                         >
                            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${newMemberType === 'pareja' ? 'left-7' : 'left-1'}`} />
                         </button>
                      </div>

                      <div className="space-y-4">
                         <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Sexo</p>
                         <div className="grid grid-cols-2 gap-4">
                            <button 
                              onClick={() => setNewMemberGender('hombre')}
                              className={`py-4 rounded-2xl border-2 font-black transition-all ${newMemberGender === 'hombre' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-100 text-gray-400'}`}
                            >
                              Hombre
                            </button>
                            <button 
                              onClick={() => setNewMemberGender('mujer')}
                              className={`py-4 rounded-2xl border-2 font-black transition-all ${newMemberGender === 'mujer' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-100 text-gray-400'}`}
                            >
                              Mujer
                            </button>
                         </div>
                      </div>

                      <div className="space-y-4">
                        <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Edad</p>
                        <div className="flex items-center gap-6">
                           <div className="flex-1 h-20 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center">
                              <input 
                                type="number" 
                                value={newMemberAge} 
                                onChange={(e) => setNewMemberAge(Number(e.target.value))}
                                className="bg-transparent text-3xl font-black text-gray-900 dark:text-white w-20 text-center outline-none"
                              />
                           </div>
                           <div className="flex flex-col gap-2">
                              <button onClick={() => setNewMemberAge(newMemberAge + 1)} className="p-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl hover:bg-blue-50 text-blue-600 transition-all"><Plus size={20} /></button>
                              <button onClick={() => setNewMemberAge(Math.max(0, newMemberAge - 1))} className="p-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl hover:bg-blue-50 text-blue-600 transition-all"><Minus size={20} /></button>
                           </div>
                        </div>
                      </div>

                      <button 
                        onClick={addMemberToGroup}
                        className="w-full py-6 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl font-black text-lg transition-all shadow-xl shadow-blue-500/30"
                      >
                        Agregar y calcular precios
                      </button>
                   </div>
                </div>
              </div>
            )}

            {/* Plan Display Grid */}
            <div className="space-y-12">
              
              {/* Highlight Card (Active) */}
              {activePlan && (
                <div className="bg-blue-600 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                   <div className="relative z-10 grid grid-cols-1 xl:grid-cols-2 gap-12">
                      <div className="space-y-8">
                         <div className="flex items-center gap-3 bg-white/10 w-fit px-4 py-2 rounded-full border border-white/20">
                            <Sparkles size={16} className="text-yellow-300" />
                            <span className="text-xs font-black uppercase tracking-widest">Mejor Opción Detectada</span>
                         </div>
                         
                         <div>
                            <h2 className="text-4xl font-black leading-none tracking-tighter uppercase">{activePlan.nombre}</h2>
                         </div>

                         <div className="grid grid-cols-3 gap-4">
                            <div className="bg-white/10 p-4 rounded-2xl border border-white/10 backdrop-blur-md min-h-[100px]">
                               <p className="text-[10px] font-black uppercase text-blue-200 mb-1">Ambulatoria</p>
                               <p className="text-[10px] leading-tight font-bold text-white/90">{translateDescription(activePlan.dcPref)}</p>
                            </div>
                            <div className="bg-white/10 p-4 rounded-2xl border border-white/10 backdrop-blur-md min-h-[100px]">
                               <p className="text-[10px] font-black uppercase text-blue-200 mb-1">Hospitalaria</p>
                               <p className="text-[10px] leading-tight font-bold text-white/90">{translateDescription(activePlan.coberturaHosp)}</p>
                            </div>
                            <div className="bg-white/10 p-4 rounded-2xl border border-white/10 backdrop-blur-md min-h-[100px]">
                               <p className="text-[10px] font-black uppercase text-blue-200 mb-1">Copago Fijo</p>
                               <p className="text-xl font-black">UF 0,3</p>
                            </div>
                         </div>
                      </div>

                      <div className="bg-white/10 rounded-[2.5rem] p-8 border border-white/20 backdrop-blur-xl flex flex-col justify-between items-center text-center">
                         <div className="space-y-1">
                            <p className="text-sm font-black uppercase tracking-widest text-blue-200 opacity-60">Precio Final Mensual</p>
                            <div className="text-7xl font-black tracking-tighter">{activePlan.totalUf.toFixed(2)}<span className="text-3xl ml-1 font-medium opacity-40">UF</span></div>
                            <p className="text-2xl font-bold text-blue-100 mt-2">
                               {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(activePlan.totalClp)}
                            </p>
                         </div>
                         
                         <div className="w-full flex gap-4 mt-8">
                            <button className="flex-1 py-4 bg-white text-blue-700 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-50 transition-all flex items-center justify-center gap-2">
                               <FileText size={16} /> Ver Cartilla
                            </button>
                            <button className="flex-1 py-4 bg-blue-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-400 transition-all border border-white/20">
                               Me Interesa
                            </button>
                         </div>
                      </div>
                   </div>
                   <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20" />
                </div>
              )}

              {/* Listado Comparativo Table Style */}
              <div className="space-y-6">
                 <div className="flex items-center justify-between px-4">
                    <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">Otros planes recomendados</h3>
                    <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
                       Viendo {results.length} resultados para {region}
                    </div>
                 </div>

                 <div className="grid grid-cols-1 gap-4">
                    {results.slice(0, 10).map((plan, i) => (
                      <div 
                        key={i}
                        onClick={() => {
                          setSelectedPlanId(plan.nombre);
                          document.querySelector('.overflow-y-auto')?.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`bg-white dark:bg-gray-900 border-2 rounded-[2rem] p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-blue-200 transition-all cursor-pointer group ${selectedPlanId === plan.nombre ? 'border-blue-600 bg-blue-50/20' : 'border-gray-50'}`}
                      >
                         <div className="flex items-center gap-6 flex-1">
                            <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center text-blue-600">
                               <ShieldCheck size={32} />
                            </div>
                            <div className="space-y-1">
                               <h4 className="text-xl font-black text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">{plan.nombre}</h4>
                               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{plan.tipo} • Isapre Colmena</p>
                            </div>
                         </div>

                         <div className="flex items-center gap-12 px-8 border-x border-gray-100 dark:border-gray-800">
                            <div className="text-center">
                               <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Costo UF</p>
                               <p className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">{plan.totalUf.toFixed(2)}</p>
                            </div>
                            <div className="text-center">
                               <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Costo CLP</p>
                               <p className="text-lg font-black text-blue-600">
                                  {new Intl.NumberFormat('es-CL', { notation: 'compact', style: 'currency', currency: 'CLP' }).format(plan.totalClp)}
                               </p>
                            </div>
                         </div>

                         <div className="flex items-center gap-4">
                            <button className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl text-gray-400 hover:text-blue-600 transition-all"><Info size={20} /></button>
                            <button className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all">Cotizar</button>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
