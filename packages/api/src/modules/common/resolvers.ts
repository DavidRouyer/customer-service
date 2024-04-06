import { createModule } from 'graphql-modules';
import { DateResolver } from 'graphql-scalars';

import { CommonModule } from './generated-types/module-types';
import typeDefs from './typedefs/common.graphql';

const resolvers: CommonModule.Resolvers = {
  DateTime: DateResolver,
};

export const commonModule = createModule({
  id: 'common-module',
  dirname: __dirname,
  typeDefs: [typeDefs],
  resolvers: [resolvers],
});
