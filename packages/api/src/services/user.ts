import { and, DataSource, desc, eq, lt, schema } from '@cs/database';

import { WithConfig } from '../entities/ticket';
import { UserRelations, UserSort } from '../entities/user';
import KyakuError from '../kyaku-error';
import { sortDirection } from './ticket';

export default class UserService {
  private readonly dataSource: DataSource;

  constructor({ dataSource }: { dataSource: DataSource }) {
    this.dataSource = dataSource;
  }

  async retrieve(
    userId: string,
    config: WithConfig<UserRelations, UserSort> = { relations: {} }
  ) {
    const user = await this.dataSource.query.users.findFirst({
      where: eq(schema.users.id, userId),
      with: config.relations,
    });

    if (!user)
      throw new KyakuError('NOT_FOUND', `User with id:${userId} not found`);

    return user;
  }

  async list(
    filters: {},
    config: WithConfig<UserRelations, UserSort> = { relations: {} }
  ) {
    const whereClause = and(
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
