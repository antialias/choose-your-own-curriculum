import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@/styled-system': resolve(__dirname, 'styled-system'),
      '@': resolve(__dirname, 'src'),
      '@/': `${resolve(__dirname, 'src')}/`
    }
  },
  test: {
    include: ['src/**/*.test.{ts,tsx}'],
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.ts',
    exclude: ['tests/e2e/**'],
    silent: true,
  },
});
