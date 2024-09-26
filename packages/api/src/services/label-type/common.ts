import type {
  InclusionFilterOperator,
  InferSelectModel,
  schema,
} from '@kyaku/database';

export interface LabelTypeWith<T> {
  createdBy?: [T] extends [{ createdBy: true }] ? true : undefined;
  updatedBy?: [T] extends [{ updatedBy: true }] ? true : undefined;
}

type LabelTypeSelectModel = InferSelectModel<typeof schema.labelTypes>;

export interface LabelTypeFilters {
  labelTypeIds?: InclusionFilterOperator<LabelTypeSelectModel['id']>;
  isArchived?: boolean;
}

export enum LabelTypeSortField {
  createdAt = 'createdAt',
  name = 'name',
}
