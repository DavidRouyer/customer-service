import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

// https://vitest.dev/config
export default defineConfig({
  plugins: [react()],

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
