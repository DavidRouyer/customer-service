import * as dotenv from 'dotenv';
import { i18nRewriter } from 'next-i18n-router';

import i18nConfig from './src/app/i18n/config.mjs';

dotenv.config({
  path: '../../.env',
});

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  /** Enables hot reloading for local packages without a build step */
  transpilePackages: ['@cs/api', '@cs/auth', '@cs/database'],
  /** We already do linting and typechecking as separate tasks in CI */
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  experimental: {
    serverActions: true,
  },
  rewrites() {
    return {
      afterFiles: i18nRewriter(i18nConfig),
    };
  },
};

export default config;
