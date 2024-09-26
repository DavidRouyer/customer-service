import * as dotenv from 'dotenv';
import type { Config } from 'drizzle-kit';

dotenv.config({
  path: '../../.env',
});

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

export default {
  schema: './src/schemas',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
} satisfies Config;
