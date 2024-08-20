import { defineEventHandler } from 'vinxi/http';

import authHandler, { createRequestForAuthjs } from '@cs/auth';

export default defineEventHandler((event) => {
  const request = createRequestForAuthjs(
    event,
    process.env.AUTH_TRUST_HOST === 'true'
  );

  return authHandler(request);
});
