# Lumi Films

Aplicación web de cartelera de cine desarrollada con React, TypeScript y Vite. Permite explorar películas, consultar funciones y acceder a secciones según el tipo de usuario.

## Características

- Cartelera obtenida desde una API local con películas, horarios, idiomas y formatos.
- Película destacada y navegación entre títulos desde la página de inicio.
- Filtros de cartelera para encontrar películas por sus características.
- Registro e inicio de sesión simulados.
- Sesión persistente en el navegador mediante `localStorage`.
- Rutas protegidas para usuarios autenticados.
- Panel y perfil exclusivos para administradores.
- Diseño responsive con Tailwind CSS y componentes visuales reutilizables.

## Tecnologías

- React 19
- TypeScript
- Vite 8
- React Router 8
- Zustand
- Tailwind CSS 4
- JSON Server

## Requisitos

- Node.js 22.18 o superior. Se recomienda una versión LTS reciente.
- npm (incluido con Node.js).

## Instalación y ejecución

1. Instala las dependencias:

   ```bash
   npm install
   ```

2. Inicia la aplicación y la API mock:

   ```bash
   npm run dev
   ```

3. Abre la dirección indicada por Vite, normalmente [http://localhost:5173](http://localhost:5173).

El comando de desarrollo inicia dos procesos a la vez:

- Vite sirve la interfaz web en el puerto `5173`.
- JSON Server sirve los datos de prueba en el puerto `3001` (o el siguiente disponible).

En Windows, si PowerShell muestra un error de política de ejecución para `npm.ps1`, usa:

```powershell
npm.cmd run dev
```

## Scripts disponibles

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Inicia la interfaz y la API local de datos. |
| `npm run build` | Comprueba TypeScript y genera la versión de producción en `dist/`. |
| `npm run preview` | Sirve localmente la compilación de producción. |
| `npm run lint` | Ejecuta las reglas de ESLint. |

## Cómo funciona

Los datos de películas, roles y usuarios están en [`Json/db.json`](Json/db.json). JSON Server los publica como una API REST local. La aplicación consulta, entre otros, estos recursos:

- `GET /movies`: películas y sus horarios.
- `GET /users?email=...`: usuario usado durante el inicio de sesión.
- `GET /roles`: roles disponibles.

La URL de la API se establece automáticamente al iniciar el proyecto mediante la variable `VITE_API_URL`. El archivo `server.ts` busca un puerto disponible para JSON Server y lo comparte con Vite.

El inicio de sesión es únicamente demostrativo: compara las credenciales con los usuarios de `db.json`, genera un token simulado y guarda la sesión en `localStorage`. No debe usarse como sistema de autenticación en producción.

## Rutas principales

| Ruta | Acceso | Descripción |
| --- | --- | --- |
| `/` | Público | Página principal y cartelera. |
| `/login` | Sin sesión | Inicio de sesión. |
| `/register` | Sin sesión | Registro simulado. |
| `/perfil` | Usuario autenticado | Perfil de cliente. |
| `/checkout` | Usuario autenticado | Pantalla de compras de ejemplo. |
| `/admin` | Administrador | Panel de administración. |
| `/admin/perfil` | Administrador | Perfil del administrador. |

Las rutas privadas redirigen a quienes no tengan sesión. Las rutas de administración requieren un usuario con rol `admin`.

## Usuarios de prueba

Los datos iniciales están definidos en `Json/db.json`:

| Rol | Correo | Contraseña |
| --- | --- | --- |
| Administrador | `admin@s.com` | `admin123` |
| Cliente | `cliente@gmail.com` | `Cliente123*` |

## Estructura del proyecto

```text
src/
  features/       # Módulos: inicio, autenticación, cartelera, cliente y admin
  components/     # Componentes visuales reutilizables
  services/       # Cliente de API y endpoints
  shared/         # Interfaces y protección de rutas
Json/db.json      # Base de datos mock
server.ts         # Arranque coordinado de Vite y JSON Server
```

## Nota de desarrollo

Al modificar `Json/db.json`, JSON Server detecta los cambios automáticamente. Para cerrar ambos servidores, presiona `Ctrl + C` en la terminal donde ejecutaste `npm run dev`.
