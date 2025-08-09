import { useState, useRef, FormEvent, useEffect } from 'react'
import { Box, VStack, HStack, Grid, Flex, Container } from '@/styled-system/jsx'
import { Button } from '@/components/ui/styled/button'
import { Textarea } from '@/components/ui/styled/textarea'
import * as Avatar from '@/components/ui/styled/avatar'
import { Badge } from '@/components/ui/styled/badge'
import { IconButton } from '@/components/ui/styled/icon-button'
import * as Tooltip from '@/components/ui/styled/tooltip'
import { css } from '@/styled-system/css'
import { 
  Send, MapPin, User, Settings, Plus, Copy, 
  ThumbsUp, ThumbsDown, RefreshCw, Sparkles, 
  MessageSquare, Trash2, Edit3, Check, X, 
  Code, Zap, Brain
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  location?: { lat: number; lng: number; name?: string }
  provider?: 'openai' | 'anthropic'
  streaming?: boolean
}

interface ChatSession {
  id: string
  title: string
  timestamp: Date
  preview: string
}

interface ModernChatInterfaceProps {
  user: {
    name: string
    picture: string
  }
}

interface GeocodingResponse {
  address?: {
    city?: string
    town?: string
    village?: string
    state?: string
    country?: string
  }
}

export function ModernChatInterface({ user }: ModernChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hello ${user.name}! 👋 I'm MyChat, your AI assistant. I can help you with:

• **Answering questions** on any topic
• **Location-based recommendations** when you share your location
• **Code assistance** with syntax highlighting
• **Creative tasks** like writing and brainstorming

How can I assist you today?`,
      timestamp: new Date(),
      provider: 'openai'
    }
  ])
  
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showLocation, setShowLocation] = useState(false)
  const [aiProvider, setAiProvider] = useState<'openai' | 'anthropic'>('openai')
  const [isStreaming, setIsStreaming] = useState(true)
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [currentSessionId, setCurrentSessionId] = useState<string>()
  const [showSettings, setShowSettings] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    // Load sessions from localStorage
    const savedSessions = localStorage.getItem('chat_sessions')
    if (savedSessions) {
      setSessions(JSON.parse(savedSessions))
    }
    
    // Get or create session ID
    let sessionId = localStorage.getItem('current_session_id')
    if (!sessionId) {
      sessionId = crypto.randomUUID()
      localStorage.setItem('current_session_id', sessionId)
    }
    setCurrentSessionId(sessionId)
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSubmit = async (e?: FormEvent) => {
    e?.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
      location: showLocation ? await getCurrentLocation() : undefined
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      if (isStreaming) {
        await handleStreamingResponse(userMessage)
      } else {
        await handleStandardResponse(userMessage)
      }
    } catch (error) {
      console.error('Chat error:', error)
      handleError(error instanceof Error ? error : new Error(String(error)))
    } finally {
      setIsLoading(false)
      scrollToBottom()
    }
  }

  const handleStreamingResponse = async (userMessage: Message) => {
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      provider: aiProvider,
      streaming: true
    }
    
    setMessages(prev => [...prev, assistantMessage])
    
    const response = await fetch('/api/chat/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: userMessage.content,
        sessionId: currentSessionId,
        location: userMessage.location,
        provider: aiProvider
      }),
      credentials: 'include'
    })

    if (!response.ok) throw new Error('Stream failed')

    const reader = response.body?.getReader()
    const decoder = new TextDecoder()
    
    if (reader) {
      let fullContent = ''
      
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        
        const chunk = decoder.decode(value)
        const lines = chunk.split('\n').filter(line => line.trim() !== '')
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))
              if (data.content) {
                fullContent += data.content
                setMessages(prev => prev.map(msg => 
                  msg.id === assistantMessage.id 
                    ? { ...msg, content: fullContent, streaming: true }
                    : msg
                ))
              }
            } catch (e) {
              console.error('Parse error:', e)
            }
          }
        }
      }
      
      // Mark streaming as complete
      setMessages(prev => prev.map(msg => 
        msg.id === assistantMessage.id 
          ? { ...msg, streaming: false }
          : msg
      ))
    }
  }

  const handleStandardResponse = async (userMessage: Message) => {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: userMessage.content,
        sessionId: currentSessionId,
        location: userMessage.location,
        provider: aiProvider
      }),
      credentials: 'include'
    })

    if (!response.ok) throw new Error('Chat failed')

    const data: { response: string } = await response.json()
    
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: data.response,
      timestamp: new Date(),
      provider: aiProvider
    }
    
    setMessages(prev => [...prev, assistantMessage])
  }

  const handleError = (error?: Error) => {
    let content = '⚠️ Sorry, I encountered an error.'
    
    if (error?.message?.includes('API key')) {
      content += ' Please ensure AI API keys are configured properly.'
    } else if (error?.message?.includes('rate limit')) {
      content += ' Rate limit exceeded. Please try again in a moment.'
    } else if (error?.message?.includes('network')) {
      content += ' Network error. Please check your connection.'
    } else {
      content += ' Please try again or switch to a different AI provider.'
    }
    
    const errorMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, errorMessage])
  }

  const getCurrentLocation = async (): Promise<{ lat: number; lng: number; name?: string }> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        console.warn('Geolocation not supported')
        resolve({ lat: 37.7749, lng: -122.4194, name: 'San Francisco (default)' })
        return
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          
          // Try to get location name using reverse geocoding (optional)
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            )
            if (response.ok) {
              const data: GeocodingResponse = await response.json()
              const address = data?.address || {}
              const city = address.city || address.town || address.village
              const state = address.state
              const country = address.country
              const name = [city, state, country].filter(Boolean).join(', ')
              
              resolve({
                lat: latitude,
                lng: longitude,
                name: name || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
              })
            } else {
              resolve({
                lat: latitude,
                lng: longitude,
                name: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
              })
            }
          } catch (error) {
            console.error('Reverse geocoding failed:', error)
            resolve({
              lat: latitude,
              lng: longitude,
              name: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
            })
          }
        },
        (error) => {
          console.error('Geolocation error:', error)
          let errorMessage = 'Location unavailable'
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location permission denied'
              break
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location unavailable'
              break
            case error.TIMEOUT:
              errorMessage = 'Location request timed out'
              break
          }
          resolve({ lat: 37.7749, lng: -122.4194, name: `San Francisco (${errorMessage})` })
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // Cache location for 5 minutes
        }
      )
    })
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const regenerateResponse = async (messageId: string) => {
    const messageIndex = messages.findIndex(m => m.id === messageId)
    if (messageIndex > 0) {
      const previousMessage = messages[messageIndex - 1]
      if (previousMessage.role === 'user') {
        setInput(previousMessage.content)
        await handleSubmit()
      }
    }
  }

  const startNewChat = () => {
    const newSessionId = crypto.randomUUID()
    setCurrentSessionId(newSessionId)
    localStorage.setItem('current_session_id', newSessionId)
    setMessages([{
      id: '1',
      role: 'assistant',
      content: `Hello ${user.name}! How can I help you today?`,
      timestamp: new Date(),
      provider: aiProvider
    }])
  }

  const editMessage = (messageId: string) => {
    const message = messages.find(m => m.id === messageId)
    if (message) {
      setEditingMessageId(messageId)
      setEditContent(message.content)
    }
  }

  const saveEdit = async () => {
    if (editingMessageId) {
      const messageIndex = messages.findIndex(m => m.id === editingMessageId)
      const updatedMessages = [...messages]
      updatedMessages[messageIndex] = {
        ...updatedMessages[messageIndex],
        content: editContent
      }
      setMessages(updatedMessages)
      
      // If editing a user message, regenerate the response
      if (updatedMessages[messageIndex].role === 'user') {
        setInput(editContent)
        await handleSubmit()
      }
      
      setEditingMessageId(null)
      setEditContent('')
    }
  }

  return (
    <Grid gridTemplateColumns={{ base: '1fr', lg: '280px 1fr 280px' }} h="100vh" bg="background">
      {/* Left Sidebar - Chat History */}
      <Box 
        className={css({ 
          display: { base: 'none', lg: 'block' },
          borderRight: '1px solid',
          borderColor: 'border.default',
          bg: 'gray.50',
          _dark: { bg: 'gray.900' }
        })}
      >
        <VStack gap="0" h="full">
          <Box p="4" borderBottom="1px solid" borderColor="border.default">
            <Button 
              variant="solid" 
              size="sm" 
              w="full"
              onClick={startNewChat}
            >
              <Plus size={16} />
              New Chat
            </Button>
          </Box>
          
          <Box flex="1" overflowY="auto" p="2">
            <VStack gap="2" alignItems="stretch">
              {sessions.map(session => (
                <Button
                  key={session.id}
                  variant={session.id === currentSessionId ? 'subtle' : 'ghost'}
                  size="sm"
                  justifyContent="start"
                  className={css({ textAlign: 'left' })}
                >
                  <VStack gap="0.5" alignItems="start" w="full">
                    <HStack justify="space-between" w="full">
                      <MessageSquare size={14} />
                      <span className={css({ fontSize: 'xs', color: 'fg.muted' })}>
                        {new Date(session.timestamp).toLocaleDateString()}
                      </span>
                    </HStack>
                    <span className={css({ 
                      fontSize: 'sm', 
                      fontWeight: 'medium',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      w: 'full'
                    })}>
                      {session.title}
                    </span>
                    <span className={css({ 
                      fontSize: 'xs', 
                      color: 'fg.muted',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      w: 'full'
                    })}>
                      {session.preview}
                    </span>
                  </VStack>
                </Button>
              ))}
            </VStack>
          </Box>
        </VStack>
      </Box>

      {/* Main Chat Area */}
      <Flex flexDirection="column" h="full" position="relative">
        {/* Chat Messages */}
        <Box 
          flex="1" 
          overflowY="auto"
          className={css({
            px: { base: 2, md: 4 },
            py: 4
          })}
        >
          <Container maxW="4xl">
            <VStack gap="6" alignItems="stretch">
              {messages.map((message) => (
                <Flex
                  key={message.id}
                  gap="4"
                  className={css({
                    flexDirection: 'row',
                    alignItems: 'start'
                  })}
                >
                  {/* Avatar */}
                  <Avatar.Root size="sm" className={css({ flexShrink: 0 })}>
                    {message.role === 'user' ? (
                      <>
                        <Avatar.Image src={user.picture} alt={user.name} />
                        <Avatar.Fallback>
                          <User size={16} />
                        </Avatar.Fallback>
                      </>
                    ) : (
                      <Avatar.Fallback className={css({ 
                        bg: aiProvider === 'anthropic' ? 'orange.100' : 'blue.100',
                        color: aiProvider === 'anthropic' ? 'orange.600' : 'blue.600'
                      })}>
                        {aiProvider === 'anthropic' ? <Brain size={16} /> : <Sparkles size={16} />}
                      </Avatar.Fallback>
                    )}
                  </Avatar.Root>

                  {/* Message Content */}
                  <VStack gap="2" alignItems="start" flex="1">
                    <HStack gap="2">
                      <span className={css({ fontWeight: 'semibold', fontSize: 'sm' })}>
                        {message.role === 'user' ? user.name : 'MyChat'}
                      </span>
                      {message.provider && (
                        <Badge variant="subtle" size="sm">
                          {message.provider === 'anthropic' ? 'Claude' : 'GPT-4'}
                        </Badge>
                      )}
                      {message.location && (
                        <Badge variant="outline" size="sm">
                          <MapPin size={10} />
                          <span className={css({ ml: 1 })}>
                            {message.location.name || 'Location shared'}
                          </span>
                        </Badge>
                      )}
                      {message.streaming && (
                        <Badge variant="subtle" size="sm">
                          <div className={css({ 
                            w: 1.5, 
                            h: 1.5, 
                            bg: 'green.500', 
                            borderRadius: 'full',
                            animation: 'pulse 1s infinite' 
                          })} />
                          <span className={css({ ml: 1 })}>Streaming</span>
                        </Badge>
                      )}
                    </HStack>

                    {editingMessageId === message.id ? (
                      <VStack gap="2" w="full">
                        <Textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          rows={4}
                          className={css({ w: 'full' })}
                        />
                        <HStack gap="2">
                          <Button size="xs" variant="solid" onClick={saveEdit}>
                            <Check size={14} />
                            Save
                          </Button>
                          <Button 
                            size="xs" 
                            variant="outline"
                            onClick={() => {
                              setEditingMessageId(null)
                              setEditContent('')
                            }}
                          >
                            <X size={14} />
                            Cancel
                          </Button>
                        </HStack>
                      </VStack>
                    ) : (
                      <Box 
                        className={css({ 
                          maxW: 'none',
                          '& pre': {
                            p: 0,
                            m: 0,
                            bg: 'transparent'
                          },
                          '& code': {
                            fontSize: 'sm'
                          }
                        })}
                      >
                        <ReactMarkdown
                          components={{
                            code(props: { inline?: boolean; className?: string; children?: React.ReactNode }) {
                              const { inline, className, children } = props
                              const match = /language-(\w+)/.exec(className || '')
                              return !inline && match ? (
                                <Box className={css({ position: 'relative', my: 2 })}>
                                  <Button
                                    size="xs"
                                    variant="ghost"
                                    onClick={() => copyToClipboard(String(children))}
                                    className={css({
                                      position: 'absolute',
                                      top: 2,
                                      right: 2,
                                      zIndex: 1
                                    })}
                                  >
                                    <Copy size={12} />
                                  </Button>
                                  <SyntaxHighlighter
                                    style={oneDark}
                                    language={match[1]}
                                    PreTag="div"
                                  >
                                    {String(children).replace(/\n$/, '')}
                                  </SyntaxHighlighter>
                                </Box>
                              ) : (
                                <code className={css({ 
                                  bg: 'gray.100', 
                                  _dark: { bg: 'gray.800' },
                                  px: 1,
                                  py: 0.5,
                                  borderRadius: 'sm',
                                  fontSize: 'sm'
                                })}>
                                  {children}
                                </code>
                              )
                            }
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </Box>
                    )}

                    {/* Message Actions */}
                    <HStack gap="1" className={css({ opacity: 0.7, _hover: { opacity: 1 } })}>
                      <Tooltip.Root>
                        <Tooltip.Trigger asChild>
                          <IconButton
                            variant="ghost"
                            size="xs"
                            onClick={() => copyToClipboard(message.content)}
                            aria-label="Copy"
                          >
                            <Copy size={14} />
                          </IconButton>
                        </Tooltip.Trigger>
                        <Tooltip.Positioner>
                          <Tooltip.Content>Copy message</Tooltip.Content>
                        </Tooltip.Positioner>
                      </Tooltip.Root>

                      {message.role === 'user' && (
                        <Tooltip.Root>
                          <Tooltip.Trigger asChild>
                            <IconButton
                              variant="ghost"
                              size="xs"
                              onClick={() => editMessage(message.id)}
                              aria-label="Edit"
                            >
                              <Edit3 size={14} />
                            </IconButton>
                          </Tooltip.Trigger>
                          <Tooltip.Positioner>
                            <Tooltip.Content>Edit message</Tooltip.Content>
                          </Tooltip.Positioner>
                        </Tooltip.Root>
                      )}

                      {message.role === 'assistant' && (
                        <>
                          <Tooltip.Root>
                            <Tooltip.Trigger asChild>
                              <IconButton
                                variant="ghost"
                                size="xs"
                                onClick={() => regenerateResponse(message.id)}
                                aria-label="Regenerate"
                              >
                                <RefreshCw size={14} />
                              </IconButton>
                            </Tooltip.Trigger>
                            <Tooltip.Positioner>
                              <Tooltip.Content>Regenerate response</Tooltip.Content>
                            </Tooltip.Positioner>
                          </Tooltip.Root>

                          <IconButton variant="ghost" size="xs" aria-label="Good response">
                            <ThumbsUp size={14} />
                          </IconButton>

                          <IconButton variant="ghost" size="xs" aria-label="Bad response">
                            <ThumbsDown size={14} />
                          </IconButton>
                        </>
                      )}
                    </HStack>
                  </VStack>
                </Flex>
              ))}

              {isLoading && (
                <Flex gap="4" alignItems="start">
                  <Avatar.Root size="sm">
                    <Avatar.Fallback className={css({ 
                      bg: aiProvider === 'anthropic' ? 'orange.100' : 'blue.100',
                      color: aiProvider === 'anthropic' ? 'orange.600' : 'blue.600'
                    })}>
                      {aiProvider === 'anthropic' ? <Brain size={16} /> : <Sparkles size={16} />}
                    </Avatar.Fallback>
                  </Avatar.Root>
                  <VStack gap="2" alignItems="start">
                    <span className={css({ fontWeight: 'semibold', fontSize: 'sm' })}>
                      MyChat
                    </span>
                    <HStack gap="1">
                      <div className={css({ 
                        w: 2, 
                        h: 2, 
                        bg: 'blue.500', 
                        borderRadius: 'full',
                        animation: 'pulse 1.5s infinite' 
                      })} />
                      <div className={css({ 
                        w: 2, 
                        h: 2, 
                        bg: 'blue.500', 
                        borderRadius: 'full',
                        animation: 'pulse 1.5s infinite',
                        animationDelay: '0.3s'
                      })} />
                      <div className={css({ 
                        w: 2, 
                        h: 2, 
                        bg: 'blue.500', 
                        borderRadius: 'full',
                        animation: 'pulse 1.5s infinite',
                        animationDelay: '0.6s'
                      })} />
                    </HStack>
                  </VStack>
                </Flex>
              )}
              
              <div ref={messagesEndRef} />
            </VStack>
          </Container>
        </Box>

        {/* Input Area */}
        <Box 
          borderTop="1px solid"
          borderColor="border.default"
          bg="background"
          className={css({
            px: { base: 2, md: 4 },
            py: 3
          })}
        >
          <Container maxW="4xl">
            <form onSubmit={handleSubmit}>
              <VStack gap="3">
                {/* Input Options Bar */}
                <HStack gap="2" w="full" justify="space-between">
                  <HStack gap="2">
                    <Tooltip.Root>
                      <Tooltip.Trigger asChild>
                        <Button
                          type="button"
                          variant={showLocation ? 'subtle' : 'ghost'}
                          size="xs"
                          onClick={() => setShowLocation(!showLocation)}
                        >
                          <MapPin size={14} />
                          {showLocation && <span>Location enabled</span>}
                        </Button>
                      </Tooltip.Trigger>
                      <Tooltip.Positioner>
                        <Tooltip.Content>
                          {showLocation ? 'Disable' : 'Enable'} location sharing
                        </Tooltip.Content>
                      </Tooltip.Positioner>
                    </Tooltip.Root>

                    <Tooltip.Root>
                      <Tooltip.Trigger asChild>
                        <Button
                          type="button"
                          variant={isStreaming ? 'subtle' : 'ghost'}
                          size="xs"
                          onClick={() => setIsStreaming(!isStreaming)}
                        >
                          <Zap size={14} />
                          {isStreaming ? 'Streaming' : 'Standard'}
                        </Button>
                      </Tooltip.Trigger>
                      <Tooltip.Positioner>
                        <Tooltip.Content>
                          Toggle response streaming
                        </Tooltip.Content>
                      </Tooltip.Positioner>
                    </Tooltip.Root>
                  </HStack>

                  <HStack gap="2">
                    <Button
                      type="button"
                      variant={aiProvider === 'openai' ? 'subtle' : 'ghost'}
                      size="xs"
                      onClick={() => setAiProvider('openai')}
                    >
                      <Sparkles size={14} />
                      GPT-4
                    </Button>
                    <Button
                      type="button"
                      variant={aiProvider === 'anthropic' ? 'subtle' : 'ghost'}
                      size="xs"
                      onClick={() => setAiProvider('anthropic')}
                    >
                      <Brain size={14} />
                      Claude
                    </Button>
                  </HStack>
                </HStack>

                {/* Input Field */}
                <HStack gap="2" w="full">
                  <Textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Send a message..."
                    rows={1}
                    className={css({ 
                      flex: 1, 
                      resize: 'none',
                      minH: '44px',
                      maxH: '200px',
                      overflowY: 'auto'
                    })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSubmit()
                      }
                    }}
                  />
                  <IconButton
                    type="submit"
                    variant="solid"
                    disabled={!input.trim() || isLoading}
                    aria-label="Send message"
                    className={css({
                      bg: aiProvider === 'anthropic' ? 'orange.500' : 'blue.500',
                      _hover: {
                        bg: aiProvider === 'anthropic' ? 'orange.600' : 'blue.600'
                      }
                    })}
                  >
                    <Send size={20} />
                  </IconButton>
                </HStack>

                <p className={css({ 
                  fontSize: 'xs', 
                  color: 'fg.muted',
                  textAlign: 'center'
                })}>
                  {aiProvider === 'anthropic' ? 'Claude 3' : 'GPT-4'} may make mistakes. Check important info.
                </p>
              </VStack>
            </form>
          </Container>
        </Box>
      </Flex>

      {/* Right Sidebar - Settings */}
      <Box 
        className={css({ 
          display: { base: 'none', lg: 'block' },
          borderLeft: '1px solid',
          borderColor: 'border.default',
          bg: 'gray.50',
          _dark: { bg: 'gray.900' }
        })}
      >
        <VStack gap="4" p="4">
          <HStack justify="space-between" w="full">
            <span className={css({ fontWeight: 'semibold' })}>Settings</span>
            <IconButton 
              variant="ghost" 
              size="xs"
              onClick={() => setShowSettings(!showSettings)}
              aria-label="Toggle settings"
            >
              <Settings size={16} />
            </IconButton>
          </HStack>

          <VStack gap="3" alignItems="stretch">
            <Box>
              <p className={css({ fontSize: 'sm', fontWeight: 'medium', mb: 2 })}>
                Model
              </p>
              <VStack gap="1" alignItems="stretch">
                <Button 
                  variant={aiProvider === 'openai' ? 'solid' : 'outline'} 
                  size="xs"
                  onClick={() => setAiProvider('openai')}
                  justifyContent="start"
                >
                  <Sparkles size={14} />
                  GPT-4 Turbo
                </Button>
                <Button 
                  variant={aiProvider === 'anthropic' ? 'solid' : 'outline'} 
                  size="xs"
                  onClick={() => setAiProvider('anthropic')}
                  justifyContent="start"
                >
                  <Brain size={14} />
                  Claude 3 Opus
                </Button>
              </VStack>
            </Box>

            <Box>
              <p className={css({ fontSize: 'sm', fontWeight: 'medium', mb: 2 })}>
                Features
              </p>
              <VStack gap="2" alignItems="start">
                <Badge variant="outline" size="sm">
                  <MapPin size={12} />
                  <span className={css({ ml: 1 })}>
                    {showLocation ? 'Location ON' : 'Location OFF'}
                  </span>
                </Badge>
                <Badge variant="outline" size="sm">
                  <Zap size={12} />
                  <span className={css({ ml: 1 })}>
                    {isStreaming ? 'Streaming ON' : 'Streaming OFF'}
                  </span>
                </Badge>
                <Badge variant="outline" size="sm">
                  <Code size={12} />
                  <span className={css({ ml: 1 })}>Code Highlighting</span>
                </Badge>
              </VStack>
            </Box>

            <Box>
              <p className={css({ fontSize: 'sm', fontWeight: 'medium', mb: 2 })}>
                Usage
              </p>
              <VStack gap="1" alignItems="stretch">
                <HStack justify="space-between">
                  <span className={css({ fontSize: 'xs', color: 'fg.muted' })}>
                    Messages
                  </span>
                  <span className={css({ fontSize: 'xs', fontWeight: 'medium' })}>
                    {messages.length}
                  </span>
                </HStack>
                <HStack justify="space-between">
                  <span className={css({ fontSize: 'xs', color: 'fg.muted' })}>
                    Session
                  </span>
                  <span className={css({ fontSize: 'xs', fontWeight: 'medium' })}>
                    {currentSessionId?.slice(0, 8)}...
                  </span>
                </HStack>
              </VStack>
            </Box>

            <Button 
              variant="outline" 
              size="xs" 
              w="full"
              onClick={() => {
                if (confirm('Clear all messages?')) {
                  setMessages([])
                }
              }}
            >
              <Trash2 size={14} />
              Clear History
            </Button>
          </VStack>
        </VStack>
      </Box>
    </Grid>
  )
}