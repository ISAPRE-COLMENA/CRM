'use client';
import { useState } from 'react';
import KanbanBoard from '@/components/kanban/KanbanBoard';
import ListView from '@/components/leads/ListView';
import LeadModal from '@/components/leads/LeadModal';
import LeadForm from '@/components/leads/LeadForm';
import type { Lead, Stage } from '@/types';
import { Plus, Users, TrendingUp, DollarSign, LayoutGrid, List } from 'lucide-react';
import { useLeads } from '@/hooks/useLeads';
import { formatSueldo } from '@/lib/utils';

// Iconos de lucide-react (corregido de lucide-center)
import { 
  Users as UsersIcon, 
  TrendingUp as TrendingIcon, 
  DollarSign as DollarIcon, 
  Award, 
  LayoutGrid as GridIcon, 
  List as ListIcon 
} from 'lucide-react';

function KPI({icon:Icon,label,value,sub,color}:{icon:any;label:string;value:string|number;sub?:string;color:string}) {
  return <div className="bg-white p-5 flex items-center gap-4 rounded-xl shadow-sm border border-gray-100"><div className={`p-3 rounded-xl ${color}`}><Icon size={20} className="text-white"/></div><div><p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p><p className="text-xl font-bold tabular-nums">{value}</p>{sub&&<p className="text-xs text-gray-400 mt-0.5">{sub}</p>}</div></div>;
}

export default function DashboardContent() {
  const {leads}=useLeads();
  const [sel,setSel]=useState<Lead|null>(null);
  const [addStage,setAddStage]=useState<Stage|null>(null);
  const [viewMode, setViewMode] = useState<'kanban'|'list'>('list');

  const cierres=(leads || []).filter(l=>l && l.stage==='cierre').length;
  const pipeline=(leads || []).filter(l=>l && l.stage!=='nuevo'&&l.stage!=='no_interesado').length;
  const sueldoCierres=(leads || []).filter(l=>l && l.stage==='cierre').reduce((a,l)=>a+(l.sueldo_imponible||0),0);

  return (
    <main className="max-w-[1400px] mx-auto px-4 py-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold">Pipeline de Ventas</h1>
          <p className="text-sm text-gray-500 mt-0.5">Gestión de prospectos Isapre Colmena</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white rounded-xl shadow-sm border border-gray-200 p-1">
            <button 
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${viewMode === 'list' ? 'bg-blue-50 text-blue-700' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <ListIcon size={16}/> Lista
            </button>
            <button 
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${viewMode === 'kanban' ? 'bg-blue-50 text-blue-700' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <GridIcon size={16}/> Tablero
            </button>
          </div>
          <button onClick={()=>setAddStage('nuevo')} className="btn-primary flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow-md"><Plus size={16}/>Nuevo prospecto</button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPI icon={UsersIcon} label="Total" value={(leads || []).length} color="bg-blue-500"/>
        <KPI icon={TrendingIcon} label="En Pipeline" value={pipeline} sub="contactado→evaluación" color="bg-yellow-500"/>
        <KPI icon={Award} label="Cierres" value={cierres} sub="contratos firmados" color="bg-green-500"/>
        <KPI icon={DollarIcon} label="Sueldo cierres" value={formatSueldo(sueldoCierres)} color="bg-purple-500"/>
      </div>
      
      {viewMode === 'kanban' ? (
        <KanbanBoard onLeadClick={setSel} onAddLead={setAddStage}/>
      ) : (
        <ListView leads={leads} onLeadClick={setSel} />
      )}

      {sel&&<LeadModal lead={sel} onClose={()=>setSel(null)}/>}
      {addStage&&<LeadForm defaultStage={addStage} onClose={()=>setAddStage(null)}/>}
    </main>
  );
}
