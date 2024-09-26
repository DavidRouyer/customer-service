import path from 'path';
import type { Config } from 'tailwindcss';

import baseConfig from '@kyaku/tailwind-config';

export default {
  content: [
    path.resolve(
      path.dirname(require.resolve('@kyaku/ui')),
      '../..',
      '**/*.{js,ts,jsx,tsx}'
    ),
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './styles/**/*.css',
  ],
  presets: [baseConfig],
} satisfies Config;
