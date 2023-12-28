import { and, desc, eq, inArray, lt, notInArray, schema } from '@cs/database';

import { WithConfig } from '../entities/common';
import { UserRelations, UserSort } from '../entities/user';
import KyakuError from '../kyaku-error';
import { BaseService } from './base-service';
import { InclusionFilterOperator, sortDirection } from './build-query';

export default class UserService extends BaseService {
  constructor() {
    // eslint-disable-next-line prefer-rest-params, @typescript-eslint/no-unsafe-argument
    super(arguments[0]);
  }

  async retrieve<T extends UserRelations>(
    userId: string,
    config: WithConfig<T, UserSort> = { relations: {} as T }
  ) {
    const user = await this.dataSource.query.users.findFirst({
      where: eq(schema.users.id, userId),
      with: config.relations,
    });

    if (!user)
      throw new KyakuError('NOT_FOUND', `User with id:${userId} not found`);

    return user;
  }

  async list<T extends UserRelations>(
    filters: {
      id?: InclusionFilterOperator<string>;
    },
    config: WithConfig<T, UserSort> = { relations: {} as T }
  ) {
    const whereClause = and(
      filters.id
        ? 'in' in filters.id
          ? inArray(schema.labels.id, filters.id.in)
          : 'notIn' in filters.id
            ? notInArray(schema.labels.id, filters.id.notIn)
            : undefined
        : undefined,
      config.skip ? lt(schema.users.id, config.skip) : undefined
    );
    return await this.dataSource.query.users.findMany({
      where: whereClause,
      with: config.relations,
      limit: config.take,
      columns: {
        id: true,
        email: true,
        name: true,
        image: true,
      },
      orderBy: and(
        config.sortBy
          ? 'name' in config.sortBy
            ? sortDirection(config.sortBy.name)(schema.users.name)
            : 'createdAt' in config.sortBy
              ? sortDirection(config.sortBy.createdAt)(schema.tickets.createdAt)
              : undefined
          : undefined,
        config.skip ? desc(schema.tickets.id) : undefined
      ),
    });
  }
}
