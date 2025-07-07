import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: '@/styled-system', replacement: resolve(__dirname, 'styled-system') },
      { find: '@', replacement: resolve(__dirname, 'src') }
    ]
  },
  test: {
    include: ['src/**/*.test.{ts,tsx}'],
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.ts',
    exclude: ['tests/e2e/**'],
  },
});
