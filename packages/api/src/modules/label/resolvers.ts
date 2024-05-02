import { GraphQLError } from 'graphql';

import { KyakuError } from '@cs/kyaku/utils';

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
            code: 'UNAUTHORIZED',
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
        if (error instanceof KyakuError) {
          return {
            labels: [],
            errors: [
              {
                code: error.type,
                message: error.message,
                fields: [],
              },
            ],
          };
        }
        throw new GraphQLError((error as Error).message);
      }
    },
  },
};

export const labelModule = {
  typeDefs: typeDefs,
  resolvers: resolvers,
};
