import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import stylex from '@stylexjs/babel-plugin';

export default defineConfig({
  plugins: [react({ babel: { plugins: [stylex] } })],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.ts',
  },
});
