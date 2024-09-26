import {
  and,
  eq,
  filterByDirection,
  inclusionFilterOperator,
  schema,
  sortByDirection,
} from '@kyaku/database';
import type { UserRepository } from '@kyaku/database';
import type { FindConfig } from '@kyaku/kyaku/types';
import { Direction } from '@kyaku/kyaku/types';

import type { UnitOfWork } from '../../unit-of-work';
import { BaseService } from '../base-service';
import type { UserFilters } from './common';
import { UserSortField } from './common';

export class UserService extends BaseService {
  private readonly userRepository: UserRepository;

  constructor({
    userRepository,
  }: { userRepository: UserRepository } & { unitOfWork: UnitOfWork }) {
    // eslint-disable-next-line prefer-rest-params, @typescript-eslint/no-unsafe-argument
    super(arguments[0]);
    this.userRepository = userRepository;
  }

  async retrieve(userId: string) {
    return await this.userRepository.find({
      where: eq(schema.users.id, userId),
    });
  }

  async list(
    filters: UserFilters = {},
    config: FindConfig<object, UserSortField> = {
      direction: Direction.Forward,
      limit: 50,
      sortBy: UserSortField.name,
    }
  ) {
    return await this.userRepository.findMany({
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

  private getSortWhereClause(config: FindConfig<object, UserSortField>) {
    if (
      !config.sortBy ||
      !config.cursor?.lastValue ||
      config.cursor.lastValue === config.cursor.lastId
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

  private getIdWhereClause(config: FindConfig<object, UserSortField>) {
    if (!config.cursor?.lastId) return undefined;

    return filterByDirection(config.direction)(
      schema.users.id,
      config.cursor.lastId
    );
  }

  private getOrderByClause(config: FindConfig<object, UserSortField>) {
    if (!config.sortBy) return [];

    if (config.sortBy === UserSortField.name) {
      return [sortByDirection(config.direction)(schema.users.name)];
    }

    return [];
  }
}
