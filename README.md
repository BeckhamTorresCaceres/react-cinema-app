# Lumi Films

Lumi Films es una aplicación web de cine construida con React y TypeScript. Permite consultar la cartelera, elegir una función, seleccionar asientos, agregar productos de confitería y completar un checkout simulado. También incluye autenticación, membresías y un panel de administración.

## Funcionalidades implementadas

### Experiencia del cliente

- Página de inicio con película destacada y cartelera.
- Filtros de películas por fecha, idioma, formato y características disponibles.
- Vista de detalle de cada película y selector de funciones.
- Selector de ubicación con países, ciudades y complejos de cine.
- Selección visual de asientos según la sala y su distribución.
- Confitería con búsqueda, categorías, productos disponibles y carrito.
- Flujo de compra que reúne entradas y productos antes del checkout.
- Cuenta de usuario con información del perfil.
- Página de beneficios de la membresía.
- Notificaciones y modales reutilizables para confirmar acciones o advertir sobre reservas.

### Autenticación y permisos

- Inicio de sesión y registro conectados a la API mock.
- Sesión persistente con Zustand y `localStorage`.
- Rutas públicas exclusivas para usuarios sin sesión (`/login` y `/register`).
- Rutas protegidas para clientes autenticados.
- Rutas de administración restringidas al rol `admin`.
- Token simulado generado a partir del identificador del usuario.

### Administración

- Dashboard administrativo.
- Listado y gestión de películas.
- Modal para crear o editar películas.
- Modal de detalle y confirmación de eliminación.
- Listado de usuarios.
- Perfil del administrador.

## Tecnologías y librerías

- React 19 y React DOM.
- TypeScript 6.
- Vite 8.
- React Router 8 para la navegación.
- Zustand para el estado global de autenticación y sesión.
- Axios para las peticiones HTTP.
- Tailwind CSS 4 para los estilos.
- Lucide React para iconos.
- GSAP y Three.js para componentes y efectos visuales.
- JSON Server como API REST local de prueba.
- ESLint para revisión estática del código.

## Requisitos

- Node.js 22.18 o superior. Se recomienda una versión LTS reciente.
- npm, incluido con Node.js.

## Instalación y ejecución

1. Instala las dependencias:

   ```bash
   npm install
   ```

2. Inicia la aplicación y la API mock:

   ```bash
   npm run dev
   ```

3. Abre la URL mostrada por Vite, normalmente [http://localhost:5173](http://localhost:5173).

El script de desarrollo ejecuta `server.ts`, que inicia dos procesos coordinados:

- Vite sirve la interfaz web.
- JSON Server publica `Json/db.json` como API REST.
- La API intenta usar el puerto `3001`; si está ocupado, busca automáticamente el siguiente puerto disponible.
- La variable `VITE_API_URL` se comparte con la aplicación para que Axios utilice el puerto elegido.

En Windows, si PowerShell muestra un error de política de ejecución para `npm.ps1`, ejecuta:

```powershell
npm.cmd run dev
```

## Scripts disponibles

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Inicia Vite y JSON Server mediante `server.ts`. |
| `npm run build` | Ejecuta la comprobación de TypeScript y genera `dist/`. |
| `npm run lint` | Ejecuta ESLint en el proyecto. |
| `npm run preview` | Sirve localmente la compilación de producción. |

## Rutas de la aplicación

| Ruta | Acceso | Descripción |
| --- | --- | --- |
| `/` | Público | Inicio y cartelera. |
| `/login` | Sin sesión | Inicio de sesión. |
| `/register` | Sin sesión | Registro de cliente. |
| `/Movie/:movieId` | Público | Detalle de una película y sus funciones. |
| `/confiteria` | Público | Catálogo de productos de confitería. |
| `/benefits-membership` | Público | Beneficios de la membresía. |
| `/perfil` | Cliente autenticado | Perfil y cuenta del usuario. |
| `/asientos` | Cliente autenticado | Selección de asientos. |
| `/checkout` | Cliente autenticado | Resumen y finalización de la compra. |
| `/admin` | Administrador | Dashboard administrativo. |
| `/admin/movies` | Administrador | Gestión de películas. |
| `/admin/users` | Administrador | Gestión y consulta de usuarios. |
| `/admin/perfil` | Administrador | Perfil del administrador. |

Cualquier ruta desconocida redirige a `/`. Las rutas privadas redirigen a los usuarios que no tienen sesión y las rutas administrativas validan el rol `admin`.

## API local y datos de prueba

La información inicial está en [`Json/db.json`](Json/db.json). JSON Server expone estos recursos:

| Recurso | Uso |
| --- | --- |
| `/roles` | Roles de administrador y cliente. |
| `/users` | Usuarios, credenciales y perfiles. |
| `/countries` | Países disponibles. |
| `/cities` | Ciudades relacionadas con cada país. |
| `/cinemas` | Complejos de cine y direcciones. |
| `/rooms` | Salas, formatos y distribución de asientos. |
| `/movies` | Películas y su información de cartelera. |
| `/showtimes` | Funciones, horarios y relación con películas y salas. |
| `/tickets` | Entradas y compras asociadas al usuario. |
| `/snacks` | Productos de confitería y categorías. |
| `/membershipBenefits` | Beneficios de membresía. |

La capa de servicios centraliza los endpoints en `src/services/endpoints.ts` y las peticiones en `src/services/http.ts`. La URL base usa `VITE_API_URL` y, si no existe, utiliza `http://localhost:3001`.

Al modificar `Json/db.json`, JSON Server detecta los cambios automáticamente. Para cerrar Vite y JSON Server, presiona `Ctrl + C` en la terminal donde ejecutaste el comando de desarrollo.

## Usuarios de prueba

Los usuarios iniciales están definidos en `Json/db.json`:

| Rol | Correo | Contraseña |
| --- | --- | --- |
| Administrador | `admin@s.com` | `admin123` |
| Cliente | `cliente@gmail.com` | `Cliente123*` |

El registro crea usuarios nuevos con el rol `client` y estado activo.

## Arquitectura del proyecto

El código está organizado por funcionalidades para mantener juntas las páginas, componentes, hooks, servicios y tipos de cada dominio:

```text
src/
  features/
    admin/          # Dashboard, películas, usuarios y perfil administrativo
    auth/           # Login, registro y estado de autenticación
    billboard/      # Cartelera, filtros, funciones y detalle de películas
    checkout/       # Resumen y finalización de compra
    client/         # Cuenta y beneficios de membresía
    confiteria/     # Catálogo y carrito de productos
    home/           # Página principal y layout general
    locations/      # Selección de país, ciudad y cine
    seats/          # Mapa y selección de asientos
    users/          # Servicios y tipos de usuarios
  services/         # Configuración, endpoints y cliente HTTP común
  shared/           # Componentes, hooks, interfaces y utilidades compartidas
  components/       # Componentes visuales reutilizables
  appRouter.tsx     # Definición de rutas y protecciones
  App.tsx           # Providers y RouterProvider
Json/db.json        # Base de datos mock
server.ts           # Arranque coordinado de Vite y JSON Server
```

Los componentes visuales compartidos incluyen `DriftWall`, `ElectricBorder`, `MagicRings` y `StrokeText`. La aplicación también incorpora un `ToastProvider` global para mostrar mensajes de operación.

## Limitaciones del entorno demostrativo

- La autenticación no cifra contraseñas ni genera tokens reales.
- Las credenciales están almacenadas en el archivo de datos local.
- El checkout y la reserva no procesan pagos reales.
- JSON Server reemplaza a un backend persistente y multiusuario.
- `localStorage` se utiliza únicamente para conservar la sesión en el navegador local.

Para producción sería necesario incorporar un backend real, autenticación segura, base de datos, control de concurrencia para asientos, pasarela de pagos y validaciones del lado del servidor.
