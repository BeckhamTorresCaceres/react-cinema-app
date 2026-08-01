
import React, { useState } from 'react'

export const LoginPage = () => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({ email: '', password: '' })


  const validate = () => {
    const newErrors = { email: '', password: '' }

    if (!email) {
      newErrors.email = 'El Correo es requerido'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'El Correo no tiene un formato valido'
    }

    if (!password) {
      newErrors.password = 'La contraseña es Requerida'
    } else if (password.length < 8) {
      newErrors.password = 'La contraseña debe tener mínimo 8 caracteres'
    }

    setErrors(newErrors)

    return !newErrors.email && !newErrors.password
  }

  const handleSubmit = (event: any) => {
    event.preventDefault()
    validate()
  }


  return (
    <div className="flex-1 min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-red-950 to-black">
      <form
        onSubmit={handleSubmit}
        className="bg-mauve-600/40 p-8 flex flex-col rounded-2xl shadow-xl w-full max-w-sm border border-blue-900">
        <h1 className="text-amber-50 text-2xl font-bold mb-6 text-center">
          Bienvenido a tu cine favorito
        </h1>



        <div className="flex flex-col space-y-4">
          <div>
            <input
              type="email"
              name='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white px-4 py-2 rounded-lg text-slate-900 outline-none focus:ring-2 focus:ring-amber-400 placeholder-slate-400 w-full"
              placeholder="Correo electrónico"
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email}</p>
            )}
          </div>


          <div>
            <input
              type="password"
              name='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white px-4 py-2 rounded-lg text-slate-900 outline-none focus:ring-2 focus:ring-amber-400 placeholder-slate-400 w-full"
              placeholder="contraseña"
            />
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">{errors.password}</p>
            )}
          </div>


        </div>

        <button

          type="submit"
          className="bg-amber-50 hover:bg-amber-100 text-blue-950 font-semibold py-2 rounded-lg mt-6 transition-colors duration-200"
        >
          Iniciar sesión
        </button>
      </form>
    </div>

  )
}
export default LoginPage