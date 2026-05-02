'use client';
import Navbar from '@/components/shared/Navbar';
import CSVImporter from '@/components/importer/CSVImporter';
import { Upload } from 'lucide-react';
export default function ImportarPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950"><Navbar/>
    <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center gap-3"><div className="p-2 rounded-xl bg-blue-100"><Upload size={18} className="text-blue-600"/></div><div><h1 className="text-xl font-bold">Importar Prospectos</h1><p className="text-sm text-gray-500">Carga masiva CSV — duplicados por RUT ignorados</p></div></div>
      <CSVImporter/>
    </main></div>
  );
}