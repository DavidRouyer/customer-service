import { InferInsertModel, InferSelectModel, schema } from '@cs/database';

export type Customer = InferSelectModel<typeof schema.customers>;

export type CustomerInsert = InferInsertModel<typeof schema.customers>;

export type CustomerWith<T> = {
  createdBy?: [T] extends [{ createdBy: true }] ? true : undefined;
  updatedBy?: [T] extends [{ updatedBy: true }] ? true : undefined;
};

export enum CustomerSortField {
  createdAt = 'createdAt',
  name = 'name',
}
