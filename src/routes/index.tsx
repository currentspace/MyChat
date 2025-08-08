import { createFileRoute } from '@tanstack/react-router'
import { Box, VStack } from '@/styled-system/jsx'
import { Header } from '@/components/features/Header'
import { HeroSection } from '@/components/features/HeroSection'
import { FeaturesSection } from '@/components/features/FeaturesSection'
import { ComponentShowcase } from '@/components/features/ComponentShowcase'
import { Divider } from '@/components/ui'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <VStack gap="0" alignItems="stretch">
      {/* Header */}
      <Header />
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Features */}
      <FeaturesSection />
      
      <Divider />
      
      {/* Component Showcase */}
      <Box id="components">
        <ComponentShowcase />
      </Box>
    </VStack>
  )
}