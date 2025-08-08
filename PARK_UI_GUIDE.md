# Park UI Component Usage Guide

## Overview

Park UI components are installed using the **Park UI CLI** tool. The CLI downloads and configures official components that are built on top of Ark UI for full accessibility and feature support.

## Installation

### Install All Components
```bash
pnpm exec park-ui components add --all
```

### Install Specific Components
```bash
pnpm exec park-ui components add button card dialog
```

## Configuration

The `park-ui.json` file configures the CLI:
```json
{
  "$schema": "https://park-ui.com/registry/latest/schema.json",
  "jsFramework": "react",
  "outputPath": "./src/components/ui"
}
```

## Component Structure

Park UI components follow a consistent pattern:

### 1. UI Component (`src/components/ui/[component].tsx`)
- Wrapper component with additional logic
- Imports from `./styled/[component]`
- May add loading states, icons, or other enhancements

### 2. Styled Component (`src/components/ui/styled/[component].tsx`)
- Core styled components using PandaCSS recipes
- Built on top of Ark UI primitives
- Exports multiple parts for complex components

## Usage Patterns

### Simple Components
```typescript
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

// Direct usage
<Button variant="solid" size="md">Click Me</Button>
<Input placeholder="Enter text..." />
<Badge>New</Badge>
```

### Complex Components with Multiple Parts
```typescript
import { Card } from '@/components/ui/card'
import { Dialog } from '@/components/ui/dialog'
import { Tabs } from '@/components/ui/tabs'

// Namespace pattern
<Card.Root>
  <Card.Header>
    <Card.Title>Title</Card.Title>
    <Card.Description>Description</Card.Description>
  </Card.Header>
  <Card.Body>Content</Card.Body>
  <Card.Footer>Footer</Card.Footer>
</Card.Root>

<Dialog.Root>
  <Dialog.Trigger>Open</Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Title</Dialog.Title>
    </Dialog.Header>
    <Dialog.Body>Content</Dialog.Body>
  </Dialog.Content>
</Dialog.Root>
```

## Available Components

### Form Components
- Button
- Checkbox
- Input
- RadioGroup
- Select
- Switch
- Textarea
- NumberInput
- PinInput
- Slider
- ColorPicker
- DatePicker
- TagsInput

### Display Components
- Alert
- Avatar
- Badge
- Card
- Code
- Kbd
- Table
- Text
- QrCode

### Navigation Components
- Accordion
- Breadcrumb (custom)
- Link
- Tabs
- Menu
- Pagination

### Overlay Components
- Dialog
- Drawer
- HoverCard
- Popover
- Tooltip
- Toast

### Feedback Components
- Progress
- Skeleton
- Spinner
- RatingGroup

### Layout Components
- Divider (custom)
- Splitter
- Collapsible

### Other Components
- Clipboard
- Editable
- Field
- Fieldset
- FileUpload
- TreeView
- SegmentGroup
- ToggleGroup

## Custom Components

Some components are not provided by Park UI and were created manually:
- **Breadcrumb** - Navigation breadcrumb component
- **Divider** - Visual separator component

## Updating Components

To get the latest component updates:
```bash
# Update Park UI CLI
pnpm update @park-ui/cli --latest

# Re-add components
pnpm exec park-ui components add --all
```

## Troubleshooting

### Import Errors
Ensure paths use the configured aliases:
- ✅ `import { Button } from '@/components/ui/button'`
- ❌ `import { Button } from '../ui/button'`

### Type Errors
Components may require specific props:
- Check the component's TypeScript interface
- Some components need `children` prop
- Loading states may need `loading` and `loadingText`

### Build Errors
If a component causes build errors:
1. Check Ark UI version compatibility
2. Temporarily disable the component
3. Report issue to Park UI repository

## Resources

- [Park UI Documentation](https://park-ui.com)
- [Ark UI Documentation](https://ark-ui.com)
- [PandaCSS Documentation](https://panda-css.com)
- [Park UI GitHub](https://github.com/cschroeter/park-ui)