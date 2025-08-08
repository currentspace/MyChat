import { Box, Container, Flex, HStack, VStack } from '@/styled-system/jsx'
import { Button, Badge, Text } from '@/components/ui'
import { ArrowRight, Sparkles, Zap, Shield, Layers } from 'lucide-react'
import { css } from '@/styled-system/css'

export function HeroSection() {
  return (
    <Box 
      className={css({
        background: 'linear-gradient(135deg, var(--colors-blue-50) 0%, var(--colors-purple-50) 100%)',
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '1px solid',
        borderColor: 'border.default',
      })}
    >
      {/* Background decoration */}
      <Box
        className={css({
          position: 'absolute',
          top: '-50%',
          right: '-10%',
          width: '60%',
          height: '200%',
          background: 'radial-gradient(circle, var(--colors-blue-100) 0%, transparent 70%)',
          opacity: 0.3,
          pointerEvents: 'none',
        })}
      />
      
      <Container maxW="7xl" py={{ base: '16', md: '24' }}>
        <VStack gap="8" alignItems="center" textAlign="center" position="relative">
          {/* Badge */}
          <HStack gap="2">
            <Badge variant="outline" colorPalette="blue">
              <Sparkles size={14} />
              <Text ml="1">Park UI + React 19.1</Text>
            </Badge>
            <Badge variant="subtle">v1.0.0</Badge>
          </HStack>

          {/* Main Heading */}
          <VStack gap="4">
            <Text 
              as="h1" 
              fontSize={{ base: '4xl', md: '6xl' }}
              fontWeight="bold"
              lineHeight="1.1"
              bgGradient="linear(to-r, blue.600, purple.600)"
              bgClip="text"
            >
              Build Modern Apps
              <br />
              with Park UI Components
            </Text>
            
            <Text 
              fontSize={{ base: 'lg', md: 'xl' }}
              color="fg.muted"
              maxW="2xl"
            >
              A complete UI toolkit built with React 19.1, PandaCSS, and Ark UI.
              Production-ready components with built-in accessibility and beautiful design.
            </Text>
          </VStack>

          {/* CTA Buttons */}
          <HStack gap="4" flexWrap="wrap" justify="center">
            <Button size="lg" variant="solid">
              Get Started
              <ArrowRight size={20} />
            </Button>
            <Button size="lg" variant="outline">
              View Components
            </Button>
          </HStack>

          {/* Feature Pills */}
          <HStack gap="6" flexWrap="wrap" justify="center" mt="8">
            <Flex alignItems="center" gap="2">
              <Box color="blue.500">
                <Zap size={20} />
              </Box>
              <Text fontSize="sm" fontWeight="medium">Lightning Fast</Text>
            </Flex>
            
            <Flex alignItems="center" gap="2">
              <Box color="green.500">
                <Shield size={20} />
              </Box>
              <Text fontSize="sm" fontWeight="medium">Type Safe</Text>
            </Flex>
            
            <Flex alignItems="center" gap="2">
              <Box color="purple.500">
                <Layers size={20} />
              </Box>
              <Text fontSize="sm" fontWeight="medium">50+ Components</Text>
            </Flex>
          </HStack>

          {/* Tech Stack */}
          <VStack gap="2" mt="8">
            <Text fontSize="xs" color="fg.muted" textTransform="uppercase" letterSpacing="wide">
              Powered By
            </Text>
            <HStack gap="6" opacity="0.8">
              <Text fontSize="sm" fontWeight="medium">React 19.1</Text>
              <Text fontSize="sm" fontWeight="medium">•</Text>
              <Text fontSize="sm" fontWeight="medium">PandaCSS</Text>
              <Text fontSize="sm" fontWeight="medium">•</Text>
              <Text fontSize="sm" fontWeight="medium">Ark UI</Text>
              <Text fontSize="sm" fontWeight="medium">•</Text>
              <Text fontSize="sm" fontWeight="medium">Vite</Text>
              <Text fontSize="sm" fontWeight="medium">•</Text>
              <Text fontSize="sm" fontWeight="medium">Cloudflare</Text>
            </HStack>
          </VStack>
        </VStack>
      </Container>
    </Box>
  )
}