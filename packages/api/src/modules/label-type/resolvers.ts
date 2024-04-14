import {
  paginate,
  validatePaginationArguments,
} from '@cs/kyaku/utils/pagination';

import { LabelTypeSortField } from '../../entities/label-type';
import { Resolvers } from '../../generated-types/graphql';
import LabelTypeService from '../../services/label-type';
import typeDefs from './typedefs/label-type.graphql';

const resolvers: Resolvers = {
  Query: {
    labelType: async (_, { id }, ctx) => {
      const labelTypeService: LabelTypeService =
        ctx.container.resolve('labelTypeService');

      return await labelTypeService.retrieve(id, {
        relations: {
          createdBy: true,
          updatedBy: true,
        },
      });
    },
    labelTypes: async (_, { filters, before, after, first, last }, ctx) => {
      const { cursor, direction, limit } = validatePaginationArguments(
        { before, after, first, last },
        { min: 1, max: 100 }
      );

      const labelTypeService: LabelTypeService =
        ctx.container.resolve('labelTypeService');

      const labelTypeResult = await labelTypeService.list(
        {
          isArchived: filters?.isArchived ?? false,
        },
        {
          cursor: cursor ?? undefined,
          direction: direction,
          limit: limit,
          relations: {
            createdBy: true,
            updatedBy: true,
          },
          sortBy: LabelTypeSortField.name,
        }
      );

      return paginate({
        array: labelTypeResult.items,
        hasNextPage: labelTypeResult.hasNextPage,
        getLastValue: (item) => item.name,
        args: { before, after, first, last },
      });
    },
  },
  Mutation: {
    archiveLabelType: async (_, { input: { id } }, ctx) => {
      if (!ctx.session) {
        throw new Error('Unauthorized');
      }

      const labelTypeService: LabelTypeService =
        ctx.container.resolve('labelTypeService');

      const archivedLabelType = await labelTypeService.archive(
        id,
        ctx.session.user.id
      );

      if (!archivedLabelType) {
        throw new Error(`Label type with id:${id} cannot be archived`);
      }

      return await labelTypeService.retrieve(id, {
        relations: {
          createdBy: true,
          updatedBy: true,
        },
      });
    },
    createLabelType: async (_, { input }, ctx) => {
      if (!ctx.session) {
        throw new Error('Unauthorized');
      }

      const labelTypeService: LabelTypeService =
        ctx.container.resolve('labelTypeService');

      const createdLabelType = await labelTypeService.create(
        {
          ...input,
          icon: input.icon ?? null,
        },
        ctx.session.user.id
      );

      if (!createdLabelType) {
        throw new Error(`Label type with name:${input.name} cannot be created`);
      }

      return await labelTypeService.retrieve(createdLabelType.id, {
        relations: {
          createdBy: true,
          updatedBy: true,
        },
      });
    },
    unarchiveLabelType: async (_, { input: { id } }, ctx) => {
      if (!ctx.session) {
        throw new Error('Unauthorized');
      }

      const labelTypeService: LabelTypeService =
        ctx.container.resolve('labelTypeService');

      const unarchivedLabelType = await labelTypeService.unarchive(
        id,
        ctx.session.user.id
      );

      if (!unarchivedLabelType) {
        throw new Error(`Label type with id:${id} cannot be unarchived`);
      }

      return await labelTypeService.retrieve(id, {
        relations: {
          createdBy: true,
          updatedBy: true,
        },
      });
    },
    updateLabelType: async (_, { input }, ctx) => {
      if (!ctx.session) {
        throw new Error('Unauthorized');
      }

      const labelTypeService: LabelTypeService =
        ctx.container.resolve('labelTypeService');

      const updatedLabelType = await labelTypeService.update(
        {
          ...input,
          name: input.name ?? undefined,
        },
        ctx.session.user.id
      );

      if (!updatedLabelType) {
        throw new Error(`Label type with id:${input.id} cannot be updated`);
      }

      return await labelTypeService.retrieve(input.id, {
        relations: {
          createdBy: true,
          updatedBy: true,
        },
      });
    },
  },
};

export const labelTypeModule = {
  typeDefs: typeDefs,
  resolvers: resolvers,
};
