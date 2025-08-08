import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { AuthProvider } from './lib/auth/auth-context'
import './index.css'

const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// Get Google Client ID from environment variable or use production ID
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '408880521733-e8ihlauq0ueonk84dsfikiolhfvft8h1.apps.googleusercontent.com'

// Debug: Log the client ID to ensure it's set
if (!GOOGLE_CLIENT_ID) {
  console.error('Google Client ID is not set!')
} else {
  console.log('Google Client ID configured:', GOOGLE_CLIENT_ID.substring(0, 10) + '...')
}

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Root element not found')

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <AuthProvider clientId={GOOGLE_CLIENT_ID}>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
)