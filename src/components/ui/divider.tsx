import { forwardRef } from 'react'
import { styled } from '@/styled-system/jsx'
import type { ComponentProps } from 'react'

const StyledDivider = styled('hr', {
  base: {
    border: 'none',
    bg: 'border.default',
  },
  variants: {
    orientation: {
      horizontal: {
        w: 'full',
        h: 'px',
        my: '4',
      },
      vertical: {
        h: 'full',
        w: 'px',
        mx: '4',
      },
    },
    variant: {
      solid: {
        bg: 'border.default',
      },
      dashed: {
        backgroundImage: 'repeating-linear-gradient(to right, transparent, transparent 4px, var(--colors-border-default) 4px, var(--colors-border-default) 8px)',
      },
      dotted: {
        backgroundImage: 'repeating-linear-gradient(to right, var(--colors-border-default), var(--colors-border-default) 2px, transparent 2px, transparent 6px)',
      },
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
    variant: 'solid',
  },
})

export type DividerProps = ComponentProps<typeof StyledDivider>

export const Divider = forwardRef<HTMLHRElement, DividerProps>((props, ref) => {
  return <StyledDivider ref={ref} {...props} />
})

Divider.displayName = 'Divider'