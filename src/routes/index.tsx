import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useCallback } from 'react'
import { VStack, Box, HStack, Container } from '@/styled-system/jsx'
import { LandingHero } from '@/components/features/LandingHero'
import { Button, Text } from '@/components/ui'
import { css } from '@/styled-system/css'
import { MessageSquare } from 'lucide-react'
import type { CredentialResponse } from '@react-oauth/google'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  const navigate = useNavigate()

  const handleGoogleSuccess = useCallback(async (credentialResponse: CredentialResponse) => {
    try {
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credential: credentialResponse.credential,
        }),
        credentials: 'include',
      })

      if (response.ok) {
        // Navigate to chat after successful login
        navigate({ to: '/chat' })
      } else {
        console.error('Authentication failed')
      }
    } catch (error) {
      console.error('Login error:', error)
    }
  }, [navigate])

  const handleGoogleError = useCallback(() => {
    console.error('Google login failed')
  }, [])

  return (
    <VStack gap="0" alignItems="stretch" minH="100vh">
      {/* Minimal Header */}
      <Box 
        position="fixed"
        top="0"
        left="0"
        right="0"
        zIndex="50"
        bg="white/80"
        _dark={{ bg: 'gray.900/80' }}
        backdropFilter="blur(10px)"
        borderBottom="1px solid"
        borderColor="border.subtle"
      >
        <Container maxW="7xl">
          <HStack justify="space-between" py="4">
            <HStack gap="2">
              <MessageSquare className={css({ color: 'blue.500' })} size={24} />
              <Text fontWeight="bold" fontSize="xl">MyChat</Text>
            </HStack>
            
            <HStack gap="4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate({ to: '/showcase' })}
              >
                Components
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => window.open('https://github.com/currentspace/MyChat', '_blank')}
              >
                GitHub
              </Button>
            </HStack>
          </HStack>
        </Container>
      </Box>

      {/* Main Content with padding for fixed header */}
      <Box pt="16">
        <LandingHero 
          onGoogleSuccess={handleGoogleSuccess}
          onGoogleError={handleGoogleError}
        />
      </Box>

      {/* Simple Footer */}
      <Box 
        py="6" 
        borderTop="1px solid" 
        borderColor="border.subtle"
        bg="gray.50"
        _dark={{ bg: 'gray.900' }}
      >
        <Container maxW="7xl">
          <HStack justify="space-between" gap="4" className={css({ flexWrap: 'wrap' })}>
            <Text fontSize="sm" color="fg.muted">
              © 2025 MyChat. Built with React 19.1, PandaCSS, and Cloudflare Workers.
            </Text>
            <HStack gap="4">
              <Button variant="link" size="sm" onClick={() => navigate({ to: '/showcase' })}>
                View Components
              </Button>
              <Button 
                variant="link" 
                size="sm"
                onClick={() => window.open('https://docs.anthropic.com', '_blank')}
              >
                API Docs
              </Button>
            </HStack>
          </HStack>
        </Container>
      </Box>
    </VStack>
  )
}