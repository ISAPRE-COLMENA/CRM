'use client';
import { useState } from 'react';
import Navbar from '@/components/shared/Navbar';
import { Search, UserPlus, Save, Loader2, ClipboardCheck } from 'lucide-react';
import { useLeads } from '@/hooks/useLeads';

const OPTIONS = {
  ingreso: ['Menor de $700.000', 'De $700.000 a $1.000.000', 'De $1.000.000 a $1.500.000', 'Más de $1.500.000'],
  edad: ['Menos de 27 años', 'De 27 a 35 años', 'De 36 a 55 años', 'Más de 55 años'],
  ocupacion: ['Estudiante', 'Ama de Casa', 'Empleado Público', 'Técnico/Operador Manual', 'Empleado', 'Gerente/Ejecutivo', 'Empresario/Independiente', 'Jubilado'],
  veces: ['No lo vi', 'De 1 a 2', 'De 3 a 5', 'Más de 5 veces'],
  acercamiento: ['Fácilmente', 'No muy fácil', 'Con dificultad', 'Probablemente'],
  referencias: ['Excelente', 'Buena', 'Regular', 'Mala']
};

export default function PesquisaPage() {
  const { createLead } = useLeads();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    ingreso: '',
    edad: '',
    ocupacion: '',
    hijos: '',
    veces: '',
    acercamiento: '',
    referencias: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await createLead({
      nombre: formData.nombre,
      apellido: formData.apellido,
      telefono: formData.telefono,
      stage: 'nuevo',
      // Guardamos el resto de la pesquisa en un campo de notas o similar
      isapre_actual: `Pesquisa: Ingreso: ${formData.ingreso}, Edad: ${formData.edad}, Ocupación: ${formData.ocupacion}, Hijos: ${formData.hijos}`
    } as any);
    setLoading(false);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({nombre:'', apellido:'', telefono:'', ingreso:'', edad:'', ocupacion:'', hijos:'', veces:'', acercamiento:'', referencias:''});
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar/>
      <main className="max-w-[1000px] mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 rounded-2xl bg-blue-600 shadow-lg shadow-blue-200">
            <ClipboardCheck size={24} className="text-white"/>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pesquisa de Prospectos</h1>
            <p className="text-gray-500">Digitalización de ficha de captación rápida - Isapre Colmena</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 pb-20">
          {/* Datos Básicos */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800 space-y-6">
            <h2 className="text-lg font-bold flex items-center gap-2 border-b border-gray-50 pb-4">
              <UserPlus size={18} className="text-blue-500"/> Identificación Básica
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="label">Nombres</label>
                <input type="text" required className="input" placeholder="Nombre completo" value={formData.nombre} onChange={e=>setFormData({...formData, nombre: e.target.value})}/>
              </div>
              <div>
                <label className="label">Apellidos</label>
                <input type="text" required className="input" placeholder="Apellidos" value={formData.apellido} onChange={e=>setFormData({...formData, apellido: e.target.value})}/>
              </div>
              <div>
                <label className="label">Teléfono</label>
                <input type="tel" required className="input" placeholder="+56 9..." value={formData.telefono} onChange={e=>setFormData({...formData, telefono: e.target.value})}/>
              </div>
            </div>
          </div>

          {/* Calificación (Grid de la imagen) */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800 space-y-8">
            <h2 className="text-lg font-bold flex items-center gap-2 border-b border-gray-50 pb-4">
              <Search size={18} className="text-blue-500"/> Perfil del Prospecto
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              {/* Ingreso Familiar */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-700 block uppercase tracking-wider">Ingreso Mensual Familiar</label>
                <div className="space-y-2">
                  {OPTIONS.ingreso.map(opt => (
                    <label key={opt} className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${formData.ingreso===opt ? 'border-blue-500 bg-blue-50/50 text-blue-700 shadow-sm' : 'border-gray-100 hover:bg-gray-50'}`}>
                      <input type="radio" name="ingreso" className="hidden" checked={formData.ingreso===opt} onChange={()=>setFormData({...formData, ingreso: opt})}/>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${formData.ingreso===opt ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>
                        {formData.ingreso===opt && <div className="w-1.5 h-1.5 rounded-full bg-white"/>}
                      </div>
                      <span className="text-sm font-medium">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Edad */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-700 block uppercase tracking-wider">Edad</label>
                <div className="space-y-2">
                  {OPTIONS.edad.map(opt => (
                    <label key={opt} className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${formData.edad===opt ? 'border-blue-500 bg-blue-50/50 text-blue-700 shadow-sm' : 'border-gray-100 hover:bg-gray-50'}`}>
                      <input type="radio" name="edad" className="hidden" checked={formData.edad===opt} onChange={()=>setFormData({...formData, edad: opt})}/>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${formData.edad===opt ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>
                        {formData.edad===opt && <div className="w-1.5 h-1.5 rounded-full bg-white"/>}
                      </div>
                      <span className="text-sm font-medium">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Ocupación */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-700 block uppercase tracking-wider">Ocupación</label>
                <div className="grid grid-cols-1 gap-2">
                  {OPTIONS.ocupacion.map(opt => (
                    <label key={opt} className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all cursor-pointer ${formData.ocupacion===opt ? 'border-blue-500 bg-blue-50/50 text-blue-700 shadow-sm' : 'border-gray-100 hover:bg-gray-50'}`}>
                      <input type="radio" name="ocupacion" className="hidden" checked={formData.ocupacion===opt} onChange={()=>setFormData({...formData, ocupacion: opt})}/>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${formData.ocupacion===opt ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>
                        {formData.ocupacion===opt && <div className="w-1.5 h-1.5 rounded-full bg-white"/>}
                      </div>
                      <span className="text-xs font-medium">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-8">
                {/* Hijos */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-700 block uppercase tracking-wider">Hijos</label>
                  <div className="flex gap-4">
                    {['Sí', 'No'].map(opt => (
                      <label key={opt} className={`flex-1 flex items-center justify-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${formData.hijos===opt ? 'border-blue-500 bg-blue-50/50 text-blue-700 shadow-sm' : 'border-gray-100 hover:bg-gray-50'}`}>
                        <input type="radio" name="hijos" className="hidden" checked={formData.hijos===opt} onChange={()=>setFormData({...formData, hijos: opt})}/>
                        <span className="text-sm font-bold uppercase">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Posibilidades Acercamiento */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-700 block uppercase tracking-wider">Posibilidades de Acercamiento</label>
                  <div className="grid grid-cols-2 gap-2">
                    {OPTIONS.acercamiento.map(opt => (
                      <label key={opt} className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition-all cursor-pointer ${formData.acercamiento===opt ? 'border-blue-500 bg-blue-50/50 text-blue-700 shadow-sm' : 'border-gray-100 hover:bg-gray-50'}`}>
                        <input type="radio" name="acercamiento" className="hidden" checked={formData.acercamiento===opt} onChange={()=>setFormData({...formData, acercamiento: opt})}/>
                        <span className="text-xs font-medium">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Habilidades Referencias */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-700 block uppercase tracking-wider">Habilidades para dar referencias</label>
                  <div className="grid grid-cols-2 gap-2">
                    {OPTIONS.referencias.map(opt => (
                      <label key={opt} className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition-all cursor-pointer ${formData.referencias===opt ? 'border-blue-500 bg-blue-50/50 text-blue-700 shadow-sm' : 'border-gray-100 hover:bg-gray-50'}`}>
                        <input type="radio" name="referencias" className="hidden" checked={formData.referencias===opt} onChange={()=>setFormData({...formData, referencias: opt})}/>
                        <span className="text-xs font-medium">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-800 sticky bottom-6 z-10">
            {submitted && <span className="text-green-600 font-bold flex items-center gap-2 animate-bounce"><Save size={18}/> ¡Guardado con éxito!</span>}
            <button type="submit" disabled={loading} className="btn-primary px-12 py-4 rounded-2xl flex items-center gap-3 shadow-xl shadow-blue-100 hover:shadow-2xl hover:-translate-y-0.5 transition-all">
              {loading ? <Loader2 size={22} className="animate-spin"/> : <><Save size={22}/> Guardar Pesquisa</>}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
