import { DateTimeResolver } from 'graphql-scalars';

import type { Resolvers } from '../../generated-types/graphql';
import typeDefs from './typeDefs';

const resolvers: Resolvers = {
  DateTime: DateTimeResolver,
};

export const commonModule = {
  typeDefs: typeDefs,
  resolvers: resolvers,
};
