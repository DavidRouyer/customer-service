import { InferInsertModel, InferSelectModel, schema } from '@cs/database';

import { InclusionFilterOperator } from '../services/build-query';

export type Customer = InferSelectModel<typeof schema.customers>;

export type CustomerInsert = InferInsertModel<typeof schema.customers>;

export type CustomerWith<T> = {
  createdBy?: [T] extends [{ createdBy: true }] ? true : undefined;
  updatedBy?: [T] extends [{ updatedBy: true }] ? true : undefined;
};

export type CustomerFilters = {
  customerIds?: InclusionFilterOperator<Customer['id']>;
};

export enum CustomerSortField {
  createdAt = 'createdAt',
  name = 'name',
}
