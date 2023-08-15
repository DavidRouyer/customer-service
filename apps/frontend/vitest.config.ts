import path from 'path';
import { defineConfig } from 'vitest/config';

// https://vitest.dev/config
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    environmentOptions: {
      jsdom: {
        resources: 'usable',
      },
    },
    coverage: {
      reporter: ['lcov'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
