//Revisa el estado de autenticación en el authStore.  Si el usuario NO tiene sesión activa y quiere entrar a una ruta privada (ej. /profile, /checkout), lo redirige automáticamente a /login.  Si SÍ está autenticado, lo deja pasar (<Outlet/>).


import { Navigate, Outlet } from 'react-router';
import { useAuthStore } from '../../features/auth/store/authStore';

export const ProtectedRoute = () => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export const PublicOnlyRoute = () => {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export const AdminOnlyRoute = () => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};