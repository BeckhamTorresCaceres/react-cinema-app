import React from 'react';
// 1. Importamos el hook de navegación nativo de React Router
import { useNavigate } from 'react-router'; 

interface BenefitItem {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  tag?: string;
}

const BenefitsMembership: React.FC = () => {
  // 2. Inicializamos el hook de navegación
  const navigate = useNavigate();

  // Lista estática con Iconos SVG puros incorporados
  const benefits: BenefitItem[] = [
    {
      id: 1,
      title: "Funciones Premier Ilimitadas",
      description: "Acceso exclusivo a salas VIP y asientos reclinables de cuero en cualquier estreno sin costo adicional.",
      icon: (
        <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-[#9fe1f4]">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 20.25h12m-12-3h12m-12-3h12m-12-3h12m-12-3h12M4.5 3.75h15c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-15a1.125 1.125 0 0 1-1.125-1.125V4.875c0-.621.504-1.125 1.125-1.125Z" />
        </svg>
      ),
      tag: "Popular"
    },
    {
      id: 2,
      title: "2x1 en Entradas Generales",
      description: "Disfruta de tarifas preferenciales todos los días del año para acompañantes en formatos 2D, 3D e IMAX.",
      icon: (
        <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-[#2F2FE4]">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-3-12v.75m0 3v.75m0 3v.75m0 3V18M3 6.75A1.125 1.125 0 0 1 4.125 5.625h15.75c.621 0 1.125.504 1.125 1.125v10.5A1.125 1.125 0 0 1 19.875 18.375H4.125A1.125 1.125 0 0 1 3 17.25V6.75Z" />
        </svg>
      ),
    },
    {
      id: 3,
      title: "Dulcería Gourmet Gratis",
      description: "Un combo Platinum mediano (palomitas y refresco) sin costo en cada una de tus visitas al mes.",
      icon: (
        <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-[#9fe1f4]">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0-2.625V7.5m0 0h-5.625c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125h11.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H12Z" />
        </svg>
      ),
    },
    {
      id: 4,
      title: "Preventas Exclusivas",
      description: "Adquiere tus boletos para los blockbusters más esperados 48 horas antes que el público general.",
      icon: (
        <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-[#2F2FE4]">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      ),
      tag: "VIP"
    },
    {
      id: 5,
      title: "Invitaciones a Alfombras Rojas",
      description: "Pases directos a eventos de gala, preestrenos con directores y sesiones de preguntas y respuestas con el elenco.",
      icon: (
        <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-[#9fe1f4]">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 21l4.5-2.212L18 21l-.813-5.096L21 12.338l-5.13-.733L13.5 7l-2.37 4.605-5.13.733 3.813 3.566ZM12 2.25a.75.75 0 0 1 .75.75.75.75 0 0 1-.75.75.75.75 0 0 1-.75-.75.75.75 0 0 1 .75-.75Z" />
        </svg>
      ),
    },
    {
      id: 6,
      title: "Eventos Comunitarios Privados",
      description: "Acceso a ciclos de cine independiente y debates mensuales organizados exclusivamente para miembros Platinum.",
      icon: (
        <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-[#2F2FE4]">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0-2.625.372 9.337 9.337 0 0 0-4.121-1.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
        </svg>
      ),
    }
  ];

  // 3. Manejador del evento clic que redirige al carrito
  const handlePurchase = () => {
    navigate('/checkout'); // 👈 Aquí pones la ruta real de tu carrito
  };
    
  return (
    <div className="min-h-screen bg-[#080616] px-4 py-12 md:px-6 text-white flex flex-col items-center">
      <div className="w-full max-w-6xl">
        
        {/* Etiqueta superior */}
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#2F2FE4] mb-4">
          LumiFilms Club
        </p>

        {/* Encabezado Principal */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#162E93]/20 pb-8 mb-12 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400">
              BENEFICIOS PLATINUM
            </h1>
            <p className="text-slate-400 mt-2 text-lg">
              Tu pase VIP para vivir el cine al máximo nivel.
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-[#e5e5e5] via-[#ffffff] to-[#b3b3b3] text-[#111] text-xs font-black px-4 py-2 rounded-full tracking-[1.5px] shadow-lg shadow-white/5 w-fit self-start md:self-auto">
            VIP STATUS ACTIVE
          </div>
        </div>

        {/* Rejilla de Beneficios */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit) => (
            <div 
              key={benefit.id}
              className="relative group rounded-2xl border border-[#162E93]/30 bg-[#1A1953]/20 p-6 shadow-xl backdrop-blur-md transition-all duration-300 hover:border-[#2F2FE4]/60 hover:bg-[#1A1953]/40 hover:-translate-y-1 flex flex-col justify-between overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#2F2FE4]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-[#080616]/60 rounded-xl border border-[#162E93]/40 shadow-inner group-hover:border-[#2F2FE4]/40 transition-colors">
                    {benefit.icon}
                  </div>
                  {benefit.tag && (
                    <span className={`text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full border ${
                      benefit.tag === 'VIP' 
                        ? 'bg-purple-950/40 text-purple-400 border-purple-800/50' 
                        : 'bg-cyan-950/40 text-cyan-400 border-cyan-800/50'
                    }`}>
                      {benefit.tag}
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-white mb-2 tracking-wide group-hover:text-[#9fe1f4] transition-colors">
                  {benefit.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {benefit.description}
                </p>
              </div>

              <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#2F2FE4]/20 to-transparent mt-6 group-hover:via-[#2F2FE4]/60 transition-all duration-300" />
            </div>
          ))}
        </div>

        {/* 4. SECCIÓN DEL BOTÓN DE COMPRA LLAMATIVO */}
        <div className="mt-16 flex flex-col items-center p-8 rounded-3xl border border-[#2F2FE4]/30 bg-gradient-to-b from-[#1A1953]/30 to-[#080616] text-center shadow-2xl backdrop-blur-md max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold text-white tracking-wide">¿Listo para mejorar tu experiencia?</h3>
          <p className="text-slate-400 text-sm mt-2 mb-6 max-w-md">
            Adquiere o renueva tu suscripción Platinum ahora mismo y desbloquea todos estos beneficios digitales al instante.
          </p>
          <button
            onClick={handlePurchase}
            className="group relative flex items-center gap-2 bg-[#2F2FE4] text-white px-8 py-3.5 rounded-xl font-semibold tracking-wide shadow-lg shadow-[#2F2FE4]/40 hover:bg-[#2020bc] transition-all duration-300 transform active:scale-95"
          >
            {/* SVG nativo para el carrito dentro del botón */}
            <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 transition-transform group-hover:translate-x-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
            </svg>
            Obtener Membresía Platinum
          </button>
        </div>

        <p className="text-center text-xs text-slate-500 mt-12 tracking-wide">
          * Los beneficios están sujetos a disponibilidad de sala y términos del programa LumiFilms Platinum 2026.
        </p>

      </div>
    </div>
  );
};

export default BenefitsMembership;
