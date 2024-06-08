import { GraphQLError } from 'graphql';
import { ZodError } from 'zod';

import { DrizzleError } from '@cs/database';
import { KyakuError, KyakuErrorTypes } from '@cs/kyaku/utils';

export const handleErrors = (error: unknown) => {
  if (error instanceof KyakuError) {
    return {
      userErrors: [
        {
          code: error.type,
          message: error.message,
          path: error.path,
        },
      ],
    };
  }
  if (error instanceof ZodError) {
    return {
      userErrors: error.issues.map((issue) => ({
        code: issue.code,
        message: issue.message,
        path: issue.path.map((path) => path.toString()),
      })),
    };
  }
  if (error instanceof DrizzleError) {
    throw new GraphQLError(error.message, {
      extensions: {
        code: KyakuErrorTypes.DB_ERROR,
      },
    });
  }
  throw new GraphQLError((error as Error).message, {
    extensions: {
      code: KyakuErrorTypes.INTERNAL,
    },
  });
};
