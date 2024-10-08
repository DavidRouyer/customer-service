import { z } from 'zod';

import type {
  InferInsertModel,
  InferSelectModel,
  LabelTypeRepository,
} from '@kyaku/database';
import type { FindConfig, GetConfig } from '@kyaku/kyaku/types';
import {
  and,
  eq,
  filterByDirection,
  inclusionFilterOperator,
  isNotNull,
  isNull,
  schema,
  sortByDirection,
} from '@kyaku/database';
import { Direction } from '@kyaku/kyaku/types';
import { KyakuError } from '@kyaku/kyaku/utils';

import type { UnitOfWork } from '../../unit-of-work';
import type { LabelTypeFilters, LabelTypeWith } from './common';
import { BaseService } from '../base-service';
import { LabelTypeSortField } from './common';

export class LabelTypeService extends BaseService {
  private readonly labelTypeRepository: LabelTypeRepository;

  constructor({
    labelTypeRepository,
  }: {
    labelTypeRepository: LabelTypeRepository;
  } & { unitOfWork: UnitOfWork }) {
    // eslint-disable-next-line prefer-rest-params, @typescript-eslint/no-unsafe-argument
    super(arguments[0]);
    this.labelTypeRepository = labelTypeRepository;
  }

  async retrieve<T extends LabelTypeWith<T>>(
    labelTypeId: string,
    config?: GetConfig<T>,
  ) {
    return await this.labelTypeRepository.find({
      where: eq(schema.labelTypes.id, labelTypeId),
      with: this.getWithClause(config?.relations),
    });
  }

  async retrieveByName<T extends LabelTypeWith<T>>(
    labelTypeName: string,
    config?: GetConfig<T>,
  ) {
    return await this.labelTypeRepository.find({
      where: eq(schema.labelTypes.name, labelTypeName),
      with: this.getWithClause(config?.relations),
    });
  }

  async list<T extends LabelTypeWith<T>>(
    filters: LabelTypeFilters = {
      isArchived: false,
    },
    config: FindConfig<T, LabelTypeSortField> = {
      direction: Direction.Forward,
      limit: 50,
      sortBy: LabelTypeSortField.name,
    },
  ) {
    return await this.labelTypeRepository.findMany({
      limit: config.limit,
      orderBy: [
        ...this.getOrderByClause(config),
        sortByDirection(config.direction)(schema.labelTypes.id),
      ],
      where: and(
        this.getFilterWhereClause(filters),
        this.getSortWhereClause(config),
        this.getIdWhereClause(config),
      ),
      with: this.getWithClause(config.relations),
    });
  }

  async create(
    data: Omit<
      InferInsertModel<typeof schema.labelTypes>,
      | 'id'
      | 'createdAt'
      | 'createdById'
      | 'updatedAt'
      | 'updatedById'
      | 'archivedAt'
    >,
    userId: string,
  ) {
    const createLabelTypeSchema = z
      .object({
        name: z.string().min(1),
        icon: z.string().optional(),
      })
      .refine(
        async (dataToRefine) => {
          const labelTypeWithName = await this.retrieveByName(
            dataToRefine.name,
          );
          return !labelTypeWithName;
        },
        {
          message: `Label type with name:${data.name} already exists`,
          path: ['name'],
        },
      );

    await createLabelTypeSchema.parseAsync(data);

    return await this.unitOfWork.transaction(async (tx) => {
      const createdAt = new Date();

      const newLabelType = await this.labelTypeRepository.create(
        {
          ...data,
          createdAt: createdAt,
          createdById: userId,
        },
        tx,
      );

      if (!newLabelType) {
        tx.rollback();
        return;
      }

      return {
        id: newLabelType.id,
      };
    });
  }

  async update(
    data: Partial<InferInsertModel<typeof schema.labelTypes>> & {
      id: NonNullable<InferSelectModel<typeof schema.labelTypes>['id']>;
    },
    userId: string,
  ) {
    const labelType = await this.retrieve(data.id);

    if (!labelType)
      throw new KyakuError(
        KyakuError.Types.NOT_FOUND,
        `Label type with id:${data.id} not found`,
        ['id'],
      );

    const updateLabelTypeSchema = z
      .object({
        name: z.string().min(1).optional(),
        icon: z.string().optional(),
      })
      .refine(
        async (dataToRefine) => {
          if (!dataToRefine.name) return true;

          const labelTypeWithName = await this.retrieveByName(
            dataToRefine.name,
          );
          return !labelTypeWithName || labelTypeWithName.id === data.id;
        },
        {
          message: `Label type with name:${data.name} already exists`,
          path: ['name'],
        },
      );

    await updateLabelTypeSchema.parseAsync(data);

    return await this.unitOfWork.transaction(async (tx) => {
      const updatedAt = new Date();

      const updatedLabelType = await this.labelTypeRepository.update(
        {
          ...data,
          updatedAt: updatedAt,
          updatedById: userId,
        },
        tx,
      );

      if (!updatedLabelType) {
        tx.rollback();
        return;
      }

      return {
        id: updatedLabelType.id,
      };
    });
  }

  async archive(labelTypeId: string, userId: string) {
    const labelType = await this.retrieve(labelTypeId);

    if (!labelType)
      throw new KyakuError(
        KyakuError.Types.NOT_FOUND,
        `Label type with id:${labelTypeId} not found`,
        ['id'],
      );

    if (labelType.archivedAt) return;

    return await this.unitOfWork.transaction(async (tx) => {
      const updatedAt = new Date();

      return await this.labelTypeRepository.update(
        {
          id: labelType.id,
          updatedAt: updatedAt,
          updatedById: userId,
          archivedAt: updatedAt,
        },
        tx,
      );
    });
  }

  async unarchive(labelTypeId: string, userId: string) {
    const labelType = await this.retrieve(labelTypeId);

    if (!labelType)
      throw new KyakuError(
        KyakuError.Types.NOT_FOUND,
        `Label type with id:${labelTypeId} not found`,
        ['id'],
      );

    if (!labelType.archivedAt) return;

    return await this.unitOfWork.transaction(async (tx) => {
      const updatedAt = new Date();

      return await this.labelTypeRepository.update(
        {
          id: labelType.id,
          updatedAt: updatedAt,
          updatedById: userId,
          archivedAt: null,
        },
        tx,
      );
    });
  }

  private getWithClause<T extends LabelTypeWith<T>>(
    relations: T | undefined,
  ): {
    createdBy: T extends { createdBy: true }
      ? {
          columns: { [K in keyof InferSelectModel<typeof schema.users>]: true };
        }
      : undefined;
    updatedBy: T extends { updatedBy: true }
      ? {
          columns: { [K in keyof InferSelectModel<typeof schema.users>]: true };
        }
      : undefined;
  } {
    return {
      createdBy: (relations?.createdBy ? true : undefined) as T extends {
        createdBy: true;
      }
        ? {
            columns: {
              [K in keyof InferSelectModel<typeof schema.users>]: true;
            };
          }
        : undefined,
      updatedBy: (relations?.updatedBy ? true : undefined) as T extends {
        updatedBy: true;
      }
        ? {
            columns: {
              [K in keyof InferSelectModel<typeof schema.users>]: true;
            };
          }
        : undefined,
    };
  }

  private getFilterWhereClause(filters: LabelTypeFilters) {
    if (!Object.keys(filters).length) return undefined;

    return and(
      filters.labelTypeIds
        ? inclusionFilterOperator(schema.labelTypes.id, filters.labelTypeIds)
        : undefined,
      filters.isArchived !== undefined
        ? filters.isArchived
          ? isNotNull(schema.labelTypes.archivedAt)
          : isNull(schema.labelTypes.archivedAt)
        : undefined,
    );
  }

  private getSortWhereClause<T extends LabelTypeWith<T>>(
    config: FindConfig<T, LabelTypeSortField>,
  ) {
    if (
      !config.sortBy ||
      !config.cursor?.lastValue ||
      config.cursor.lastValue === config.cursor.lastId
    )
      return undefined;

    if (config.sortBy === LabelTypeSortField.createdAt) {
      return filterByDirection(config.direction)(
        schema.labelTypes.createdAt,
        new Date(config.cursor.lastValue),
      );
    }

    if (config.sortBy === LabelTypeSortField.name) {
      return filterByDirection(config.direction)(
        schema.labelTypes.name,
        config.cursor.lastValue,
      );
    }

    return undefined;
  }

  private getIdWhereClause<T extends LabelTypeWith<T>>(
    config: FindConfig<T, LabelTypeSortField>,
  ) {
    if (!config.cursor?.lastId) return undefined;

    return filterByDirection(config.direction)(
      schema.labelTypes.id,
      config.cursor.lastId,
    );
  }

  private getOrderByClause<T extends LabelTypeWith<T>>(
    config: FindConfig<T, LabelTypeSortField>,
  ) {
    if (!config.sortBy) return [];

    if (config.sortBy === LabelTypeSortField.createdAt) {
      return [sortByDirection(config.direction)(schema.labelTypes.createdAt)];
    }

    if (config.sortBy === LabelTypeSortField.name) {
      return [sortByDirection(config.direction)(schema.labelTypes.name)];
    }

    return [];
  }
}
