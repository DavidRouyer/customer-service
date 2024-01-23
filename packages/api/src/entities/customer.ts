import { InferInsertModel, InferSelectModel, schema } from '@cs/database';
import { SortDirection } from '@cs/kyaku/types';

export type Customer = InferSelectModel<typeof schema.customers>;

export type CustomerInsert = InferInsertModel<typeof schema.customers>;

export type CustomerWith<T> = {
  createdBy?: [T] extends [{ createdBy: true }] ? true : undefined;
  updatedBy?: [T] extends [{ updatedBy: true }] ? true : undefined;
};

export type CustomerSort =
  | { createdAt: SortDirection }
  | { name: SortDirection };
