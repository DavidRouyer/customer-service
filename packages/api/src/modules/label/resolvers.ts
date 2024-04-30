import { Resolvers } from '../../generated-types/graphql';
import typeDefs from './typeDefs.graphql';

const resolvers: Resolvers = {
  Label: {
    labelType: async ({ labelType: { id } }, _, { dataloaders }) => {
      const labelType = await dataloaders.labelTypeLoader.load(id);
      return {
        ...labelType,
        createdBy: {
          id: labelType.createdById,
        },
        updatedBy: labelType.updatedById
          ? {
              id: labelType.updatedById,
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
