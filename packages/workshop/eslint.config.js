import storybook from 'eslint-plugin-storybook';

import baseConfig from '@kyaku/eslint-config/base';

/** @type {import('typescript-eslint').Config} */
export default [
  ...baseConfig,
  {
    ignores: ['.storybook/**/*'],
  },
  //...storybook.configs['flat/recommended']
];
