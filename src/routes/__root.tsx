import { Outlet, createRootRoute } from '@tanstack/react-router'
import { Suspense } from 'react'
import { Box, Flex, VStack } from '@/styled-system/jsx'
import { Footer } from '@/components/features/Footer'
import { Spinner } from '@/components/ui'

export const Route = createRootRoute({
  component: () => (
    <Flex direction="column" minH="100vh" bg="bg.default">
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
        <Box flex="1">
          <Outlet />
        </Box>
        <Footer />
      </Suspense>
    </Flex>
  ),
})