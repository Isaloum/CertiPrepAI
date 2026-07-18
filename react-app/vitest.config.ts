import { defineConfig } from 'vitest/config'

// Standalone test config — intentionally does NOT load the app's Vite plugins
// (React/Tailwind). Current tests are pure logic in a node environment.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
  },
})
