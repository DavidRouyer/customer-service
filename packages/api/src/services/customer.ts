import { and, desc, eq, lt, schema } from '@cs/database';
import { FindConfig, GetConfig } from '@cs/kyaku/types/query';
import { KyakuError } from '@cs/kyaku/utils';

import { CustomerSort, CustomerWith } from '../entities/customer';
import { User } from '../entities/user';
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

  async retrieve<T extends CustomerWith<T>>(
    customerId: string,
    config: GetConfig<T>
  ) {
    const customer = await this.customerRepository.find({
      columns: undefined,
      extras: {},
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

  async list<T extends CustomerWith<T>>(config: FindConfig<T, CustomerSort>) {
    const whereClause = and(
      config.skip ? lt(schema.customers.id, config.skip) : undefined
    );
    return this.customerRepository.findMany({
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

  private getWithClause<T extends CustomerWith<T>>(
    relations: T | undefined
  ): {
    createdBy: T extends { createdBy: true }
      ? { columns: { [K in keyof User]: true } }
      : undefined;
    updatedBy: T extends { updatedBy: true }
      ? { columns: { [K in keyof User]: true } }
      : undefined;
  } {
    return {
      createdBy: (relations?.createdBy
        ? {
            columns: {
              id: true,
              email: true,
              emailVerified: true,
              name: true,
              image: true,
            },
          }
        : undefined) as T extends { createdBy: true }
        ? { columns: { [K in keyof User]: true } }
        : undefined,
      updatedBy: (relations?.updatedBy
        ? {
            columns: {
              id: true,
              email: true,
              emailVerified: true,
              name: true,
              image: true,
            },
          }
        : undefined) as T extends { updatedBy: true }
        ? { columns: { [K in keyof User]: true } }
        : undefined,
    };
  }
}
