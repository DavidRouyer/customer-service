import { Resolvers } from '../../generated-types/graphql';
import typeDefs from './typeDefs.graphql';

const resolvers: Resolvers = {
  Label: {
    labelType: async ({ labelType }, _, { dataloaders }) => {
      const lt = await dataloaders.labelTypeLoader.load(labelType.id);
      return {
        ...lt,
        createdBy: {
          id: lt.createdById,
        },
        updatedBy: lt.updatedById
          ? {
              id: lt.updatedById,
            }
          : null,
      };
    },
  },
};

export const labelModule = {
  typeDefs: typeDefs,
  resolvers: resolvers,
};
