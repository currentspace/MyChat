import { createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'
import { useCurrentUser } from '@/lib/auth/auth-hooks'
import { Container, VStack, Box } from '@/styled-system/jsx'
import { Header } from '@/components/features/Header'
import { ChatInterface } from '@/components/features/ChatInterface'
import { Spinner } from '@/components/ui'
import { css } from '@/styled-system/css'

export const Route = createFileRoute('/chat')({
  component: ChatPage,
})

function ChatContent() {
  const user = useCurrentUser()
  
  if (!user) {
    throw new Error('User not authenticated')
  }

  return <ChatInterface user={user} />
}

function ChatPage() {
  return (
    <VStack gap="0" alignItems="stretch" minH="100vh">
      <Header />
      <Box flex="1" bg="gray.50" _dark={{ bg: 'gray.900' }}>
        <Container maxW="7xl" py="6" h="full">
          <Suspense 
            fallback={
              <VStack justify="center" h="full">
                <Spinner size="lg" />
                <span className={css({ color: 'fg.muted' })}>Loading chat...</span>
              </VStack>
            }
          >
            <ChatContent />
          </Suspense>
        </Container>
      </Box>
    </VStack>
  )
}