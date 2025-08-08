import { forwardRef } from 'react'
import { styled } from '@/styled-system/jsx'
import type { ComponentProps } from 'react'

const BreadcrumbContainer = styled('nav', {
  base: {
    display: 'flex',
    alignItems: 'center',
  },
})

const BreadcrumbList = styled('ol', {
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: '2',
    listStyle: 'none',
    m: 0,
    p: 0,
  },
})

const BreadcrumbItem = styled('li', {
  base: {
    display: 'flex',
    alignItems: 'center',
    fontSize: 'sm',
    color: 'fg.muted',
    '&:not(:last-child)::after': {
      content: '"/"',
      px: '2',
      color: 'fg.muted',
    },
  },
})

const BreadcrumbLink = styled('a', {
  base: {
    color: 'fg.muted',
    transition: 'color 0.2s',
    _hover: {
      color: 'fg.default',
      textDecoration: 'underline',
    },
  },
})

const BreadcrumbSeparator = styled('span', {
  base: {
    px: '2',
    color: 'fg.muted',
  },
})

const BreadcrumbPage = styled('span', {
  base: {
    fontWeight: 'medium',
    color: 'fg.default',
  },
})

export type BreadcrumbProps = ComponentProps<typeof BreadcrumbContainer>

export const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>((props, ref) => {
  return <BreadcrumbContainer ref={ref} aria-label="breadcrumb" {...props} />
})

Breadcrumb.displayName = 'Breadcrumb'

export { BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage }