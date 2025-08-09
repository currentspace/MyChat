import { Outlet, createRootRoute } from '@tanstack/react-router'
import { Suspense } from 'react'
import { Box, Flex, VStack } from '@/styled-system/jsx'
import { Spinner } from '@/components/ui'
import { GoogleOAuthProvider } from '@react-oauth/google'

// Get client ID from environment
// You must set VITE_GOOGLE_CLIENT_ID in .env.local or .env.production
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID_HERE'

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