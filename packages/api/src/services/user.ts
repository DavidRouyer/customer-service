import { and, eq, schema } from '@cs/database';
import { Direction, FindConfig } from '@cs/kyaku/types/query';
import { KyakuError } from '@cs/kyaku/utils';

import {
  USER_COLUMNS,
  UserFilters,
  UserSortField,
  UserWith,
} from '../entities/user';
import UserRepository from '../repositories/user';
import { UnitOfWork } from '../unit-of-work';
import { BaseService } from './base-service';
import {
  filterByDirection,
  inclusionFilterOperator,
  sortByDirection,
} from './build-query';

export default class UserService extends BaseService {
  private readonly userRepository: UserRepository;

  constructor({
    userRepository,
  }: { userRepository: UserRepository } & { unitOfWork: UnitOfWork }) {
    // eslint-disable-next-line prefer-rest-params, @typescript-eslint/no-unsafe-argument
    super(arguments[0]);
    this.userRepository = userRepository;
  }

  async retrieve<T extends UserWith<T>>(userId: string) {
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
    filters: UserFilters = {},
    config: FindConfig<T, UserSortField> = {
      direction: Direction.Forward,
      limit: 50,
      sortBy: UserSortField.name,
    }
  ) {
    return await this.userRepository.findMany({
      columns: USER_COLUMNS,
      limit: config.limit,
      orderBy: [
        ...this.getOrderByClause(config),
        sortByDirection(config.direction)(schema.users.id),
      ],
      where: and(
        this.getFilterWhereClause(filters),
        this.getSortWhereClause(config),
        this.getIdWhereClause(config)
      ),
    });
  }

  private getFilterWhereClause(filters: UserFilters) {
    if (!Object.keys(filters).length) return undefined;

    return and(
      filters.userIds
        ? inclusionFilterOperator(schema.users.id, filters.userIds)
        : undefined
    );
  }

  private getSortWhereClause<T extends UserWith<T>>(
    config: FindConfig<T, UserSortField>
  ) {
    if (
      !config.sortBy ||
      !config.cursor?.lastValue ||
      config.cursor?.lastValue === config.cursor?.lastId
    )
      return undefined;

    if (config.sortBy === UserSortField.name) {
      return filterByDirection(config.direction)(
        schema.users.name,
        config.cursor.lastValue
      );
    }

    return undefined;
  }

  private getIdWhereClause<T extends UserWith<T>>(
    config: FindConfig<T, UserSortField>
  ) {
    if (!config.cursor?.lastId) return undefined;

    return filterByDirection(config.direction)(
      schema.users.id,
      config.cursor.lastId
    );
  }

  private getOrderByClause<T extends UserWith<T>>(
    config: FindConfig<T, UserSortField>
  ) {
    if (!config.sortBy) return [];

    if (config.sortBy === UserSortField.name) {
      return [sortByDirection(config.direction)(schema.users.name)];
    }

    return [];
  }
}
