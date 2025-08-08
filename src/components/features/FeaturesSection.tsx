import { Container, Grid, VStack, Box } from '@/styled-system/jsx'
import { Card, Badge, Text } from '@/components/ui'
import { 
  Palette, 
  Code2, 
  Accessibility, 
  Smartphone,
  Globe,
  Gauge,
  Lock,
  Puzzle,
  Sparkles
} from 'lucide-react'

const features = [
  {
    icon: Palette,
    title: 'Beautiful Design',
    description: 'Carefully crafted components with attention to detail and modern aesthetics.',
    badge: 'Design System',
    color: 'purple',
  },
  {
    icon: Code2,
    title: 'Developer Experience',
    description: 'Built with TypeScript, offering excellent IDE support and type safety.',
    badge: 'DX',
    color: 'blue',
  },
  {
    icon: Accessibility,
    title: 'Accessible',
    description: 'WCAG compliant components with full keyboard navigation and screen reader support.',
    badge: 'A11y',
    color: 'green',
  },
  {
    icon: Smartphone,
    title: 'Responsive',
    description: 'Mobile-first design that looks great on all screen sizes and devices.',
    badge: 'Mobile',
    color: 'orange',
  },
  {
    icon: Globe,
    title: 'Edge Ready',
    description: 'Optimized for deployment on Cloudflare Workers and edge networks.',
    badge: 'Performance',
    color: 'cyan',
  },
  {
    icon: Gauge,
    title: 'Lightning Fast',
    description: 'Zero-runtime CSS with PandaCSS for optimal performance.',
    badge: 'Speed',
    color: 'yellow',
  },
  {
    icon: Lock,
    title: 'Type Safe',
    description: 'Full TypeScript support with strict typing for all components.',
    badge: 'TypeScript',
    color: 'red',
  },
  {
    icon: Puzzle,
    title: 'Composable',
    description: 'Mix and match components to build complex UIs with ease.',
    badge: 'Flexible',
    color: 'indigo',
  },
  {
    icon: Sparkles,
    title: 'Modern Stack',
    description: 'Built with React 19.1, using the latest features like Suspense and use() hook.',
    badge: 'React 19',
    color: 'pink',
  },
]

export function FeaturesSection() {
  return (
    <Container maxW="7xl" py="16">
      <VStack gap="12">
        {/* Section Header */}
        <VStack gap="4" textAlign="center">
          <Badge variant="subtle" size="lg">Features</Badge>
          <Text as="h2" fontSize="4xl" fontWeight="bold">
            Everything You Need
          </Text>
          <Text fontSize="lg" color="fg.muted" maxW="2xl">
            A comprehensive toolkit with all the components and features needed
            to build modern, production-ready applications.
          </Text>
        </VStack>

        {/* Features Grid */}
        <Grid 
          columns={{ base: 1, md: 2, lg: 3 }} 
          gap="6"
          width="full"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card.Root 
                key={index}
              >
                <Card.Body>
                  <VStack gap="4" alignItems="start">
                    {/* Icon and Badge */}
                    <Box display="flex" justifyContent="space-between" width="full">
                      <Box
                        p="2"
                        borderRadius="lg"
                        bg={`${feature.color}.100`}
                        color={`${feature.color}.600`}
                      >
                        <Icon size={24} />
                      </Box>
                      <Badge variant="subtle" size="sm" colorPalette={feature.color as any}>
                        {feature.badge}
                      </Badge>
                    </Box>

                    {/* Content */}
                    <VStack gap="2" alignItems="start">
                      <Text fontWeight="semibold" fontSize="lg">
                        {feature.title}
                      </Text>
                      <Text fontSize="sm" color="fg.muted">
                        {feature.description}
                      </Text>
                    </VStack>
                  </VStack>
                </Card.Body>
              </Card.Root>
            )
          })}
        </Grid>
      </VStack>
    </Container>
  )
}