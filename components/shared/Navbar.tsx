'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Calendar, Upload, LogOut, ShieldCheck, Menu, X, ClipboardCheck, Mail } from 'lucide-react';
import { useState } from 'react';

const NAV=[
  {href:'/',label:'Kanban',icon:LayoutDashboard},
  {href:'/simulador',label:'Simulador',icon:Award},
  {href:'/calendario',label:'Agenda',icon:Calendar},
  {href:'/pesquisa',label:'Pesquisa',icon:ClipboardCheck},
  {href:'/marketing',label:'Marketing',icon:Mail},
  {href:'/importar',label:'Importar',icon:Upload}
];

export default function Navbar() {
  const pathname=usePathname(), router=useRouter();
  const [open,setOpen]=useState(false);
  
  const handleLogout=async()=>{
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-[1500px] mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-2xl bg-[#0076B8] flex items-center justify-center shadow-lg shadow-blue-100">
            <div className="relative w-6 h-6">
                {/* Icono simplificado que recuerda al panal de Colmena */}
                <div className="absolute inset-0 border-2 border-white rounded-md rotate-45" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                </div>
            </div>
          </div>
          <div className="flex flex-col -space-y-1">
            <span className="font-black text-lg text-[#0076B8] tracking-tight">Colmena</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">CRM Ventas</span>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {NAV.map(({href,label,icon:Icon})=>(
            <Link key={href} href={href} className={`flex items-center gap-2.5 px-4 py-2 rounded-2xl text-sm font-bold transition-all ${pathname===href?'bg-blue-50 text-[#0076B8] shadow-sm':'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}>
              <Icon size={18}/>{label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <button onClick={handleLogout} className="hidden md:flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-bold text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"><LogOut size={18}/><span>Salir</span></button>
          <button onClick={()=>setOpen(v=>!v)} className="md:hidden p-2.5 rounded-2xl text-gray-500 hover:bg-gray-100 transition-colors">{open?<X size={22}/>:<Menu size={22}/>}</button>
        </div>
      </div>
      {open&&(
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-1.5 animate-in slide-in-from-top duration-300">
          {NAV.map(({href,label,icon:Icon})=>(<Link key={href} href={href} onClick={()=>setOpen(false)} className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${pathname===href?'bg-blue-50 text-[#0076B8]':'text-gray-500 hover:bg-gray-50'}`}><Icon size={20}/>{label}</Link>))}
          <button onClick={handleLogout} className="flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold text-red-500 w-full hover:bg-red-50 transition-all mt-2 border-t border-gray-50 pt-4"><LogOut size={20}/>Cerrar sesión</button>
        </div>
      )}
    </header>
  );
}