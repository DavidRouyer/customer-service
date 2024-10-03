import queryPlugin from '@tanstack/eslint-plugin-query';
import routerPlugin from '@tanstack/eslint-plugin-router';
import reactPlugin from 'eslint-plugin-react';
import hooksPlugin from 'eslint-plugin-react-hooks';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      react: reactPlugin,
      'react-hooks': hooksPlugin,
    },
    rules: {
      ...reactPlugin.configs['jsx-runtime'].rules,
      ...hooksPlugin.configs.recommended.rules,
    },
    languageOptions: {
      globals: {
        React: 'writable',
      },
    },
  },
  ...queryPlugin.configs['flat/recommended'],
  ...routerPlugin.configs['flat/recommended'],
];
