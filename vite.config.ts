import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    // Simulates a browser DOM environment so React components can render in tests
    environment: 'jsdom',

    // Runs this setup file before every test file
    // This is where we wire up jest-dom matchers like toBeInTheDocument()
    setupFiles: './src/test/setup.ts',

    // Allows using describe/it/expect without importing them in every test file
    globals: true,
  },
})