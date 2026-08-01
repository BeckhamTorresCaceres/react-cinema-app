import { useState } from "react";
import { Link } from "react-router";

export const RegisterPage = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState({ name: '', email: '', password: '', confirmPassword: '' })

  const validate = () => {
    const newErrors = { name: '', email: '', password: '', confirmPassword: '' }

    if (!name) {
      newErrors.name = 'El nombre es requerido'
    }

    if (!email) {
      newErrors.email = 'El correo es requerido'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'El correo no tiene un formato válido'
    }

    if (!password) {
      newErrors.password = 'La contraseña es Requerida'
    } else if (password.length < 8) {
      newErrors.password = 'La contraseña debe tener mínimo 8 caracteres'
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'La contraseña es Requerida'
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'La contraseñas no coinciden'
    }

    setErrors(newErrors)

    return !newErrors.name && !newErrors.email && !newErrors.password && !newErrors.confirmPassword
  }

  const handleSubmit = (event: any) => {
    event.preventDefault()
    validate()
  }



  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-gradient-to-b from-black via-zinc-900 to-black px-6">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-900/80 p-8 shadow-2xl backdrop-blur">
        <h1 className="text-center text-3xl font-bold text-white">
          Crear Cuenta
        </h1>

        <p className="mt-2 text-center text-gray-400">
          Únete a nuestra plataforma.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm text-gray-300">
              Nombre
            </label>

            <input
              type="text"
              placeholder="Juan Pérez"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-white outline-none transition focus:border-red-500"
            />
            {errors.name && (
              <p className="text-red-400 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-300">
              Correo electrónico
            </label>

            <input
              type="email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-white outline-none transition focus:border-red-500"
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-300">
              Contraseña
            </label>

            <input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-white outline-none transition focus:border-red-500"
            />
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-300">
              Confirmar contraseña
            </label>

            <input
              type="password"
              placeholder="********"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-white outline-none transition focus:border-red-500"
            />
            {errors.confirmPassword && (
              <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-red-600 py-3 font-semibold transition hover:bg-red-700"
          >
            Crear Cuenta
          </button>
        </form>

        <p className="mt-6 text-center text-gray-400">
          ¿Ya tienes una cuenta?{" "}
          <Link
            to="/login"
            className="font-semibold text-red-500 hover:underline"
          >
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
};