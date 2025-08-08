import { useState, useRef, FormEvent } from 'react'
import { Box, VStack, HStack, Grid } from '@/styled-system/jsx'
import { Button } from '@/components/ui/styled/button'
import { Textarea } from '@/components/ui/styled/textarea'
import * as Card from '@/components/ui/styled/card'
import * as Avatar from '@/components/ui/styled/avatar'
import { Badge } from '@/components/ui/styled/badge'
import { IconButton } from '@/components/ui/styled/icon-button'
import { css } from '@/styled-system/css'
import { Send, MapPin, Bot, User, Settings, Plus } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  location?: { lat: number; lng: number; name?: string }
}

interface ChatInterfaceProps {
  user: {
    name: string
    picture: string
  }
}

export function ChatInterface({ user }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I can help you explore places, answer questions, and provide recommendations. You can share your location for personalized suggestions. How can I assist you today?',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showLocation, setShowLocation] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
      location: showLocation ? { lat: 37.7749, lng: -122.4194, name: 'San Francisco' } : undefined
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I understand you're asking about "${input}". This is a demo response. In a full implementation, this would connect to an AI service like OpenAI or Anthropic Claude to provide intelligent responses about locations, recommendations, and more.`,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, assistantMessage])
      setIsLoading(false)
      scrollToBottom()
    }, 1000)
  }

  return (
    <Grid gridTemplateColumns={{ base: '1fr', lg: '300px 1fr' }} gap="6" h="full">
      {/* Sidebar */}
      <Card.Root className={css({ display: { base: 'none', lg: 'block' } })}>
        <Card.Header>
          <Card.Title>Chat Settings</Card.Title>
        </Card.Header>
        <Card.Body>
          <VStack gap="4" alignItems="stretch">
            <Button variant="outline" size="sm">
              <Plus size={16} />
              New Chat
            </Button>
            
            <Box>
              <p className={css({ fontSize: 'sm', fontWeight: 'medium', mb: 2 })}>
                AI Model
              </p>
              <Badge variant="subtle">GPT-4</Badge>
            </Box>

            <Box>
              <p className={css({ fontSize: 'sm', fontWeight: 'medium', mb: 2 })}>
                Features
              </p>
              <VStack gap="2" alignItems="start">
                <Badge variant="outline" size="sm">
                  <MapPin size={12} />
                  <span className={css({ ml: 1 })}>Location-aware</span>
                </Badge>
                <Badge variant="outline" size="sm">
                  <Bot size={12} />
                  <span className={css({ ml: 1 })}>Multi-modal</span>
                </Badge>
              </VStack>
            </Box>

            <Box>
              <p className={css({ fontSize: 'sm', fontWeight: 'medium', mb: 2 })}>
                Recent Locations
              </p>
              <VStack gap="1" alignItems="stretch">
                <Button variant="ghost" size="xs" justifyContent="start">
                  San Francisco, CA
                </Button>
                <Button variant="ghost" size="xs" justifyContent="start">
                  New York, NY
                </Button>
                <Button variant="ghost" size="xs" justifyContent="start">
                  Tokyo, Japan
                </Button>
              </VStack>
            </Box>
          </VStack>
        </Card.Body>
      </Card.Root>

      {/* Chat Area */}
      <Card.Root>
        <Card.Body className={css({ p: 0, display: 'flex', flexDirection: 'column', h: 'calc(100vh - 200px)' })}>
          {/* Messages */}
          <Box 
            className={css({ 
              flex: 1, 
              overflowY: 'auto', 
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              gap: 4
            })}
          >
            {messages.map((message) => (
              <HStack
                key={message.id}
                gap="3"
                alignItems="start"
                className={css({
                  flexDirection: message.role === 'user' ? 'row-reverse' : 'row'
                })}
              >
                <Avatar.Root size="sm">
                  {message.role === 'user' ? (
                    <>
                      <Avatar.Image src={user.picture} alt={user.name} />
                      <Avatar.Fallback>
                        <User size={16} />
                      </Avatar.Fallback>
                    </>
                  ) : (
                    <Avatar.Fallback>
                      <Bot size={16} />
                    </Avatar.Fallback>
                  )}
                </Avatar.Root>
                
                <Box
                  className={css({
                    maxW: '70%',
                    p: 3,
                    borderRadius: 'lg',
                    bg: message.role === 'user' ? 'blue.500' : 'gray.100',
                    color: message.role === 'user' ? 'white' : 'gray.900',
                    _dark: {
                      bg: message.role === 'user' ? 'blue.600' : 'gray.800',
                      color: message.role === 'user' ? 'white' : 'gray.100'
                    }
                  })}
                >
                  <p className={css({ whiteSpace: 'pre-wrap' })}>
                    {message.content}
                  </p>
                  {message.location && (
                    <HStack gap="1" mt="2">
                      <MapPin size={12} />
                      <span className={css({ fontSize: 'xs', opacity: 0.8 })}>
                        {message.location.name ?? `${String(message.location.lat)}, ${String(message.location.lng)}`}
                      </span>
                    </HStack>
                  )}
                  <p className={css({ fontSize: 'xs', opacity: 0.7, mt: 1 })}>
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </Box>
              </HStack>
            ))}
            
            {isLoading && (
              <HStack gap="3" alignItems="start">
                <Avatar.Root size="sm">
                  <Avatar.Fallback>
                    <Bot size={16} />
                  </Avatar.Fallback>
                </Avatar.Root>
                <Box
                  className={css({
                    p: 3,
                    borderRadius: 'lg',
                    bg: 'gray.100',
                    _dark: { bg: 'gray.800' }
                  })}
                >
                  <HStack gap="1">
                    <div className={css({ animation: 'pulse 1s infinite' })}>●</div>
                    <div className={css({ animation: 'pulse 1s infinite', animationDelay: '0.2s' })}>●</div>
                    <div className={css({ animation: 'pulse 1s infinite', animationDelay: '0.4s' })}>●</div>
                  </HStack>
                </Box>
              </HStack>
            )}
            
            <div ref={messagesEndRef} />
          </Box>

          {/* Input Area */}
          <Box
            className={css({
              borderTop: '1px solid',
              borderColor: 'border.default',
              p: 4,
              bg: 'background'
            })}
          >
            <form onSubmit={handleSubmit}>
              <VStack gap="3">
                <HStack gap="2" w="full">
                  <Button
                    type="button"
                    variant={showLocation ? 'subtle' : 'ghost'}
                    size="sm"
                    onClick={() => {
                      setShowLocation(!showLocation)
                    }}
                  >
                    <MapPin size={16} />
                    {showLocation && <span>Location enabled</span>}
                  </Button>
                  
                  <IconButton
                    type="button"
                    variant="ghost"
                    size="sm"
                    aria-label="Settings"
                  >
                    <Settings size={16} />
                  </IconButton>
                </HStack>
                
                <HStack gap="2" w="full">
                  <Textarea
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value)
                    }}
                    placeholder="Type your message..."
                    rows={2}
                    className={css({ flex: 1, resize: 'none' })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSubmit(e as FormEvent)
                      }
                    }}
                  />
                  <IconButton
                    type="submit"
                    variant="solid"
                    disabled={!input.trim() || isLoading}
                    aria-label="Send message"
                  >
                    <Send size={20} />
                  </IconButton>
                </HStack>
              </VStack>
            </form>
          </Box>
        </Card.Body>
      </Card.Root>
    </Grid>
  )
}