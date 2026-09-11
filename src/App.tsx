import { RouterProvider } from 'react-router'
import { appRouter } from './appRouter'
import { ToastProvider } from './shared/hooks/useToast.tsx'

function App() {
  return (
    <ToastProvider>
      <RouterProvider router={appRouter} />
    </ToastProvider>
  )
}

export default App
