'use client';
import Navbar from '@/components/shared/Navbar';
import CalendarView from '@/components/calendar/CalendarView';

export default function CalendarioPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar/>
      <main className="max-w-[1500px] mx-auto px-4 py-6">
        <CalendarView />
      </main>
    </div>
  );
}