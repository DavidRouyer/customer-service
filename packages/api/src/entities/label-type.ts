import { InferInsertModel, InferSelectModel, schema } from '@cs/database';

export type LabelType = InferSelectModel<typeof schema.labelTypes>;

export type LabelTypeInsert = InferInsertModel<typeof schema.labelTypes>;

export type LabelTypeWith<T> = {
  createdBy?: [T] extends [{ createdBy: true }] ? true : undefined;
  updatedBy?: [T] extends [{ updatedBy: true }] ? true : undefined;
};

export type LabelTypeFilters = {
  isArchived?: boolean;
};

export enum LabelTypeSortField {
  createdAt = 'createdAt',
  name = 'name',
}

export type CreateLabelType = Omit<
  LabelTypeInsert,
  | 'id'
  | 'createdAt'
  | 'createdById'
  | 'updatedAt'
  | 'updatedById'
  | 'archivedAt'
>;

export type UpdateLabelType = Partial<CreateLabelType> & {
  id: NonNullable<LabelTypeInsert['id']>;
};
