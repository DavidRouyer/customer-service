import { Resolvers } from '../../generated-types/graphql';
import typeDefs from './typeDefs.graphql';

const resolvers: Resolvers = {
  Query: {},
};

export const customerModule = {
  typeDefs: typeDefs,
  resolvers: resolvers,
};
