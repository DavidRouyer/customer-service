import type {
  InclusionFilterOperator,
  InferSelectModel,
  schema,
} from '@kyaku/database';

export interface CustomerWith<T> {
  createdBy?: [T] extends [{ createdBy: true }] ? true : undefined;
  updatedBy?: [T] extends [{ updatedBy: true }] ? true : undefined;
}

type CustomerSelectModel = InferSelectModel<typeof schema.customers>;

export interface CustomerFilters {
  customerIds?: InclusionFilterOperator<CustomerSelectModel['id']>;
}

export enum CustomerSortField {
  createdAt = 'createdAt',
  name = 'name',
}
