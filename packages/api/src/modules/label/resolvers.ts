import { LabelType, Resolvers } from '../../generated-types/graphql';
import LabelService from '../../services/label';
import { mapLabelType } from '../label-type/resolvers';
import typeDefs from './typeDefs.graphql';

export const mapLabel = (
  label: Awaited<ReturnType<LabelService['list']>>[number]
) => {
  return {
    ...label,
    labelType: {
      id: label.labelTypeId,
    } as LabelType,
  };
};

const resolvers: Resolvers = {
  Label: {
    labelType: async ({ labelType }, _, { dataloaders }) => {
      const lt = await dataloaders.labelTypeLoader.load(labelType.id);
      return mapLabelType(lt);
    },
  },
};

export const labelModule = {
  typeDefs: typeDefs,
  resolvers: resolvers,
};
