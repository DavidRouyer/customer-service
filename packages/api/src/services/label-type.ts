import { and, eq, isNotNull, isNull, schema } from '@cs/database';
import { Direction, FindConfig, GetConfig } from '@cs/kyaku/types/query';
import { KyakuError } from '@cs/kyaku/utils';

import {
  LabelType,
  LabelTypeFilters,
  LabelTypeSortField,
  LabelTypeWith,
} from '../entities/label-type';
import { User, USER_COLUMNS } from '../entities/user';
import LabelTypeRepository from '../repositories/label-type';
import { UnitOfWork } from '../unit-of-work';
import { BaseService } from './base-service';
import { filterByDirection, sortByDirection } from './build-query';

export default class LabelTypeService extends BaseService {
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
    config?: GetConfig<T>
  ) {
    const labelType = await this.labelTypeRepository.find({
      where: eq(schema.labelTypes.id, labelTypeId),
      with: this.getWithClause(config?.relations),
    });

    if (!labelType)
      throw new KyakuError(
        KyakuError.Types.NOT_FOUND,
        `Label type with id:${labelTypeId} not found`
      );

    return labelType;
  }

  async retrieveByName<T extends LabelTypeWith<T>>(
    labelTypeName: string,
    config?: GetConfig<T>
  ) {
    const labelType = await this.labelTypeRepository.find({
      where: eq(schema.labelTypes.name, labelTypeName),
      with: this.getWithClause(config?.relations),
    });

    if (!labelType)
      throw new KyakuError(
        KyakuError.Types.NOT_FOUND,
        `Label type with name:${labelTypeName} not found`
      );

    return labelType;
  }

  async list<T extends LabelTypeWith<T>>(
    filters: LabelTypeFilters,
    config: FindConfig<T, LabelTypeSortField> = {
      limit: 50,
      direction: Direction.Forward,
      sortBy: LabelTypeSortField.name,
    }
  ) {
    const labelTypes = await this.labelTypeRepository.findMany({
      where: and(
        this.getFilterWhereClause(filters),
        this.getSortWhereClause(config),
        this.getIdWhereClause(config)
      ),
      with: this.getWithClause(config?.relations),
      limit: config?.limit + 1,
      orderBy: [
        ...this.getOrderByClause(config),
        sortByDirection(config.direction)(schema.labelTypes.id),
      ],
    });

    const items = labelTypes.slice(0, config.limit);
    const hasNextPage = labelTypes.length > config.limit;
    return {
      items:
        config.direction === Direction.Forward ? items : items.toReversed(),
      hasNextPage: hasNextPage,
    };
  }

  async create(
    data: Omit<
      LabelType,
      'id' | 'createdAt' | 'updatedAt' | 'updatedById' | 'archivedAt'
    >
  ) {
    try {
      await this.retrieveByName(data.name);
      throw new KyakuError(
        KyakuError.Types.DUPLICATE_ERROR,
        `Label type with name:${data.name} already exists`
      );
    } catch {
      // Label type not found, continue
    }

    return await this.unitOfWork.transaction(async (tx) => {
      const creationDate = new Date();

      const newLabelType = await this.labelTypeRepository.create(
        {
          ...data,
          createdAt: creationDate,
        },
        tx
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

  async archive(labelTypeId: string, userId: string) {
    const labelType = await this.retrieve(labelTypeId);

    if (labelType.archivedAt)
      throw new KyakuError(
        KyakuError.Types.NOT_ALLOWED,
        `Label type with id:${labelTypeId} already archived`
      );

    const archiveDate = new Date();

    return await this.unitOfWork.transaction(async (tx) => {
      return await this.labelTypeRepository.update(
        {
          id: labelType.id,
          updatedAt: archiveDate,
          updatedById: userId,
          archivedAt: archiveDate,
        },
        tx
      );
    });
  }

  async unarchive(labelTypeId: string, userId: string) {
    const labelType = await this.retrieve(labelTypeId);

    if (labelType.archivedAt)
      throw new KyakuError(
        KyakuError.Types.NOT_ALLOWED,
        `Label type with id:${labelTypeId} is not archived`
      );

    const unarchiveDate = new Date();

    return await this.unitOfWork.transaction(async (tx) => {
      return await this.labelTypeRepository.update(
        {
          id: labelType.id,
          updatedAt: unarchiveDate,
          updatedById: userId,
          archivedAt: null,
        },
        tx
      );
    });
  }

  private getWithClause<T extends LabelTypeWith<T>>(
    relations: T | undefined
  ): {
    createdBy: T extends { createdBy: true }
      ? { columns: { [K in keyof User]: true } }
      : undefined;
    updatedBy: T extends { updatedBy: true }
      ? { columns: { [K in keyof User]: true } }
      : undefined;
  } {
    return {
      createdBy: (relations?.createdBy
        ? {
            columns: USER_COLUMNS,
          }
        : undefined) as T extends { createdBy: true }
        ? { columns: { [K in keyof User]: true } }
        : undefined,
      updatedBy: (relations?.updatedBy
        ? {
            columns: USER_COLUMNS,
          }
        : undefined) as T extends { updatedBy: true }
        ? { columns: { [K in keyof User]: true } }
        : undefined,
    };
  }

  private getFilterWhereClause(filters: LabelTypeFilters) {
    if (!Object.keys(filters).length) return undefined;

    return and(
      filters.isArchived !== undefined
        ? filters.isArchived
          ? isNotNull(schema.labelTypes.archivedAt)
          : isNull(schema.labelTypes.archivedAt)
        : undefined
    );
  }

  private getSortWhereClause<T extends LabelTypeWith<T>>(
    config: FindConfig<T, LabelTypeSortField>
  ) {
    if (
      !config.sortBy ||
      !config.cursor?.lastValue ||
      config.cursor?.lastValue === config.cursor?.lastId
    )
      return undefined;

    if (config.sortBy === LabelTypeSortField.createdAt) {
      return filterByDirection(config.direction)(
        schema.labelTypes.createdAt,
        new Date(config.cursor.lastValue)
      );
    }
    if (config.sortBy === LabelTypeSortField.name) {
      return filterByDirection(config.direction)(
        schema.labelTypes.name,
        config.cursor.lastValue
      );
    }

    return undefined;
  }

  private getIdWhereClause<T extends LabelTypeWith<T>>(
    config: FindConfig<T, LabelTypeSortField>
  ) {
    if (!config.cursor?.lastId) return undefined;

    return filterByDirection(config.direction)(
      schema.labelTypes.id,
      config.cursor.lastId
    );
  }

  private getOrderByClause<T extends LabelTypeWith<T>>(
    config: FindConfig<T, LabelTypeSortField>
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
