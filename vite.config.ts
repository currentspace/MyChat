import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-vite-plugin'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [
    react(),
    TanStackRouterVite(),
    tsconfigPaths()
  ],
  build: { 
    outDir: 'dist', 
    assetsDir: 'assets' 
  }
})