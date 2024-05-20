import {
  connectionFromArray,
  validatePaginationArguments,
} from '@cs/kyaku/utils/pagination';

import { authorize } from '../../authorize';
import { LabelTypeSortField } from '../../entities/label-type';
import { Resolvers, User } from '../../generated-types/graphql';
import LabelTypeService from '../../services/label-type';
import { handleErrors } from '../error';
import typeDefs from './typeDefs';

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

      const labelTypeService = container.resolve('labelTypeService');

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
    archiveLabelType: async (
      _,
      { input },
      { container, dataloaders, user }
    ) => {
      const authorizedUser = authorize(user);

      const labelTypeService = container.resolve('labelTypeService');

      try {
        const archivedLabelType = await labelTypeService.archive(
          input.id,
          authorizedUser.id
        );

        return {
          labelType: archivedLabelType
            ? mapLabelType(
                await dataloaders.labelTypeLoader.load(archivedLabelType.id)
              )
            : null,
        };
      } catch (error) {
        return handleErrors(error);
      }
    },
    createLabelType: async (_, { input }, { container, dataloaders, user }) => {
      const authorizedUser = authorize(user);

      const labelTypeService = container.resolve('labelTypeService');

      try {
        const createdLabelType = await labelTypeService.create(
          {
            ...input,
            icon: input.icon ?? null,
          },
          authorizedUser.id
        );

        return {
          labelType: createdLabelType
            ? mapLabelType(
                await dataloaders.labelTypeLoader.load(createdLabelType.id)
              )
            : null,
        };
      } catch (error) {
        return handleErrors(error);
      }
    },
    unarchiveLabelType: async (
      _,
      { input },
      { container, dataloaders, user }
    ) => {
      const authorizedUser = authorize(user);

      const labelTypeService = container.resolve('labelTypeService');

      try {
        const unarchivedLabelType = await labelTypeService.unarchive(
          input.id,
          authorizedUser.id
        );

        return {
          labelType: unarchivedLabelType
            ? mapLabelType(
                await dataloaders.labelTypeLoader.load(unarchivedLabelType.id)
              )
            : null,
        };
      } catch (error) {
        return handleErrors(error);
      }
    },
    updateLabelType: async (_, { input }, { container, dataloaders, user }) => {
      const authorizedUser = authorize(user);

      const labelTypeService = container.resolve('labelTypeService');

      try {
        const updatedLabelType = await labelTypeService.update(
          {
            ...input,
            name: input.name ?? undefined,
          },
          authorizedUser.id
        );

        return {
          labelType: updatedLabelType
            ? mapLabelType(
                await dataloaders.labelTypeLoader.load(updatedLabelType.id)
              )
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
