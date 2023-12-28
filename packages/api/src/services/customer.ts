import { and, desc, eq, lt, schema } from '@cs/database';

import { WithConfig } from '../entities/common';
import { CustomerRelations, CustomerSort } from '../entities/customer';
import KyakuError from '../kyaku-error';
import { BaseService } from './base-service';
import { sortDirection } from './build-query';

export default class CustomerService extends BaseService {
  constructor() {
    // eslint-disable-next-line prefer-rest-params, @typescript-eslint/no-unsafe-argument
    super(arguments[0]);
  }

  async retrieve<T extends CustomerRelations>(
    customerId: string,
    config: WithConfig<T, CustomerSort> = { relations: {} as T }
  ) {
    const customer = await this.dataSource.query.customers.findFirst({
      where: eq(schema.customers.id, customerId),
      with: config.relations,
    });

    if (!customer)
      throw new KyakuError(
        'NOT_FOUND',
        `Customer with id:${customerId} not found`
      );

    return customer;
  }

  async list<T extends CustomerRelations>(
    config: WithConfig<T, CustomerSort> = { relations: {} as T }
  ) {
    const whereClause = and(
      config.skip ? lt(schema.customers.id, config.skip) : undefined
    );
    return this.dataSource.query.customers.findMany({
      where: whereClause,
      with: config.relations,
      limit: config.take,
      orderBy: and(
        config.sortBy
          ? 'name' in config.sortBy
            ? sortDirection(config.sortBy.name)(schema.customers.name)
            : 'createdAt' in config.sortBy
              ? sortDirection(config.sortBy.createdAt)(
                  schema.customers.createdAt
                )
              : undefined
          : undefined,
        config.skip ? desc(schema.customers.id) : undefined
      ),
    });
  }
}
