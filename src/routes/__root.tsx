import { Outlet, createRootRoute } from '@tanstack/react-router'
import { Suspense } from 'react'
import { Box, Flex, VStack } from '@/styled-system/jsx'
import { Spinner } from '@/components/ui'
import { GoogleOAuthProvider } from '@react-oauth/google'

// Get client ID from environment
// You must set VITE_GOOGLE_CLIENT_ID in .env.local or .env.production
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID_HERE'

// Log configuration status in development
if (import.meta.env.DEV) {
  if (!clientId || clientId === 'YOUR_GOOGLE_CLIENT_ID_HERE') {
    console.warn('⚠️ Google OAuth not configured. Create .env.local with VITE_GOOGLE_CLIENT_ID')
    console.warn('📖 See OAUTH_SETUP.md for instructions')
  } else {
    console.log('✅ Google OAuth configured')
  }
}

export const Route = createRootRoute({
  component: () => (
    <GoogleOAuthProvider clientId={clientId}>
      <Suspense fallback={
        <Flex 
          alignItems="center" 
          justifyContent="center" 
          minH="100vh"
        >
          <VStack gap="4">
            <Spinner size="lg" />
            <Box color="fg.muted">Loading application...</Box>
          </VStack>
        </Flex>
      }>
        <Outlet />
      </Suspense>
    </GoogleOAuthProvider>
  ),
})