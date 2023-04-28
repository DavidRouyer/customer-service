import { defineConfig } from 'vitest/config';

// https://vitest.dev/config
export default defineConfig({
  test: {
    globals: true,
    setupFiles: '.vitest/setup',
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
});
