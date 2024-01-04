import { db, InferInsertModel, InferSelectModel, schema } from '@cs/database';
import { FindConfig } from '@cs/kyaku/types';
import { GetConfig } from '@cs/kyaku/types/query';

export type Label = InferSelectModel<typeof schema.labels>;
export type LabelInsert = InferInsertModel<typeof schema.labels>;
export type DbLabelRelations = NonNullable<
  Parameters<(typeof db)['query']['labels']['findFirst']>[0]
>['with'];
export type GetLabelConfig = GetConfig<LabelRelations>;
export type LabelRelations = {
  ticket?: boolean;
  labelType?: boolean;
};
export type FindLabelConfig = FindConfig<LabelRelations, LabelSort>;

export type LabelSort = {};
