import type { Config } from 'tailwindcss';

import baseConfig from '@cs/tailwind-config';

export default {
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/styles/**/*.css',
  ],
  presets: [baseConfig],
} satisfies Config;
