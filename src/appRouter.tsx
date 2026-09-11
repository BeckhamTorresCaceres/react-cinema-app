import { createBrowserRouter, Navigate } from "react-router";
import { HomePage } from "./features/home/pages/HomePage";
import { LoginPage } from "./features/auth/pages/LoginPage";
import { RegisterPage } from "./features/auth/pages/RegisterPage";
import { HomeLayout } from "./features/home/layouts/HomeLayout";
import { AdminOnlyRoute, ProtectedRoute, PublicOnlyRoute } from "./shared/components/ProtectedRoute";
import { AdminPage } from "./features/admin/pages/AdminPage";
import { AdminProfilePage } from "./features/admin/pages/AdminProfilePage";
import { AdminLayout } from "./features/admin/layouts/AdminLayout.tsx";
import   MyAccount from "./features/client/pages/MyAccount.tsx";
import { ConfiteriaPage } from "./features/confiteria/pages/ConfiteriaPage.tsx";
import { MovieDetailsPage } from "./features/billboard/pages/MovieDetailsPage.tsx";
import { SeatSelectionPage } from "./features/seats/pages/SeatSelectionPage.tsx";
import { AdminMoviesPage } from "./features/admin/pages/AdminMoviesPage.tsx";
import { AdminUsersPage } from "./features/admin/pages/AdminUserPage.tsx";
import { CheckoutPage } from "./features/checkout/pages/CheckoutPage.tsx";

import { BenefitsMembership } from "./features/client/pages";


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
        path: "benefits-membership",
        element: <BenefitsMembership />,
      }
    ],
  },

  // 3. RUTAS PRIVADAS CLIENTES (requieren sesión activa)
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <HomeLayout />,
        children: [
          { path: "perfil", element: <MyAccount /> },
          { path: "asientos", element: <SeatSelectionPage /> },
          { path: "checkout", element: <CheckoutPage /> },
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
          { path: "users", element: <AdminUsersPage /> },
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
