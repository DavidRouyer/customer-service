import { DateTimeResolver } from 'graphql-scalars';

import { Resolvers } from '../../generated-types/graphql';
import typeDefs from './typeDefs.graphql';

const resolvers: Resolvers = {
  DateTime: DateTimeResolver,
};

export const commonModule = {
  typeDefs: typeDefs,
  resolvers: resolvers,
};
