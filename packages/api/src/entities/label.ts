import type { InferInsertModel, InferSelectModel, schema } from '@cs/database';

import type { InclusionFilterOperator } from '../services/build-query';

export type Label = InferSelectModel<typeof schema.labels>;

export type LabelInsert = InferInsertModel<typeof schema.labels>;

export interface LabelWith<T> {
  ticket?: [T] extends [{ assignedTo: true }] ? true : undefined;
  labelType?: [T] extends [{ labelType: true }] ? true : undefined;
}

export interface LabelFilters {
  ticketId?: string;
  labelIds?: InclusionFilterOperator<Label['id']>;
  isArchived?: boolean;
}

export enum LabelSortField {
  id = 'id',
}
