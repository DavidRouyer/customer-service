import { and, desc, eq, lt, schema } from '@cs/database';
import { KyakuError } from '@cs/kyaku/utils';

import { CustomerRelations, FindCustomerConfig } from '../entities/customer';
import CustomerRepository from '../repositories/customer';
import { BaseService } from './base-service';
import { sortDirection } from './build-query';

export default class CustomerService extends BaseService {
  private readonly customerRepository: CustomerRepository;

  constructor({
    customerRepository,
  }: {
    customerRepository: CustomerRepository;
  }) {
    // eslint-disable-next-line prefer-rest-params, @typescript-eslint/no-unsafe-argument
    super(arguments[0]);
    this.customerRepository = customerRepository;
  }

  async retrieve(
    customerId: string,
    config: FindCustomerConfig = { relations: {} }
  ) {
    const customer = await this.customerRepository.find({
      where: eq(schema.customers.id, customerId),
      with: this.getWithClause(config.relations),
    });

    if (!customer)
      throw new KyakuError(
        'NOT_FOUND',
        `Customer with id:${customerId} not found`
      );

    return customer;
  }

  async list(config: FindCustomerConfig = { relations: {} }) {
    const whereClause = and(
      config.skip ? lt(schema.customers.id, config.skip) : undefined
    );
    return this.dataSource.query.customers.findMany({
      where: whereClause,
      with: this.getWithClause(config.relations),
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

  private getWithClause(relations: CustomerRelations) {
    const withClause = {
      createdBy: relations.createdBy
        ? ({
            columns: {
              id: true,
              email: true,
              name: true,
              image: true,
            },
          } as const)
        : undefined,
      updatedBy: relations.updatedBy
        ? ({
            columns: {
              id: true,
              email: true,
              name: true,
              image: true,
            },
          } as const)
        : undefined,
    };

    return withClause;
  }
}
