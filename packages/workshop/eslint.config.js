import baseConfig from '@kyaku/eslint-config/base';
import storybook from 'eslint-plugin-storybook'

/** @type {import('@typescript-eslint/utils').TSESLint.FlatConfig.ConfigArray} */
export default [
  ...baseConfig, {
    ignores: ['.storybook/**/*'],
  },
  ...storybook.configs['flat/recommended']
];
