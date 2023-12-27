import {
  and,
  DataSource,
  desc,
  eq,
  isNotNull,
  isNull,
  lt,
  schema,
} from '@cs/database';

import {
  LabelType,
  LabelTypeRelations,
  LabelTypeSort,
} from '../entities/label-type';
import { WithConfig } from '../entities/ticket';
import KyakuError from '../kyaku-error';
import { sortDirection } from './ticket';

export default class LabelTypeService {
  private readonly dataSource: DataSource;

  constructor({ dataSource }: { dataSource: DataSource }) {
    this.dataSource = dataSource;
  }

  async retrieve(
    labelTypeId: string,
    config: WithConfig<LabelTypeRelations, LabelTypeSort> = { relations: {} }
  ) {
    const labelType = await this.dataSource.query.labelTypes.findFirst({
      where: eq(schema.labelTypes.id, labelTypeId),
      with: config.relations,
    });

    if (!labelType)
      throw new KyakuError(
        'NOT_FOUND',
        `Label type with id:${labelTypeId} not found`
      );

    return labelType;
  }

  async retrieveByName(
    labelTypeName: string,
    config: WithConfig<LabelTypeRelations, LabelTypeSort> = { relations: {} }
  ) {
    const labelType = await this.dataSource.query.labelTypes.findFirst({
      where: eq(schema.labelTypes.name, labelTypeName),
      with: config.relations,
    });

    if (!labelType)
      throw new KyakuError(
        'NOT_FOUND',
        `Label type with name:${labelTypeName} not found`
      );

    return labelType;
  }

  async list(
    filters: {
      isArchived: boolean;
    },
    config: WithConfig<LabelTypeRelations, LabelTypeSort> = { relations: {} }
  ) {
    const whereClause = and(
      filters.isArchived
        ? isNotNull(schema.labelTypes.archivedAt)
        : isNull(schema.labelTypes.archivedAt),
      config.skip ? lt(schema.labelTypes.id, config.skip) : undefined
    );
    return this.dataSource.query.labelTypes.findMany({
      where: whereClause,
      with: config.relations,
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
        'BAD_REQUEST',
        `Label type with name:${data.name} already exists`
      );
    } catch {
      // Label type not found, continue
    }

    await this.dataSource.transaction(async (tx) => {
      const creationDate = new Date();

      const newLabelType = await tx
        .insert(schema.labelTypes)
        .values({
          ...data,
          createdAt: creationDate,
        })
        .returning({
          id: schema.labelTypes.id,
        })
        .then((res) => res[0]);

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
        'NOT_ALLOWED',
        `Label type with id:${labelTypeId} already archived`
      );

    const archiveDate = new Date();

    return this.dataSource
      .insert(schema.labelTypes)
      .values({
        ...labelType,
        updatedAt: archiveDate,
        updatedById: userId,
        archivedAt: archiveDate,
      })
      .returning({ id: schema.labelTypes.id });
  }

  async unarchive(labelTypeId: string, userId: string) {
    const labelType = await this.retrieve(labelTypeId);

    if (labelType.archivedAt)
      throw new KyakuError(
        'NOT_ALLOWED',
        `Label type with id:${labelTypeId} is not archived`
      );

    const unarchiveDate = new Date();

    return this.dataSource
      .insert(schema.labelTypes)
      .values({
        ...labelType,
        updatedAt: unarchiveDate,
        updatedById: userId,
        archivedAt: null,
      })
      .returning({ id: schema.labelTypes.id });
  }
}
