import { db, InferSelectModel, schema } from '@cs/database';

export type Label = InferSelectModel<typeof schema.labels>;
export type LabelRelations = NonNullable<
  Parameters<(typeof db)['query']['labels']['findFirst']>[0]
>['with'];

export type LabelSort = {};
