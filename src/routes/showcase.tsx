import { createFileRoute } from '@tanstack/react-router'
import { Container, VStack, Box } from '@/styled-system/jsx'
import { Heading, Text } from '@/components/ui'
import { ComponentShowcase } from '@/components/features/ComponentShowcase'
import { css } from '@/styled-system/css'

export const Route = createFileRoute('/showcase')({
  component: ShowcasePage,
})

function ShowcasePage() {
  return (
    <Box minH="100vh" bg="background">
      <Container maxW="7xl" py="12">
        <VStack gap="8" alignItems="stretch">
          <VStack gap="3" textAlign="center">
            <Heading size="4xl">Component Showcase</Heading>
            <Text 
              className={css({ 
                fontSize: 'lg', 
                color: 'fg.muted',
                maxW: '2xl',
                mx: 'auto' 
              })}
            >
              Explore all the Park UI components and patterns used in MyChat
            </Text>
          </VStack>
          
          <ComponentShowcase />
        </VStack>
      </Container>
    </Box>
  )
}