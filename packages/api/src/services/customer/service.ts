import {
  and,
  eq,
  filterByDirection,
  inclusionFilterOperator,
  schema,
  sortByDirection,
} from '@cs/database';
import type { CustomerRepository, InferSelectModel } from '@cs/database';
import type { FindConfig, GetConfig } from '@cs/kyaku/types';
import { Direction } from '@cs/kyaku/types';

import type { UnitOfWork } from '../../unit-of-work';
import { BaseService } from '../base-service';
import type { CustomerFilters, CustomerWith } from './common';
import { CustomerSortField } from './common';

export class CustomerService extends BaseService {
  private readonly customerRepository: CustomerRepository;

  constructor({
    customerRepository,
  }: {
    customerRepository: CustomerRepository;
  } & { unitOfWork: UnitOfWork }) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0]);
    this.customerRepository = customerRepository;
  }

  async retrieve<T extends CustomerWith<T>>(
    customerId: string,
    config?: GetConfig<T>
  ) {
    return await this.customerRepository.find({
      where: eq(schema.customers.id, customerId),
      with: this.getWithClause(config?.relations),
    });
  }

  async list<T extends CustomerWith<T>>(
    filters: CustomerFilters = {},
    config: FindConfig<T, CustomerSortField> = {
      direction: Direction.Forward,
      limit: 50,
      sortBy: CustomerSortField.createdAt,
    }
  ) {
    return this.customerRepository.findMany({
      limit: config.limit,
      orderBy: [
        ...this.getOrderByClause(config),
        sortByDirection(config.direction)(schema.customers.id),
      ],
      where: and(
        this.getFilterWhereClause(filters),
        this.getSortWhereClause(config),
        this.getIdWhereClause(config)
      ),
      with: this.getWithClause(config.relations),
    });
  }

  private getWithClause<T extends CustomerWith<T>>(
    relations: T | undefined
  ): {
    createdBy: T extends { createdBy: true }
      ? {
          columns: { [K in keyof InferSelectModel<typeof schema.users>]: true };
        }
      : undefined;
    updatedBy: T extends { updatedBy: true }
      ? {
          columns: { [K in keyof InferSelectModel<typeof schema.users>]: true };
        }
      : undefined;
  } {
    return {
      createdBy: (relations?.createdBy ? true : undefined) as T extends {
        createdBy: true;
      }
        ? {
            columns: {
              [K in keyof InferSelectModel<typeof schema.users>]: true;
            };
          }
        : undefined,
      updatedBy: (relations?.updatedBy ? true : undefined) as T extends {
        updatedBy: true;
      }
        ? {
            columns: {
              [K in keyof InferSelectModel<typeof schema.users>]: true;
            };
          }
        : undefined,
    };
  }

  private getFilterWhereClause(filters: CustomerFilters) {
    if (!Object.keys(filters).length) return undefined;

    return and(
      filters.customerIds
        ? inclusionFilterOperator(schema.customers.id, filters.customerIds)
        : undefined
    );
  }

  private getSortWhereClause<T extends CustomerWith<T>>(
    config: FindConfig<T, CustomerSortField>
  ) {
    if (
      !config.sortBy ||
      !config.cursor?.lastValue ||
      config.cursor.lastValue === config.cursor.lastId
    )
      return undefined;

    if (config.sortBy === CustomerSortField.createdAt) {
      return filterByDirection(config.direction)(
        schema.customers.createdAt,
        new Date(config.cursor.lastValue)
      );
    }
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (config.sortBy === CustomerSortField.name) {
      return filterByDirection(config.direction)(
        schema.customers.name,
        config.cursor.lastValue
      );
    }

    return undefined;
  }

  private getIdWhereClause<T extends CustomerWith<T>>(
    config: FindConfig<T, CustomerSortField>
  ) {
    if (!config.cursor?.lastId) return undefined;

    return filterByDirection(config.direction)(
      schema.customers.id,
      config.cursor.lastId
    );
  }

  private getOrderByClause<T extends CustomerWith<T>>(
    config: FindConfig<T, CustomerSortField>
  ) {
    if (!config.sortBy) return [];

    if (config.sortBy === CustomerSortField.createdAt) {
      return [sortByDirection(config.direction)(schema.customers.createdAt)];
    }
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (config.sortBy === CustomerSortField.name) {
      return [sortByDirection(config.direction)(schema.customers.name)];
    }

    return [];
  }
}
