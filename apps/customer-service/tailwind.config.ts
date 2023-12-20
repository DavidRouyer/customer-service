import path from 'path';
import type { Config } from 'tailwindcss';

import baseConfig from '@cs/tailwind-config';

console.log('tailwind dir', path.dirname(require.resolve('@cs/ui')));

export default {
  content: [
    path.resolve(
      path.dirname(require.resolve('@cs/ui')),
      '../..',
      '**/*.{js,ts,jsx,tsx}'
    ),
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/styles/**/*.css',
  ],
  presets: [baseConfig],
} satisfies Config;
