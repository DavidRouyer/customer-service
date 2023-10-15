import * as dotenv from 'dotenv';

dotenv.config({
  path: '../../.env',
});

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  /** Enables hot reloading for local packages without a build step */
  transpilePackages: ['@cs/api', '@cs/auth', '@cs/database', '@cs/lib'],
  /** We already do linting and typechecking as separate tasks in CI */
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  experimental: {
    serverActions: true,
    swcPlugins: [['@swc-jotai/react-refresh', {}]],
  },
};

export default config;
