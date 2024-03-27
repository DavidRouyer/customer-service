import path from 'path';
import type { Config } from 'tailwindcss';

import baseConfig from '@cs/tailwind-config';

export default {
  content: [
    path.resolve(
      path.dirname(require.resolve('@cs/ui')),
      '../..',
      '**/*.{js,ts,jsx,tsx}'
    ),
    './src/**/*.{ts,tsx}',
  ],
  presets: [baseConfig],
} satisfies Config;
