import { and, desc, eq, inArray, lt, notInArray, schema } from '@cs/database';
import { FindConfig, GetConfig } from '@cs/kyaku/types/query';
import { KyakuError } from '@cs/kyaku/utils';

import { UserSort, UserWith } from '../entities/user';
import UserRepository from '../repositories/user';
import { BaseService } from './base-service';
import { InclusionFilterOperator, sortDirection } from './build-query';

export default class UserService extends BaseService {
  private readonly userRepository: UserRepository;

  constructor({ userRepository }: { userRepository: UserRepository }) {
    // eslint-disable-next-line prefer-rest-params, @typescript-eslint/no-unsafe-argument
    super(arguments[0]);
    this.userRepository = userRepository;
  }

  async retrieve<T extends UserWith<T>>(userId: string, config?: GetConfig<T>) {
    const user = await this.userRepository.find({
      columns: {
        id: true,
        email: true,
        name: true,
        image: true,
      },
      extras: {},
      where: eq(schema.users.id, userId),
      with: {},
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
      config?.skip ? lt(schema.users.id, config.skip) : undefined
    );
    return await this.userRepository.findMany({
      columns: {
        id: true,
        email: true,
        name: true,
        image: true,
      },
      extras: {},
      where: whereClause,
      with: {},
      limit: config?.take,
      orderBy: and(
        config?.sortBy
          ? 'name' in config.sortBy
            ? sortDirection(config.sortBy.name)(schema.users.name)
            : 'createdAt' in config.sortBy
              ? sortDirection(config.sortBy.createdAt)(schema.tickets.createdAt)
              : undefined
          : undefined,
        config?.skip ? desc(schema.tickets.id) : undefined
      ),
    });
  }
}
