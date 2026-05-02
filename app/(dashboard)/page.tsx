'use client';
import dynamic from 'next/dynamic';
import Navbar from '@/components/shared/Navbar';

// Cargamos el Dashboard de forma dinámica solo en el cliente para evitar errores de hidratación masivos
const DashboardContent = dynamic(() => import('./DashboardContent'), { 
  ssr: false,
  loading: () => <div className="min-h-screen flex items-center justify-center bg-gray-50">Cargando dashboard...</div>
});

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar/>
      <DashboardContent />
    </div>
  );
}