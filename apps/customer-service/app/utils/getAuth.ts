import type { Session } from '@auth/core/types';

import { authOptions } from '@cs/auth';

import { authenticateRequest } from '../authenticateRequest';

export async function getAuth(request: Request): Promise<Session | null> {
  if (!request) {
    throw new Error('No context provided');
  }

  const requestState = await authenticateRequest(request, authOptions);

  return requestState;
}
