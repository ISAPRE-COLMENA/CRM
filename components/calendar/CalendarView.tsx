'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useEvents, EventType } from '@/hooks/useEvents';
import { Calendar as CalendarIcon, Clock, MapPin, Video, Phone, Plus, ChevronRight, MoreHorizontal } from 'lucide-react';
import { format } from 'date-fns';
import AddEventModal from './AddEventModal';

// Importamos el wrapper de forma dinámica con SSR desactivado
const FullCalendarWrapper = dynamic(() => import('./FullCalendarWrapper'), { 
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full text-gray-400">Iniciando agenda...</div>
});

const COLORS: Record<EventType, string> = {
  reunion: '#3b82f6',
  visita_terreno: '#22c55e',
  videollamada: '#8b5cf6',
  seguimiento: '#f59e0b',
  otro: '#6b7280'
};

const ICON_MAP: Record<EventType, any> = {
  reunion: Phone,
  visita_terreno: MapPin,
  videollamada: Video,
  seguimiento: Clock,
  otro: MoreHorizontal
};

export default function CalendarView() {
  const { eventos, updateEvent } = useEvents();
  const [view, setView] = useState('timeGridWeek');
  const [showAdd, setShowAdd] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | undefined>(undefined);

  const handleEventDrop = (info: any) => {
    updateEvent(info.event.id, {
      inicio: info.event.startStr,
      fin: info.event.endStr
    });
  };

  const handleDateClick = (info: any) => {
    setSelectedDate(info.dateStr);
    setShowAdd(true);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)]">
      {/* Sidebar - Próximas Citas */}
      <div className="w-full lg:w-80 flex flex-col gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800 flex-1 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Clock size={18} className="text-blue-500"/> Próximas Citas
            </h2>
            <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
              <Plus size={16}/>
            </button>
          </div>
          
          <div className="space-y-3 overflow-y-auto pr-1">
            {eventos.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">No hay citas programadas</p>
            ) : (
              eventos.map(event => {
                const Icon = ICON_MAP[event.tipo] || MoreHorizontal;
                return (
                  <div key={event.id} className="group p-3 rounded-xl border border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 hover:border-blue-200 dark:hover:border-blue-900 hover:bg-white dark:hover:bg-gray-800 transition-all cursor-pointer">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-white dark:bg-gray-700 shadow-sm">
                        <Icon size={14} style={{ color: COLORS[event.tipo] }}/>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-gray-900 dark:text-gray-100 truncate">{event.titulo}</p>
                        <div className="flex items-center gap-1.5 mt-1 text-[10px] text-gray-500 font-medium">
                          <Clock size={10}/>
                          {format(new Date(event.inicio), 'HH:mm')} - {format(new Date(event.fin), 'HH:mm')}
                        </div>
                        {event.lead_nombre && (
                          <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-blue-600 font-semibold uppercase tracking-wider">
                            <ChevronRight size={10}/>
                            {event.lead_nombre}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Main Calendar Area */}
      <div className="flex-1 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between bg-gray-50/30">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <CalendarIcon size={18} className="text-blue-600 dark:text-blue-400"/>
            </div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">Agenda Comercial</h1>
          </div>
          
          <div className="flex bg-white dark:bg-gray-800 p-1 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            {[
              { id: 'dayGridMonth', label: 'Mes' },
              { id: 'timeGridWeek', label: 'Semana' },
              { id: 'timeGridDay', label: 'Día' }
            ].map(t => (
              <button 
                key={t.id}
                onClick={() => setView(t.id)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${view === t.id ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 p-4 calendar-container">
          <FullCalendarWrapper
            view={view}
            onEventDrop={handleEventDrop}
            onDateClick={handleDateClick}
            events={eventos.map(e => ({
              id: e.id,
              title: e.titulo,
              start: e.inicio,
              end: e.fin,
              backgroundColor: COLORS[e.tipo],
              borderColor: COLORS[e.tipo],
              extendedProps: { ...e }
            }))}
          />
        </div>
      </div>

      {showAdd && (
        <AddEventModal 
          onClose={() => setShowAdd(false)}
          selectedDate={selectedDate}
        />
      )}

      <style jsx global>{`
        .fc { --fc-border-color: #f3f4f6; --fc-today-bg-color: #eff6ff; font-family: inherit; }
        .fc .fc-toolbar-title { font-size: 1.1rem; font-weight: 700; color: #111827; }
        .fc .fc-col-header-cell-cushion { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; color: #6b7280; padding: 12px 4px; }
        .fc .fc-timegrid-slot-label-cushion { font-size: 0.7rem; color: #9ca3af; }
        .fc-theme-standard td, .fc-theme-standard th { border-color: #f9fafb !important; }
        .fc-event { border-radius: 6px !important; padding: 2px 4px !important; }
        .dark .fc { --fc-border-color: #1f2937; --fc-today-bg-color: #1e3a8a33; }
        .dark .fc .fc-toolbar-title { color: #f9fafb; }
        .dark .fc-theme-standard td, .dark .fc-theme-standard th { border-color: #1f2937 !important; }
      `}</style>
    </div>
  );
}
