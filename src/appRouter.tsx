import { createBrowserRouter, Navigate } from "react-router";
import { HomePage } from "./features/Home/pages/home/HomePage";
import { LoginPage } from "./features/auth/pages/login/LoginPage";
import { RegisterPage } from "./features/auth/pages/register/RegisterPage";
import { HomeLayout } from "./features/Home/layouts/HomeLayout";
import { AdminOnlyRoute, ProtectedRoute, PublicOnlyRoute } from "./shared/components/ProtectedRoute";
import { AdminPage } from "./features/admin/pages/AdminPage";
import { AdminProfilePage } from "./features/admin/pages/AdminProfilePage";
import { AdminLayout } from "./features/admin/layouts/AdminLayout.tsx";
import MyAcount from "./features/Client/pages/MyAcount.tsx";


export const appRouter = createBrowserRouter([
  // 
  // 1. RUTAS PÚBLICAS (Solo para usuarios SIN sesión)
  // 
  {
    element: <PublicOnlyRoute />, 
    children: [
      {
        path: "/",
        element: <HomeLayout />,
        children: [
          {
            path: "login",
            element: <LoginPage />,
          },
          {
            path: "register",
            element: <RegisterPage />,
          },
        ],
      },
    ],
  },

  // 2. RUTAS PÚBLICAS / GENERALES (Accesibles para todos)

  {
    path: "/",
    element: <HomeLayout />,
    children: [
      {
        index: true, // La pantalla principal ("/")
        element: <HomePage />,
      },
    ],
  },

  // 3. RUTAS PRIVADAS (Solo para usuarios CON sesión)
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <HomeLayout />,
        children: [
          {
            path: "perfil",
            element: <MyAcount />,
          },
          {
            path: "checkout",
            element: <div>Página de Compras (Solo Usuarios Logueados)</div>,
          },
        ],
      },
    ],
  },

  // 4. RUTAS PRIVADAS SOLO PARA ADMIN
  {
    element: <AdminOnlyRoute />,
    children: [
      {
        path: "/admin",
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: <AdminPage />,
          },
          {
            path: "perfil",
            element: <AdminProfilePage />,
          },
        ],
      },
    ],
  },

  // CUALQUIER OTRA RUTA REDIRIGE A HOME

  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);