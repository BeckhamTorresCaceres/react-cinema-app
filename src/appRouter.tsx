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
import { ConfiteriaPage } from "./features/confiteria/page/ConfiteriaPage.tsx";
import { MovieDetailsPage } from "./features/billboard/pages/MovieDetailsPage.tsx";
import { SeatSelectionPage } from "./features/seats/pages/SeatSelectionPage.tsx";
import { AdminMoviesPage } from "./features/admin/pages/AdminMoviesPage.tsx";

import { BenefitsMembership } from "./features/Client/pages";


export const appRouter = createBrowserRouter([
  // 1. RUTAS PÚBLICAS (Solo usuarios SIN sesión)
  {
    element: <PublicOnlyRoute />,
    children: [
      {
        path: "/",
        element: <HomeLayout />,
        children: [
          { path: "login", element: <LoginPage /> },
          { path: "register", element: <RegisterPage /> },
        ],
      },
    ],
  },

  // 2. RUTAS PÚBLICAS GENERALES
  {
    path: "/",
    element: <HomeLayout />,
    children: [
      {
        index: true, // La pantalla principal ("/")
        element: <HomePage />,
      },
      {
        path: "confiteria",
        element: <ConfiteriaPage />,
      },
      {
        path: "Movie/:movieId",
        element: <MovieDetailsPage />,
      },
      {
        path: "asientos",
        element: <SeatSelectionPage />,
      },
      {
        path: "benefits-membership",
        element: <BenefitsMembership />,
      }
    ],
  },

  // 3. RUTAS PRIVADAS CLIENTES
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <HomeLayout />,
        children: [
          { path: "perfil", element: <MyAcount /> },
          { path: "checkout", element: <div>Página de Compras</div> },
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
          { index: true, element: <AdminPage /> },
          { path: "movies", element: <AdminMoviesPage /> },
          { path: "perfil", element: <AdminProfilePage /> },
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
