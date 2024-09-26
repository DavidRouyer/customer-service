import { GraphQLError } from 'graphql';

import type { User } from '@kyaku/kyaku/models';
import { KyakuErrorTypes } from '@kyaku/kyaku/utils';

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
