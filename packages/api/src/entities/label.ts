import { InferInsertModel, InferSelectModel, schema } from '@cs/database';

export type Label = InferSelectModel<typeof schema.labels>;

export type LabelInsert = InferInsertModel<typeof schema.labels>;

export type LabelWith<T> = {
  ticket?: [T] extends [{ assignedTo: true }] ? true : undefined;
  labelType?: [T] extends [{ labelType: true }] ? true : undefined;
};
