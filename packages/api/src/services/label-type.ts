import {
  and,
  desc,
  eq,
  inArray,
  isNotNull,
  isNull,
  lt,
  notInArray,
  schema,
} from '@cs/database';
import { KyakuError } from '@cs/kyaku/utils';

import {
  FindLabelTypeConfig,
  LabelType,
  LabelTypeRelations,
} from '../entities/label-type';
import LabelTypeRepository from '../repositories/label-type';
import { BaseService } from './base-service';
import { InclusionFilterOperator, sortDirection } from './build-query';

export default class LabelTypeService extends BaseService {
  private readonly labelTypeRepository: LabelTypeRepository;

  constructor({
    labelTypeRepository,
  }: {
    labelTypeRepository: LabelTypeRepository;
  }) {
    // eslint-disable-next-line prefer-rest-params, @typescript-eslint/no-unsafe-argument
    super(arguments[0]);
    this.labelTypeRepository = labelTypeRepository;
  }

  async retrieve(
    labelTypeId: string,
    config: FindLabelTypeConfig = { relations: {} }
  ) {
    const labelType = await this.labelTypeRepository.find({
      columns: undefined,
      extras: {},
      where: eq(schema.labelTypes.id, labelTypeId),
      with: this.getWithClause(config.relations),
    });

    if (!labelType)
      throw new KyakuError(
        KyakuError.Types.NOT_FOUND,
        `Label type with id:${labelTypeId} not found`
      );

    return labelType;
  }

  async retrieveByName(
    labelTypeName: string,
    config: FindLabelTypeConfig = { relations: {} }
  ) {
    const labelType = await this.labelTypeRepository.find({
      columns: undefined,
      extras: {},
      where: eq(schema.labelTypes.name, labelTypeName),
      with: this.getWithClause(config.relations),
    });

    if (!labelType)
      throw new KyakuError(
        KyakuError.Types.NOT_FOUND,
        `Label type with name:${labelTypeName} not found`
      );

    return labelType;
  }

  async list(
    filters: {
      id?: InclusionFilterOperator<string>;
      isArchived?: boolean;
    },
    config: FindLabelTypeConfig = { relations: {} }
  ) {
    const whereClause = and(
      filters.id
        ? 'in' in filters.id
          ? inArray(schema.labelTypes.id, filters.id.in)
          : 'notIn' in filters.id
            ? notInArray(schema.labelTypes.id, filters.id.notIn)
            : undefined
        : undefined,
      filters.isArchived !== undefined
        ? filters.isArchived
          ? isNotNull(schema.labelTypes.archivedAt)
          : isNull(schema.labelTypes.archivedAt)
        : undefined,
      config.skip ? lt(schema.labelTypes.id, config.skip) : undefined
    );
    return this.labelTypeRepository.findMany({
      columns: undefined,
      extras: {},
      where: whereClause,
      with: this.getWithClause(config.relations),
      limit: config.take,
      orderBy: and(
        config.sortBy
          ? 'name' in config.sortBy
            ? sortDirection(config.sortBy.name)(schema.labelTypes.name)
            : 'createdAt' in config.sortBy
              ? sortDirection(config.sortBy.createdAt)(
                  schema.labelTypes.createdAt
                )
              : undefined
          : undefined,
        config.skip ? desc(schema.labelTypes.id) : undefined
      ),
    });
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

  private getWithClause(relations: LabelTypeRelations) {
    const withClause = {
      createdBy: relations.createdBy
        ? ({
            columns: {
              id: true,
              email: true,
              name: true,
              image: true,
            },
          } as const)
        : undefined,
      updatedBy: relations.updatedBy
        ? ({
            columns: {
              id: true,
              email: true,
              name: true,
              image: true,
            },
          } as const)
        : undefined,
    };

    return withClause;
  }
}
