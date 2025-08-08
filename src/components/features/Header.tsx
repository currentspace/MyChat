import { Box, Container, HStack } from '@/styled-system/jsx'
import { Button } from '@/components/ui/styled/button'
import { LoginButton } from './LoginButton'
import { css } from '@/styled-system/css'
import { MessageSquare } from 'lucide-react'

export function Header() {
  return (
    <Box
      className={css({
        borderBottom: '1px solid',
        borderColor: 'border.default',
        bg: 'background',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backdropFilter: 'blur(10px)',
        bgColor: 'white/80',
        _dark: {
          bgColor: 'gray.900/80'
        }
      })}
    >
      <Container maxW="7xl" py="3">
        <HStack justify="space-between">
          <HStack gap="8">
            <HStack gap="2">
              <MessageSquare className={css({ color: 'blue.500' })} />
              <span className={css({ fontWeight: 'bold', fontSize: 'xl' })}>
                MyChat
              </span>
            </HStack>
            <HStack gap="4" display={{ base: 'none', md: 'flex' }}>
              <Button variant="ghost" size="sm">Features</Button>
              <Button variant="ghost" size="sm">Components</Button>
              <Button variant="ghost" size="sm">Docs</Button>
            </HStack>
          </HStack>
          <LoginButton />
        </HStack>
      </Container>
    </Box>
  )
}