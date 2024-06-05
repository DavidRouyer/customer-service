import * as dotenv from 'dotenv';

dotenv.config({
  path: '../../.env',
});

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  /** Enables hot reloading for local packages without a build step */
  transpilePackages: [
    '@cs/api',
    '@cs/auth',
    '@cs/database',
    '@cs/kyaku',
    '@cs/ui',
    'lucide-react',
  ],
  /** We already do linting and typechecking as separate tasks in CI */
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(graphql|gql)/,
      exclude: /node_modules/,
      loader: 'graphql-tag/loader',
    });
    config.resolve.alias['awilix'] = 'awilix/lib/awilix.browser.js';

    return config;
  },
};

export default config;
