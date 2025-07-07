import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: '@/styled-system', replacement: resolve(__dirname, 'styled-system') },
      { find: '@', replacement: resolve(__dirname, 'src') }
    ],
  },
  test: {
    include: ['tests/e2e/**/*.test.ts'],
    environment: 'node',
    globals: true,
  },
});
