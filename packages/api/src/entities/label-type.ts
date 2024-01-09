import { InferInsertModel, InferSelectModel, schema } from '@cs/database';
import { FindConfig, SortDirection } from '@cs/kyaku/types';

export type LabelType = InferSelectModel<typeof schema.labelTypes>;
export type LabelTypeInsert = InferInsertModel<typeof schema.labelTypes>;
export type LabelTypeRelations = {
  createdBy?: boolean;
  updatedBy?: boolean;
};
export type FindLabelTypeConfig = FindConfig<LabelTypeRelations, LabelTypeSort>;

export type LabelTypeSort =
  | { createdAt: SortDirection }
  | { name: SortDirection };
