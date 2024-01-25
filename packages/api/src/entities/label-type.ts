import { InferInsertModel, InferSelectModel, schema } from '@cs/database';
import { SortDirection } from '@cs/kyaku/types';

export type LabelType = InferSelectModel<typeof schema.labelTypes>;

export type LabelTypeInsert = InferInsertModel<typeof schema.labelTypes>;

export type LabelTypeWith<T> = {
  createdBy?: [T] extends [{ createdBy: true }] ? true : undefined;
  updatedBy?: [T] extends [{ updatedBy: true }] ? true : undefined;
};

export type LabelTypeSort =
  | { createdAt: SortDirection }
  | { name: SortDirection };
