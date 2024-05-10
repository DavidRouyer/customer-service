import { GraphQLError } from 'graphql';

import { KyakuErrorTypes } from '@cs/kyaku/utils/errors';

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
  Mutation: {
    addLabels: async (_, { input }, { container, session }) => {
      if (!session) {
        throw new GraphQLError('Unauthorized', {
          extensions: {
            code: KyakuErrorTypes.UNAUTHORIZED,
          },
        });
      }

      const labelService = container.resolve<LabelService>('labelService');
      try {
        const addedLabels = await labelService.addLabels(
          input.ticketId,
          input.labelTypeIds,
          session.user.id
        );

        return {
          labels: addedLabels?.map((label) => mapLabel(label)) ?? [],
        };
      } catch (error) {
        throw new GraphQLError((error as Error).message);
      }
    },
    removeLabels: async (_, { input }, { container, session }) => {
      if (!session) {
        throw new GraphQLError('Unauthorized', {
          extensions: {
            code: KyakuErrorTypes.UNAUTHORIZED,
          },
        });
      }

      const labelService = container.resolve<LabelService>('labelService');
      try {
        await labelService.removeLabels(
          input.ticketId,
          input.labelIds,
          session.user.id
        );

        return {};
      } catch (error) {
        throw new GraphQLError((error as Error).message);
      }
    },
  },
};

export const labelModule = {
  typeDefs: typeDefs,
  resolvers: resolvers,
};
