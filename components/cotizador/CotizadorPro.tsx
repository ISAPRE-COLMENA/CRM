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
  HeartPulse,
  Truck,
  Plus,
  Zap,
  Download,
  Minus,
  ChevronDown,
  Info,
  ArrowRight,
  Shield,
  Activity,
  DollarSign,
  Search
} from 'lucide-react';
import { PLANES, getFactor, GES_VALUE, REGIONES, translateDescription } from '@/lib/planData';
import PlanPDFTemplate from './PlanPDFTemplate';

interface FamilyMember {
  id: string;
  type: 'titular' | 'pareja' | 'carga';
  age: number;
  gender: 'hombre' | 'mujer';
}

const BENEFICIOS_COLMENA = [
  { 
    id: 'telemed', 
    label: 'Doctor Online Pro', 
    desc: 'Consultas médicas ilimitadas copago $0', 
    cost: 0.19,
    icon: <HeartPulse size={14} /> 
  },
  { 
    id: 'farma', 
    label: 'Pharma Max', 
    desc: 'Hasta 90% bonificación en medicamentos', 
    cost: 0.17,
    icon: <Zap size={14} /> 
  },
  { 
    id: 'dental', 
    label: 'Dental Plus', 
    desc: '80% dcto en RedSalud / 70% Uno Salud', 
    cost: 0.19,
    icon: <ShieldCheck size={14} /> 
  },
  { 
    id: 'urgencia', 
    label: 'Urgencia Ambulatoria', 
    desc: '80% financiamiento copagos urgencia', 
    cost: 0.17,
    icon: <Activity size={14} /> 
  },
  { 
    id: 'catastrofico', 
    label: 'Catastrófico LE', 
    desc: '100% reembolso enfermedades alto costo', 
    cost: 0.14,
    icon: <Shield size={14} /> 
  }
];

export default function CotizadorPro() {
  // Estado de Miembros del Grupo
  const [members, setMembers] = useState<FamilyMember[]>([
    { id: 'tit-1', type: 'titular', age: 30, gender: 'hombre' }
  ]);
  
  const [region, setRegion] = useState('RM');
  const [ufValue, setUfValue] = useState(37800);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBenefits, setSelectedBenefits] = useState<string[]>([]);
  
  // Nuevo Miembro (Modal State)
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [newMemberAge, setNewMemberAge] = useState(25);
  const [newMemberGender, setNewMemberGender] = useState<'hombre' | 'mujer'>('mujer');
  const [newMemberType, setNewMemberType] = useState<'titular' | 'pareja' | 'carga'>('carga');
  const [selectedClinics, setSelectedClinics] = useState<string[]>([]);
  const [selectedPlanTypes, setSelectedPlanTypes] = useState<string[]>([]);
  const [displayLimit, setDisplayLimit] = useState(50);
  const [showPdfMockup, setShowPdfMockup] = useState(false);

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
    if (editingMemberId) {
      setMembers(members.map(m => m.id === editingMemberId ? { ...m, age: newMemberAge, gender: newMemberGender } : m));
    } else {
      const id = `${newMemberType}-${Math.random().toString(36).substr(2, 9)}`;
      setMembers([...members, { id, type: newMemberType, age: newMemberAge, gender: newMemberGender }]);
    }
    setIsAddingMember(false);
    setEditingMemberId(null);
  };

  const openAddModal = (type: 'pareja' | 'carga') => {
    setNewMemberType(type);
    setEditingMemberId(null);
    setIsAddingMember(true);
  };

  const openEditModal = (member: FamilyMember) => {
    setEditingMemberId(member.id);
    setNewMemberType(member.type);
    setNewMemberAge(member.age);
    setNewMemberGender(member.gender);
    setIsAddingMember(true);
  };

  const removeMember = (id: string) => {
    if (members.find(m => m.id === id)?.type === 'titular') return;
    setMembers(members.filter(m => m.id !== id));
  };

  const allClinics = useMemo(() => {
    const clinics = new Set<string>();
    // Filter by current region to show relevant clinics
    PLANES.filter(p => p.region === region).forEach(p => {
      const text = `${p.coberturaHosp} ${p.dcPref} ${p.consultaPref}`;
      const clinicRegex = /(?:Clínica|Hospital|Hosp\.|Cl\.)\s+([A-Z][\w\s]+?)(?=[,.\n%]|(?:\s{2,})|$)/g;
      let match;
      while ((match = clinicRegex.exec(text)) !== null) {
        const name = match[1].trim();
        if (name.length > 3 && !name.includes(' de ')) clinics.add(name);
      }
    });

    // Manually add major clinics based on region if they are missing from extraction
    if (region === 'REGIONES') {
      const sur = ['Clínica Biobío', 'Sanatorio Alemán', 'Clínica Universitaria', 'Clínica Alemana de Temuco', 'Clínica Puerto Varas', 'Clínica Puerto Montt', 'Clínica Valdivia', 'Clínica Osorno'];
      const norte = ['Clínica Antofagasta', 'Clínica Iquique', 'Clínica El Loa', 'Clínica La Portada', 'Clínica Atacama'];
      sur.forEach(c => clinics.add(c));
      norte.forEach(c => clinics.add(c));
    } else {
      // RM defaults
      ['Dávila', 'Indisa', 'Santa María', 'Alemana', 'Las Condes', 'RedSalud', 'Bupa'].forEach(c => clinics.add(c));
    }

    return Array.from(clinics).filter(c => c.length > 2).sort();
  }, [region]);

  const planTypes = useMemo(() => {
    return Array.from(new Set(PLANES.filter(p => p.region === region).map(p => p.tipo))).sort();
  }, [region]);

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
        const benefitsTotal = selectedBenefits.reduce((acc, id) => {
          const b = BENEFICIOS_COLMENA.find(x => x.id === id);
          return acc + (b?.cost || 0);
        }, 0) * members.length;

        totalUf += gesTotal + benefitsTotal;
        const totalClp = totalUf * ufValue;

        return {
          ...plan,
          totalUf,
          totalClp,
          membersDetail,
          gesTotal,
          benefitsTotal,
          pb
        };
      })
      .filter(p => {
        const matchesSearch = searchQuery === '' || 
          p.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.tipo.toLowerCase().includes(searchQuery.toLowerCase());
          
        const manualRegionalClinics = [
          'Clínica Biobío', 'Sanatorio Alemán', 'Clínica Universitaria', 'Clínica Alemana de Temuco', 
          'Clínica Puerto Varas', 'Clínica Puerto Montt', 'Clínica Valdivia', 'Clínica Osorno',
          'Clínica Antofagasta', 'Clínica Iquique', 'Clínica El Loa', 'Clínica La Portada', 'Clínica Atacama'
        ];

        const matchesClinics = selectedClinics.length === 0 || selectedClinics.some(c => {
          const inText = p.coberturaHosp.toLowerCase().includes(c.toLowerCase()) || 
                         p.consultaPref.toLowerCase().includes(c.toLowerCase());
          
          // Smart Match: If it's a regional clinic and the plan is for 'REGIONES', it's a match
          const isRegionalClinic = manualRegionalClinics.includes(c);
          const isRegionalPlan = p.region === 'REGIONES';
          
          return inText || (isRegionalClinic && isRegionalPlan);
        });
        
        const matchesType = selectedPlanTypes.length === 0 || selectedPlanTypes.includes(p.tipo);
        
        return matchesSearch && matchesClinics && matchesType;
      })
      .sort((a, b) => a.totalUf - b.totalUf);
  }, [members, region, ufValue, searchQuery, selectedClinics, selectedPlanTypes, selectedBenefits]);

  const activePlan = useMemo(() => {
    if (selectedPlanId) return results.find(p => p.nombre === selectedPlanId) || results[0];
    return results[0];
  }, [results, selectedPlanId]);

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 lg:p-8 space-y-8 animate-in fade-in duration-500">
      
      {/* Header Pro */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100 gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600 rounded-xl shadow-lg shadow-blue-200">
              <Activity className="text-white" size={20} />
            </div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Cotizador Pro</h1>
          </div>
          <p className="text-xs text-gray-400 font-medium ml-12">Datos reales Colmena • Cálculo dinámico</p>
        </div>
        
        <div className="flex items-center gap-4 bg-blue-50 px-5 py-2.5 rounded-xl border border-blue-100">
          <Zap className="text-blue-600 fill-blue-600" size={16} />
          <div>
            <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest leading-none">Valor UF</p>
            <p className="text-lg font-black text-blue-800 tabular-nums">
              {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(ufValue)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Panel Izquierdo: Configuración */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-gray-100 space-y-8 sticky top-8">
            
            {/* Ubicación */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-400">
                <MapPin size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">Ubicación</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {REGIONES.map(reg => (
                  <button
                    key={reg.id}
                    onClick={() => {
                      setRegion(reg.id as any);
                      setSelectedPlanTypes([]); // Clear type filters on region change
                      setSelectedClinics([]);   // Clear clinic filters on region change
                    }}
                    className={`flex-1 py-3 px-4 rounded-xl text-xs font-black transition-all border-2 ${region === reg.id ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-white border-gray-100 text-gray-400 hover:border-blue-100'}`}
                  >
                    {reg.label.split('(')[0].trim()}
                  </button>
                ))}
              </div>
            </div>

            {/* Filtros Avanzados */}
            <div className="space-y-4 pt-6 border-t border-gray-50">
              <div className="flex items-center gap-2 text-gray-400">
                <Zap size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">Tipo de Plan</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {planTypes.map(t => (
                  <button
                    key={t}
                    onClick={() => setSelectedPlanTypes(prev => 
                      prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]
                    )}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${selectedPlanTypes.includes(t) ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-gray-100 text-gray-400 hover:border-indigo-200'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Filtros de Clínicas (Lista Extendida) */}
            <div className="space-y-4 pt-6 border-t border-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-400">
                  <HeartPulse size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Clínicas en Convenio</span>
                </div>
                {selectedClinics.length > 0 && (
                  <button onClick={() => setSelectedClinics([])} className="text-[9px] font-bold text-red-400 hover:text-red-600">Limpiar</button>
                )}
              </div>
              <div className="max-h-60 overflow-y-auto pr-2 custom-scrollbar space-y-1">
                {allClinics.map(c => (
                  <button
                    key={c}
                    onClick={() => setSelectedClinics(prev => 
                      prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]
                    )}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-[10px] font-bold border transition-all ${selectedClinics.includes(c) ? 'bg-blue-600 border-blue-600 text-white' : 'bg-gray-50 border-gray-50 text-gray-500 hover:border-blue-100'}`}
                  >
                    <span>{c}</span>
                    {selectedClinics.includes(c) && <CheckCircle2 size={12} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Grupo Familiar */}
            <div className="space-y-4 pt-8 border-t border-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-400">
                  <Users size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Grupo Familiar</span>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => openAddModal('carga')}
                    className="p-2 bg-blue-600 text-white rounded-xl hover:scale-110 transition-all shadow-lg shadow-blue-200"
                    title="Agregar Carga"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {members.map(m => (
                  <div key={m.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-xl group border border-transparent hover:border-blue-100 transition-all">
                    <button 
                      onClick={() => openEditModal(m)}
                      className="flex items-center gap-3 text-left flex-1"
                    >
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shadow-sm ${m.type === 'titular' ? 'bg-blue-600 text-white' : 'bg-white text-gray-400'}`}>
                        {m.type === 'titular' ? <ShieldCheck size={16} /> : <Users size={16} />}
                      </div>
                      <div>
                        <p className="text-xs font-bold capitalize">{m.type === 'titular' ? 'Titular' : m.type}</p>
                        <p className="text-[9px] font-medium text-gray-400">{m.age} años • {m.gender}</p>
                      </div>
                    </button>
                    {m.type !== 'titular' && (
                      <button 
                        onClick={() => removeMember(m.id)}
                        className="p-1.5 text-gray-300 hover:text-red-500 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Panel Derecho: Resultados y Plan Seleccionado */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Tarjeta Promocional (Selección Activa) */}
          {activePlan && (
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-blue-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Sparkles size={160} />
              </div>
              
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full border border-white/20">
                    <Sparkles size={12} />
                    <span className="text-[9px] font-black uppercase tracking-widest">Plan Seleccionado</span>
                  </div>
                  
                  <h2 className="text-3xl font-black tracking-tighter leading-none uppercase">
                    {activePlan.nombre}
                  </h2>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/10 p-3.5 rounded-xl border border-white/10">
                      <p className="text-[9px] font-black uppercase text-blue-200 mb-1.5 tracking-widest">Ambulatoria</p>
                      <p className="text-[10px] leading-relaxed font-bold text-white/90">
                        {translateDescription(activePlan.dcPref)}
                      </p>
                    </div>
                    <div className="bg-white/10 p-3.5 rounded-xl border border-white/10">
                      <p className="text-[9px] font-black uppercase text-blue-200 mb-1.5 tracking-widest">Hospitalaria</p>
                      <p className="text-[10px] leading-relaxed font-bold text-white/90">
                        {translateDescription(activePlan.coberturaHosp)}
                      </p>
                    </div>
                  </div>

                  {/* Beneficios Destacados (Extraction Info) */}
                  <div className="space-y-3">
                    <p className="text-[10px] font-black uppercase text-blue-300 tracking-[0.2em] mb-2">Productos Adicionales</p>
                    <div className="grid grid-cols-1 gap-2">
                      {BENEFICIOS_COLMENA.map((b) => {
                        const isSelected = selectedBenefits.includes(b.id);
                        return (
                          <div key={b.id} className={`flex items-center justify-between p-2.5 rounded-xl border transition-all group ${isSelected ? 'bg-white/20 border-white/30 shadow-lg' : 'bg-white/5 border-white/5 opacity-60 hover:opacity-100'}`}>
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg transition-transform ${isSelected ? 'bg-white text-blue-600' : 'bg-white/10 text-blue-200 group-hover:scale-110'}`}>
                                {b.icon}
                              </div>
                              <div>
                                <p className="text-[10px] font-black text-white">
                                  {b.label} 
                                  <span className="text-blue-200 font-bold ml-1">+{b.cost} UF/pers</span>
                                </p>
                                <p className="text-[9px] text-white/50 leading-tight">
                                  {b.desc} • <span className="text-white/70 font-bold">Total: {(b.cost * members.length).toFixed(2)} UF</span>
                                </p>
                              </div>
                            </div>
                            <button 
                              onClick={() => setSelectedBenefits(prev => 
                                isSelected ? prev.filter(id => id !== b.id) : [...prev, b.id]
                              )}
                              className={`p-1.5 rounded-lg transition-all ${isSelected ? 'bg-red-500/20 text-red-200 hover:bg-red-500/40' : 'bg-white/10 text-white hover:bg-white/20'}`}
                            >
                              {isSelected ? <Minus size={14} /> : <Plus size={14} />}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Desglose de Cobros Elegante */}
                  <div className="bg-white/5 p-6 rounded-3xl border border-white/10 space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-black uppercase text-blue-300 tracking-widest">Estructura de Costos</p>
                      <div className="flex gap-2">
                        <div className="px-2 py-1 bg-white/10 rounded text-[9px] font-bold">Precio Base: {activePlan.pb.toFixed(3)} UF</div>
                        {activePlan.benefitsTotal > 0 && (
                          <div className="px-2 py-1 bg-blue-500/30 rounded text-[9px] font-bold text-blue-200">Adicionales: {activePlan.benefitsTotal.toFixed(2)} UF</div>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2.5">
                      <div className="grid grid-cols-5 text-[9px] font-black text-white/40 uppercase tracking-tighter pb-1 border-b border-white/5">
                        <div className="col-span-2">Asegurado</div>
                        <div className="text-center">Factor</div>
                        <div className="text-center">Plan</div>
                        <div className="text-right">GES</div>
                      </div>
                      
                      {activePlan.membersDetail.map((m, idx) => (
                        <div key={idx} className="grid grid-cols-5 text-[11px] items-center py-1 border-b border-white/5 last:border-0">
                          <div className="col-span-2 flex flex-col">
                            <span className="font-bold text-white capitalize">{m.type}</span>
                            <span className="text-[9px] text-white/40">{m.age} años • {m.gender}</span>
                          </div>
                          <div className="text-center font-medium text-blue-200">{m.factor.toFixed(2)}</div>
                          <div className="text-center font-bold">{m.costUf.toFixed(3)}</div>
                          <div className="text-right font-bold text-indigo-200">{GES_VALUE.toFixed(3)}</div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3 flex items-center justify-between border-t border-white/20 mt-2">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black text-white/40 uppercase">Total Coberturas</span>
                        <span className="text-lg font-black text-white">{(activePlan.totalUf - activePlan.gesTotal).toFixed(3)} <span className="text-xs font-normal text-white/60">UF</span></span>
                      </div>
                      <div className="flex flex-col text-right">
                        <span className="text-[9px] font-black text-white/40 uppercase">Total GES</span>
                        <span className="text-lg font-black text-indigo-300">{activePlan.gesTotal.toFixed(3)} <span className="text-xs font-normal text-white/60">UF</span></span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] text-gray-900 shadow-xl flex flex-col items-center text-center">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Total Mensual Final</p>
                  <div className="text-5xl font-black tabular-nums tracking-tighter flex items-end gap-1.5">
                    {activePlan.totalUf.toFixed(2)}
                    <span className="text-xl text-blue-600 mb-1.5">UF</span>
                  </div>
                  <p className="text-xl font-bold text-gray-400 mt-1">
                    {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(activePlan.totalClp)}
                  </p>
                  
                  <div className="w-full h-[1px] bg-gray-100 my-6" />
                  
                  <div className="grid grid-cols-2 gap-3 w-full">
                    <button 
                      onClick={() => setShowPdfMockup(true)}
                      className="flex items-center justify-center gap-2 py-4 bg-gray-50 rounded-xl text-xs font-black text-gray-600 hover:bg-gray-100 transition-all border border-gray-100"
                    >
                      <Search size={14} /> Vista PDF
                    </button>
                    <button className="flex items-center justify-center gap-2 py-4 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl text-xs font-black text-white shadow-lg shadow-blue-200 hover:scale-105 transition-all">
                      <CheckCircle2 size={14} /> Me Interesa
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal PDF Mockup */}
          {showPdfMockup && activePlan && (
            <PlanPDFTemplate 
              planName={activePlan.nombre}
              totalUf={activePlan.totalUf}
              totalClp={activePlan.totalClp}
              members={activePlan.membersDetail}
              selectedBenefits={selectedBenefits}
              benefitsTotal={activePlan.benefitsTotal}
              onClose={() => setShowPdfMockup(false)}
            />
          )}

          {/* Listado de Planes */}
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Opciones Disponibles ({results.length})</h3>
              
              <div className="relative w-full md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text"
                  placeholder="Buscar por nombre o tipo (STAR, SILVER...)"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setDisplayLimit(50); // Reset limit on search
                  }}
                  className="w-full pl-12 pr-6 py-4 bg-white border border-gray-100 rounded-2xl text-sm font-bold shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {results.slice(0, displayLimit).map(p => (
                <button 
                  key={p.nombre}
                  onClick={() => setSelectedPlanId(p.nombre)}
                  className={`group w-full text-left bg-white p-5 rounded-2xl border-2 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-lg ${selectedPlanId === p.nombre || (!selectedPlanId && results[0].nombre === p.nombre) ? 'border-blue-600 bg-blue-50/30' : 'border-white hover:border-blue-100'}`}
                >
                  <div className="flex items-center gap-5">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${selectedPlanId === p.nombre || (!selectedPlanId && results[0].nombre === p.nombre) ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-400 group-hover:bg-blue-600 group-hover:text-white'}`}>
                      <Activity size={20} />
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-gray-900 leading-tight">{p.nombre}</h4>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{p.tipo} • {p.region}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-8">
                    <div className="hidden md:block text-right">
                      <p className="text-[9px] font-black text-gray-300 uppercase mb-0.5">Costo Total</p>
                      <p className="text-lg font-black text-gray-900 leading-none">{p.totalUf.toFixed(2)} UF</p>
                    </div>
                    <div className={`p-3 rounded-lg transition-all ${selectedPlanId === p.nombre || (!selectedPlanId && results[0].nombre === p.nombre) ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-400 group-hover:bg-blue-600 group-hover:text-white'}`}>
                      <ChevronDown className="-rotate-90" size={16} />
                    </div>
                  </div>
                </button>
              ))}

              {results.length > displayLimit && (
                <button 
                  onClick={() => setDisplayLimit(prev => prev + 20)}
                  className="w-full py-4 bg-white border-2 border-dashed border-gray-100 rounded-2xl text-xs font-black text-gray-400 hover:border-blue-200 hover:text-blue-500 transition-all flex items-center justify-center gap-2"
                >
                  <Plus size={14} /> Ver más planes ({results.length - displayLimit} restantes)
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Agregar Miembro (Igual que en Simulador) */}
      {isAddingMember && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] p-10 w-full max-w-md shadow-2xl space-y-8 animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-gray-900">Nuevo Asegurado</h2>
              <button onClick={() => setIsAddingMember(false)} className="p-2 bg-gray-50 rounded-xl hover:bg-red-50 hover:text-red-500 transition-all"><X size={20} /></button>
            </div>

            <div className="space-y-6">
              {/* Tipo */}
              {editingMemberId === null && (
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tipo de Asegurado</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['pareja', 'carga'].map(t => (
                      <button key={t} onClick={() => setNewMemberType(t as any)} className={`py-4 rounded-2xl text-xs font-black uppercase tracking-widest border-2 transition-all ${newMemberType === t ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-md shadow-blue-100' : 'border-gray-50 bg-gray-50 text-gray-400'}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sexo */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sexo</label>
                <div className="grid grid-cols-2 gap-3">
                  {['hombre', 'mujer'].map(g => (
                    <button key={g} onClick={() => setNewMemberGender(g as any)} className={`py-4 rounded-2xl text-xs font-black uppercase tracking-widest border-2 transition-all ${newMemberGender === g ? 'border-indigo-600 bg-indigo-50 text-indigo-600 shadow-md shadow-indigo-100' : 'border-gray-50 bg-gray-50 text-gray-400'}`}>
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Edad */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Edad Actual</label>
                <div className="flex items-center justify-between bg-gray-50 p-2 rounded-2xl border-2 border-gray-50">
                  <button onClick={() => setNewMemberAge(Math.max(0, newMemberAge - 1))} className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center hover:scale-110 transition-all text-blue-600"><Minus size={20} /></button>
                  <span className="text-3xl font-black tabular-nums">{newMemberAge}</span>
                  <button onClick={() => setNewMemberAge(newMemberAge + 1)} className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center hover:scale-110 transition-all text-blue-600"><Plus size={20} /></button>
                </div>
              </div>

              <button 
                onClick={addMemberToGroup}
                className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-200 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                {editingMemberId ? 'Guardar Cambios' : 'Añadir al Grupo'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
