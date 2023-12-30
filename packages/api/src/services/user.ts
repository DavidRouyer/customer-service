import { and, desc, eq, inArray, lt, notInArray, schema } from '@cs/database';
import { KyakuError } from '@cs/kyaku/utils';

import { FindUserConfig, GetUserConfig, UserRelations } from '../entities/user';
import { BaseService } from './base-service';
import { InclusionFilterOperator, sortDirection } from './build-query';

export default class UserService extends BaseService {
  constructor() {
    // eslint-disable-next-line prefer-rest-params, @typescript-eslint/no-unsafe-argument
    super(arguments[0]);
  }

  async retrieve(userId: string, config: GetUserConfig = { relations: {} }) {
    const user = await this.dataSource.query.users.findFirst({
      where: eq(schema.users.id, userId),
      with: this.getWithClause(config.relations),
    });

    if (!user)
      throw new KyakuError('NOT_FOUND', `User with id:${userId} not found`);

    return user;
  }

  async list(
    filters: {
      id?: InclusionFilterOperator<string>;
    },
    config: FindUserConfig = { relations: {} }
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
      with: this.getWithClause(config.relations),
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

  private getWithClause(relations: UserRelations) {
    const withClause = {};

    return withClause;
  }
}
