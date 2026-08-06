import { useEffect, useState } from "react";

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  avatar: string;
}

const MyAccount = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState<Omit<User, "id">>({
    name: "",
    username: "",
    email: "",
    phone: "",
    avatar: "",
  });

  useEffect(() => {
    fetch("http://localhost:3001/users/2")
      .then((response) => response.json())
      .then((data) => {
        setUser(data);
        setFormData({
          name: data.name,
          username: data.username,
          email: data.email,
          phone: data.phone,
          avatar: data.avatar,
        });
      })
      .catch((error) => console.error(error));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!user) return;

    fetch(`http://localhost:3001/users/${user.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...user, ...formData }),
    })
      .then((response) => response.json())
      .then((updatedUser) => {
        setUser(updatedUser);
        setIsEditing(false);
      })
      .catch((error) => console.error("Error al actualizar:", error));
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
      });
    }
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#080616] flex items-center justify-center">
        <h2 className="text-xl font-semibold text-[#2F2FE4] animate-pulse">Cargando...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080616] px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl rounded-2xl border border-[#162E93]/40 bg-[#1A1953]/50 p-8 shadow-2xl backdrop-blur-md">
        
        {/* Etiqueta superior de estilo */}
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#2F2FE4]">
          Perfil de Usuario
        </p>

        {/* Encabezado con foto y nombres */}
        <div className="mt-4 flex flex-col sm:flex-row items-center gap-6 border-b border-[#162E93]/20 pb-6">
          <img 
            src={formData.avatar || "https://placeholder.com"} 
            alt={formData.name} 
            className="w-24 h-24 rounded-full border-2 border-[#2F2FE4] p-0.5 object-cover shadow-lg shadow-[#2F2FE4]/20" 
          />
          <div className="flex-1 w-full text-center sm:text-left">
            {isEditing ? (
              <div className="space-y-2 max-w-md mx-auto sm:mx-0">
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nombre completo"
                  className="w-full text-3xl font-bold text-white border-b border-[#2F2FE4] focus:outline-none bg-[#080616]/40 p-1 rounded-t"
                />
                <div className="flex items-center text-slate-300">
                  <span className="font-semibold mr-1">@</span>
                  <input
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="usuario"
                    className="w-full text-base border-b border-[#2F2FE4] focus:outline-none bg-[#080616]/40 p-1 rounded-t"
                  />
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-3xl font-bold text-white">{user.name}</h1>
                <p className="mt-1 text-slate-300">@{user.username}</p>
              </>
            )}
          </div>
        </div>

        {/* Sección Contenedora de Inputs */}
        <section className="mt-8 rounded-2xl bg-[#080616]/80 p-6 border border-[#2F2FE4]/20">
          <h2 className="text-xl font-semibold text-white mb-6">Información de la cuenta</h2>
          
          <div className="grid gap-6 sm:grid-cols-2">
            {isEditing && (
              <div className="sm:col-span-2">
                <p className="text-sm text-slate-400 mb-1">URL del Avatar</p>
                <input
                  name="avatar"
                  value={formData.avatar}
                  onChange={handleChange}
                  placeholder="https://ejemplo.com"
                  className="w-full border border-[#162E93]/60 bg-[#1A1953]/30 rounded-xl p-2.5 text-white focus:border-[#2F2FE4] focus:outline-none transition-colors"
                />
              </div>
            )}

            <div>
              <p className="text-sm text-slate-400 mb-1">Correo</p>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full border rounded-xl p-2.5 text-white transition-all ${
                  isEditing 
                    ? "border-[#2F2FE4] bg-[#1A1953]/50 shadow-inner" 
                    : "border-[#162E93]/20 bg-[#080616]/40 text-slate-300 opacity-80 cursor-not-allowed"
                }`}
              />
            </div>

            <div>
              <p className="text-sm text-slate-400 mb-1">Teléfono</p>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full border rounded-xl p-2.5 text-white transition-all ${
                  isEditing 
                    ? "border-[#2F2FE4] bg-[#1A1953]/50 shadow-inner" 
                    : "border-[#162E93]/20 bg-[#080616]/40 text-slate-300 opacity-80 cursor-not-allowed"
                }`}
              />
            </div>
          </div>
        </section>

        {/* Acciones del Perfil */}
        <div className="mt-6 flex justify-end gap-3">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className="bg-zinc-800 text-slate-300 px-5 py-2.5 rounded-xl hover:bg-zinc-700 transition-colors border border-zinc-700"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="bg-[#2F2FE4] text-white px-5 py-2.5 rounded-xl hover:bg-[#2020bc] transition-colors font-medium shadow-md shadow-[#2F2FE4]/30"
              >
                Guardar Cambios
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-[#2F2FE4] text-white px-5 py-2.5 rounded-xl hover:bg-[#2020bc] transition-colors font-medium shadow-md shadow-[#2F2FE4]/30"
            >
              Editar Perfil
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default MyAccount;
