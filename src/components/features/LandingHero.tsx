import { VStack, Box, Container, HStack, Grid } from '@/styled-system/jsx'
import { Heading, Text, Button } from '@/components/ui'
import { css } from '@/styled-system/css'
import { GoogleLogin, CredentialResponse } from '@react-oauth/google'
import { useNavigate } from '@tanstack/react-router'
import { MessageSquare, Sparkles, MapPin, Shield, Zap, Brain } from 'lucide-react'

interface LandingHeroProps {
  onGoogleSuccess: (credentialResponse: CredentialResponse) => void
  onGoogleError: () => void
}

export function LandingHero({ onGoogleSuccess, onGoogleError }: LandingHeroProps) {
  const navigate = useNavigate()

  return (
    <Box 
      minH="100vh" 
      className={css({
        background: 'linear-gradient(to bottom, var(--colors-gray-50), var(--colors-background))',
        _dark: {
          background: 'linear-gradient(to bottom, var(--colors-gray-900), var(--colors-background))'
        }
      })}
    >
      <Container maxW="7xl" py={{ base: 12, md: 20 }}>
        <Grid 
          gridTemplateColumns={{ base: '1fr', lg: '1fr 1fr' }}
          gap={{ base: 12, lg: 16 }}
          alignItems="center"
          minH="70vh"
        >
          {/* Left side - Hero content */}
          <VStack gap="8" alignItems={{ base: 'center', lg: 'start' }}>
            <VStack gap="4" alignItems={{ base: 'center', lg: 'start' }} textAlign={{ base: 'center', lg: 'left' }}>
              <HStack gap="2" className={css({ color: 'blue.600', _dark: { color: 'blue.400' } })}>
                <MessageSquare size={24} />
                <Text fontWeight="semibold" fontSize="lg">MyChat AI Assistant</Text>
              </HStack>
              
              <Heading 
                size={{ base: '4xl', md: '5xl' }}
                className={css({
                  lineHeight: '1.1',
                  background: 'linear-gradient(to right, var(--colors-gray-900), var(--colors-blue-600))',
                  backgroundClip: 'text',
                  color: 'transparent',
                  _dark: {
                    background: 'linear-gradient(to right, var(--colors-gray-100), var(--colors-blue-400))',
                    backgroundClip: 'text'
                  }
                })}
              >
                Chat with GPT-4 & Claude
              </Heading>
              
              <Text 
                fontSize={{ base: 'lg', md: 'xl' }}
                color="fg.muted"
                maxW="xl"
              >
                Experience the power of advanced AI models with location-aware responses, 
                streaming chat, and a beautiful modern interface.
              </Text>
            </VStack>

            {/* Sign in section */}
            <VStack gap="4" w="full" maxW={{ base: 'sm', lg: 'md' }}>
              <Box 
                p="6" 
                borderRadius="xl"
                bg="white"
                _dark={{ bg: 'gray.800' }}
                boxShadow="lg"
                w="full"
              >
                <VStack gap="4">
                  <Text fontWeight="medium" fontSize="lg">Get started in seconds</Text>
                  
                  {import.meta.env.VITE_GOOGLE_CLIENT_ID && 
                   import.meta.env.VITE_GOOGLE_CLIENT_ID !== 'YOUR_GOOGLE_CLIENT_ID_HERE' ? (
                    <>
                      <Box className={css({ 
                        '& > div': { w: 'full' },
                        '& iframe': { w: 'full !important' }
                      })}>
                        <GoogleLogin
                          onSuccess={onGoogleSuccess}
                          onError={onGoogleError}
                          theme="outline"
                          size="large"
                          width={320}
                          text="continue_with"
                          shape="rectangular"
                        />
                      </Box>
                      
                      <Text fontSize="xs" color="fg.muted" textAlign="center">
                        Secure authentication with Google OAuth 2.0
                      </Text>
                    </>
                  ) : (
                    <VStack gap="3" p="4" borderRadius="md" bg="orange.50" _dark={{ bg: 'orange.900' }}>
                      <Text fontSize="sm" fontWeight="medium" color="orange.800" _dark={{ color: 'orange.200' }}>
                        OAuth Setup Required
                      </Text>
                      <Text fontSize="xs" color="orange.700" _dark={{ color: 'orange.300' }} textAlign="center">
                        Google OAuth is not configured. Please follow the setup guide to enable sign-in.
                      </Text>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => window.open('/OAUTH_SETUP.md', '_blank')}
                      >
                        View Setup Guide
                      </Button>
                    </VStack>
                  )}
                </VStack>
              </Box>

              <HStack gap="6" justify="center" className={css({ flexWrap: 'wrap' })}>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate({ to: '/showcase' })}
                >
                  View Components
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => window.open('https://github.com/currentspace/MyChat', '_blank')}
                >
                  GitHub
                </Button>
              </HStack>
            </VStack>
          </VStack>

          {/* Right side - Feature grid */}
          <Box>
            <Grid gridTemplateColumns="repeat(2, 1fr)" gap="4">
              <FeatureCard
                icon={<Sparkles />}
                title="GPT-4 Turbo"
                description="Latest OpenAI model with enhanced capabilities"
                color="blue"
              />
              <FeatureCard
                icon={<Brain />}
                title="Claude 3.5"
                description="Anthropic's advanced reasoning model"
                color="purple"
              />
              <FeatureCard
                icon={<MapPin />}
                title="Location Aware"
                description="Get contextual responses based on your location"
                color="green"
              />
              <FeatureCard
                icon={<Zap />}
                title="Real-time Streaming"
                description="See responses as they're generated"
                color="orange"
              />
            </Grid>

            {/* Security badge */}
            <Box 
              mt="6" 
              p="4" 
              borderRadius="lg"
              bg="gray.50"
              _dark={{ bg: 'gray.900' }}
              borderWidth="1px"
              borderColor="border.subtle"
            >
              <HStack gap="3">
                <Shield className={css({ color: 'green.500' })} size={20} />
                <VStack gap="0" alignItems="start" flex="1">
                  <Text fontSize="sm" fontWeight="medium">Enterprise Security</Text>
                  <Text fontSize="xs" color="fg.muted">
                    Your data is encrypted and never stored. API keys secured in Cloudflare.
                  </Text>
                </VStack>
              </HStack>
            </Box>
          </Box>
        </Grid>
      </Container>
    </Box>
  )
}

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  color: string
}

function FeatureCard({ icon, title, description, color }: FeatureCardProps) {
  return (
    <Box
      p="5"
      borderRadius="lg"
      bg="white"
      _dark={{ bg: 'gray.800' }}
      borderWidth="1px"
      borderColor="border.subtle"
      className={css({
        transition: 'all 0.2s',
        cursor: 'default',
        _hover: {
          borderColor: `${color}.200`,
          transform: 'translateY(-2px)',
          boxShadow: 'md'
        }
      })}
    >
      <VStack gap="3" alignItems="start">
        <Box 
          p="2" 
          borderRadius="md"
          className={css({
            bg: `${color}.100`,
            color: `${color}.600`,
            _dark: {
              bg: `${color}.900`,
              color: `${color}.400`
            }
          })}
        >
          {icon}
        </Box>
        <VStack gap="1" alignItems="start">
          <Text fontWeight="semibold" fontSize="sm">{title}</Text>
          <Text fontSize="xs" color="fg.muted">{description}</Text>
        </VStack>
      </VStack>
    </Box>
  )
}