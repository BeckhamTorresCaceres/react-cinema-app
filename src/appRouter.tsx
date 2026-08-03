import { createBrowserRouter, Navigate } from "react-router";
import { HomePage } from "./features/Home/pages/home/HomePage";
import { LoginPage } from "./features/auth/pages/login/LoginPage";
import { RegisterPage } from "./features/auth/pages/register/RegisterPage";
import { HomeLayout } from "./features/Home/layouts/HomeLayout";
import { ProtectedRoute, PublicOnlyRoute } from "./shared/components/ProtectedRoute";

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
    element: <ProtectedRoute />, // <-- Guardia 2: Si NO estás logueado, te manda a Login
    children: [
      {
        path: "/",
        element: <HomeLayout />,
        children: [
          {
            path: "perfil",
            element: <div>Página de Perfil (Solo Usuarios Logueados)</div>,
          },
          {
            path: "checkout",
            element: <div>Página de Compras (Solo Usuarios Logueados)</div>,
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