# React Movie Project

Este proyecto es una base inicial para desarrollar una aplicación en React con Vite y TypeScript.

## Tecnologías incluidas
- React 19
- Vite
- TypeScript
- React Router
- Tailwind CSS

## Cómo empezar
1. Instala las dependencias:
   ```bash
   npm install
   ```
2. Inicia el proyecto en modo desarrollo:
   ```bash
   npm run dev
   ```
3. Abre la URL que muestra Vite en el navegador.

## Estructura principal
- src/: contiene la lógica principal de la aplicación.
- src/features/: organiza las funcionalidades por módulos, como auth.
- src/shared/: componentes y utilidades reutilizables.
- src/assets/: recursos estáticos como imágenes y estilos.

## Recomendación para trabajar
- Coloca cada funcionalidad en su propia carpeta dentro de src/features.
- Usa src/shared para elementos que se reutilicen en varias vistas.
- Los routes principales se manejan desde src/appRouter.tsx.

Esta estructura sirve como punto de partida para construir la aplicación de forma ordenada y escalable.
