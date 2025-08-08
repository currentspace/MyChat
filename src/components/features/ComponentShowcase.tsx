import { useState } from 'react'
import { Box, Container, Grid, HStack, VStack } from '@/styled-system/jsx'
import { 
  Button,
  Badge,
  Input,
  Textarea,
  Switch,
  Checkbox,
  Text,
  IconButton,
  Link,
  Code,
  Kbd,
  Skeleton,
  Progress,
  Avatar
} from '@/components/ui'
import { Card, Alert, Tabs, Accordion, Dialog, Tooltip, Select, createListCollection, RadioGroup } from '@/components/ui'
import { Slider } from '@/components/ui/slider'
import { 
  ChevronRight, 
  Heart, 
  Star, 
  Settings, 
  Check
} from 'lucide-react'

export function ComponentShowcase() {
  const [switchState, setSwitchState] = useState(false)
  const [checkboxState, setCheckboxState] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [textareaValue, setTextareaValue] = useState('')
  const [sliderValue, setSliderValue] = useState([50])
  const [selectedTab, setSelectedTab] = useState('overview')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [progressValue, setProgressValue] = useState(60)
  const [radioValue, setRadioValue] = useState('option1')

  const selectCollection = createListCollection({
    items: [
      { label: 'React', value: 'react' },
      { label: 'Vue', value: 'vue' },
      { label: 'Angular', value: 'angular' },
      { label: 'Svelte', value: 'svelte' },
    ],
  })

  return (
    <Container maxW="7xl" py="12">
      <VStack gap="12">
        {/* Section: Buttons & Actions */}
        <Card.Root width="full">
          <Card.Header>
            <Card.Title>Buttons & Actions</Card.Title>
            <Card.Description>
              Interactive elements for user actions
            </Card.Description>
          </Card.Header>
          <Card.Body>
            <VStack gap="6" alignItems="stretch">
              {/* Buttons */}
              <Box>
                <Text fontWeight="semibold" mb="3">Button Variants</Text>
                <HStack gap="3" flexWrap="wrap">
                  <Button variant="solid" size="md">Solid Button</Button>
                  <Button variant="outline" size="md">Outline Button</Button>
                  <Button variant="ghost" size="md">Ghost Button</Button>
                  <Button variant="solid" size="md" loading loadingText="Loading...">
                    Loading State
                  </Button>
                </HStack>
              </Box>

              {/* Button Sizes */}
              <Box>
                <Text fontWeight="semibold" mb="3">Button Sizes</Text>
                <HStack gap="3" alignItems="center">
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                </HStack>
              </Box>

              {/* Icon Buttons */}
              <Box>
                <Text fontWeight="semibold" mb="3">Icon Buttons</Text>
                <HStack gap="3">
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                      <IconButton variant="solid" aria-label="Like">
                        <Heart size={20} />
                      </IconButton>
                    </Tooltip.Trigger>
                    <Tooltip.Positioner>
                      <Tooltip.Content>Like this</Tooltip.Content>
                    </Tooltip.Positioner>
                  </Tooltip.Root>

                  <IconButton variant="outline" aria-label="Star">
                    <Star size={20} />
                  </IconButton>
                  
                  <IconButton variant="ghost" aria-label="Settings">
                    <Settings size={20} />
                  </IconButton>
                </HStack>
              </Box>
            </VStack>
          </Card.Body>
        </Card.Root>

        {/* Section: Form Controls */}
        <Card.Root width="full">
          <Card.Header>
            <Card.Title>Form Controls</Card.Title>
            <Card.Description>
              Input elements for data collection
            </Card.Description>
          </Card.Header>
          <Card.Body>
            <Grid columns={{ base: 1, md: 2 }} gap="6">
              {/* Text Inputs */}
              <VStack gap="4" alignItems="stretch">
                <Box>
                  <Text fontWeight="semibold" mb="2">Text Input</Text>
                  <Input 
                    placeholder="Enter your name..." 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                </Box>

                <Box>
                  <Text fontWeight="semibold" mb="2">Textarea</Text>
                  <Textarea 
                    placeholder="Enter your message..." 
                    value={textareaValue}
                    onChange={(e) => setTextareaValue(e.target.value)}
                    rows={4}
                  />
                </Box>

                <Box>
                  <Text fontWeight="semibold" mb="2">Select</Text>
                  <Select.Root collection={selectCollection}>
                    <Select.Control>
                      <Select.Trigger>
                        <Select.ValueText placeholder="Choose a framework" />
                      </Select.Trigger>
                    </Select.Control>
                    <Select.Positioner>
                      <Select.Content>
                        {selectCollection.items.map((item: any) => (
                          <Select.Item key={item.value} item={item}>
                            <Select.ItemText>{item.label}</Select.ItemText>
                            <Select.ItemIndicator>
                              <Check size={16} />
                            </Select.ItemIndicator>
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Positioner>
                  </Select.Root>
                </Box>
              </VStack>

              {/* Toggles & Selections */}
              <VStack gap="4" alignItems="stretch">
                <Box>
                  <Text fontWeight="semibold" mb="3">Switch</Text>
                  <Switch 
                    checked={switchState}
                    onCheckedChange={(e) => setSwitchState(e.checked)}
                  >
                    Enable notifications
                  </Switch>
                </Box>

                <Box>
                  <Text fontWeight="semibold" mb="3">Checkbox</Text>
                  <Checkbox 
                    checked={checkboxState}
                    onCheckedChange={(e) => setCheckboxState(e.checked === true)}
                  >
                    I agree to the terms
                  </Checkbox>
                </Box>

                <Box>
                  <Text fontWeight="semibold" mb="3">Radio Group</Text>
                  <RadioGroup.Root value={radioValue} onValueChange={(e: any) => setRadioValue(e.value || 'option1')}>
                    <VStack gap="2" alignItems="start">
                      <RadioGroup.Item value="option1">
                        <RadioGroup.ItemControl />
                        <RadioGroup.ItemText>Option 1</RadioGroup.ItemText>
                      </RadioGroup.Item>
                      <RadioGroup.Item value="option2">
                        <RadioGroup.ItemControl />
                        <RadioGroup.ItemText>Option 2</RadioGroup.ItemText>
                      </RadioGroup.Item>
                      <RadioGroup.Item value="option3">
                        <RadioGroup.ItemControl />
                        <RadioGroup.ItemText>Option 3</RadioGroup.ItemText>
                      </RadioGroup.Item>
                    </VStack>
                  </RadioGroup.Root>
                </Box>

                <Box>
                  <Text fontWeight="semibold" mb="3">Slider</Text>
                  <Slider 
                    value={sliderValue} 
                    onValueChange={(e: any) => setSliderValue(e.value)}
                    max={100}
                  />
                  <Text fontSize="sm" color="fg.muted" mt="2">Value: {sliderValue[0]}</Text>
                </Box>
              </VStack>
            </Grid>
          </Card.Body>
        </Card.Root>

        {/* Section: Data Display */}
        <Card.Root width="full">
          <Card.Header>
            <Card.Title>Data Display</Card.Title>
            <Card.Description>
              Components for presenting information
            </Card.Description>
          </Card.Header>
          <Card.Body>
            <VStack gap="6" alignItems="stretch">
              {/* Badges */}
              <Box>
                <Text fontWeight="semibold" mb="3">Badges</Text>
                <HStack gap="3">
                  <Badge variant="solid">New</Badge>
                  <Badge variant="subtle">Updated</Badge>
                  <Badge variant="outline">Beta</Badge>
                  <Badge variant="solid" colorPalette="red">Important</Badge>
                  <Badge variant="solid" colorPalette="green">Success</Badge>
                </HStack>
              </Box>

              {/* Avatars */}
              <Box>
                <Text fontWeight="semibold" mb="3">Avatars</Text>
                <HStack gap="3">
                  <Avatar name="John Doe" size="sm" />
                  <Avatar name="Jane Smith" size="md" />
                  <Avatar name="Bob Johnson" size="lg" />
                  <Avatar src="https://i.pravatar.cc/150?img=1" name="User" size="lg" />
                </HStack>
              </Box>

              {/* Code & Kbd */}
              <Box>
                <Text fontWeight="semibold" mb="3">Code & Keyboard</Text>
                <VStack gap="3" alignItems="start">
                  <Text>
                    Use <Code>npm install</Code> to install dependencies
                  </Text>
                  <Text>
                    Press <Kbd>⌘</Kbd> + <Kbd>K</Kbd> to open search
                  </Text>
                </VStack>
              </Box>

              {/* Progress */}
              <Box>
                <Text fontWeight="semibold" mb="3">Progress</Text>
                <VStack gap="3" alignItems="stretch">
                  <Progress value={progressValue} max={100}>
                    {progressValue}% Complete
                  </Progress>
                  <HStack gap="2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setProgressValue(Math.max(0, progressValue - 10))}
                    >
                      -10%
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setProgressValue(Math.min(100, progressValue + 10))}
                    >
                      +10%
                    </Button>
                  </HStack>
                </VStack>
              </Box>

              {/* Skeleton */}
              <Box>
                <Text fontWeight="semibold" mb="3">Skeleton Loading</Text>
                <VStack gap="3" alignItems="stretch">
                  <Skeleton height="20px" />
                  <Skeleton height="20px" width="80%" />
                  <Skeleton height="20px" width="60%" />
                </VStack>
              </Box>
            </VStack>
          </Card.Body>
        </Card.Root>

        {/* Section: Feedback */}
        <Card.Root width="full">
          <Card.Header>
            <Card.Title>Feedback Components</Card.Title>
            <Card.Description>
              Alerts, dialogs, and notifications
            </Card.Description>
          </Card.Header>
          <Card.Body>
            <VStack gap="6" alignItems="stretch">
              {/* Alerts */}
              <Box>
                <Text fontWeight="semibold" mb="3">Alerts</Text>
                <VStack gap="3" alignItems="stretch">
                  <Alert.Root>
                    <Alert.Icon>
                      <Check size={20} />
                    </Alert.Icon>
                    <Alert.Content>
                      <Alert.Title>Success!</Alert.Title>
                      <Alert.Description>Your changes have been saved.</Alert.Description>
                    </Alert.Content>
                  </Alert.Root>

                  <Alert.Root>
                    <Alert.Content>
                      <Alert.Title>Warning</Alert.Title>
                      <Alert.Description>Please review your input.</Alert.Description>
                    </Alert.Content>
                  </Alert.Root>

                  <Alert.Root>
                    <Alert.Content>
                      <Alert.Title>Error</Alert.Title>
                      <Alert.Description>Something went wrong.</Alert.Description>
                    </Alert.Content>
                  </Alert.Root>
                </VStack>
              </Box>

              {/* Dialog */}
              <Box>
                <Text fontWeight="semibold" mb="3">Dialog</Text>
                <Button onClick={() => setDialogOpen(true)}>Open Dialog</Button>
                
                <Dialog.Root open={dialogOpen} onOpenChange={(e: any) => setDialogOpen(e.open)}>
                  <Dialog.Backdrop />
                  <Dialog.Positioner>
                    <Dialog.Content>
                      <VStack gap="4" alignItems="stretch">
                        <Dialog.Title>Confirm Action</Dialog.Title>
                        <Dialog.Description>
                          Are you sure you want to proceed with this action?
                        </Dialog.Description>
                        <HStack gap="3" justify="flex-end">
                          <Button variant="outline" onClick={() => setDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={() => setDialogOpen(false)}>
                            Confirm
                          </Button>
                        </HStack>
                      </VStack>
                      <Dialog.CloseTrigger />
                    </Dialog.Content>
                  </Dialog.Positioner>
                </Dialog.Root>
              </Box>
            </VStack>
          </Card.Body>
        </Card.Root>

        {/* Section: Navigation */}
        <Card.Root width="full">
          <Card.Header>
            <Card.Title>Navigation Components</Card.Title>
            <Card.Description>
              Tabs, accordions, and navigation elements
            </Card.Description>
          </Card.Header>
          <Card.Body>
            <VStack gap="6" alignItems="stretch">
              {/* Tabs */}
              <Box>
                <Text fontWeight="semibold" mb="3">Tabs</Text>
                <Tabs.Root value={selectedTab} onValueChange={(e: any) => setSelectedTab(e.value)}>
                  <Tabs.List>
                    <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
                    <Tabs.Trigger value="features">Features</Tabs.Trigger>
                    <Tabs.Trigger value="pricing">Pricing</Tabs.Trigger>
                  </Tabs.List>
                  <Box mt="4">
                    <Tabs.Content value="overview">
                      <Text>This is the overview tab content. Learn about our product.</Text>
                    </Tabs.Content>
                    <Tabs.Content value="features">
                      <Text>Explore all the amazing features we offer.</Text>
                    </Tabs.Content>
                    <Tabs.Content value="pricing">
                      <Text>Simple, transparent pricing for everyone.</Text>
                    </Tabs.Content>
                  </Box>
                </Tabs.Root>
              </Box>

              {/* Accordion */}
              <Box>
                <Text fontWeight="semibold" mb="3">Accordion</Text>
                <Accordion.Root multiple defaultValue={['item-1']}>
                  <Accordion.Item value="item-1">
                    <Accordion.ItemTrigger>
                      What is Park UI?
                      <Accordion.ItemIndicator>
                        <ChevronRight />
                      </Accordion.ItemIndicator>
                    </Accordion.ItemTrigger>
                    <Accordion.ItemContent>
                      <Text fontSize="sm" color="fg.muted">
                        Park UI is a modern component library built on top of Ark UI and PandaCSS,
                        providing beautifully designed and accessible components.
                      </Text>
                    </Accordion.ItemContent>
                  </Accordion.Item>

                  <Accordion.Item value="item-2">
                    <Accordion.ItemTrigger>
                      How do I install components?
                      <Accordion.ItemIndicator>
                        <ChevronRight />
                      </Accordion.ItemIndicator>
                    </Accordion.ItemTrigger>
                    <Accordion.ItemContent>
                      <Text fontSize="sm" color="fg.muted">
                        Use the Park UI CLI to install components: 
                        <Code>pnpm exec park-ui components add button</Code>
                      </Text>
                    </Accordion.ItemContent>
                  </Accordion.Item>

                  <Accordion.Item value="item-3">
                    <Accordion.ItemTrigger>
                      Is it production ready?
                      <Accordion.ItemIndicator>
                        <ChevronRight />
                      </Accordion.ItemIndicator>
                    </Accordion.ItemTrigger>
                    <Accordion.ItemContent>
                      <Text fontSize="sm" color="fg.muted">
                        Yes! Park UI components are built on battle-tested foundations
                        and are used in production by many companies.
                      </Text>
                    </Accordion.ItemContent>
                  </Accordion.Item>
                </Accordion.Root>
              </Box>

              {/* Links */}
              <Box>
                <Text fontWeight="semibold" mb="3">Links</Text>
                <HStack gap="4">
                  <Link href="#" textDecoration="underline">Standard Link</Link>
                  <Link href="#" color="blue.500">Colored Link</Link>
                  <Link href="#" fontWeight="bold">Bold Link</Link>
                </HStack>
              </Box>
            </VStack>
          </Card.Body>
        </Card.Root>
      </VStack>
    </Container>
  )
}