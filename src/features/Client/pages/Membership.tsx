import React from 'react';

// Interfaz limpia con todas las propiedades obligatorias para mostrar datos estáticos
interface MembershipCardProps {
  name: string;
  id: string;
  memberSince: string;
  expiryDate: string;
  status: 'ACTIVO' | 'INACTIVO';
}

export const MembershipCard: React.FC<MembershipCardProps> = ({
  name,
  id,
  memberSince,
  expiryDate,
  status
}) => {
  return (
    <div className="relative w-[350px] h-[220px] bg-gradient-to-br from-[#2c3e50] to-[#000000] rounded-[15px] p-5 box-border font-sans text-white flex flex-col justify-between shadow-[0_10px_25px_rgba(0,0,0,0.3)] border border-white/10 overflow-hidden">
      
      {/* Efecto de brillo de fondo decorativo */}
      <div className="absolute inset-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(255,255,255,0.05)_0%,transparent_70%)] pointer-events-none" />

      {/* Encabezado */}
      <div className="relative z-10 flex justify-between items-center">
        <div className="text-[20px] font-extrabold tracking-[1.5px] bg-gradient-to-r from-[#9fe1f4] to-[#dfeff4] bg-clip-text text-transparent">
          LumiFilms
        </div>
        <div className="bg-gradient-to-r from-[#e5e5e5] via-[#ffffff] to-[#b3b3b3] text-[#111] text-[9px] font-black px-2 py-1 rounded-full tracking-[1px] shadow-[0_2px_5px_rgba(0,0,0,0.2)]">
          PLATINUM VIP
        </div>
      </div>

      {/* Cuerpo (Chip SIM) */}
      <div className="relative z-10 mt-1">
        <div className="relative w-10 h-7 bg-gradient-to-br from-[#e0a96d] to-[#966b38] rounded-md border border-white/20" />
      </div>

      {/* Detalles del usuario */}
      <div className="relative z-10 mt-auto mb-[15px]">
        <div className="text-[18px] uppercase tracking-[2px] font-medium mb-1">
          {name}
        </div>
        <div className="text-[14px] font-mono tracking-[1.5px] text-[#cccccc]">
          ID: {id}
        </div>
      </div>

      {/* Pie de la tarjeta */}
      <div className="relative z-10 flex justify-between items-end border-t border-white/15 pt-2.5">
        <div>
          <div className="text-[8px] uppercase text-[#888888] tracking-[0.5px] mb-0.5">Miembro desde</div>
          <div className="text-[11px] font-semibold">{memberSince}</div>
        </div>
        <div>
          <div className="text-[8px] uppercase text-[#888888] tracking-[0.5px] mb-0.5">Expira</div>
          <div className="text-[11px] font-semibold">{expiryDate}</div>
        </div>
        <div className="flex items-center bg-black/40 px-2 py-1 rounded border border-white/5">
          <div className={`w-1.5 h-1.5 rounded-full mr-1.5 shadow-[0_0_8px] ${
            status === 'ACTIVO' ? 'bg-[#2ecc71] shadow-[#2ecc71]' : 'bg-[#e74c3c] shadow-[#e74c3c]'
          }`} />
          <span className={`text-[9px] font-bold tracking-[0.5px] ${
            status === 'ACTIVO' ? 'text-[#2ecc71]' : 'text-[#e74c3c]'
          }`}>
            {status}
          </span>
        </div>
      </div>

    </div>
  );
};

// Componente contenedor estático de ejemplo
const Membership = () => {
  return (
    <div className="p-6 bg-gray-900 min-h-screen flex justify-center items-center">
      {/* Pasas los datos duros directamente en las props */}
      <MembershipCard 
        name="Yadira" 
        id="8420 9153 0074" 
        memberSince="08 / 2024" 
        expiryDate="08 / 2027" 
        status="ACTIVO" 
      />
    </div>
  );
};

export default Membership;
