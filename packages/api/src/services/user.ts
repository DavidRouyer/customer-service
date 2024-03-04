import { and, desc, eq, inArray, lt, notInArray, schema } from '@cs/database';
import { FindConfig, GetConfig } from '@cs/kyaku/types/query';
import { KyakuError } from '@cs/kyaku/utils';

import { USER_COLUMNS, UserSort, UserWith } from '../entities/user';
import UserRepository from '../repositories/user';
import { UnitOfWork } from '../unit-of-work';
import { BaseService } from './base-service';
import { InclusionFilterOperator, sortBySortDirection } from './build-query';

export default class UserService extends BaseService {
  private readonly userRepository: UserRepository;

  constructor({
    userRepository,
  }: { userRepository: UserRepository } & { unitOfWork: UnitOfWork }) {
    // eslint-disable-next-line prefer-rest-params, @typescript-eslint/no-unsafe-argument
    super(arguments[0]);
    this.userRepository = userRepository;
  }

  async retrieve<T extends UserWith<T>>(userId: string, config?: GetConfig<T>) {
    const user = await this.userRepository.find({
      columns: USER_COLUMNS,
      where: eq(schema.users.id, userId),
    });

    if (!user)
      throw new KyakuError(
        KyakuError.Types.NOT_FOUND,
        `User with id:${userId} not found`
      );

    return user;
  }

  async list<T extends UserWith<T>>(
    filters: {
      id?: InclusionFilterOperator<string>;
    },
    config?: FindConfig<T, UserSort>
  ) {
    const whereClause = and(
      filters.id
        ? 'in' in filters.id
          ? inArray(schema.labels.id, filters.id.in)
          : 'notIn' in filters.id
            ? notInArray(schema.labels.id, filters.id.notIn)
            : undefined
        : undefined,
      config?.cursor ? lt(schema.users.id, config.cursor) : undefined
    );
    return await this.userRepository.findMany({
      columns: USER_COLUMNS,
      where: whereClause,
      limit: config?.limit,
      orderBy: and(
        config?.sortBy
          ? 'name' in config.sortBy
            ? sortBySortDirection(
                config.sortBy.name,
                config.direction
              )(schema.users.name)
            : 'createdAt' in config.sortBy
              ? sortBySortDirection(
                  config.sortBy.createdAt,
                  config.direction
                )(schema.tickets.createdAt)
              : undefined
          : undefined,
        config?.limit ? desc(schema.tickets.id) : undefined
      ),
    });
  }
}
