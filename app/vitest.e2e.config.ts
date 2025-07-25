import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@/': `${resolve(__dirname, 'src')}/`,
      '@/styled-system': resolve(__dirname, 'styled-system'),
    },
  },
  test: {
    include: ['tests/e2e/**/*.test.ts'],
    environment: 'node',
    globals: true,
    silent: true,
  },
});
