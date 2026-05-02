'use client';
import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Loader2, ShieldCheck } from 'lucide-react';
export default function LoginPage() {
  const supabase=createClient(), router=useRouter();
  const [email,setEmail]=useState(''), [password,setPassword]=useState('');
  const [loading,setLoading]=useState(false), [error,setError]=useState('');
  const handleLogin=async(e:React.FormEvent)=>{
    e.preventDefault(); setLoading(true); setError('');
    const{error}=await supabase.auth.signInWithPassword({email,password});
    if(error){setError(error.message);setLoading(false);return;}
    router.push('/');
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center mb-3 shadow-lg">
            <ShieldCheck size={28} className="text-white"/>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">CRM Colmena</h1>
          <p className="text-sm text-gray-500 mt-1">Plataforma de agentes Isapre</p>
        </div>
        <div className="card p-8">
          <form onSubmit={handleLogin} className="space-y-5">
            <div><label className="label">Correo electrónico</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="input" placeholder="agente@colmena.cl" required/></div>
            <div><label className="label">Contraseña</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="input" placeholder="••••••••" required/></div>
            {error&&<div className="p-3 rounded-xl bg-red-50 border border-red-200"><p className="text-xs text-red-600">{error}</p></div>}
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
              {loading&&<Loader2 size={16} className="animate-spin"/>}{loading?'Ingresando...':'Ingresar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}