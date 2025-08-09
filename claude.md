Prompt: Modern React 19.1 App with PandaCSS, TanStack Router, Vite, and Cloudflare
You are my reference and code generation assistant for this project. All responses should adhere to the following standards, patterns, and constraints. Use this prompt as a continued reference.

Project Overview
Build a production-ready, modern React 19.1 application with:

Zero-runtime CSS-in-JS styling: PandaCSS (@pandacss/dev) + Park UI Preset
Type-safe client routing: TanStack Router
Vite: Fast build/dev, optimized for modern React
Cloudflare Workers/Pages: Deploy to the edge, static and dynamic support
pnpm: Efficient dependency management

Key Architectural Principles
React 19.1 Patterns

Use Suspense for all async operations & code splitting
Use the use() hook for data fetching, context, and promises—avoid useEffect for data
For user events: use event handlers, not effects
For subscriptions/external stores: use useSyncExternalStore
Consider React Server Components (RSC) if SSR/SEO needed

Styling

Use @pandacss/dev and Park UI for all component styling
Configure in panda.config.ts, using design tokens, semantic colors, and responsive conditions

Routing

Structure with TanStack Router:

File-based routes
Type-safe params/loaders
Suspense-integrated route transitions
Error boundaries per route/layout

Data Fetching

Never use useEffect for fetching—always use use() with Suspense boundaries
All async operations are Suspense-wrapped

Project Layout
/

├── src/

│ ├── routes/ # Route files for TanStack Router

│ ├── components/

│ │ ├── ui/ # Park UI/panda components

│ │ └── features/ # App features

│ ├── lib/ # API clients/utils

│ └── styled-system/ # PandaCSS output

├── functions/ # Cloudflare Workers (optional)

├── panda.config.ts

├── vite.config.ts

├── wrangler.toml

├── package.json

Implementation Steps
Setup

Init with:

pnpm create vite@latest # React + TS template

pnpm add react@19.1 react-dom@19.1

pnpm add -D @pandacss/dev @park-ui/panda-preset

pnpm add @tanstack/react-router

pnpm add -D @cloudflare/workers-types wrangler

PandaCSS Config (panda.config.ts)

import { defineConfig } from '@pandacss/dev'

import { createPreset } from '@park-ui/panda-preset'

export default defineConfig({

presets: [

    '@pandacss/preset-base',

    createPreset({

      accentColor: 'blue',

      grayColor: 'neutral',

      borderRadius: 'md',

    }),

],

include: ['./src/**/*.{ts,tsx}'],

outdir: 'src/styled-system',

})

Vite Config (vite.config.ts)

import { defineConfig } from 'vite'

import react from '@vitejs/plugin-react'

import { TanStackRouterVite } from '@tanstack/router-vite-plugin'

export default defineConfig({

plugins: [react(), TanStackRouterVite()],

build: { outDir: 'dist', assetsDir: 'assets' }

})

Data Fetching Pattern

All fetches use Suspense + use():

// In a component:

const data = use(fetchDataPromise)

return <div>{data.title}</div>

// Suspense parent:

<Suspense fallback={<Loading/>}><DataComponent /></Suspense>

Routing Example

// src/routes/\_\_root.tsx

import { Outlet, createRootRoute } from '@tanstack/react-router'

import { Suspense } from 'react'

export const Route = createRootRoute({

component: () => (

    <Suspense fallback={<div>Loading...</div>}>

      <Outlet />

    </Suspense>

),

})

Cloudflare Deployment

wrangler.toml example:

name = "react-app"

compatibility_date = "2024-01-01"

pages_build_output_dir = "dist"

[site]

bucket = "./dist"

GitHub Actions deploy (snippet):

- uses: actions/checkout@v4

- uses: pnpm/action-setup@v2

- name: Install and Build

  run: |

  pnpm install

  pnpm build

- name: Deploy

  uses: cloudflare/pages-action@v1

  with:

  apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}

  accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}

  projectName: react-app

  directory: dist

Best Practices
Code splitting with React.lazy + Suspense
Use useOptimistic and useTransition for smooth async UI
Use Error Boundaries per route/layout
Optimize bundles with Vite
PandaCSS for zero-runtime CSS
CI/CD for testing/deployment (Vitest, React Testing Library, Playwright)
TypeScript everywhere, strict mode enabled

Non-Negotiables (Success Criteria)
No useEffect for data fetching—must use Suspense + use()
TanStack Router for all routing (no react-router)
Consistent styling with PandaCSS + Park UI
Edge-deployable on Cloudflare
Efficient package/dependency management with pnpm
All async logic Suspense-based
Type safety throughout

Reference Example: Suspense Data Component
import { use, Suspense } from 'react'

import { css } from '../styled-system/css'

import { Button } from '../components/ui/button'

const fetchData = async () => fetch('/api/data').then(r => r.json())

const dataPromise = fetchData()

function DataDisplay() {

const data = use(dataPromise)

return (

    <div className={css({ p: 4, bg: 'background' })}>

      <Button variant="primary">{data.title}</Button>

    </div>

)

}

export function App() {

return (

    <Suspense fallback={<div>Loading...</div>}>

      <DataDisplay />

    </Suspense>

)

}

Always adhere to these patterns. If you generate code or architecture, reference this doc and follow its conventions. If I ask about setup, patterns, or best practices, answer in this context.

# TypeScript Rules
NEVER use 'any' type to coerce types in TypeScript
Always use proper type definitions and interfaces
Use type assertions sparingly and only when necessary with proper typing
Prefer unknown over any when type is truly unknown
Use proper type guards and type narrowing techniques
