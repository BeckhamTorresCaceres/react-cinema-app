# Lumi Films - React Cinema App

Aplicación de cine construida con React, TypeScript y Vite. Incluye autenticación mock, roles de usuario, rutas protegidas, panel de administración y perfil de usuario.

## Tecnologías
- React 19
- TypeScript
- Vite
- React Router 8
- Tailwind CSS
- Zustand
- JSON Server / `Json/db.json` para datos mock

## Cómo ejecutar
1. Instala dependencias:
   ```bash
   npm install
   ```
2. Inicia la aplicación:
   ```bash
   npm run dev
   ```
3. Abre la URL que muestre Vite.

## Estructura principal
- `src/`: código de la aplicación.
- `src/features/`: funcionalidad por módulos.
  - `auth/`: login, registro y store de autenticación.
  - `Home/`: layout público, home y navegación.
  - `admin/`: panel y perfil de administrador.
- `src/shared/`: componentes reutilizables y rutas protegidas.
- `Json/db.json`: datos de usuarios y roles.
- `server.js`: servidor de desarrollo / API mock.

## Funcionalidades actuales
- Login y registro de usuario.
- Persistencia de sesión con `localStorage` (`token` y `user`).
- Logout que limpia la sesión.
- Rutas públicas, privadas y exclusivas para admin.
- Menú responsive con botones de login, registro y logout.
- Muestra el nombre de usuario en la cabecera.
- Perfil de usuario y perfil de admin.

## Rutas principales
- `/` - Home público.
- `/login` - Login para usuarios.
- `/register` - Registro.
- `/perfil` - Perfil privado de cliente (solo usuarios autenticados).
- `/checkout` - Ruta privada de checkout.
- `/admin` - Panel admin (solo admin).
- `/admin/perfil` - Perfil de administrador.

## Comportamiento de roles
- Cliente autenticado ve su nombre en la cabecera y puede acceder a `/perfil`.
- Admin autenticado ve su nombre en el panel de admin y tiene acceso a `/admin` y `/admin/perfil`.
- `ProtectedRoute` protege rutas privadas.
- `AdminOnlyRoute` protege rutas exclusivas de admin.

## Datos mock
El archivo `Json/db.json` contiene:
- Roles: `admin`, `client`.
- Usuarios:
  - `admin@gmail.com` / `Admin123*` (rol `admin`)
  - `cliente@gmail.com` / `Cliente123*` (rol `client`)

## Autenticación
- `src/features/auth/store/authStore.ts` gestiona la sesión.
- `login()` busca el usuario por email en la API mock.
- `logout()` borra `token` y `user` de `localStorage`.
- El nombre de usuario se muestra en `HomeLayout` y `AdminLayout`.

## Puntos clave del código
- `src/appRouter.tsx`: define la navegación y rutas protegidas.
- `src/features/Home/layouts/HomeLayout.tsx`: cabecera principal, menu responsive, logout.
- `src/features/admin/layouts/AdminLayout.tsx`: panel admin con nombre y logout.
- `src/features/admin/pages/AdminPage.tsx`: dashboard admin.
- `src/features/admin/pages/AdminProfilePage.tsx`: perfil de admin.

## Comandos útiles
- `npm install`
- `npm run dev`
- `npm run build`
- `npm run lint`

## Notas
- El perfil admin está en `/admin/perfil`.
- El perfil del cliente está en `/perfil`.
- El nombre de usuario se mantiene visible tras recargar si la sesión está activa.
