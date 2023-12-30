import { db, InferSelectModel, schema } from '@cs/database';
import { FindConfig, SortDirection } from '@cs/kyaku/types';

export type LabelType = InferSelectModel<typeof schema.labelTypes>;
export type DbLabelTypeRelations = NonNullable<
  Parameters<(typeof db)['query']['labelTypes']['findFirst']>[0]
>['with'];
export type LabelTypeRelations = {
  createdBy?: boolean;
  updatedBy?: boolean;
};
export type FindLabelTypeConfig = FindConfig<LabelTypeRelations, LabelTypeSort>;

export type LabelTypeSort =
  | { createdAt: SortDirection }
  | { name: SortDirection };
