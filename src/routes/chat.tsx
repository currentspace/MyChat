import { createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'
import { useCurrentUser } from '@/lib/auth/auth-hooks'
import { VStack } from '@/styled-system/jsx'
import { ModernChatInterface } from '@/components/features/ModernChatInterface'
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

  return <ModernChatInterface user={user} />
}

function ChatPage() {
  return (
    <Suspense 
      fallback={
        <VStack justify="center" h="100vh">
          <Spinner size="lg" />
          <span className={css({ color: 'fg.muted' })}>Loading chat...</span>
        </VStack>
      }
    >
      <ChatContent />
    </Suspense>
  )
}