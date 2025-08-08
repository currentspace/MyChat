import { Box, Container, Flex, Grid, HStack, VStack } from '@/styled-system/jsx'
import { Text, Link, Divider, IconButton } from '@/components/ui'
import { Globe, Heart } from 'lucide-react'
import { css } from '@/styled-system/css'

const footerLinks = {
  Product: [
    { label: 'Features', href: '#features' },
    { label: 'Components', href: '#components' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Changelog', href: '#changelog' },
  ],
  Resources: [
    { label: 'Documentation', href: 'https://park-ui.com' },
    { label: 'GitHub', href: 'https://github.com/cschroeter/park-ui' },
    { label: 'Examples', href: '#examples' },
    { label: 'Blog', href: '#blog' },
  ],
  Community: [
    { label: 'Discord', href: '#discord' },
    { label: 'Twitter', href: '#twitter' },
    { label: 'Discussions', href: '#discussions' },
    { label: 'Contributing', href: '#contributing' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '#privacy' },
    { label: 'Terms of Service', href: '#terms' },
    { label: 'License', href: '#license' },
    { label: 'Cookie Policy', href: '#cookies' },
  ],
}

export function Footer() {
  return (
    <Box
      className={css({
        borderTop: '1px solid',
        borderColor: 'border.default',
        bg: 'bg.subtle',
        mt: 'auto',
      })}
    >
      <Container maxW="7xl" py="12">
        <VStack gap="8">
          {/* Main Footer Content */}
          <Grid
            columns={{ base: 1, sm: 2, md: 5 }}
            gap={{ base: 8, md: 4 }}
            width="full"
          >
            {/* Brand Column */}
            <VStack alignItems="start" gap="4">
              <Text fontSize="xl" fontWeight="bold">
                MyChat
              </Text>
              <Text fontSize="sm" color="fg.muted">
                Modern React app with Park UI components
              </Text>
              <HStack gap="2">
                <IconButton variant="ghost" size="sm" aria-label="GitHub">
                  <Globe size={18} />
                </IconButton>
                <IconButton variant="ghost" size="sm" aria-label="Twitter">
                  <Globe size={18} />
                </IconButton>
                <IconButton variant="ghost" size="sm" aria-label="Website">
                  <Globe size={18} />
                </IconButton>
              </HStack>
            </VStack>

            {/* Links Columns */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <VStack key={category} alignItems="start" gap="3">
                <Text fontSize="sm" fontWeight="semibold">
                  {category}
                </Text>
                <VStack alignItems="start" gap="2">
                  {links.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      fontSize="sm"
                      color="fg.muted"
                      _hover={{ color: 'fg.default' }}
                    >
                      {link.label}
                    </Link>
                  ))}
                </VStack>
              </VStack>
            ))}
          </Grid>

          <Divider />

          {/* Bottom Footer */}
          <Flex
            direction={{ base: 'column', sm: 'row' }}
            justify="space-between"
            alignItems="center"
            width="full"
            gap="4"
          >
            <Text fontSize="sm" color="fg.muted">
              © 2024 MyChat. All rights reserved.
            </Text>
            
            <HStack gap="1" fontSize="sm" color="fg.muted">
              <Text>Built with</Text>
              <Heart size={14} fill="currentColor" />
              <Text>using</Text>
              <Link 
                href="https://park-ui.com" 
                fontWeight="medium"
                color="fg.default"
                _hover={{ textDecoration: 'underline' }}
              >
                Park UI
              </Link>
              <Text>&</Text>
              <Link 
                href="https://react.dev" 
                fontWeight="medium"
                color="fg.default"
                _hover={{ textDecoration: 'underline' }}
              >
                React 19
              </Link>
            </HStack>
          </Flex>
        </VStack>
      </Container>
    </Box>
  )
}