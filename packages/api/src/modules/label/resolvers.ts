import type { LabelType, Resolvers } from '../../generated-types/graphql';
import type { LabelService } from '../../services/label';
import { authorize } from '../../authorize';
import { handleErrors } from '../error';
import { mapLabelType } from '../label-type/resolvers';
import typeDefs from './typeDefs';

export const mapLabel = (
  label: Awaited<ReturnType<LabelService['list']>>[number],
) => {
  return {
    ...label,
    labelType: {
      id: label.labelTypeId,
    } as LabelType,
  };
};

const resolvers: Resolvers = {
  Mutation: {
    addLabels: async (_, { input }, { container, user }) => {
      const authorizedUser = authorize(user);

      const labelService = container.resolve<LabelService>('labelService');
      try {
        const addedLabels = await labelService.addLabels(
          input.ticketId,
          input.labelTypeIds,
          authorizedUser.id,
        );

        return {
          labels: addedLabels?.map((label) => mapLabel(label)) ?? [],
        };
      } catch (error) {
        return {
          labels: null,
          ...handleErrors(error),
        };
      }
    },
    removeLabels: async (_, { input }, { container, user }) => {
      const authorizedUser = authorize(user);

      const labelService = container.resolve<LabelService>('labelService');
      try {
        await labelService.removeLabels(
          input.ticketId,
          input.labelIds,
          authorizedUser.id,
        );

        return {};
      } catch (error) {
        return handleErrors(error);
      }
    },
  },
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
