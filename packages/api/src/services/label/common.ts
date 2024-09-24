import type {
  InclusionFilterOperator,
  InferSelectModel,
  schema,
} from '@cs/database';

export interface LabelWith<T> {
  ticket?: [T] extends [{ assignedTo: true }] ? true : undefined;
  labelType?: [T] extends [{ labelType: true }] ? true : undefined;
}

type LabelSelectModel = InferSelectModel<typeof schema.labels>;

export interface LabelFilters {
  ticketId?: string;
  labelIds?: InclusionFilterOperator<LabelSelectModel['id']>;
  isArchived?: boolean;
}

export enum LabelSortField {
  id = 'id',
}
