import { GraphQLError } from 'graphql';

import type { User } from '@cs/kyaku/models';
import { KyakuErrorTypes } from '@cs/kyaku/utils/errors';

export const authorize = (user: User | null) => {
  if (!user) {
    throw new GraphQLError('Unauthorized', {
      extensions: {
        code: KyakuErrorTypes.UNAUTHORIZED,
      },
    });
  }

  return user;
};
