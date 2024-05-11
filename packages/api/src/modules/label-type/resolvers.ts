import { GraphQLError } from 'graphql';

import { KyakuErrorTypes } from '@cs/kyaku/utils/errors';
import {
  connectionFromArray,
  validatePaginationArguments,
} from '@cs/kyaku/utils/pagination';

import { LabelTypeSortField } from '../../entities/label-type';
import { Resolvers, User } from '../../generated-types/graphql';
import LabelTypeService from '../../services/label-type';
import { handleErrors } from '../error';
import typeDefs from './typeDefs.graphql';

export const mapLabelType = (
  labelType: Awaited<ReturnType<LabelTypeService['list']>>[number]
) => {
  return {
    ...labelType,
    createdBy: {
      id: labelType.createdById,
    } as User,
    updatedBy: labelType.updatedById
      ? ({
          id: labelType.updatedById,
        } as User)
      : null,
  };
};

const resolvers: Resolvers = {
  Query: {
    labelType: async (_, { id }, { dataloaders }) => {
      try {
        const labelType = await dataloaders.labelTypeLoader.load(id);
        return mapLabelType(labelType);
      } catch (error) {
        return null;
      }
    },
    labelTypes: async (
      _,
      { filters, before, after, first, last },
      { container }
    ) => {
      const { cursor, direction, limit } = validatePaginationArguments(
        { before, after, first, last },
        { min: 1, max: 100 }
      );

      const labelTypeService: LabelTypeService =
        container.resolve('labelTypeService');

      const labelTypes = await labelTypeService.list(
        {
          isArchived: filters?.isArchived ?? false,
        },
        {
          cursor: cursor ?? undefined,
          direction: direction,
          limit: limit + 1,
          sortBy: LabelTypeSortField.name,
        }
      );

      return connectionFromArray({
        array: labelTypes.map((labelType) => mapLabelType(labelType)),
        args: { before, after, first, last },
        meta: {
          direction,
          getLastValue: (item) => item.name,
          limit,
        },
      });
    },
  },
  LabelType: {
    createdBy: async ({ createdBy }, _, { dataloaders }) => {
      return dataloaders.userLoader.load(createdBy.id);
    },
    updatedBy: async ({ updatedBy }, _, { dataloaders }) => {
      if (!updatedBy) {
        return null;
      }
      return dataloaders.userLoader.load(updatedBy.id);
    },
  },
  Mutation: {
    archiveLabelType: async (_, { input }, { container, session }) => {
      if (!session) {
        throw new GraphQLError('Unauthorized', {
          extensions: {
            code: KyakuErrorTypes.UNAUTHORIZED,
          },
        });
      }

      const labelTypeService: LabelTypeService =
        container.resolve('labelTypeService');

      try {
        const archivedLabelType = await labelTypeService.archive(
          input.id,
          session.user.id
        );

        return {
          labelType: archivedLabelType
            ? await labelTypeService.retrieve(archivedLabelType.id, {
                relations: {
                  createdBy: true,
                  updatedBy: true,
                },
              })
            : null,
        };
      } catch (error) {
        return handleErrors(error);
      }
    },
    createLabelType: async (_, { input }, { container, session }) => {
      if (!session) {
        throw new GraphQLError('Unauthorized', {
          extensions: {
            code: KyakuErrorTypes.UNAUTHORIZED,
          },
        });
      }

      const labelTypeService: LabelTypeService =
        container.resolve('labelTypeService');

      try {
        const createdLabelType = await labelTypeService.create(
          {
            ...input,
            icon: input.icon ?? null,
          },
          session.user.id
        );

        return {
          labelType: createdLabelType
            ? await labelTypeService.retrieve(createdLabelType.id, {
                relations: {
                  createdBy: true,
                  updatedBy: true,
                },
              })
            : null,
        };
      } catch (error) {
        return handleErrors(error);
      }
    },
    unarchiveLabelType: async (_, { input }, ctx) => {
      if (!ctx.session) {
        throw new GraphQLError('Unauthorized', {
          extensions: {
            code: KyakuErrorTypes.UNAUTHORIZED,
          },
        });
      }

      const labelTypeService: LabelTypeService =
        ctx.container.resolve('labelTypeService');

      try {
        const unarchivedLabelType = await labelTypeService.unarchive(
          input.id,
          ctx.session.user.id
        );

        return {
          labelType: unarchivedLabelType
            ? await labelTypeService.retrieve(unarchivedLabelType.id, {
                relations: {
                  createdBy: true,
                  updatedBy: true,
                },
              })
            : null,
        };
      } catch (error) {
        return handleErrors(error);
      }
    },
    updateLabelType: async (_, { input }, ctx) => {
      if (!ctx.session) {
        throw new GraphQLError('Unauthorized', {
          extensions: {
            code: KyakuErrorTypes.UNAUTHORIZED,
          },
        });
      }

      const labelTypeService: LabelTypeService =
        ctx.container.resolve('labelTypeService');

      try {
        const updatedLabelType = await labelTypeService.update(
          {
            ...input,
            name: input.name ?? undefined,
          },
          ctx.session.user.id
        );

        return {
          labelType: updatedLabelType
            ? await labelTypeService.retrieve(updatedLabelType?.id, {
                relations: {
                  createdBy: true,
                  updatedBy: true,
                },
              })
            : null,
        };
      } catch (error) {
        return handleErrors(error);
      }
    },
  },
};

export const labelTypeModule = {
  typeDefs: typeDefs,
  resolvers: resolvers,
};
