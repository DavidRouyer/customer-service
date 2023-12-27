import { and, DataSource, desc, eq, lt, schema } from '@cs/database';

import { CustomerRelations, CustomerSort } from '../entities/customer';
import { WithConfig } from '../entities/ticket';
import KyakuError from '../kyaku-error';
import { sortDirection } from './ticket';

export default class CustomerService {
  private readonly dataSource: DataSource;

  constructor({ dataSource }: { dataSource: DataSource }) {
    this.dataSource = dataSource;
  }

  async retrieve(
    customerId: string,
    config: WithConfig<CustomerRelations, CustomerSort> = { relations: {} }
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
