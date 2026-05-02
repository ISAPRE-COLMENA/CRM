'use client';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';

interface FullCalendarWrapperProps {
  events: any[];
  onEventDrop: (info: any) => void;
  onDateClick: (info: any) => void;
  view: string;
}

export default function FullCalendarWrapper({ events, onEventDrop, onDateClick, view }: FullCalendarWrapperProps) {
  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      initialView={view}
      headerToolbar={false}
      locales={[esLocale]}
      locale="es"
      events={events}
      editable={true}
      droppable={true}
      eventDrop={onEventDrop}
      dateClick={onDateClick}
      height="100%"
      slotMinTime="08:00:00"
      slotMaxTime="20:00:00"
      allDaySlot={false}
      nowIndicator={true}
      dayMaxEvents={true}
      eventClassNames="rounded-lg border-none shadow-sm font-medium text-xs px-1 cursor-pointer hover:brightness-95 transition-all"
    />
  );
}
