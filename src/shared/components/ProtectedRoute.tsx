//Revisa el estado de autenticación en el authStore.  Si el usuario NO tiene sesión activa y quiere entrar a una ruta privada (ej. /profile, /checkout), lo redirige automáticamente a /login.  Si SÍ está autenticado, lo deja pasar (<Outlet/>).


import { Navigate, Outlet } from 'react-router';
import { useAuthStore } from '../../features/auth/store/authStore';
export const ProtectedRoute = () => {
  const { isAuthenticated } = useAuthStore();

  // Si no hay sesión activa, redirige al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si hay sesión, muestra el contenido de la ruta privada
  return <Outlet />;
};

export const PublicOnlyRoute = () => {
  const { isAuthenticated } = useAuthStore();

  // Si YA está autenticado, no lo dejamos ver Login/Register y lo enviamos al Home
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};