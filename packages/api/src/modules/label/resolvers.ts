import { Resolvers } from '../../generated-types/graphql';
import typeDefs from './typeDefs.graphql';

const resolvers: Resolvers = {
  Query: {
    label: async (_, { id }, { dataloaders }) => {
      try {
        const label = await dataloaders.labelLoader.load(id);
        return {
          ...label,
          labelType: {
            id: label.labelTypeId,
          },
        };
      } catch (error) {
        return null;
      }
    },
  },
};

export const labelModule = {
  typeDefs: typeDefs,
  resolvers: resolvers,
};
